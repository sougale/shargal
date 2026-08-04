import { Link } from "@tanstack/react-router";
import { Bell, Check, Eye } from "lucide-react";
import { db } from "@/services/firebase";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { Notification } from "@/types";
import { formatBid } from "@/data/auctions";
import { cn } from "@/utils/gen";

interface NotificationsListProps {
  notifications: Notification[];
  userID?: string; // kept for backward compat; the list is already filtered by the hook
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  // The useUserNotifications hook already scopes results to the current userID via Firestore where().
  // We just sort here (newest first).
  const sorted = [...notifications].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  const unread = sorted.filter((n) => n.unread);
  const read = sorted.filter((n) => !n.unread);

  const markOneRead = async (n: Notification) => {
    if (!n.unread) return;
    try {
      await updateDoc(doc(db, "notifications", n.id), { unread: false });
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  };

  const markAllRead = async () => {
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach((n) => batch.update(doc(db, "notifications", n.id), { unread: false }));
    try {
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  if (sorted.length === 0) {
    return (
      <div className="rounded border border-ink/10 bg-surface/40 p-10 text-center">
        <Bell className="mx-auto mb-4 size-8 text-detail" />
        <p className="text-sm text-detail">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {unread.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-clay">Unread</span>
            <span className="h-px flex-1 bg-ink/10" />
            <button
              onClick={markAllRead}
              className="text-[10px] uppercase tracking-[0.18em] text-clay hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="divide-y divide-ink/10 rounded border border-ink/10 bg-canvas">
            {unread.map((n) => (
              <NotificationItem key={n.id} n={n} onMarkRead={markOneRead} />
            ))}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-detail">Read</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <div className="divide-y divide-ink/10 rounded border border-ink/10 bg-canvas">
            {read.map((n) => (
              <NotificationItem key={n.id} n={n} onMarkRead={markOneRead} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NotificationItem({
  n,
  onMarkRead,
}: {
  n: Notification;
  onMarkRead: (n: Notification) => void;
}) {
  return (
    <div className={cn("flex gap-4 px-5 py-5", n.unread && "bg-clay/5")}>
      <div className="mt-1.5">
        <span className={cn("block size-2 rounded-full", n.unread ? "bg-clay" : "bg-ink/20")} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-ink">{n.title}</p>
            <p className="mt-1 text-sm leading-snug text-ink/80">{n.message}</p>
          </div>
          <span className="shrink-0 whitespace-nowrap text-right text-[10px] text-detail">
            {new Date(n.createdAt).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {n.data?.lotSlug && (
            <Link
              to="/auctions/$slug"
              params={{ slug: n.data.lotSlug }}
              className="text-clay underline decoration-clay/30 underline-offset-2 hover:decoration-clay"
            >
              View lot {n.data.lotTitle ? `· ${n.data.lotTitle}` : ""}
            </Link>
          )}

          {n.data?.newBidAmount != null && (
            <span className="text-detail">
              New bid:{" "}
              <span className="font-medium text-ink">{formatBid(n.data.newBidAmount)}</span>
            </span>
          )}

          {n.data?.newBidderName && (
            <span className="text-detail">
              by <span className="text-ink">{n.data.newBidderName}</span>
            </span>
          )}

          {n.unread ? (
            <button
              onClick={() => onMarkRead(n)}
              className="ml-auto inline-flex items-center gap-1 rounded border border-ink/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-detail hover:bg-surface"
            >
              <Eye className="size-3" /> Mark as read
            </button>
          ) : (
            <span className="ml-auto text-[10px] text-detail/60">Seen</span>
          )}
        </div>
      </div>
    </div>
  );
}
