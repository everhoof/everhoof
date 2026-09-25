type GraphqlError = { message: string; path?: string[]; extensions?: { statusCode?: number; exception?: { response?: { statusCode?: number } } } };

export class GraphqlRequestError extends Error {
  constructor(public errors: GraphqlError[]) {
    super(errors[0]?.message || 'Неизвестная ошибка');
  }
}

export function useGraphql() {
  const endpoint = useRuntimeConfig().public.graphql;
  const token = useCookie<string | null>('apollo-token');
  const locale = useCookie<string>('i18n_redirected', { default: () => 'en' });
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : {};

  return async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const url = new URL(endpoint);
    url.searchParams.set('lang', locale.value);
    const response = await $fetch<{ data?: T; errors?: GraphqlError[] }>(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(headers.cookie ? { cookie: headers.cookie } : {}),
        ...(token.value ? { authorization: `Bearer ${token.value}` } : {}),
      },
      body: { query, variables },
    }).catch(async (error: { statusCode?: number }) => {
      if (error.statusCode === 401 && import.meta.client) await navigateTo('/logout');
      throw error;
    });
    if (response.errors?.length) {
      const unauthorized = response.errors.some((error) =>
        error.extensions?.statusCode === 401 || error.extensions?.exception?.response?.statusCode === 401,
      );
      if (unauthorized && import.meta.client) await navigateTo('/logout');
      throw new GraphqlRequestError(response.errors);
    }
    if (!response.data) throw new Error('GraphQL returned no data');
    return response.data;
  };
}
