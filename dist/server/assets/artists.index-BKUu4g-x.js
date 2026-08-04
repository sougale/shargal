import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { G as artists } from "./router-07wj3SDc.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react";
import "react-dom";
import "lucide-react";
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
function ArtistsIndex() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "In this exhibition", title: "Artists", description: "A small circle of contemporary practitioners, working slowly and at the scale of a season." }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3", children: artists.map((artist) => /* @__PURE__ */ jsxs(Link, { to: "/artists/$slug", params: {
      slug: artist.slug
    }, className: "group block", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-surface", children: /* @__PURE__ */ jsx("img", { src: artist.portrait, alt: `Portrait of ${artist.name}`, width: 800, height: 1e3, loading: "lazy", className: "block aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]" }) }),
      /* @__PURE__ */ jsx("h3", { className: "mt-5 font-display text-3xl italic", children: artist.name }),
      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[11px] uppercase tracking-[0.22em] text-detail", children: [
        artist.discipline,
        " — ",
        artist.location
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-relaxed text-ink/75", children: artist.short })
    ] }, artist.slug)) }) })
  ] });
}
export {
  ArtistsIndex as component
};
