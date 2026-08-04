// hooks/useMetArtworks.ts
// Best-practice TanStack Query implementation for Met Museum API
// with localStorage persistence (restored original implementation)

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { metApi } from "../services/metApi";
import type { MetArtwork } from "../types/metTypes";

// Original localStorage key used by the user
const LOCAL_STORAGE_KEY = "sharjahbiennial_met_artworks";

interface PersistedMetData {
  artworks: MetArtwork[];
  total: number;
  timestamp?: number;
}

function loadFromLocalStorage(): PersistedMetData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.artworks)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveToLocalStorage(data: PersistedMetData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore write errors (quota, private mode, etc.)
  }
}

/**
 * High-quality search terms for the Met API.
 */
export const MET_ARTWORK_SEARCH_TERMS = [
  "portrait",
  "landscape",
  "still life",
  "nude",
  "flowers",
  "mythology",
  "animal",
  "horse",
  "bird",
  "architecture",
  "interior",
  "cityscape",
  "seascape",
  "self portrait",
  "woman",
  "man",
  "child",
  "battle",
  "dance",
  "music",
  "religion",
  "sculpture",
  "photograph",
  "drawing",
  "print",
  "ceramic",
  "furniture",
  "egyptian",
  "greek",
  "roman",
  "chinese",
  "japanese",
  "islamic",
  "african",
  "renaissance",
  "baroque",
  "impressionist",
  "modern",
] as const;

export type MetArtworkSearchTerm = (typeof MET_ARTWORK_SEARCH_TERMS)[number];

function getRandomCategory(): string {
  return MET_ARTWORK_SEARCH_TERMS[Math.floor(Math.random() * MET_ARTWORK_SEARCH_TERMS.length)];
}

interface UseMetArtworksReturn {
  artworks: MetArtwork[];
  isLoading: boolean;
  error: string | null;
  total: number;
  search: (query: string) => void;
  fetchRandomCategory: () => void;
  currentCategory: string;
}

/**
 * useMetArtworks — Recommended pattern using TanStack Query
 *
 * Single useQuery that performs the full two-step process:
 * 1. Search for IDs
 * 2. Hydrate full artwork objects
 *
 * This is the cleanest way to use TanStack Query with this API shape.
 */
export function useMetArtworks(initialQuery?: string): UseMetArtworksReturn {
  // Use a stable default for SSR hydration safety.
  // Randomization happens only on client via fetchRandomCategory or search.
  const [currentCategory, setCurrentCategory] = React.useState(initialQuery || getRandomCategory());

  // Load from localStorage so we can show previously fetched artworks instantly
  // while a fresh request is being sent for the current (or new) category.
  const persisted = React.useMemo(() => loadFromLocalStorage(), []);

  const artworksQuery = useQuery({
    queryKey: ["met", "full-search", currentCategory],
    queryFn: async () => {
      const searchRes = await metApi.search(currentCategory, {
        hasImages: true,
        isPublicDomain: true,
      });

      if (!searchRes.objectIDs?.length) {
        return { artworks: [], total: 0 };
      }

      const artworks = await metApi.getArtworks(searchRes.objectIDs, 40);

      // Persist the freshly fetched data so the next visit (or next category switch)
      // can display the old results immediately while the new request is in flight.
      saveToLocalStorage({
        artworks,
        total: searchRes.total || artworks.length,
        timestamp: Date.now(),
      });

      return {
        artworks,
        total: searchRes.total || artworks.length,
      };
    },
    // Seed with localStorage data so something is visible on first mount
    // even before the network request finishes.
    initialData: persisted ?? undefined,
    // While a new category/search request is in flight, keep showing the previous data
    // (either from cache or from what we just loaded from localStorage).
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const search = (queryStr: string) => {
    setCurrentCategory(queryStr);
  };

  const fetchRandomCategory = () => {
    const next = getRandomCategory();
    setCurrentCategory(next);
  };

  return {
    artworks: artworksQuery.data?.artworks ?? [],
    isLoading: artworksQuery.isLoading,
    error: artworksQuery.error ? (artworksQuery.error as Error).message : null,
    total: artworksQuery.data?.total ?? 0,
    search,
    fetchRandomCategory,
    currentCategory,
  };
}
