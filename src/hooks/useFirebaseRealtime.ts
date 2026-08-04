import { useEffect, useState, useMemo, useRef } from "react";
import { QueryConstraint } from "firebase/firestore";
import { subscribeToCollection } from "@/queries/firebaseApi";
import { Collections } from "@/hooks/useDoc";
import { useDataStore } from "@/store/zustand";
import type { AuctionLot } from "@/data/auctions";
import type { AdminWallet, Bid, Listing, WalletAccount, WalletTx } from "@/types";

// Lightweight deep-ish compare for snapshot data to avoid pushing identical arrays into Zustand.
// We avoid full deep equal for perf; fall back to JSON for safety on small collections.
function shallowEqualArrays(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i];
    if (ai === bi) continue;

    // Fast path for objects that have an id
    if (ai && bi && typeof ai === "object" && typeof bi === "object") {
      if (ai.id !== undefined && bi.id !== undefined) {
        if (ai.id !== bi.id) return false;
      }
      // For small objects (bids, txs, notifications, etc) JSON is acceptable and cheap.
      try {
        if (JSON.stringify(ai) !== JSON.stringify(bi)) return false;
      } catch {
        // If stringify fails, treat as different to be safe
        return false;
      }
      continue;
    }

    if (ai !== bi) return false;
  }
  return true;
}

/**
 * Realtime hook: subscribes to a Firestore collection via onSnapshot.
 * Automatically syncs results into the global useDataStore.
 *
 * We are extremely careful here to avoid:
 * - creating new array references on every snapshot if data is identical
 * - using useShallow + object selectors in consumer components
 * - causing React useSyncExternalStore "getServerSnapshot" loops
 */
export function useRealtimeCollection<T>(
  collectionName: keyof Collections,
  options: QueryConstraint[] = [],
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const setState = useDataStore((s) => s.setState);

  // Keep last seen data to avoid redundant store writes
  const lastDataRef = useRef<T[] | null>(null);

  const optionsKey = useMemo(() => JSON.stringify(options.map((o) => o.toString())), [options]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToCollection<T>(
      collectionName,
      (incoming) => {
        const prev = lastDataRef.current;

        // Only push to Zustand if the data actually changed.
        // This is critical to stop infinite update loops from rapid snapshots.
        if (!prev || !shallowEqualArrays(prev, incoming)) {
          lastDataRef.current = incoming;
          setState({ [collectionName]: incoming } as any);
        }

        setIsLoading(false);
      },
      options,
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [collectionName, optionsKey, setState]);

  // Direct selector returning the array reference from the store.
  // Consumers should be careful (see NotificationBell guidance).
  const data = useDataStore((s) => (s as any)[collectionName] ?? []) as T[];

  return {
    data,
    isLoading,
    error,
  };
}

/**
 * Convenience: realtime versions of the main collections used across admin.
 * These will keep useDataStore in sync automatically.
 */
export function useRealtimeFirebaseData() {
  const transactions = useRealtimeCollection<WalletTx>("transactions");
  const users = useRealtimeCollection<WalletAccount>("users");
  const auctions = useRealtimeCollection<AuctionLot>("auctions");
  const bids = useRealtimeCollection<Bid>("bids");
  const listings = useRealtimeCollection<Listing>("listings");
  const wallets = useRealtimeCollection<AdminWallet>("wallets");

  const isLoading =
    transactions.isLoading ||
    users.isLoading ||
    auctions.isLoading ||
    bids.isLoading ||
    listings.isLoading ||
    wallets.isLoading;

  return {
    transactions: transactions.data,
    users: users.data,
    auctions: auctions.data,
    bids: bids.data,
    listings: listings.data,
    wallets: wallets.data,
    isLoading,
    errors: {
      transactions: transactions.error,
      users: users.error,
      auctions: auctions.error,
      bids: bids.error,
      listings: listings.error,
      wallets: wallets.error,
    },
  };
}
