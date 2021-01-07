import { Context } from '@nuxt/types';
import { actionTree, getterTree, mutationTree } from 'typed-vuex';
import Cookies from 'universal-cookie';
import { ExecutionResult } from '~/types/apollo';
import {
  CalendarEvent,
  CurrentPlaying,
  CurrentPlayingTrack,
  GetCalendarEventsQuery,
  GetCurrentPlayingQuery,
  GetGeneralDataQuery,
  Live,
  HistoryItem,
} from '~/graphql/schema';
import GetGeneralData from '~/graphql/queries/GetGeneralData.graphql';
import GetCurrentPlaying from '~/graphql/queries/GetCurrentPlaying.graphql';
import GetCalendarEvents from '~/graphql/queries/GetCalendarEvents.graphql';
import { RootState } from '~/store/index';
import { AudioStatus, AudioType } from '~/components/audio/audio.vue';

export const namespaced = true;

export const state = () => ({
  playingDataState: null as CurrentPlaying | null,
  calendarEventsState: [] as CalendarEvent[],
  tracksHistory: [] as HistoryItem[],
  stationState: null as GetGeneralDataQuery['getStation'] | null,
  streamId: 0 as number,
  volume: 0.9 as number,
  muted: false as boolean,
  status: AudioStatus.stopped as AudioStatus,
  type: AudioType.none as AudioType,
  source: null as string | null,
});

export type PlayerState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_PLAYING_DATA: (_state, payload: CurrentPlaying) => (_state.playingDataState = payload),
  SET_CALENDAR_EVENTS: (_state, payload: CalendarEvent[]) => (_state.calendarEventsState = payload),
  SET_TRACKS_HISTORY: (_state, payload: HistoryItem[]) => (_state.tracksHistory = payload),
  SET_STREAM_ID: (_state, payload: number) => {
    if (process.client && _state.streamId !== payload) new Cookies().set('stream_id', payload);
    _state.streamId = payload;
  },
  SET_VOLUME(_state, payload: number) {
    if (payload > 1) payload = 1;
    else if (payload < 0) payload = 0;

    if (process.client && _state.volume !== payload) new Cookies().set('volume', payload);
    _state.volume = payload;
  },
  SET_MUTED: (_state, payload: boolean) => (_state.muted = payload),
  SET_STATION: (_state, payload: GetGeneralDataQuery['getStation']) => (_state.stationState = payload || []),
  SET_STATUS: (_state, payload: AudioStatus) => (_state.status = payload),
  SET_TYPE: (_state, payload: AudioType) => (_state.type = payload),
  SET_SOURCE: (_state, payload: string | null) => (_state.source = payload),
});

export const getters = getterTree(state, {
  playingData: (_state: PlayerState, _getters): CurrentPlaying =>
    _state.playingDataState || {
      live: _getters.liveData,
      previous: _getters.playingDataTrack('previous'),
      current: _getters.playingDataTrack('current'),
      next: _getters.playingDataTrack('next'),
      timestamp: Date.now(),
      listenersCount: 0,
    },

  liveData: (_state): Live => {
    return (
      (_state.playingDataState && _state.playingDataState.live) || {
        isLive: false,
        streamerName: '',
        broadcastStart: 0,
      }
    );
  },

  playingDataTrack: (_state) => {
    return (name: 'previous' | 'current' | 'next'): CurrentPlayingTrack =>
      (_state.playingDataState && _state.playingDataState[name]) || {
        id: '',
        title: 'Unknown',
        artist: 'Unknown',
        name: 'Unknown - Unknown',
        startsAt: 0,
        endsAt: 0,
        duration: 0,
        art: '',
      };
  },

  track: (_state, _getters) => _getters.playingDataTrack(_getters.trackType) as CurrentPlayingTrack,

  trackType: (_state, _getters, _rootState: RootState): 'next' | 'current' | 'previous' => {
    if (!_getters.liveData.isLive && _getters.playingData.current.duration !== 0) {
      if (_getters.playingData.current.endsAt - _rootState.now <= 0) return 'next';
      if (_getters.playingData.current.startsAt - _rootState.now > 0) return 'previous';
    }
    return 'current';
  },

  artwork: (_state, _getters): string => {
    return _getters.track.art || '/img/player/disc.svg';
  },

  progress: (_state, _getters, _rootState: RootState): number => {
    if (_getters.track.duration) {
      let duration = 1 - (_getters.track.endsAt - _rootState.now) / (_getters.track.duration * 1000);
      if (duration) {
        if (duration > _getters.track.duration) {
          duration = _getters.track.duration;
        } else if (duration < 0) {
          duration = 0;
        }
        return duration;
      }
    }
    return 0;
  },

  station: (_state, _getters): GetGeneralDataQuery['getStation'] =>
    _state.stationState || {
      id: 0,
      name: '',
      description: '',
      mounts: [],
      playlists: {
        m3u: '',
      },
    },
});

export const actions = actionTree(
  {
    state,
    mutations,
    getters,
  },
  {
    async nuxtServerInit({ state, commit, dispatch }, context: Context) {
      const streamId = context.app.$cookies.get('stream_id');
      const volume = context.app.$cookies.get('volume');

      if (streamId) commit('SET_STREAM_ID', parseInt(streamId, 10) || state.streamId);
      if (volume) commit('SET_VOLUME', parseFloat(volume) || state.volume);
      try {
        await dispatch('getGeneralData', context);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },

    nuxtClientInit({ dispatch }, context) {
      setInterval(async () => await dispatch('getCurrentPlaying', context), 10 * 1000);
      setInterval(async () => await dispatch('getCalendarEvents', context), 10 * 60 * 1000);
    },

    async getGeneralData({ commit }, context: Context) {
      const apollo = context?.app.apolloProvider?.defaultClient;
      if (!apollo) return;

      const { data, errors }: ExecutionResult<GetGeneralDataQuery> = await apollo.query({
        query: GetGeneralData,
      });

      if (errors || !data || !data.getCurrentPlaying) return;

      commit('SET_PLAYING_DATA', data.getCurrentPlaying);
      commit('SET_STATION', data.getStation);
      commit('SET_CALENDAR_EVENTS', data.getCalendarEvents);
      commit('SET_TRACKS_HISTORY', data.getTracksHistory as HistoryItem[]);
    },

    async getCalendarEvents({ commit }, context: Context) {
      const apollo = context?.app.apolloProvider?.defaultClient;
      if (!apollo) return;

      const { data, errors }: ExecutionResult<GetCalendarEventsQuery> = await apollo.query({
        query: GetCalendarEvents,
      });

      if (errors || !data || !data.getCalendarEvents) return;

      commit('SET_CALENDAR_EVENTS', data.getCalendarEvents);
    },

    async getCurrentPlaying({ commit }, context: Context) {
      const apollo = context?.app.apolloProvider?.defaultClient;
      if (!apollo) return;

      const { data, errors }: ExecutionResult<GetCurrentPlayingQuery> = await apollo.query({
        query: GetCurrentPlaying,
      });

      if (errors || !data || !data.getCurrentPlaying) return;

      commit('SET_PLAYING_DATA', data.getCurrentPlaying);
    },

    play({ state, commit }, payload: { source?: string; type?: AudioType } | undefined) {
      if (payload?.source) {
        commit('SET_SOURCE', payload.source);
      }
      if (payload?.type) {
        commit('SET_TYPE', payload.type);
      }
      if (state.status === AudioStatus.playing) {
        commit('SET_STATUS', AudioStatus.stopped);
      }
      setTimeout(() => commit('SET_STATUS', AudioStatus.playing), 100);
    },

    pause({ commit }) {
      commit('SET_STATUS', AudioStatus.paused);
    },

    stop({ commit }) {
      commit('SET_TYPE', AudioType.none);
      commit('SET_SOURCE', null);
      commit('SET_STATUS', AudioStatus.stopped);
    },

    setVolume({ commit }, payload: number) {
      const volume = payload > 1 ? 1 : payload < 0 ? 0 : payload;
      commit('SET_VOLUME', volume);
    },

    setMuted({ commit }, payload: boolean) {
      commit('SET_MUTED', payload);
    },
  },
);
