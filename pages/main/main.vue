<template>
  <div class="main">
    <div class="main__player">
      <b-tile v-if="event" class="tile_padding_small tile_borders_top main__row">
        <a v-if="isLive" href="#" class="main__announcement">
          <span>{{ $t('announcement.live') }}</span>
          – {{ summary }}
        </a>
        <a v-else href="#" class="main__announcement">
          <span>{{ date }}</span> {{ $t('announcement.at') }} <span>{{ time }}</span>
          <i v-if="lessThan10Hours"> ({{ $t('announcement.in') }} {{ remainingTime | toRemainingTime }}) </i>
          – {{ summary }}
        </a>
      </b-tile>
      <b-tile class="tile_padding_medium main__row" :class="[{ tile_borders_top: !event }]">
        <b-player />
      </b-tile>
      <b-tile class="tile_padding_small tile_borders_bottom main__row">
        <b-player-buttons />
      </b-tile>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { DateTime } from 'luxon';
import BPlayer from '~/components/player/player.vue';
import BTile from '~/components/tile/tile.vue';
import BPlayerButtons from '~/components/player-buttons/player-buttons.vue';
import { CalendarEvent } from '~/graphql/schema';
import { toRemainingTime } from '~/tools/filters';
import BChat from '~/components/chat/chat.vue';
import BPlayerCompact from '~/components/player-compact/player-compact.vue';

@Component({
  components: { BPlayerCompact, BChat, BPlayerButtons, BTile, BPlayer },
  filters: { toRemainingTime },
})
export default class MainPage extends Vue {
  get events(): CalendarEvent[] {
    return this.$accessor.player.calendarEventsState || [];
  }

  get event(): CalendarEvent | null {
    if (!this.isLive) {
      return this.events.find((e) => e.endsAt >= Date.now()) || null;
    }
    const index = this.events.reverse().reduce<number>((acc, event, i) => {
      if (Date.now() - event.endsAt < 4 * 60 * 60 * 1000) {
        if (acc === -1) {
          return i;
        } else if (Date.now() >= event.startsAt) {
          return i;
        }
      }
      return acc;
    }, -1);
    return this.events[index];
  }

  get lessThan10Hours(): boolean {
    return this.remainingTime < 10 * 60 * 60 && this.remainingTime !== 0;
  }

  get date(): string {
    return DateTime.fromMillis(this.event?.startsAt || 0).toFormat('dd.MM.yyyy');
  }

  get time(): string {
    return DateTime.fromMillis(this.event?.startsAt || 0).toFormat('HH:mm');
  }

  get remainingTime(): number {
    let time = (this.event?.startsAt || 0) - this.$accessor.now;
    if (time < 0) time = 0;
    return time / 1000;
  }

  get isLive() {
    return this.$accessor.player.playingData.live.isLive;
  }

  get summary(): string {
    return this.event?.summary || '';
  }
}
</script>

<style lang="stylus" src="./main.styl"></style>
