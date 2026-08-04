import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Check, Copy, RefreshCw, Bell, AlertTriangle } from "lucide-react";
import { b as useAuthStore, u as useAuth, Q as copyClipboard, R as makeToken, d as toast } from "./router-07wj3SDc.js";
import { u as useDoc } from "./useDoc-ZchnV3Lq.js";
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
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
function SecurityPage() {
  const {
    user
  } = useAuthStore();
  const {
    logOut
  } = useAuth();
  const {
    updateDocument
  } = useDoc();
  const [copied, setCopied] = useState(false);
  const [twofa, setTwofa] = useState(true);
  const [bio, setBio] = useState(false);
  const [alerts, setAlerts] = useState(true);
  if (!user) return null;
  const copy = () => {
    copyClipboard(user?.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const regen = async () => {
    await updateDocument({
      collections: "users",
      document: {
        id: user?.id,
        token: makeToken()
      }
    });
    toast.default({
      title: "Success",
      description: "You Have Successfully Changed The Token Of Your Account, And Will Logout In Five Seconds"
    });
    setTimeout(() => logOut(), 5e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-3xl flex-col gap-5", children: [
    /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 10
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "flex items-start gap-3 rounded-[1.5rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-5 text-sm", children: [
      /* @__PURE__ */ jsx(ShieldCheck, { className: "mt-0.5 size-5 shrink-0 text-[var(--w-brand)]", strokeWidth: 2 }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-extrabold text-[var(--w-fg)]", children: "Wallet Encryp" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-[var(--w-muted)]", children: "This wallet is designed for secure and professional use. All data is encrypted and managed with industry-grade security standards." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl md:p-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-extrabold tracking-tight text-[var(--w-fg)]", children: "Wallet token" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--w-muted)]", children: "Paste this token on the site's Connect page to log in to Aethelred." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5", children: [
        /* @__PURE__ */ jsx("code", { className: "block break-all font-mono text-base font-semibold tracking-widest text-[var(--w-fg)]", children: user.token }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs(motion.button, { whileTap: {
            scale: 0.96
          }, onClick: copy, className: "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider shadow", style: {
            background: "var(--w-brand)",
            color: "var(--w-brand-contrast)"
          }, children: [
            copied ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
            copied ? "Copied" : "Copy token"
          ] }),
          /* @__PURE__ */ jsxs(motion.button, { whileTap: {
            scale: 0.96
          }, onClick: regen, className: "inline-flex items-center gap-2 rounded-full border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/40", children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "size-3.5" }),
            "Regenerate"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: [
        "Connected to site: ",
        /* @__PURE__ */ jsx("span", { className: "text-[var(--w-fg)]", children: "Yes" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Toggle, { icon: Bell, title: "Transaction alerts", desc: "Notify me on every deposit, withdrawal, or transfer.", value: alerts, onChange: setAlerts }),
      /* @__PURE__ */ jsx(Toggle, { icon: ShieldCheck, title: "Auto-lock", desc: "Lock after 5 minutes of inactivity.", value: true, onChange: () => void 0 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] border border-[var(--w-danger)]/30 bg-[var(--w-danger)]/5 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "size-5 text-[var(--w-danger)]", strokeWidth: 2 }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-[var(--w-fg)]", children: "Danger zone" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[var(--w-muted)]", children: "Disconnect this wallet from the exhibition site. Your balance and activity stay intact." }),
      /* @__PURE__ */ jsx("button", { onClick: () => logOut(), className: "mt-5 rounded-full border border-[var(--w-danger)]/60 bg-[var(--w-danger)]/15 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--w-danger)] hover:bg-[var(--w-danger)]/25 disabled:opacity-40", children: "Disconnect from site" })
    ] })
  ] });
}
function Toggle({
  icon: Icon,
  title,
  desc,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs(motion.button, { whileHover: {
    y: -2
  }, type: "button", onClick: () => onChange(!value), className: "flex items-start gap-3 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-4 text-left transition hover:border-[var(--w-brand)]/40", children: [
    /* @__PURE__ */ jsx("span", { className: "grid size-9 shrink-0 place-items-center rounded-[0.9rem]", style: value ? {
      background: "var(--w-brand)",
      color: "var(--w-brand-contrast)"
    } : {
      background: "var(--w-bg-2)",
      color: "var(--w-muted)"
    }, children: /* @__PURE__ */ jsx(Icon, { className: "size-4", strokeWidth: 2.2 }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-extrabold text-[var(--w-fg)]", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--w-muted)]", children: desc })
    ] }),
    /* @__PURE__ */ jsx("span", { className: `relative inline-block h-5 w-9 rounded-full transition ${value ? "" : "bg-[var(--w-bg-2)]"}`, style: value ? {
      background: "var(--w-brand)"
    } : void 0, children: /* @__PURE__ */ jsx("span", { className: "absolute top-0.5 size-4 rounded-full bg-white transition-all", style: {
      left: value ? "calc(100% - 18px)" : "2px"
    } }) })
  ] });
}
export {
  SecurityPage as component
};
