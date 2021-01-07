<template>
  <!-- begin .audio-->
  <audio ref="audio" hidden="hidden" src="/silence.mp3"></audio>
  <!-- end .audio-->
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from 'nuxt-property-decorator';

export enum AudioStatus {
  playing,
  paused,
  stopped,
}

export enum AudioType {
  none,
  stream,
  record,
}

@Component({
  name: 'b-audio',
})
export default class Audio extends Vue {
  @Ref() private readonly audio!: HTMLAudioElement;

  @Watch('muted')
  private onMutedChange() {
    this.audio.muted = this.muted;
  }

  @Watch('volume')
  private onVolumeChange() {
    this.audio.volume = Audio.getLogarithmicVolume(this.volume);
  }

  @Watch('status')
  private async onStatusChange() {
    switch (this.status) {
      case AudioStatus.stopped:
        this.stop();
        break;
      case AudioStatus.playing:
        await this.play();
        break;
      case AudioStatus.paused:
        this.pause();
        break;
    }
  }

  private get source(): string | null {
    return this.$accessor.player.source;
  }

  private get status(): AudioStatus {
    return this.$accessor.player.status;
  }

  private get muted(): boolean {
    return this.$accessor.player.muted;
  }

  private get volume(): number {
    return this.$accessor.player.volume;
  }

  mounted(): void {
    this.initialize();
    this.registerEvents();
  }

  private initialize(): void {
    this.audio.muted = this.muted;
    this.audio.volume = Audio.getLogarithmicVolume(this.volume);
  }

  private registerEvents(): void {
    this.audio.addEventListener('volumechange', () => {
      const volume = Audio.getInverseLogarithmicVolume(this.audio.volume);
      this.$accessor.player.SET_VOLUME(volume);
    });
    this.audio.addEventListener('pause', () => {
      if (this.$accessor.player.status === AudioStatus.playing) {
        this.$accessor.player.pause();
      }
    });
    this.audio.addEventListener('play', () => {
      if (this.$accessor.player.status !== AudioStatus.playing) {
        this.$accessor.player.play();
      }
    });
  }

  private async play(): Promise<void> {
    if (this.source && this.source !== this.audio.src) {
      this.audio.src = this.source;
      this.audio.load();
      await this.audio.play();
    } else {
      this.stop();
    }
  }

  private pause(): void {
    if (!this.audio.paused) {
      this.audio.pause();
    }
  }

  private stop(): void {
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.audio.src = '/silence.mp3';
    this.audio.load();
  }

  public static getLogarithmicVolume(volume: number): number {
    const v = Math.min(Math.exp(volume * 6.908) / 1000, 1);
    return v <= 0.001 ? 0 : v >= 0.99 ? 1 : v;
  }

  public static getInverseLogarithmicVolume(volume: number) {
    return Math.log(volume * 1000) / 6.908;
  }
}
</script>

<style lang="stylus" src="./audio.styl" />
