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
withDefaults(defineProps<{ errors?: string[]; title?: string }>(), { errors: () => [], title: '' });
</script>

<style lang="stylus" src="./form.styl" />
