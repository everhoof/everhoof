<template>
  <!-- begin .request-modal-->
  <div class="request-modal">
    <input v-model="q" class="request-modal__input" :placeholder="randomArtist" type="text" @input="input" >
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
          <div class="request-modal__track-control" @click="request(entry.requestId)">
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
import type { RequestTrackQuery, SearchTracksQuery } from '~~/graphql/schema';
import BPagination from '~/components/pagination/pagination.vue';
import { useNotificationsStore } from '~/stores/notifications';
import { getRandomInt } from '~/utils/math';
defineProps<{ modal: boolean }>();
const emit = defineEmits<{ 'update:modal': [value: boolean] }>();
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
onMounted(() => { randomArtist.value = artists[getRandomInt(artists.length)] || 'Aviators'; });
let debounceId: ReturnType<typeof setTimeout> | undefined;
let requestId = 0;
async function search(reset = false) {
  if (searchTextLength.value < 3) { page.value = 1; total.value = 0; items.value = []; debouncing.value = false; return; }
  const currentId = ++requestId;
  try {
    const data = await graphql<SearchTracksQuery>(SearchTracks, { page: reset ? 1 : page.value, count: count.value, q: q.value });
    if (currentId !== requestId) return;
    page.value = data.searchTracks.page; count.value = data.searchTracks.count; total.value = data.searchTracks.total; items.value = data.searchTracks.items;
  } catch (error) { notifications.add(error instanceof Error ? error.message : 'Неизвестная ошибка'); }
  finally { if (currentId === requestId) debouncing.value = false; }
}
async function changePage(value: number) { page.value = value; await search(); }
function input() { debouncing.value = true; clearTimeout(debounceId); debounceId = setTimeout(() => search(true), 1000); }
async function request(id: string) {
  emit('update:modal', false);
  try { const data = await graphql<RequestTrackQuery>(RequestTrack, { id }); if (data.requestTrack) notifications.add(data.requestTrack.message); }
  catch (error) { notifications.add(error instanceof Error ? error.message : 'Неизвестная ошибка'); }
}
onUnmounted(() => { clearTimeout(debounceId); requestId++; });
</script>

<style lang="stylus" src="./request-modal.styl" />
