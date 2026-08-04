import { useEffect, useState, useMemo, useRef } from "react";
import { collection, onSnapshot, query, where, limit } from "firebase/firestore";
import { db } from "@/services/firebase";
import type { Notification } from "@/types";

/**
 * Safe, LOCAL Firestore onSnapshot hook for a single user's notifications.
 *
 * This is the recommended way to subscribe to notifications.
 *
 * We deliberately do NOT route this through the global useDataStore + Zustand.
 * Routing live per-user data through a global persisted store + selectors
 * (especially with useShallow) triggers React's useSyncExternalStore rules
 * and produces exactly these errors:
 *   - "The result of getServerSnapshot should be cached to avoid an infinite loop"
 *   - "Maximum update depth exceeded"
 *
 * This hook uses plain React useState + a careful equality check.
 */
export function useUserNotifications(userID: string | null | undefined, maxItems?: number) {
  // If maxItems is omitted, <= 0, or Infinity, we fetch ALL notifications for this userID (no limit applied).
  // This ensures the bell and /notifications page show every document that matches where("userID", "==", userID).
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Used to avoid setting state when data is semantically identical
  const lastSigRef = useRef<string>("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!userID) {
      if (mountedRef.current) {
        setNotifications([]);
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    // Build constraints: always filter by userID.
    // Only apply limit when a positive finite number is explicitly provided.
    // Passing undefined / 0 / Infinity means "fetch all" for this userID.
    const constraints: any[] = [where("userID", "==", userID)];
    if (typeof maxItems === "number" && maxItems > 0 && isFinite(maxItems)) {
      constraints.push(limit(maxItems));
    }

    // Query with only where (no orderBy) to avoid requiring a composite index
    // during early development. We sort client-side instead.
    // Once you have real traffic, create the index for (userID ASC, createdAt DESC).
    const q = query(collection(db, "notifications"), ...constraints);

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!mountedRef.current) return;

        const list: Notification[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            ...data,
            // Normalize createdAt to string for UI
            createdAt: data.createdAt
              ? typeof data.createdAt === "string"
                ? data.createdAt
                : (data.createdAt.toDate?.().toISOString?.() ?? new Date().toISOString())
              : new Date().toISOString(),
          };
        }) as Notification[];

        // Client-side sort by createdAt desc (robust even if some docs miss the field)
        const sorted = [...list].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });

        // Lightweight signature to avoid unnecessary re-renders
        const signature = sorted.map((n) => `${n.id}|${n.unread}|${n.createdAt}`).join(",");

        if (signature !== lastSigRef.current) {
          lastSigRef.current = signature;
          setNotifications(sorted);
        }

        setIsLoading(false);
      },
      (err) => {
        if (!mountedRef.current) return;
        console.error("[useUserNotifications] snapshot error", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      },
    );

    return () => {
      mountedRef.current = false;
      unsub();
    };
  }, [userID, maxItems]);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
  };
}
