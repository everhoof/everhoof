export default defineNuxtRouteMiddleware((to) => {
  const isLoggedIn = Boolean(useCookie('apollo-token').value);
  if (isLoggedIn && to.name === 'login') return navigateTo('/');
  if (!isLoggedIn && to.path !== '/' && !['main', 'recordings'].includes(String(to.name))) return navigateTo('/');
});
