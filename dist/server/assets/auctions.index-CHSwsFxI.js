import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { f as formatBid, a as auctionCategories, b as auctionLots, c as auctionPriceMax, d as auctionPriceMin } from "./auctions-BSTwHsAU.js";
import { c as useDataStore, S as Select, B as SelectTrigger, C as SelectValue, D as SelectContent, E as SelectGroup, F as SelectItem, G as artists } from "./router-07wj3SDc.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { A as AuctionCard } from "./AuctionCard-DwQgjUbb.js";
import { C as Countdown } from "./Countdown-DRtUvczQ.js";
import { S as Sheet, a as SheetTrigger, b as SheetContent, c as SheetHeader, d as SheetTitle, e as Slider, f as Switch } from "./switch-C_A7R2Ay.js";
import { useShallow } from "zustand/shallow";
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
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "./AuctionImageSwiper-DoZ88T7q.js";
import "embla-carousel-react";
import "./SmartImage-BnUWDzq7.js";
import "class-variance-authority";
import "@radix-ui/react-slider";
import "@radix-ui/react-switch";
const defaultFilters = () => ({
  category: [],
  seller: [],
  reserveMet: false,
  endingSoon: false,
  priceMin: 1e4,
  priceMax: 1e6
});
function apply(lots, f, sort) {
  let out = lots.filter((l) => {
    if (f.category.length && !f.category.includes(l.category)) return false;
    if (f.seller.length && !f.seller.includes(l.sellerSlug)) return false;
    if (f.reserveMet && !l.reserveMet) return false;
    if (f.endingSoon) {
      const ms = new Date(l.endsAt).getTime() - Date.now();
      if (ms <= 0 || ms > 24 * 36e5) return false;
    }
    if (l.price < f.priceMin || l.price > f.priceMax) return false;
    return true;
  });
  out = [...out];
  switch (sort) {
    case "ending-soon":
      out.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
      break;
    case "newest":
      out.sort((a, b) => b.year - a.year);
      break;
    case "low-high":
      out.sort((a, b) => a.currentBid - b.currentBid);
      break;
    case "high-low":
      out.sort((a, b) => b.currentBid - a.currentBid);
      break;
    case "most-bids":
      out.sort((a, b) => b.bidCount - a.bidCount);
      break;
  }
  return out;
}
function AuctionsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState("ending-soon");
  const [activeCat, setActiveCat] = useState("all");
  const {
    auctions
  } = useDataStore(useShallow((s) => ({
    auctions: s.auctions
  })));
  const filtered = useMemo(() => {
    const f = activeCat === "all" ? filters : {
      ...filters,
      category: [activeCat]
    };
    return apply(auctions, f, sort);
  }, [filters, sort, activeCat, auctions]);
  console.log({
    auctions,
    filtered
  });
  const featured = useMemo(() => [...auctions].sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())[0], [auctions]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Spring Auction · No. 12", title: "Live Auction", description: "A timed sale of twelve contemporary works, hand-picked from the gallery's spring programme. Lots close on a rolling schedule — bid carefully and well." }),
    featured && /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "grid items-stretch gap-px border border-ink/10 bg-ink/10 md:grid-cols-[1.2fr_1fr]", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-canvas", children: /* @__PURE__ */ jsx("div", { className: "aspect-[5/4] w-full overflow-hidden bg-surface md:aspect-auto md:h-full", children: /* @__PURE__ */ jsx("img", { src: featured.images[0], alt: featured.title, className: "h-full w-full object-cover" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-8 bg-canvas p-8 md:p-12", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-4xl italic leading-tight md:text-5xl", children: featured.title }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-detail", children: [
            featured.categoryLabel,
            " · ",
            featured.year,
            " · ",
            featured.medium
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-md text-base leading-relaxed text-ink/75", children: featured.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(Countdown, { endsAt: featured.endsAt, size: "lg" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between border-t border-ink/10 pt-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Price" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 font-display text-3xl italic", children: formatBid(featured.price) }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-detail", children: [
                featured.bidCount,
                " bids · est. ",
                formatBid(featured.estimateLow),
                "–",
                formatBid(featured.estimateHigh)
              ] })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/auctions/$slug", params: {
              slug: featured.slug
            }, className: "inline-block border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "View lot" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pb-4", children: /* @__PURE__ */ jsx("div", { className: "no-scrollbar flex items-center gap-3 overflow-x-auto", children: auctionCategories.map((c) => {
      const active = activeCat === c.slug;
      return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setActiveCat(c.slug), className: `shrink-0 rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${active ? "border-ink bg-ink text-canvas" : "border-ink/15 text-detail hover:border-ink hover:text-ink"}`, children: c.label }, c.slug);
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: [
        filtered.length,
        " ",
        filtered.length === 1 ? "lot" : "lots",
        " on offer"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-detail", children: [
          "Sort",
          /* @__PURE__ */ jsxs(Select, { value: sort, onValueChange: (e) => setSort(e), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "border border-ink/20 bg-canvas px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-ink focus:border-none focus:outline-none", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "ending-soon", children: "Ending soon" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "newest", children: "Newest" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "low-high", children: "Bid: low → high" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "high-low", children: "Bid: high → low" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "most-bids", children: "Most bids" })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(AuctionFilterSheet, { value: filters, onChange: setFilters, totalCount: auctionLots.length, matchCount: filtered.length })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32", children: filtered.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-24 text-center text-sm text-detail", children: "No lots match these filters." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((l, i) => /* @__PURE__ */ jsx(AuctionCard, { lot: l, priority: i < 3 }, l.slug)) }) })
  ] });
}
function AuctionFilterSheet({
  value,
  onChange,
  totalCount,
  matchCount
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const openSheet = (o) => {
    if (o) setDraft(value);
    setOpen(o);
  };
  const toggleArr = (key, v) => {
    setDraft((d) => {
      const arr = d[key];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      return {
        ...d,
        [key]: next
      };
    });
  };
  const Section = ({
    title,
    children
  }) => /* @__PURE__ */ jsxs("section", { className: "border-t border-ink/10 py-6 first:border-t-0 first:pt-0", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[10px] uppercase tracking-[0.22em] text-detail", children: title }),
    children
  ] });
  const Chip = ({
    active,
    onClick,
    children
  }) => /* @__PURE__ */ jsx("button", { type: "button", onClick, className: `border px-3 py-1.5 text-xs transition-colors ${active ? "border-ink bg-ink text-canvas" : "border-ink/20 text-detail hover:border-ink hover:text-ink"}`, children });
  return /* @__PURE__ */ jsxs(Sheet, { open, onOpenChange: openSheet, children: [
    /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { type: "button", className: "inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-canvas", children: [
      /* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-3.5" }),
      "Filters"
    ] }) }),
    /* @__PURE__ */ jsxs(SheetContent, { side: "right", className: "flex h-full w-full max-w-none flex-col gap-0 overflow-hidden bg-canvas p-0 sm:w-[440px] sm:max-w-[440px]", children: [
      /* @__PURE__ */ jsxs(SheetHeader, { className: "flex flex-row items-center justify-between border-b border-ink/10 px-6 py-5", children: [
        /* @__PURE__ */ jsx(SheetTitle, { className: "font-display text-2xl italic", children: "Refine lots" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setOpen(false), "aria-label": "Close", className: "text-detail hover:text-ink" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-6", children: [
        /* @__PURE__ */ jsx(Section, { title: `Bid · ${formatBid(draft.priceMin)} — ${formatBid(draft.priceMax)}`, children: /* @__PURE__ */ jsx(Slider, { value: [draft.priceMin, draft.priceMax], className: "mx-auto w-full max-w-xs", min: auctionPriceMin, max: auctionPriceMax, step: 100, onValueChange: ([min, max]) => setDraft((d) => ({
          ...d,
          priceMin: min,
          priceMax: max
        })) }) }),
        /* @__PURE__ */ jsx(Section, { title: "Category", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: auctionCategories.filter((c) => c.slug !== "all").map((c) => /* @__PURE__ */ jsx(Chip, { active: draft.category.includes(c.slug), onClick: () => toggleArr("category", c.slug), children: c.label }, c.slug)) }) }),
        /* @__PURE__ */ jsx(Section, { title: "Seller", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: artists.map((a) => /* @__PURE__ */ jsx(Chip, { active: draft.seller.includes(a.slug), onClick: () => toggleArr("seller", a.slug), children: a.name }, a.slug)) }) }),
        /* @__PURE__ */ jsx(Section, { title: "Status", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-ink", children: "Reserve met only" }),
            /* @__PURE__ */ jsx(Switch, { checked: draft.reserveMet, onCheckedChange: (v) => setDraft((d) => ({
              ...d,
              reserveMet: !!v
            })) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-ink", children: "Ending in 24 hours" }),
            /* @__PURE__ */ jsx(Switch, { checked: draft.endingSoon, onCheckedChange: (v) => setDraft((d) => ({
              ...d,
              endingSoon: !!v
            })) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("footer", { className: "flex items-center gap-3 border-t border-ink/10 bg-surface/60 px-6 py-4", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
          const d = defaultFilters();
          setDraft(d);
          onChange(d);
        }, className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: "Reset" }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
          onChange(draft);
          setOpen(false);
        }, className: "ml-auto border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: [
          "Show ",
          matchCount,
          " of ",
          totalCount
        ] })
      ] })
    ] })
  ] });
}
export {
  AuctionsPage as component
};
