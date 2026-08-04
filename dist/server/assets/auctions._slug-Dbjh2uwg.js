import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useParams, notFound, useNavigate, Link } from "@tanstack/react-router";
import { Gavel, Heart, MapPin, Mail } from "lucide-react";
import { g as getAuctionBySlug, e as getSeller, h as getLotsBySeller, f as formatBid } from "./auctions-BSTwHsAU.js";
import { S as SmartImage } from "./SmartImage-BnUWDzq7.js";
import { C as Countdown } from "./Countdown-DRtUvczQ.js";
import { A as AuctionCard } from "./AuctionCard-DwQgjUbb.js";
import { c as useDataStore, b as useAuthStore, e as useStore, Y as handleWalletBalance, i as cn, a as useToast } from "./router-07wj3SDc.js";
import { useShallow } from "zustand/shallow";
import { u as useDoc } from "./useDoc-ZchnV3Lq.js";
import { L as Loader } from "./Loader-CCvwETFd.js";
import z__default from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { F as Fields } from "./Fields-DFgKoI-S.js";
import "motion/react";
import "./AuctionImageSwiper-DoZ88T7q.js";
import "embla-carousel-react";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "clsx";
import "tailwind-merge";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "./currencies-G6nNjE1o.js";
function AuctionLotPage() {
  const {
    auctions
  } = useDataStore(useShallow((s) => ({
    auctions: s.auctions
  })));
  const {
    slug
  } = useParams({
    from: "/auctions/$slug"
  });
  const lot = useMemo(() => getAuctionBySlug(slug), [slug]);
  if (!lot) {
    throw notFound();
  }
  const seller = getSeller(lot.sellerSlug);
  const {
    user
  } = useAuthStore();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    setDocument,
    updateDocument
  } = useDoc();
  const sellerOtherLots = getLotsBySeller(lot.sellerSlug).filter((l) => l.slug !== lot.slug);
  const amountSchema = z__default.object({
    bidAmount: z__default.number().min(1, {
      message: `Minumum Amount To Enter is ${formatBid(lot.estimateLow)}`
    })
  });
  const formControl = useForm({
    mode: "onChange",
    resolver: zodResolver(amountSchema),
    defaultValues: {
      bidAmount: 0
    }
  });
  const railImages = [...lot.images.map((src, i) => ({
    src,
    label: `${lot.title} · ${i + 1}`,
    lotSlug: lot.slug
  })), ...sellerOtherLots.map((l) => ({
    src: l.images[0],
    label: `Lot ${l.lotNumber} · ${l.title}`,
    lotSlug: l.slug
  }))];
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const active = railImages[activeIdx] ?? railImages[0];
  const related = auctions.filter((l) => l.category === lot.category && l.slug !== lot.slug).slice(0, 3);
  const {
    placeBid,
    toggleFavorite,
    isFavorite
  } = useStore();
  const fav = isFavorite(lot.slug);
  const submitBid = formControl.handleSubmit(async () => {
    if (!user) return;
    const {
      bidAmount: formBidAmount
    } = formControl.getValues();
    try {
      setLoading(true);
      if (user.wallet.balance < lot.estimateLow) {
        setTimeout(() => {
          toast({
            title: "Info",
            description: "Unable To Place Bid On This Lot (Estimate Low), Please Top Up Your Wallet Balance",
            variant: "info",
            action: {
              label: "Go To Wallet",
              onClick: () => {
                navigate({
                  to: "/wallet"
                });
              }
            },
            duration: 6e3,
            position: "top"
          });
        }, 3100);
        return;
      }
      const payload = {
        auctionID: lot.id,
        bidAmount: formBidAmount,
        placedAt: (/* @__PURE__ */ new Date()).toISOString(),
        slug: lot.slug,
        userID: user?.userID
      };
      await setDocument({
        collections: "bids",
        document: {
          ...payload,
          id: lot.id
        }
      });
      await handleWalletBalance({
        balance: user.wallet.balance,
        bidAmount: formBidAmount,
        bidBalance: user.wallet.bidBalance,
        userID: user?.userID
      });
      await updateDocument({
        collections: "auctions",
        document: {
          id: lot.id,
          bidCount: lot.bidCount + 1
        }
      });
      setTimeout(() => {
        toast({
          title: "Bid Placed Successfully",
          description: "You Will Be Notified If You Won The Bid Eventually",
          duration: 5e4,
          variant: "reserved",
          position: "bottom"
        });
      }, 3100);
    } catch (error) {
      toast({
        title: "Error Message",
        description: error?.message ?? "Failed to place bid",
        variant: "error"
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3e3);
    }
  });
  const checkIfUserCanBid = lot?.userID !== user?.userID;
  return /* @__PURE__ */ jsxs("article", { children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pt-12", children: /* @__PURE__ */ jsx(Link, { to: "/auctions", className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: "← Back to auction" }) }),
    loading && /* @__PURE__ */ jsx(Loader, { message: "Processing Your Request, Please Hold...", className: "flex flex-col", variant: "dots", size: "xs", fullScreen: true }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-12 px-6 py-12 md:py-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 md:gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex w-16 shrink-0 flex-col gap-3 md:w-20", children: railImages.slice(0, 5).map((img, i) => {
          const isActive = i === activeIdx;
          const isOtherLot = img.lotSlug !== lot.slug;
          return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveIdx(i), className: cn("group relative aspect-square overflow-hidden bg-surface outline outline-1 -outline-offset-1 transition-all", isActive ? "outline-ink" : "outline-ink/10 hover:outline-ink/40"), "aria-label": img.label, title: img.label, children: [
            /* @__PURE__ */ jsx(SmartImage, { src: img.src, alt: img.label, className: cn("absolute inset-0 h-full w-full object-cover transition-opacity", isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100") }),
            isOtherLot && /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1 bg-canvas/80 px-1 text-[8px] uppercase tracking-[0.18em] text-ink", children: "Other" })
          ] }, `${img.src}-${i}`);
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 bg-surface", children: [
          /* @__PURE__ */ jsx(SmartImage, { src: active?.src ?? lot.images[0], alt: active?.label ?? lot.title, priority: true, className: "block h-auto w-full animate-in fade-in duration-500" }, active?.src),
          active?.lotSlug && active.lotSlug !== lot.slug && /* @__PURE__ */ jsx(Link, { to: "/auctions/$slug", params: {
            slug: active.lotSlug
          }, className: "absolute bottom-4 left-4 inline-flex items-center gap-2 border border-canvas/40 bg-canvas/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ink backdrop-blur hover:bg-canvas", children: "View this lot →" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "flex flex-col gap-8 lg:sticky lg:top-32 lg:self-start", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] uppercase tracking-[0.3em] text-clay", children: [
            "Lot ",
            lot.lotNumber.slice(0, 5),
            " · ",
            lot.categoryLabel
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-5xl italic leading-tight md:text-6xl", children: lot.title }),
          seller && /* @__PURE__ */ jsx(Link, { to: "/artists/$slug", params: {
            slug: seller.slug
          }, className: "mt-3 inline-block text-base text-detail underline decoration-detail/30 underline-offset-4 hover:text-ink hover:decoration-ink", children: seller.name })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed text-ink/80", children: lot.description }),
        /* @__PURE__ */ jsxs("div", { className: "border border-ink/15 bg-surface/50 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Current bid" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 font-display text-4xl italic text-ink", children: formatBid(lot.currentBid) }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-detail", children: [
                lot.bidCount,
                " bids · estimate ",
                formatBid(lot.estimateLow),
                "–",
                formatBid(lot.estimateHigh),
                " · Price ",
                formatBid(lot.price)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]", lot.reserveMet ? "border-clay/40 bg-clay/10 text-clay" : "border-ink/20 text-detail"), children: [
              /* @__PURE__ */ jsx("span", { className: cn("size-1.5 rounded-full", lot.reserveMet ? "bg-clay" : "bg-detail/50") }),
              lot.reserveMet ? "Reserve met" : "No reserve yet"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 border-t border-ink/10 pt-6", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Closes in" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(Countdown, { endsAt: lot.endsAt, size: "md" }) })
          ] }),
          checkIfUserCanBid ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(FormProvider, { ...formControl, children: [
            /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsx(Fields, { fields: [{
              fieldType: "input",
              name: "bidAmount",
              label: "Your bid",
              format: "money",
              labelClass: "text-right ",
              attrs: {
                className: "w-full !border border-ink/20 bg-canvas py-3 px-3 text-base text-ink focus:outline-none"
              }
            }] }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row", children: [
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: submitBid, className: "inline-flex items-center justify-center gap-2 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: [
                /* @__PURE__ */ jsx(Gavel, { className: "size-3.5", strokeWidth: 1.5 }),
                "Place bid"
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleFavorite(lot.slug), "aria-label": fav ? "Remove from favourites" : "Add to favourites", className: cn("inline-flex size-12 items-center justify-center border transition-colors", fav ? "border-clay bg-clay/10 text-clay" : "border-ink/20 text-ink hover:border-ink"), children: /* @__PURE__ */ jsx(Heart, { className: "size-4", strokeWidth: 1.5, fill: fav ? "currentColor" : "none" }) })
            ] })
          ] }) }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("p", { className: "text-ink/75 font-display italic text-xl mt-4", children: "You Can't Place Bid As You Are The Author Of This Work" }) })
        ] }),
        /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Medium" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm", children: lot.medium })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Dimensions" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm", children: lot.dimensions })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Year" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm", children: lot.year })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Condition" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm", children: lot.condition })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-2 bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Provenance" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm", children: lot.provenance })
          ] })
        ] }),
        seller && /* @__PURE__ */ jsxs("div", { className: "border border-ink/10 p-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Consigned by" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-start gap-4", children: [
            /* @__PURE__ */ jsx(SmartImage, { src: seller.portrait, alt: seller.name, width: 88, height: 88, className: "size-20 shrink-0 object-cover" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-display text-2xl italic", children: seller.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-detail", children: seller.discipline }),
              /* @__PURE__ */ jsxs("p", { className: "mt-2 inline-flex items-center gap-1.5 text-xs text-detail", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "size-3", strokeWidth: 1.5 }),
                seller.location
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-relaxed text-ink/75", children: seller.short }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsx(Link, { to: "/artists/$slug", params: {
              slug: seller.slug
            }, className: "text-[11px] uppercase tracking-[0.22em] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink", children: "Artist page" }),
            /* @__PURE__ */ jsxs("a", { href: "mailto:hello@aethelred.gallery", className: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: [
              /* @__PURE__ */ jsx(Mail, { className: "size-3", strokeWidth: 1.5 }),
              "Contact seller"
            ] })
          ] })
        ] })
      ] })
    ] }),
    sellerOtherLots.length > 0 && seller && /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 pb-20", children: [
      /* @__PURE__ */ jsxs("h2", { className: "mb-10 border-b border-ink/10 pb-6 font-display text-3xl italic", children: [
        "More from ",
        seller.name
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3", children: sellerOtherLots.slice(0, 3).map((l) => /* @__PURE__ */ jsx(AuctionCard, { lot: l }, l.slug)) })
    ] }),
    related.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 pb-32", children: [
      /* @__PURE__ */ jsxs("h2", { className: "mb-10 border-b border-ink/10 pb-6 font-display text-3xl italic", children: [
        "Related lots in ",
        lot.categoryLabel
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3", children: related.map((l) => /* @__PURE__ */ jsx(AuctionCard, { lot: l }, l.slug)) })
    ] })
  ] });
}
export {
  AuctionLotPage as component
};
