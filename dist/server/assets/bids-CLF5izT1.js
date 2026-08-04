import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Gavel, Trash2 } from "lucide-react";
import { g as getAuctionBySlug, f as formatBid } from "./auctions-BSTwHsAU.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { S as SmartImage } from "./SmartImage-BnUWDzq7.js";
import { C as Countdown } from "./Countdown-DRtUvczQ.js";
import { c as useDataStore } from "./router-07wj3SDc.js";
import { useShallow } from "zustand/shallow";
import "motion/react";
import "react";
import "@tanstack/react-query";
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
function BidsPage() {
  const {
    bids
  } = useDataStore(useShallow((s) => ({
    bids: s.bids
  })));
  const rows = bids.map((b) => ({
    bid: b,
    lot: getAuctionBySlug(b.slug)
  })).filter((r) => !!r.lot);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Auction", title: "My Bids", description: "A live view of every lot you've placed a bid on." }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32 pt-6", children: rows.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center", children: [
      /* @__PURE__ */ jsx(Gavel, { className: "size-10 text-detail", strokeWidth: 1.2 }),
      /* @__PURE__ */ jsx("p", { className: "text-detail", children: "You haven't placed any bids yet." }),
      /* @__PURE__ */ jsx(Link, { to: "/auctions", className: "border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "View live auction" })
    ] }) : /* @__PURE__ */ jsx("ul", { className: "flex flex-col divide-y divide-ink/10 border-y border-ink/10", children: rows.map(({
      bid,
      lot
    }) => {
      const leading = bid.bidAmount >= lot.price;
      return /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-6 py-6", children: [
          /* @__PURE__ */ jsx(Link, { to: "/auctions/$slug", params: {
            slug: lot.slug
          }, className: "block size-32 shrink-0 overflow-hidden bg-surface", children: /* @__PURE__ */ jsx(SmartImage, { src: lot.images[0], alt: lot.title, width: 400, height: 400, className: "h-full w-full object-cover" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
              "Lot ",
              lot.lotNumber.slice(0, 6),
              " · ",
              lot.categoryLabel
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/auctions/$slug", params: {
              slug: lot.slug
            }, className: "font-display text-2xl italic text-ink hover:text-clay", children: lot.title }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex  flex-wrap items-baseline gap-x-3 gap-y-1 text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-detail", children: [
                "Your bid:",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-display text-lg italic text-ink not-italic", children: formatBid(bid.bidAmount) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-detail", children: [
                "Current Price: ",
                formatBid(lot.price)
              ] }),
              /* @__PURE__ */ jsx("span", { className: leading ? "border border-clay/40 bg-clay/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-clay" : "border border-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-detail", children: leading ? "Leading" : "Outbid" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end justify-between text-right", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "text-detail/80 hover:text-ink/80 transition-colors text-right float-right",
                children: /* @__PURE__ */ jsx(Trash2, { strokeWidth: 1.2, size: 18 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "shrink-0 min-w-0  hidden sm:block", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail ", children: "Closes in" }),
              /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(Countdown, { endsAt: lot.endsAt, size: "sm" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "shrink-0 min-w-0  flex justify-between items-end mb-4 block sm:hidden", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail ", children: "Closes in" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(Countdown, { endsAt: lot.endsAt, size: "sm" }) })
        ] })
      ] }, `${bid.slug}-${bid.placedAt}`);
    }) }) })
  ] });
}
export {
  BidsPage as component
};
