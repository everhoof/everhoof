<template>
  <!-- begin .player-->
  <div class="player">
    <div class="player__header">
      <h1 class="player__title">{{ station.name }}</h1>
      <span v-show="false" class="player__listeners-counter">
        <svg-icon class="player__icon" name="people_alt" />
        {{ listenersCount }}
      </span>
      <a :href="station.playlists.m3u" class="player__download-playlist">
        <svg-icon class="player__icon" name="m3u" />
      </a>
    </div>
    <div class="player__main">
      <button
        class="player__play-button"
        :style="artwork ? `background-image: url(${artwork})` : undefined"
        @click="togglePlay"
      >
        <svg-icon v-if="playing" name="pause" />
        <svg-icon v-else name="play_arrow" />
      </button>
      <div class="player__meta">
        <div class="player__meta-text">
          <div class="player__meta-title">{{ title }}</div>
          <div class="player__meta-artist">
            {{ artist }}
          </div>
        </div>
        <div class="player__progress">
          <b-slider :value="progress" :duration="track.duration" :empty-time="isLiveStream" with-time />
        </div>
      </div>
    </div>
    <div class="player__controls">
      <div class="player__control player__quality-selector">
        <b-select :items="station.mounts.map((mount) => mount.name)" :value="streamOrderId" @input="selectStream" />
      </div>
      <div class="player__control player__volume-slider">
        <b-volume-slider :volume="volume" :muted="muted" @update:volume="setVolume" @update:muted="toggleMuted" />
      </div>
    </div>
  </div>
  <!-- end .player-->
</template>

<script setup lang="ts">
import BSlider from '~/components/slider/slider.vue';
import BVolumeSlider from '~/components/volume-slider/volume-slider.vue';
import BSelect from '~/components/select/select.vue';
import { AudioStatus, AudioType, usePlayerStore } from '~/stores/player';
const player = usePlayerStore();
const station = computed(() => player.station);
const playing = computed(() => player.status === AudioStatus.playing && player.type === AudioType.stream);
const track = computed(() => player.track);
const name = computed(() => {
  const parts = track.value.name.split(' - ');
  return parts.length < 2 ? { title: 'Unknown', artist: 'Unknown' } : { artist: parts.shift() || '', title: parts.join(' - ') };
});
const title = computed(() => track.value.title && track.value.artist ? track.value.title : name.value.title);
const artist = computed(() => track.value.title && track.value.artist ? track.value.artist : name.value.artist);
const streamOrderId = computed(() => Math.max(0, station.value.mounts.findIndex(({ id }) => Number(id) === player.streamId)));
const stream = computed(() => (station.value.mounts[streamOrderId.value]?.url || '').replace(/^(https:|http:)/, ''));
const artwork = computed(() => player.artwork.includes('generic_song') ? '' : player.artwork);
const progress = computed(() => player.progress);
const volume = computed(() => player.volume);
const muted = computed(() => player.muted);
const listenersCount = computed(() => player.playingData.listenersCount);
const isLiveStream = computed(() => player.liveData.isLive);
function play() { player.play({ source: `${stream.value}?t=${Date.now()}`, type: AudioType.stream }); }
function togglePlay() { if (playing.value) player.stop(); else play(); }
function selectStream(id: number) { const mount = station.value.mounts[id]; if (mount) { player.setStreamId(mount.id); play(); } }
function setVolume(value: number) { player.setVolume(value); }
function toggleMuted() { player.muted = !player.muted; }
</script>

<style lang="stylus" src="./player.styl" />
