<template>
  <!-- Bundled SVG assets are trusted and name resolves only from the local icon map. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <svg
    class="icon"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    v-html="content"
  />
</template>

<script setup lang="ts">

interface Props {
  name: string;
}

const props = defineProps<Props>();
const icons = import.meta.glob('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const source = computed(() => icons[`../assets/icons/${props.name}.svg`] ?? '');
const viewBox = computed(() => (/viewBox="([^"]+)"/.exec(source.value))?.[1] ?? '0 0 24 24');
const content = computed(() => (/<svg\b[^>]*>([\s\S]*?)<\/svg>/i.exec(source.value))?.[1] ?? '');
</script>

<style lang="scss" scoped>
.icon {
  max-width: 100%;
  max-height: 100%;
}
</style>
