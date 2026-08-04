import { useMemo } from "react";
import { useRealtimeCollection } from "./useFirebaseRealtime";
import { useAuthStore } from "@/store/zustand";
import { AdminWallet, Bid, Listing, Notification, WalletAccount, WalletTx } from "@/types";
import { where } from "firebase/firestore";
import type { AuctionLot } from "@/data/auctions";

/**
 * Convenience hook to fetch multiple Firebase collections at once.
 *
 * IMPORTANT: This now uses Firestore onSnapshot (realtime) instead of getDocs.
 * Any change made to documents in these collections will immediately reflect
 * across all components that read from useDataStore.
 *
 * Safe to use anywhere as long as you're inside <QueryClientProvider>.
 */
export function useFirebaseDataHook() {
  const { user } = useAuthStore();

  // For admin: we want the full collection so changes reflect everywhere.
  // For regular users we still scope some collections by userID.
  const isUser = user?.role === "user";

  // Memoize constraints so the realtime subscription doesn't recreate on every render
  const txConstraints = useMemo(
    () => (isUser ? [where("userID", "==", user?.userID)] : []),
    [isUser, user?.userID],
  );
  const bidsConstraints = useMemo(
    () => (isUser ? [where("userID", "==", user?.userID)] : []),
    [isUser, user?.userID],
  );
  const listingsConstraints = useMemo(
    () => (isUser ? [where("userID", "==", user?.userID)] : []),
    [isUser, user?.userID],
  );
  const notificationsConstraints = useMemo(
    () => (user?.userID ? [where("userID", "==", user?.userID)] : []),
    [user?.userID],
  );

  const transactions = useRealtimeCollection<WalletTx>("transactions", txConstraints);
  const users = useRealtimeCollection<WalletAccount>("users");
  const auctions = useRealtimeCollection<AuctionLot>("auctions");
  const bids = useRealtimeCollection<Bid>("bids", bidsConstraints);
  const listings = useRealtimeCollection<Listing>("listings", listingsConstraints);
  const wallets = useRealtimeCollection<AdminWallet>("wallets");

  // NOTE:
  // We intentionally do NOT subscribe to "notifications" here via the global realtime hook.
  // Notifications are now handled by the dedicated local hook `useUserNotifications`.
  // This prevents double-listening + Zustand update storms that caused
  // "getServerSnapshot should be cached" and "Maximum update depth exceeded" errors.

  const isLoading =
    transactions.isLoading ||
    users.isLoading ||
    auctions.isLoading ||
    bids.isLoading ||
    listings.isLoading ||
    wallets.isLoading;

  return {
    transactions: transactions.data ?? [],
    users: users.data ?? [],
    auctions: auctions.data ?? [],
    bids: bids.data ?? [],
    listings: listings.data ?? [],
    wallets: wallets.data ?? [],
    // notifications are no longer provided globally to avoid snapshot loops.
    // Use useUserNotifications(userID) instead.
    notifications: [],

    isLoading,

    // Raw realtime query objects (contain error, isLoading, etc.)
    queries: {
      transactions,
      users,
      auctions,
      bids,
      listings,
      wallets,
    },
  };
}
