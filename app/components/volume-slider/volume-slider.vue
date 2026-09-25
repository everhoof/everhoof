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

<style lang="stylus" src="./volume-slider.styl" />
