<template>
  <div class="page__wrapper">
    <BAudio />
    <div class="page__header" />
    <div class="page__main">
      <div class="page__content">
        <slot />
      </div>
    </div>
    <div class="page__notifications">
      <b-notification
        v-for="notification in notifications"
        :key="notification.id"
        class="page__notification"
        :notification="notification"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import BAudio from '~/components/audio/audio.vue';
import BNotification from '~/components/notification/notification.vue';
import {
  AudioStatus,
  AudioType,
  usePlayerStore,
} from '~/stores/player';
import { useNotificationsStore } from '~/stores/notifications';

const player = usePlayerStore();
const notificationsStore = useNotificationsStore();
const notifications = computed(() => notificationsStore.notifications);
const artwork = computed(() => (player.artwork.includes('generic_song') ? '' : player.artwork));
const audioSource = ref<string | null>(null);
const audioType = ref<AudioType>(AudioType.none);
useSeoMeta({
  title: () => player.station.name || 'Radio', description: () => player.station.description || '',
});
watch(() => [player.status, player.source, player.type] as const, ([status]) => {
  if (!('mediaSession' in navigator)) return;
  if (status === AudioStatus.playing || status === AudioStatus.paused) {
    navigator.mediaSession.playbackState = status;
    if (player.source) audioSource.value = player.source;
    if (player.type !== AudioType.none) audioType.value = player.type;
    updateMetadata();
    updatePosition();
  } else navigator.mediaSession.playbackState = 'paused';
});
watch(() => [player.track.title, player.recording.description, player.type], updateMetadata);
watch(() => [player.progress, player.recordingProgress], updatePosition);
function updateMetadata() {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = player.type === AudioType.stream
    ? new MediaMetadata({
        title: player.track.title,
        artist: player.track.artist,
        artwork: artwork.value
          ? [{
              src: artwork.value,
            }]
          : [],
      })
    : new MediaMetadata({
        title: player.recording.description,
      });
}
function updatePosition() {
  if (!navigator.mediaSession?.setPositionState
    || ![AudioStatus.playing, AudioStatus.paused].includes(player.status)) return;
  const duration = player.type === AudioType.stream ? player.track.duration : player.duration;
  const position = player.type === AudioType.stream ? player.progress * duration : player.recordingProgress;
  if (Number.isFinite(duration) && duration > 0) navigator.mediaSession.setPositionState({
    duration, position: Math.min(duration, Math.max(0, position)), playbackRate: 1,
  });
}
function destroyMediaSession() {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.playbackState = 'none';
  navigator.mediaSession.metadata = null;
  for (const action of ['play', 'pause', 'stop'] as MediaSessionAction[]) navigator.mediaSession.setActionHandler(action, null);
}
onMounted(() => {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.setActionHandler('play', () => player.play({
    source: audioSource.value ?? undefined, type: audioType.value,
  }));
  navigator.mediaSession.setActionHandler('pause', () => (player.type === AudioType.stream ? player.stop() : player.pause()));
  navigator.mediaSession.setActionHandler('stop', () => {
    player.stop();
    destroyMediaSession();
  });
});
onUnmounted(destroyMediaSession);
</script>
<style lang="scss" scoped>
.page {
  &__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 99;
  }

  &__main {
    overflow: hidden;
    flex-grow: 1;
    height: calc(100vh - (72px + 16px));

    &::after {
      content: '';
      display: table;
      clear: both;
    }
  }

  &__content {
    overflow: hidden auto;
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding: 16px 8px 0;
  }

  &__notifications {
    position: absolute;
    top: 24px;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__notification {
    max-width: 600px;
    margin: 0 0 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
