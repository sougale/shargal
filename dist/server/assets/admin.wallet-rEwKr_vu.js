import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle2, XCircle, ShieldCheck, Ban, Wallet } from "lucide-react";
import { c as useDataStore, e as useDoc, ac as AdminLoader, V as SectionHeader, Y as BentoCard, Z as fmtMoney, ad as TabBar, ae as DataTable, af as StatusChip, l as fmtDateTime, ag as RecordSheet, a as useToast } from "./router-BX1vAgXZ.js";
import { useShallow } from "zustand/shallow";
import "@tanstack/react-query";
import "@tanstack/react-router";
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
function WalletOps() {
  const {
    users,
    transactions
  } = useDataStore(useShallow((s) => ({
    users: s.users,
    transactions: s.transactions
  })));
  const [tab, setTab] = useState("transactions");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("Processing...");
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    if (users.length > 0 || transactions.length > 0) {
      setPageLoading(false);
    }
  }, [users.length, transactions.length]);
  const totals = useMemo(() => {
    const dep = transactions.filter((t) => t.type === "deposit" && t.status === "Approved").reduce((s, t) => s + t.amount, 0);
    const wd = transactions.filter((t) => t.type === "withdraw" && t.status == "Approved").reduce((s, t) => s + t.amount, 0);
    const vol = transactions.filter((t) => t.status == "Approved").reduce((s, t) => s + t.amount, 0);
    const pending = transactions.filter((t) => t.status === "Pending").length;
    return {
      dep,
      wd,
      vol,
      pending
    };
  }, [transactions]);
  const txRows = useMemo(() => {
    const ql = q.toLowerCase();
    return transactions.filter((t) => tab === "deposits" ? t.type === "deposit" : tab === "withdrawals" ? t.type === "withdraw" : tab === "transfer_in" ? t.type === "transfer_in" : tab == "transfer_out" ? t.type == "transfer_out" : true).filter((t) => status === "all" ? true : t.status === status).filter((t) => !q || t.fullName.toLowerCase().includes(ql) || t.id.includes(ql) || t.email.includes(ql));
  }, [tab, q, status, transactions]);
  const accRows = useMemo(() => users.filter((u) => !q || u.fullName.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase())), [users, q]);
  const {
    toast
  } = useToast();
  const {
    updateDocument
  } = useDoc();
  const startAction = (msg) => {
    setActionMessage(msg);
    setActionLoading(true);
  };
  const stopAction = () => setActionLoading(false);
  const errorToast = (error, position, description, action) => {
    toast({
      title: "Error",
      description: error.message,
      action: void 0,
      variant: "error",
      position
    });
  };
  const modToast = () => {
    toast({
      title: "Success",
      description: "Changes Made",
      variant: "info",
      duration: 4e4
    });
  };
  const warnToast = () => {
    toast({
      title: "Error",
      description: "Error In Selection",
      variant: "warning",
      duration: 4e4
    });
  };
  const txFields = [
    // { key: "id", label: "Transaction ID", editable: false },
    {
      key: "fullName",
      label: "FullName",
      editable: false
    },
    {
      key: "email",
      label: "Email",
      editable: false
    },
    {
      key: "type",
      label: "Type",
      kind: "select",
      editable: false,
      options: ["deposit", "withdraw", "transfer", "purchase", "sale"].map((v) => ({
        value: v,
        label: v
      }))
    },
    {
      key: "amount",
      label: "Amount",
      kind: "money"
    },
    {
      key: "channel",
      label: "Method",
      editable: false
    },
    // {
    //   key: "status",
    //   label: "Status",
    //   kind: "select",
    //   options: ["completed", "pending", "failed", "review"].map((v) => ({ value: v, label: v })),
    // },
    {
      key: "createdAt",
      label: "Created",
      editable: false,
      render: (v) => fmtDateTime(v)
    }
  ];
  const accFields = [{
    key: "fullName",
    label: "Name",
    span: 2,
    editable: false
  }, {
    key: "email",
    label: "Email",
    editable: false
  }, {
    key: "token",
    label: "Token",
    editable: false
  }, {
    key: "userName",
    label: "User Name/Seller Slug"
  }, {
    key: "status",
    label: "Status",
    kind: "select",
    options: ["active", "pending", "suspended"].map((v) => ({
      value: v,
      label: v
    }))
  }, {
    key: "wallet.balance",
    label: "Wallet balance",
    kind: "money"
  }, {
    key: "wallet.bidBalance",
    label: "Wallet Bid Balance",
    kind: "money"
  }, {
    key: "joinedDate",
    label: "Joined",
    editable: false,
    render: (v) => fmtDateTime(v)
  }];
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(AdminLoader, { fullscreen: true, variant: "page", isLoading: pageLoading, message: "Loading wallet ops", subMessage: "Syncing transactions & accounts" }),
    /* @__PURE__ */ jsx(AdminLoader, { fullscreen: true, variant: "action", isLoading: actionLoading, message: actionMessage }),
    /* @__PURE__ */ jsx(SectionHeader, { title: "Wallet ops", description: "Inspect transactions, manage accounts, approve pending payouts. Click any row to view, edit and run operations.", action: /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Inflow", title: fmtMoney(totals.dep), delay: 0, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "Total Approved deposits." }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Outflow", title: fmtMoney(totals.wd), delay: 0.05, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "All Approved Withdrawals." }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Volume", title: fmtMoney(totals.vol), delay: 0.1, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "All Approved transactions combined." }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Queue", title: `${totals.pending}`, delay: 0.15, children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--a-muted)]", children: "Pending review." }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx(TabBar, { tabs: [
        {
          id: "transactions",
          label: "Transactions",
          count: transactions.length
        },
        // { id: "accounts", label: "Accounts", count: users.length },
        {
          id: "deposits",
          label: "Deposits"
        },
        {
          id: "withdrawals",
          label: "Withdrawals"
        },
        {
          id: "transfer_in",
          label: "Transfers (Received)"
        },
        {
          id: "transfer_out",
          label: "Transfers (Sent)"
        }
      ], active: tab, onChange: (id) => setTab(id) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        tab !== "accounts" && /* @__PURE__ */ jsx("div", { className: "flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5", children: ["all", "Approved", "Pending", "On Hold", "Failed"].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setStatus(s), className: `rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${status === s ? "bg-[var(--a-accent-2)] text-[var(--a-fg)]" : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"}`, children: s }, s)) }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)]" }),
          /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search…", className: "h-9 md:w-56 my-1 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]" })
        ] })
      ] })
    ] }),
    tab === "accounts" ? /* @__PURE__ */ jsx(DataTable, { rows: accRows, onRowClick: (r) => setSelectedAcc(r), columns: [{
      key: "fullName",
      header: "Account",
      render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-8 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)]", style: {
          background: "orange"
        }, children: r.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.fullName }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--a-muted)]", children: r.email })
        ] })
      ] })
    }, {
      key: "wallet.balance",
      header: "Balance",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.wallet.balance) })
    }, {
      key: "role",
      header: "Role",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-fg-2)] capitalize", children: r.role })
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status })
    }, {
      key: "joinedDate",
      header: "Joined",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.joinedDate) })
    }] }) : /* @__PURE__ */ jsx(DataTable, { rows: txRows, onRowClick: (r) => setSelectedTx(r), columns: [{
      key: "fullName",
      header: "fullname",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-muted)]", children: r.fullName })
    }, {
      key: "email",
      header: "email",
      render: (r) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-[12px] text-[var(--a-muted)]", children: r.email }) })
    }, {
      key: "type",
      header: "Type",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]", children: r.type })
    }, {
      key: "method",
      header: "Method",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-fg-2)] capitalize", children: r.channel })
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
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selectedTx, onOpenChange: (o) => !o && setSelectedTx(null), eyebrow: selectedTx?.type.toUpperCase(), title: selectedTx ? `${fmtMoney(selectedTx.amount)} · ${selectedTx.fullName}` : "", subtitle: selectedTx?.id, record: selectedTx, fields: txFields, onSave: async (p) => {
      if (!selectedTx) {
        toast({
          title: "Error",
          description: "Error in Selection",
          variant: "warning"
        });
        return;
      }
      startAction("Updating transaction...");
      try {
        await updateDocument({
          collections: "transactions",
          document: {
            ...selectedTx,
            ...p
          }
        });
        modToast();
      } catch (error) {
        errorToast(error);
      } finally {
        setSelectedTx(null);
        stopAction();
      }
    }, extra: selectedTx && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-2", children: "Transaction Details" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-[var(--a-fg-2)]", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Channel" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono capitalize", children: selectedTx.channel })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Type" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono capitalize", children: selectedTx.type })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Date" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono", children: fmtDateTime(selectedTx.createdAt) })
        ] }),
        selectedTx.type == "deposit" && /* @__PURE__ */ jsx("li", { className: "border-[var(--a-muted)]/20 border p-3 grid place-items-center", children: /* @__PURE__ */ jsx("img", { src: selectedTx.details?.proof ?? "", className: "aspect-auto" }) })
      ] })
    ] }), operations: selectedTx ? [
      {
        id: "approve",
        label: "Approve",
        icon: CheckCircle2,
        tone: "success",
        onRun: async () => {
          if (!selectedTx) {
            warnToast();
            return;
          }
          startAction("Approving transaction...");
          try {
            await updateDocument({
              collections: "transactions",
              document: {
                status: "Approved",
                id: selectedTx.id
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedTx(null);
            stopAction();
          }
        }
      },
      {
        id: "decline",
        label: "Decline",
        icon: XCircle,
        tone: "danger",
        onRun: async () => {
          if (!selectedTx) {
            warnToast();
            return;
          }
          startAction("Declining transaction...");
          try {
            await updateDocument({
              collections: "transactions",
              document: {
                status: "Failed",
                id: selectedTx.id
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedTx(null);
            stopAction();
          }
        }
      }
      // {
      //   id: "hold",
      //   label: "Send to review",
      //   icon: Flag,
      //   onRun: () => patchTx(selectedTx.id, { status: "review" }),
      // },
      // ...(selectedTx.type === "withdraw"
      //   ? [
      //       {
      //         id: "release",
      //         label: "Release payout",
      //         icon: ArrowUpRight,
      //         tone: "primary" as const,
      //         onRun: () => patchTx(selectedTx.id, { status: "completed" }),
      //       },
      //     ]
      //   : []),
      // ...(selectedTx.status === "Approved"
      //   ? [
      //       {
      //         id: "refund",
      //         label: "Issue refund",
      //         icon: RotateCcw,
      //         tone: "danger" as const,
      //         confirm: "Refund this transaction?",
      //         onRun: () => alert(`Refunded ${fmtMoney(selectedTx.amount)} (mock).`),
      //       },
      //     ]
      //   : []),
    ] : void 0 }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selectedAcc, onOpenChange: (o) => !o && setSelectedAcc(null), eyebrow: "Wallet account", title: selectedAcc?.fullName ?? "", subtitle: selectedAcc?.email, record: selectedAcc, fields: accFields, onSave: async (p) => {
      if (!selectedAcc) {
        toast({
          title: "Error",
          description: "Error in Selection",
          variant: "warning"
        });
        return;
      }
      startAction("Saving account...");
      try {
        await updateDocument({
          collections: "users",
          document: {
            ...selectedAcc,
            ...p
          }
        });
        modToast();
      } catch (error) {
        errorToast(error);
      } finally {
        setSelectedAcc(null);
        stopAction();
      }
    }, extra: selectedAcc && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("p", { className: "a-eyebrow ", children: "Balance" }),
        /* @__PURE__ */ jsx("p", { className: "font-display text-3xl font-extrabold text-[var(--a-accent)]", children: fmtMoney(selectedAcc.wallet.balance) }),
        /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-", children: "Bid Balance" }),
        /* @__PURE__ */ jsx("p", { className: "font-display text-3xl font-extrabold text-[var(--a-accent)]", children: fmtMoney(selectedAcc.wallet.bidBalance) })
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "mt-4 space-y-2 text-xs", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Tx count" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono text-[var(--a-fg-2)]", children: transactions.filter((t) => t.userID === selectedAcc.userID).length })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--a-muted)]", children: "Joined Date" }),
          /* @__PURE__ */ jsx("span", { className: "a-mono text-[var(--a-fg-2)]", children: fmtDateTime(selectedAcc.joinedDate) })
        ] })
      ] })
    ] }), operations: selectedAcc ? [
      {
        id: "verify",
        label: "Mark verified",
        icon: ShieldCheck,
        tone: "success",
        onRun: async () => {
          startAction("Marking account verified...");
          try {
            await updateDocument({
              collections: "users",
              document: {
                id: selectedAcc.id,
                status: "active"
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedAcc(null);
            stopAction();
          }
        }
      },
      {
        id: "suspend",
        label: "Suspend account",
        icon: Ban,
        tone: "danger",
        confirm: `Suspend ${selectedAcc.fullName}?`,
        onRun: async () => {
          startAction("Suspending account...");
          try {
            await updateDocument({
              collections: "users",
              document: {
                id: selectedAcc.id,
                status: "suspended"
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedAcc(null);
            stopAction();
          }
        }
      },
      {
        id: "credit",
        label: "Credit $100",
        icon: Wallet,
        onRun: async () => {
          startAction("Crediting wallet...");
          try {
            await updateDocument({
              collections: "users",
              document: {
                id: selectedAcc.id,
                wallet: {
                  balance: selectedAcc.wallet.balance + 100,
                  bidBalance: selectedAcc.wallet.bidBalance
                }
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedAcc(null);
            stopAction();
          }
        }
      },
      {
        id: "debit",
        label: "Debit $100",
        icon: Wallet,
        tone: "danger",
        onRun: async () => {
          startAction("Debiting wallet...");
          try {
            await updateDocument({
              collections: "users",
              document: {
                id: selectedAcc.id,
                wallet: {
                  balance: Math.max(0, selectedAcc.wallet.balance - 100),
                  bidBalance: selectedAcc.wallet.bidBalance
                }
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedAcc(null);
            stopAction();
          }
        }
      }
      // {
      //   id: "reset",
      //   label: "Force password reset",
      //   icon: KeyRound,
      //   onRun: () => alert(`Reset email sent to ${selectedAcc.email} (mock).`),
      // },
      // {
      //   id: "message",
      //   label: "Message user",
      //   icon: Mail,
      //   onRun: () => alert(`Opened message thread with ${selectedAcc.fullName} (mock).`),
      // },
    ] : void 0 })
  ] });
}
export {
  WalletOps as component
};
