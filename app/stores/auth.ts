import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const userId = ref<number | null>(null);
  const loggedIn = ref(false);
  function initialize() {
    const id = useCookie<string | null>('user_id');
    const token = useCookie<string | null>('apollo-token');
    userId.value = id.value ? Math.trunc(Number(id.value)) || null : null;
    loggedIn.value = Boolean(token.value);
  }
  return { userId, loggedIn, initialize };
});
