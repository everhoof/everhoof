<template>
  <!-- begin .tile-->
  <div class="tile">
    <slot />
  </div>
  <!-- end .tile-->
</template>

<style lang="scss" scoped>
.tile {
  display: block;
  background: var(--primary-background);
  box-shadow: 0 0 5px rgb(0, 0, 0, .3);

  &_padding {
    &_medium {
      padding: 16px 24px;
    }

    &_small {
      padding: 8px 16px;
    }

    &_tiny {
      padding: 8px;
    }
  }

  &_borders {
    &_none {
      border-radius: 0;
    }

    &_top {
      border-radius: 4px 4px 0 0;
    }

    &_right {
      border-radius: 0 4px;
    }

    &_left {
      border-radius: 4px 0;
    }

    &_bottom {
      border-radius: 0 0 4px 4px;
    }

    &_all {
      border-radius: 4px;
    }
  }
}
</style>
