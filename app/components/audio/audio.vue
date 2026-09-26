<template>
  <!-- begin .audio-->
  <audio ref="audio" hidden="hidden" src="/silence.mp3"/>
  <!-- end .audio-->
</template>

<script setup lang="ts">
import { AudioStatus, AudioType, usePlayerStore } from '~/stores/player';
const player = usePlayerStore();
const audio = ref<HTMLAudioElement | null>(null);
let errorTimeout: ReturnType<typeof setTimeout> | undefined;
let errorsCount = 0;
const muted = computed(() => player.muted);
const volume = computed(() => player.volume);
const status = computed(() => player.status);
const source = computed(() => player.source);
const type = computed(() => player.type);
function logarithmicVolume(value: number) { const result = Math.min(Math.exp(value * 6.908) / 1000, 1); return result <= 0.001 ? 0 : result >= 0.99 ? 1 : result; }
function inverseLogarithmicVolume(value: number) { return value <= 0 ? 0 : Math.log(value * 1000) / 6.908; }
watch(muted, (value) => { if (audio.value) audio.value.muted = value; });
watch(volume, (value) => { if (audio.value) audio.value.volume = logarithmicVolume(value); });
watch(() => [player.status, player.source, player.type] as const, async ([value]) => {
  if (value === AudioStatus.stopped) stop();
  else if (value === AudioStatus.paused) pause();
  else await play();
});
watch(() => player.updateRecordingProgress, async (value) => {
  if (!audio.value || value < 0) return;
  audio.value.currentTime = value;
  player.updateRecordingProgress = -1;
  if (status.value === AudioStatus.playing) await audio.value.play().catch(onError);
});
async function play() {
  const element = audio.value;
  if (!element) return;
  if (!source.value) { stop(); return; }
  const progress = player.recordingProgress;
  if (new URL(element.src).pathname + new URL(element.src).search !== source.value) { element.src = source.value; element.load(); }
  if (type.value === AudioType.recording) element.currentTime = progress;
  await element.play().catch(onError);
}
function pause() { stopReconnecting(); if (audio.value && !audio.value.paused) audio.value.pause(); }
function stop() { pause(); if (audio.value) { audio.value.src = '/silence.mp3'; audio.value.load(); } }
function stopReconnecting() { errorsCount = 0; clearTimeout(errorTimeout); }
function onError() {
  if (!audio.value || status.value !== AudioStatus.playing || errorsCount > 100) return;
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(async () => {
    errorsCount++;
    try { audio.value?.load(); await audio.value?.play(); stopReconnecting(); } catch { onError(); }
  }, errorsCount < 2 ? 1000 : errorsCount > 11 ? 10000 : 5000);
}
function onEnded() { if (type.value === AudioType.stream) onError(); else player.stop(); }
function onVolumeChange() { if (audio.value) player.setVolume(inverseLogarithmicVolume(audio.value.volume)); }
function onPause() { if (player.status === AudioStatus.playing) player.pause(); }
function onPlay() { if (player.status !== AudioStatus.playing) player.play(); }
function onDurationChange() { if (type.value === AudioType.recording && audio.value) player.duration = audio.value.duration; }
function onTimeUpdate() { if (type.value === AudioType.recording && audio.value) player.recordingProgress = audio.value.currentTime; }
onMounted(() => {
  const element = audio.value;
  if (!element) return;
  element.muted = muted.value;
  element.volume = logarithmicVolume(volume.value);
  element.addEventListener('error', onError);
  element.addEventListener('ended', onEnded);
  element.addEventListener('volumechange', onVolumeChange);
  element.addEventListener('pause', onPause);
  element.addEventListener('play', onPlay);
  element.addEventListener('durationchange', onDurationChange);
  element.addEventListener('timeupdate', onTimeUpdate);
});
onUnmounted(() => {
  stopReconnecting();
  const element = audio.value;
  element?.removeEventListener('error', onError);
  element?.removeEventListener('ended', onEnded);
  element?.removeEventListener('volumechange', onVolumeChange);
  element?.removeEventListener('pause', onPause);
  element?.removeEventListener('play', onPlay);
  element?.removeEventListener('durationchange', onDurationChange);
  element?.removeEventListener('timeupdate', onTimeUpdate);
});
</script>

<style lang="scss" scoped>
.audio {
  display: block;
}
</style>
