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
    <b-svg-icon v-if="icon" class="text-field__icon" :name="icon" />
  </label>
  <!-- end .text-field-->
</template>

<script setup lang="ts">

interface Props {
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  active?: boolean;
  disabled?: boolean;
  widthFull?: boolean;
  icon?: string;
  margin?: boolean;
}

interface Emits {
  input: [value: string];
  keydown: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  keypress: [event: KeyboardEvent];
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  value: '',
  icon: '',
});
const emit = defineEmits<Emits>();
const input = ref<HTMLInputElement | null>(null);
function onInput(event: Event) {
  emit('input', (event.target as HTMLInputElement).value);
}
defineExpose({
  focus: () => input.value?.focus(),
});
</script>

<style lang="scss" scoped>
$text-field-size: 38px;
$text-field-font-size: 14px;
$text-field-icon-size: 12px;
$text-field-text-color: var(--primary-text);
$text-field-icon-color: #b2b2b2;
$text-field-border-color: var(--secondary-background);
$text-field-placeholder-color: var(--secondary-text);
$text-field-active-color: var(--primary-dark);
$text-field-margin: 10px 0;

.text-field {
  position: relative;
  display: block;
  width: 200px;
  margin: 10px 0;
  font-size: $text-field-font-size;

  &_width {
    &_full {
      width: 100%;
    }
  }

  &_with {
    &_icon {
      & .text-field__input {
        padding: 0 20px 0 30px;
      }
    }

    &_margin {
      margin: $text-field-margin;
    }
  }

  &__input {
    width: 100%;
    height: $text-field-size;
    padding: 0 20px;
    color: $text-field-text-color;
    line-height: $text-field-size;
    background: transparent;
    border: 2px solid #{$text-field-border-color};
    border-radius: 4px;
    outline: none;

    &::-webkit-input-placeholder {
      color: $text-field-placeholder-color;
      font-size: 14px;
    }

    &:-moz-placeholder {
      color: $text-field-placeholder-color;
      font-size: 14px;
    }

    &:-ms-input-placeholder {
      color: $text-field-placeholder-color;
      font-size: 14px;
    }

    &::placeholder {
      color: $text-field-placeholder-color;
      font-size: 14px;
      opacity: 1;
    }

    .text-field_type_active &:not(:disabled),
    &:focus:not(:disabled) {
      border-color: $text-field-active-color;

      & + {
        & .text-field__icon {
          fill: $text-field-active-color;
        }
      }
    }

    &:disabled {
      opacity: var(--disabled-alpha);

      & + {
        & .text-field__icon {
          opacity: var(--disabled-alpha);
        }
      }
    }
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 10px;
    width: $text-field-icon-size;
    height: $text-field-icon-size;
    margin-top: #{-$text-field-icon-size * .5};
    fill: $text-field-icon-color;
  }
}
</style>
