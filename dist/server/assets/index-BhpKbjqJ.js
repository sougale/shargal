import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { y as useArtworkContext, S as SmartImage, D as art09, E as art10, F as art01, G as art03, q as formatPrice, H as artworks, w as useMetArtworks, x as changeMetArtWorkProps, I as useArtInstitute, J as getChicagoImageUrl, r as categories } from "./router-BX1vAgXZ.js";
import { A as ArtworkCard } from "./ArtworkCard-DFFAVlfH.js";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { L as Loader } from "./Loader-BKqcHLqb.js";
import { P as PartnerReasons, H as HistoryTimeline, F as FaqAccordion } from "./FaqAccordion-DuC-b7jo.js";
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
import "@radix-ui/react-accordion";
const slides = [
  {
    image: art09,
    kicker: "Exhibition No. 12 — Spring 2026",
    title: "The Quiet Edge of Form",
    sub: "A curated dialogue between permanence and the ephemeral — twelve works in clay, linen, light and code."
  },
  {
    image: art10,
    kicker: "Now showing",
    title: "Rooms for Slow Looking",
    sub: "Sachi Tanaka's six-hour exposures and the small architectures of the everyday."
  },
  {
    image: art01,
    kicker: "Permanent rotation",
    title: "Painting Without Hurry",
    sub: "Søren Kjeldsen's linen studies — a single canvas may take half a year to find its surface."
  },
  {
    image: art03,
    kicker: "Photography",
    title: "Architecture of Light",
    sub: "Marcus Thorne's photographs treat afternoon shadow as a kind of language."
  }
];
function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 36 });
  const [index, setIndex] = useState(0);
  const { chicagoArtworks } = useArtworkContext();
  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    const id = setInterval(() => embla.scrollNext(), 6500);
    return () => {
      clearInterval(id);
      embla.off("select", onSelect);
    };
  }, [embla]);
  const current = chicagoArtworks.filter((ca) => ca.image)[index + 6];
  if (chicagoArtworks)
    return /* @__PURE__ */ jsxs("section", { className: "relative h-[88vh] min-h-[640px] w-full overflow-hidden bg-ink", children: [
      /* @__PURE__ */ jsx("div", { ref: emblaRef, className: "absolute inset-0 h-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex h-full ", children: chicagoArtworks.filter((ca) => ca.image).slice(6, 10).map((a, i) => /* @__PURE__ */ jsxs("div", { className: "relative h-full min-w-0 flex-[0_0_100%]", children: [
        /* @__PURE__ */ jsx(
          SmartImage,
          {
            src: a?.image || "",
            alt: a?.name,
            "aria-hidden": true,
            priority: i === 0,
            className: "absolute inset-0 h-full w-full object-cover"
          },
          a?.id
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/30" })
      ] }, i)) }) }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex flex-col justify-end ", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl px-6 pb-20 md:pb-28", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.3em] text-canvas/75 transition-opacity duration-700", children: current.medium }),
        /* @__PURE__ */ jsx("h1", { className: "mt-6 max-w-5xl font-display text-5xl italic leading-[0.95] text-canvas md:text-7xl lg:text-8xl line-clamp-2", children: current.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-xl text-base leading-relaxed text-canvas/85 md:text-lg", children: current.name }),
        /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto mt-10 flex flex-wrap items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/gallery",
              className: "border border-canvas bg-canvas px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-clay hover:border-clay hover:text-canvas",
              children: "Enter the exhibition"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/about",
              className: "border border-canvas/60 px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:border-canvas",
              children: "About the gallery"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2", children: slides.map((_, i) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": `Slide ${i + 1}`,
          onClick: () => embla?.scrollTo(i),
          className: `h-[2px] transition-all ${index === i ? "w-10 bg-canvas" : "w-5 bg-canvas/40"}`
        },
        i
      )) })
    ] });
}
function ImageCarousel({ artworks: artworks2, eyebrow, title, link }) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps"
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const sync = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);
  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync);
    embla.on("reInit", sync);
  }, [embla, sync]);
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10 flex items-end justify-between gap-6 border-b border-ink/10 pb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        eyebrow && /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] uppercase tracking-[0.3em] text-detail", children: eyebrow }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl italic md:text-4xl", children: title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        link && /* @__PURE__ */ jsxs(
          Link,
          {
            to: link.to,
            className: "hidden text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink md:inline-block",
            children: [
              link.label,
              " →"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Previous",
              disabled: !canPrev,
              onClick: () => embla?.scrollPrev(),
              className: "border border-ink/30 p-2 text-ink transition-opacity disabled:pointer-events-none disabled:opacity-30 hover:bg-ink hover:text-canvas",
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Next",
              disabled: !canNext,
              onClick: () => embla?.scrollNext(),
              className: "border border-ink/30 p-2 text-ink transition-opacity disabled:opacity-30 disabled:pointer-events-none hover:bg-ink hover:text-canvas",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
            }
          )
        ] })
      ] })
    ] }),
    artworks2.length == 0 ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Loader, { variant: "soft", message: "Loading Artworks", className: "py-16" }) }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { ref: emblaRef, className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex gap-6", children: artworks2.map((a) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/gallery",
        className: "group block min-w-0 flex-[0_0_75%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/5] overflow-hidden bg-surface", children: /* @__PURE__ */ jsx(
            SmartImage,
            {
              src: a.image,
              alt: `${a.title} by ${a.name}`,
              className: "absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-baseline justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl italic leading-tight", children: a.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] uppercase tracking-[0.22em] text-detail", children: a.name })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 text-sm text-ink/80", children: formatPrice(a.price) })
          ] })
        ]
      },
      a.id
    )) }) }) })
  ] });
}
const sponsors = [
  {
    name: "North & Field",
    tier: "Principal",
    blurb: "Independent paper mill, est. 1894. Supplier of all exhibition print editions."
  },
  {
    name: "Hagen Linen Co.",
    tier: "Principal",
    blurb: "Family-run linen weavers from West Flanders supporting our painting commissions."
  },
  {
    name: "Maison Verre",
    tier: "Supporting",
    blurb: "Hand-blown glass plinths and display vitrines for our sculpture programme."
  },
  {
    name: "Studio Arboreal",
    tier: "Supporting",
    blurb: "Sustainable framing and crating, working exclusively with FSC-certified timber."
  },
  {
    name: "The Slow Press",
    tier: "Programme",
    blurb: "Letterpress catalogues and exhibition broadsheets, printed in editions of 200."
  },
  {
    name: "Caferra Roasters",
    tier: "Programme",
    blurb: "Single-origin coffee served at every opening and private view."
  }
];
function Sponsors() {
  return /* @__PURE__ */ jsx("section", { className: "border-y border-ink/10 bg-surface/60", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 flex flex-col items-baseline justify-between gap-3 md:flex-row md:items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] uppercase tracking-[0.3em] text-detail", children: "In partnership with" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl italic md:text-4xl", children: "Our patrons & sponsors" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm leading-relaxed text-detail", children: "A short list of independent makers and houses whose materials, craft and values support every exhibition we mount." })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3", children: sponsors.map((s) => /* @__PURE__ */ jsxs("li", { className: "flex flex-col gap-3 bg-canvas p-7", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.22em] text-clay", children: s.tier }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl italic", children: s.name }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-detail", children: s.blurb })
    ] }, s.name)) })
  ] }) });
}
function HomePage() {
  artworks.filter((a) => a.highlight).slice(0, 8);
  artworks.filter((a) => a.year >= 2025).slice(0, 8);
  const {
    artworks: metArtworks,
    isLoading
  } = useMetArtworks();
  const modMetArtworks = changeMetArtWorkProps(metArtworks);
  const {
    artworks: data,
    loading: caLoading
  } = useArtInstitute();
  const chicagoArtworks = (data ?? []).filter((a) => typeof a.image_id === "string" && a.image_id.trim() !== "" && !!a.medium_display).map((a) => ({
    id: a.id,
    image: getChicagoImageUrl(a.image_id),
    title: a.title,
    price: 1200 + a.id % 8e3,
    height: a.thumbnail?.height || 600,
    width: a.thumbnail?.width || 800,
    name: a.artist_display || "Unknown",
    medium: a.medium_display || "N/A"
  })).filter((a) => typeof a.image === "string" && a.image.trim() !== "");
  if (isLoading || caLoading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "min-h-screen min-w-screen bg-canvas" }),
      /* @__PURE__ */ jsx(Loader, { variant: "soft", className: "flex flex-col gap-3 overscroll-contain! z-20", fullScreen: true, message: "Loading Gallery.." })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(HeroCarousel, {}),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 py-24 md:py-32", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.3em] text-detail", children: "A short word from the curator" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-xl leading-relaxed text-ink/85 md:text-2xl", children: [
        /* @__PURE__ */ jsx("p", { children: "Sharjahbiennial is a quiet room on the internet — a curated dialogue between permanence and the ephemeral, between clay that takes a week to set and a photograph that takes six hours of held breath." }),
        /* @__PURE__ */ jsx("p", { className: "text-base text-detail md:text-lg", children: "We hang one exhibition at a time, for one season at a time. Twelve artists in permanent rotation, four shows a year, no algorithm, no infinite scroll. Just the work, given room." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(ImageCarousel, { artworks: chicagoArtworks, eyebrow: "The curator has chosen", title: "Highlights of the season", link: {
      to: "/gallery",
      label: "All works"
    } }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-12 flex items-end justify-between border-b border-ink/10 pb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] uppercase tracking-[0.3em] text-detail", children: "The exhibition, in part" }),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl italic md:text-4xl", children: "Selected Works" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/gallery", className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: "View all →" })
      ] }),
      modMetArtworks.length === 0 ? /* @__PURE__ */ jsx(Loader, { message: "Loading Selected Works...", className: "py-16 md:py-24" }) : /* @__PURE__ */ jsx("div", { className: "columns-1 gap-8 md:columns-2 lg:columns-3", children: modMetArtworks.slice(0, 6).map((a, i) => /* @__PURE__ */ jsx(ArtworkCard, { artwork: a, priority: i < 3 }, a.slug)) })
    ] }),
    /* @__PURE__ */ jsx(ImageCarousel, { artworks: chicagoArtworks.slice(8), eyebrow: "Newly arrived", title: "From the studios, this season" }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 py-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-12 flex items-end justify-between border-b border-ink/10 pb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl italic md:text-4xl", children: "By Mode of Design" }),
        /* @__PURE__ */ jsx(Link, { to: "/categories", className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: "All categories →" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-4", children: categories.slice(0, 8).map((c) => /* @__PURE__ */ jsxs(Link, { to: "/categories/$slug", params: {
        slug: c.slug
      }, className: "group flex flex-col gap-3 bg-canvas p-8 transition-colors hover:bg-surface", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Category" }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-3xl italic", children: c.label }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-detail", children: c.description })
      ] }, c.slug)) })
    ] }),
    /* @__PURE__ */ jsx(PartnerReasons, {}),
    /* @__PURE__ */ jsx(Sponsors, {}),
    /* @__PURE__ */ jsx(HistoryTimeline, {}),
    /* @__PURE__ */ jsx(FaqAccordion, {})
  ] });
}
export {
  HomePage as component
};
