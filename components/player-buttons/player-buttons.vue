<template>
  <!-- begin .player-buttons-->
  <div class="player-buttons">
    <div class="player-buttons__buttons-container">
      <button class="player-buttons__button" @click="history = true">{{ $t('buttons.history') }}</button>
      <button class="player-buttons__button" :disabled="$accessor.player.liveData.isLive" @click="request = true">
        {{ $t('buttons.request') }}
      </button>
      <a class="player-buttons__button" href="https://bar-radio-everypony.chatovod.ru/" target="_blank">{{
        $t('buttons.chat')
      }}</a>
      <router-link :to="{ name: 'recordings' }" class="player-buttons__button" disabled>{{
        $t('buttons.records')
      }}</router-link>
    </div>
    <div class="player-buttons__links-container">
      <a
        v-for="(link, i) in links"
        :key="i"
        :href="link.href"
        class="player-buttons__link"
        :title="link.title"
        target="_blank"
      >
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
    {
      title: 'DonationAlerts',
      icon: 'donationalerts',
      href: 'https://www.donationalerts.com/r/everhoof',
    },
    { title: 'Discord', icon: 'discord', href: 'https://discord.gg/YV9HhHRd4M' },
    { title: 'VK', icon: 'vk', href: 'https://vk.com/everhoof' },
    {
      title: 'YouTube',
      icon: 'youtube',
      href: 'https://www.youtube.com/channel/UCiWnOZze2b_KEP-rtsWE90w',
    },
  ];
  history = false;
  request = false;
}
</script>

<style lang="stylus" src="./player-buttons.styl" />
