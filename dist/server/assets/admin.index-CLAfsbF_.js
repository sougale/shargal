import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { Palette, ShoppingBag, Gavel, UserPlus, CircleDollarSign, Coins, ArrowUpRight } from "lucide-react";
import { z as artworks, H as SectionHeader, K as KpiTile, I as overviewKpis, J as BentoCard, L as revenueSeries, M as adminActivity, N as fmtMoney, O as pendingWithdrawals, P as pendingKyc } from "./router-07wj3SDc.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
function AdminOverview() {
  const topArtworks = [...artworks].sort((a, b) => b.price - a.price).slice(0, 5);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "Overview", description: "Live snapshot of the exhibition and wallet operations. All numbers are mock data.", action: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("button", { className: "rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: "Last 30 days" }),
      /* @__PURE__ */ jsx("button", { className: "rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: "Export report" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(KpiTile, { label: "Platform revenue", value: overviewKpis.revenue.value, delta: overviewKpis.revenue.delta, delay: 0 }),
      /* @__PURE__ */ jsx(KpiTile, { label: "Wallet volume · 24h", value: overviewKpis.volume24h.value, delta: overviewKpis.volume24h.delta, delay: 0.05 }),
      /* @__PURE__ */ jsx(KpiTile, { label: "Active auctions", value: overviewKpis.activeAuctions.value, delta: overviewKpis.activeAuctions.delta, format: "number", delay: 0.1 }),
      /* @__PURE__ */ jsx(KpiTile, { label: "New users", value: overviewKpis.newUsers.value, delta: overviewKpis.newUsers.delta, format: "number", delay: 0.15 })
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
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-4", eyebrow: "Live", title: "Activity feed", delay: 0.2, action: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-pos)]", children: [
        /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-[var(--a-pos)] a-live" }),
        " LIVE"
      ] }), children: /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: adminActivity.map((e) => {
        const Icon = ACTIVITY_ICON[e.kind];
        return /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-8 shrink-0 place-items-center rounded-md bg-[var(--a-surface-2)] text-[var(--a-accent)]", children: /* @__PURE__ */ jsx(Icon, { className: "size-3.5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-[var(--a-fg-2)]", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-[var(--a-fg)]", children: e.who }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: e.detail })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-[var(--a-faint)]", children: [
              e.at,
              " ago"
            ] })
          ] }),
          e.amount !== void 0 && /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(e.amount) })
        ] }, e.id);
      }) }) }),
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-5", eyebrow: "Trending", title: "Top performing artworks", delay: 0.22, action: /* @__PURE__ */ jsxs(Link, { to: "/admin/exhibition", className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline", children: [
        "View all ",
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" })
      ] }), children: /* @__PURE__ */ jsx("ul", { className: "divide-y divide-[var(--a-border)]", children: topArtworks.map((a, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 py-2.5", children: [
        /* @__PURE__ */ jsx("span", { className: "a-mono w-6 text-center text-[11px] font-bold text-[var(--a-muted)]", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsx("img", { src: a.image, alt: a.title, className: "size-10 rounded-md object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-[var(--a-fg)]", children: a.title }),
          /* @__PURE__ */ jsxs("p", { className: "truncate text-[10px] text-[var(--a-muted)]", children: [
            a.artist,
            " · ",
            a.categoryLabel
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "a-mono text-xs font-bold text-[var(--a-accent)]", children: fmtMoney(a.price) })
      ] }, a.slug)) }) }),
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-4", eyebrow: "Queue", title: "Pending withdrawals", delay: 0.24, action: /* @__PURE__ */ jsxs(Link, { to: "/admin/wallet", className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline", children: [
        "Open ",
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" })
      ] }), children: /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: pendingWithdrawals.length === 0 ? /* @__PURE__ */ jsx("li", { className: "py-8 text-center text-xs text-[var(--a-muted)]", children: "All clear." }) : pendingWithdrawals.slice(0, 5).map((tx) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-[var(--a-fg)]", children: tx.user }),
          /* @__PURE__ */ jsxs("p", { className: "a-mono truncate text-[10px] text-[var(--a-muted)]", children: [
            tx.id,
            " · ",
            tx.method
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(tx.amount) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex gap-1", children: [
            /* @__PURE__ */ jsx("button", { className: "rounded bg-[var(--a-pos)]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-pos)] hover:bg-[var(--a-pos)]/25", children: "OK" }),
            /* @__PURE__ */ jsx("button", { className: "rounded bg-[var(--a-neg)]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-neg)] hover:bg-[var(--a-neg)]/25", children: "Reject" })
          ] })
        ] })
      ] }, tx.id)) }) }),
      /* @__PURE__ */ jsx(BentoCard, { className: "lg:col-span-3", eyebrow: "Review", title: "Pending KYC", delay: 0.26, children: /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: pendingKyc.length === 0 ? /* @__PURE__ */ jsx("li", { className: "py-8 text-center text-xs text-[var(--a-muted)]", children: "No submissions." }) : pendingKyc.map((u) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-8 place-items-center rounded-md bg-[var(--a-surface-2)] text-[11px] font-bold text-[var(--a-accent)]", children: u.name.split(" ").map((s) => s[0]).join("").slice(0, 2) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-[var(--a-fg)]", children: u.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-[var(--a-muted)]", children: [
            "Submitted ",
            u.submitted
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "rounded border border-[var(--a-border-hi)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: "Open" })
      ] }, u.id)) }) })
    ] })
  ] });
}
const ACTIVITY_ICON = {
  deposit: Coins,
  withdraw: CircleDollarSign,
  signup: UserPlus,
  bid: Gavel,
  sale: ShoppingBag,
  listing: Palette
};
export {
  AdminOverview as component
};
