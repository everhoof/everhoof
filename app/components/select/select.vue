<template>
  <!-- begin .select-->
  <div ref="parent" class="select">
    <button class="select__title" @click="mousedown">
      {{ title }}
    </button>
    <transition>
      <ul v-show="focused" ref="options" class="select__list">
        <li v-for="(item, i) in items" v-show="item !== title" :key="i" class="select__item" @click="select(i)">
          {{ item }}
        </li>
      </ul>
    </transition>
  </div>
  <!-- end .select-->
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ items?: string[]; value?: number | string }>(), { items: () => [], value: 0 });
const emit = defineEmits<{ input: [index: number] }>();
const parent = ref<HTMLDivElement | null>(null);
const focused = ref(false);
const index = computed(() => Number(props.value) || 0);
const title = computed(() => props.items[index.value] || 'EMPTY');
function onDocumentClick(event: MouseEvent) { if (!parent.value?.contains(event.target as Node)) focused.value = false; }
onMounted(() => document.addEventListener('click', onDocumentClick));
onUnmounted(() => document.removeEventListener('click', onDocumentClick));
function mousedown() { focused.value = !focused.value; }
function select(i: number) { emit('input', i); focused.value = false; }
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s;
}
.v-enter-from,
.v-leave-to {
  margin: 8px 0;
  opacity: 0;
}
</style>
<style lang="scss" scoped>
.select {
  position: relative;
  display: block;
  &__title {
    overflow: hidden;
    padding: 8px 24px;
    color: var(--secondary-text);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    text-transform: uppercase;
    text-overflow: ellipsis;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    outline: none;
    &:hover,
    &:focus {
      background: rgba(255, 255, 255, 0.06);
    }
  }
  &__list {
    position: absolute;
    top: 100%;
    z-index: 1;
    overflow: hidden;
    min-width: 100%;
    margin: 4px 0;
    text-transform: uppercase;
    background: var(--primary-background);
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
  }
  &__item {
    padding: 8px 24px;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
