<template>
  <!-- begin .modal-->
  <div v-show="value" ref="modal" class="modal">
    <b-tile class="tile_padding_medium tile_borders_all modal__tile">
      <div class="modal__header">
        <h3 class="modal__title">{{ title }}</h3>
        <svg-icon class="modal__close" name="close" @click="$emit('input', false)" />
      </div>
      <slot />
    </b-tile>
  </div>
  <!-- end .modal-->
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'nuxt-property-decorator';
import BTile from '~/components/tile/tile.vue';

@Component({
  name: 'b-modal',
  components: { BTile },
})
export default class Modal extends Vue {
  @Prop({ required: true, type: String }) title!: string;
  @Prop({ required: true, type: Boolean }) value!: boolean;

  @Ref() modal?: HTMLDivElement;

  mounted() {
    document.addEventListener('mousedown', (event: MouseEvent) => {
      if (!this.modal?.childNodes[0].contains(event.target as Node)) this.$emit('input', false);
    });
  }
}
</script>

<style lang="stylus" src="./modal.styl" />
