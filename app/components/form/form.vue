<template>
  <!-- begin .form-->
  <div class="form">
    <h3 v-if="title" class="form__title">{{ title }}</h3>
    <div class="form__content">
      <div v-if="errors.length > 0" class="form__row">
        <ElFormError :errors="errors" width-full />
      </div>
      <slot />
    </div>
  </div>
  <!-- end .form-->
</template>

<script setup lang="ts">
import ElFormError from '~/components/form-error/form-error.vue';

interface Props {
  errors?: string[];
  title?: string;
}

withDefaults(defineProps<Props>(), {
  errors: () => [],
  title: '',
});
</script>

<style lang="scss" scoped>
.form {
  display: block;
  padding: 20px 10px 10px;
  background: var(--primary-background);
  border-radius: 5px;

  &__title {
    padding: 0 20px;
    color: var(--primary-text);
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    user-select: none;
  }

  &__content {
    width: 100%;
    padding: 20px;
  }

  &__row {
    margin-bottom: 20px;

    &_align {
      &_center {
        text-align: center;
      }
    }
  }
}
</style>
