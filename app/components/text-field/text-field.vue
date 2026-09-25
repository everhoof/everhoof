<template>
  <!-- begin .text-field-->
  <label
    :for="id"
    class="text-field"
    :class="{
      'text-field_type_active': active,
      'text-field_width_full': widthFull,
      'text-field_with_margin': margin,
      'text-field_with_icon': icon,
    }"
  >
    <input
      :id="id"
      ref="input"
      :value="value"
      :type="type"
      class="text-field__input"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      @keypress="$emit('keypress', $event)"
    >
    <svg-icon v-if="icon" class="text-field__icon" :name="icon" />
  </label>
  <!-- end .text-field-->
</template>

<script setup lang="ts">
withDefaults(defineProps<{ id: string; type?: string; placeholder?: string; value?: string; active?: boolean; disabled?: boolean; widthFull?: boolean; icon?: string; margin?: boolean }>(), { type: 'text', placeholder: '', value: '', icon: '' });
const emit = defineEmits<{ input: [value: string]; keydown: [event: KeyboardEvent]; keyup: [event: KeyboardEvent]; keypress: [event: KeyboardEvent] }>();
const input = ref<HTMLInputElement | null>(null);
function onInput(event: Event) { emit('input', (event.target as HTMLInputElement).value); }
defineExpose({ focus: () => input.value?.focus() });
</script>

<style lang="stylus" src="./text-field.styl" />
