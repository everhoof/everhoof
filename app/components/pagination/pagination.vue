<template>
  <!-- begin .pagination-->
  <div v-if="pages > 0" class="pagination">
    <button class="pagination__item" :disabled="page === 1" @click="$emit('change', 1)">
      <svg-icon name="first_page" />
    </button>
    <button class="pagination__item" :disabled="page - 1 < 1" @click="$emit('change', page - 1)">
      <svg-icon name="chevron_left" />
    </button>
    <button
      v-for="i in displayPages"
      :key="i"
      class="pagination__item"
      :class="{ pagination__item_state_active: i === page }"
      @click="$emit('change', i)"
    >
      {{ i }}
    </button>
    <button class="pagination__item" :disabled="page + 1 > pages" @click="$emit('change', page + 1)">
      <svg-icon name="chevron_right" />
    </button>
    <button class="pagination__item" :disabled="page === pages" @click="$emit('change', pages)">
      <svg-icon name="last_page" />
    </button>
  </div>
  <!-- end .pagination-->
</template>

<script setup lang="ts">
const props = defineProps<{ pages: number; page: number }>();
defineEmits<{ change: [page: number] }>();
const displayPages = computed(() => {
  const first = props.page === props.pages && props.pages > 2 ? props.page - 2 : Math.max(props.page - 1, 1);
  return Array.from({ length: Math.min(first + 2, props.pages) - first + 1 }, (_, index) => first + index);
});
</script>

<style lang="stylus" src="./pagination.styl" />
