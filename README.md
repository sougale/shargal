# Sharjahbiennial

A curated digital art exhibition platform where collectors browse artworks, bid in live auctions, manage a wallet, and connect with artists — built with React 19, TanStack Start/Router/Query, Firebase, and Appwrite.

**Live product identity:** `sharjahbiennial` · support: `support@sharjahbiennial.online`

---

## What this project is

Sharjahbiennial is a full-stack web app (TanStack Start) that presents a contemporary gallery experience:

- Public exhibition browsing (home, gallery, categories, artists, artwork detail)
- Auctions with countdowns, bidding, and automatic lot closing
- Collector wallet (deposit, withdraw, send, activity, security)
- Auth + user profiles backed by Firebase Auth + Firestore
- Admin console for exhibition, users, and wallet operations
- Contact / notifications via EmailJS
- Live support chat via Chatwoot
- Optional AI image generation with uploads stored in Appwrite Storage

Museum catalogue data for browsing is enriched from the **Art Institute of Chicago** and **The Metropolitan Museum of Art** APIs, loaded through TanStack Query.

---

## How the app works (architecture)

```
Browser
  └─ TanStack Router (file routes under src/routes/)
       └─ Root shell (__root.tsx)
            ├─ QueryClientProvider          → server/API cache
            ├─ StoreProvider                → app UI store
            ├─ FirebaseProvider             → Firebase context
            ├─ WalletProvider               → legacy local wallet shell
            ├─ useAuthListener()            → Auth + Firestore user sync → Zustand
            ├─ useAuctionAutoCloser()       → background auction close logic
            ├─ MegaNav / Footer (public) or Wallet / Admin shells
            └─ Chatwoot widget (hidden on /admin)
```

### Routing & shells

TanStack Router file routes drive the UI. The root route (`src/routes/__root.tsx`) chooses a **shell** from the pathname:

| Area | Path prefix | Shell |
|------|-------------|--------|
| Public site | `/`, `/gallery`, `/artworks/*`, … | `MegaNav` + `PageTransition` + `Footer` |
| Wallet | `/wallet/*` | Wallet theme + loader until auth hydrates |
| Admin | `/admin/*` | Admin theme (no public nav / Chatwoot bubble) |

Route guards and role rules live in `src/lib/routeGuards.ts`. Auth hydration is required before wallet UI renders.

### Authentication & user state

1. Firebase Auth (`src/services/firebase.ts`) handles sign-in / session.
2. `useAuthListener` (`src/hooks/useAuthListener.ts`) listens with `onAuthStateChanged`, loads `users/{uid}` from Firestore, and keeps a realtime `onSnapshot` on that document.
3. State is written into Zustand (`src/store/zustand`) — the single source of truth for `user`, loading, and hydration flags.
4. Connect / profile / wallet screens read from that store rather than calling Auth ad hoc.

### Data sources

| Concern | Where it lives |
|---------|----------------|
| Users, wallets, listings, bids, notifications | Firebase Firestore |
| Auth sessions | Firebase Auth |
| Generated image uploads | Appwrite Storage (`src/services/appwrite.ts`, `src/utils/gen.ts`) |
| Museum artworks / artists (browse enrichment) | Chicago + Met APIs via TanStack Query (`src/queries/`) |
| Transactional / contact email | EmailJS (`src/lib/emailjsTemplate.ts`) |
| Live chat | Chatwoot widget (`src/components/chatwoot.tsx`) |

TanStack Query keys and hooks are centralized under `src/queries/` — see [TANSTACK_QUERY_INTEGRATION.md](./TANSTACK_QUERY_INTEGRATION.md) and [src/queries/README.md](./src/queries/README.md).

### Auctions

- Auction pages under `src/routes/auctions.*.tsx`.
- `useAuctionAutoCloser` runs from the root: when `endsAt` passes it closes the auction, awards the lot to the last bidder as a listing, sends an `auction_won` notification, and cleans up the winning bid document.

### Wallet

Collector wallet routes (`/wallet`, deposit, withdraw, send, activity, security) use the Firebase-backed user document for balances and activity. `WalletProvider` still exists for legacy/local helpers; primary identity and balances come from auth + Firestore.

### Admin

`/admin` routes use `AdminShell` and admin-specific screens (exhibition, users, wallet ops, account). Chatwoot is intentionally hidden here so support UI does not overlap the console.

### Live chat (Chatwoot)

Chatwoot is wired in the **root layout** so it is available on public and wallet surfaces:

- Component: `src/components/chatwoot.tsx`
- Mounted in: `src/routes/__root.tsx` as `<Chatwoot hide={isAdmin} />`
- Inbox: Chatwoot Cloud (`https://app.chatwoot.com`) with the project website token

The SDK script loads once client-side; navigating into `/admin` hides the bubble, leaving admin keeps it visible.

### Email

EmailJS templates in `src/lib/emailjsTemplate.ts` distinguish:

- **User** messages → visitor/collector inbox
- **Admin** messages → always `support@sharjahbiennial.online`

Used from contact form, registration, bids, listings, and similar activity types.

### UI & design

- Tailwind CSS 4 with gallery tokens (`canvas`, `ink`, `detail`, display serif)
- Shared site components under `src/components/site/`
- Radix-based primitives under `src/components/ui/`
- Motion-based page transitions via `PageTransition`

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | TanStack Start (Vite + React 19) |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query |
| Client auth state | Zustand + Firebase listeners |
| Backend data | Firebase Auth + Firestore |
| File storage | Appwrite Storage |
| Styling | Tailwind CSS 4 |
| Motion | `motion` |
| Forms | react-hook-form + zod |
| Email | EmailJS |
| Support chat | Chatwoot |
| Deploy | Render (`render.yaml`, `RENDER_DEPLOYMENT.md`) |

---

## Project structure (high level)

```
src/
  components/
    chatwoot.tsx          # Chatwoot live-chat widget
    site/                 # Gallery UI (nav, cards, hero, filters, …)
    wallet/               # Wallet shell, forms, loaders
    admin/                # Admin shell & tables
    ui/                   # Design-system primitives
  hooks/                  # Auth, auctions, Firebase, museum data
  lib/                    # Stores, guards, email, site info, wallet helpers
  providers/              # FirebaseProvider
  queries/                # TanStack Query hooks (Met, Chicago, Firebase)
  routes/                 # File-based routes (public, wallet, admin)
  services/               # firebase.ts, appwrite.ts, metApi.ts
  store/                  # Zustand stores
  types/                  # Shared TypeScript types
  utils/                  # Image generation / Appwrite upload helpers
```

---

## Getting started

### Prerequisites

- Node.js 20+ (or Bun)
- npm / bun
- Access to the Firebase project, Appwrite project, EmailJS account, and Chatwoot inbox used by this app

### Install & run

```bash
npm install
npm run dev
```

Dev server defaults to port **8080** (`vite.config.ts`).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Serve production build (`scripts/start-prod.cjs`) |
| `npm run preview` | Vite preview |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run clean` | Remove build caches |

### Environment

Vite loads `VITE_*` variables from `.env` / `.env.local`. Firebase, Appwrite, EmailJS, and the Chatwoot website token are currently configured in source/service modules for this project; prefer moving secrets into env vars before a public production hardening pass.

---

## Main user journeys

1. **Browse** — Home carousel and category chips → gallery / artwork detail → artist pages (Chicago/Met enrichment + local listings).
2. **Connect** — `/connect` signs the collector in; Firestore user doc hydrates wallet/profile.
3. **Bid / buy** — Auction detail + bids; auto-closer finalizes lots; notifications fire via EmailJS / in-app list.
4. **Wallet** — Deposit, withdraw, send, activity under `/wallet/*` after auth hydration.
5. **Sell / generate** — Listing and optional AI generation flows; generated assets can land in Appwrite Storage.
6. **Contact / support** — `/contact` form (EmailJS) plus the Chatwoot bubble on non-admin pages.
7. **Admin** — Moderators manage exhibition content, users, and wallet operations under `/admin`.

---

## Related docs

- [TANSTACK_QUERY_INTEGRATION.md](./TANSTACK_QUERY_INTEGRATION.md) — Query architecture for museum APIs
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) — Deploying to Render
- [IMAGE_GENERATION_GUIDE.md](./IMAGE_GENERATION_GUIDE.md) — Generation / upload flow
- [src/queries/README.md](./src/queries/README.md) — Query module notes

---

## Deployment

The app targets **Render** via `render.yaml` and a Node production entry (`scripts/start-prod.cjs` / `render-server.js`). Follow [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for Blueprint or manual web-service setup.

---

## Notes for contributors

- Do **not** call React Query hooks inside `__root.tsx` above `QueryClientProvider`; keep them in child route components.
- Prefer stable Zustand selectors (module-scope) when reading auth state to avoid `useSyncExternalStore` snapshot loops.
- Keep Chatwoot mounted only once at the root; use the `hide` prop for surfaces that should not show the bubble.
- Preserve the three-shell layout (public / wallet / admin) when adding new routes.
