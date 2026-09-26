import type { Notification } from '~~/types/Notification';

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  const timers = new Map<number, ReturnType<typeof setTimeout>>();
  let nextId = 0;
  function remove(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
    clearTimeout(timers.get(id));
    timers.delete(id);
  }
  function add(message: string, timeout = 4000) {
    const id = ++nextId;
    notifications.value.push({ id, message, timeout });
    if (import.meta.client) timers.set(id, setTimeout(() => remove(id), timeout));
  }
  function dispose() {
    timers.forEach(clearTimeout);
    timers.clear();
  }
  return {
    notifications, add, remove, dispose,
  };
});
