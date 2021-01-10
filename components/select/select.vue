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

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'b-select',
})
export default class Select extends Vue {
  @Prop({ type: Array, default: () => [] }) items!: string[];
  @Prop({ type: [Number, String], default: 0 }) value!: number | string;

  @Ref() parent?: HTMLDivElement;
  @Ref() options!: HTMLUListElement;

  focused: boolean = false;

  get index() {
    return typeof this.value === 'string' ? parseInt(this.value) : this.value || 0;
  }

  get title() {
    return this.items && this.items[this.index] ? this.items[this.index] : 'EMPTY';
  }

  mounted() {
    document.addEventListener('click', (e: MouseEvent) => {
      if (!this.parent?.contains(e.target as Node) && this.focused) this.blur();
    });
  }

  focus() {
    this.focused = true;
  }

  blur() {
    this.focused = false;
  }

  mousedown() {
    if (!this.focused) this.focus();
    else this.blur();
  }

  select(i: number) {
    this.$emit('input', i);
    this.blur();
  }
}
</script>

<style lang="stylus" scoped>
.v-enter-active,
.v-leave-active
  transition all .2s

.v-enter,
.v-leave-to
  margin 8px 0
  opacity 0
</style>
<style lang="stylus" src="./select.styl" />
