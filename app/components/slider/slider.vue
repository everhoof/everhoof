<template>
  <!-- begin .seek-bar -->
  <div
    ref="slider"
    class="slider"
    :class="{ slider_with_time: withTime, slider_type_interactive: interactive }"
    :role="interactive ? 'slider' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-label="$t('controls.slider')"
    :aria-valuemin="interactive ? 0 : undefined"
    :aria-valuemax="interactive ? 100 : undefined"
    :aria-valuenow="interactive ? Math.round(valueSynced * 100) : undefined"
    v-on="interactive ? { keydown: onKeyDown, mousedown: onMouseDown, touchstart: onMouseDown } : {}"
  >
    <span v-if="emptyTime" class="slider__time">––:––</span>
    <span v-else class="slider__time">{{ toHHMMSS(time) }}</span>
    <div class="slider__box">
      <div ref="bg" class="slider__bg" :style="{ width: `${emptyTime ? 100 : valueSynced * 100}%` }">
        <div v-if="interactive" ref="seeker" class="slider__seeker" />
      </div>
    </div>
    <span v-if="emptyTime" class="slider__time">––:––</span>
    <span v-else class="slider__time">{{ toHHMMSS(duration) }}</span>
  </div>
  <!-- end .seek-bar -->
</template>

<script setup lang="ts">
import { toHHMMSS } from '~~/tools/filters';

interface Props {
  value?: number;
  duration?: number;
  interactive?: boolean;
  withTime?: boolean;
  emptyTime?: boolean;
}

interface Emits {
  'update:value': [value: number];
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  duration: 0,
});
const emit = defineEmits<Emits>();
const bg = ref<HTMLElement | null>(null);
const slider = ref<HTMLElement | null>(null);
const valueSynced = computed({
  get: () => props.value, set: (value) => emit('update:value', Math.min(1, Math.max(0, value))),
});
const time = computed(() => props.duration * valueSynced.value);
const isPointerDown = ref(false);
function getPosition(event: MouseEvent | TouchEvent) {
  const element = bg.value?.parentElement;
  if (!element) return 0;
  const x = 'touches' in event ? event.touches[0]?.clientX : event.clientX;
  return Math.min(1, Math.max(0, ((x ?? 0) - element.getBoundingClientRect().left) / element.clientWidth));
}
function onMouseDown(event: MouseEvent | TouchEvent) {
  if (!props.interactive) {
    return;
  }
  isPointerDown.value = true;
  valueSynced.value = getPosition(event);
}
function onMouseMove(event: MouseEvent | TouchEvent) {
  if (isPointerDown.value && props.interactive) valueSynced.value = getPosition(event);
}
function onMouseUp() {
  isPointerDown.value = false;
}
function onKeyDown(event: KeyboardEvent) {
  if (!props.interactive) return;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp': {
      valueSynced.value += 0.05;
      break;
    }
    case 'ArrowLeft':
    case 'ArrowDown': {
      valueSynced.value -= 0.05;
      break;
    }
    case 'Home': {
      valueSynced.value = 0;
      break;
    }
    case 'End': {
      valueSynced.value = 1;
      break;
    }
    default: {
      return;
    }
  }
  event.preventDefault();
}
function onWheel(event: WheelEvent) {
  if (!props.interactive) {
    return;
  }
  event.preventDefault();
  valueSynced.value += event.deltaY > 0 ? -0.05 : 0.05;
}
onMounted(() => {
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchend', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onMouseMove);
  slider.value?.addEventListener('wheel', onWheel, {
    passive: false,
  });
});
onUnmounted(() => {
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('touchend', onMouseUp);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('touchmove', onMouseMove);
  slider.value?.removeEventListener('wheel', onWheel);
});
</script>

<style lang="scss" scoped>
.slider {
  display: flex;
  align-items: center;
  width: 100%;
  height: 16px;

  &:hover {
    & .slider__seeker {
      transform: scale(1.4);
    }
  }

  &__time {
    display: none;
    flex-shrink: 1;
    color: var(--primary-text);
    font-size: 13px;
    font-weight: 600;
  }

  &__box {
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    height: 4px;
    margin: 0;
    background: rgb(255, 255, 255, .1);
  }

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 100%;
    height: 100%;
    background: var(--primary);
  }

  &__seeker {
    position: absolute;
    top: -3px;
    right: -5px;
    width: 10px;
    height: 10px;
    background-color: var(--primary-light);
    border-radius: 50%;
    transition: transform .1s ease;
  }

  &_type {
    &_interactive {
      cursor: pointer;
    }
  }

  &_with {
    &_time {
      & .slider {
        &__time {
          display: block;
        }

        &__box {
          margin: 0 12px;

          &:first-child {
            margin-left: 0;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
