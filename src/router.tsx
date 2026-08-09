import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Good defaults for a museum/gallery app
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        // true: hard refresh must refetch empty queries (landing page)
        refetchOnMount: true,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Crossfade via document.startViewTransition so the previous page
    // is snapshotted (not left mounted) during navigation.
    defaultViewTransition: true,
  });

  return router;
};
