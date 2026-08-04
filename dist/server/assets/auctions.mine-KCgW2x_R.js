import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Gavel, Clock, Eye } from "lucide-react";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { i as cn, b as useAuthStore, c as useDataStore } from "./router-07wj3SDc.js";
import { useShallow } from "zustand/shallow";
import { f as formatBid } from "./auctions-BSTwHsAU.js";
import { A as AuctionImageSwiper } from "./AuctionImageSwiper-DoZ88T7q.js";
import { C as Countdown } from "./Countdown-DRtUvczQ.js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
import "@radix-ui/react-select";
import "embla-carousel-react";
import "./SmartImage-BnUWDzq7.js";
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(DialogPrimitive.Description, { className: "sr-only", children: "Dialog content" }),
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function MyAuctionsPage() {
  const {
    user,
    loading,
    isAuthHydrated
  } = useAuthStore(useShallow((s) => ({
    user: s.user,
    loading: s.loading,
    isAuthHydrated: s.isAuthHydrated
  })));
  const {
    auctions
  } = useDataStore(useShallow((s) => ({
    auctions: s.auctions
  })));
  const [selected, setSelected] = useState(null);
  const myAuctions = auctions.filter((a) => {
    if (!user) return false;
    if (a.userID && user.userID) return a.userID === user.userID;
    const emailUser = user.email?.split("@")[0]?.toLowerCase().replace(/\./g, "-");
    return a.sellerSlug === emailUser || a.sellerSlug === user.userName;
  });
  const open = (lot) => setSelected(lot);
  const close = () => setSelected(null);
  if (loading || !isAuthHydrated) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Loading…" }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsx(Gavel, { className: "mx-auto size-10 text-detail" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-display text-4xl italic", children: "Sign in to view your auctions" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-detail", children: "You need an account to see lots you've put up for auction." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/connect", className: "border border-ink bg-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Sign in" }),
        /* @__PURE__ */ jsx(Link, { to: "/auctions", className: "border border-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Browse auctions" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Auction", title: "My Auctions", description: "All lots you've consigned. Click any card to inspect full details." }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-24 pt-6", children: myAuctions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center", children: [
      /* @__PURE__ */ jsx(Gavel, { className: "size-10 text-detail", strokeWidth: 1.2 }),
      /* @__PURE__ */ jsx("p", { className: "text-detail", children: "You haven't put any lots up for auction yet." }),
      /* @__PURE__ */ jsx(Link, { to: "/sell", className: "border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Consign a work" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: myAuctions.map((lot) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => open(lot), className: "group flex flex-col overflow-hidden border border-ink/10 bg-canvas text-left transition hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(AuctionImageSwiper, { images: lot.images?.length ? lot.images : [], alt: lot.title, aspect: "aspect-[16/10]" }),
        /* @__PURE__ */ jsx("span", { className: cn("absolute right-3 top-3 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] border", lot.status === "active" ? "border-clay/40 bg-clay/10 text-clay" : lot.status === "pending" ? "border-ink/20 bg-canvas text-detail" : "border-ink/20 bg-canvas text-detail"), children: lot.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-3 p-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
            "Lot ",
            lot.lotNumber || "—",
            " · ",
            lot.categoryLabel
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 font-display text-2xl italic leading-tight group-hover:text-clay", children: lot.title }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-detail", children: [
            lot.year,
            " · ",
            lot.medium
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Current bid" }),
            /* @__PURE__ */ jsx("p", { className: "font-display text-xl italic", children: formatBid(lot.currentBid) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Estimate" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
              formatBid(lot.estimateLow),
              " – ",
              formatBid(lot.estimateHigh)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Bids" }),
            /* @__PURE__ */ jsx("p", { children: lot.bidCount })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Starts at" }),
            /* @__PURE__ */ jsx("p", { children: formatBid(lot.startBid) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between border-t border-ink/10 pt-3 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-detail", children: [
            /* @__PURE__ */ jsx(Clock, { className: "size-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Closes" })
          ] }),
          /* @__PURE__ */ jsx(Countdown, { endsAt: lot.endsAt, size: "sm" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-detail", children: [
          /* @__PURE__ */ jsx("span", { className: cn(lot.reserveMet ? "text-clay" : ""), children: lot.reserveMet ? "Reserve met" : "No reserve yet" }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 opacity-60 group-hover:opacity-100", children: [
            "View details ",
            /* @__PURE__ */ jsx(Eye, { className: "size-3.5" })
          ] })
        ] })
      ] })
    ] }, lot.slug)) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selected, onOpenChange: (o) => !o && close(), children: /* @__PURE__ */ jsx(DialogContent, { className: cn(
      "bg-canvas p-0 flex flex-col overflow-hidden border border-ink/10 shadow-2xl",
      // Mobile: true fullscreen, scroll inside
      "fixed inset-0 w-full h-dvh max-w-none left-0 top-0 translate-x-0 translate-y-0 rounded-none",
      // Desktop: centered, elegant, NOT full screen
      "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
      "md:w-[calc(100%-2rem)] md:max-w-5xl md:max-h-[88vh] md:h-auto md:rounded-xl"
    ), children: selected && /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0 border-b border-ink/10 bg-canvas px-5 py-4 flex items-start justify-between sticky top-0 z-10", children: /* @__PURE__ */ jsxs("div", { className: "min-w-0 pr-8", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
          "Lot ",
          selected.lotNumber || "—",
          " · ",
          selected.categoryLabel
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-[22px] md:text-3xl italic leading-tight mt-0.5 break-words", children: selected.title })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto overscroll-contain", children: [
        /* @__PURE__ */ jsx("div", { className: "border-b border-ink/10 bg-surface", children: /* @__PURE__ */ jsx(AuctionImageSwiper, { images: selected.images?.length ? selected.images : [], alt: selected.title, aspect: "aspect-[16/10] md:aspect-[16/9]", priority: true }) }),
        /* @__PURE__ */ jsx("div", { className: "p-5 md:p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs(DetailSection, { title: "Overview", children: [
              /* @__PURE__ */ jsx(DetailRow, { label: "Slug", value: selected.slug }),
              /* @__PURE__ */ jsx(DetailRow, { label: "ID", value: selected.id || "—" }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Seller", value: selected.sellerSlug }),
              /* @__PURE__ */ jsx(DetailRow, { label: "User ID", value: selected.userID || "—" }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Status", value: selected.status })
            ] }),
            /* @__PURE__ */ jsxs(DetailSection, { title: "Artwork", children: [
              /* @__PURE__ */ jsx(DetailRow, { label: "Year", value: String(selected.year) }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Medium", value: selected.medium }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Dimensions", value: selected.dimensions }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Description", value: selected.description })
            ] }),
            /* @__PURE__ */ jsxs(DetailSection, { title: "Provenance & Condition", children: [
              /* @__PURE__ */ jsx(DetailRow, { label: "Provenance", value: selected.provenance }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Condition", value: selected.condition })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs(DetailSection, { title: "Pricing", children: [
              /* @__PURE__ */ jsx(DetailRow, { label: "Price", value: formatBid(selected.price) }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Estimate", value: `${formatBid(selected.estimateLow)} – ${formatBid(selected.estimateHigh)}` }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Start Bid", value: formatBid(selected.startBid) }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Current Bid", value: formatBid(selected.currentBid) })
            ] }),
            /* @__PURE__ */ jsxs(DetailSection, { title: "Bidding", children: [
              /* @__PURE__ */ jsx(DetailRow, { label: "Bids", value: String(selected.bidCount) }),
              /* @__PURE__ */ jsx(DetailRow, { label: "Reserve", value: selected.reserveMet ? "Met" : "Not met yet" })
            ] }),
            /* @__PURE__ */ jsxs(DetailSection, { title: "Closes", children: [
              /* @__PURE__ */ jsx(DetailRow, { label: "Ends at", value: new Date(selected.endsAt).toLocaleString() }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1 text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-detail", children: "Time left" }),
                /* @__PURE__ */ jsx(Countdown, { endsAt: selected.endsAt, size: "sm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(DetailSection, { title: "Images", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] uppercase tracking-[0.18em] text-detail mb-2", children: [
                selected.images?.length || 0,
                " image",
                (selected.images?.length || 0) === 1 ? "" : "s"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: (selected.images || []).map((src, i) => /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] overflow-hidden border border-ink/10 bg-surface", children: /* @__PURE__ */ jsx("img", { src, alt: `${selected.title} ${i + 1}`, className: "h-full w-full object-cover" }) }, i)) })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "shrink-0 border-t border-ink/10 bg-surface/70 px-5 py-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/auctions/$slug", params: {
          slug: selected.slug
        }, className: "text-[11px] uppercase tracking-[0.22em] text-detail underline decoration-ink/30 hover:text-ink hover:decoration-ink", children: "View public page →" }),
        /* @__PURE__ */ jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "border border-ink bg-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Close" }) })
      ] })
    ] }) }) })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "border border-ink/10 bg-surface/40 p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-3 flex items-center gap-2 border-b border-ink/10 pb-2", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: title }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2 text-sm", children })
  ] });
}
function KV({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 py-0.5 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[11px] uppercase tracking-[0.18em] text-detail/80 pt-0.5", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-right break-words font-medium text-ink/90", children: value })
  ] });
}
const DetailSection = Section;
const DetailRow = KV;
export {
  MyAuctionsPage as component
};
