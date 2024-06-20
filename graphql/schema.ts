export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  getCalendarEvents: Array<CalendarEvent>;
  getRecordings: Array<Recording>;
  getStation: Station;
  getCurrentPlaying?: Maybe<CurrentPlaying>;
  getTracksHistory: Array<HistoryItem>;
  searchTracks: TrackSearchResponse;
  requestTrack: TrackRequestResponse;
  getHello: Scalars['String'];
};

export type QuerySearchTracksArgs = {
  page?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
};

export type QueryRequestTrackArgs = {
  songId: Scalars['String'];
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  summary: Scalars['String'];
  startsAt: Scalars['Float'];
  endsAt: Scalars['Float'];
  preview: Scalars['String'];
  notify: Scalars['Boolean'];
  recording: Scalars['Boolean'];
};

export type Recording = {
  __typename?: 'Recording';
  id: Scalars['Float'];
  beginsAt: Scalars['String'];
  description: Scalars['String'];
  fileSize: Scalars['Float'];
};

export type Station = {
  __typename?: 'Station';
  id: Scalars['Float'];
  name: Scalars['String'];
  shortcode: Scalars['String'];
  description: Scalars['String'];
  frontend: Scalars['String'];
  backend: Scalars['String'];
  listenUrl: Scalars['String'];
  public: Scalars['Boolean'];
  playlists: Playlists;
  mounts: Array<Mount>;
};

export type Playlists = {
  __typename?: 'Playlists';
  m3u: Scalars['String'];
  pls: Scalars['String'];
};

export type Mount = {
  __typename?: 'Mount';
  path: Scalars['String'];
  default: Scalars['Boolean'];
  id: Scalars['Float'];
  name: Scalars['String'];
  url: Scalars['String'];
  bitrate?: Maybe<Scalars['Float']>;
  format?: Maybe<Scalars['String']>;
  listeners: Listeners;
};

export type Listeners = {
  __typename?: 'Listeners';
  current: Scalars['Float'];
  unique: Scalars['Float'];
  total: Scalars['Float'];
};

export type CurrentPlaying = {
  __typename?: 'CurrentPlaying';
  previous: CurrentPlayingTrack;
  current: CurrentPlayingTrack;
  next: CurrentPlayingTrack;
  live: Live;
  timestamp: Scalars['Float'];
  listenersCount: Scalars['Float'];
};

export type CurrentPlayingTrack = {
  __typename?: 'CurrentPlayingTrack';
  id: Scalars['String'];
  name: Scalars['String'];
  title: Scalars['String'];
  artist: Scalars['String'];
  startsAt: Scalars['Float'];
  endsAt: Scalars['Float'];
  duration: Scalars['Float'];
  art: Scalars['String'];
};

export type Live = {
  __typename?: 'Live';
  isLive: Scalars['Boolean'];
  streamerName: Scalars['String'];
  broadcastStart: Scalars['Float'];
};

export type HistoryItem = {
  __typename?: 'HistoryItem';
  id: Scalars['Float'];
  playedAt: Scalars['Float'];
  duration: Scalars['Float'];
  playlist: Scalars['String'];
  streamer: Scalars['String'];
  isRequest: Scalars['Boolean'];
  track: Track;
};

export type Track = {
  __typename?: 'Track';
  id: Scalars['String'];
  text: Scalars['String'];
  artist: Scalars['String'];
  title: Scalars['String'];
  album: Scalars['String'];
  lyrics: Scalars['String'];
  art: Scalars['String'];
};

export type TrackSearchResponse = {
  __typename?: 'TrackSearchResponse';
  page: Scalars['Int'];
  count: Scalars['Int'];
  total: Scalars['Int'];
  items: Array<TrackSearchItem>;
};

export type TrackSearchItem = {
  __typename?: 'TrackSearchItem';
  requestId: Scalars['String'];
  track: Track;
};

export type TrackRequestResponse = {
  __typename?: 'TrackRequestResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type GetCalendarEventsQueryVariables = Exact<{ [key: string]: never }>;

export type GetCalendarEventsQuery = { __typename?: 'Query' } & {
  getCalendarEvents: Array<
    { __typename?: 'CalendarEvent' } & Pick<
      CalendarEvent,
      'summary' | 'startsAt' | 'endsAt' | 'preview' | 'notify' | 'recording'
    >
  >;
};

export type GetCurrentPlayingQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentPlayingQuery = { __typename?: 'Query' } & {
  getCurrentPlaying?: Maybe<
    { __typename?: 'CurrentPlaying' } & Pick<CurrentPlaying, 'listenersCount' | 'timestamp'> & {
        live: { __typename?: 'Live' } & Pick<Live, 'isLive' | 'streamerName' | 'broadcastStart'>;
        previous: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        current: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        next: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
      }
  >;
  getTracksHistory: Array<{ __typename?: 'HistoryItem' } & { track: { __typename?: 'Track' } & Pick<Track, 'text'> }>;
};

export type GetGeneralDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetGeneralDataQuery = { __typename?: 'Query' } & {
  getCurrentPlaying?: Maybe<
    { __typename?: 'CurrentPlaying' } & Pick<CurrentPlaying, 'listenersCount' | 'timestamp'> & {
        live: { __typename?: 'Live' } & Pick<Live, 'isLive' | 'streamerName' | 'broadcastStart'>;
        previous: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        current: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        next: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
      }
  >;
  getCalendarEvents: Array<
    { __typename?: 'CalendarEvent' } & Pick<
      CalendarEvent,
      'summary' | 'startsAt' | 'endsAt' | 'preview' | 'notify' | 'recording'
    >
  >;
  getTracksHistory: Array<{ __typename?: 'HistoryItem' } & { track: { __typename?: 'Track' } & Pick<Track, 'text'> }>;
  getStation: { __typename?: 'Station' } & Pick<Station, 'id' | 'name' | 'description'> & {
      playlists: { __typename?: 'Playlists' } & Pick<Playlists, 'm3u'>;
      mounts: Array<
        { __typename?: 'Mount' } & Pick<Mount, 'id' | 'default' | 'path' | 'name' | 'url' | 'bitrate' | 'format'>
      >;
    };
  getRecordings: Array<{ __typename?: 'Recording' } & Pick<Recording, 'id' | 'beginsAt' | 'description' | 'fileSize'>>;
};

export type GetRecordsQueryVariables = Exact<{ [key: string]: never }>;

export type GetRecordsQuery = { __typename?: 'Query' } & {
  getRecordings: Array<{ __typename?: 'Recording' } & Pick<Recording, 'id' | 'beginsAt' | 'description' | 'fileSize'>>;
};

export type RequestTrackQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type RequestTrackQuery = { __typename?: 'Query' } & {
  requestTrack: { __typename?: 'TrackRequestResponse' } & Pick<TrackRequestResponse, 'success' | 'message'>;
};

export type SearchTracksQueryVariables = Exact<{
  count?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
}>;

export type SearchTracksQuery = { __typename?: 'Query' } & {
  searchTracks: { __typename?: 'TrackSearchResponse' } & Pick<TrackSearchResponse, 'page' | 'count' | 'total'> & {
      items: Array<
        { __typename?: 'TrackSearchItem' } & Pick<TrackSearchItem, 'requestId'> & {
            track: { __typename?: 'Track' } & Pick<Track, 'id' | 'title' | 'artist'>;
          }
      >;
    };
};
