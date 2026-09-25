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
            :href="`/LiveEventAsset/audio?eventId=${record.id}`"
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

<style lang="stylus" src="./recordings.styl" />
