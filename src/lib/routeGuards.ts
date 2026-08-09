import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/zustand";
import { Timestamp } from "firebase/firestore";
import type { WalletAccount } from "@/types";

type AuthSnapshot = ReturnType<typeof useAuthStore.getState>;

/** Wait until Firebase auth + user doc have resolved (or timeout). */
function waitForAuthReady(timeoutMs = 10_000): Promise<AuthSnapshot> {
  const current = useAuthStore.getState();
  if (current.isAuthHydrated && !current.loading) {
    return Promise.resolve(current);
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      unsub();
      resolve(useAuthStore.getState());
    }, timeoutMs);

    const unsub = useAuthStore.subscribe((state) => {
      if (state.isAuthHydrated && !state.loading) {
        clearTimeout(timeout);
        unsub();
        resolve(state);
      }
    });
  });
}

function normalizeUser(user: WalletAccount | null): WalletAccount | null {
  if (!user) return null;
  if (user.createdAt instanceof Timestamp) {
    return {
      ...user,
      createdAt: user.createdAt.toDate().toISOString(),
    };
  }
  return user;
}

/** Any signed-in account. */
export const requireAuth = async () => {
  if (typeof window === "undefined") {
    return { user: null as WalletAccount | null };
  }

  const { user } = await waitForAuthReady();
  if (!user) {
    throw redirect({ to: "/connect" });
  }

  return { user: normalizeUser(user) };
};

/** Admin role only — used by /admin layout and children. */
export const requireAdmin = async () => {
  if (typeof window === "undefined") {
    // Firebase session isn't available during SSR; client layout re-checks.
    return { user: null as WalletAccount | null };
  }

  const { user } = await waitForAuthReady();

  if (!user) {
    throw redirect({ to: "/connect" });
  }

  if (user.role !== "admin") {
    throw redirect({ to: "/profile" });
  }

  return { user: normalizeUser(user) };
};
