export default defineNuxtRouteMiddleware((to) => {
  const loggedIn = Boolean(useCookie('apollo-token').value);
  if (to.name === 'login' && loggedIn) return navigateTo('/');
  if (!['main', 'recordings'].includes(String(to.name)) && !loggedIn && to.path !== '/') return navigateTo('/');
});
