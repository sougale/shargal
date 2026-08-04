import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "motion/react";
import { Tag, RotateCcw, Gavel, ShoppingBag, ArrowUpRight, ArrowDownLeft, Banknote, Search, Inbox } from "lucide-react";
import { t as txSign, U as TX_LABEL, b as useAuthStore, c as useDataStore } from "./router-07wj3SDc.js";
import { f as formatMoney } from "./currencies-G6nNjE1o.js";
import { useShallow } from "zustand/shallow";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
const ICONS = {
  deposit: ArrowDownLeft,
  withdraw: ArrowUpRight,
  transfer_in: ArrowDownLeft,
  transfer_out: ArrowUpRight,
  purchase: ShoppingBag,
  bid_hold: Gavel,
  bid_release: RotateCcw,
  sale: Tag
};
function TxRow({ tx }) {
  const Icon = ICONS[tx.type] ?? Banknote;
  const sign = txSign(tx.type);
  const positive = sign > 0;
  const date = new Date(tx.createdAt);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.25 },
      whileHover: { x: 2 },
      className: "flex items-center gap-4 border-b border-[var(--w-border)] py-3.5 last:border-b-0",
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "grid size-10 shrink-0 place-items-center rounded-[1rem] border border-[var(--w-border)]",
            style: {
              background: positive ? "var(--w-brand-soft)" : "var(--w-bg-2)",
              color: positive ? "var(--w-brand)" : "var(--w-fg)"
            },
            children: /* @__PURE__ */ jsx(Icon, { className: "size-4", strokeWidth: 2 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[var(--w-fg)]", children: TX_LABEL[tx.type] }),
          /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-[var(--w-muted)]", children: [
            tx.counterparty ? `${tx.counterparty} · ` : "",
            tx.note ?? date.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs(
            "p",
            {
              className: `text-base font-bold tracking-tight ${positive ? "text-[var(--w-brand)]" : "text-[var(--w-fg)]"}`,
              children: [
                positive ? "+" : "−",
                formatMoney(tx.amount, tx.currency)
              ]
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--w-muted)]", children: [
            "Bal ",
            formatMoney(tx.balanceAfter, tx.currency)
          ] })
        ] })
      ]
    }
  );
}
const TYPES = [{
  value: "all",
  label: "All"
}, {
  value: "deposit",
  label: TX_LABEL.deposit
}, {
  value: "withdraw",
  label: TX_LABEL.withdraw
}, {
  value: "transfer_out",
  label: TX_LABEL.transfer_out
}, {
  value: "transfer_in",
  label: TX_LABEL.transfer_in
}, {
  value: "purchase",
  label: TX_LABEL.purchase
}, {
  value: "bid_hold",
  label: TX_LABEL.bid_hold
}];
function ActivityPage() {
  const {
    user
  } = useAuthStore();
  const [filter, setFilter] = useState("all");
  const {
    transactions
  } = useDataStore(useShallow((s) => ({
    transactions: s.transactions
  })));
  const [q, setQ] = useState("");
  if (!user) return null;
  let list = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);
  if (q.trim()) {
    const needle = q.toLowerCase();
    list = list.filter((t) => (t.note ?? "").toLowerCase().includes(needle) || (t.counterparty ?? "").toLowerCase().includes(needle));
  }
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--w-brand)]", children: "Ledger" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-extrabold tracking-tight text-[var(--w-fg)] md:text-4xl", children: "Activity" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--w-muted)]", children: "Every transaction made with this wallet, on and off the gallery." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-xs", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--w-muted)]" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search note or counterparty", className: "w-full rounded-full border border-[var(--w-border)] bg-[var(--w-input)] py-2.5 pl-10 pr-4 text-sm text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex flex-wrap gap-2 wallet-hscroll overflow-x-auto pb-1", children: TYPES.map((t) => {
      const active = filter === t.value;
      return /* @__PURE__ */ jsx(motion.button, { whileTap: {
        scale: 0.95
      }, onClick: () => setFilter(t.value), className: `rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${active ? "border-transparent shadow" : "border-[var(--w-border)] bg-[var(--w-input)] text-[var(--w-muted)] hover:text-[var(--w-fg)]"}`, style: active ? {
        background: "var(--w-brand)",
        color: "var(--w-brand-contrast)"
      } : void 0, children: t.label }, t.value);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: list.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-16 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "grid size-12 place-items-center rounded-full border border-[var(--w-border)] bg-[var(--w-bg-2)] text-[var(--w-muted)]", children: /* @__PURE__ */ jsx(Inbox, { className: "size-5" }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-[var(--w-muted)]", children: "Nothing here yet." })
    ] }) : list.map((t) => /* @__PURE__ */ jsx(TxRow, { tx: t }, t.id)) })
  ] });
}
export {
  ActivityPage as component
};
