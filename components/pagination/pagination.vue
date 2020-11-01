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

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({
  name: 'b-pagination',
})
export default class Pagination extends Vue {
  @Prop({ required: true, type: Number }) pages!: number;
  @Prop({ required: true, type: Number }) page!: number;

  get displayPages(): number[] {
    const first = this.page === this.pages && this.pages > 2 ? this.page - 2 : Math.max(this.page - 1, 1);
    const last = Math.min(first + 2, this.pages);
    return this.range(first, last);
  }

  range(start: number, end: number): number[] {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => start + idx);
  }
}
</script>

<style lang="stylus" src="./pagination.styl" />
