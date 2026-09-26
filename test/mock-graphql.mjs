import { createServer } from 'node:http';

const now = Date.now();
const track = (id, title, startsAt) => ({
  id, title, artist: 'Fixture Artist', name: `Fixture Artist - ${title}`, startsAt, endsAt: startsAt + 180_000, duration: 180, art: '',
});
const currentPlaying = {
  live: {
    isLive: false, streamerName: '', broadcastStart: 0,
  },
  previous: track('1', 'Previous', now - 180_000),
  current: track('2', 'Current', now),
  next: track('3', 'Next', now + 180_000),
  timestamp: now,
  listenersCount: 12,
};
const getStation = {
  id: 1,
  name: 'Everhoof Fixture Radio',
  description: 'Local GraphQL fixture',
  playlists: {
    m3u: '/fixture.m3u',
  },
  mounts: [{
    id: 1, default: true, path: '/fixture.ogg', name: 'Fixture stream', url: '/fixture.ogg', bitrate: 128, format: 'ogg',
  }],
};
const getCalendarEvents = [{
  summary: 'Fixture show', startsAt: now + 3_600_000, endsAt: now + 7_200_000, preview: '', notify: false, recording: false,
}];
const getTracksHistory = [{
  track: {
    text: 'Fixture Artist - Previous',
  },
}];
const getRecordings = [{
  id: 10, beginsAt: new Date(now - 86_400_000).toISOString(), description: 'Fixture recording', fileSize: 42,
}];
const server = createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', request.headers.origin || '*');
  response.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (request.method === 'OPTIONS') {
    response.writeHead(204).end();
    return;
  }
  if (request.method !== 'POST' || !request.url?.startsWith('/graphql')) {
    response.writeHead(404).end();
    return;
  }
  let body = '';
  for await (const chunk of request) body += chunk;
  const { query = '', variables = {} } = JSON.parse(body);
  let data;
  if (query.includes('GetGeneralData')) {
    const testUser = request.headers.cookie?.match(/(?:^|;\s*)test_user=([^;]+)/)?.[1];
    data = {
      getCurrentPlaying: currentPlaying,
      getStation: {
        ...getStation, name: testUser ? `${getStation.name} ${testUser}` : getStation.name,
      },
      getCalendarEvents,
      getTracksHistory,
      getRecordings,
    };
  } else if (query.includes('GetCurrentPlaying')) data = {
    getCurrentPlaying: currentPlaying, getTracksHistory,
  };
  else if (query.includes('GetCalendarEvents')) data = {
    getCalendarEvents,
  };
  else if (query.includes('SearchTracks')) data = {
    searchTracks: {
      page: variables.page || 1,
      count: variables.count || 7,
      total: 1,
      items: [{
        requestId: '2',
        track: {
          id: '2', title: 'Current', artist: 'Fixture Artist',
        },
      }],
    },
  };
  else if (query.includes('RequestTrack')) data = {
    requestTrack: {
      success: true, message: 'Fixture request accepted',
    },
  };
  else data = {};
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({
    data,
  }));
});
const port = Number(process.env.MOCK_GRAPHQL_PORT || 4000);
server.listen(port, () => console.log(`Mock GraphQL listening on http://localhost:${port}/graphql`));
