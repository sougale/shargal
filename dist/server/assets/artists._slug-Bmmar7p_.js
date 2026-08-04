import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useParams, Link } from "@tanstack/react-router";
import { a7 as useChicagoArtist, a8 as useChicagoArtworksByArtist, a9 as changeChicagoToMod, G as artists } from "./router-07wj3SDc.js";
import { S as SmartImage } from "./SmartImage-BnUWDzq7.js";
import { L as Loader } from "./Loader-CCvwETFd.js";
import { useState } from "react";
import { convert } from "html-to-text";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
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
function ArtistPage() {
  const {
    slug
  } = useParams({
    from: "/artists/$slug"
  });
  const [showFullText, setShowFullText] = useState(false);
  const artistQuery = useChicagoArtist(slug);
  const artworksQuery = useChicagoArtworksByArtist(slug, 12);
  const artist = artistQuery.data;
  const artworks = artworksQuery.data ?? [];
  const loading = artistQuery.isLoading || artworksQuery.isLoading;
  const works = changeChicagoToMod(artworks);
  const localArtist = artists.find((a) => a.slug == slug);
  console.log(slug);
  const converted = convert(artist?.description, {
    wordwrap: true,
    selectors: [{
      selector: "h1",
      format: "heading"
    }, {
      selector: "strong",
      format: "inline"
    }, {
      selector: "p",
      format: "paragraph"
    }, {
      selector: "a",
      format: "inline"
    }],
    linkHrefBaseUrl: ""
  });
  if (loading) {
    return /* @__PURE__ */ jsx(Loader, { message: "Loading Artist Details...", className: "flex flex-col gap-3 py-24 md:py-44" });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pt-12", children: /* @__PURE__ */ jsx(Link, { to: "/artists", className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: "← All artists" }) }),
    artist && /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-16 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-24", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-surface", children: /* @__PURE__ */ jsx(SmartImage, { src: localArtist?.portrait || "", alt: `Portrait of ${localArtist?.name}`, width: 800, height: 1e3, priority: true, className: "block aspect-[4/5] w-full object-cover" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 lg:pt-8", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] uppercase tracking-[0.3em] text-detail", children: [
          "Birth Date",
          artist?.birth_date,
          " · Death Date ",
          artist?.death_date
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-6xl italic leading-[0.95] md:text-7xl", children: artist?.title }),
        /* @__PURE__ */ jsx("p", { className: `font-display text-2xl italic text-ink/80 ${showFullText ? "line-clamp-none" : "line-clamp-5"}`, onClick: () => setShowFullText(!showFullText), children: converted || "" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "inline-block self-start border-b border-ink pb-1 text-[11px] uppercase tracking-[0.22em] hover:text-clay hover:border-clay", children: "Inquire about this artist" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 pb-32 md:pb-64", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-12 border-b border-ink/10 pb-6 font-display text-3xl italic", children: "Works in the exhibition" }),
      /* @__PURE__ */ jsx("div", { className: "columns-1 gap-8 md:columns-2 lg:columns-3", children: works.slice(0, 5).filter((w) => w.image).map((w) => /* @__PURE__ */ jsxs("section", { className: "group", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-surface outline outline-1 -outline-offset-1 outline-ink/5", children: /* @__PURE__ */ jsx(SmartImage, { src: w.image, alt: w.title, width: w.width, height: w.height, priority: true, className: "w-full", imgClassName: "transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]" }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: w.name || artist?.title || slug }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 font-display text-2xl italic leading-tight text-ink", children: w.title })
        ] })
      ] }, w.id)) })
    ] })
  ] });
}
export {
  ArtistPage as component
};
