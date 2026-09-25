/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  endsAt: Scalars['Float']['output'];
  notify: Scalars['Boolean']['output'];
  preview: Scalars['String']['output'];
  recording: Scalars['Boolean']['output'];
  startsAt: Scalars['Float']['output'];
  summary: Scalars['String']['output'];
};

export type CurrentPlaying = {
  __typename?: 'CurrentPlaying';
  current: CurrentPlayingTrack;
  listenersCount: Scalars['Float']['output'];
  live: Live;
  next: CurrentPlayingTrack;
  previous: CurrentPlayingTrack;
  timestamp: Scalars['Float']['output'];
};

export type CurrentPlayingTrack = {
  __typename?: 'CurrentPlayingTrack';
  art: Scalars['String']['output'];
  artist: Scalars['String']['output'];
  duration: Scalars['Float']['output'];
  endsAt: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  startsAt: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type HistoryItem = {
  __typename?: 'HistoryItem';
  duration: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  isRequest: Scalars['Boolean']['output'];
  playedAt: Scalars['Float']['output'];
  playlist: Scalars['String']['output'];
  streamer: Scalars['String']['output'];
  track: Track;
};

export type Listeners = {
  __typename?: 'Listeners';
  current: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  unique: Scalars['Float']['output'];
};

export type Live = {
  __typename?: 'Live';
  broadcastStart: Scalars['Float']['output'];
  isLive: Scalars['Boolean']['output'];
  streamerName: Scalars['String']['output'];
};

export type Mount = {
  __typename?: 'Mount';
  bitrate?: Maybe<Scalars['Float']['output']>;
  default: Scalars['Boolean']['output'];
  format?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  listeners: Listeners;
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Playlists = {
  __typename?: 'Playlists';
  m3u: Scalars['String']['output'];
  pls: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getCalendarEvents: Array<CalendarEvent>;
  getCurrentPlaying?: Maybe<CurrentPlaying>;
  getHello: Scalars['String']['output'];
  getRecordings: Array<Recording>;
  getStation: Station;
  getTracksHistory: Array<HistoryItem>;
  requestTrack: TrackRequestResponse;
  searchTracks: TrackSearchResponse;
};


export type QueryRequestTrackArgs = {
  songId: Scalars['String']['input'];
};


export type QuerySearchTracksArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};

export type Recording = {
  __typename?: 'Recording';
  beginsAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  fileSize: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
};

export type Station = {
  __typename?: 'Station';
  backend: Scalars['String']['output'];
  description: Scalars['String']['output'];
  frontend: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  listenUrl: Scalars['String']['output'];
  mounts: Array<Mount>;
  name: Scalars['String']['output'];
  playlists: Playlists;
  public: Scalars['Boolean']['output'];
  shortcode: Scalars['String']['output'];
};

export type Track = {
  __typename?: 'Track';
  album: Scalars['String']['output'];
  art: Scalars['String']['output'];
  artist: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lyrics: Scalars['String']['output'];
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type TrackRequestResponse = {
  __typename?: 'TrackRequestResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type TrackSearchItem = {
  __typename?: 'TrackSearchItem';
  requestId: Scalars['String']['output'];
  track: Track;
};

export type TrackSearchResponse = {
  __typename?: 'TrackSearchResponse';
  count: Scalars['Int']['output'];
  items: Array<TrackSearchItem>;
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type GetCalendarEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCalendarEventsQuery = { getCalendarEvents: Array<{ summary: string, startsAt: number, endsAt: number, preview: string, notify: boolean, recording: boolean }> };

export type GetCurrentPlayingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentPlayingQuery = { getCurrentPlaying: { listenersCount: number, timestamp: number, live: { isLive: boolean, streamerName: string, broadcastStart: number }, previous: { id: string, name: string, title: string, artist: string, startsAt: number, endsAt: number, duration: number, art: string }, current: { id: string, name: string, title: string, artist: string, startsAt: number, endsAt: number, duration: number, art: string }, next: { id: string, name: string, title: string, artist: string, startsAt: number, endsAt: number, duration: number, art: string } } | null, getTracksHistory: Array<{ track: { text: string } }> };

export type GetGeneralDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGeneralDataQuery = { getCurrentPlaying: { listenersCount: number, timestamp: number, live: { isLive: boolean, streamerName: string, broadcastStart: number }, previous: { id: string, name: string, title: string, artist: string, startsAt: number, endsAt: number, duration: number, art: string }, current: { id: string, name: string, title: string, artist: string, startsAt: number, endsAt: number, duration: number, art: string }, next: { id: string, name: string, title: string, artist: string, startsAt: number, endsAt: number, duration: number, art: string } } | null, getCalendarEvents: Array<{ summary: string, startsAt: number, endsAt: number, preview: string, notify: boolean, recording: boolean }>, getTracksHistory: Array<{ track: { text: string } }>, getStation: { id: number, name: string, description: string, playlists: { m3u: string }, mounts: Array<{ id: number, default: boolean, path: string, name: string, url: string, bitrate: number | null, format: string | null }> }, getRecordings: Array<{ id: number, beginsAt: string, description: string, fileSize: number }> };

export type GetRecordsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecordsQuery = { getRecordings: Array<{ id: number, beginsAt: string, description: string, fileSize: number }> };

export type RequestTrackQueryVariables = Exact<{
  id: string;
}>;


export type RequestTrackQuery = { requestTrack: { success: boolean, message: string } };

export type SearchTracksQueryVariables = Exact<{
  count?: number | null | undefined;
  page?: number | null | undefined;
  q?: string | null | undefined;
}>;


export type SearchTracksQuery = { searchTracks: { page: number, count: number, total: number, items: Array<{ requestId: string, track: { id: string, title: string, artist: string } }> } };
