<template>
  <!-- begin .request-modal-->
  <div class="request-modal">
    <input
      v-model="q"
      class="request-modal__input"
      :placeholder="randomArtist"
      type="text"
      @input="input"
    >
    <div class="request-modal__scrollable">
      <div v-if="items.length > 0" class="request-modal__tracks">
        <div v-for="(entry, i) in items" :key="i" class="request-modal__track">
          <div class="request-modal__track-part">{{ entry.track.artist }}</div>
          <div class="request-modal__track-part">{{ entry.track.title }}</div>
          <div v-if="entry.track.artist" class="request-modal__track-part request-modal__track-part_type_full">
            <b>{{ entry.track.artist }}</b> – {{ entry.track.title }}
          </div>
          <div v-else class="request-modal__track-part request-modal__track-part_type_full">
            {{ entry.track.title }}
          </div>
          <div
            class="request-modal__track-control"
            role="button"
            tabindex="0"
            :aria-label="$t('buttons.request')"
            @click="request(entry.requestId)"
            @keydown.enter="request(entry.requestId)"
            @keydown.space.prevent="request(entry.requestId)"
          >
            <svg-icon name="req" />
          </div>
        </div>
      </div>
      <div v-if="!items.length && searchTextLength === 0" class="request-modal__message">
        {{ $t('modal_requests.start_typing') }}
      </div>
      <div v-else-if="!items.length && searchTextLength < 3" class="request-modal__message">
        {{ $t('modal_requests.enter_more_than_3_symbols') }}
      </div>
      <div v-else-if="!items.length && searchTextLength >= 3 && debouncing" class="request-modal__message">
        {{ $t('modal_requests.searching') }}
      </div>
      <div v-else-if="!items.length && searchTextLength >= 3 && !debouncing" class="request-modal__message">
        {{ $t('modal_requests.nothing_found') }}
      </div>
    </div>
    <div v-if="pages > 0" class="request-modal__pagination">
      <b-pagination :pages="pages" :page="page" @change="changePage" />
    </div>
  </div>
  <!-- end .request-modal-->
</template>

<script setup lang="ts">
import SearchTracks from '~~/graphql/queries/SearchTracks.graphql?raw';
import RequestTrack from '~~/graphql/queries/RequestTrack.graphql?raw';
import type {
  RequestTrackQuery,
  SearchTracksQuery,
} from '~~/graphql/schema';
import BPagination from '~/components/pagination/pagination.vue';
import { useNotificationsStore } from '~/stores/notifications';
import { getRandomInt } from '~/utils/math';

interface Props {
  modal: boolean;
}

interface Emits {
  'update:modal': [value: boolean];
}

defineProps<Props>();
const emit = defineEmits<Emits>();
const graphql = useGraphql();
const notifications = useNotificationsStore();
const debouncing = ref(false);
const q = ref('');
const page = ref(1);
const count = ref(7);
const total = ref(0);
const items = ref<SearchTracksQuery['searchTracks']['items']>([]);
const searchTextLength = computed(() => q.value.trim().length);
const pages = computed(() => Math.ceil(total.value / count.value));
const artists = ['Aviators', '4everfreebrony', 'BroniKoni', 'Elias Frost', 'Princewhateverer', 'SlyphStorm', 'The Wasteland Wailers', 'The L-Train', 'SmD House', 'Duo Cartoonist', 'BlackGryph0n'];
const randomArtist = ref('Aviators');
onMounted(() => {
  randomArtist.value = artists[getRandomInt(artists.length)] ?? 'Aviators';
});
const debounceId = ref<ReturnType<typeof setTimeout>>();
const requestId = ref(0);
async function search(shouldReset = false) {
  if (searchTextLength.value < 3) {
    page.value = 1;
    total.value = 0;
    items.value = [];
    debouncing.value = false;
    return;
  }
  const currentId = ++requestId.value;
  try {
    const data = await graphql<SearchTracksQuery>(SearchTracks, {
      page: shouldReset ? 1 : page.value, count: count.value, q: q.value,
    });
    if (currentId !== requestId.value) return;
    page.value = data.searchTracks.page;
    count.value = data.searchTracks.count;
    total.value = data.searchTracks.total;
    items.value = data.searchTracks.items;
  } catch (error) {
    notifications.add(error instanceof Error ? error.message : 'Неизвестная ошибка');
  } finally {
    if (currentId === requestId.value) debouncing.value = false;
  }
}
async function changePage(value: number) {
  page.value = value;
  await search();
}
function input() {
  debouncing.value = true;
  clearTimeout(debounceId.value);
  debounceId.value = setTimeout(() => search(true), 1000);
}
async function request(id: string) {
  emit('update:modal', false);
  try {
    const data = await graphql<RequestTrackQuery>(RequestTrack, {
      id,
    });
    if (data.requestTrack) notifications.add(data.requestTrack.message);
  } catch (error) {
    notifications.add(error instanceof Error ? error.message : 'Неизвестная ошибка');
  }
}
onUnmounted(() => {
  clearTimeout(debounceId.value);
  requestId.value++;
});
</script>

<style lang="scss" scoped>
.request-modal {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 800px;
  max-width: 100%;

  &__input {
    width: 100%;
    margin: 0 0 16px;
    padding: 12px;
    color: var(--primary-text);
    background: rgb(255, 255, 255, .04);
    border: 2px solid transparent;
    outline: none;

    &:focus {
      border: 2px solid rgb(0, 0, 0, .5);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__scrollable {
    overflow-y: auto;
    flex-grow: 1;
    flex-shrink: 1;
    margin: 0 0 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__tracks {
    display: table;
    overflow-y: auto;
    width: 100%;
    max-width: 100%;
    margin: 0 0 16px;
    border-collapse: collapse;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__track {
    display: table-row;
    height: 50px;
    min-height: 50px;
    color: var(--primary-text);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    border-bottom: 6px solid var(--primary-background);

    @media screen and (width >= 768px) {
      font-weight: 600;
      text-align: center;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__track-part {
    display: none;
    vertical-align: middle;
    padding: 4px 24px;
    background: rgb(255, 255, 255, .04);
    border-right: 6px solid var(--primary-background);

    @media screen and (width >= 768px) {
      display: table-cell;
    }

    &_type {
      &_full {
        display: table-cell;

        @media screen and (width >= 768px) {
          display: none;
        }
      }
    }

    &:last-child {
      border-right: none;
    }
  }

  &__track-control {
    display: table-cell;
    vertical-align: middle;
    width: 44px;
    padding: 0 8px;
    color: var(--primary-text);
    cursor: pointer;
    background: rgb(255, 255, 255, .03);

    &:hover {
      color: var(--primary-light);
    }

    & > .icon {
      display: block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  }

  &__pagination {
    display: flex;
    justify-content: center;
  }

  &__message {
    padding: 24px 0;
    font-size: 16px;
    text-align: center;
  }
}
</style>
