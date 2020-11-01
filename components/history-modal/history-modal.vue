<template>
  <!-- begin .history-modal-->
  <div class="history-modal">
    <ul class="history-modal__list">
      <li v-for="(track, i) in tracks" :key="i" class="history-modal__item" :title="`${track.track.text}`">
        {{ i + 1 }}. {{ track.track.text }}
      </li>
    </ul>
  </div>
  <!-- end .history-modal-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { HistoryItem } from '~/graphql/schema';

@Component({
  name: 'b-history-modal',
})
export default class HistoryModal extends Vue {
  get tracks(): HistoryItem[] {
    return this.$accessor.player.tracksHistory || [];
  }
}
</script>

<style lang="stylus" src="./history-modal.styl" />
