import { AuctionLot } from "@/data/auctions";
import { AdminWallet, Bid, Listing, Notification, WalletAccount, WalletTx } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// SSR-safe storage: localStorage does not exist on the server.
// Without this guard, createJSONStorage(() => localStorage) throws during SSR,
// which h3 swallows into {"unhandled":true,"message":"HTTPError"}.
const dataPersistStorage =
  typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined;

interface DataStore {
  transactions: WalletTx[];
  users: WalletAccount[];
  wallets: AdminWallet[];
  auctions: AuctionLot[];
  bids: Bid[];
  listings: Listing[];
  notifications: Notification[];
  setState: (state: Partial<Omit<DataStore, "setState">>) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      users: [],
      auctions: [],
      bids: [],
      wallets: [],
      listings: [],
      // notifications are live-only from Firestore onSnapshot.
      // We deliberately do NOT persist them to avoid hydration + useSyncExternalStore loops.
      notifications: [],
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state,
        }));
      },
    }),
    {
      name: "_dataStore",
      // Must use the SSR-safe storage (localStorage is undefined during server render).
      // Passing undefined tells zustand/persist to skip persistence on the server.
      storage: dataPersistStorage,
      skipHydration: true,
      // Only persist stable / cacheable data. Live snapshot collections (especially notifications)
      // can cause "getServerSnapshot" + max update depth errors when combined with rapid onSnapshot + selectors.
      partialize: (state) => ({
        transactions: state.transactions,
        users: state.users,
        auctions: state.auctions,
        bids: state.bids,
        wallets: state.wallets,
        listings: state.listings,
        // explicitly exclude notifications
      }),
    },
  ),
);
