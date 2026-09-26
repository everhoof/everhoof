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
          <span>{{ toFormattedDate(event.startsAt) }}</span> {{ $t('announcement.at') }}
          <span>{{ toFormattedTime(event.startsAt) }}</span>
          <i v-if="isLessThan10Hours(event.startsAt)">
            ({{ $t('announcement.in') }} {{ toRemainingTime(remainingTime(event.startsAt)) }})
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

<script setup lang="ts">
import { DateTime } from 'luxon';
import { toRemainingTime } from '~~/tools/filters';

defineOptions({
  name: 'MainPage',
});
const player = usePlayerStore();
const now = useNowStore();
const events = computed(() => player.calendarEventsState);
const isLive = computed(() => player.liveData.isLive);
const liveEvent = computed(() => {
  if (!isLive.value) return events.value.find((event) => event.endsAt >= now.now) ?? null;
  return events.value.findLast((event) =>
    now.now - event.endsAt < 4 * 60 * 60 * 1000 && now.now >= event.startsAt) ?? null;
});
const filteredEvents = computed(() => events.value
  .filter((event) => event.endsAt >= now.now || event.startsAt === liveEvent.value?.startsAt)
  .toSorted((a, b) => a.startsAt - b.startsAt));
function remainingTime(timestamp: number) {
  return Math.max(0, timestamp - now.now) / 1000;
}
function isLessThan10Hours(timestamp: number) {
  return remainingTime(timestamp) < 36_000 && remainingTime(timestamp) !== 0;
}
function toFormattedDate(timestamp: number) {
  return DateTime.fromMillis(timestamp).toFormat('dd.MM.yyyy');
}
function toFormattedTime(timestamp: number) {
  return DateTime.fromMillis(timestamp).toFormat('HH:mm');
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &__row {
    margin: 0 0 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__announcement {
    display: block;
    color: var(--primary-text);
    font-size: 16px;
    text-align: center;
    text-decoration: none;

    & > span {
      color: var(--important);
      font-weight: 600;
    }

    & > i {
      font-size: 14px;
    }
  }

  &__player {
    width: 550px;
    max-width: 550px;
  }
}
</style>
