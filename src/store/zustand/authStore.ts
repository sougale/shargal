import { WalletAccount } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// SSR-safe storage: localStorage does not exist on the server.
// Without this guard, createJSONStorage(() => localStorage) throws during SSR,
// which h3 swallows into {"unhandled":true,"message":"HTTPError"}.
const authPersistStorage =
  typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined;

interface AuthStore {
  user: WalletAccount | null;
  loggedIn: boolean;
  loading: boolean;
  userID: string | null;
  /** True while we are still determining auth state (onAuth + Firestore fetch) */
  isAuthHydrated: boolean;
  setState: (state: Partial<AuthStore>) => void;
  /** Helper to set the authenticated user + loggedIn in one go */
  setUser: (user: WalletAccount | null) => void;
  /** Set only the loading flags */
  setLoading: (loading: boolean, isAuthHydrated?: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loggedIn: false,
      loading: true, // start true until listener resolves
      isAuthHydrated: false,
      userID: null,
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state,
        }));
      },
      setUser: (user) => {
        set((state) => {
          const current = state.user;

          // Avoid unnecessary updates. Rapid onSnapshot calls that produce
          // "equivalent" user objects are a major cause of
          // "getServerSnapshot should be cached" + max update depth errors.
          if (current && user && current.userID === user.userID) {
            // Compare the fields we actually care about for re-renders.
            // If only internal firestore timestamps etc changed, skip the update.
            // IMPORTANT: Include status so that admin approval / suspension immediately
            // affects UI guards (canPlaceBid, canSell, canDeposit, etc).
            const same =
              current.wallet?.balance === user.wallet?.balance &&
              current.wallet?.bidBalance === user.wallet?.bidBalance &&
              current.fullName === user.fullName &&
              current.status === user.status &&
              current.blocked === user.blocked;

            if (same) {
              return state;
            }
          }

          if (current?.userID === user?.userID && current === user) {
            return state;
          }

          return {
            ...state,
            user,
            loggedIn: !!user,
            loading: false,
            isAuthHydrated: true,
          };
        });
      },
      setLoading: (loading, isAuthHydrated) => {
        set((state) => {
          const nextIsHydrated =
            isAuthHydrated !== undefined ? isAuthHydrated : state.isAuthHydrated;
          if (state.loading === loading && state.isAuthHydrated === nextIsHydrated) {
            return state; // no change
          }
          return {
            ...state,
            loading,
            isAuthHydrated: nextIsHydrated,
          };
        });
      },
    }),
    {
      name: "authStore",
      // Must use the SSR-safe storage (localStorage is undefined during server render).
      // Passing undefined tells zustand/persist to skip persistence on the server.
      storage: authPersistStorage,
      skipHydration: true,
      // Only persist the user, not transient loading states
      partialize: (state) => ({ user: state.user, loggedIn: state.loggedIn }),
    },
  ),
);
