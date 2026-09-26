<template>
  <!-- begin .pagination-->
  <div v-if="pages > 0" class="pagination">
    <button
      type="button"
      class="pagination__item"
      :disabled="page === 1"
      @click="$emit('change', 1)"
    >
      <svg-icon name="first_page" />
    </button>
    <button
      type="button"
      class="pagination__item"
      :disabled="page - 1 < 1"
      @click="$emit('change', page - 1)"
    >
      <svg-icon name="chevron_left" />
    </button>
    <button
      type="button"
      v-for="i in displayPages"
      :key="i"
      class="pagination__item"
      :class="{ pagination__item_state_active: i === page }"
      @click="$emit('change', i)"
    >
      {{ i }}
    </button>
    <button
      type="button"
      class="pagination__item"
      :disabled="page + 1 > pages"
      @click="$emit('change', page + 1)"
    >
      <svg-icon name="chevron_right" />
    </button>
    <button
      type="button"
      class="pagination__item"
      :disabled="page === pages"
      @click="$emit('change', pages)"
    >
      <svg-icon name="last_page" />
    </button>
  </div>
  <!-- end .pagination-->
</template>

<script setup lang="ts">

interface Props {
  pages: number;
  page: number;
}

interface Emits {
  change: [page: number];
}

const props = defineProps<Props>();
defineEmits<Emits>();
const displayPages = computed(() => {
  const first = props.page === props.pages && props.pages > 2 ? props.page - 2 : Math.max(props.page - 1, 1);
  return Array.from({ length: Math.min(first + 2, props.pages) - first + 1 }, (_, index) => first + index);
});
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;

  &__item {
    width: 40px;
    height: 40px;
    margin: 0 2px 0 0;
    color: var(--secondary-text);
    font-size: 18px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 3px;

    @media screen and (width >= 768px) {
      width: 48px;
      height: 48px;
      line-height: 48px;
    }

    &:disabled {
      opacity: .3;
    }

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background: rgb(255, 255, 255, .03);
    }

    &_state {
      &_active {
        background: rgb(255, 255, 255, .05);
      }
    }

    & .icon {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  }
}
</style>
