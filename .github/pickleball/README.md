# Wednesday Court Club

## Implemented and remaining

`pickleball/index.html` is the dashboard for `https://www.995studio.com/pickleball/`.
This directory contains an ASP.NET Core API, durable weekly scheduler, Playwright selection worker, tests, and container packaging. GitHub Pages cannot run the backend or a browser worker.

Until an HTTPS backend is provisioned and configured in `pickleball/config.js`, connection and scheduling stay disabled. No sample availability or fake confirmations are displayed.

The worker selects a full two-hour session and opens the waiver dialog. It does **not** accept agreements, sign, pay, click the final Reserve button, or independently verify receipts. A host finishes those steps in the same remote browser and can record a reported confirmation. Full checkout automation needs additional testing on a real intended reservation.

## Group rules

- One designated host books for the group and must attend. Invited friends can view group status; only members with `canManage` can enable/pause the shared schedule.
- Wednesday 19:00–21:00, `America/Los_Angeles`.
- Court A, B, C, then D. Require all four half-hour slots on a single court; no split or partial sessions.
- Prepare at 07:28 the preceding Wednesday; target an attempt at 07:30. OS/network delays mean this is not a hard real-time guarantee.
- Verify Fremont resident eligibility, release timezone, and the two-hour limit before activating. The signed-in policy conflicts with the public page on duration.
- One durable attempt per play date for the group. Do not retry after ambiguous outcomes; inspect the existing session first.
- Pausing stops future jobs and further automatic steps, not reservations already made. Disconnecting the dashboard does not pause the server.

## Required hosting

For the selected GCP VM, use [the dedicated deployment guide](Deploy/README.md). It supplies a self-hosted interactive browser, local-only CDP, HTTPS gateway, and persistent profile. External managed browser providers remain optional; the requirements below apply to that alternative.

1. One ASP.NET Core 8 container/service with HTTPS, durable `/data`, synchronized clock, and no automatic sleeping. The scheduler needs to be running around release time. Deploy outside Wednesday 07:28–07:40. Do not rely on GitHub Actions cron for precise release timing.
2. One isolated, persistent remote Chromium session per host, supporting Playwright over WSS CDP and **interactive human access to that same session**. A read-only video is insufficient. The remote browser provider must preserve the session after CDP disconnect and support login, CAPTCHA, signatures, and checkout.
3. Provisioned endpoints must remain valid through handoff. If your provider uses expiring URLs, implement its lifecycle/renewal API before production. Provider selection and provisioning are not implemented or guessed here.
4. Browser endpoints and live views are sensitive. Keep them in the hosting secret store and use provider access control. Never expose a public unauthenticated CDP port. Sign in to Fremont directly in the private live view. The app does not collect Fremont passwords.

No server, paid resource, remote browser, or active schedule is created by publishing this source.

## Environment

- `CLUB_WEB_ORIGIN=https://www.995studio.com`
- `CLUB_DATA_DIR=/data` — private persistent volume, writable by the container `app` user.
- `CLUB_MEMBERS_JSON` — secret JSON array using this shape:

```json
[
  {"id":"host","name":"Host","tokenHash":"SHA256_HEX_OF_RANDOM_INVITE_KEY","cdpUrl":"wss://PRIVATE_BROWSER_ENDPOINT","liveViewUrl":"https://PRIVATE_INTERACTIVE_VIEW","canManage":true},
  {"id":"friend","name":"Friend","tokenHash":"SHA256_HEX_OF_ANOTHER_INVITE_KEY","cdpUrl":"","liveViewUrl":"","canManage":false}
]
```

Generate unique cryptographically random invite keys (e.g. 32 random bytes encoded as hex), store their SHA256 hashes, and distribute keys privately. Removing or rotating the hash revokes access. Never commit actual credentials, invitation hashes, browser URLs, receipts, or personal details.

Set these only after the prerequisites are satisfied:

- `CLUB_SITE_PERMISSION_CONFIRMED=true`: ACTIVE's terms require prior written permission for bot access.
- `CLUB_RULES_CONFIRMED=true`: confirm resident eligibility, 07:30 Pacific release, and two-hour sessions.

Set `apiOrigin` in `pickleball/config.js` to the deployed HTTPS API origin without a path. This public configuration must not include credentials.

The static dashboard is public but noindex. `noindex` is not access control: all private data and actions are protected by invite-key authentication in the API. Keys stay in tab memory, not localStorage. Responses are no-store; CORS is restricted; request size and rate are limited. Put the API behind a TLS proxy. The single-process rate limiter groups requests by connection address, so adjust proxy-aware rate limiting during hosting setup if necessary.

## Build and verification

From this directory, with .NET 8:

```sh
dotnet build Server/CourtClub.csproj --configuration Release
dotnet run --project Tests/Tests.csproj --configuration Release
dotnet run --project Server/CourtClub.csproj
```

Build the container using this directory as the Docker context. Attach `/data` with correct ownership. Run exactly one replica: a filesystem lease and atomic JSON writes protect state. Back up that private volume. Corruption fails startup instead of silently losing duplicate protection.

Tests cover DST, release boundaries, full-session selection, excluded courts, hashing, concurrency, restart recovery, resume expiry, and reported confirmations. They do not exercise live checkout or prove that a browser provider preserves interactive sessions.

Before launch: provision hosting and the private browser, sign in, test an intended reservation with the host present, confirm full duration and actual fees, complete checkout manually, and verify the receipt. Keep the dashboard open on release morning for action popups. Email, SMS, mobile push, and automatic browser provisioning are not implemented.

## API

- `GET /api/status`: member, readiness blockers, schedule, next release, latest 30 jobs. Only the job owner receives the live-view URL.
- `POST /api/schedule` with `{"enabled":true}` or `false`: designated hosts only. Enabling assigns that host to the shared schedule.
- `POST /api/jobs/{id}/resume`: job owner only, after login within ten minutes of release. Not a general retry.
- `POST /api/jobs/{id}/confirmation` with `{"reference":"..."}`: record a host-reported receipt; no booking or independent verification.
- `GET /health`: process health, not browser readiness.

Respect site restrictions. Do not bypass CAPTCHA, exceed limits, or create accounts to work around them.
