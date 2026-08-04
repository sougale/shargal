import { State, TxType } from "@/types";
import { useEffect, useState, type ReactNode } from "react";

// NOTE:
// - Removed broken import of getLocalUserData (never existed on __root).
//   That was causing RunnerError during Vite module evaluation.
// - This provider is intentionally minimal now. The real auth source of truth
//   is useAuthListener + useAuthStore. We keep WalletProvider only for legacy
//   consumers that still import from here.

const KEY = "sharjahbiennial.wallet.v1";
const empty: State = { accounts: [], currentAccountId: null, transactions: [] };

function load(): State {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  return <>{children}</>;
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export const TX_LABEL: Record<TxType, string> = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  transfer_out: "Sent",
  transfer_in: "Received",
  purchase: "Purchase",
  bid_hold: "Bid placed",
  bid_release: "Bid released",
  sale: "Sale",
};

export function txSign(type: TxType): 1 | -1 {
  return type === "deposit" || type === "transfer_in" || type === "bid_release" || type === "sale"
    ? 1
    : -1;
}
