import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Download, Search, CheckCircle2, XCircle, Flag, ArrowUpRight, RotateCcw, ShieldCheck, Ban, Wallet, KeyRound, Mail } from "lucide-react";
import { aa as adminTxs, ab as adminUsers, H as SectionHeader, J as BentoCard, N as fmtMoney, ac as TabBar, ad as DataTable, ae as StatusChip, h as fmtDateTime, af as RecordSheet } from "./router-07wj3SDc.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
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
function WalletOps() {
  const [tab, setTab] = useState("transactions");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [txs, setTxs] = useState(adminTxs);
  const [accounts, setAccounts] = useState(adminUsers);
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const totals = useMemo(() => {
    const dep = txs.filter((t) => t.type === "deposit").reduce((s, t) => s + t.amount, 0);
    const wd = txs.filter((t) => t.type === "withdraw").reduce((s, t) => s + t.amount, 0);
    const vol = txs.reduce((s, t) => s + t.amount, 0);
    const pending = txs.filter((t) => t.status === "pending").length;
    return {
      dep,
      wd,
      vol,
      pending
    };
  }, [txs]);
  const txRows = useMemo(() => {
    const ql = q.toLowerCase();
    return txs.filter((t) => tab === "deposits" ? t.type === "deposit" : tab === "withdrawals" ? t.type === "withdraw" : true).filter((t) => status === "all" ? true : t.status === status).filter((t) => !q || t.user.toLowerCase().includes(ql) || t.id.includes(ql) || t.email.includes(ql));
  }, [tab, q, status, txs]);
  const accRows = useMemo(() => accounts.filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase())), [accounts, q]);
  function patchTx(id, p) {
    setTxs((prev) => prev.map((t) => t.id === id ? {
      ...t,
      ...p
    } : t));
    setSelectedTx((cur) => cur && cur.id === id ? {
      ...cur,
      ...p
    } : cur);
  }
  function patchAcc(id, p) {
    setAccounts((prev) => prev.map((u) => u.id === id ? {
      ...u,
      ...p
    } : u));
    setSelectedAcc((cur) => cur && cur.id === id ? {
      ...cur,
      ...p
    } : cur);
  }
  const txFields = [{
    key: "id",
    label: "Transaction ID",
    editable: false
  }, {
    key: "user",
    label: "User",
    editable: false
  }, {
    key: "email",
    label: "Email",
    editable: false
  }, {
    key: "type",
    label: "Type",
    kind: "select",
    options: ["deposit", "withdraw", "transfer", "purchase", "sale"].map((v) => ({
      value: v,
      label: v
    }))
  }, {
    key: "amount",
    label: "Amount",
    kind: "money"
  }, {
    key: "method",
    label: "Method"
  }, {
    key: "status",
    label: "Status",
    kind: "select",
    options: ["completed", "pending", "failed", "review"].map((v) => ({
      value: v,
      label: v
    }))
  }, {
    key: "createdAt",
    label: "Created",
    editable: false,
    render: (v) => fmtDateTime(v)
  }];
  const accFields = [{
    key: "name",
    label: "Name",
    span: 2
  }, {
    key: "email",
    label: "Email"
  }, {
    key: "role",
    label: "Role",
    kind: "select",
    options: ["user", "moderator", "admin"].map((v) => ({
      value: v,
      label: v
    }))
  }, {
    key: "status",
    label: "Status",
    kind: "select",
    options: ["active", "pending", "suspended"].map((v) => ({
      value: v,
      label: v
    }))
  }, {
    key: "balance",
    label: "Wallet balance",
    kind: "money"
  }, {
    key: "id",
    label: "Account ID",
    editable: false
  }, {
    key: "joined",
    label: "Joined",
    editable: false,
    render: (v) => fmtDateTime(v)
  }, {
    key: "lastSeen",
    label: "Last seen",
    editable: false,
    render: (v) => fmtDateTime(v)
  }];
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "Wallet ops", description: "Inspect transactions, manage accounts, approve pending payouts. Click any row to view, edit and run operations.", action: /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: [
      /* @__PURE__ */ jsx(Download, { className: "size-3.5" }),
      " Export CSV"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Inflow · 30d", title: fmtMoney(totals.dep), delay: 0, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "Total deposits." }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Outflow · 30d", title: fmtMoney(totals.wd), delay: 0.05, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "Withdrawals processed." }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Volume · 30d", title: fmtMoney(totals.vol), delay: 0.1, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "All transactions combined." }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Queue", title: `${totals.pending}`, delay: 0.15, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "Pending review." }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx(TabBar, { tabs: [{
        id: "transactions",
        label: "Transactions",
        count: txs.length
      }, {
        id: "accounts",
        label: "Accounts",
        count: accounts.length
      }, {
        id: "deposits",
        label: "Deposits"
      }, {
        id: "withdrawals",
        label: "Withdrawals"
      }], active: tab, onChange: (id) => setTab(id) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        tab !== "accounts" && /* @__PURE__ */ jsx("div", { className: "flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5", children: ["all", "completed", "pending", "review", "failed"].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setStatus(s), className: `rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${status === s ? "bg-[var(--a-accent-2)] text-[var(--a-fg)]" : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"}`, children: s }, s)) }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)]" }),
          /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search…", className: "h-9 md:w-56 my-1 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]" })
        ] })
      ] })
    ] }),
    tab === "accounts" ? /* @__PURE__ */ jsx(DataTable, { rows: accRows, onRowClick: (r) => setSelectedAcc(r), columns: [{
      key: "name",
      header: "Account",
      render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-8 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)]", style: {
          background: r.avatar
        }, children: r.name.split(" ").map((p) => p[0]).join("").slice(0, 2) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.name }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--a-muted)]", children: r.email })
        ] })
      ] })
    }, {
      key: "balance",
      header: "Balance",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.balance) })
    }, {
      key: "role",
      header: "Role",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-fg-2)] capitalize", children: r.role })
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status })
    }, {
      key: "joined",
      header: "Joined",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.joined) })
    }] }) : /* @__PURE__ */ jsx(DataTable, { rows: txRows, onRowClick: (r) => setSelectedTx(r), columns: [{
      key: "id",
      header: "Tx ID",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-muted)]", children: r.id })
    }, {
      key: "user",
      header: "User",
      render: (r) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.user }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--a-muted)]", children: r.email })
      ] })
    }, {
      key: "type",
      header: "Type",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]", children: r.type })
    }, {
      key: "method",
      header: "Method",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-fg-2)]", children: r.method })
    }, {
      key: "amount",
      header: "Amount",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.amount) })
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status })
    }, {
      key: "date",
      header: "When",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.createdAt) })
    }] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selectedTx, onOpenChange: (o) => !o && setSelectedTx(null), eyebrow: selectedTx?.type.toUpperCase(), title: selectedTx ? `${fmtMoney(selectedTx.amount)} · ${selectedTx.user}` : "", subtitle: selectedTx?.id, record: selectedTx, fields: txFields, onSave: (p) => selectedTx && patchTx(selectedTx.id, p), extra: selectedTx && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-2", children: "Ledger entry" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-[var(--a-fg-2)]", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Channel" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono", children: selectedTx.method })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Fee est." }),
          /* @__PURE__ */ jsx("span", { className: "a-mono", children: fmtMoney(Math.round(selectedTx.amount * 0.012)) })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Net" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono", children: fmtMoney(Math.round(selectedTx.amount * 0.988)) })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Date" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono", children: fmtDateTime(selectedTx.createdAt) })
        ] })
      ] })
    ] }), operations: selectedTx ? [{
      id: "approve",
      label: "Approve",
      icon: CheckCircle2,
      tone: "success",
      onRun: () => patchTx(selectedTx.id, {
        status: "completed"
      })
    }, {
      id: "reject",
      label: "Reject",
      icon: XCircle,
      tone: "danger",
      confirm: "Reject this transaction?",
      onRun: () => patchTx(selectedTx.id, {
        status: "failed"
      })
    }, {
      id: "hold",
      label: "Send to review",
      icon: Flag,
      onRun: () => patchTx(selectedTx.id, {
        status: "review"
      })
    }, ...selectedTx.type === "withdraw" ? [{
      id: "release",
      label: "Release payout",
      icon: ArrowUpRight,
      tone: "primary",
      onRun: () => patchTx(selectedTx.id, {
        status: "completed"
      })
    }] : [], ...selectedTx.status === "completed" ? [{
      id: "refund",
      label: "Issue refund",
      icon: RotateCcw,
      tone: "danger",
      confirm: "Refund this transaction?",
      onRun: () => alert(`Refunded ${fmtMoney(selectedTx.amount)} (mock).`)
    }] : []] : void 0 }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selectedAcc, onOpenChange: (o) => !o && setSelectedAcc(null), eyebrow: "Wallet account", title: selectedAcc?.name ?? "", subtitle: selectedAcc?.email, record: selectedAcc, fields: accFields, onSave: (p) => selectedAcc && patchAcc(selectedAcc.id, p), extra: selectedAcc && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-2", children: "Balance" }),
      /* @__PURE__ */ jsx("p", { className: "font-display text-3xl font-extrabold text-[var(--a-accent)]", children: fmtMoney(selectedAcc.balance) }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-[var(--a-muted)]", children: "Spendable" }),
      /* @__PURE__ */ jsxs("ul", { className: "mt-4 space-y-2 text-xs", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Tx count" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono text-[var(--a-fg-2)]", children: txs.filter((t) => t.email === selectedAcc.email).length })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Last seen" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono text-[var(--a-fg-2)]", children: fmtDateTime(selectedAcc.lastSeen) })
        ] })
      ] })
    ] }), operations: selectedAcc ? [{
      id: "verify",
      label: "Mark verified",
      icon: ShieldCheck,
      tone: "success",
      onRun: () => patchAcc(selectedAcc.id, {
        status: "active"
      })
    }, {
      id: "suspend",
      label: "Suspend account",
      icon: Ban,
      tone: "danger",
      confirm: `Suspend ${selectedAcc.name}?`,
      onRun: () => patchAcc(selectedAcc.id, {
        status: "suspended"
      })
    }, {
      id: "credit",
      label: "Credit $100",
      icon: Wallet,
      onRun: () => patchAcc(selectedAcc.id, {
        balance: selectedAcc.balance + 100
      })
    }, {
      id: "debit",
      label: "Debit $100",
      icon: Wallet,
      tone: "danger",
      onRun: () => patchAcc(selectedAcc.id, {
        balance: Math.max(0, selectedAcc.balance - 100)
      })
    }, {
      id: "reset",
      label: "Force password reset",
      icon: KeyRound,
      onRun: () => alert(`Reset email sent to ${selectedAcc.email} (mock).`)
    }, {
      id: "message",
      label: "Message user",
      icon: Mail,
      onRun: () => alert(`Opened message thread with ${selectedAcc.name} (mock).`)
    }] : void 0 })
  ] });
}
export {
  WalletOps as component
};
