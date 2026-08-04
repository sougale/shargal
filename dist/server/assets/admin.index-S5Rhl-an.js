import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { Move, DollarSign, Palette, ShoppingBag, Gavel, UserPlus, CircleDollarSign, Coins, CircleDot, ArrowUpRight } from "lucide-react";
import { c as useDataStore, V as SectionHeader, W as KpiTile, X as overviewKpis, Y as BentoCard, l as fmtDateTime, Z as fmtMoney } from "./router-BX1vAgXZ.js";
import { useShallow } from "zustand/shallow";
import { useMemo } from "react";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
function AdminOverview() {
  const {
    transactions,
    auctions,
    users
  } = useDataStore(useShallow((s) => ({
    transactions: s.transactions,
    auctions: s.auctions,
    users: s.users
  })));
  const revenueSeries = useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const buckets = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime());
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      buckets.push({
        day: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        revenue: 0,
        volume: 0,
        _date: d
      });
    }
    const toDate = (raw) => {
      if (!raw) return null;
      if (typeof raw === "string" || typeof raw === "number") return new Date(raw);
      if (raw?.toDate) return raw.toDate();
      if (raw instanceof Date) return raw;
      return null;
    };
    for (const tx of transactions) {
      const txDate = toDate(tx.createdAt ?? tx.date);
      if (!txDate || isNaN(txDate.getTime())) continue;
      const bucket = buckets.find((b) => b._date.getFullYear() === txDate.getFullYear() && b._date.getMonth() === txDate.getMonth() && b._date.getDate() === txDate.getDate());
      if (!bucket) continue;
      const amt = Math.abs(Number(tx.amount) || 0);
      if (tx.type === "deposit" || tx.type === "sale") {
        bucket.revenue += amt;
        bucket.volume += amt;
      } else if (tx.type === "withdraw") {
        bucket.volume += amt;
      } else if (tx.type === "purchase") {
        bucket.volume += amt;
      }
    }
    return buckets.map(({
      _date,
      ...rest
    }) => rest);
  }, [transactions]);
  const deposits = transactions.filter((t) => t.type === "deposit");
  const withdrawals = transactions.filter((t) => t.type === "withdraw");
  const activities = [...withdrawals, ...deposits].map((a) => ({
    id: a.id,
    kind: a.type,
    who: a.fullName,
    detail: a.type,
    amount: a.amount,
    at: a.createdAt
  }));
  const totals = useMemo(() => {
    let depositA = 0;
    let withdrawalA = 0;
    for (const t of transactions) {
      if (t.type === "deposit") depositA += Number(t.amount) || 0;
      if (t.type === "withdraw") withdrawalA += Number(t.amount) || 0;
    }
    return {
      depositA,
      withdrawalA
    };
  }, [transactions]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "Overview", description: "Live snapshot of the exhibition and wallet operations. ", action: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2" }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(KpiTile, { label: "All Deposit", value: totals.depositA, delta: overviewKpis.revenue.delta, delay: 0 }),
      /* @__PURE__ */ jsx(KpiTile, { label: "All Withdrawals", value: totals.withdrawalA, delta: overviewKpis.volume24h.delta, delay: 0.05 }),
      /* @__PURE__ */ jsx(KpiTile, { label: "Active auctions", value: auctions.length, delta: overviewKpis.activeAuctions.delta, format: "number", delay: 0.1 }),
      /* @__PURE__ */ jsx(KpiTile, { label: "Users", value: users.length, delta: overviewKpis.newUsers.delta, format: "number", delay: 0.15 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-8", eyebrow: "Last 30 days", title: "Revenue & wallet volume", delay: 0.18, action: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[10px] font-semibold text-[var(--a-muted)]", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-sm bg-[var(--a-accent)]" }),
          " Revenue"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-sm bg-[var(--a-info)]" }),
          " Volume"
        ] })
      ] }), children: /* @__PURE__ */ jsx("div", { className: "h-[260px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: revenueSeries, margin: {
        left: -20,
        right: 8,
        top: 8,
        bottom: 0
      }, children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "g-rev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--a-accent)", stopOpacity: 0.45 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--a-accent)", stopOpacity: 0 })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: "g-vol", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--a-info)", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--a-info)", stopOpacity: 0 })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CartesianGrid, { stroke: "var(--a-border)", vertical: false }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "day", stroke: "var(--a-faint)", tick: {
          fontSize: 10
        }, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "var(--a-faint)", tick: {
          fontSize: 10
        }, tickLine: false, axisLine: false, width: 48 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--a-bg-2)",
          border: "1px solid var(--a-border-hi)",
          borderRadius: 8,
          fontSize: 12
        }, labelStyle: {
          color: "var(--a-muted)"
        } }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "volume", stroke: "var(--a-info)", strokeWidth: 1.6, fill: "url(#g-vol)" }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "var(--a-accent)", strokeWidth: 2, fill: "url(#g-rev)" })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-4", eyebrow: "", title: "Activity feed", delay: 0.2, action: /* @__PURE__ */ jsx("span", { className: "flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-pos)]", children: /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-[var(--a-pos)] a-live" }) }), children: /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: activities.slice(0, 5).map((e) => {
        const Icon = ACTIVITY_ICON[e.kind] || CircleDot;
        return /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-8 shrink-0 place-items-center rounded-md bg-[var(--a-surface-2)] text-[var(--a-accent)]", children: /* @__PURE__ */ jsx(Icon, { className: "size-3.5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-[var(--a-fg-2)]", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-[var(--a-fg)]", children: e.who }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)] capitalize", children: e.detail })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-[var(--a-faint)]", children: [
              fmtDateTime(e.at),
              " ago"
            ] })
          ] }),
          e.amount !== void 0 && /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(e.amount) })
        ] }, e.id);
      }) }) }),
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-6", eyebrow: "Listed Auctions", title: "New Arrivals", delay: 0.22, action: /* @__PURE__ */ jsxs(Link, { to: "/admin/exhibition", className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline", children: [
        "View all ",
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" })
      ] }), children: /* @__PURE__ */ jsx("ul", { className: "divide-y divide-[var(--a-border)]", children: auctions.map((a, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 py-2.5", children: [
        /* @__PURE__ */ jsx("span", { className: "a-mono w-6 text-center text-[11px] font-bold text-[var(--a-muted)]", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsx("img", { src: a.images[0], alt: a.title, className: "size-10 rounded-md object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-[var(--a-fg)]", children: a.title }),
          /* @__PURE__ */ jsxs("p", { className: "truncate text-[10px] text-[var(--a-muted)]", children: [
            a.sellerSlug,
            " · ",
            a.categoryLabel
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "a-mono text-xs font-bold text-[var(--a-accent)]", children: fmtMoney(a.currentBid) })
      ] }, a.slug)) }) }),
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-6", eyebrow: "Queue", title: "Pending withdrawals", delay: 0.24, action: /* @__PURE__ */ jsxs(Link, { to: "/admin/wallet", className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline", children: [
        "Open ",
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" })
      ] }), children: /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: withdrawals.length === 0 ? /* @__PURE__ */ jsx("li", { className: "py-8 text-center text-xs text-[var(--a-muted)]", children: "All clear." }) : withdrawals.filter((w) => w.status == "Pending").slice(0, 5).map((tx) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-[var(--a-fg)]", children: tx.fullName }),
          /* @__PURE__ */ jsx("p", { className: "a-mono truncate text-[10px] text-[var(--a-muted)]", children: tx.channel })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("p", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(tx.amount) }) })
      ] }, tx.id)) }) })
    ] })
  ] });
}
const ACTIVITY_ICON = {
  deposit: Coins,
  withdraw: CircleDollarSign,
  signup: UserPlus,
  bid: Gavel,
  sale: ShoppingBag,
  listing: Palette,
  purchase: DollarSign,
  transfer_out: Move,
  transfer_in: Move
};
export {
  AdminOverview as component
};
