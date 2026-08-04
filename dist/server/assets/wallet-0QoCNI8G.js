import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate, useRouterState, Link, Outlet } from "@tanstack/react-router";
import { ShieldCheck, User, Mail, EyeOff, Eye, Lock, Loader2, Sparkles, LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Send, ListOrdered, ChevronRight, ArrowUpRight, Wallet, Check, Copy, LockKeyhole, LogOut, Repeat2, TrendingUp, TrendingDown, ShoppingBag, Gavel, Palette, PiggyBank } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { u as useAuth, a as useToast, b as useAuthStore, c as useDataStore, t as txSign } from "./router-07wj3SDc.js";
import { useShallow } from "zustand/shallow";
import { f as formatMoney } from "./currencies-G6nNjE1o.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "clsx";
import "tailwind-merge";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
function AuthForms() {
  const [mode, setMode] = useState("register");
  const [showPw, setShowPw] = useState(false);
  useNavigate();
  const { registerUser, loginUser } = useAuth();
  const { toast } = useToast();
  const registerSchema = z.object({
    fullName: z.string().min(1, { message: "FullName is required" }),
    email: z.string().email({ message: "Enter a valid Email Address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).regex(
      strongPasswordRegex,
      "Password must contain uppercase, lowercase, number and special character"
    )
    // currency: z.string().min(1, { message: "Currency is required" }),
  });
  const loginSchema = z.object({
    email: z.string().email({ message: "Enter a valid Email Address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
  });
  const partSchema = mode == "register" ? registerSchema : loginSchema;
  const formControl = useForm({
    resolver: zodResolver(partSchema),
    mode: "onChange",
    defaultValues: {
      ...mode == "register" ? {
        fullName: "",
        email: "",
        password: ""
        // currency: "",
      } : {
        email: "",
        password: ""
      }
    }
  });
  const handleSubmission = formControl.handleSubmit(async (user) => {
    try {
      if (mode === "register") {
        await registerUser(user);
      } else {
        const { email, password } = user;
        await loginUser(email, password);
      }
      await toast({
        title: mode == "register" ? "Registration Successful" : "Welcome Back",
        position: "bottom-left",
        variant: "collection",
        duration: 4e3
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed Operation";
      console.log(message);
      toast({
        title: "Error Message",
        description: message,
        position: "bottom-left",
        variant: "error",
        duration: 4e3
      });
    }
  });
  const loading = formControl.formState.isSubmitting;
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.5, ease: "easeOut" },
      className: "relative",
      children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-7 shadow-2xl wallet-ring", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-32 wallet-dotgrid opacity-30", "aria-hidden": true }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-xl bg-[var(--w-brand)] text-[var(--w-brand-contrast)]", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "size-4", strokeWidth: 2.4 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--w-muted)]", children: "Secured locally" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 flex gap-1 rounded-full border border-[var(--w-border)] bg-[var(--w-input)] p-1 pt-2 px-3 md:px-4", children: ["register", "signin"].map((m) => /* @__PURE__ */ jsxs("span", { className: "relative  w-full", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setMode(m),
                className: `relative w-full flex-1 rounded-full px-3 py-2.5 text-xs font-semibold transition overflow-clip z-20 ${mode === m ? "" : "text-[var(--w-muted)] hover:text-[var(--w-fg)]"}`,
                children: m === "register" ? "Create wallet" : "Sign in"
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                animate: mode == m ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 },
                transition: { type: "spring", stiffness: 500, damping: 12 },
                className: `absolute inset-0 rounded-full ${mode == m && "bg-[var(--w-brand)] text-[var(--w-brand-contrast)]"} `
              }
            )
          ] }, m)) }),
          /* @__PURE__ */ jsx(FormProvider, { ...formControl, children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmission, className: "mt-6 flex flex-col gap-2", children: [
            mode === "register" && /* @__PURE__ */ jsx(
              Field,
              {
                fieldName: "fullName",
                label: "Full name",
                placeholder: "Eloise Marchand",
                icon: /* @__PURE__ */ jsx(User, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Field,
              {
                fieldName: "email",
                label: "Email",
                type: "text",
                placeholder: "you@aethelred.gallery",
                icon: /* @__PURE__ */ jsx(Mail, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              Field,
              {
                fieldName: "password",
                label: "Password",
                type: showPw ? "text" : "password",
                placeholder: "At least 6 characters",
                icon: /* @__PURE__ */ jsx(Lock, { className: "size-4" }),
                suffix: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPw((v) => !v),
                    className: "text-[var(--w-muted)] transition hover:text-[var(--w-fg)]",
                    "aria-label": "Toggle password",
                    children: showPw ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileTap: { scale: 0.98, opacity: 0.8 },
                whileHover: { y: -1 },
                type: "submit",
                disabled: loading,
                className: `mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg  ${loading ? "pointer-events-none opacity-40" : ""}`,
                style: { background: "var(--w-brand)", color: "var(--w-brand-contrast)" },
                children: loading ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin", size: 16 }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "size-4" }),
                  mode === "register" ? "Create my wallet" : "Sign in"
                ] })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-5 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "Your Data is stored with us" })
        ] })
      ] })
    }
  );
}
function Field({
  label,
  fieldName,
  type = "text",
  placeholder,
  icon,
  suffix
}) {
  const {
    register,
    formState: { errors }
  } = useFormContext();
  const options = {};
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        icon && /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--w-muted)]", children: icon }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type,
            ...register(fieldName, { ...options }),
            placeholder,
            className: `w-full rounded-xl border border-[var(--w-border)] bg-[var(--w-input)] py-2 ${icon ? "pl-11" : "pl-4"} ${suffix ? "pr-11" : "pr-4"} text-base font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]`
          }
        ),
        suffix && /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: suffix })
      ] })
    ] }),
    typeof errors[fieldName]?.message === "string" && /* @__PURE__ */ jsx(
      motion.p,
      {
        initial: { opacity: 0, x: -6 },
        animate: { opacity: 1, x: 0 },
        className: "rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)] animate__animated animate__headShake",
        children: errors[fieldName]?.message
      }
    )
  ] });
}
const nav = [
  { to: "/wallet", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/wallet/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/wallet/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/wallet/send", label: "Send", icon: Send },
  { to: "/wallet/activity", label: "Activity", icon: ListOrdered },
  { to: "/wallet/security", label: "Security", icon: ShieldCheck }
];
function Brand() {
  return /* @__PURE__ */ jsxs(Link, { to: "/wallet", className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ jsx(
      motion.span,
      {
        whileHover: { rotate: -8 },
        transition: { duration: 0.25 },
        className: "grid size-10 place-items-center rounded-[1rem] text-[var(--w-brand-contrast)] shadow-lg shadow-[oklch(0.62_0.18_45/0.4)]",
        style: { background: "var(--w-brand)" },
        children: /* @__PURE__ */ jsx(Wallet, { className: "size-5", strokeWidth: 2.4 })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-base font-extrabold tracking-tight text-[var(--w-fg)]", children: [
        "Ember",
        /* @__PURE__ */ jsx("span", { className: "text-[var(--w-brand)]", children: "Pay" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--w-muted)]", children: "Aethelred wallet" })
    ] })
  ] });
}
function AccountChip() {
  const { user, loggedIn } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      loggedIn: state.loggedIn
    }))
  );
  const { logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!user) return null;
  const initials = user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const copyToken = () => {
    navigator.clipboard.writeText(user.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        className: "flex items-center gap-2  rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] py-1 pl-1 pr-1 sm:pr-3 text-sm font-semibold text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/50",
        type: "button",
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "grid size-8 place-items-center rounded-full text-xs font-extrabold",
              style: { background: "var(--w-brand)", color: "var(--w-brand-contrast)" },
              children: initials || "A"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: user.fullName.split(" ")[0] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "fixed inset-0 z-10 cursor-default",
          onClick: () => setOpen(false),
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -8, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -8, scale: 0.96 },
          transition: { duration: 0.16, ease: "easeInOut" },
          className: "absolute right-0 top-12 z-20 w-72 overflow-hidden rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-surface)] shadow-2xl",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[var(--w-fg)]", children: user.fullName }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--w-muted)]", children: user.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-[var(--w-border)] p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "Wallet token" }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: copyToken,
                  className: "mt-1 flex w-full items-center justify-between gap-2 rounded-[1rem] bg-[var(--w-input)] px-3 py-2 text-left transition hover:bg-[var(--w-bg-2)]",
                  type: "button",
                  children: [
                    /* @__PURE__ */ jsx("code", { className: "truncate font-mono text-[11px] text-[var(--w-fg)]", children: user.token }),
                    copied ? /* @__PURE__ */ jsx(Check, { className: "size-3.5 shrink-0 text-[var(--w-brand)]" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3.5 shrink-0 text-[var(--w-muted)]" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                className: "flex w-full items-center gap-2 border-t border-[var(--w-border)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] transition hover:bg-[var(--w-bg-2)]",
                to: "/wallet/security",
                children: [
                  /* @__PURE__ */ jsx(LockKeyhole, { className: "size-4" }),
                  "Account Settings"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: logOut,
                className: "flex w-full items-center gap-2 border-t border-[var(--w-border)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] transition hover:bg-[var(--w-bg-2)]",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "size-4" }),
                  "Sign out"
                ]
              }
            )
          ]
        }
      )
    ] }) })
  ] });
}
function TopBar({ showAccount }) {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 border-b border-[var(--w-border)] bg-[var(--w-bg)]/85 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6", children: [
    /* @__PURE__ */ jsx(Brand, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-3 py-2 text-[11px] font-semibold text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/50",
          children: [
            "Gallery ",
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3.5" })
          ]
        }
      ),
      showAccount && /* @__PURE__ */ jsx(AccountChip, {})
    ] })
  ] }) });
}
function Ticker() {
  const items = [
    "BTC $68,420 ▲ 2.4%",
    "ETH $3,612 ▲ 1.1%",
    "USDC $1.00 ◆",
    "AET $42.18 ▲ 4.6%",
    "SOL $174 ▼ 0.8%",
    "ART-INDEX 1,240 ▲ 0.9%"
  ];
  const loop = [...items, ...items];
  return /* @__PURE__ */ jsx("div", { className: "overflow-hidden border-b border-[var(--w-border)] bg-[var(--w-bg-2)] py-2", children: /* @__PURE__ */ jsx("div", { className: "flex wallet-marquee gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: loop.map((t, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-[var(--w-brand)]" }),
    t
  ] }, i)) }) });
}
function WalletShell({ children }) {
  const { user, loggedIn } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      loggedIn: state.loggedIn
    }))
  );
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  if (!loggedIn || !user) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(TopBar, { showAccount: false }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 wallet-dotgrid opacity-30", "aria-hidden": true }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto grid w-full max-w-7xl flex-1 gap-12 px-6 py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
              children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-[var(--w-brand)]/40 bg-[var(--w-brand-soft)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--w-brand)]", children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "size-3" }),
                  " New · v2"
                ] }),
                /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl", children: [
                  "Spend it.",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("span", { className: "text-[var(--w-brand)]", children: "Send it." }),
                  /* @__PURE__ */ jsx("br", {}),
                  "Bid on it."
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-md text-base leading-relaxed text-[var(--w-muted)]", children: "EmberPay is the pocket wallet for the Aethelred exhibition. One token, one tap — bid on auctions, buy artworks, and settle with fellow collectors instantly." }),
                /* @__PURE__ */ jsx("ul", { className: "mt-8 grid max-w-md gap-3 text-sm text-[var(--w-fg)]/90", children: [
                  "Deposit, withdraw, transfer · zero fees",
                  "One token unlocks the entire gallery",
                  "Every bid, sale and purchase ledgered here"
                ].map((t) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-1.5 size-1.5 rounded-full bg-[var(--w-brand)]" }),
                  t
                ] }, t)) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(AuthForms, {})
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(TopBar, { showAccount: true }),
    /* @__PURE__ */ jsx(Ticker, {}),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-10 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden lg:block", children: /* @__PURE__ */ jsxs("nav", { className: "sticky top-28 flex flex-col gap-1 rounded-[1.6rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-2", children: [
        nav.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to,
              className: `group flex items-center gap-3 rounded-[1rem] px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-[var(--w-bg-2)] text-[var(--w-fg)]" : "text-[var(--w-muted)] hover:bg-[var(--w-bg-2)] hover:text-[var(--w-fg)]"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `grid size-8 place-items-center rounded-[0.9rem] transition ${active ? "" : "bg-[var(--w-bg-2)] text-[var(--w-fg)] group-hover:bg-[var(--w-input)]"}`,
                    style: active ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" } : void 0,
                    children: /* @__PURE__ */ jsx(Icon, { className: "size-4", strokeWidth: 2.2 })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: label }),
                active && /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 text-[var(--w-muted)]" })
              ]
            },
            to
          );
        }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-[1.2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-3 text-[11px] text-[var(--w-fg)]", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]", children: "Pro tip" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 leading-snug text-[var(--w-muted)]", children: "Tap your balance to hide it during gallery walks." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("main", { className: "min-w-0 min-h-screen", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -4 },
          transition: { duration: 0.22, ease: "easeOut" },
          children
        },
        pathname
      ) }) })
    ] }),
    /* @__PURE__ */ jsx(
      motion.nav,
      {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.15, duration: 0.4, ease: "easeOut" },
        className: "fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md justify-between gap-1 rounded-[1.6rem] border border-[var(--w-border)] bg-[var(--w-surface)]/95 p-1.5 pt-2.5 px-2 shadow-2xl backdrop-blur-xl lg:hidden",
        children: nav.slice(0, 5).map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return /* @__PURE__ */ jsxs("span", { className: "relative flex flex-1 w-full", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to,
                className: `flex flex-1 flex-col z-20 items-center gap-1 rounded-[1rem] px-2 py-2 text-[10px] font-bold transition ${active ? "" : "text-[var(--w-muted)]"}`,
                style: active ? { color: "var(--w-brand-contrast)" } : void 0,
                children: [
                  /* @__PURE__ */ jsx(Icon, { className: "size-4", strokeWidth: 2.2 }),
                  label
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.span,
              {
                animate: active ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 },
                className: `inset-0 absolute rounded-[1rem] z-10 ${active && "bg-[var(--w-brand)] "}`,
                transition: { type: "spring", stiffness: 500, damping: 12 }
              }
            )
          ] }, to);
        })
      }
    )
  ] });
}
function WalletDashboard() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const isExact = pathname === "/wallet";
  return /* @__PURE__ */ jsx(WalletShell, { children: isExact ? /* @__PURE__ */ jsx(Dashboard, {}) : /* @__PURE__ */ jsx(Outlet, {}) });
}
function Dashboard() {
  const {
    currentAccount
  } = useAuthStore(useShallow((state) => ({
    currentAccount: state.user
  })));
  const [showBal, setShowBal] = useState(true);
  const [copied, setCopied] = useState(false);
  if (!currentAccount) return null;
  const {
    txs
  } = useDataStore(useShallow((s) => ({
    txs: s.transactions
  })));
  const stats = useMemo(() => {
    let deposited = 0;
    let withdrawn = 0;
    let spent = 0;
    for (const t of txs) {
      if (t.type === "deposit") deposited += t.amount;
      else if (t.type === "withdraw") withdrawn += t.amount;
      else if (txSign(t.type) < 0) spent += t.amount;
    }
    return {
      deposited,
      withdrawn,
      spent
    };
  }, [txs]);
  const copy = () => {
    navigator.clipboard.writeText(currentAccount.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 16
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.45,
      ease: "easeOut"
    }, className: "relative z-20 !overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-7 shadow-2xl wallet-ring md:p-9", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 wallet-dotgrid opacity-30", "aria-hidden": true }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-40 blur-3xl", style: {
        background: "var(--w-brand)"
      }, "aria-hidden": true }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--w-muted)]", children: [
            /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full wallet-live-dot" }),
            " Total balance"
          ] }),
          /* @__PURE__ */ jsxs(motion.button, { onClick: () => setShowBal((v) => !v), whileTap: {
            scale: 0.98
          }, className: "mt-3 flex items-center gap-3 text-left", children: [
            /* @__PURE__ */ jsx("span", { className: "text-3xl font-extrabold tracking-tight text-[var(--w-fg)] md:text-4xl", children: showBal ? formatMoney(currentAccount.wallet.balance, currentAccount?.currency, {
              withSymbol: true
            }) : "••••••" }),
            /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-full border border-[var(--w-border)] bg-[var(--w-bg-2)] text-[var(--w-muted)]", children: showBal ? /* @__PURE__ */ jsx(EyeOff, { className: "size-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "size-3.5" }) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 flex items-center gap-2 text-xs text-[var(--w-muted)]", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block size-1.5 rounded-full bg-[var(--w-brand)]" }),
            currentAccount.fullName,
            " · ",
            currentAccount.email
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden shrink-0 rounded-[1.25rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-4 py-3 text-right md:block", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "24h" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm font-extrabold text-[var(--w-brand)]", children: [
            "▲ ",
            formatMoney(Math.max(stats.deposited - stats.spent, 0), currentAccount?.currency)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(motion.button, { whileHover: {
        y: -1
      }, whileTap: {
        scale: 0.99
      }, onClick: copy, className: "relative mt-6 flex w-full items-center justify-between gap-3 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-4 py-3 text-left transition hover:border-[var(--w-brand)]/40", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "Your wallet token" }),
          /* @__PURE__ */ jsx("code", { className: "truncate font-mono text-sm font-semibold tracking-wider text-[var(--w-fg)]", children: currentAccount.token })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider", style: {
          background: "var(--w-brand)",
          color: "var(--w-brand-contrast)"
        }, children: [
          copied ? /* @__PURE__ */ jsx(Check, { className: "size-3" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3" }),
          copied ? "Copied" : "Copy"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mt-5 grid grid-cols-4 gap-2", children: [
        /* @__PURE__ */ jsx(Action, { to: "/wallet/deposit", icon: ArrowDownToLine, label: "Deposit" }),
        /* @__PURE__ */ jsx(Action, { to: "/wallet/withdraw", icon: ArrowUpFromLine, label: "Withdraw" }),
        /* @__PURE__ */ jsx(Action, { to: "/wallet/send", icon: Send, label: "Send" }),
        /* @__PURE__ */ jsx(Action, { to: "/wallet/activity", icon: Repeat2, label: "History" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(Stat, { label: "Deposited", value: stats.deposited, icon: TrendingUp, tint: "var(--w-brand)", delay: 0.05 }),
      /* @__PURE__ */ jsx(Stat, { label: "Withdrawn", value: stats.withdrawn, icon: TrendingDown, tint: "var(--w-brand)", delay: 0.1 }),
      /* @__PURE__ */ jsx(Stat, { label: "Spent", value: stats.spent, icon: ShoppingBag, tint: "var(--w-brand)", delay: 0.15 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsx(DiscoverCard, { icon: Gavel, title: "Live auctions", desc: "3 lots closing tonight", href: "/auctions" }),
      /* @__PURE__ */ jsx(DiscoverCard, { icon: Palette, title: "New artworks", desc: "42 fresh on the wall", href: "/gallery" }),
      /* @__PURE__ */ jsx(DiscoverCard, { icon: PiggyBank, title: "Top up wallet", desc: "Fund in seconds", href: "/wallet/deposit", accent: true })
    ] }),
    /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, transition: {
      delay: 0.2
    }, className: "rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-5 md:p-7", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--w-fg)]", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-[var(--w-brand)]" }),
          "Recent activity"
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/wallet/activity", className: "inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--w-brand)] hover:underline", children: [
          "See all ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3" })
    ] })
  ] });
}
function Action({
  to,
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsx(Link, { to, className: "group", children: /* @__PURE__ */ jsxs(motion.div, { whileHover: {
    y: -2
  }, whileTap: {
    scale: 0.97
  }, className: "flex flex-col items-center gap-2 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-3 py-4 transition hover:border-[var(--w-brand)]/40", children: [
    /* @__PURE__ */ jsx("span", { className: "grid size-11 place-items-center rounded-[1.1rem] text-[var(--w-brand-contrast)] shadow-md", style: {
      background: "var(--w-brand)"
    }, children: /* @__PURE__ */ jsx(Icon, { className: "size-5", strokeWidth: 2.2 }) }),
    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-extrabold uppercase tracking-wider text-[var(--w-fg)]", children: label })
  ] }) });
}
function Stat({
  label,
  value,
  icon: Icon,
  tint,
  delay = 0
}) {
  const {
    user
  } = useAuthStore();
  return /* @__PURE__ */ jsxs(motion.div, { initial: {
    opacity: 0,
    y: 12
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    delay,
    duration: 0.4
  }, className: "rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--w-muted)]", children: label }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "grid size-7 place-items-center rounded-lg text-[var(--w-brand-contrast)]",
          children: /* @__PURE__ */ jsx(Icon, { className: `size-2.5 text-[${tint}]`, strokeWidth: 2.2 })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-xl font-extrabold tracking-tight text-[var(--w-fg)] break-all line-clamp-1", children: formatMoney(value, user?.currency) })
  ] });
}
function DiscoverCard({
  icon: Icon,
  title,
  desc,
  href,
  accent
}) {
  return /* @__PURE__ */ jsx(Link, { to: href, children: /* @__PURE__ */ jsxs(motion.div, { whileHover: {
    y: -3
  }, className: `relative h-full overflow-hidden rounded-[1.5rem] border p-4 transition ${accent ? "border-[var(--w-brand)]/40 bg-[var(--w-brand-soft)]" : "border-[var(--w-border)] bg-[var(--w-surface)] hover:border-[var(--w-brand)]/30"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "grid size-9 place-items-center rounded-[1rem]", style: accent ? {
        background: "var(--w-brand)",
        color: "var(--w-brand-contrast)"
      } : {
        background: "var(--w-bg-2)",
        color: "var(--w-brand)"
      }, children: /* @__PURE__ */ jsx(Icon, { className: "size-4", strokeWidth: 2.2 }) }),
      /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-4 text-[var(--w-muted)]" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-extrabold tracking-tight text-[var(--w-fg)]", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--w-muted)]", children: desc })
  ] }) });
}
export {
  WalletDashboard as component
};
