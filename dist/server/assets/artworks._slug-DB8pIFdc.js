import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { _ as metApi, q as useArtworkContext, s as getArtworkBySlug, e as useStore, o as changeMetArtWorkProps, k as formatPrice, i as cn } from "./router-07wj3SDc.js";
import { A as ArtworkCard } from "./ArtworkCard-myx8HeRA.js";
import { S as SmartImage } from "./SmartImage-BnUWDzq7.js";
import { infiniteQueryOptions, queryOptions, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { L as Loader } from "./Loader-CCvwETFd.js";
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
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
const BASE = "https://collectionapi.metmuseum.org/public/collection/v1";
async function searchMetArtworks(query, options = {}) {
  const params = new URLSearchParams({ q: query });
  if (options.hasImages) params.set("hasImages", "true");
  if (options.isPublicDomain) params.set("isPublicDomain", "true");
  const res = await fetch(`${BASE}/search?${params}`);
  if (!res.ok) throw new Error(`Met search failed: ${res.status}`);
  return res.json();
}
async function getMetArtwork(id) {
  const res = await fetch(`${BASE}/objects/${id}`);
  if (!res.ok) throw new Error(`Artwork ${id} not found`);
  return res.json();
}
async function getMetArtworksByIds(ids, limit = 20) {
  const sliced = ids.slice(0, limit);
  const results = await Promise.allSettled(sliced.map((id) => getMetArtwork(id)));
  return results.filter(
    (r) => r.status === "fulfilled" && !!r.value.primaryImageSmall && !!r.value.primaryImage && !!r.value.artistDisplayName && !!r.value.title
  ).map((r) => r.value);
}
async function searchMetByArtist(artistName, options = {}) {
  const params = new URLSearchParams({
    q: artistName,
    artistOrCulture: "true"
  });
  if (options.hasImages) params.set("hasImages", "true");
  if (options.isPublicDomain) params.set("isPublicDomain", "true");
  const res = await fetch(`${BASE}/search?${params}`);
  if (!res.ok) throw new Error(`Met artist search failed: ${res.status}`);
  return res.json();
}
const PAGE_SIZE$1 = 12;
const metQueries = {
  // Search artworks (returns IDs + total)
  search: (query, options) => queryOptions({
    queryKey: ["met", "search", query, options],
    queryFn: () => searchMetArtworks(query, options),
    staleTime: 1e3 * 60 * 5
  }),
  // Full artworks by IDs
  artworksByIds: (ids, limit = 20) => queryOptions({
    queryKey: ["met", "artworks", ids.slice(0, limit)],
    queryFn: () => getMetArtworksByIds(ids, limit),
    staleTime: 1e3 * 60 * 10,
    enabled: ids.length > 0
  }),
  // Artist profile + artworks (first page)
  artist: (name) => queryOptions({
    queryKey: ["met", "artist", name],
    queryFn: async () => {
      const { objectIDs, total } = await searchMetByArtist(name, { hasImages: true });
      if (!objectIDs?.length) return { artist: null, artworks: [], total: 0 };
      const artworks = await getMetArtworksByIds(objectIDs, PAGE_SIZE$1);
      return {
        artist: { name, totalWorks: total },
        artworks,
        total,
        allIds: objectIDs
      };
    },
    staleTime: 1e3 * 60 * 15
  }),
  // Infinite query for paginated artist artworks
  artistArtworksInfinite: (artistName) => infiniteQueryOptions({
    queryKey: ["met", "artist", artistName, "infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const { objectIDs } = await searchMetByArtist(artistName, { hasImages: true });
      if (!objectIDs?.length) return [];
      const start = pageParam * PAGE_SIZE$1;
      const pageIds = objectIDs.slice(start, start + PAGE_SIZE$1);
      return getMetArtworksByIds(pageIds, PAGE_SIZE$1);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE$1 ? allPages.length : void 0;
    },
    staleTime: 1e3 * 60 * 10
  })
};
const PAGE_SIZE = 12;
function useMetArtist(artistName = "Vincent van Gogh") {
  const trimmed = artistName.trim();
  const artistQuery = useQuery({
    ...metQueries.artist(trimmed),
    enabled: !!trimmed
  });
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["met", "artist", trimmed, "infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const { objectIDs } = await metApi.searchByArtist(trimmed, { hasImages: true });
      if (!objectIDs?.length) return [];
      const start = pageParam * PAGE_SIZE;
      const pageIds = objectIDs.slice(start, start + PAGE_SIZE);
      return metApi.getArtworks(pageIds, PAGE_SIZE);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.length === PAGE_SIZE ? void 0 : void 0;
    },
    enabled: !!trimmed,
    staleTime: 1e3 * 60 * 10
  });
  const artworks = infiniteQuery.data?.pages.flat() ?? artistQuery.data?.artworks ?? [];
  const isLoading = artistQuery.isLoading || infiniteQuery.isLoading;
  const error = artistQuery.error?.message || infiniteQuery.error?.message || null;
  const total = artistQuery.data?.total ?? 0;
  const hasMore = infiniteQuery.hasNextPage ?? artworks.length < total;
  const fetchMore = () => {
    if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  };
  const fetchForArtist = (name) => {
    console.log("[useMetArtist] fetchForArtist called — query will auto-refetch on param change");
  };
  const artist = artistQuery.data?.artist || (artworks.length > 0 ? metApi.buildArtistProfile(artworks, total) : null);
  return {
    artist,
    artworks,
    isLoading,
    error,
    total,
    fetchMore,
    fetchForArtist,
    hasMore
  };
}
function ArtworkPage() {
  const {
    artworks: contextArtworks,
    loadingAws
  } = useArtworkContext();
  const {
    slug
  } = useParams({
    from: "/artworks/$slug"
  });
  const artwork = useMemo(() => {
    return getArtworkBySlug(slug, contextArtworks);
  }, [slug, contextArtworks]);
  const {
    artist
  } = useMetArtist(artwork?.artistSlug || "");
  const {
    isFavorite,
    toggleFavorite,
    addToCart,
    cart
  } = useStore();
  const [qty, setQty] = useState(1);
  const fav = isFavorite(artwork?.slug || "");
  const related = useMemo(() => contextArtworks.length > 0 ? contextArtworks.filter((a) => a.slug !== artwork?.slug && a.category === artwork?.category && a.artist.toLowerCase() !== artwork.artist.toLowerCase()).concat(contextArtworks.filter((a) => a.category === artwork?.category)).filter((a, i, arr) => arr.findIndex((b) => b.slug === a.slug) === i).filter((a) => a.slug !== artwork?.slug && a.category === artwork?.category && a.artist.toLowerCase() !== artwork.artist.toLowerCase()).slice(0, 3) : [], [artwork?.category, artwork?.slug, contextArtworks, artwork?.artist]);
  changeMetArtWorkProps(artist?.artworks).filter((a) => a.slug.toLowerCase() !== artwork?.slug.toLowerCase() && a.artist == artwork?.artist).slice(0, 4);
  const Nav = () => /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pt-12 ", children: /* @__PURE__ */ jsx(Link, { to: "/gallery", className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink", children: "← Back to gallery" }) });
  if (loadingAws) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Nav, {}),
      /* @__PURE__ */ jsx("div", { className: "mx-auto  grid max-w-7xl gap-16 px-6 py-16 md:py-24 ", children: /* @__PURE__ */ jsx("p", { className: "text-center text-clay font-medium italic tracking-wide", children: /* @__PURE__ */ jsx(Loader, { variant: "soft", size: "xs", className: "py-24 md:py-44", message: "Loading Artwork..." }) }) })
    ] });
  }
  if (!artwork) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Nav, {}),
      /* @__PURE__ */ jsx("div", { className: "mx-auto grid  max-w-7xl gap-16 px-6 py-16 md:py-24 ", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-clay font-medium italic tracking-wide text-[11px]", children: [
        "Oops,",
        /* @__PURE__ */ jsx("br", {}),
        "Seems We Can't Find This Artwork In Our Gallery Anymore..."
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("article", { children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-16 px-6 py-16 md:py-24 lg:grid-cols-[1.4fr_1fr] lg:gap-24", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-surface", children: /* @__PURE__ */ jsx(SmartImage, { src: artwork.image, alt: `${artwork.title} by ${artwork.artist}`, width: artwork.width, height: artwork.height, priority: true, className: "block h-auto w-full" }) }),
      /* @__PURE__ */ jsxs("aside", { className: "flex flex-col gap-8 lg:sticky lg:top-32 lg:self-start", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "mb-4 text-[11px] uppercase tracking-[0.3em] text-detail", children: [
            artwork.categoryLabel,
            " · ",
            artwork.year
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-5xl italic leading-tight md:text-6xl", children: artwork.title }),
          /* @__PURE__ */ jsx(Link, { to: "/artists/$slug", params: {
            slug: artwork.artistSlug
          }, className: "mt-4 inline-block text-base text-detail underline decoration-detail/30 underline-offset-4 hover:text-ink hover:decoration-ink", children: artwork.artist })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed text-ink/80", children: artwork.description }),
        /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Medium" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm line-clamp-5", children: artwork.medium })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Dimensions" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm line-clamp-5", children: artwork.dimensions })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Year" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 text-sm", children: artwork.year })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-canvas p-5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Price" }),
            /* @__PURE__ */ jsx("dd", { className: "mt-2 font-display text-xl italic text-ink", children: formatPrice(artwork.price) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-detail sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink/60", children: "Theme" }),
            " — ",
            artwork.theme
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink/60", children: "Style" }),
            " — ",
            artwork.style
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink/60", children: "Technique" }),
            " — ",
            artwork.technique
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink/60", children: "Orientation" }),
            " — ",
            artwork.orientation
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink/60", children: "Country" }),
            " — ",
            artwork.country
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-ink/60", children: "Palette" }),
            " — ",
            artwork.dominantColor
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center border border-ink/20", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setQty((q) => Math.max(1, q - 1)), className: "px-3 py-3 text-detail hover:text-ink ", "aria-label": "Decrease quantity", children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5", strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsx("span", { className: "min-w-8 text-center text-sm", children: qty }),
            /* @__PURE__ */ jsx("button", { onClick: () => setQty((q) => q + 1), className: "px-3 py-3 text-detail hover:text-ink ", "aria-label": "Increase quantity", children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5", strokeWidth: 1.5 }) })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => addToCart(artwork.slug, qty), className: "inline-flex flex-1 items-center justify-center gap-2 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "size-3.5", strokeWidth: 1.5 }),
            "Add to cart · ",
            formatPrice(artwork.price * qty)
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            toggleFavorite(artwork.slug);
          }, "aria-label": fav ? "Remove from favourites" : "Add to favourites", className: cn("inline-flex size-12 items-center justify-center border transition-colors", fav ? "border-clay bg-clay/10 text-clay" : "border-ink/20 text-ink hover:border-ink"), children: /* @__PURE__ */ jsx(Heart, { className: "size-4", strokeWidth: 1.5, fill: fav ? "currentColor" : "none" }) })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-[11px] uppercase tracking-[0.22em] text-detail underline underline-offset-4 hover:text-ink", children: "Or inquire about this work" }),
        artist && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-4 border-t border-ink/10 pt-8", children: [
            /* @__PURE__ */ jsx(SmartImage, { src: artist?.portrait, alt: artist.name, width: 80, height: 80, className: "size-16 object-cover" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "About the artist" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 font-display text-xl italic", children: artist.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-detail", children: artist.nationality })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-clay mt-3", children: artist.bio })
        ] }) })
      ] })
    ] }),
    related.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 pb-20", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-12 border-b border-ink/10 pb-6 font-display text-3xl italic", children: "Related works" }),
      /* @__PURE__ */ jsx("div", { className: "columns-1 gap-8 md:columns-2 lg:columns-3", children: related.map((a) => /* @__PURE__ */ jsx(ArtworkCard, { artwork: a }, a.slug)) })
    ] })
  ] });
}
export {
  ArtworkPage as component
};
