<template>
  <!-- begin .player-buttons-->
  <div class="player-buttons">
    <div class="player-buttons__buttons-container">
      <button class="player-buttons__button" @click="history = true">{{ $t('buttons.history') }}</button>
      <button class="player-buttons__button" :disabled="player.liveData.isLive" @click="request = true">
        {{ $t('buttons.request') }}
      </button>
      <a class="player-buttons__button" href="https://im.everhoof.ru" target="_blank">{{ $t('buttons.chat') }}</a>
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
      <b-request-modal v-model:modal="request" />
    </b-modal>
    <b-modal v-model="history" :title="$t('modals.tracks_history')">
      <b-history-modal />
    </b-modal>
  </div>
  <!-- end .player-buttons-->
</template>

<script setup lang="ts">
import BModal from '~/components/modal/modal.vue';
import BHistoryModal from '~/components/history-modal/history-modal.vue';
import BRequestModal from '~/components/request-modal/request-modal.vue';
import { usePlayerStore } from '~/stores/player';
const player = usePlayerStore();
const links = [
  { title: 'DonationAlerts', icon: 'donationalerts', href: 'https://www.donationalerts.com/r/everhoof' },
  { title: 'Discord', icon: 'discord', href: 'https://everhoof.ru/discord' },
  { title: 'VK', icon: 'vk', href: 'https://vk.com/everhoof' },
  { title: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/c/everhoof' },
];
const history = ref(false);
const request = ref(false);
</script>

<style lang="scss" scoped>
.player-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: -8px 0;
  &__buttons-container {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    margin: 8px 0;
  }
  &__links-container {
    display: flex;
    flex-shrink: 1;
    margin: 8px 0;
  }
  &__button {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    margin: 0 4px;
    padding: 6px 8px;
    color: var(--primary-text);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.04);
    border: none;
    border-radius: 3px;
    outline: none;
    &:not(:disabled) {
      &:hover {
        text-decoration: none;
        background: rgba(255, 255, 255, 0.06);
      }
      &:active {
        background: rgba(255, 255, 255, 0.08);
      }
    }
    &:disabled {
      color: rgba(255, 255, 255, 0.2);
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.08);
    }
  }
  &__link {
    display: block;
    flex-shrink: 0;
    max-width: 32px;
    height: 20px;
    max-height: 20px;
    filter: grayscale(0.5);
    &:hover {
      filter: grayscale(0);
    }
    & .icon {
      display: block;
      width: 32px;
      height: 20px;
    }
  }
}
</style>
