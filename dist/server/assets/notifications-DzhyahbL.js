import { jsxs, jsx } from "react/jsx-runtime";
import { m as db, n as cn, k as formatBid, b as useAuthStore, o as useUserNotifications } from "./router-BX1vAgXZ.js";
import { Link } from "@tanstack/react-router";
import { Bell, Eye } from "lucide-react";
import { writeBatch, doc, updateDoc } from "firebase/firestore";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
function NotificationsList({ notifications }) {
  const sorted = [...notifications].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
  const unread = sorted.filter((n) => n.unread);
  const read = sorted.filter((n) => !n.unread);
  const markOneRead = async (n) => {
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
    return /* @__PURE__ */ jsxs("div", { className: "rounded border border-ink/10 bg-surface/40 p-10 text-center", children: [
      /* @__PURE__ */ jsx(Bell, { className: "mx-auto mb-4 size-8 text-detail" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-detail", children: "No notifications yet." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    unread.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.22em] text-clay", children: "Unread" }),
        /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-ink/10" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: markAllRead,
            className: "text-[10px] uppercase tracking-[0.18em] text-clay hover:underline",
            children: "Mark all read"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-ink/10 rounded border border-ink/10 bg-canvas", children: unread.map((n) => /* @__PURE__ */ jsx(NotificationItem, { n, onMarkRead: markOneRead }, n.id)) })
    ] }),
    read.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: "Read" }),
        /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-ink/10" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-ink/10 rounded border border-ink/10 bg-canvas", children: read.map((n) => /* @__PURE__ */ jsx(NotificationItem, { n, onMarkRead: markOneRead }, n.id)) })
    ] })
  ] });
}
function NotificationItem({
  n,
  onMarkRead
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex gap-4 px-5 py-5", n.unread && "bg-clay/5"), children: [
    /* @__PURE__ */ jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsx("span", { className: cn("block size-2 rounded-full", n.unread ? "bg-clay" : "bg-ink/20") }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: n.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-snug text-ink/80", children: n.message })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "shrink-0 whitespace-nowrap text-right text-[10px] text-detail", children: new Date(n.createdAt).toLocaleDateString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs", children: [
        n.data?.lotSlug && /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/auctions/$slug",
            params: { slug: n.data.lotSlug },
            className: "text-clay underline decoration-clay/30 underline-offset-2 hover:decoration-clay",
            children: [
              "View lot ",
              n.data.lotTitle ? `· ${n.data.lotTitle}` : ""
            ]
          }
        ),
        n.data?.newBidAmount != null && /* @__PURE__ */ jsxs("span", { className: "text-detail", children: [
          "New bid:",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: formatBid(n.data.newBidAmount) })
        ] }),
        n.data?.newBidderName && /* @__PURE__ */ jsxs("span", { className: "text-detail", children: [
          "by ",
          /* @__PURE__ */ jsx("span", { className: "text-ink", children: n.data.newBidderName })
        ] }),
        n.unread ? /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onMarkRead(n),
            className: "ml-auto inline-flex items-center gap-1 rounded border border-ink/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-detail hover:bg-surface",
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "size-3" }),
              " Mark as read"
            ]
          }
        ) : /* @__PURE__ */ jsx("span", { className: "ml-auto text-[10px] text-detail/60", children: "Seen" })
      ] })
    ] })
  ] });
}
const selectUserID = (s) => s.user?.userID ?? null;
const selectIsAuthHydrated = (s) => s.isAuthHydrated;
function NotificationsPage() {
  const userID = useAuthStore(selectUserID, Object.is);
  const isAuthHydrated = useAuthStore(selectIsAuthHydrated, Object.is);
  const {
    notifications,
    isLoading
  } = useUserNotifications(userID);
  if (!isAuthHydrated) {
    return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-4xl px-6 py-12", children: /* @__PURE__ */ jsx("div", { className: "py-8 text-sm text-detail", children: "Loading…" }) });
  }
  if (!userID) {
    return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl px-6 py-16", children: /* @__PURE__ */ jsx("p", { className: "text-detail", children: "Please log in to view notifications." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.3em] text-clay", children: "Account" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 font-display text-4xl italic", children: "Notifications" })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "py-8 text-sm text-detail", children: "Loading notifications…" }) : /* @__PURE__ */ jsx(NotificationsList, { notifications, userID })
  ] });
}
export {
  NotificationsPage as component
};
