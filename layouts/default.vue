<template>
  <div class="page__wrapper">
    <b-audio ref="audio" />
    <div class="page__header" />
    <div class="page__main">
      <div class="page__content">
        <nuxt />
      </div>
    </div>
    <div class="page__notifications">
      <b-notification
        v-for="notification in notifications"
        :key="notification.id"
        class="page__notification"
        :notification="notification"
      />
    </div>
  </div>
</template>
<script lang="ts">
import '~/assets/stylus/normalize.styl';
import '~/assets/stylus/grid.styl';
import '~/assets/stylus/global.styl';
import '~/assets/stylus/colors.styl';
import { Component, Vue, ProvideReactive } from 'nuxt-property-decorator';
import BPlayer from '~/components/player/player.vue';
import BNotification from '~/components/notification/notification.vue';
import { Notification } from '~/types/Notification';
import BAudio from '~/components/audio/audio.vue';

@Component({
  head() {
    return {
      title: this.$accessor.player.station.name || 'Radio',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$accessor.player.station.description || '',
        },
      ],
    };
  },
  components: { BAudio, BNotification, BPlayer },
})
export default class Default extends Vue {
  @ProvideReactive('audio') audio?: BAudio;

  mounted() {
    this.audio = this.$refs.audio as BAudio;
  }

  get notifications(): Notification[] {
    return this.$accessor.notifications.notifications;
  }
}
</script>
<style lang="stylus" src="./default.styl" />
