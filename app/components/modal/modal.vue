<template>
  <!-- begin .modal-->
  <div v-show="modelValue" ref="modal" class="modal">
    <b-tile class="tile_padding_medium tile_borders_all modal__tile">
      <div class="modal__header">
        <h3 class="modal__title">{{ title }}</h3>
        <svg-icon class="modal__close" name="close" @click="$emit('update:modelValue', false)" />
      </div>
      <slot />
    </b-tile>
  </div>
  <!-- end .modal-->
</template>

<script setup lang="ts">
import BTile from '~/components/tile/tile.vue';
const props = defineProps<{ title: string; modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const modal = ref<HTMLDivElement | null>(null);
function onDocumentMouseDown(event: MouseEvent) {
  if (props.modelValue && modal.value && !modal.value.firstElementChild?.contains(event.target as Node)) emit('update:modelValue', false);
}
onMounted(() => document.addEventListener('mousedown', onDocumentMouseDown));
onUnmounted(() => document.removeEventListener('mousedown', onDocumentMouseDown));
</script>

<style lang="stylus" src="./modal.styl" />
