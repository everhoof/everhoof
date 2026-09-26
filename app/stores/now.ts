export const useNowStore = defineStore('now', () => {
  const now = ref(0);
  let timer: ReturnType<typeof setInterval> | undefined;
  function start() {
    if (timer) return;
    now.value = Date.now();
    timer = setInterval(() => {
      now.value = Date.now();
    }, 1000);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = undefined;
  }
  return {
    now, start, stop,
  };
});
