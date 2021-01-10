import { Context } from '@nuxt/types';

export default function ({ app, route, redirect }: Context) {
  const blockedForLoggedIn: string[] = ['login'];
  const unblockedForLoggedOut: string[] = ['main', 'recordings.vue'];
  if (blockedForLoggedIn.includes(route.name || '') && app.$accessor.auth.loggedIn && app.router) {
    redirect(302, '/');
  } else if (!unblockedForLoggedOut.includes(route.name || '') && !app.$accessor.auth.loggedIn && app.router) {
    redirect(302, '/');
  }
}
