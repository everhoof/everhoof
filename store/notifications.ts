import { actionTree, getterTree, mutationTree } from 'typed-vuex';
import { Notification } from '~/types/Notification';

export const namespaced = true;

export const state = () => ({
  notifications: [] as Notification[],
});

export type NotificationsState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  ADD_NOTIFICATION: (_state, payload: { message: string; timeout: number }) => {
    const id = Date.now();
    _state.notifications.push({
      id,
      message: payload.message,
      timeout: payload.timeout,
    });
    window.setTimeout(() => {
      const index = _state.notifications.findIndex((n) => n.id === id);
      if (index === -1) return;
      _state.notifications.splice(index, 1);
    }, payload.timeout);
  },
  REMOVE_NOTIFICATION: (_state, payload: number) => {
    const index = _state.notifications.findIndex((n) => n.id === payload);
    if (index === -1) return;
    _state.notifications.splice(index, 1);
  },
});

export const getters = getterTree(state, {});

export const actions = actionTree({ state, mutations, getters }, {});
