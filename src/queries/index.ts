// src/queries/index.ts
// Barrel export for all query-related utilities

// Query keys
export * from "./keys";

// Raw fetch functions (useful for mutations or custom logic)
export * from "./chicago";
export * from "./met";
export * from "./firebaseApi";

// TanStack Query options + ready-to-use hooks
export {
  chicagoQueries,
  useChicagoArtworksByCategory,
  useChicagoArtworksByArtist,
  useChicagoArtist,
} from "./chicago.queries";

export {
  metQueries,
  useMetSearch,
  useMetArtworksByIds,
  useMetArtist,
  useMetArtistInfinite,
} from "./met.queries";

// Firebase (TanStack Query wrappers) - one-time fetch via TanStack Query
// Only use these if you explicitly want a non-realtime snapshot

export { useFirebaseQueryCollection, useFirebaseQueryDocument } from "./firebasequeries";

// Firebase realtime (onSnapshot) - preferred for live admin / dashboard views
// These keep useDataStore in sync. Any add/update/delete in the collection
// will immediately reflect in all components reading from the store.
export { subscribeToCollection, subscribeToDocument } from "./firebaseApi";
export { useRealtimeCollection, useRealtimeFirebaseData } from "@/hooks/useFirebaseRealtime";
export type { Unsubscribe } from "firebase/firestore";
