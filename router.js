import Vue from 'vue';
import Router from 'vue-router';

import MainPage from '~/pages/main/main.vue';
import RecordingsPage from '~/pages/recordings/recordings.vue';
import Login from '~/pages/login/login.vue';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'main',
        component: MainPage,
      },
      {
        path: '/recordings',
        name: 'recordings',
        component: RecordingsPage,
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
      },
      {
        path: '*',
        redirect: '/',
      },
    ],
  });
}
