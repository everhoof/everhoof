# Everhoof Radio

Nuxt 4 / Vue 3 site for Everhoof Radio.

## Local development

Use Node 24.21.0 and pnpm 12.6.0. The GraphQL API URL is read at server startup from `NUXT_PUBLIC_GRAPHQL` (default: `http://localhost:4000/graphql`). The browser also needs access to this URL for track search and live updates.

For recordings hosted on another origin, set `NUXT_PUBLIC_AUDIO_BASE` to that origin (for example, `https://everhoof.ru`). By default, recording URLs use the site's own origin.

```bash
pnpm install --frozen-lockfile
pnpm test:mock-api # optional local GraphQL fixture, in a second terminal
pnpm dev
```

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

`pnpm test` starts a temporary Nuxt server and checks direct requests to `/`, `/recordings`, and an unknown path. The generated types can be refreshed with `pnpm typegen` from the checked-in `graphql/schema.graphql`. The public API currently disables GraphQL introspection, so the schema cannot be regenerated from that endpoint without an API-side change.

The app uses a small `$fetch` GraphQL client. Initial station data is requested per SSR request; the browser refreshes playing data every 10 seconds and calendar events every 10 minutes. `apollo-token`, `user_id`, `stream_id`, `volume`, and `i18n_redirected` retain their existing cookie names.

## Manual playback checks

With a reachable API and audio endpoint, check stream play/stop, quality switching, volume and mute, recording play/pause/seek/download, track request search and pagination, browser Media Session controls, language selection via cookie, and navigation between the two pages. Also check desktop and mobile layouts, direct links, console and hydration errors, and a second SSR request with different cookies.

The Node server output is `.output/`. The existing staging/production workflows and `deploy.sh` still target Nuxt 2 and were left untouched; they must be updated before deploying this branch.
