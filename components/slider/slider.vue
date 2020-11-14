<template>
  <!-- begin .seek-bar -->
  <div
    ref="slider"
    class="slider"
    :class="{ slider_with_time: withTime }"
    @mousedown="onMouseDown"
    @touchstart="onMouseDown"
  >
    <span v-if="emptyTime" class="slider__time">––:––</span>
    <span v-else class="slider__time">{{ time | toHHMMSS }}</span>
    <div class="slider__box">
      <div ref="bg" class="slider__bg" :style="{ width: valueSynced * 100 + '%' }">
        <div v-if="interactive" ref="seeker" class="slider__seeker"></div>
      </div>
    </div>
    <span v-if="emptyTime" class="slider__time">––:––</span>
    <span v-else class="slider__time">{{ duration | toHHMMSS }}</span>
  </div>
  <!-- end .seek-bar -->
</template>

<script lang="ts">
import { Component, Vue, Ref, PropSync, Prop } from 'vue-property-decorator';
import { toHHMMSS } from '~/tools/filters';

@Component({
  name: 'b-slider',
  filters: { toHHMMSS },
})
export default class Slider extends Vue {
  @PropSync('value', { default: 0 }) valueSynced!: number;
  @Prop({ default: 0 }) duration!: number;
  @Prop({ default: false, type: Boolean }) interactive!: boolean;
  @Prop({ default: false, type: Boolean }) withTime!: boolean;
  @Prop({ default: false, type: Boolean }) emptyTime!: boolean;
  @Ref() private slider!: HTMLElement;
  @Ref() private bg!: HTMLElement;
  @Ref() private timestamp!: HTMLElement;

  private pointerDown = false;

  get time(): number {
    return this.duration * this.valueSynced;
  }

  mounted() {
    document.addEventListener('mouseup', () => {
      if (!this.interactive) return;
      this.pointerDown = false;
    });
    document.addEventListener('touchend', () => {
      if (!this.interactive) return;
      this.pointerDown = false;
    });
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!this.interactive) return;
      this.onMouseMove(event);
    });
    document.addEventListener('touchmove', (event: TouchEvent) => {
      if (!this.interactive) return;
      this.onMouseMove(event);
    });
    Slider.onWheel(this.slider, (e: any) => {
      if (!this.interactive) return;
      e.preventDefault();
      const delta = e.deltaY || e.detail || e.wheelDelta;
      const newValue = this.valueSynced + (delta > 0 ? -0.05 : 0.05);
      if (newValue < 0) {
        this.valueSynced = 0;
      } else if (newValue > 1) {
        this.valueSynced = 1;
      } else {
        this.valueSynced = newValue;
      }
    });
  }

  static getPosition(elem: HTMLElement | null, event: MouseEvent | TouchEvent) {
    if (elem !== undefined && elem !== null && event !== undefined) {
      const prefix = elem.getBoundingClientRect().left;
      let pageX = 0;
      // @ts-ignore
      if (window.TouchEvent && event instanceof TouchEvent) {
        // eslint-disable-next-line prefer-destructuring
        pageX = event.touches[0].pageX;
      } else if (event instanceof MouseEvent) {
        // eslint-disable-next-line prefer-destructuring
        pageX = event.pageX;
      }
      let pointE = (pageX - prefix) / elem.clientWidth;
      if (pointE < 0) {
        pointE = 0;
      } else if (pointE > 1) {
        pointE = 1;
      }
      return pointE;
    }
    return 0;
  }

  onMouseDown(event: MouseEvent | TouchEvent) {
    if (!this.interactive) return;
    this.pointerDown = true;
    this.valueSynced = Slider.getPosition(this.bg.parentElement, event);
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.interactive) return;
    if (this.pointerDown) {
      this.valueSynced = Slider.getPosition(this.bg.parentElement, event);
    }
  }

  static onWheel(elem: HTMLElement, handler: any) {
    if ('onwheel' in document) {
      // IE9+, FF17+
      elem.addEventListener('wheel', handler);
    } else if ('onmousewheel' in document) {
      // устаревший вариант события
      elem.addEventListener('mousewheel', handler);
    } else {
      // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
      elem.addEventListener('MozMousePixelScroll', handler);
    }
  }
}
</script>

<style lang="stylus" src="./slider.styl" />
