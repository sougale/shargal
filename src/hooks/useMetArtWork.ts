// hooks/useMetArtworks.ts
// Best-practice TanStack Query implementation for Met Museum API
// with localStorage persistence (SSR-safe)

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { metApi } from "../services/metApi";
import type { MetArtwork } from "../types/metTypes";

const LOCAL_STORAGE_KEY = "sharjahbiennial_met_artworks";

/** Stable default so SSR HTML and client hydration share the same query key. */
export const DEFAULT_MET_CATEGORY = "portrait";

interface PersistedMetData {
  artworks: MetArtwork[];
  total: number;
  timestamp?: number;
  category?: string;
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
    // ignore write errors
  }
}

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
  return MET_ARTWORK_SEARCH_TERMS[
    Math.floor(Math.random() * MET_ARTWORK_SEARCH_TERMS.length)
  ];
}

interface UseMetArtworksReturn {
  artworks: MetArtwork[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  total: number;
  search: (query: string) => void;
  fetchRandomCategory: () => void;
  currentCategory: string;
}

/**
 * useMetArtworks — TanStack Query Met Museum search + hydrate.
 *
 * SSR-safe: stable initial category, no localStorage during first paint
 * (avoids server/client HTML mismatch that blanked the landing page on refresh).
 */
export function useMetArtworks(initialQuery?: string): UseMetArtworksReturn {
  const queryClient = useQueryClient();
  const [currentCategory, setCurrentCategory] = React.useState(
    () => initialQuery || DEFAULT_MET_CATEGORY,
  );

  // After mount only: seed the query cache from localStorage.
  // Never do this during render — server has no localStorage and a mismatch
  // blanks the landing page after hard refresh.
  React.useEffect(() => {
    const persisted = loadFromLocalStorage();
    if (!persisted?.artworks?.length) return;

    const keyCategory =
      initialQuery || persisted.category || DEFAULT_MET_CATEGORY;
    queryClient.setQueryData(["met", "full-search", keyCategory], {
      artworks: persisted.artworks,
      total: persisted.total || persisted.artworks.length,
    });
    setCurrentCategory((prev) =>
      prev === keyCategory ? prev : keyCategory,
    );
  }, [initialQuery, queryClient]);

  const artworksQuery = useQuery({
    queryKey: ["met", "full-search", currentCategory],
    queryFn: async () => {
      const searchRes = await metApi.search(currentCategory, {
        hasImages: true,
        isPublicDomain: true,
      });

      if (!searchRes.objectIDs?.length) {
        return { artworks: [] as MetArtwork[], total: 0 };
      }

      const artworks = await metApi.getArtworks(searchRes.objectIDs, 40);

      saveToLocalStorage({
        artworks,
        total: searchRes.total || artworks.length,
        timestamp: Date.now(),
        category: currentCategory,
      });

      return {
        artworks,
        total: searchRes.total || artworks.length,
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    // Ensure a hard refresh actually loads data
    refetchOnMount: true,
  });

  return {
    artworks: artworksQuery.data?.artworks ?? [],
    // Only treat as blocking load when we have nothing to show
    isLoading: artworksQuery.isLoading && !artworksQuery.data?.artworks?.length,
    isFetching: artworksQuery.isFetching,
    error: artworksQuery.error ? (artworksQuery.error as Error).message : null,
    total: artworksQuery.data?.total ?? 0,
    search: (queryStr: string) => setCurrentCategory(queryStr),
    fetchRandomCategory: () => setCurrentCategory(getRandomCategory()),
    currentCategory,
  };
}
