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
          <a :href="`/LiveEventAsset/audio?eventId=${record.id}`" class="recordings__button" download="">
            <svg-icon name="get_app" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- end .records-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { DateTime } from 'luxon';
import BTile from '~/components/tile/tile.vue';
import BPlayerCompact from '~/components/player-compact/player-compact.vue';
import { GetRecordsQuery } from '~/graphql/schema';
import { AudioStatus, AudioType } from '~/components/audio/audio.vue';

@Component({
  name: 'b-records',
  components: { BPlayerCompact, BTile },
})
export default class Recordings extends Vue {
  get recordings(): GetRecordsQuery['getRecordings'] {
    return this.$accessor.player.recordings || [];
  }

  get playing(): boolean {
    return this.$accessor.player.status === AudioStatus.playing && this.$accessor.player.type === AudioType.recording;
  }

  get index(): number {
    return this.$accessor.player.recordingId;
  }

  formatDate(iso: string): string {
    return DateTime.fromISO(iso).toFormat('dd.MM.yyyy HH:mm');
  }

  play(id: number): void {
    if (this.playing && id === this.index) {
      this.$accessor.player.pause();
    } else {
      this.$accessor.player.setRecordingId(id);
      this.$accessor.player.play({ type: AudioType.recording });
    }
  }
}
</script>

<style lang="stylus" src="./recordings.styl" />
