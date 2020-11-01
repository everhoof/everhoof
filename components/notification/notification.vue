<template>
  <!-- begin .notification-->
  <div class="notification">
    <div class="notification__message">{{ notification.message }}</div>
    <svg-icon class="notification__close" name="close" @click="close" />
  </div>
  <!-- end .notification-->
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Notification as NotificationType } from '~/types/Notification';

@Component({
  name: 'b-notification',
})
export default class Notification extends Vue {
  @Prop({ required: true }) notification!: NotificationType;

  close() {
    this.$accessor.notifications.REMOVE_NOTIFICATION(this.notification.id);
  }
}
</script>

<style lang="stylus" src="./notification.styl" />
