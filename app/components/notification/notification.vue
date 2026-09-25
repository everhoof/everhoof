<template>
  <!-- begin .notification-->
  <div class="notification">
    <div class="notification__message">{{ notification.message }}</div>
    <svg-icon class="notification__close" name="close" @click="close" />
  </div>
  <!-- end .notification-->
</template>

<script setup lang="ts">
import type { Notification } from '~~/types/Notification';
import { useNotificationsStore } from '~/stores/notifications';
const props = defineProps<{ notification: Notification }>();
const notifications = useNotificationsStore();
function close() { notifications.remove(props.notification.id); }
</script>

<style lang="stylus" src="./notification.styl" />
