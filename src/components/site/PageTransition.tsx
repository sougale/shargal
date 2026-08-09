import type { ReactNode } from "react";

/**
 * Passthrough wrapper for route content.
 *
 * Do not animate opacity on the first paint. A previous version used
 * motion `initial={{ opacity: 0 }}` during SSR while the client skipped
 * that path (View Transitions), leaving the main content stuck at
 * opacity: 0 after a hard refresh — nav/footer stayed visible.
 *
 * Route crossfades are handled by the router's `defaultViewTransition`.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
