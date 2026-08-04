import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRouterState, useNavigate, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronsRight, ChevronsLeft, Shield, X, LayoutDashboard, Palette, Wallet, Users, UserCircle, LogOut, Menu } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { u as useAuth, b as useAuthStore } from "./router-BX1vAgXZ.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/exhibition", label: "Exhibition", icon: Palette },
  { to: "/admin/wallet", label: "Wallet ops", icon: Wallet },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/account", label: "Account", icon: UserCircle }
];
function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen w-full text-[var(--a-fg)]", children: [
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: `hidden shrink-0 border-r border-[var(--a-border)] bg-[var(--a-bg-2)] md:block md:sticky md:top-0 md:h-screen md:overflow-y-auto md:overflow-x-hidden ${collapsed ? "md:w-[68px]" : "md:w-[244px]"} transition-[width] duration-200`,
        children: /* @__PURE__ */ jsx(
          SidebarInner,
          {
            collapsed,
            pathname,
            onToggle: () => setCollapsed((v) => !v)
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: mobileOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setMobileOpen(false),
          className: "fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.aside,
        {
          initial: { x: -260 },
          animate: { x: 0 },
          exit: { x: -260 },
          transition: { type: "spring", damping: 24, stiffness: 220 },
          className: "fixed inset-y-0 left-0 z-50 w-[244px] border-r border-[var(--a-border)] bg-[var(--a-bg-2)] md:hidden",
          children: /* @__PURE__ */ jsx(
            SidebarInner,
            {
              collapsed: false,
              pathname,
              onClose: () => setMobileOpen(false)
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsx(Topbar, { onMenu: () => setMobileOpen(true) }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto a-scrollbar bg-[var(--a-bg)] px-4 py-6 md:px-8 md:py-8", children })
    ] })
  ] });
}
function SidebarInner({
  collapsed,
  pathname,
  onToggle,
  onClose
}) {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col relative", children: [
    onToggle && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onToggle,
        className: "hidden absolute top-1/2 -right-1 bg-[var(--a-accent)] z-10 size-7 place-items-center  text-[var(--a-muted)] group text-slate-800 md:grid rounded-full rounded-r-none",
        "aria-label": "Toggle sidebar",
        children: collapsed ? /* @__PURE__ */ jsx(ChevronsRight, { className: "size-4.5 group-hover:size-5 transistion-all duration-300" }) : /* @__PURE__ */ jsx(ChevronsLeft, { className: "size-4.5 group-hover:size-5 transistion-all duration-300" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex h-[60px]  items-center justify-between border-b border-[var(--a-border)] px-4", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-8 shrink-0 place-items-center rounded-md bg-[var(--a-accent)] text-[var(--a-accent-ink)]", children: /* @__PURE__ */ jsx(Shield, { className: "size-4", strokeWidth: 2.4 }) }),
        !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate font-display text-sm font-extrabold tracking-tight", children: "Sharjahbiennial · Console" })
      ] }),
      onClose && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "grid size-7 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)]",
          children: /* @__PURE__ */ jsx(X, { className: "size-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex-1 overflow-y-auto a-scrollbar px-2 py-3", children: [
      !collapsed && /* @__PURE__ */ jsx("p", { className: "a-eyebrow px-3 pb-2 pt-1", children: "Workspace" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children: NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            onClick: onClose,
            className: `group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${active ? "bg-[var(--a-surface)] text-[var(--a-fg)]" : "text-[var(--a-muted)] hover:bg-[var(--a-surface)]/60 hover:text-[var(--a-fg)]"}`,
            children: [
              active && /* @__PURE__ */ jsx("span", { className: "absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r bg-[var(--a-accent)]" }),
              /* @__PURE__ */ jsx(Icon, { className: "size-4 shrink-0", strokeWidth: 2 }),
              !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: item.label })
            ]
          }
        ) }, item.to);
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--a-border)] p-3", children: !collapsed ? /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsxs(
      "button",
      {
        className: "p-1.5 justify-between gap-1.5 flex items-center border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 text-[var(--a-neg)] text-sm hover:bg-[var(--a-neg)]/20 border w-full",
        onClick: () => {
          logOut();
          navigate({ to: "/wallet" });
        },
        children: [
          "Sign Out",
          /* @__PURE__ */ jsx(LogOut, { className: "size-4" })
        ]
      }
    ) }) : /* @__PURE__ */ jsx("span", { className: "mx-auto block size-2 rounded-full bg-[var(--a-neg)] a-live" }) })
  ] });
}
function Topbar({ onMenu }) {
  const { user } = useAuthStore();
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-[var(--a-border)] bg-[var(--a-bg)]/85 px-4 backdrop-blur md:px-8", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onMenu,
        className: "grid size-9 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] md:hidden",
        children: /* @__PURE__ */ jsx(Menu, { className: "size-5" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex-1 " }),
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/admin/account",
        className: "flex items-center gap-2 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] py-1 pl-1 pr-3",
        children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-7 place-items-center rounded bg-[var(--a-accent)] text-[11px] font-bold text-[var(--a-accent-ink)]", children: "SA" }),
          /* @__PURE__ */ jsxs("div", { className: "hidden text-left leading-tight sm:block", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-[var(--a-fg)]", children: user?.fullName }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--a-muted)] capitalize", children: "Administrator" })
          ] })
        ]
      }
    )
  ] });
}
function AdminLayout() {
  return /* @__PURE__ */ jsx(AdminShell, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
export {
  AdminLayout as component
};
