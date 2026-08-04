import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Search, ChevronRight, Shield } from "lucide-react";
import { ab as adminUsers, H as SectionHeader, ad as DataTable, S as Select, B as SelectTrigger, C as SelectValue, D as SelectContent, E as SelectGroup, F as SelectItem, ae as StatusChip, N as fmtMoney, h as fmtDateTime } from "./router-07wj3SDc.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
function UsersAdmin() {
  const [users, setUsers] = useState(adminUsers);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const ql = q.toLowerCase();
  const rows = users.filter((u) => role === "all" || u.role === role).filter((u) => !q || u.name.toLowerCase().includes(ql) || u.email.includes(ql));
  const counts = {
    admin: users.filter((u) => u.role === "admin").length,
    moderator: users.filter((u) => u.role === "moderator").length,
    user: users.filter((u) => u.role === "user").length
  };
  function setUserRole(id, next) {
    setUsers((prev) => prev.map((u) => u.id === id ? {
      ...u,
      role: next
    } : u));
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "Users & roles", description: "Manage platform identities and access. Role changes update mock state in-session.", action: /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: [
      /* @__PURE__ */ jsx(UserPlus, { className: "size-3.5" }),
      " Invite user"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(RoleCard, { label: "Admins", count: counts.admin }),
      /* @__PURE__ */ jsx(RoleCard, { label: "Moderators", count: counts.moderator }),
      /* @__PURE__ */ jsx(RoleCard, { label: "Members", count: counts.user })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5", children: ["all", "admin", "moderator", "user"].map((r) => /* @__PURE__ */ jsx("button", { onClick: () => setRole(r), className: `rounded px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${role === r ? "bg-[var(--a-accent-2)] text-[var(--a-fg)]" : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"}`, children: r }, r)) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)]" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search users…", className: "h-9 w-64 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(DataTable, { rows, getRowLink: (u) => ({
      to: "/admin/users/$id",
      params: {
        id: u.id
      }
    }), columns: [{
      key: "user",
      header: "User",
      render: (u) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)] shadow", style: {
          background: u.avatar
        }, children: u.name.split(" ").map((p) => p[0]).join("").slice(0, 2) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: u.name }),
          /* @__PURE__ */ jsx("p", { className: "a-mono text-[10px] text-[var(--a-muted)]", children: u.email })
        ] })
      ] })
    }, {
      key: "role",
      header: "Role",
      rowLink: false,
      render: (u) => /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Select, { onValueChange: (e) => {
        setUserRole(u.id, e);
      }, value: u.role, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-2 py-1 text-xs text-[var(--a-fg)] focus:border-[var(--a-border-hi)] capitalize", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: ["admin", "moderator", "user"].map((r) => /* @__PURE__ */ jsx(SelectItem, { value: r, className: "capitalize", children: r }, r)) }) })
      ] }) })
    }, {
      key: "status",
      header: "Status",
      render: (u) => /* @__PURE__ */ jsx(StatusChip, { value: u.status })
    }, {
      key: "bal",
      header: "Balance",
      render: (u) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(u.balance) })
    }, {
      key: "joined",
      header: "Joined",
      render: (u) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(u.joined) })
    }, {
      key: "last",
      header: "Last seen",
      render: (u) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(u.lastSeen) })
    }, {
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
    }] })
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
