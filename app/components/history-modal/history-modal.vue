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

<style lang="stylus" src="./history-modal.styl" />
