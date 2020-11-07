<template>
  <!-- begin .player-buttons-->
  <div class="player-buttons">
    <div class="player-buttons__buttons-container">
      <button class="player-buttons__button" @click="history = true">{{ $t('buttons.history') }}</button>
      <button class="player-buttons__button" @click="request = true">{{ $t('buttons.request') }}</button>
      <button class="player-buttons__button" disabled>{{ $t('buttons.chat') }}</button>
      <button class="player-buttons__button" disabled>{{ $t('buttons.records') }}</button>
    </div>
    <div class="player-buttons__links-container">
      <a v-for="(link, i) in links" :key="i" :href="link.href" class="player-buttons__link" :title="link.title">
        <svg-icon :name="link.icon" />
      </a>
    </div>
    <b-modal v-model="request" :title="$t('modals.tracks_request')">
      <b-request-modal :modal.sync="request" />
    </b-modal>
    <b-modal v-model="history" :title="$t('modals.tracks_history')">
      <b-history-modal />
    </b-modal>
  </div>
  <!-- end .player-buttons-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import BModal from '~/components/modal/modal.vue';
import BHistoryModal from '~/components/history-modal/history-modal.vue';
import BRequestModal from '~/components/request-modal/request-modal.vue';

@Component({
  name: 'b-player-buttons',
  components: { BHistoryModal, BRequestModal, BModal },
})
export default class PlayerButtons extends Vue {
  links = [
    { title: 'Discord', icon: 'discord', href: '#' },
    { title: 'VK', icon: 'vk', href: '#' },
    {
      title: 'YouTube Channel',
      icon: 'youtube',
      href: '#',
    },
  ];
  history = false;
  request = false;
}
</script>

<style lang="stylus" src="./player-buttons.styl" />
