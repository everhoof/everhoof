<template>
  <!-- begin .modal-->
  <div v-show="modelValue" ref="modal" class="modal">
    <b-tile class="tile_padding_medium tile_borders_all modal__tile">
      <div class="modal__header">
        <h3 class="modal__title">{{ title }}</h3>
        <b-svg-icon class="modal__close" name="close" @click="$emit('update:modelValue', false)" />
      </div>
      <slot />
    </b-tile>
  </div>
  <!-- end .modal-->
</template>

<script setup lang="ts">

interface Props {
  title: string;
  modelValue: boolean;
}

interface Emits {
  'update:modelValue': [value: boolean];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const modal = ref<HTMLDivElement | null>(null);
function onDocumentMouseDown(event: MouseEvent) {
  if (props.modelValue && modal.value && !modal.value.firstElementChild?.contains(event.target as Node)) emit('update:modelValue', false);
}
onMounted(() => document.addEventListener('mousedown', onDocumentMouseDown));
onUnmounted(() => document.removeEventListener('mousedown', onDocumentMouseDown));
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 320px;
  background: rgb(0, 0, 0, .5);

  &__tile {
    display: flex;
    flex-direction: column;
    max-width: 95%;
    max-height: 85%;
  }

  &__icon {
    max-width: 100%;
    max-height: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 0 16px;
    padding: 0 0 8px;
    border-bottom: 1px solid rgb(255, 255, 255, .07);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__title {
    overflow: hidden;
    flex-grow: 1;
    flex-shrink: 1;
    margin: 0 12px 0 0;
    color: var(--primary-text);
    font-size: 19px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:last-child {
      margin-right: 0;
    }
  }

  &__close {
    flex-grow: 0;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    padding: 4px;
    fill: currentColor;
    color: var(--primary-text);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 50%;

    &:hover {
      background: rgb(255, 255, 255, .07);
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
