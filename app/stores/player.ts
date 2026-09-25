import { defineStore } from 'pinia';
import type { CalendarEvent, CurrentPlaying, CurrentPlayingTrack, GetGeneralDataQuery, GetRecordsQuery } from '~~/graphql/schema';
import { useNowStore } from './now';

export enum AudioStatus { playing = 'playing', paused = 'paused', stopped = 'stopped' }
export enum AudioType { none = 'none', stream = 'stream', recording = 'recording' }

const emptyTrack: CurrentPlayingTrack = { id: '', title: 'Unknown', artist: 'Unknown', name: 'Unknown - Unknown', startsAt: 0, endsAt: 0, duration: 0, art: '' };
const emptyPlaying: CurrentPlaying = { live: { isLive: false, streamerName: '', broadcastStart: 0 }, previous: emptyTrack, current: emptyTrack, next: emptyTrack, timestamp: 0, listenersCount: 0 };
type Station = GetGeneralDataQuery['getStation'];
const emptyStation: Station = { id: 0, name: '', description: '', mounts: [], playlists: { m3u: '' } };
type Recording = GetRecordsQuery['getRecordings'][number];
const emptyRecording: Recording = { id: 0, beginsAt: '', description: '', fileSize: 0 };

export const usePlayerStore = defineStore('player', () => {
  const playingDataState = ref<CurrentPlaying | null>(null);
  const calendarEventsState = ref<CalendarEvent[]>([]);
  const tracksHistory = ref<GetGeneralDataQuery['getTracksHistory']>([]);
  const stationState = ref<Station | null>(null);
  const recordings = ref<GetRecordsQuery['getRecordings']>([]);
  const streamId = ref(0);
  const volume = ref(0.9);
  const muted = ref(false);
  const status = ref<AudioStatus>(AudioStatus.stopped);
  const type = ref<AudioType>(AudioType.none);
  const source = ref<string | null>(null);
  const recordingId = ref(0);
  const duration = ref(0);
  const recordingProgress = ref(0);
  const updateRecordingProgress = ref(-1);
  const offset = ref(0);
  const playingData = computed(() => playingDataState.value || emptyPlaying);
  const liveData = computed(() => playingData.value.live);
  const station = computed(() => stationState.value || emptyStation);
  const now = useNowStore();
  const trackType = computed<'next' | 'current' | 'previous'>(() => {
    if (!liveData.value.isLive && playingData.value.current.duration) {
      if (playingData.value.current.endsAt - now.now + offset.value <= 0) return 'next';
      if (playingData.value.current.startsAt - now.now + offset.value > 0) return 'previous';
    }
    return 'current';
  });
  const track = computed(() => playingData.value[trackType.value] || emptyTrack);
  const artwork = computed(() => track.value.art || '/img/player/disc.svg');
  const progress = computed(() => track.value.duration ? Math.min(1, Math.max(0, 1 - (track.value.endsAt - now.now + offset.value) / (track.value.duration * 1000))) : 0);
  const recording = computed(() => recordings.value[recordingId.value] || emptyRecording);

  function initializeCookies() {
    const stream = useCookie<string | null>('stream_id');
    const savedVolume = useCookie<string | null>('volume');
    streamId.value = Number(stream.value) || 0;
    const parsed = Number(savedVolume.value);
    volume.value = savedVolume.value !== null && Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0.9;
  }
  function setPlayingData(data: CurrentPlaying) {
    playingDataState.value = data;
    offset.value = Date.now() - data.timestamp;
  }
  function setGeneralData(data: GetGeneralDataQuery) {
    if (data.getCurrentPlaying) setPlayingData(data.getCurrentPlaying);
    stationState.value = data.getStation;
    calendarEventsState.value = data.getCalendarEvents;
    tracksHistory.value = data.getTracksHistory;
    recordings.value = data.getRecordings;
  }
  function setStreamId(value: number) {
    streamId.value = value;
    if (import.meta.client) useCookie('stream_id').value = String(value);
  }
  function setVolume(value: number) {
    volume.value = Math.min(1, Math.max(0, value));
    if (import.meta.client) useCookie('volume').value = String(volume.value);
  }
  function play(payload?: { source?: string; type?: AudioType }) {
    if (payload?.source) source.value = payload.source;
    else if (payload?.type === AudioType.recording) source.value = `/LiveEventAsset/audio?eventId=${recording.value.id}`;
    if (payload?.type) type.value = payload.type;
    status.value = AudioStatus.playing;
  }
  function pause() { status.value = AudioStatus.paused; }
  function stop() { status.value = AudioStatus.stopped; type.value = AudioType.none; source.value = null; }
  function setRecordingId(value: number) {
    if (recordingId.value !== value) { recordingId.value = value; setProgress(0); }
  }
  function setProgress(value: number) { recordingProgress.value = value; updateRecordingProgress.value = value; }
  return { playingDataState, calendarEventsState, tracksHistory, stationState, recordings, streamId, volume, muted, status, type, source, recordingId, duration, recordingProgress, updateRecordingProgress, offset, playingData, liveData, station, trackType, track, artwork, progress, recording, initializeCookies, setPlayingData, setGeneralData, setStreamId, setVolume, play, pause, stop, setRecordingId, setProgress };
});
