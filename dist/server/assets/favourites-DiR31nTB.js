import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Wallet, KeyRound, Heart } from "lucide-react";
import { b as useAuthStore, e as useStore, q as useArtworkContext } from "./router-07wj3SDc.js";
import { A as ArtworkCard } from "./ArtworkCard-myx8HeRA.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
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
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "./SmartImage-BnUWDzq7.js";
function WalletGate({
  children,
  title = "Connect your Aethelred Wallet",
  description = "The exhibition is wallet-gated. Paste your wallet token on the Connect page to unlock bidding, buying, selling, and your profile."
}) {
  const { user } = useAuthStore();
  if (!user) {
    return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl px-6 py-24", children: /* @__PURE__ */ jsxs("div", { className: "border border-ink/10 bg-surface/40 p-10 text-center md:p-14", children: [
      /* @__PURE__ */ jsx("span", { className: "mx-auto grid size-14 place-items-center rounded-full bg-clay/10 text-clay", children: /* @__PURE__ */ jsx(Wallet, { className: "size-6", strokeWidth: 1.3 }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-[10px] uppercase tracking-[0.3em] text-detail", children: "Wallet required" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 font-display text-4xl italic md:text-5xl", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-5 max-w-lg text-sm leading-relaxed text-detail", children: description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/connect",
            className: "inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay",
            children: [
              /* @__PURE__ */ jsx(KeyRound, { className: "size-3.5", strokeWidth: 1.5 }),
              "Connect with token"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/wallet",
            className: "inline-flex items-center gap-2 border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas",
            children: "Open wallet"
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-ink/10 bg-surface/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-detail", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Wallet connected · ",
        user.fullName,
        " · "
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/wallet", className: "text-ink hover:text-clay", children: "Open wallet →" })
    ] }) }),
    children
  ] });
}
function FavouritesPage() {
  const {
    favorites
  } = useStore();
  const {
    artworks
  } = useArtworkContext();
  const items = artworks.filter((a) => favorites.includes(a.slug));
  console.log(favorites);
  return /* @__PURE__ */ jsx(WalletGate, { children: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Your collection", title: "Favourites", description: "Works you've set aside. Add or remove the heart on any artwork." }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32 pt-6", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center", children: [
      /* @__PURE__ */ jsx(Heart, { className: "size-10 text-detail", strokeWidth: 1.2 }),
      /* @__PURE__ */ jsx("p", { className: "text-detail", children: "No favourites yet." }),
      /* @__PURE__ */ jsx(Link, { to: "/gallery", className: "border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Browse the gallery" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "columns-1 gap-8 md:columns-2 lg:columns-3", children: items.map((a) => /* @__PURE__ */ jsx(ArtworkCard, { artwork: a }, a.slug)) }) })
  ] }) });
}
export {
  FavouritesPage as component
};
