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

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import BButton from '~/components/button/button.vue';
import BSlider from '~/components/slider/slider.vue';
import BVolumeSlider from '~/components/volume-slider/volume-slider.vue';
import BSelect from '~/components/select/select.vue';
import { CurrentPlaying, CurrentPlayingTrack, GetGeneralDataQuery } from '~/graphql/schema';
import { AudioStatus, AudioType } from '~/components/audio/audio.vue';

@Component({
  name: 'b-player',
  components: { BSelect, BVolumeSlider, BSlider, BButton },
})
export default class Player extends Vue {
  get station(): GetGeneralDataQuery['getStation'] {
    return this.$accessor.player.station;
  }

  get playing(): boolean {
    return this.$accessor.player.status === AudioStatus.playing && this.$accessor.player.type === AudioType.stream;
  }

  get title(): string {
    if (!this.track.title || !this.track.artist) {
      return this.name.title;
    }
    return this.track.title;
  }

  get artist(): string {
    if (!this.track.title || !this.track.artist) {
      return this.name.artist;
    }
    return this.track.artist;
  }

  get name(): { title: string; artist: string } {
    const array = this.track.name.split(' - ');
    if (array.length < 2) return { title: 'Unknown', artist: 'Unknown' };
    const artist = array.splice(0, 1).join(' - ');
    const title = array.join(' - ');
    return { title, artist };
  }

  get streamId(): number {
    return this.$accessor.player.streamId;
  }

  get streamOrderId(): number {
    const index = this.station.mounts.findIndex(
      // eslint-disable-next-line eqeqeq
      ({ id }) => this.streamId == id,
    );
    return index === -1 ? 0 : index;
  }

  get stream(): string {
    return (this.station.mounts[this.streamOrderId]?.url || '').replace(/^(https:|http:)/, '');
  }

  get playingData(): CurrentPlaying {
    return this.$accessor.player.playingData;
  }

  get track(): CurrentPlayingTrack {
    return this.$accessor.player.track;
  }

  get artwork(): string {
    if (!this.$accessor.player.artwork.includes('generic_song')) {
      return this.$accessor.player.artwork;
    }
    return '';
  }

  get progress(): number {
    return this.$accessor.player.progress;
  }

  get volume(): number {
    return this.$accessor.player.volume;
  }

  get muted(): boolean {
    return this.$accessor.player.muted;
  }

  get listenersCount(): number {
    return this.playingData.listenersCount;
  }

  get isLiveStream(): boolean {
    return this.$accessor.player.playingData.live.isLive;
  }

  mounted(): void {}

  togglePlay() {
    if (!this.playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.$accessor.player.play({ source: `${this.stream}?t=${Date.now()}`, type: AudioType.stream });
  }

  pause() {
    this.$accessor.player.stop();
  }

  selectStream(id: number) {
    this.$accessor.player.SET_STREAM_ID(this.station.mounts[id].id);
    this.play();
  }

  setVolume(volume: number) {
    this.$accessor.player.setVolume(volume);
  }

  toggleMuted() {
    this.$accessor.player.setMuted(!this.muted);
  }
}
</script>

<style lang="stylus" src="./player.styl" />
