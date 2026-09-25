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

<style lang="stylus" src="./form-error.styl" />
