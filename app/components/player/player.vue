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

<style lang="scss" scoped>
.player {
  display: block;
  width: 100%;

  &__icon.icon {
    display: block;
    width: 24px;
    max-width: 24px;
    height: 24px;
    max-height: 24px;
  }

  &__header {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 0 8px;
    border-bottom: 1px solid rgb(255, 255, 255, .07);
  }

  &__title {
    overflow: hidden;
    flex-grow: 1;
    flex-shrink: 1;
    margin: 0 12px 0 0;
    color: var(--primary-text);
    font-size: 19px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:last-child {
      margin-right: 0;
    }
  }

  &__listeners-counter {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    align-items: center;
    margin-right: 12px;
    color: var(--primary-light);
    font-size: 16px;
    font-weight: 600;

    &:last-child {
      margin-right: 0;
    }

    & .icon {
      margin-right: 6px;
      fill: currentColor;
    }
  }

  &__download-playlist {
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 12px;
    color: var(--secondary-text);
    font-size: 16px;
    font-weight: 600;

    &:hover {
      color: var(--primary);
    }

    &:last-child {
      margin-right: 0;
    }

    & .icon {
      fill: currentColor;
    }
  }

  &__main {
    display: flex;
    width: 100%;
    margin-top: 8px;

    &_artwork_disabled {
      & .player__meta-artwork {
        display: none;
      }

      & .player__progress {
        margin-left: 0;
      }
    }
  }

  &__meta-artwork {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    margin-right: 12px;
    background-image: url('/img/player/disc.svg');
    background-size: cover;
    object-fit: cover;
    border-radius: 3px;

    @media screen and (width >= 400px) {
      width: 81px;
      height: 81px;
    }
  }

  &__meta {
    display: flex;
    overflow: hidden;
    flex-grow: 1;
    flex-direction: column;
    margin-left: 16px;

    &:hover {
      & .player__meta-title,
      & .player__meta-artist {
        white-space: inherit;
      }
    }

    @media screen and (width <= 550px) {
      & .player__meta-title,
      & .player__meta-artist {
        white-space: inherit;
      }
    }
  }

  &__meta-text {
    flex-grow: 1;
    margin: 0 0 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__meta-title {
    overflow: hidden;
    color: var(--primary-text);
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__meta-artist {
    overflow: hidden;
    margin: 0 0 12px;
    color: var(--secondary-text);
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:last-child {
      margin-bottom: 0;
    }

    &_live {
      color: #ef5350;
    }
  }

  &__progress {
    margin: 0;
    padding: 0 0 8px;
    border-bottom: 1px solid rgb(255, 255, 255, .07);
  }

  &__controls {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 0 0;
  }

  &__control {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__play-button {
    position: relative;
    display: block;
    flex-shrink: 0;
    width: 82px;
    max-width: 82px;
    height: 82px;
    max-height: 82px;
    margin: 0;
    padding: 16px;
    color: #eaeaea;
    cursor: pointer;
    background: #2f2e40;
    background-size: cover;
    border: none;
    border-radius: 3px;
    outline: none;

    &:focus {
      outline: none;
    }

    &:hover {
      color: #ffffff;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      display: block;
      background: #2f2e40;
      opacity: .7;
    }

    & .icon {
      position: relative;
      z-index: 2;
      display: block;
      width: 50px;
      height: 50px;
      fill: currentColor;
    }
  }

  &__volume-slider {
    display: none;
    flex-grow: 1;

    @media screen and (width >= 400px) {
      display: block;
    }
  }
}
</style>
