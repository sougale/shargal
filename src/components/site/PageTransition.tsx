import { useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const supportsViewTransitions =
  typeof document !== "undefined" && "startViewTransition" in document;

/**
 * Route content wrapper.
 *
 * Do NOT wrap <Outlet /> in AnimatePresence + exit animations.
 * TanStack Router updates the match tree immediately, so an exiting
 * motion node still renders the *new* route via <Outlet /> — that is
 * what causes the previous page to flash before the next one settles.
 *
 * Strategy:
 * - Prefer the browser View Transition API (enabled on the router) —
 *   it snapshots the old page so it cannot flash as live content.
 * - Fallback: fade the incoming page in only (old page unmounts instantly).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const routeKey = useRouterState({
    select: (s) => `${s.location.pathname}${s.location.searchStr ?? ""}`,
  });
  const reduceMotion = useReducedMotion();

  // View Transitions already crossfade; avoid a second opacity animation.
  if (reduceMotion || supportsViewTransitions) {
    return <div key={routeKey}>{children}</div>;
  }

  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
