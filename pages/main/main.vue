<template>
  <div class="main">
    <div class="main__player">
      <b-tile
        v-for="event of filteredEvents"
        :key="event.startsAt"
        class="tile_padding_small tile_borders_top main__row"
      >
        <a v-if="isLive && liveEvent && event.startsAt === liveEvent.startsAt" href="#" class="main__announcement">
          <span>{{ $t('announcement.live') }}</span>
          – {{ event.summary }}
        </a>
        <a v-else href="#" class="main__announcement">
          <span>{{ event.startsAt | toFormattedDate }}</span> {{ $t('announcement.at') }}
          <span>{{ event.startsAt | toFormattedTime }}</span>
          <i v-if="lessThan10Hours(event.startsAt)">
            ({{ $t('announcement.in') }} {{ remainingTime(event.startsAt) | toRemainingTime }})
          </i>
          – {{ event.summary }}
        </a>
      </b-tile>
      <b-tile class="tile_padding_medium main__row" :class="[{ tile_borders_top: isLive }]">
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
  filters: {
    toRemainingTime,
    toFormattedDate(timestamp: number): string {
      return DateTime.fromMillis(timestamp).toFormat('dd.MM.yyyy');
    },
    toFormattedTime(timestamp: number): string {
      return DateTime.fromMillis(timestamp).toFormat('HH:mm');
    },
  },
})
export default class MainPage extends Vue {
  get events(): CalendarEvent[] {
    return this.$accessor.player.calendarEventsState || [];
  }

  get filteredEvents(): CalendarEvent[] {
    return this.events
      .filter((event) => event.endsAt >= this.$accessor.now || event.startsAt === this.liveEvent?.startsAt)
      .sort((a, b) => a.startsAt - b.startsAt);
  }
  get liveEvent(): CalendarEvent | null {
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

  get isLive() {
    return this.$accessor.player.playingData.live.isLive;
  }

  lessThan10Hours(timestamp: number): boolean {
    return this.remainingTime(timestamp) < 10 * 60 * 60 && this.remainingTime(timestamp) !== 0;
  }

  remainingTime(timestamp: number): number {
    let time = timestamp - this.$accessor.now;
    if (time < 0) time = 0;
    return time / 1000;
  }
}
</script>

<style lang="stylus" src="./main.styl"></style>
