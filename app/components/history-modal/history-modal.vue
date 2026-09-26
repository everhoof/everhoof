<template>
  <!-- begin .history-modal-->
  <div class="history-modal">
    <ul class="history-modal__list">
      <li v-for="(track, i) in tracks" :key="i" class="history-modal__item" :title="`${track.track.text}`">
        {{ i + 1 }}. {{ track.track.text }}
      </li>
    </ul>
  </div>
  <!-- end .history-modal-->
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores/player';
const player = usePlayerStore();
const tracks = computed(() => player.tracksHistory);
</script>

<style lang="scss" scoped>
.history-modal {
  display: block;
  max-width: 400px;

  &__list {
    margin: 0;
    padding: 0;
  }

  &__item {
    overflow: hidden;
    padding: 4px;
    color: var(--secondary-text);
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
