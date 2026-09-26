<template>
  <!-- begin .chat-->
  <div class="chat">
    <a :href="link" class="chat__link" :aria-label="$t('buttons.chat')">
      <b-svg-icon name="open_in_new" />
    </a>
    <iframe
      :title="$t('buttons.chat')"
      class="chat__iframe"
      :src="link"
      frameborder="0"
    />
  </div>
  <!-- end .chat-->
</template>

<script setup lang="ts">
const link = '#';
</script>

<style lang="scss" scoped>
.chat {
  position: relative;
  display: block;

  &__iframe {
    display: block;
    width: 100%;
    height: 220px;
    border: none;
  }

  &__link {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px;
    outline: none;

    & .icon {
      width: 24px;
      height: 24px;
      fill: var(--primary);
      background: var(--primary-background);
      border-radius: 0 0 0 4px;
      transition: fill .1s ease;

      &:hover {
        fill: var(--primary-light);
      }
    }
  }
}
</style>
