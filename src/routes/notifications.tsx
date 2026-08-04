import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/store/zustand";
import { NotificationsList } from "@/components/site/NotificationsList";
import { useUserNotifications } from "@/hooks/useUserNotifications";

// Stable module-scope selectors (Zustand + onSnapshot safety)
const selectUserID = (s: any) => s.user?.userID ?? null;
const selectIsAuthHydrated = (s: any) => s.isAuthHydrated;

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  // Use the exact same stable selector pattern as NotificationBell.
  // This guarantees we get the live userID once auth is fully hydrated.
  const userID = useAuthStore(selectUserID, Object.is);
  const isAuthHydrated = useAuthStore(selectIsAuthHydrated, Object.is);

  // Local onSnapshot hook (correct pattern — never go through global Zustand for this collection).
  // No limit passed → fetch ALL notifications for this userID from Firestore.
  const { notifications, isLoading } = useUserNotifications(userID);

  // Wait for the single source of truth before deciding auth state.
  if (!isAuthHydrated) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="py-8 text-sm text-detail">Loading…</div>
      </div>
    );
  }

  if (!userID) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-detail">Please log in to view notifications.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-clay">Account</p>
        <h1 className="mt-1 font-display text-4xl italic">Notifications</h1>
      </div>

      {isLoading ? (
        <div className="py-8 text-sm text-detail">Loading notifications…</div>
      ) : (
        <NotificationsList notifications={notifications} userID={userID} />
      )}
    </div>
  );
}
