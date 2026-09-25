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

<style lang="stylus" scoped>
.v-enter-active,
.v-leave-active
  transition all .2s

.v-enter-from,
.v-leave-to
  margin 8px 0
  opacity 0
</style>
<style lang="stylus" src="./select.styl" />
