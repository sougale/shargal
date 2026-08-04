import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Image, ArrowDownToLine, CheckCircle2 } from "lucide-react";
import { F as FormPage, b as WRow, a as WSelect, W as WAmount, f as WCopied, g as WFile, d as WSubmit } from "./FormPage-D3veaB7Y.js";
import { useShallow } from "zustand/shallow";
import { b as useAuthStore, W as WalletLoader, c as useDataStore, d as toast } from "./router-07wj3SDc.js";
import { useForm, FormProvider } from "react-hook-form";
import { serverTimestamp } from "firebase/firestore";
import z__default from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { f as formatMoney } from "./currencies-G6nNjE1o.js";
import { u as useDoc } from "./useDoc-ZchnV3Lq.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "clsx";
import "tailwind-merge";
import "appwrite";
import "firebase/app";
import "firebase/auth";
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
const qrcode = "/assets/swminto-DxZXfwqr.jpg";
const PRESETS = [50, 100, 250, 500, 1e3, 2500];
const METHODS = [
  // { value: "card", label: "Debit / Credit card" },
  {
    value: "bank",
    label: "Bank transfer (ACH / SEPA)"
  },
  {
    value: "crypto",
    label: "Crypto Details"
  }
];
const depositSchema = z__default.object({
  amount: z__default.number().positive("Enter an amount").max(1e7, {
    message: "Amount Must Be Less Than 10,000,000"
  }),
  proof: z__default.instanceof(File, {
    message: "Please select an image file."
  }).refine((file) => file.size <= 5e6, `Max size 5MB.`).refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Supported: .jpg, .png, .webp")
});
function DepositPage() {
  const {
    user,
    isAuthHydrated,
    loading
  } = useAuthStore(useShallow((s) => ({
    user: s.user,
    isAuthHydrated: s.isAuthHydrated,
    loading: s.loading
  })));
  if (loading || !isAuthHydrated || !user) {
    return /* @__PURE__ */ jsx(WalletLoader, { partial: true, message: "Preparing deposit", showSkeleton: false });
  }
  const {
    addDocToCollection,
    updateDocument
  } = useDoc();
  const [wallet, setWallet] = useState(null);
  const {
    adminWallets
  } = useDataStore(useShallow((state) => ({
    adminWallets: state.wallets
  })));
  const modWallets = adminWallets.map((w) => ({
    label: `${w.name} ~ ${w.network}`,
    value: w.id
  }));
  const formControl = useForm({
    resolver: zodResolver(depositSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      proof: void 0
    }
  });
  const [method, setMethod] = useState("crypto");
  const [done, setDone] = useState(null);
  const [save, setSave] = useState(false);
  const amount = formControl.getValues("amount");
  const submit = formControl.handleSubmit(async (data) => {
    try {
      const balanceAfter = amount + user.wallet.balance;
      const payload = {
        channel: method,
        amount,
        balanceAfter,
        date: serverTimestamp(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        currency: user.currency,
        symbol: user.symbol,
        email: user.email,
        fullName: user.fullName,
        status: "Pending",
        title: "Deposit",
        type: "deposit",
        userID: user.userID,
        counterparty: "counterparty",
        details: {
          name: wallet?.name ?? "",
          address: wallet?.address ?? "",
          network: wallet?.network ?? ""
        }
      };
      await addDocToCollection({
        collections: "transactions",
        document: payload
      });
      await updateDocument({
        collections: "users",
        document: {
          wallet: {
            balance: balanceAfter,
            bidBalance: user.wallet.bidBalance
          },
          id: user.id
        }
      });
      toast.added({
        title: "Transaction Successful",
        description: "Transaction Description",
        position: "bottom-left"
      });
      setDone(balanceAfter);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error({
        title: "Error Message",
        description: message,
        position: "top-left"
      });
    }
  }, (invalidate) => {
    toast.error({
      title: "Form Invalid",
      description: invalidate.form?.message,
      position: "top-left"
    });
  });
  if (done !== null) return /* @__PURE__ */ jsx(Success, { amount: done, currency: user.currency, balance: user.wallet.balance });
  return /* @__PURE__ */ jsx(FormPage, { eyebrow: "Add funds", title: "Deposit", subtitle: "Top up your EmberPay balance — settled instantly.", icon: /* @__PURE__ */ jsx(ArrowDownToLine, { className: "size-6", strokeWidth: 2.2 }), aside: /* @__PURE__ */ jsx(Sidebar, { user, symbol: user.symbol, amount: formControl.watch("amount"), method }), children: /* @__PURE__ */ jsx(FormProvider, { ...formControl, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(WRow, { children: /* @__PURE__ */ jsx(WSelect, { placeholder: "Select A Method", name: "method", label: "Method", value: method, onChange: setMethod, options: METHODS }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(WAmount, { schema: "deposit", name: "amount", currency: user.currency }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: PRESETS.map((p) => /* @__PURE__ */ jsxs(motion.button, { whileTap: {
        scale: 0.95
      }, type: "button", onClick: () => formControl.setValue("amount", p), className: `rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${amount === p ? "border-transparent shadow" : "border-[var(--w-border)] bg-[var(--w-input)] text-[var(--w-fg)] hover:border-[var(--w-brand)]/40"}`, style: amount === p ? {
        background: "var(--w-brand)",
        color: "var(--w-brand-contrast)"
      } : void 0, children: [
        user.symbol,
        p
      ] }, p)) })
    ] }),
    /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Building2, { className: "size-5 text-[var(--w-brand)]", strokeWidth: 2 }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-extrabold text-[var(--w-fg)]", children: "Crypto details" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3", children: [
        /* @__PURE__ */ jsx(WSelect, { placeholder: "Select Wallet To Deposit To", label: "Select Wallet To Deposit To", name: "wallet", options: modWallets, value: wallet?.id ?? "", onChange: (v) => {
          const findW = adminWallets.find((w) => w.id == v);
          if (findW) setWallet(findW);
        } }),
        wallet && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
          /* @__PURE__ */ jsx("img", { src: qrcode, alt: "swminto", className: "object-cover aspect-square border border-muted/20 ", style: {
            borderRadius: "10px"
          } }),
          /* @__PURE__ */ jsx(WCopied, { label: wallet.address, value: wallet.address }),
          /* @__PURE__ */ jsx(WFile, { label: "Upload Proof", name: "proof", className: "file:bg-transparent file:w-0 file:px-0 file:mx-0 appearance-none", icon: /* @__PURE__ */ jsx(Image, { size: 14 }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(WSubmit, { children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center gap-2", children: "Proceed" }) })
  ] }) }) });
}
function Sidebar({
  amount,
  method,
  symbol = "$",
  user
}) {
  const fee = method === "card" ? Math.round(amount * 0.015 * 100) / 100 : 0;
  const total = amount - fee;
  return /* @__PURE__ */ jsxs("div", { className: "sticky top-28 rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "Summary" }),
    /* @__PURE__ */ jsx("h3", { className: "mt-1 text-2xl font-extrabold tracking-tight text-[var(--w-fg)] break-all line-clamp-1", children: formatMoney(amount, user.currency, {
      decimals: 2,
      withSymbol: true
    }) }),
    /* @__PURE__ */ jsxs("dl", { className: "mt-5 flex flex-col gap-3 text-sm", children: [
      /* @__PURE__ */ jsx(Row, { label: "Method", value: METHODS.find((m) => m.value === method)?.label ?? method }),
      /* @__PURE__ */ jsx(Row, { label: "Processing fee", value: ` ${symbol} ${fee}` }),
      /* @__PURE__ */ jsx(Row, { label: "Arrival", value: "Instant" }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--w-border)] pt-3", children: /* @__PURE__ */ jsx(Row, { label: "You receive", value: formatMoney(total, user.currency), bold: true }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-[1.2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-3 text-[11px] text-[var(--w-muted)]", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]", children: "Safe by default" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 leading-snug", children: "Deposit Notify" })
    ] })
  ] });
}
function Row({
  label,
  value,
  bold
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-[var(--w-muted)]", children: label }),
    /* @__PURE__ */ jsx("dd", { className: `text-right ${bold ? "text-base font-extrabold text-[var(--w-fg)]" : "font-semibold text-[var(--w-fg)]"}`, children: value })
  ] });
}
function Success({
  amount,
  balance,
  currency
}) {
  return /* @__PURE__ */ jsx(motion.div, { initial: {
    opacity: 0,
    scale: 0.96
  }, animate: {
    opacity: 1,
    scale: 1
  }, className: "mx-auto max-w-md text-center", children: /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl wallet-ring", children: [
    /* @__PURE__ */ jsx(motion.span, { initial: {
      scale: 0
    }, animate: {
      scale: 1
    }, transition: {
      type: "spring",
      stiffness: 250
    }, className: "mx-auto grid size-16 place-items-center rounded-full border border-[var(--w-brand)]/40 text-[var(--w-brand)] shadow-lg", style: {
      background: "var(--w-brand-soft)"
    }, children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-8", strokeWidth: 2 }) }),
    /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-3xl font-extrabold tracking-tight animate__animated animate__fadeInUp", children: [
      formatMoney(amount, currency, {
        withSymbol: true
      }),
      " ",
      "deposited"
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-[var(--w-muted)]", children: [
      "New balance ",
      formatMoney(balance, currency)
    ] }),
    /* @__PURE__ */ jsx(Link, { to: "/wallet", className: "mt-6 inline-block w-full rounded-[1.4rem] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg", style: {
      background: "var(--w-brand)",
      color: "var(--w-brand-contrast)"
    }, children: "Back to wallet" })
  ] }) });
}
function Err({
  msg
}) {
  return /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake", children: msg });
}
export {
  Err,
  DepositPage as component
};
