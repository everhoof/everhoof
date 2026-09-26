<template>
  <!-- begin .form-error-->
  <div
    class="form-error"
    :class="{
      'form-error_width_full': widthFull,
      'form-error_with_margin': margin,
    }"
  >
    <p v-for="(error, i) of errors" :key="i" class="form-error__text">– {{ error }}</p>
  </div>
  <!-- end .form-error-->
</template>

<script setup lang="ts">
withDefaults(defineProps<{ errors?: string[]; widthFull?: boolean; margin?: boolean }>(), { errors: () => [] });
</script>

<style lang="scss" scoped>
$form-error-color: var(--error);
$form-error-height: 52px;
$form-error-font-size: 14px;
$form-error-border-radius: 4px;
$form-error-icon-size: 24px;
$form-error-icon-padding: 2px;
$form-error-icon-bg: var(--secondary-background);
$form-error-margin: 10px 0;

.form-error {
  position: relative;
  display: block;
  width: 200px;
  min-height: $form-error-height;
  padding: 16px;
  font-size: $form-error-font-size;
  line-height: $form-error-font-size;
  border: 2px solid #{$form-error-color};
  border-radius: $form-error-border-radius;

  &_width {
    &_full {
      width: 100%;
    }
  }

  &_with {
    &_margin {
      margin: $form-error-margin;
    }
  }

  &__text:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
