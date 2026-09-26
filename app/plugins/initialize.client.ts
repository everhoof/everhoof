import GetGeneralData from '~~/graphql/queries/GetGeneralData.graphql?raw';
import GetCurrentPlaying from '~~/graphql/queries/GetCurrentPlaying.graphql?raw';
import GetCalendarEvents from '~~/graphql/queries/GetCalendarEvents.graphql?raw';
import type {
  GetGeneralDataQuery,
  GetCurrentPlayingQuery,
  GetCalendarEventsQuery,
} from '~~/graphql/schema';

export default defineNuxtPlugin(() => {
  useAuthStore().initialize();
  const player = usePlayerStore();
  player.initializeCookies();
  const now = useNowStore();
  const graphql = useGraphql();
  const refresh = async () => {
    try {
      const data = await graphql<GetCurrentPlayingQuery>(GetCurrentPlaying);
      if (data.getCurrentPlaying) player.setPlayingData(data.getCurrentPlaying);
      player.tracksHistory = data.getTracksHistory;
    } catch (error) {
      console.error('Current playing request failed:', error);
    }
  };
  const refreshCalendar = async () => {
    try {
      const data = await graphql<GetCalendarEventsQuery>(GetCalendarEvents);
      player.calendarEventsState = data.getCalendarEvents;
    } catch (error) {
      console.error('Calendar request failed:', error);
    }
  };
  const initializeGeneralData = async () => {
    try {
      const data = await graphql<GetGeneralDataQuery>(GetGeneralData);
      player.setGeneralData(data);
    } catch (error) {
      console.error(error);
    }
  };
  onNuxtReady(() => {
    now.start();
    if (!player.stationState) void initializeGeneralData();
    void refresh();
    const playingTimer = setInterval(refresh, 10_000);
    const calendarTimer = setInterval(refreshCalendar, 600_000);
    if (import.meta.hot) import.meta.hot.dispose(() => {
      clearInterval(playingTimer);
      clearInterval(calendarTimer);
      now.stop();
    });
  });
});
