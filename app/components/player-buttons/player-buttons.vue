<template>
  <!-- begin .player-buttons-->
  <div class="player-buttons">
    <div class="player-buttons__buttons-container">
      <button type="button" class="player-buttons__button" @click="history = true">{{ $t('buttons.history') }}</button>
      <button
        type="button"
        class="player-buttons__button"
        :disabled="player.liveData.isLive"
        @click="request = true"
      >
        {{ $t('buttons.request') }}
      </button>
      <a
        class="player-buttons__button"
        href="https://im.everhoof.ru"
        target="_blank"
        rel="noopener noreferrer"
      >{{ $t('buttons.chat') }}</a>
      <router-link :to="{ name: 'recordings' }" class="player-buttons__button" disabled>
        {{
          $t('buttons.records')
        }}
      </router-link>
    </div>
    <div class="player-buttons__links-container">
      <a
        v-for="(link, i) in links"
        :key="i"
        :href="link.href"
        class="player-buttons__link"
        :title="link.title"
        :aria-label="link.title"
        target="_blank"
        rel="noopener noreferrer"
      >
        <b-svg-icon :name="link.icon" />
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
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
    background: rgb(255, 255, 255, .04);
    border: none;
    border-radius: 3px;
    outline: none;

    &:not(:disabled) {
      &:hover {
        text-decoration: none;
        background: rgb(255, 255, 255, .06);
      }

      &:active {
        background: rgb(255, 255, 255, .08);
      }
    }

    &:disabled {
      color: rgb(255, 255, 255, .2);
      cursor: not-allowed;
      background: rgb(255, 255, 255, .08);
    }
  }

  &__link {
    display: block;
    flex-shrink: 0;
    max-width: 32px;
    height: 20px;
    max-height: 20px;
    filter: grayscale(.5);

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
