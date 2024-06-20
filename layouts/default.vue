<template>
  <div class="page__wrapper">
    <b-audio ref="audio" />
    <div class="page__header" />
    <div class="page__main">
      <div class="page__content">
        <nuxt />
      </div>
    </div>
    <div class="page__notifications">
      <b-notification
        v-for="notification in notifications"
        :key="notification.id"
        class="page__notification"
        :notification="notification"
      />
    </div>
  </div>
</template>
<script lang="ts">
import '~/assets/stylus/normalize.styl';
import '~/assets/stylus/grid.styl';
import '~/assets/stylus/global.styl';
import '~/assets/stylus/colors.styl';
import { Component, ProvideReactive, Vue, Watch } from 'nuxt-property-decorator';
import BPlayer from '~/components/player/player.vue';
import BNotification from '~/components/notification/notification.vue';
import { Notification } from '~/types/Notification';
import BAudio, { AudioStatus, AudioType } from '~/components/audio/audio.vue';

@Component({
  head() {
    return {
      title: this.$accessor.player.station.name || 'Radio',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$accessor.player.station.description || '',
        },
      ],
    };
  },
  components: { BAudio, BNotification, BPlayer },
})
export default class Default extends Vue {
  @ProvideReactive('audio') audio?: BAudio;

  private audioSource: string | null = null;
  private audioType: AudioType | null = null;

  @Watch('$accessor.player.status')
  onPlayingChanged() {
    if (navigator.mediaSession) {
      if (this.$accessor.player.status === AudioStatus.playing || this.$accessor.player.status === AudioStatus.paused) {
        navigator.mediaSession.playbackState = this.$accessor.player.status;
        this.onMetadataChanged();
        this.onProgressChanged();
        if (this.$accessor.player.source) {
          this.audioSource = this.$accessor.player.source;
        }
        if (this.$accessor.player.type !== AudioType.none) {
          this.audioType = this.$accessor.player.type;
        }
      } else {
        navigator.mediaSession.playbackState = 'paused';
      }
    }
  }

  @Watch('$accessor.player.track.title')
  onMetadataChanged() {
    if (navigator.mediaSession) {
      if (this.$accessor.player.type === AudioType.stream) {
        // eslint-disable-next-line no-undef
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.$accessor.player.track.title,
          artist: this.$accessor.player.track.artist,
          artwork: [
            {
              src: this.artwork,
              type: 'image/png',
            },
          ],
        });
      } else {
        // eslint-disable-next-line no-undef
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.$accessor.player.recording.description,
        });
      }
    }
  }

  @Watch('$accessor.player.progress')
  @Watch('$accessor.player.recordingProgress')
  onProgressChanged() {
    if (
      (this.$accessor.player.status === AudioStatus.playing || this.$accessor.player.status === AudioStatus.paused) &&
      navigator?.mediaSession?.setPositionState
    ) {
      if (this.$accessor.player.type === AudioType.stream) {
        navigator.mediaSession.setPositionState({
          duration: this.$accessor.player.track.duration,
          position: Math.min(
            this.$accessor.player.progress * this.$accessor.player.track.duration,
            this.$accessor.player.track.duration,
          ),
          playbackRate: 1,
        });
      } else if (this.$accessor.player.type === AudioType.recording) {
        navigator.mediaSession.setPositionState({
          duration: this.$accessor.player.duration,
          position: this.$accessor.player.recordingProgress,
          playbackRate: 1,
        });
      }
    }
  }

  get artwork(): string {
    if (!this.$accessor.player.artwork.includes('generic_song')) {
      return this.$accessor.player.artwork;
    }
    return '';
  }

  get notifications(): Notification[] {
    return this.$accessor.notifications.notifications;
  }

  mounted() {
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('play', () =>
        this.$accessor.player.play({ source: this.audioSource ?? undefined, type: this.audioType ?? undefined }),
      );
      navigator.mediaSession.setActionHandler('pause', () => {
        if (this.$accessor.player.type === AudioType.stream) {
          this.$accessor.player.stop();
        } else {
          this.$accessor.player.pause();
        }
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        this.$accessor.player.stop();
        this.destroyMediaSession();
      });
    }
    this.audio = this.$refs.audio as BAudio;
  }

  destroyMediaSession() {
    if (navigator.mediaSession) {
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
    }
  }

  beforeDestroy() {
    this.destroyMediaSession();
  }
}
</script>
<style lang="stylus" src="./default.styl" />
