<template>
  <!-- begin .player-compact-->
  <div class="player-compact">
    <div class="player-compact__main">
      <button class="player-compact__play-button" @click="togglePlay">
        <svg-icon v-if="playing" name="pause" />
        <svg-icon v-else name="play_arrow" />
      </button>
      <div class="player-compact__meta">
        <div class="player-compact__title">{{ title }}</div>
        <div class="player-compact__description">{{ date }}</div>
      </div>
      <div class="player-compact__volume-slider">
        <b-volume-slider :volume="volume" :muted="muted" @update:volume="setVolume" @update:muted="toggleMuted" />
      </div>
    </div>
    <div class="player-compact__progress-slider">
      <div class="player-compact__progress-time">
        <span>{{ toHHMMSS(progressInSeconds) }}</span>
        /
        <span>{{ toHHMMSS(duration) }}</span>
      </div>
      <b-slider :value="progress" :duration="duration" interactive @update:value="setProgress" />
    </div>
  </div>
  <!-- end .player-compact-->
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import BVolumeSlider from '~/components/volume-slider/volume-slider.vue';
import BSlider from '~/components/slider/slider.vue';
import { AudioStatus, AudioType, usePlayerStore } from '~/stores/player';
import { toHHMMSS } from '~~/tools/filters';
const player = usePlayerStore();
const playing = computed(() => player.type === AudioType.recording && player.status === AudioStatus.playing);
const title = computed(() => player.recording.description);
const date = computed(() => player.recording.beginsAt ? DateTime.fromISO(player.recording.beginsAt).setZone('Europe/Moscow').toFormat('dd.MM.yyyy HH:mm') : '');
const duration = computed(() => player.duration);
const progressInSeconds = computed(() => player.recordingProgress);
const progress = computed(() => duration.value ? progressInSeconds.value / duration.value : 0);
const volume = computed(() => player.volume);
const muted = computed(() => player.muted);
function togglePlay() { if (playing.value) player.pause(); else player.play({ type: AudioType.recording }); }
function setVolume(value: number) { player.setVolume(value); }
function toggleMuted() { player.muted = !player.muted; }
function setProgress(value: number) { player.setProgress(duration.value * value); }
</script>

<style lang="scss" scoped>
.player-compact {
  display: block;
  padding: 8px 0 4px;
  &__main {
    display: flex;
    align-items: center;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__meta {
    flex-grow: 1;
    margin-left: 16px;
  }
  &__title {
    overflow: hidden;
    max-height: 50px;
    color: var(--primary-text);
    font-size: 16px;
    font-weight: bold;
  }
  &__play-button {
    display: block;
    flex-shrink: 0;
    width: 80px;
    max-width: 80px;
    height: 80px;
    max-height: 80px;
    margin: 0;
    padding: 16px;
    color: #eaeaea;
    cursor: pointer;
    background: #2f2e40;
    border: none;
    border-radius: 3px;
    outline: none;
    &:focus {
      outline: none;
    }
    &:hover {
      color: #ffffff;
    }
    & .icon {
      display: block;
      width: 50px;
      height: 50px;
      fill: currentColor;
    }
  }
  &__volume-slider {
    display: none;
    @media screen and (min-width: 480px) {
      display: block;
      min-width: 140px;
    }
  }
  &__progress-slider {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    margin-top: -10px;
  }
  &__progress-time {
    flex-shrink: 1;
    color: var(--primary-text);
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
