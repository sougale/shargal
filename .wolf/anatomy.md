# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-08-11T22:59:56.862Z
> Files: 212 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `.DS_Store` (~2186 tok)
- `.gitignore` — Git ignore rules (~12 tok)
- `bunfig.toml` (~80 tok)
- `CLAUDE.md` — OpenWolf (~57 tok)
- `components.json` (~127 tok)
- `eslint.config.js` — ESLint flat configuration (~358 tok)
- `IMAGE_GENERATION_GUIDE.md` — AI Image Generation Guide (~1457 tok)
- `package-lock.json` — npm lock file (~107220 tok)
- `package.json` — Node.js package manifest (~1022 tok)
- `README.md` — Project documentation (~2364 tok)
- `RENDER_DEPLOYMENT.md` — Deploying Starstruck Gallery to Render (~1118 tok)
- `render-server.js` — render-server.js (~1230 tok)
- `render.yaml` (~174 tok)
- `TANSTACK_QUERY_INTEGRATION.md` — TanStack Query Integration Guide (~2779 tok)
- `tsconfig.json` — TypeScript configuration (~192 tok)
- `vite.config.ts` — Vite build configuration (~341 tok)
- `wrangler.jsonc` (~54 tok)

## .claude/

- `settings.json` (~441 tok)

## .claude/rules/

- `openwolf.md` (~313 tok)

## .continue/rules/

- `admin-route-protection.md` (~95 tok)

## scripts/

- `ensure-dist.cjs` — Fail fast on Render/start if the production build is missing. (~306 tok)
- `fix-tanstack-server-core.cjs` — Safety script to detect and remove corrupted @tanstack/start-server-core files. (~516 tok)
- `start-prod.cjs` — Production start for Render. (~374 tok)

## src/

- `.DS_Store` (~2186 tok)
- `redundantCode.ts` — import { Result, State, TxType, WalletAccount, WalletTx } from "@/types"; (~8650 tok)
- `router.tsx` — getRouter (~292 tok)
- `routeTree.gen.ts` — @ts-nocheck (~6977 tok)
- `server.ts` — API routes: GET (1 endpoints) (~712 tok)
- `start.ts` — Exports startInstance (~177 tok)
- `styles.css` — Styles: 39 rules, 80 vars, 1 media queries, 5 animations, 1 layers (~2522 tok)

## src/assets/

- `.DS_Store` (~2186 tok)

## src/components/

- `chatwoot.tsx` — When true, the launcher bubble is hidden (e.g. on admin routes). (~566 tok)

## src/components/admin/

- `AdminLoader.tsx` — Full viewport overlay — use for initial dashboard hydration or blocking actions (~2168 tok)
- `AdminShell.tsx` — NAV — uses useState, useNavigate (~2580 tok)
- `primitives.tsx` — BentoCard — renders table (~2891 tok)
- `RecordSheet.tsx` — Generic admin record viewer / editor. (~3881 tok)

## src/components/site/

- `AccountStatusBlocker.tsx` — Optional override - otherwise reads from auth store (~922 tok)
- `ActiveFilterChips.tsx` — ActiveFilterChips (~763 tok)
- `ArtistSpotlight.tsx` — ArtistSpotlight (~440 tok)
- `ArtworkCard.tsx` — ArtworkCard (~450 tok)
- `AuctionCard.tsx` — AuctionCard (~1273 tok)
- `AuctionImageSwiper.tsx` — Swipable image carousel for an auction lot card. (~944 tok)
- `CategoryChips.tsx` — Horizontal chip list that automatically scrolls the clicked chip to the center. (~445 tok)
- `Countdown.tsx` — diff — uses useEffect (~794 tok)
- `FaqAccordion.tsx` — FaqAccordion (~425 tok)
- `Fields.tsx` — Special display formatting. (~2571 tok)
- `FilterDrawer.tsx` — import { Slider } from "@/components/ui/slider"; (~2245 tok)
- `filters-types.ts` — Exports Filters, makeDefaultFilters, isDefault, MultiKey (~347 tok)
- `Footer.tsx` — Footer — renders form (~990 tok)
- `HeroCarousel.tsx` — shuffle — uses useState, useEffect (~1853 tok)
- `HistoryTimeline.tsx` — HistoryTimeline (~256 tok)
- `ImageCarousel.tsx` — ImageCarousel — uses useState, useCallback, useEffect (~1285 tok)
- `ImageGenerator.tsx` — ImageGenerator — uses useState (~1234 tok)
- `ImageUploader.tsx` — ImageUploader (~1202 tok)
- `Loader.tsx` — Size of the loader (~1139 tok)
- `MasonryGallery.tsx` — MasonryGallery (~269 tok)
- `MegaNav.tsx` — ICON_STROKE — uses useState, useEffect (~6377 tok)
- `Nav.tsx` — links — uses useState (~682 tok)
- `NotificationBell.tsx` — Module-scoped selector (per project rule). useShallow provides stable shallow equality. (~2141 tok)
- `NotificationsList.tsx` — NotificationsList (~1568 tok)
- `PageHeader.tsx` — PageHeader (~191 tok)
- `PageTransition.tsx` — Passthrough wrapper for route content. (~156 tok)
- `PartnerReasons.tsx` — PartnerReasons (~486 tok)
- `SmartImage.tsx` — Must pass real dimensions — prevents layout shift (~920 tok)
- `Sponsors.tsx` — Sponsors (~386 tok)
- `WalletGate.tsx` — WalletGate (~692 tok)

## src/components/ui/

- `accordion.tsx` — Accordion (~576 tok)
- `alert-dialog.tsx` — AlertDialog (~1196 tok)
- `alert.tsx` — alertVariants (~454 tok)
- `aspect-ratio.tsx` — AspectRatio (~41 tok)
- `avatar.tsx` — Avatar (~404 tok)
- `badge.tsx` — badgeVariants (~321 tok)
- `breadcrumb.tsx` — Breadcrumb (~786 tok)
- `button.tsx` — buttonVariants (~542 tok)
- `calendar.tsx` — Calendar — uses useEffect (~2060 tok)
- `card.tsx` — Card (~520 tok)
- `carousel.tsx` — CarouselContext — uses useContext, useState, useCallback, useEffect (~1772 tok)
- `chart.tsx` — Format: { THEME_NAME: CSS_SELECTOR } (~3020 tok)
- `checkbox.tsx` — Checkbox (~298 tok)
- `collapsible.tsx` — Collapsible (~96 tok)
- `command.tsx` — Command — renders modal (~1394 tok)
- `context-menu.tsx` — ContextMenu (~2112 tok)
- `dialog.tsx` — Dialog — renders modal (~1093 tok)
- `drawer.tsx` — Drawer — renders modal (~850 tok)
- `dropdown-menu.tsx` — DropdownMenu (~2171 tok)
- `form.tsx` — Form — renders form — uses useContext (~1201 tok)
- `hover-card.tsx` — HoverCard (~356 tok)
- `input-otp.tsx` — InputOTP — uses useContext (~618 tok)
- `input.tsx` — Input (~222 tok)
- `label.tsx` — labelVariants (~205 tok)
- `menubar.tsx` — MenubarMenu (~2442 tok)
- `navigation-menu.tsx` — NavigationMenu (~1472 tok)
- `pagination.tsx` — Pagination (~783 tok)
- `popover.tsx` — Popover (~387 tok)
- `progress.tsx` — Progress (~224 tok)
- `radio-group.tsx` — RadioGroup (~402 tok)
- `resizable.tsx` — ResizablePanelGroup (~444 tok)
- `scroll-area.tsx` — ScrollArea (~468 tok)
- `select.tsx` — Select (~1643 tok)
- `separator.tsx` — Separator (~207 tok)
- `sheet.tsx` — Sheet (~1214 tok)
- `sidebar.tsx` — SIDEBAR_COOKIE_NAME — uses useContext, useState, useCallback, useEffect (~6850 tok)
- `skeleton.tsx` — Skeleton (~69 tok)
- `slider.tsx` — Slider (~293 tok)
- `sonner.tsx` — Toaster (~210 tok)
- `switch.tsx` — Switch (~331 tok)
- `table.tsx` — Table — renders table (~806 tok)
- `tabs.tsx` — Tabs (~553 tok)
- `textarea.tsx` — Textarea (~194 tok)
- `toast.tsx` — setToastPosition — uses useEffect (~2960 tok)
- `toggle-group.tsx` — ToggleGroupContext — uses useContext (~501 tok)
- `toggle.tsx` — toggleVariants (~439 tok)
- `tooltip.tsx` — TooltipProvider (~366 tok)

## src/components/wallet/

- `AuthForms.tsx` — strongPasswordRegex — renders form — uses useState, useNavigate, useForm (~3821 tok)
- `FormPage.tsx` — FormPage — uses useState (~4184 tok)
- `index.ts` (~82 tok)
- `TxRow.tsx` — ICONS (~616 tok)
- `WalletError.tsx` — Optional custom title (~2648 tok)
- `WalletLoader.tsx` — Full viewport overlay (recommended for route-level auth hydration) (~2144 tok)
- `WalletShell.tsx` — nav — uses useState (~5354 tok)

## src/data/

- `admin-mock.ts` — Deterministic mock data for the admin console. (~3066 tok)
- `artists.ts` — Exports Artist, artists, getArtist (~1149 tok)
- `artworks.ts` — Exports CategorySlug, SizeCategory, Orientation, DominantColor + 5 more (~6352 tok)
- `auctions.ts` — Exports AuctionLot, inHours, auctionCategories, auctionLots + 6 more (~3304 tok)
- `categories.ts` — Exports Category, categories, getCategory (~848 tok)
- `faqs.ts` — Exports Faq, faqs (~429 tok)
- `history.ts` — Exports Milestone, history (~294 tok)
- `partners-benefits.ts` — Exports PartnerBenefit, partnerBenefits (~300 tok)
- `renowned-artists.ts` — Exports RenownedArtist, renownedArtists (~218 tok)
- `sponsors.ts` — Exports Sponsor, sponsors (~302 tok)

## src/hooks/

- `use-mobile.tsx` — MOBILE_BREAKPOINT — uses useEffect (~165 tok)
- `useAuctionAutoCloser.ts` — useAuctionAutoCloser (~3114 tok)
- `useAuth.tsx` — A custom hook for using firebase authentication function to register, login and check user authentication status (~1168 tok)
- `useAuthListener.ts` — Single source of truth Firebase auth + user doc listener. (~926 tok)
- `useChicagoArt.ts` — useArtInstitute (Legacy Compatibility Wrapper) (~1278 tok)
- `useDoc.ts` — Exports Collections, CreateDoc (~811 tok)
- `useFirebaseData.ts` — Convenience hook to fetch multiple Firebase collections at once. (~888 tok)
- `useFirebaseRealtime.ts` — Realtime hook: subscribes to a Firestore collection via onSnapshot. (~1294 tok)
- `useMetArtist.ts` — useMetArtist — now powered by TanStack Query (~797 tok)
- `useMetArtWork.ts` — Stable default so SSR HTML and client hydration share the same query key. (~1380 tok)
- `useUserNotifications.ts` — Safe, LOCAL Firestore onSnapshot hook for a single user's notifications. (~1205 tok)

## src/lib/

- `activity.ts` — This module is intentionally empty. (~74 tok)
- `emailjsTemplate.ts` — EmailJS Template Generator for sharjahbiennial (~16081 tok)
- `emptyState.ts` — Exports EMPTY_TEXT (~10 tok)
- `error-capture.ts` — Captures the original Error out-of-band so server.ts can recover the stack (~400 tok)
- `error-page.ts` — Exports renderErrorPage (~392 tok)
- `routeGuards.ts` — Wait until Firebase auth + user doc have resolved (or timeout). (~561 tok)
- `siteInfo.ts` — Exports SITE_INFO (~125 tok)
- `store.tsx` — StoreCtx — uses useState, useEffect, useContext (~1275 tok)
- `useMetArtworksStore.tsx` — ArtWorkProvider (~630 tok)
- `useToast.ts` — Re-export for convenience (~41 tok)
- `wallet-theme.tsx` — Ctx — uses useEffect, useContext (~317 tok)
- `wallet.tsx` — - Removed broken import of getLocalUserData (never existed on __root). (~533 tok)

## src/providers/

- `FirebaseProvider.tsx` — FirebaseContext — uses useContext (~353 tok)

## src/queries/

- `chicago.queries.ts` — src/queries/chicago.queries.ts (~485 tok)
- `chicago.ts` — src/queries/chicago.ts (~628 tok)
- `firebaseApi.ts` — One-time fetch (Promise-based) for a collection. (~1079 tok)
- `firebasequeries.ts` — Exports saveLocalData, getLocalData, useFirebaseQueryCollection, useFirebaseQueryDocument (~590 tok)
- `index.ts` — src/queries/index.ts (~358 tok)
- `keys.ts` — src/queries/keys.ts (~203 tok)
- `met.queries.ts` — src/queries/met.queries.ts (~866 tok)
- `met.ts` — src/queries/met.ts (~555 tok)
- `README.md` — Project documentation (~943 tok)

## src/routes/

- `__root.tsx` — selectAuthLoading — uses useRouter, useEffect (~2784 tok)
- `about.tsx` — Route (~1366 tok)
- `admin.account.tsx` — Route — uses useState (~7377 tok)
- `admin.exhibition.tsx` — Route — renders table — uses useState, useEffect, useMemo (~14077 tok)
- `admin.index.tsx` — Route — renders chart — uses useMemo (~4318 tok)
- `admin.tsx` — Route — uses useNavigate, useEffect (~596 tok)
- `admin.users.$id.tsx` — Route — renders chart, map — uses useParams, useMemo, useState, useEffect (~14098 tok)
- `admin.users.index.tsx` — Route — renders table — uses useState (~1918 tok)
- `admin.wallet.tsx` — Route — renders table — uses useState, useEffect, useMemo (~7627 tok)
- `artists.$slug.tsx` — Route — uses useParams, useState (~1458 tok)
- `artists.index.tsx` — Route (~570 tok)
- `artworks.$slug.tsx` — Route — uses useParams, useMemo, useState (~3595 tok)
- `auctions.$slug.tsx` — Route (~8421 tok)
- `auctions.index.tsx` — Route — uses useMemo, useState (~4523 tok)
- `auctions.mine.tsx` — Route — renders modal (~4858 tok)
- `bids.tsx` — Route (~1622 tok)
- `cart.tsx` — Route (~2471 tok)
- `categories.$slug.tsx` — Route — uses useMemo — Remix loader (~487 tok)
- `categories.index.tsx` — import { artworks } from "@/data/artworks"; (~686 tok)
- `connect.tsx` — Route — renders form — uses useNavigate, useState, useEffect, useForm (~2773 tok)
- `contact.tsx` — Route — renders form — uses useState (~1622 tok)
- `favourites.tsx` — import { artworks } from "@/data/artworks"; (~551 tok)
- `gallery.tsx` — Route — uses useMemo (~1236 tok)
- `generate.tsx` — Route (~785 tok)
- `index.tsx` — Route (~1804 tok)
- `listings.tsx` — Route — renders modal — uses useMemo (~5675 tok)
- `notifications.tsx` — Stable module-scope selectors (Zustand + onSnapshot safety) (~569 tok)
- `profile.tsx` — selectAuctions — renders map (~2100 tok)
- `sell.tsx` — Route (~6652 tok)
- `wallet.activity.tsx` — Route — uses useState (~1243 tok)
- `wallet.deposit.tsx` — Route — renders form — uses useForm, useState (~4402 tok)
- `wallet.security.tsx` — Route — uses useState (~2125 tok)
- `wallet.send.tsx` — Route — renders form — uses useState, useMemo, useEffect (~3703 tok)
- `wallet.tsx` — Route — uses useState, useMemo (~3399 tok)
- `wallet.withdraw.tsx` — Route — renders form — uses useState, useForm (~4403 tok)

## src/services/

- `appwrite.ts` — note: changed it to appwrite em (~63 tok)
- `firebase.ts` — Import the functions you need from the SDKs you need (~226 tok)
- `metApi.ts` — services/metApi.ts (~1178 tok)

## src/store/zustand/

- `authStore.ts` — True while we are still determining auth state (onAuth + Firestore fetch) (~1039 tok)
- `dataStore.ts` — SSR-safe storage: localStorage does not exist on the server. (~608 tok)
- `index.ts` (~17 tok)

## src/types/

- `currencyTypes.ts` — Exports Currency (~23 tok)
- `GalleryTypes.ts` — Exports Bid, Listing (~230 tok)
- `index.ts` (~43 tok)
- `metTypes.ts` — types/met.ts (~652 tok)
- `walletTypes.ts` — Exports TxType, AdminWallet, WalletAccount, TransactionStatus + 6 more (~619 tok)

## src/utils/

- `currencies.ts` — Parse a money string ("1,234.56") to a number. (~743 tok)
- `gen.ts` — Scrolls the clicked element into the center of its scrollable parent container. (~1928 tok)
- `index.ts` (~19 tok)
