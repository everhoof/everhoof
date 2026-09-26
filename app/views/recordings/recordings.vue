<template>
  <!-- begin .records-->
  <div class="recordings">
    <div class="recordings__player">
      <router-link :to="{ name: 'main' }" class="recordings__back">
        <svg-icon name="chevron_left" />
      </router-link>
      <b-tile class="tile_padding_medium tile_borders_all recordings__row">
        <b-player-compact />
      </b-tile>
      <div class="recordings__list">
        <div v-for="(record, i) in recordings" :key="i" class="recordings__item">
          <button class="recordings__button" @click="play(i)">
            <svg-icon v-if="playing && index === i" name="pause" />
            <svg-icon v-else name="play_arrow" />
          </button>
          <div class="recordings__meta">
            <div class="recordings__title">{{ record.description }}</div>
            <div class="recordings__description">{{ formatDate(record.beginsAt) }}</div>
          </div>
          <div class="recordings__size">{{ record.fileSize }} MB</div>
          <a
            :href="player.recordingAudioUrl(record.id)"
            class="recordings__button"
            :download="`${record.description}.ogg`"
          >
            <svg-icon name="get_app" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- end .records-->
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import BTile from '~/components/tile/tile.vue';
import BPlayerCompact from '~/components/player-compact/player-compact.vue';
import { AudioStatus, AudioType, usePlayerStore } from '~/stores/player';
defineOptions({ name: 'RecordingsPage' });
const player = usePlayerStore();
const recordings = computed(() => player.recordings);
const playing = computed(() => player.status === AudioStatus.playing && player.type === AudioType.recording);
const index = computed(() => player.recordingId);
function formatDate(iso: string) { return DateTime.fromISO(iso).setZone('Europe/Moscow').toFormat('dd.MM.yyyy HH:mm'); }
function play(id: number) {
  if (playing.value && id === index.value) player.pause();
  else { player.setRecordingId(id); player.play({ type: AudioType.recording }); }
}
</script>

<style lang="scss" scoped>
.recordings {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &__back {
    position: fixed;
    top: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: 0 0 4px;
    color: var(--primary-text);
    font-size: 14px;
    text-decoration: none;
    background: #2f2e40;
    border-radius: 4px;
    outline: none;
    box-shadow: 0 0 5px rgb(0, 0, 0, .3);

    &:hover {
      color: var(--primary-light);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  }

  &__row {
    margin: 0 0 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__player {
    overflow: hidden;
    width: 650px;
    max-width: 650px;
  }

  &__button {
    display: inline-block;
    flex-shrink: 0;
    width: 52px;
    max-width: 52px;
    height: 52px;
    max-height: 52px;
    margin: 0;
    padding: 10px;
    color: var(--secondary-text);
    cursor: pointer;
    background: transparent;
    background: var(--primary-background);
    border: none;
    outline: none;

    &:hover {
      & .icon {
        fill: var(--primary);
      }
    }

    & .icon {
      fill: currentColor;
    }
  }

  &__list {
    overflow-y: auto;
    max-height: calc(90vh - 150px);
    scrollbar-color: rgb(255, 255, 255, .2) rgb(255, 255, 255, .1);
    scrollbar-width: thin;

    @media screen and (width >= 768px) {
      max-height: calc(80vh - 150px);
    }

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: rgb(255, 255, 255, .1);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(255, 255, 255, .2);
    }
  }

  &__item {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 52px;
    max-height: 52px;
    margin: 0 0 4px;

    & > * {
      margin: 0 0 0 4px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 4px;

        @media (hover: none) and (pointer: coarse) {
          margin-right: 0;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__meta {
    overflow: hidden;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 4px 12px;
    background: var(--primary-background);
  }

  &__title {
    overflow: hidden;
    font-size: 15px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__description {
    color: var(--secondary-text);
    font-size: 14px;
  }

  &__size {
    flex-shrink: 0;
    width: 80px;
    padding: 4px 12px;
    font-weight: bold;
    line-height: 48px;
    text-align: center;
    white-space: nowrap;
    background: var(--primary-background);
  }
}
</style>
