<template>
  <!-- begin .volume-slider -->
  <div class="volume-slider">
    <button class="player__button volume-slider__button" @click="mute">
      <svg-icon
        :class="['volume-slider__icon', { 'volume-slider__icon_type_muted': syncedMuted }]"
        :name="`volume_${syncedMuted ? 'off' : 'up'}`"
      />
    </button>
    <div class="volume-slider__slider">
      <b-slider v-model:value="syncedVolume" interactive />
    </div>
  </div>
</template>

<script setup lang="ts">
import BSlider from '~/components/slider/slider.vue';
const props = defineProps<{ volume: number; muted?: boolean }>();
const emit = defineEmits<{ 'update:volume': [value: number]; 'update:muted': [value: boolean] }>();
const syncedVolume = computed({ get: () => props.volume, set: (value) => emit('update:volume', value) });
const syncedMuted = computed({ get: () => props.muted ?? false, set: (value) => emit('update:muted', value) });
function mute() { syncedMuted.value = !syncedMuted.value; }
</script>

<style lang="scss" scoped>
.volume-slider {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &__button {
    display: inline-block;
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    color: var(--secondary-text);
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;

    &:hover {
      color: var(--primary-light);
    }
  }

  &__icon {
    display: block;
    flex-shrink: 0;
    width: 36px;
    max-width: 36px;
    height: 36px;
    max-height: 36px;
    fill: currentColor;

    &_type {
      &_muted {
        fill: #ef5350;
      }
    }
  }

  &__slider {
    flex-basis: 100px;
    max-width: 80px;
    margin: 0 0 0 8px;
  }
}
</style>
