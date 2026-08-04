import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { Pencil, Shield, Mail, Phone, MapPin, Calendar, Wallet, Check, Copy, Trash2, Plus, X } from "lucide-react";
import { J as BentoCard, af as RecordSheet, S as Select, B as SelectTrigger, C as SelectValue, D as SelectContent, E as SelectGroup, F as SelectItem } from "./router-07wj3SDc.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
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
import "recharts";
import "@radix-ui/react-select";
const initialProfile = {
  id: "adm_001",
  name: "Avery Doss",
  email: "avery.doss@aethelred.art",
  phone: "+1 (415) 555-0142",
  role: "Super Administrator",
  location: "San Francisco, CA",
  joined: "2024-03-12",
  bio: "Operations lead. Owns exhibition curation, wallet reconciliation and platform health.",
  timezone: "America/Los_Angeles",
  twoFactor: "Authenticator app"
};
const initialWallets = [{
  id: "wal_btc_01",
  label: "Treasury — BTC cold",
  network: "Bitcoin",
  address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  isDefault: true,
  createdAt: "2025-09-12"
}, {
  id: "wal_eth_01",
  label: "Operations — ETH hot",
  network: "Ethereum",
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  memo: "Gas wallet for payouts",
  isDefault: false,
  createdAt: "2025-11-03"
}];
const NETWORKS = ["Bitcoin", "Ethereum", "Solana", "Tron", "BNB", "Polygon"];
function AdminAccountPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [wallets, setWallets] = useState(initialWallets);
  const [profileOpen, setProfileOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [copied, setCopied] = useState(null);
  const profileFields = [{
    key: "name",
    label: "Full name",
    editable: true
  }, {
    key: "email",
    label: "Email",
    editable: true
  }, {
    key: "phone",
    label: "Phone",
    editable: true
  }, {
    key: "role",
    label: "Role",
    kind: "select",
    options: [{
      value: "Super Administrator",
      label: "Super Administrator"
    }, {
      value: "Administrator",
      label: "Administrator"
    }, {
      value: "Moderator",
      label: "Moderator"
    }]
  }, {
    key: "location",
    label: "Location",
    editable: true
  }, {
    key: "timezone",
    label: "Timezone",
    editable: true
  }, {
    key: "twoFactor",
    label: "Two-factor",
    editable: true
  }, {
    key: "bio",
    label: "Bio",
    kind: "textarea",
    editable: true,
    span: 2
  }, {
    key: "joined",
    label: "Joined",
    kind: "readonly"
  }, {
    key: "id",
    label: "Admin ID",
    kind: "readonly"
  }];
  function copy(addr) {
    navigator.clipboard?.writeText(addr).then(() => {
      setCopied(addr);
      setTimeout(() => setCopied(null), 1400);
    });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl space-y-6", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: "Admin · Account" }),
          /* @__PURE__ */ jsx("h1", { className: "font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--a-fg)] md:text-4xl", children: "Account & crypto wallets" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--a-muted)]", children: "Manage your administrator profile and the treasury wallets used for platform payouts." })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setProfileOpen(true), className: "inline-flex items-center gap-1.5 self-start rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-2 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)] md:self-auto", children: [
          /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }),
          " Edit profile"
        ] })
      ] }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Identity", title: "Administrator profile", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 md:flex-row md:items-start", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-20 shrink-0 place-items-center rounded-xl bg-[var(--a-accent)] text-2xl font-black text-[var(--a-accent-ink)]", children: profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("") }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-extrabold tracking-tight text-[var(--a-fg)]", children: profile.name }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]", children: [
              /* @__PURE__ */ jsx(Shield, { className: "size-3" }),
              " ",
              profile.role
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-prose text-sm text-[var(--a-muted)]", children: profile.bio }),
          /* @__PURE__ */ jsxs("dl", { className: "mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(InfoRow, { icon: Mail, label: "Email", value: profile.email }),
            /* @__PURE__ */ jsx(InfoRow, { icon: Phone, label: "Phone", value: profile.phone }),
            /* @__PURE__ */ jsx(InfoRow, { icon: MapPin, label: "Location", value: profile.location }),
            /* @__PURE__ */ jsx(InfoRow, { icon: Calendar, label: "Joined", value: profile.joined })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Treasury", title: "Crypto wallets", action: /* @__PURE__ */ jsxs("button", { onClick: () => {
        setActiveWallet(null);
        setWalletModalOpen(true);
      }, className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: [
        /* @__PURE__ */ jsx(Plus, { className: "size-3.5" }),
        " Upload wallet"
      ] }), children: wallets.length === 0 ? /* @__PURE__ */ jsx(EmptyWallets, { onAdd: () => setWalletModalOpen(true) }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: wallets.map((w) => /* @__PURE__ */ jsx("li", { className: "group rounded-lg border border-[var(--a-border)] bg-[var(--a-bg-2)] p-4 transition hover:border-[var(--a-border-hi)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "grid size-7 shrink-0 place-items-center rounded-md bg-[var(--a-surface)] text-[var(--a-fg-2)]", children: /* @__PURE__ */ jsx(Wallet, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsx("h4", { className: "truncate text-sm font-bold text-[var(--a-fg)]", children: w.label }),
            w.isDefault && /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--a-pos)]/30 bg-[var(--a-pos)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-pos)]", children: "Default" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--a-muted)]", children: [
            w.network,
            " · added ",
            w.createdAt
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 break-all rounded-md border border-[var(--a-border)] bg-[var(--a-bg)] px-3 py-1.5 font-mono text-xs text-[var(--a-fg-2)]", children: w.address }),
          w.memo && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 text-[11px] text-[var(--a-muted)]", children: [
            "Memo: ",
            w.memo
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => copy(w.address), className: "inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: copied === w.address ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Check, { className: "size-3" }),
            " Copied"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Copy, { className: "size-3" }),
            " Copy"
          ] }) }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            setActiveWallet(w);
            setWalletModalOpen(true);
          }, className: "inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: [
            /* @__PURE__ */ jsx(Pencil, { className: "size-3" }),
            " Edit"
          ] }),
          !w.isDefault && /* @__PURE__ */ jsx("button", { onClick: () => setWallets((prev) => prev.map((x) => ({
            ...x,
            isDefault: x.id === w.id
          }))), className: "rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: "Set default" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            if (!confirm(`Remove wallet ${w.label}?`)) return;
            setWallets((prev) => prev.filter((x) => x.id !== w.id));
          }, className: "grid size-7 place-items-center rounded-md border border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 text-[var(--a-neg)] hover:bg-[var(--a-neg)]/20", "aria-label": "Delete", children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }) })
        ] })
      ] }) }, w.id)) }) })
    ] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: profileOpen, onOpenChange: setProfileOpen, eyebrow: "Administrator", title: profile.name, subtitle: profile.role, record: profile, fields: profileFields, onSave: (patch) => setProfile((p) => ({
      ...p,
      ...patch
    })) }),
    /* @__PURE__ */ jsx(WalletFormModal, { open: walletModalOpen, onOpenChange: setWalletModalOpen, initial: activeWallet, onSubmit: (data) => {
      if (activeWallet) {
        setWallets((prev) => prev.map((w) => w.id === activeWallet.id ? {
          ...w,
          ...data
        } : data.isDefault ? {
          ...w,
          isDefault: false
        } : w));
      } else {
        const id = `wal_${Date.now().toString(36)}`;
        setWallets((prev) => {
          const next = data.isDefault ? prev.map((w) => ({
            ...w,
            isDefault: false
          })) : prev;
          return [...next, {
            ...data,
            id,
            createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
          }];
        });
      }
      setWalletModalOpen(false);
      setActiveWallet(null);
    } })
  ] });
}
function InfoRow({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2", children: [
    /* @__PURE__ */ jsx(Icon, { className: "mt-0.5 size-3.5 shrink-0 text-[var(--a-muted)]" }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("dt", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)]", children: label }),
      /* @__PURE__ */ jsx("dd", { className: "truncate text-xs text-[var(--a-fg)]", children: value })
    ] })
  ] });
}
function EmptyWallets({
  onAdd
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid place-items-center rounded-xl border border-dashed border-[var(--a-border)] px-6 py-12 text-center", children: [
    /* @__PURE__ */ jsx(Wallet, { className: "size-8 text-[var(--a-muted)]" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold text-[var(--a-fg)]", children: "No wallets yet" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-xs text-[var(--a-muted)]", children: "Upload your first crypto wallet" }),
    /* @__PURE__ */ jsxs("button", { onClick: onAdd, className: "mt-4 inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-3.5" }),
      " Upload wallet"
    ] })
  ] });
}
function WalletFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit
}) {
  const [label, setLabel] = useState("");
  const [network, setNetwork] = useState("Bitcoin");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState(null);
  useStateSync(open, () => {
    setLabel(initial?.label ?? "");
    setNetwork(initial?.network ?? "Bitcoin");
    setAddress(initial?.address ?? "");
    setMemo(initial?.memo ?? "");
    setIsDefault(initial?.isDefault ?? false);
    setError(null);
  });
  function submit(e) {
    e.preventDefault();
    const trimmedLabel = label.trim();
    const trimmedAddr = address.trim();
    if (!trimmedLabel) return setError("Label is required.");
    if (trimmedLabel.length > 80) return setError("Label too long (max 80).");
    if (!trimmedAddr) return setError("Wallet address is required.");
    if (trimmedAddr.length < 12 || trimmedAddr.length > 120) return setError("Address looks invalid (12–120 chars).");
    onSubmit({
      label: trimmedLabel,
      network,
      address: trimmedAddr,
      memo: memo.trim() || void 0,
      isDefault
    });
  }
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { open, onOpenChange, children: /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { forceMount: true, children: [
    /* @__PURE__ */ jsx(DialogPrimitive.Overlay, { asChild: true, forceMount: true, children: /* @__PURE__ */ jsx(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" }) }),
    /* @__PURE__ */ jsx(DialogPrimitive.Content, { asChild: true, forceMount: true, children: /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 24
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      y: 24
    }, transition: {
      duration: 0.2,
      ease: "easeOut"
    }, className: "admin-theme fixed inset-0 z-50 flex flex-col bg-[#0f0f10] text-[var(--a-fg)] md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[min(560px,94vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:border-[var(--a-border-hi)] md:shadow-2xl", children: [
      /* @__PURE__ */ jsx(DialogPrimitive.Description, { className: "sr-only", children: "Wallet upload or edit form" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-[var(--a-border)] px-5 py-4 md:px-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: "Treasury" }),
          /* @__PURE__ */ jsx(DialogPrimitive.Title, { className: "font-display mt-0.5 text-xl font-extrabold tracking-tight md:text-2xl", children: initial ? "Edit crypto wallet" : "Upload crypto wallet" })
        ] }),
        /* @__PURE__ */ jsx(DialogPrimitive.Close, { className: "grid size-8 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-fg)]", "aria-label": "Close", children: /* @__PURE__ */ jsx(X, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-1 flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4 overflow-y-auto a-scrollbar px-5 py-5 md:px-6", children: [
          /* @__PURE__ */ jsx(Field, { label: "Label", children: /* @__PURE__ */ jsx("input", { value: label, onChange: (e) => setLabel(e.target.value), placeholder: "e.g. Treasury — BTC cold", maxLength: 80, className: inputCls }) }),
          /* @__PURE__ */ jsx(Field, { label: "Network", children: /* @__PURE__ */ jsxs(Select, { onValueChange: (e) => setNetwork(e), value: network, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: inputCls, children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: NETWORKS.map((n) => /* @__PURE__ */ jsx(SelectItem, { value: n, children: n }, n)) }) })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Wallet address", children: /* @__PURE__ */ jsx("input", { value: address, onChange: (e) => setAddress(e.target.value), placeholder: "Paste full address", maxLength: 120, className: `${inputCls} font-mono text-xs` }) }),
          /* @__PURE__ */ jsx(Field, { label: "Memo / tag (optional)", children: /* @__PURE__ */ jsx("input", { value: memo, onChange: (e) => setMemo(e.target.value), placeholder: "Internal note", maxLength: 120, className: inputCls }) }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm text-[var(--a-fg-2)]", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: isDefault, onChange: (e) => setIsDefault(e.target.checked), className: "size-4 accent-[var(--a-accent)]" }),
            "Set as default payout wallet"
          ] }),
          error && /* @__PURE__ */ jsx("p", { className: "rounded-md border border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 px-3 py-2 text-xs font-semibold text-[var(--a-neg)]", children: error })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 border-t border-[var(--a-border)] bg-[var(--a-bg-2)] px-5 py-3 md:px-6", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onOpenChange(false), className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: initial ? "Save changes" : "Upload wallet" })
        ] })
      ] })
    ] }) })
  ] }) }) });
}
const inputCls = "w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-sm text-[var(--a-fg)] outline-none focus:border-[var(--a-border-hi)]";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "a-eyebrow mb-1.5 block", children: label }),
    children
  ] });
}
function useStateSync(open, fn) {
  const ran = useRef(false);
  useEffect(() => {
    if (open && !ran.current) {
      fn();
      ran.current = true;
    }
    if (!open) ran.current = false;
  }, [open, fn]);
}
export {
  AdminAccountPage as component
};
