import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Trophy, Image, Calendar, Tag, X } from "lucide-react";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { b as useAuthStore, c as useDataStore, n as cn, A as AuctionImageSwiper, k as formatBid } from "./router-BX1vAgXZ.js";
import { A as AccountStatusBlocker } from "./AccountStatusBlocker-DLVsxeue.js";
import { D as Dialog, a as DialogContent, b as DialogClose } from "./dialog-DXsFZm9r.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
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
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
const selectUserID = (s) => s.user?.userID ?? null;
const selectLoading = (s) => s.loading;
const selectHydrated = (s) => s.isAuthHydrated;
const selectListings = (s) => s.listings ?? [];
function listingsIdsEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]?.id !== b[i]?.id) return false;
  }
  return true;
}
function MyListingsPage() {
  const userID = useAuthStore(selectUserID, Object.is);
  const loading = useAuthStore(selectLoading, Object.is);
  const isAuthHydrated = useAuthStore(selectHydrated, Object.is);
  const user = useAuthStore((s) => s.user);
  const isAccountActive = user?.status === "active";
  const listings = useDataStore(selectListings, listingsIdsEqual);
  const [selected, setSelected] = useState(null);
  const myListings = useMemo(() => {
    if (!userID || !Array.isArray(listings)) return [];
    return listings.filter((l) => l.userID === userID);
  }, [listings, userID]);
  const sortedListings = useMemo(() => {
    return [...myListings].sort((a, b) => {
      const da = new Date(a.placedAt || a.createdAt || 0).getTime();
      const db = new Date(b.placedAt || b.createdAt || 0).getTime();
      return db - da;
    });
  }, [myListings]);
  const open = (l) => setSelected(l);
  const close = () => setSelected(null);
  if (loading || !isAuthHydrated) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Loading your collection…" }) });
  }
  if (!userID) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsx(Trophy, { className: "mx-auto size-10 text-detail" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-display text-4xl italic", children: "Sign in to view your listings" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-detail", children: "Your won auction works will appear here once you successfully acquire a lot." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/connect", className: "border border-ink bg-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Sign in" }),
        /* @__PURE__ */ jsx(Link, { to: "/auctions", className: "border border-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Browse auctions" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Collection", title: "My Listings", description: "Auction lots you have successfully won. Each piece is a record of your eye and commitment." }),
    !isAccountActive && user && /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pb-4", children: /* @__PURE__ */ jsx(AccountStatusBlocker, { action: "sell" }) }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-24", children: sortedListings.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center", children: [
      /* @__PURE__ */ jsx(Trophy, { className: "size-10 text-detail", strokeWidth: 1.2 }),
      /* @__PURE__ */ jsx("p", { className: "text-detail", children: "You haven’t won any auctions yet." }),
      /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm text-detail/80", children: "When you place the winning bid on a live auction, the lot will appear here as part of your collection." }),
      /* @__PURE__ */ jsx(Link, { to: "/auctions", className: "mt-2 border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Explore live auctions" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: sortedListings.map((listing) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => open(listing), className: "group flex flex-col overflow-hidden border border-ink/10 bg-canvas text-left transition hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30", children: /* @__PURE__ */ jsx(ListingCard, { listing }) }, listing.slug)) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selected, onOpenChange: (o) => !o && close(), children: /* @__PURE__ */ jsx(DialogContent, { className: cn("bg-canvas p-0 flex flex-col overflow-hidden border border-ink/10 shadow-2xl [&>button:last-child]:hidden", "fixed inset-0 w-full h-dvh max-w-none left-0 top-0 translate-x-0 translate-y-0 rounded-none", "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2", "md:w-[calc(100%-2rem)] md:max-w-4xl md:max-h-[90vh] md:h-[90dvh] md:rounded-xl"), children: selected && /* @__PURE__ */ jsx(ListingDetailModal, { listing: selected, onClose: close, isAccountActive }) }) })
  ] });
}
function ListingDetailModal({
  listing,
  onClose,
  isAccountActive = true
}) {
  const wonDate = listing.placedAt ? new Date(listing.placedAt).toLocaleDateString(void 0, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric"
  }) : listing.createdAt ? new Date(listing.createdAt).toLocaleDateString(void 0, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric"
  }) : "Unknown date";
  const statusLabel = (listing.status || "won").toLowerCase();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "shrink-0 border-b border-ink/10 bg-canvas px-5 py-4 flex items-start justify-between sticky top-0 z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 pr-8", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
          listing.category || "Work",
          " · Won ",
          wonDate
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-[22px] md:text-3xl italic leading-tight mt-0.5 break-words", children: listing.title }),
        listing.userName && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-detail", children: [
          "by ",
          listing.userName
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-detail hover:text-ink transition-colors", "aria-label": "Close", children: /* @__PURE__ */ jsx(X, { className: "size-5" }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto overscroll-contain", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-ink/10 bg-surface", children: listing.images && listing.images.length > 0 ? /* @__PURE__ */ jsx(AuctionImageSwiper, { images: listing.images, alt: listing.title, aspect: "aspect-[16/10] md:aspect-[16/9]" }) : /* @__PURE__ */ jsx("div", { className: "flex aspect-[16/10] md:aspect-[16/9] items-center justify-center bg-surface text-detail", children: /* @__PURE__ */ jsx(Image, { className: "size-10", strokeWidth: 1.2 }) }) }),
      /* @__PURE__ */ jsx("div", { className: "p-5 md:p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail mb-1", children: "Winning bid" }),
            /* @__PURE__ */ jsx("p", { className: "font-display text-4xl italic text-ink", children: formatBid(listing.bidAmount) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-ink/10 bg-surface/50 p-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-detail mb-2", children: [
              /* @__PURE__ */ jsx("span", { children: "Acquisition details" }),
              /* @__PURE__ */ jsx(Trophy, { className: "size-3.5" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-detail", children: "Status" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink capitalize", children: statusLabel })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-detail", children: "Total bids" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: listing.totalBidCounts ?? 0 })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-detail", children: "Won on" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: wonDate })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail mb-2", children: "Description" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-ink/80 whitespace-pre-line", children: listing.description || "No description provided." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-px bg-ink/10", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Year" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg", children: listing.year || "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Medium" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg", children: listing.medium || "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Dimensions" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg", children: listing.dimensions || "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail", children: "Category" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg capitalize", children: listing.category || "—" })
            ] })
          ] }),
          (listing.provenance || listing.condition) && /* @__PURE__ */ jsxs("div", { className: "border border-ink/10 p-4 text-sm", children: [
            listing.provenance && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail mb-1", children: "Provenance" }),
              /* @__PURE__ */ jsx("p", { className: "text-ink/80", children: listing.provenance })
            ] }),
            listing.condition && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail mb-1", children: "Condition" }),
              /* @__PURE__ */ jsx("p", { className: "text-ink/80", children: listing.condition })
            ] })
          ] }),
          listing.images && listing.images.length > 1 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.18em] text-detail mb-2", children: [
              "More views (",
              listing.images.length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: listing.images.slice(1, 4).map((src, i) => /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] overflow-hidden border border-ink/10 bg-surface", children: /* @__PURE__ */ jsx("img", { src, alt: `${listing.title} view ${i + 2}`, className: "h-full w-full object-cover" }) }, i)) })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "shrink-0 border-t border-ink/10 bg-surface/70 px-5 py-3 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx(Link, { to: "/auctions/$slug", params: {
        slug: listing.slug
      }, className: "text-[11px] uppercase tracking-[0.22em] text-detail underline decoration-ink/30 hover:text-ink hover:decoration-ink", children: "View original auction →" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/sell", search: {
          fromListing: listing.slug
        }, className: "border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-canvas disabled:opacity-50 disabled:pointer-events-none", onClick: (e) => {
          if (!isAccountActive) {
            e.preventDefault();
            return;
          }
          onClose();
        }, style: !isAccountActive ? {
          pointerEvents: "none",
          opacity: 0.5
        } : void 0, children: "Edit & Re-auction" }),
        /* @__PURE__ */ jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsx("button", { onClick: onClose, className: "border border-ink bg-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Close" }) })
      ] })
    ] })
  ] });
}
function ListingCard({
  listing
}) {
  const wonDate = listing.placedAt ? new Date(listing.placedAt).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) : listing.createdAt ? new Date(listing.createdAt).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) : null;
  const statusLabel = (listing.status || "won").toLowerCase();
  const isClaimed = ["won", "claimed", "paid", "delivered"].includes(statusLabel);
  return /* @__PURE__ */ jsxs("div", { className: "group flex flex-col overflow-hidden border border-ink/10 bg-canvas transition hover:border-ink/30", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative bg-surface", children: [
      listing.images && listing.images.length > 0 ? /* @__PURE__ */ jsx(AuctionImageSwiper, { images: listing.images, alt: listing.title, aspect: "aspect-[16/11]" }) : /* @__PURE__ */ jsx("div", { className: "flex aspect-[16/11] items-center justify-center bg-surface text-detail", children: /* @__PURE__ */ jsx(Image, { className: "size-8", strokeWidth: 1.2 }) }),
      /* @__PURE__ */ jsxs("div", { className: cn("absolute left-3 top-3 inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em]", isClaimed ? "border-clay/40 bg-clay/10 text-clay" : "border-ink/20 bg-canvas/90 text-detail"), children: [
        /* @__PURE__ */ jsx(Trophy, { className: "size-3", strokeWidth: 2 }),
        statusLabel === "won" ? "Won" : listing.status || "Won"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 right-3 border border-ink/10 bg-canvas/95 px-3 py-1 text-right backdrop-blur", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase tracking-[0.2em] text-detail", children: "Winning bid" }),
        /* @__PURE__ */ jsx("p", { className: "font-display text-xl italic leading-none text-ink", children: formatBid(listing.bidAmount) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
          listing.year ? `${listing.year} · ` : "",
          listing.category || "Work"
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-1 font-display text-2xl italic leading-tight group-hover:text-clay", children: listing.title }),
        listing.userName && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-detail", children: [
          "by ",
          listing.userName
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto space-y-3 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]", children: [
          listing.medium && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] uppercase tracking-[0.18em] text-detail", children: "Medium" }),
            /* @__PURE__ */ jsx("span", { children: listing.medium })
          ] }),
          listing.dimensions && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] uppercase tracking-[0.18em] text-detail", children: "Dimensions" }),
            /* @__PURE__ */ jsx("span", { children: listing.dimensions })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-detail", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "size-3.5" }),
            /* @__PURE__ */ jsx("span", { children: wonDate ? `Won ${wonDate}` : "Date unavailable" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] uppercase tracking-[0.18em]", children: [
            /* @__PURE__ */ jsx(Tag, { className: "size-3" }),
            listing.totalBidCounts ?? 0,
            " bids"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-ink/10 bg-surface/40 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-detail", children: [
      /* @__PURE__ */ jsx("span", { children: "View details" }),
      /* @__PURE__ */ jsx("span", { className: "text-clay/70 group-hover:text-clay transition", children: "In collection" })
    ] })
  ] });
}
export {
  MyListingsPage as component
};
