<template>
  <!-- begin .request-modal-->
  <div class="request-modal">
    <input v-model="q" class="request-modal__input" placeholder="SmD House" type="text" @input="input" />
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
      <div v-if="!items.length && q.length === 0" class="request-modal__message">
        {{ $t('modal_requests.start_typing') }}
      </div>
      <div v-else-if="!items.length && q.length < 3" class="request-modal__message">
        {{ $t('modal_requests.enter_more_than_3_symbols') }}
      </div>
      <div v-else-if="!items.length && q.length >= 3 && debouncing" class="request-modal__message">
        {{ $t('modal_requests.searching') }}
      </div>
      <div v-else-if="!items.length && q.length >= 3 && !debouncing" class="request-modal__message">
        {{ $t('modal_requests.nothing_found') }}
      </div>
    </div>
    <div v-if="pages > 0" class="request-modal__pagination">
      <b-pagination :pages="pages" :page="page" @change="changePage" />
    </div>
  </div>
  <!-- end .request-modal-->
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, PropSync, Vue } from 'nuxt-property-decorator';
import SearchTracks from '@/graphql/queries/SearchTracks.graphql';
import RequestTrack from '@/graphql/queries/RequestTrack.graphql';
import {
  RequestTrackQuery,
  RequestTrackQueryVariables,
  SearchTracksQuery,
  SearchTracksQueryVariables,
} from '~/graphql/schema';
import { ExecutionResult } from '~/types/apollo';
import BPagination from '~/components/pagination/pagination.vue';

@Component({
  name: 'b-request-modal',
  components: { BPagination },
})
export default class RequestModal extends Vue {
  @PropSync('modal') modalSync!: boolean;

  debouncing: boolean = false;
  debounceId: any = null;
  q: string = '';
  page: number = 1;
  count: number = 7;
  total: number = 0;
  items: SearchTracksQuery['searchTracks']['items'] = [];

  get pages(): number {
    return Math.ceil(this.total / this.count);
  }

  async search(reset: boolean = false) {
    if (this.q.length < 3) {
      this.page = 0;
      this.total = 0;
      this.items = [];
      return;
    }

    const variables: SearchTracksQueryVariables = {
      page: this.page,
      count: this.count,
      q: this.q,
    };
    if (reset) variables.page = 1;

    const response: ExecutionResult<SearchTracksQuery> = await this.$apollo.query({
      query: SearchTracks,
      variables,
    });
    this.debouncing = false;
    if (response.errors || !response.data?.searchTracks) return;
    this.page = response.data.searchTracks.page;
    this.count = response.data.searchTracks.count;
    this.total = response.data.searchTracks.total;
    this.items = response.data.searchTracks.items;
  }

  async changePage(page: number) {
    this.page = page;
    await this.search();
  }

  input() {
    this.debouncing = true;
    window.clearTimeout(this.debounceId);
    this.debounceId = window.setTimeout(() => this.search(true), 1000);
  }

  async request(id: string) {
    this.modalSync = false;
    const variables: RequestTrackQueryVariables = { id };
    const response: ExecutionResult<RequestTrackQuery> = await this.$apollo.query({
      query: RequestTrack,
      variables,
    });
    if (response.errors || !response.data?.requestTrack) return;
    this.$accessor.notifications.ADD_NOTIFICATION({ message: response.data.requestTrack.message, timeout: 4000 });
  }
}
</script>

<style lang="stylus" src="./request-modal.styl" />
