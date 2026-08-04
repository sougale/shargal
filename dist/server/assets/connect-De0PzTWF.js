import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, KeyRound, Wallet } from "lucide-react";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { b as useAuthStore, u as useAuth, d as toast, z as findObj } from "./router-BX1vAgXZ.js";
import z__default from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { L as Loader } from "./Loader-BKqcHLqb.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
const TOKEN_REGEX = /^AET-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const tokenSchema = z__default.object({
  token: z__default.string().regex(TOKEN_REGEX, "Invalid token format. Expected: AET-XXXX-XXXX-XXXX").min(17, "Token must be 17 characters")
});
function ConnectPage() {
  const {
    user: connected
  } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    loginUser,
    logOut
  } = useAuth();
  const formControl = useForm({
    resolver: zodResolver(tokenSchema),
    mode: "onBlur",
    defaultValues: {
      token: ""
    }
  });
  const {
    register,
    getValues,
    setError,
    formState: {
      errors,
      isValid,
      isLoading,
      isSubmitting
    }
  } = formControl;
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const acc = findObj({
        collection: "users",
        id: getValues("token"),
        prop: "token"
      });
      if (!acc) {
        setError("token", {
          message: "Please Make Sure You Enter A Valid Token From Your Wallet Account"
        });
        setTimeout(() => {
          toast.error({
            title: "Error Message",
            description: "Token is Invalid"
          });
        }, 3e3);
        return;
      }
      console.log(acc);
      await loginUser(acc.email, acc.password);
      const dest = acc.role === "admin" ? "/admin" : "/profile";
      navigate({
        to: dest
      });
      toast.default({
        title: "Success",
        description: "Wallet Successfully Connected",
        position: "bottom"
      });
    } catch (error2) {
      toast.error({
        title: "Error Message",
        description: error2.message
      });
    } finally {
      setTimeout(() => setLoading(false), 3e3);
    }
  };
  const error = errors["token"]?.message;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Wallet", title: "Connect to the exhibition", description: "Paste your Sharjahbiennial Wallet token to unlock bidding, buying, selling, and your profile." }),
    loading && /* @__PURE__ */ jsxs(Fragment, { children: [
      " ",
      /* @__PURE__ */ jsx(Loader, { fullScreen: true, message: "Connecting...", variant: "dots", size: "sm", className: "gap-2 flex flex-col h-screen" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-5xl gap-12 px-6 pb-32 pt-6 lg:grid-cols-[1.2fr_1fr]", children: [
      /* @__PURE__ */ jsx("div", { className: "border border-ink/15 p-8 md:p-10", children: connected ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-ink/10 pb-5", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "size-5 text-clay", strokeWidth: 1.4 }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.3em] text-clay", children: "Wallet connected" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 font-display text-3xl italic", children: connected.fullName }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-detail", children: connected.email }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-[10px] uppercase tracking-[0.22em] text-detail", children: "Balance" }),
        /* @__PURE__ */ jsx("p", { className: "font-display text-4xl italic" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/profile", className: "border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Go to profile" }),
          /* @__PURE__ */ jsx(Link, { to: "/wallet", className: "border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Open wallet" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            logOut();
            toast.reserved({
              title: "Logout Successful",
              description: "Wallet Disconnected"
            });
          }, className: "border border-clay/60 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-clay hover:border-clay hover:text-clay", children: "Disconnect" })
        ] })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-10 place-items-center bg-clay/10 text-clay", children: /* @__PURE__ */ jsx(KeyRound, { className: "size-4", strokeWidth: 1.5 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-detail", children: "Wallet token" })
        ] }),
        /* @__PURE__ */ jsx("input", { ...register("token", {
          required: true
        }), placeholder: "AET-XXXX-XXXX-XXXX", className: "mt-5 w-full border border-ink/20 bg-canvas px-4 py-4 font-mono text-base tracking-widest text-ink focus:border-ink focus:outline-none", autoFocus: true }),
        typeof error == "string" && /* @__PURE__ */ jsx("p", { className: "mt-3 border border-clay/40 bg-clay/5 px-3 py-2 text-xs text-clay", children: error }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: !isValid || isLoading || isSubmitting, className: "mt-6 w-full disabled:pointer-events-none disabled:opacity-80 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Connect wallet" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-5 text-xs text-detail", children: [
          "Don't have a wallet?",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/wallet", className: "text-ink underline underline-offset-4", children: "Create one in under a minute →" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("aside", { className: "border border-ink/10 bg-surface/40 p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Wallet, { className: "size-5 text-clay", strokeWidth: 1.4 }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl italic", children: "How it works" })
        ] }),
        /* @__PURE__ */ jsxs("ol", { className: "mt-6 flex flex-col gap-5 text-sm leading-relaxed text-ink/85", children: [
          /* @__PURE__ */ jsx(Step, { n: 1, title: "Create a wallet", children: "Sign up for a free Sharjahbiennial Wallet — it lives alongside the exhibition." }),
          /* @__PURE__ */ jsxs(Step, { n: 2, title: "Copy your token", children: [
            "In Wallet → Security, copy your unique",
            " ",
            /* @__PURE__ */ jsx("code", { className: "font-mono text-xs", children: "AET-…" }),
            " token."
          ] }),
          /* @__PURE__ */ jsx(Step, { n: 3, title: "Connect here", children: "Paste the token above. The site is unlocked instantly." }),
          /* @__PURE__ */ jsx(Step, { n: 4, title: "Bid, buy, sell", children: "Auctions, checkout, and listings all flow through your wallet balance." })
        ] })
      ] })
    ] })
  ] });
}
function Step({
  n,
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("li", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsx("span", { className: "grid size-7 shrink-0 place-items-center rounded-full border border-ink/20 font-display text-sm italic", children: n }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-detail", children })
    ] })
  ] });
}
export {
  ConnectPage as component
};
