<template>
  <!-- begin .chat-->
  <div class="chat">
    <a :href="link" class="chat__link">
      <svg-icon name="open_in_new" />
    </a>
    <iframe class="chat__iframe" :src="link" frameborder="0" />
  </div>
  <!-- end .chat-->
</template>

<script setup lang="ts">
const link = '#';
</script>

<style lang="stylus" src="./chat.styl" />
