<template>
  <!-- begin .button-->
  <component
    :is="tag"
    class="button"
    :class="{
      button_size_small: small,
      button_size_medium: medium || (!small && !large),
      button_size_large: large,
      button_display_block: block,
      button_width_full: widthFull,
      button_type_active: active,
      button_no_wrap: noWrap,
      button_with_margin: margin,
    }"
    :disabled="disabled"
    :to="to"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
  <!-- end .button-->
</template>

<script setup lang="ts">
withDefaults(defineProps<{ tag?: string; small?: boolean; medium?: boolean; large?: boolean; block?: boolean; widthFull?: boolean; active?: boolean; disabled?: boolean; noWrap?: boolean; margin?: boolean; to?: string }>(), { tag: 'button', to: undefined });
defineEmits<{ click: [event: MouseEvent] }>();
</script>

<style lang="stylus" src="./button.styl" />
