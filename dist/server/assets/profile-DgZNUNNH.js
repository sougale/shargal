import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Gavel, Upload, ImageDown, Mail, MapPin } from "lucide-react";
import { b as useAuthStore, c as useDataStore, e as useStore, h as fmtDateTime } from "./router-07wj3SDc.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { useShallow } from "zustand/shallow";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react";
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
const localUser = {
  name: "Eloise Marchand",
  handle: "@eloise.m",
  location: "Lisbon, Portugal",
  email: "eloise@aethelred.gallery",
  joined: "March 2024",
  bio: "Collector of small works on paper. Patron since the second exhibition. Quietly partial to coastal palettes and considered restraint."
};
function ProfilePage() {
  const {
    user
  } = useAuthStore();
  const {
    auctions,
    bids
  } = useDataStore(useShallow((s) => ({
    auctions: s.auctions,
    bids: s.bids
  })));
  const {
    favorites,
    cart,
    listings
  } = useStore();
  const stats = [{
    label: "Favourites",
    value: favorites.length,
    to: "/favourites",
    icon: Heart
  }, {
    label: "In cart",
    value: cart.reduce((s, c) => s + c.quantity, 0),
    to: "/cart",
    icon: ShoppingBag
  }, {
    label: "Active bids",
    value: bids.length,
    to: "/bids",
    icon: Gavel
  }, {
    label: "Listings",
    value: listings.length,
    to: "/sell",
    icon: Upload
  }, {
    label: "Active Auctions",
    value: auctions.length,
    to: "/auctions/mine",
    icon: ImageDown
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Your account", title: "Profile" }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_1.4fr]", children: [
      /* @__PURE__ */ jsxs("aside", { className: "border border-ink/10 p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-24 items-center justify-center rounded-full bg-clay/15 font-display text-4xl italic text-clay", children: user?.fullName.split(" ").map((f) => f[0]).slice(0, 2) || localUser.name.charAt(0) }),
        /* @__PURE__ */ jsx("h2", { className: "mt-6 font-display text-3xl italic", children: user?.fullName || localUser.name }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: user?.userName || localUser.handle }),
        !user && /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm leading-relaxed text-ink/80", children: localUser.bio }),
        /* @__PURE__ */ jsxs("ul", { className: "mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm text-ink/80", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Mail, { className: "size-4 text-detail", strokeWidth: 1.25 }),
            user?.email || localUser.email
          ] }),
          !user && /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "size-4 text-detail", strokeWidth: 1.25 }),
            localUser.location
          ] })
        ] }),
        user && /* @__PURE__ */ jsxs("p", { className: "mt-8 text-[10px] uppercase tracking-[0.22em] text-detail", children: [
          "Member since ",
          fmtDateTime(user.joinedDate) || localUser.joined
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-10", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-px bg-ink/10", children: stats.map(({
          label,
          value,
          to,
          icon: Icon
        }) => /* @__PURE__ */ jsxs(Link, { to, className: "group bg-canvas p-6 transition-colors hover:bg-surface", children: [
          /* @__PURE__ */ jsx(Icon, { className: "size-5 text-detail group-hover:text-clay", strokeWidth: 1.25 }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 font-display text-4xl italic", children: value }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] uppercase tracking-[0.22em] text-detail", children: label })
        ] }, label)) }),
        /* @__PURE__ */ jsxs("div", { className: "border border-ink/10 p-8", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl italic", children: "Quick actions" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx(Link, { to: "/sell", className: "border border-ink bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Auction an artwork(s)" }),
            /* @__PURE__ */ jsx(Link, { to: "/bids", className: "border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "My bids" }),
            /* @__PURE__ */ jsx(Link, { to: "/auctions/mine", className: "border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "My auctions" }),
            /* @__PURE__ */ jsx(Link, { to: "/favourites", className: "border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Favourites" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProfilePage as component
};
