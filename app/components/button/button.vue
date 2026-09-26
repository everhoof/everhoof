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

<style lang="scss" scoped>
$button-active-color: var(--primary);
$button-disabled-color: var(--secondary);
$button-text-color: var(--primary-text);
$button-active-text-color: var(--primary-text);
$button-padding: 1.4em;
$button-border-width: 1px;
$button-border-radius: 0.25em;
$button-margin: 10px 0;
.button {
  position: relative;
  z-index: 1;
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  max-width: 100%;
  padding: 9.5px $button-padding;
  color: $button-text-color;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  word-break: break-all;
  cursor: pointer;
  user-select: none;
  background-color: var(--secondary-background);
  border: $button-border-width solid var(--secondary-background);
  border-radius: $button-border-radius;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: width 0.1s ease;
  box-shadow: var(--shadow) 0 1px 3px;
  &_display {
    &_block {
      display: block;
    }
  }
  &_width {
    &_full {
      width: 100%;
    }
  }
  &_no {
    &_wrap {
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &_with {
    &_margin {
      margin: $button-margin;
    }
  }
  &_size {
    &_small {
      padding: 5px $button-padding;
      font-size: 12px;
    }
    &_medium {
      padding: 9.5px $button-padding;
      font-size: 14px;
    }
    &_large {
      padding: 14px $button-padding;
      font-size: 16px;
    }
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: auto;
    z-index: -1;
    width: 0;
    height: 100%;
    background: var(--primary-dark);
    transition: all 300ms ease;
    transition: all 0.1s ease;
  }
  &_type_active,
  &:hover:not(:disabled) {
    color: $button-active-text-color;
    &:before {
      left: 0;
      width: 100%;
    }
  }
  &:disabled {
    border-color: $button-disabled-color;
    opacity: var(--disabled-alpha);
    &:before {
      background: $button-disabled-color;
    }
  }
}
</style>
