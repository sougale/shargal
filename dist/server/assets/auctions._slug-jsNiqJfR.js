import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useParams, notFound, useNavigate, Link } from "@tanstack/react-router";
import { DollarSign, Gavel, Heart, MapPin, Mail } from "lucide-react";
import { A as AccountStatusBlocker } from "./AccountStatusBlocker-DLVsxeue.js";
import { c as useDataStore, C as getAuctionBySlug, a5 as getSeller, b as useAuthStore, e as useDoc, a6 as getLotsBySeller, k as formatBid, h as useStore, m as db, a7 as handleWalletBalance, s as sendUserNotification, f as sendAdminNotification, S as SmartImage, n as cn, a as useToast } from "./router-BX1vAgXZ.js";
import { C as Countdown } from "./Countdown-ChSopNTt.js";
import { A as AuctionCard } from "./AuctionCard-BHqp-dRx.js";
import { L as Loader } from "./Loader-BKqcHLqb.js";
import z__default from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { F as Fields } from "./Fields-DF9Phyx1.js";
import { doc, getDoc } from "firebase/firestore";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "appwrite";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
import "./currencies-G6nNjE1o.js";
function AuctionLotPage() {
  const auctions = useDataStore((s) => s.auctions);
  const bids = useDataStore((s) => s.bids);
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
  const user = useAuthStore((s) => s.user);
  const isAccountActive = useAuthStore((s) => s.user?.status === "active");
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
      message: `Minumum Amount To Enter is ${formatBid(lot.currentBid || lot.startBid)}`
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
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.status !== "active") {
      toast({
        title: "Account not active",
        description: "Your account must be approved before you can place bids.",
        variant: "info"
      });
      return;
    }
    if (currentUser.wallet.balance == 0) {
      toast({
        title: "Not allowed",
        description: "Top Up Your Wallet Balance.",
        variant: "info"
      });
      return;
    }
    if (lot.userID === currentUser.userID) {
      toast({
        title: "Not allowed",
        description: "You cannot bid on your own auction lot.",
        variant: "info"
      });
      return;
    }
    const currentLeader = bids.find((b) => b.id === lot.id);
    if (currentLeader?.userID === currentUser.userID) {
      toast({
        title: "Already leading",
        description: "You are the current highest bidder and cannot place another bid until outbid.",
        variant: "info"
      });
      return;
    }
    if (lot.status !== "active") {
      toast({
        title: "Auction unavailable",
        description: "This lot is not open for bidding.",
        variant: "info"
      });
      return;
    }
    const {
      bidAmount: formBidAmount
    } = formControl.getValues();
    if (currentUser.wallet.balance < (lot.currentBid || lot.startBid) || formBidAmount > currentUser.wallet.balance) {
      toast({
        title: "Info",
        description: "Insufficient Balance, Please Top Up Your Wallet Balance",
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
      return;
    }
    try {
      setLoading(true);
      if (formBidAmount < (lot.currentBid || lot.startBid)) {
        setTimeout(() => {
          toast({
            title: "Info",
            description: "Bid Lower Than The Minimum Bidding Amount, Please Top Up Your Bid Amount",
            variant: "info",
            duration: 1e4,
            position: "top"
          });
        }, 3100);
        return;
      }
      const payload = {
        fullName: currentUser.fullName,
        email: currentUser.email,
        lotTitle: lot.title,
        status: "Leading",
        auctionID: lot.id,
        bidAmount: formBidAmount,
        placedAt: (/* @__PURE__ */ new Date()).toISOString(),
        slug: lot.slug,
        userID: currentUser.userID
      };
      const previousBid = doc(db, "bids", lot.id);
      const getPreviousBid = await getDoc(previousBid);
      if (getPreviousBid.exists()) {
        const previousUserBid = doc(db, "users", getPreviousBid.data().userID);
        const getPreviousBidUser = await getDoc(previousUserBid);
        if (getPreviousBid.exists() && getPreviousBidUser.exists()) {
          const bidData = getPreviousBid.data();
          const userData = getPreviousBidUser.data();
          const newBal = await (userData.wallet.balance + bidData.bidAmount);
          const newBidBal = await Math.max(0, userData.wallet.bidBalance - bidData.bidAmount);
          await updateDocument({
            collections: "users",
            document: {
              id: userData.userID,
              wallet: {
                balance: newBal,
                bidBalance: newBidBal
              }
            }
          });
          setTimeout(async () => {
            await updateDocument({
              collections: "bids",
              document: {
                id: lot.id,
                lastBid: bidData.bidAmount
              }
            });
          }, 3e3);
        }
      }
      await setDocument({
        collections: "bids",
        document: {
          ...payload,
          id: lot.id
        }
      });
      await handleWalletBalance({
        balance: currentUser.wallet.balance,
        bidAmount: formBidAmount,
        bidBalance: currentUser.wallet.bidBalance,
        userID: currentUser.userID
      });
      console.log({
        totalBalanceAfter: {
          userTotalBalance: currentUser.wallet.balance,
          userTotalBidBalance: currentUser.wallet.bidBalance
        }
      });
      await updateDocument({
        collections: "auctions",
        document: {
          id: lot.id,
          bidCount: lot.bidCount + 1,
          currentBid: formBidAmount
        }
      });
      try {
        await sendUserNotification("bid_placed", {
          to_email: currentUser.email,
          to_name: currentUser.fullName,
          lotTitle: lot.title,
          slug: lot.slug,
          bidAmount: formBidAmount,
          auctionID: lot.id,
          placedAt: (/* @__PURE__ */ new Date()).toISOString(),
          fullName: currentUser.fullName
        });
        await sendAdminNotification("bid_placed", {
          lotTitle: lot.title,
          slug: lot.slug,
          bidAmount: formBidAmount,
          auctionID: lot.id,
          fullName: currentUser.fullName,
          email: currentUser.email
        });
      } catch (e) {
        console.warn("[email] bid notification failed", e);
      }
      if (getPreviousBid.exists()) {
        const prevBid = getPreviousBid.data();
        if (prevBid.userID && prevBid.userID !== currentUser.userID) {
          const outbidNotification = {
            userID: prevBid.userID,
            type: "outbid",
            title: "You've been outbid",
            message: `${currentUser.fullName || "Someone"} placed a higher bid of ${formatBid(formBidAmount)} on "${lot.title}".`,
            data: {
              lotSlug: lot.slug,
              lotTitle: lot.title,
              auctionID: lot.id,
              newBidAmount: formBidAmount,
              newBidderName: currentUser.fullName || currentUser.email,
              previousBidAmount: prevBid.bidAmount
            },
            unread: true,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          setDocument({
            collections: "notifications",
            document: {
              ...outbidNotification,
              id: `${Date.now()}-${prevBid.userID.slice(0, 6)}`
            }
          }).catch(() => {
          });
          try {
            await sendUserNotification("outbid_notification", {
              to_email: prevBid.email,
              to_name: prevBid.fullName,
              lotTitle: lot.title,
              slug: lot.slug,
              bidAmount: formBidAmount,
              previousBid: prevBid.bidAmount,
              auctionID: lot.id,
              fullName: currentUser.fullName
            });
          } catch (e) {
            console.warn("[email] outbid notification failed", e);
          }
        }
      }
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
      formControl.reset();
      setTimeout(() => {
        setLoading(false);
      }, 3e3);
    }
  });
  const liveUser = useAuthStore((s) => s.user);
  const isSeller = lot?.userID === liveUser?.userID;
  const currentHighestBid = bids.find((b) => b.id === lot.id);
  const isCurrentLeader = currentHighestBid?.userID === liveUser?.userID;
  const isLotClosedForBidding = lot.status !== "active" || new Date(lot.endsAt).getTime() <= Date.now();
  const canPlaceBid = !!liveUser && isAccountActive && !isSeller && !isCurrentLeader && !isLotClosedForBidding;
  return /* @__PURE__ */ jsxs("article", { children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-ink/10 bg-surface/30 md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-detail", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Wallet connected · ",
        user?.fullName,
        " "
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(DollarSign, { className: "size-4" }),
          formatBid(user?.wallet.balance ?? 0),
          /* @__PURE__ */ jsx("p", { children: "·" }),
          /* @__PURE__ */ jsx(Gavel, { className: "size-4" }),
          formatBid(user?.wallet.bidBalance ?? 0)
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/wallet", className: "text-ink hover:text-clay block", children: "Open wallet →" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pt-12", children: /* @__PURE__ */ jsx(Link, { to: "/auctions", className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: "← Back to auction" }) }),
    loading && /* @__PURE__ */ jsx(Loader, { message: "Processing Your Request, Please Hold...", className: "flex flex-col !text-[11px] md:text-sm", variant: "dots", size: "xs", fullScreen: true }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-12 px-6 py-12 md:py-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16 relative", children: [
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
                " Bid(s) · Estimate ",
                formatBid(lot.estimateLow),
                "–",
                formatBid(lot.estimateHigh),
                " · Start Bid At",
                " ",
                formatBid(lot.startBid)
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
          canPlaceBid ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(FormProvider, { ...formControl, children: [
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
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: submitBid, disabled: !isAccountActive, className: "inline-flex items-center justify-center gap-2 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay disabled:opacity-50 disabled:pointer-events-none", children: [
                /* @__PURE__ */ jsx(Gavel, { className: "size-3.5", strokeWidth: 1.5 }),
                "Place bid"
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleFavorite(lot.slug), "aria-label": fav ? "Remove from favourites" : "Add to favourites", className: cn("inline-flex size-12 items-center justify-center border transition-colors", fav ? "border-clay bg-clay/10 text-clay" : "border-ink/20 text-ink hover:border-ink"), children: /* @__PURE__ */ jsx(Heart, { className: "size-4", strokeWidth: 1.5, fill: fav ? "currentColor" : "none" }) })
            ] })
          ] }) }) : /* @__PURE__ */ jsx("div", { className: "mt-6", children: !isAccountActive && user ? /* @__PURE__ */ jsx(AccountStatusBlocker, { action: "bid" }) : isLotClosedForBidding ? /* @__PURE__ */ jsx("div", { className: "rounded border border-ink/15 bg-surface/60 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex items-center rounded bg-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-detail", children: lot.status === "closed" ? "Closed" : "Unavailable" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-ink/80", children: lot.status === "closed" ? "This auction has closed. Bidding is no longer available." : "Bidding is currently unavailable for this lot." })
          ] }) }) : isSeller ? /* @__PURE__ */ jsx("div", { className: "rounded border border-ink/15 bg-surface/60 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex items-center rounded bg-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-detail", children: "Seller" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-ink/80", children: "You cannot bid on your own auction lot." })
          ] }) }) : isCurrentLeader ? /* @__PURE__ */ jsx("div", { className: "rounded border border-ink/15 bg-surface/60 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex items-center rounded bg-clay/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-clay", children: "Leading" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-ink/80", children: "You are currently the highest bidder. You cannot place another bid until you are outbid." })
          ] }) }) : /* @__PURE__ */ jsx("div", { className: "rounded border border-ink/15 bg-surface/60 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-ink/80", children: "Bidding is currently unavailable for this lot." }) }) })
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
            /* @__PURE__ */ jsxs("a", { href: "mailto:support@sharjahbiennial.online", className: "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: [
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
