import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Building2, Globe, User, Hash, RadarIcon, DecimalsArrowLeftIcon, Network, CpuIcon, ArrowUpFromLine } from "lucide-react";
import { F as FormPage, W as WAmount, a as WSelect, b as WRow, c as WInput, d as WSubmit } from "./FormPage-BbVeLx84.js";
import { useForm, FormProvider } from "react-hook-form";
import { b as useAuthStore, _ as WalletLoader, e as useDoc, d as toast, s as sendUserNotification, f as sendAdminNotification } from "./router-BX1vAgXZ.js";
import { useShallow } from "zustand/shallow";
import z__default from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverTimestamp } from "firebase/firestore";
import { f as formatMoney } from "./currencies-G6nNjE1o.js";
import "firebase/auth";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "clsx";
import "tailwind-merge";
import "appwrite";
import "firebase/app";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
const CHANNELS = [{
  value: "crypto",
  label: "Crypto"
}, {
  value: "bank",
  label: "Bank"
}];
const COUNTRIES = [{
  value: "Portugal",
  label: "Portugal"
}, {
  value: "United States",
  label: "United States"
}, {
  value: "United Kingdom",
  label: "United Kingdom"
}, {
  value: "Germany",
  label: "Germany"
}, {
  value: "France",
  label: "France"
}];
const forBank = {
  country: z__default.string().min(1, {
    message: "Select A Country"
  }),
  holder: z__default.string().min(1, {
    message: "Account Holder is required"
  }),
  iban: z__default.string().min(1, {
    message: "IBAN is required"
  }),
  swift: z__default.string().min(1, {
    message: "Swift Code is required"
  }),
  reference: z__default.string().min(1, {
    message: "Reference is required"
  })
};
const forCrypto = {
  network: z__default.string().min(1, {
    message: "Wallet Network is required"
  }),
  address: z__default.string().min(40, {
    message: "Wallet Address Should Be At Least 40 Characters"
  })
};
function WithdrawPage() {
  const {
    user,
    isAuthHydrated,
    loading
  } = useAuthStore(useShallow((s) => ({
    user: s.user,
    isAuthHydrated: s.isAuthHydrated,
    loading: s.loading
  })));
  if (!user || loading || !isAuthHydrated) {
    return /* @__PURE__ */ jsx(WalletLoader, { fullscreen: true, showSkeleton: false, message: "Preparing Withdrawals..." });
  }
  const {
    addDocToCollection,
    updateDocument
  } = useDoc();
  const [channel, setChannel] = useState("crypto");
  const [country, setCountry] = useState("");
  const [bank, setBank] = useState("");
  const [done, setDone] = useState(null);
  const [error, setError] = useState(null);
  const withdrawalSchema = z__default.object({
    amount: z__default.number().positive("Enter an amount").max(1e7, {
      message: "Amount Must Be Less Than 10,000,000"
    }),
    name: z__default.string().min(1, {
      message: "Name is required"
    }),
    ...channel == "crypto" ? {
      ...forCrypto
    } : {
      ...forBank
    }
  });
  const formControl = useForm({
    resolver: zodResolver(withdrawalSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      name: "",
      ...channel == "crypto" ? {
        network: "",
        address: ""
      } : {
        country: "",
        iban: "",
        swift: "",
        reference: "",
        holder: ""
      }
    }
  });
  const amount = formControl.watch("amount");
  const submit = formControl.handleSubmit(async (data) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.status !== "active") {
      toast.error({
        title: "Account not active",
        description: "Your account must be approved before you can withdraw funds."
      });
      return;
    }
    if (currentUser.wallet.balance < amount) {
      toast.error({
        title: "Insufficient Balance"
      });
      return;
    }
    const balanceAfter = Math.max(0, currentUser.wallet.balance - amount);
    try {
      const payload = {
        channel,
        amount,
        balanceAfter,
        date: serverTimestamp(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        currency: user?.currency,
        symbol: user?.symbol,
        email: user?.email,
        fullName: user?.fullName,
        status: "Pending",
        title: "Withdrawal",
        type: "withdraw",
        userID: user?.userID,
        counterparty: "counterparty",
        note: "Withdrawal note",
        details: {
          name: formControl.getValues("name"),
          ...channel == "crypto" ? {
            network: formControl.getValues("network") || "",
            address: formControl.getValues("address") || ""
          } : {
            country: formControl.getValues("country") || "",
            iban: formControl.getValues("iban") || "",
            swift: formControl.getValues("swift") || "",
            reference: formControl.getValues("reference") || "",
            holder: formControl.getValues("holder") || ""
          }
        }
      };
      await addDocToCollection({
        collections: "transactions",
        document: payload
      });
      await updateDocument({
        collections: "users",
        document: {
          id: user?.userID,
          wallet: {
            bidBalance: user?.wallet?.bidBalance,
            balance: balanceAfter
          }
        }
      });
      try {
        const fresh = useAuthStore.getState().user || currentUser;
        await sendUserNotification("wallet_withdrawal", {
          to_email: fresh.email,
          to_name: fresh.fullName,
          amount,
          currency: fresh.currency,
          transactionId: `WD-${Date.now()}`,
          balance: balanceAfter
        });
        await sendAdminNotification("wallet_withdrawal", {
          amount,
          currency: fresh.currency,
          fullName: fresh.fullName,
          email: fresh.email,
          transactionId: `WD-${Date.now()}`
        });
      } catch (e) {
        console.warn("[email] withdrawal notification failed", e);
      }
      setDone(formatMoney(amount, user?.currency, {
        withSymbol: true,
        decimals: 2
      }));
      toast.success({
        title: "Success",
        description: "Your Withdrawal is in process",
        position: "bottom-left"
      });
    } catch (error2) {
      toast.error({
        title: "Error Message",
        description: error2?.message,
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
  if (done !== null) {
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
      /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-3xl font-extrabold tracking-tight", children: [
        formatMoney(amount, user?.currency, {
          withSymbol: true,
          decimals: 2
        }),
        " ",
        "withdrawn"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-[var(--w-muted)]", children: [
        "New balance",
        " ",
        formatMoney(user?.wallet?.balance, user?.currency, {
          withSymbol: true,
          decimals: 2
        })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/wallet", className: "mt-6 inline-block w-full rounded-[1.4rem] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg", style: {
        background: "var(--w-brand)",
        color: "var(--w-brand-contrast)"
      }, children: "Back to wallet" })
    ] }) });
  }
  return /* @__PURE__ */ jsx(FormPage, { eyebrow: "Cash out", title: "Withdraw", subtitle: `Available · ${formatMoney(user?.wallet.balance, user?.currency)}`, icon: /* @__PURE__ */ jsx(ArrowUpFromLine, { className: "size-6", strokeWidth: 2.2 }), aside: /* @__PURE__ */ jsxs("div", { className: "sticky top-28 rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "Summary" }),
    /* @__PURE__ */ jsx("h3", { className: "mt-1 text-2xl font-extrabold tracking-tight text-[var(--w-fg)]", children: `${user?.symbol} ${amount.toLocaleString()}` }),
    /* @__PURE__ */ jsxs("dl", { className: "mt-5 flex flex-col gap-3 text-sm", children: [
      channel == "bank" && /* @__PURE__ */ jsx(Row, { label: "Destination", value: `${(formControl.watch("name") || "N/A") + ","} ${country}` }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--w-border)] pt-3" })
    ] })
  ] }), children: /* @__PURE__ */ jsx(FormProvider, { ...formControl, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(WAmount, { schema: "withdraw", name: "amount", currency: user?.currency }),
    /* @__PURE__ */ jsx(WSelect, { name: "channel", label: "Channel", value: channel, onChange: setChannel, options: CHANNELS }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Building2, { className: "size-5 text-[var(--w-brand)]", strokeWidth: 2 }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-extrabold text-[var(--w-fg)] capitalize", children: [
          channel,
          " Method"
        ] })
      ] }),
      channel == "bank" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3", children: [
        /* @__PURE__ */ jsxs(WRow, { children: [
          /* @__PURE__ */ jsx(WSelect, { label: "Country", name: "country", onChange: (v) => {
            setCountry(v);
            console.log(v);
            formControl.setValue("country", v);
          }, value: country, options: COUNTRIES }),
          /* @__PURE__ */ jsx(WInput, { label: "Bank name", name: "name", schema: "withdraw", icon: /* @__PURE__ */ jsx(Globe, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsx(WInput, { label: "Account holder", name: "holder", schema: "withdraw", icon: /* @__PURE__ */ jsx(User, { className: "size-4" }) }),
        /* @__PURE__ */ jsxs(WRow, { children: [
          /* @__PURE__ */ jsx(WInput, { label: "IBAN / Account", name: "iban", schema: "withdraw", icon: /* @__PURE__ */ jsx(Hash, { className: "size-4" }), className: "font-mono" }),
          /* @__PURE__ */ jsx(WInput, { label: "SWIFT / BIC", name: "swift", schema: "withdraw", className: "font-mono", icon: /* @__PURE__ */ jsx(RadarIcon, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsx(WInput, { label: "Reference", name: "reference", schema: "withdraw", hint: "Shown on your bank statement.", icon: /* @__PURE__ */ jsx(DecimalsArrowLeftIcon, { className: "size-4" }) })
      ] }) }),
      channel == "crypto" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-2", children: [
        /* @__PURE__ */ jsxs(WRow, { children: [
          /* @__PURE__ */ jsx(WInput, { label: "Name", name: "name", schema: "withdraw", icon: /* @__PURE__ */ jsx(Hash, { className: "size-4" }), className: "font-mono" }),
          /* @__PURE__ */ jsx(WInput, { label: "Network", name: "network", schema: "withdraw", className: "font-mono", icon: /* @__PURE__ */ jsx(Network, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsx(WInput, { label: "Address", name: "address", schema: "withdraw", hint: "Your Valid Wallet Address", icon: /* @__PURE__ */ jsx(CpuIcon, { className: "size-4" }) })
      ] }) })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake", children: error }),
    /* @__PURE__ */ jsx(WSubmit, { type: "submit", children: "Proceed" })
  ] }) }) });
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
export {
  WithdrawPage as component
};
