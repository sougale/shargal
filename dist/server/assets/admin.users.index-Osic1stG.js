import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight, Shield } from "lucide-react";
import { c as useDataStore, V as SectionHeader, ae as DataTable, af as StatusChip, Z as fmtMoney, l as fmtDateTime } from "./router-BX1vAgXZ.js";
import { useShallow } from "zustand/shallow";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "motion/react";
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
function UsersAdmin() {
  const {
    users
  } = useDataStore(useShallow((s) => ({
    users: s.users
  })));
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const ql = q.toLowerCase();
  const rows = users.filter((u) => role === "all" || u.role === role).filter((u) => !q || u.fullName.toLowerCase().includes(ql) || u.email.includes(ql));
  const counts = {
    admin: users.filter((u) => u.role === "admin").length,
    user: users.filter((u) => u.role === "user").length
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "Users & roles", description: "Manage platform identities and access. Role changes update mock state in-session.", action: /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(RoleCard, { label: "Admins", count: counts.admin }),
      /* @__PURE__ */ jsx(RoleCard, { label: "Members", count: counts.user })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)]" }),
      /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search users…", className: "h-9 w-64 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]" })
    ] }) }),
    /* @__PURE__ */ jsx(DataTable, { rows, getRowLink: (u) => ({
      to: "/admin/users/$id",
      params: {
        id: u.id
      }
    }), columns: [
      {
        key: "user",
        header: "User",
        render: (u) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)] shadow", style: {
            background: "orange"
          }, children: u.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: u.fullName }),
            /* @__PURE__ */ jsx("p", { className: "a-mono text-[10px] text-[var(--a-muted)]", children: u.email })
          ] })
        ] })
      },
      {
        key: "status",
        header: "Status",
        render: (u) => /* @__PURE__ */ jsx(StatusChip, { value: u.status })
      },
      {
        key: "bal",
        header: "Balance",
        render: (u) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(u.wallet.balance) })
      },
      {
        key: "wallet.bidBalance",
        header: "Bid Balance",
        render: (u) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(u.wallet.bidBalance) })
      },
      {
        key: "joined",
        header: "Joined",
        render: (u) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(u.joinedDate) })
      },
      // {
      //   key: "last",
      //   header: "Last seen",
      //   render: (u) => (
      //     <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(u.lastSeen)}</span>
      //   ),
      // },
      {
        key: "view",
        header: "",
        rowLink: false,
        className: "w-[60px] text-right",
        render: (u) => /* @__PURE__ */ jsxs(Link, { to: "/admin/users/$id", params: {
          id: u.id
        }, onClick: (e) => e.stopPropagation(), className: "inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]", children: [
          "View ",
          /* @__PURE__ */ jsx(ChevronRight, { className: "size-3" })
        ] })
      }
    ] })
  ] });
}
function RoleCard({
  label,
  count
}) {
  return /* @__PURE__ */ jsxs("div", { className: "a-card flex items-center justify-between p-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: label }),
      /* @__PURE__ */ jsx("p", { className: "font-display mt-1 text-2xl font-extrabold text-[var(--a-fg)]", children: count })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-md bg-[var(--a-surface-2)] text-[var(--a-accent)]", children: /* @__PURE__ */ jsx(Shield, { className: "size-4" }) })
  ] });
}
export {
  UsersAdmin as component
};
