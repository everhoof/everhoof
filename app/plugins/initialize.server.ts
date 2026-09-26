import GetGeneralData from '~~/graphql/queries/GetGeneralData.graphql?raw';
import type { GetGeneralDataQuery } from '~~/graphql/schema';
import { useAuthStore } from '~/stores/auth';
import { usePlayerStore } from '~/stores/player';
import { useNowStore } from '~/stores/now';

export default defineNuxtPlugin(async () => {
  useAuthStore().initialize();
  useNowStore().now = Date.now();
  const player = usePlayerStore();
  player.initializeCookies();
  try {
    player.setGeneralData(await useGraphql()<GetGeneralDataQuery>(GetGeneralData));
  } catch (error) {
    console.error('General data request failed:', error);
  }
});
