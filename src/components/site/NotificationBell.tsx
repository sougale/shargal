import { useState, useCallback, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { cn } from "@/utils/gen";
import { db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import type { Notification } from "@/types";

// Module-scoped selector (per project rule). useShallow provides stable shallow equality.
const selectAuthForBell = (s: any) => ({
  userID: s.user?.userID ?? null,
  isAuthHydrated: s.isAuthHydrated,
});

export function NotificationBell() {
  const { userID, isAuthHydrated } = useAuthStore(useShallow(selectAuthForBell));

  const [open, setOpen] = useState(false);

  // Dedicated local onSnapshot hook (correct pattern — never route per-user live data through global Zustand).
  // No second argument = fetch ALL notifications for this userID from Firestore.
  const { notifications: userNotifications, unreadCount } = useUserNotifications(userID);

  // Ref holds latest notifications so stable callbacks never depend on the array (prevents re-render cascades).
  const notificationsRef = useRef<Notification[]>([]);
  useEffect(() => {
    notificationsRef.current = userNotifications;
  }, [userNotifications]);

  // Stable callbacks — identity never changes while the userID is stable.
  const markAsRead = useCallback(async (notif: Notification) => {
    if (!notif.unread) return;
    try {
      await updateDoc(doc(db, "notifications", notif.id), { unread: false });
    } catch (e) {
      console.error("Failed to mark notification read", e);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const unread = notificationsRef.current.filter((n) => n.unread);
    if (unread.length === 0) return;
    await Promise.all(
      unread.map((n) =>
        updateDoc(doc(db, "notifications", n.id), { unread: false }).catch(() => {}),
      ),
    );
  }, []);

  // Stable per-item handler factories (constant identity).
  // Call as onClick={makeHandleView(n)} to avoid new arrow functions on every render.
  const makeHandleView = useCallback(
    (notif: Notification) => () => {
      markAsRead(notif);
      setOpen(false);
    },
    [markAsRead],
  );

  const makeHandleMarkRead = useCallback(
    (notif: Notification) => () => markAsRead(notif),
    [markAsRead],
  );

  // Early returns must come AFTER all hooks.
  if (!isAuthHydrated) return null;
  if (!userID) return null;

  // items only changes when the hook detects actual content change (internal signature guard).
  const items = userNotifications;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex size-10 items-center justify-center text-ink/80 transition-colors hover:text-clay"
        aria-label="Notifications"
      >
        <Bell className="size-4.5" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-medium leading-4.5 text-canvas">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          {/* Dropdown */}
          <div className="absolute -right-36 z-50 mt-2 w-80 overflow-hidden rounded border border-ink/10 bg-canvas shadow-lg">
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-detail">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] uppercase tracking-[0.18em] text-clay hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-detail">
                  No notifications yet.
                </div>
              ) : (
                items.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "group border-b border-ink/5 px-4 py-3 last:border-b-0 hover:bg-surface/60",
                      n.unread && "bg-clay/5",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <span
                          className={cn(
                            "inline-block size-1.5 rounded-full",
                            n.unread ? "bg-clay" : "bg-ink/30",
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        <p className="mt-0.5 text-xs leading-snug text-detail">{n.message}</p>

                        {n.data?.lotSlug && (
                          <Link
                            to="/auctions/$slug"
                            params={{ slug: n.data.lotSlug }}
                            className="mt-1.5 inline-block text-[10px] uppercase tracking-[0.18em] text-clay hover:underline"
                            onClick={() => {
                              markAsRead(n);
                              setOpen(false);
                            }}
                          >
                            View lot →
                          </Link>
                        )}

                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[10px] text-detail/70">
                            {new Date(n.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {n.unread && (
                            <button
                              onClick={() => markAsRead(n)}
                              className="text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-ink"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-ink/10 bg-surface/40 px-4 py-2.5 text-center">
              <Link
                to="/notifications"
                className="text-[11px] uppercase tracking-[0.22em] text-ink hover:text-clay"
                onClick={() => setOpen(false)}
              >
                View all notifications →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
