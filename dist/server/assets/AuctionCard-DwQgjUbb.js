import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Gavel } from "lucide-react";
import { e as getSeller, h as getLotsBySeller, f as formatBid } from "./auctions-BSTwHsAU.js";
import { A as AuctionImageSwiper } from "./AuctionImageSwiper-DoZ88T7q.js";
import { C as Countdown } from "./Countdown-DRtUvczQ.js";
function AuctionCard({ lot, priority }) {
  const seller = getSeller(lot.sellerSlug);
  const otherSellerImages = getLotsBySeller(lot.sellerSlug).filter((l) => l.slug !== lot.slug).map((l) => l.images[0]);
  const swipable = [...lot.images, ...otherSellerImages];
  return /* @__PURE__ */ jsxs("article", { className: "group flex flex-col bg-canvas outline outline-1 -outline-offset-1 outline-ink/10 transition-colors hover:outline-ink/30", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        AuctionImageSwiper,
        {
          images: swipable,
          alt: lot.title,
          priority,
          aspect: "aspect-[4/5]"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 border border-canvas/50 bg-canvas/85 px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] backdrop-blur", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: lot.reserveMet ? "size-1.5 rounded-full bg-clay" : "size-1.5 rounded-full bg-detail/50"
          }
        ),
        lot.reserveMet ? "Reserve met" : "No reserve yet"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
        lot.categoryLabel,
        " · ",
        lot.year
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-3xl italic leading-tight text-ink", children: /* @__PURE__ */ jsx(Link, { to: "/auctions/$slug", params: { slug: lot.slug }, className: "hover:text-clay", children: lot.title }) }),
      seller && /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/artists/$slug",
          params: { slug: seller.slug },
          className: "mt-1 text-xs text-detail underline decoration-detail/20 underline-offset-4 hover:text-ink hover:decoration-ink",
          children: [
            seller.name,
            " · ",
            seller.location
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-4 line-clamp-2 text-sm leading-relaxed text-ink/70", children: lot.description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase tracking-[0.22em] text-detail", children: "Price" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 font-display text-2xl italic text-ink", children: formatBid(lot.price) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-[10px] text-detail", children: [
            lot.bidCount,
            " ",
            lot.bidCount === 1 ? "bid" : "bids"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase tracking-[0.22em] text-detail", children: "Estimate" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 font-display text-lg italic text-ink/80", children: [
            formatBid(lot.estimateLow),
            " – ",
            formatBid(lot.estimateHigh)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(Countdown, { endsAt: lot.endsAt, size: "sm" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/auctions/$slug",
            params: { slug: lot.slug },
            className: "inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-clay hover:border-clay",
            children: [
              /* @__PURE__ */ jsx(Gavel, { className: "size-3.5", strokeWidth: 1.5 }),
              "Place a bid"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  AuctionCard as A
};
