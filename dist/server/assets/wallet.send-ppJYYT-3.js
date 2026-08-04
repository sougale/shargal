import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2, KeyRound, Send } from "lucide-react";
import { F as FormPage, c as WInput, W as WAmount, b as WRow, a as WSelect, e as WTextarea, d as WSubmit } from "./FormPage-BbVeLx84.js";
import { useForm, FormProvider } from "react-hook-form";
import { b as useAuthStore, e as useDoc, _ as WalletLoader, z as findObj, d as toast, s as sendUserNotification, f as sendAdminNotification } from "./router-BX1vAgXZ.js";
import { useShallow } from "zustand/shallow";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { f as formatMoney } from "./currencies-G6nNjE1o.js";
import { serverTimestamp } from "firebase/firestore";
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
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
const PURPOSES = [{
  value: "gift",
  label: "Gift"
}, {
  value: "settle",
  label: "Settle a bill"
}, {
  value: "art",
  label: "Artwork payment"
}, {
  value: "commission",
  label: "Commission"
}, {
  value: "other",
  label: "Other"
}];
function SendPage() {
  const {
    user,
    loading,
    isAuthHydrated
  } = useAuthStore(useShallow((s) => ({
    user: s.user,
    loading: s.loading,
    isAuthHydrated: s.isAuthHydrated
  })));
  const {
    addDocToCollection,
    updateDocument
  } = useDoc();
  const [done, setDone] = useState(false);
  const [purpose, setPurpose] = useState("gift");
  if (loading || !isAuthHydrated || !user) {
    return /* @__PURE__ */ jsx(WalletLoader, { partial: true, message: "Preparing send", showSkeleton: false });
  }
  const u = user;
  const sendSchema = z.object({
    token: z.string().min(18, "Token must be at least 17 characters"),
    amount: z.number().positive("Amount must be greater than 0").max(1e7, "Amount must be less than 10,000,000"),
    purpose: z.enum(["gift", "settle", "art", "commission", "other"]),
    note: z.string().optional()
  }).superRefine((data, ctx) => {
    if (!recipient) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Token Not Found",
        path: ["token"]
      });
    }
  });
  const form = useForm({
    resolver: zodResolver(sendSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
      amount: 0,
      purpose: "gift",
      note: ""
    }
  });
  const {
    watch,
    formState
  } = form;
  const token = watch("token");
  const amount = watch("amount") || 0;
  const recipient = useMemo(() => {
    if (!token || token.length < 10) return null;
    return findObj({
      collection: "users",
      id: token,
      prop: "token"
    });
  }, [token]);
  useEffect(() => {
    form.trigger("token");
  }, [recipient, form]);
  const onSubmit = async (data) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.status !== "active") {
      toast.error({
        title: "Account not active",
        description: "Your account must be approved before you can send funds."
      });
      return;
    }
    if (!recipient || !currentUser) return;
    if (recipient?.token == currentUser?.token) {
      toast.info({
        title: "Info",
        description: `Can't Use Your Personal Token`
      });
      return;
    }
    try {
      const newSenderBalance = (currentUser.wallet.balance ?? 0) - data.amount;
      const newReceiverBalance = (recipient.wallet.balance ?? 0) + data.amount;
      if (newSenderBalance < 0) {
        toast.error({
          title: "Insufficient Balance"
        });
        return;
      }
      const payloadSender = {
        channel: "P2P Transfer",
        amount: data.amount,
        balanceAfter: newSenderBalance,
        date: serverTimestamp(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        currency: currentUser.currency,
        symbol: currentUser.symbol,
        email: currentUser.email,
        fullName: currentUser.fullName,
        status: "Approved",
        title: "Transfer Out",
        type: "transfer_out",
        userID: currentUser.userID,
        counterparty: recipient.fullName
      };
      const payloadReceiver = {
        ...payloadSender,
        balanceAfter: newReceiverBalance,
        status: "Approved",
        title: "Transfer In",
        type: "transfer_in",
        userID: recipient.userID,
        email: recipient.email,
        fullName: recipient.fullName,
        currency: recipient.currency,
        symbol: recipient.symbol
      };
      await addDocToCollection({
        collections: "transactions",
        document: payloadSender
      });
      await addDocToCollection({
        collections: "transactions",
        document: payloadReceiver
      });
      await updateDocument({
        collections: "users",
        document: {
          id: currentUser.id,
          wallet: {
            ...currentUser.wallet,
            balance: newSenderBalance
          }
        }
      });
      await updateDocument({
        collections: "users",
        document: {
          id: recipient.id,
          wallet: {
            ...recipient.wallet,
            balance: newReceiverBalance
          }
        }
      });
      try {
        await sendUserNotification("wallet_withdrawal", {
          to_email: currentUser.email,
          to_name: currentUser.fullName,
          amount: data.amount,
          currency: currentUser.currency,
          transactionId: `TRF-${Date.now()}`,
          balance: newSenderBalance,
          fullName: currentUser.fullName
        });
        await sendUserNotification("wallet_deposit", {
          to_email: recipient.email,
          to_name: recipient.fullName,
          amount: data.amount,
          currency: recipient.currency,
          transactionId: `TRF-${Date.now()}`,
          balance: newReceiverBalance,
          fullName: recipient.fullName
        });
        await sendAdminNotification("wallet_withdrawal", {
          amount: data.amount,
          currency: currentUser.currency,
          fullName: currentUser.fullName,
          email: currentUser.email,
          transactionId: `TRF-${Date.now()}`
        });
      } catch (e) {
        console.warn("[email] transfer notification failed", e);
      }
      toast.added({
        title: "Transfer Successful",
        description: `${formatMoney(data.amount, currentUser.currency)} sent to ${recipient.fullName}`
      });
      setDone(true);
    } catch (error) {
      console.error(error);
      toast.error({
        title: "Transfer Failed",
        description: error?.message || "Something went wrong"
      });
    }
  };
  if (done) {
    return /* @__PURE__ */ jsx(motion.div, { initial: {
      opacity: 0,
      scale: 0.96
    }, animate: {
      opacity: 1,
      scale: 1
    }, className: "mx-auto max-w-md text-center", children: /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl wallet-ring", children: [
      /* @__PURE__ */ jsx(motion.span, { initial: {
        y: -10,
        opacity: 0
      }, animate: {
        y: 0,
        opacity: 1
      }, className: "mx-auto grid size-16 place-items-center rounded-full border border-[var(--w-brand)]/40 text-[var(--w-brand)] shadow-lg", style: {
        background: "var(--w-brand-soft)"
      }, children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-8", strokeWidth: 2 }) }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-3xl font-extrabold tracking-tight", children: [
        formatMoney(amount, u.currency),
        " sent"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-[var(--w-muted)]", children: [
        "New balance:",
        " ",
        formatMoney(u.wallet.balance ?? 0 - amount, u.currency)
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/wallet", className: "mt-6 inline-block w-full rounded-[1.4rem] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg", style: {
        background: "var(--w-brand)",
        color: "var(--w-brand-contrast)"
      }, children: "Back to Wallet" })
    ] }) });
  }
  return /* @__PURE__ */ jsx(FormPage, { eyebrow: "Transfer", title: "Send funds", subtitle: "Move money to another EmberPay wallet using its token.", icon: /* @__PURE__ */ jsx(Send, { className: "size-6", strokeWidth: 2.2 }), aside: /* @__PURE__ */ jsxs("div", { className: "sticky top-28 space-y-3", children: [
    recipient && recipient?.token != u?.token && /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      x: 12
    }, animate: {
      opacity: 1,
      x: 0
    }, className: "rounded-[2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]", children: "RECIPIENT FOUND" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-12 place-items-center rounded-full text-base font-extrabold", style: {
          background: "var(--w-brand)",
          color: "var(--w-brand-contrast)"
        }, children: recipient.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate font-extrabold", children: recipient.fullName }),
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-[var(--w-muted)]", children: recipient.email })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "SUMMARY" }),
      /* @__PURE__ */ jsx("h3", { className: "mt-1 text-2xl font-extrabold tracking-tight", children: formatMoney(amount, u.currency, {
        withSymbol: true
      }) })
    ] })
  ] }), children: /* @__PURE__ */ jsx(FormProvider, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(WInput, { label: "Recipient token", placeholder: "AET-XXXX-XXXX-XXXX", name: "token", className: "font-mono tracking-wider", icon: /* @__PURE__ */ jsx(KeyRound, { className: "size-4" }), hint: "Ask the recipient for their wallet token." }),
    /* @__PURE__ */ jsx(WAmount, { name: "amount", schema: "transfer", currency: u.currency }),
    /* @__PURE__ */ jsx(WRow, { children: /* @__PURE__ */ jsx(WSelect, { label: "Purpose", placeholder: "Select a purpose", value: purpose, onChange: (v) => {
      setPurpose(v);
      form.setValue("purpose", v);
    }, options: PURPOSES, name: "purpose" }) }),
    /* @__PURE__ */ jsx(WTextarea, { label: "Note (optional)", name: "note", className: "!text-base", placeholder: "For the framing of the Marchand triptych…" }),
    /* @__PURE__ */ jsx(WSubmit, { type: "submit", disabled: form.formState.isSubmitting || !form.formState.isValid, children: "Proceed" })
  ] }) }) });
}
export {
  SendPage as component
};
