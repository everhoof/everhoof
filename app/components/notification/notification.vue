<template>
  <!-- begin .notification-->
  <div class="notification">
    <div class="notification__message">{{ notification.message }}</div>
    <b-svg-icon class="notification__close" name="close" @click="close" />
  </div>
  <!-- end .notification-->
</template>

<script setup lang="ts">
import type { Notification } from '~~/types/Notification';

interface Props {
  notification: Notification;
}

const props = defineProps<Props>();
const notifications = useNotificationsStore();
function close() {
  notifications.remove(props.notification.id);
}
</script>

<style lang="scss" scoped>
.notification {
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 32px;
  background: rgb(0, 0, 0, .4);
  border-radius: 3px;

  &__message {
    margin: 0 16px 0 0;
    font-size: 16px;
    text-align: center;

    &:last-child {
      margin-right: 0;
    }
  }

  &__close {
    flex-grow: 0;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    padding: 4px;
    fill: currentColor;
    color: var(--primary-text);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 50%;

    &:hover {
      background: rgb(255, 255, 255, .07);
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
