import { actionTree, getAccessorType, getterTree, mutationTree } from 'typed-vuex';

import { Context } from '@nuxt/types';
import * as auth from '~/store/auth.ts';
import * as player from '~/store/player.ts';
import * as notifications from '~/store/notifications.ts';

export const state = () => ({
  now: 0 as number,
});

export type RootState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_NOW: (_state, payload: number) => (_state.now = payload),
});

export const getters = getterTree(state, {});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async nuxtServerInit({ commit }, context: Context) {
      await context.app.$accessor.auth.nuxtServerInit(context);
      await context.app.$accessor.player.nuxtServerInit(context);
      commit('SET_NOW', Date.now());
    },

    async nuxtClientInit({ commit }, context) {
      await context.app.$accessor.player.nuxtClientInit(context);
      commit('SET_NOW', Date.now());
      setInterval(() => commit('SET_NOW', Date.now()), 1000);
    },
  },
);

export const accessorType = getAccessorType({
  state,
  actions,
  mutations,
  modules: {
    auth,
    player,
    notifications,
  },
});
