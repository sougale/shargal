import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Loader2, Copy } from "lucide-react";
import { motion } from "motion/react";
import { b as useAuthStore, T as Err, S as Select, B as SelectTrigger, C as SelectValue, D as SelectContent, E as SelectGroup, F as SelectItem, Q as copyClipboard } from "./router-07wj3SDc.js";
import { f as formatMoney, g as getCurrencySymbol, p as parseMoney } from "./currencies-G6nNjE1o.js";
import { useFormContext, Controller } from "react-hook-form";
function FormPage({
  title,
  subtitle,
  icon,
  eyebrow,
  children,
  aside
}) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, ease: "easeOut" },
      className: "mx-auto w-full max-w-5xl",
      children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/wallet",
            className: "inline-flex items-center gap-1.5 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)] transition hover:border-[var(--w-brand)]/40 hover:text-[var(--w-fg)]",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }),
              " Wallet"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: `mt-5 grid gap-6 ${aside ? "lg:grid-cols-[1.6fr_1fr]" : ""}`, children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { scale: 0.985 },
              animate: { scale: 1 },
              transition: { duration: 0.4, ease: "easeOut" },
              className: "overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] shadow-xl",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative border-b border-[var(--w-border)] bg-[var(--w-surface-2)] px-7 py-7 md:px-9 md:py-9", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 wallet-dotgrid opacity-40", "aria-hidden": true }),
                  /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx(
                      motion.span,
                      {
                        initial: { rotate: -8, scale: 0.8 },
                        animate: { rotate: 0, scale: 1 },
                        transition: { type: "spring", stiffness: 220, damping: 14 },
                        className: "grid size-14 place-items-center rounded-[1.25rem] border border-[var(--w-brand)]/40 bg-[var(--w-brand-soft)] text-[var(--w-brand)] shadow-lg",
                        children: icon
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { children: [
                      eyebrow && /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--w-brand)]", children: eyebrow }),
                      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-extrabold tracking-tight text-[var(--w-fg)] md:text-[2rem]", children: title }),
                      subtitle && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--w-muted)]", children: subtitle })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "p-6 md:p-8", children }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-t border-[var(--w-border)] bg-[var(--w-bg-2)]/60 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: [
                  /* @__PURE__ */ jsx(Lock, { className: "size-3" }),
                  "Encrypted · payment rail"
                ] })
              ]
            }
          ),
          aside && /* @__PURE__ */ jsx("div", { children: aside })
        ] })
      ]
    }
  );
}
function WInput({
  label,
  hint,
  icon,
  name,
  schema = "withdraw",
  ...props
}) {
  const {
    setValue,
    register,
    formState: { errors }
  } = useFormContext();
  const errorWithdraw = errors[name]?.message;
  return /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      icon && /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--w-muted)]", children: icon }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ...props,
          ...register(name),
          className: `w-full rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] py-3.5 ${icon ? "pl-11 pr-4" : "px-4"} text-base font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`
        }
      )
    ] }),
    hint && /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[var(--w-muted)]", children: hint }),
    errorWithdraw && /* @__PURE__ */ jsx(Err, { msg: typeof errorWithdraw == "string" && errorWithdraw })
  ] });
}
function WTextarea({
  label,
  hint,
  name,
  ...props
}) {
  const {
    formState: { errors },
    register
  } = useFormContext();
  const errorMessage = errors[name]?.message;
  return /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: label }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        ...props,
        ...register(name),
        rows: props.rows ?? 3,
        className: `resize-none text-base rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`
      }
    ),
    hint && /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[var(--w-muted)]", children: hint }),
    typeof errorMessage == "string" && /* @__PURE__ */ jsx(Err, { msg: errorMessage })
  ] });
}
function WSelect({
  label,
  options,
  value,
  name,
  placeholder,
  onChange
}) {
  const {
    formState: { errors },
    getValues,
    setValue,
    control
  } = useFormContext();
  const errorMessage = errors[name]?.message;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: label }),
    /* @__PURE__ */ jsx(
      Controller,
      {
        control,
        name,
        render: ({ field }) => {
          return /* @__PURE__ */ jsxs(
            Select,
            {
              value,
              onValueChange: (e) => {
                onChange(e);
                field.onChange(e);
              },
              defaultValue: field.value,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "appearance-none rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-6 text-sm font-medium text-[var(--w-fg)] focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]", children: /* @__PURE__ */ jsx(
                  SelectValue,
                  {
                    placeholder,
                    className: "placehoder:text-[var(--w-muted)]!"
                  }
                ) }),
                /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: options.map((o) => /* @__PURE__ */ jsx(
                  SelectItem,
                  {
                    value: o.value,
                    className: value === o.value ? "!bg-slate-600 z-10 text-white" : "hover:bg-slate-600/30! z-10",
                    children: o.label
                  },
                  o.value
                )) }) })
              ]
            }
          );
        }
      }
    ),
    errorMessage && /* @__PURE__ */ jsx(Err, { msg: typeof errorMessage == "string" && errorMessage })
  ] }) });
}
function WAmount({
  currency = "USD",
  name = "amount",
  schema = "withdraw"
}) {
  const { user } = useAuthStore();
  const {
    setValue,
    watch,
    getValues,
    register,
    control,
    formState: { errors }
  } = useFormContext();
  const errorMessage = errors["amount"]?.message;
  getValues("amount");
  const [v, setV] = useState("");
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Controller,
    {
      control,
      name,
      render: ({ field }) => {
        const value = field.value;
        const str = formatMoney(value, user?.currency, {
          withSymbol: false,
          decimals: 0
        });
        return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            whileFocus: { scale: 1.01 },
            className: "relative overflow-hidden rounded-[1.5rem] border border-[var(--w-brand)]/30 bg-[var(--w-bg-2)] px-6 py-7",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 wallet-dotgrid opacity-30", "aria-hidden": true }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--w-brand)]", children: "You enter" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-[var(--w-muted)]", children: getCurrencySymbol(currency) }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: str,
                      className: "w-full bg-transparent text-5xl font-extrabold tracking-tight text-[var(--w-fg)] focus:outline-none md:text-6xl",
                      onChange: (e) => {
                        const parsed = parseMoney(e.target.value);
                        field.onChange(parsed);
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: currency })
                ] }),
                errorMessage && /* @__PURE__ */ jsx(Err, { msg: typeof errorMessage == "string" && errorMessage })
              ] })
            ]
          }
        ) });
      }
    }
  ) });
}
function WSubmit({
  children,
  variant = "brand",
  ...props
}) {
  const bg = variant === "danger" ? "var(--w-danger)" : "var(--w-brand)";
  const {
    formState: { isLoading, isSubmitting, isValid }
  } = useFormContext();
  const loading = isLoading || isSubmitting;
  return /* @__PURE__ */ jsx(
    motion.button,
    {
      whileHover: { y: -1 },
      type: "submit",
      disabled: loading || !isValid,
      whileTap: { scale: 0.98 },
      ...props,
      className: `w-full rounded-[1.4rem] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--w-brand-contrast)] shadow-xl transition disabled:opacity-50 disabled:pointer-events-none ${props.className ?? ""} text-center mx-auto`,
      style: { background: bg },
      children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mx-auto text-center" }) : /* @__PURE__ */ jsx(Fragment, { children })
    }
  );
}
function WRow({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children });
}
function WCopied({
  label = "Clipboard is Empty",
  value = "Clipboard is Empty"
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: "Wallet Address" }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => {
          copyClipboard(value);
        },
        className: "cursor-pointer gap-3 overflow-clip rounded-2xl py-3 px-3 bg-[var(--w-input)] border border-[var(--w-border)] rounded-[1rem] text-[var(--w-brand)] flex justify-between items-center",
        children: [
          /* @__PURE__ */ jsxs("p", { className: "break-all line-clamp-1 text-sm text-white", children: [
            label,
            "fougphiadfosuip'agohup97hsdfoui"
          ] }),
          /* @__PURE__ */ jsx(Copy, { size: 17 })
        ]
      }
    )
  ] });
}
function WFile({
  label,
  hint,
  icon,
  name,
  ...props
}) {
  const {
    setValue,
    register,
    control,
    formState: { errors }
  } = useFormContext();
  const error = errors[name]?.message;
  return /* @__PURE__ */ jsx(
    Controller,
    {
      name,
      control,
      render: ({ field }) => {
        return /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]", children: label }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            icon && /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--w-muted)]", children: icon }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ...props,
                type: "file",
                onChange: (e) => {
                  const type = e.target.files[0];
                  field.onChange(type);
                },
                className: `w-full rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] py-3.5 ${icon ? "pl-11 pr-4" : "px-4"} text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`
              }
            )
          ] }),
          hint && /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[var(--w-muted)]", children: hint }),
          error && /* @__PURE__ */ jsx(Err, { msg: typeof error == "string" && error })
        ] });
      }
    }
  );
}
export {
  FormPage as F,
  WAmount as W,
  WSelect as a,
  WRow as b,
  WInput as c,
  WSubmit as d,
  WTextarea as e,
  WCopied as f,
  WFile as g
};
