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
        <span>{{ progressInSeconds | toHHMMSS }}</span>
        /
        <span>{{ duration | toHHMMSS }}</span>
      </div>
      <b-slider :value="progress" :duration="duration" interactive @update:value="setProgress" />
    </div>
  </div>
  <!-- end .player-compact-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import BVolumeSlider from '~/components/volume-slider/volume-slider.vue';
import BSlider from '~/components/slider/slider.vue';
import { AudioStatus, AudioType } from '~/components/audio/audio.vue';
import { toHHMMSS } from '~/tools/filters';

@Component({
  name: 'b-player-compact',
  components: { BSlider, BVolumeSlider },
  filters: { toHHMMSS },
})
export default class PlayerCompact extends Vue {
  get playing(): boolean {
    return this.$accessor.player.type === AudioType.recording && this.$accessor.player.status === AudioStatus.playing;
  }

  get title(): string {
    return this.$accessor.player.recording.desc;
  }

  get date(): string {
    return this.$accessor.player.recording.name.replace('.ogg', '');
  }

  get duration(): number {
    return this.$accessor.player.duration;
  }

  get progressInSeconds(): number {
    return this.$accessor.player.recordingProgress;
  }

  get progress(): number {
    return (1 / this.duration) * this.progressInSeconds;
  }

  get volume(): number {
    return this.$accessor.player.volume;
  }

  get muted(): boolean {
    return this.$accessor.player.muted;
  }

  togglePlay() {
    if (!this.playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.$accessor.player.play({ type: AudioType.recording });
  }

  pause() {
    this.$accessor.player.pause();
  }

  setVolume(volume: number) {
    this.$accessor.player.setVolume(volume);
  }

  toggleMuted() {
    this.$accessor.player.setMuted(!this.muted);
  }

  setProgress(value: number) {
    this.$accessor.player.setProgress(this.duration * value);
  }
}
</script>

<style lang="stylus" src="./player-compact.styl" />
