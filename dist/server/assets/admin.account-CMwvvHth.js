import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { Shield, Mail, Key, Calendar, Wallet, Check, Copy, Trash2, Plus, X } from "lucide-react";
import { b as useAuthStore, c as useDataStore, e as useDoc, ac as AdminLoader, Y as BentoCard, l as fmtDateTime, d as toast, p as photoFN, $ as copyClipboard } from "./router-BX1vAgXZ.js";
import { useShallow } from "zustand/shallow";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "@tanstack/react-query";
import "@tanstack/react-router";
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
import "@emailjs/browser";
import "@radix-ui/react-select";
import "embla-carousel-react";
function AdminAccountPage() {
  const {
    user
  } = useAuthStore();
  const {
    wallets,
    setState
  } = useDataStore(useShallow((s) => ({
    wallets: s.wallets,
    setState: s.setState
  })));
  console.log({
    wallets
  });
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const startLoad = (loading2, msg) => {
    setLoading(true);
    setLoadingText(msg);
  };
  const stopLoad = () => {
    setLoading(false);
    setLoadingText("");
  };
  function copy(addr) {
    setCopied(addr);
    setTimeout(() => setCopied(null), 1400);
    copyClipboard(addr);
  }
  const {
    addDocToCollection,
    updateDocument,
    deleteDocument
  } = useDoc();
  if (!user) {
    return /* @__PURE__ */ jsx(AdminLoader, { fullscreen: true, variant: "page", message: "Loading profile", subMessage: "Preparing admin account" });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AdminLoader, { isLoading: loading, fullscreen: true, message: loadingText, variant: "action" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl space-y-6", children: [
      /* @__PURE__ */ jsx("header", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: "Admin · Account" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--a-fg)] md:text-4xl", children: "Account & crypto wallets" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--a-muted)]", children: "Manage your administrator Profile and the treasury wallets used for platform payouts." })
      ] }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "Identity", title: "Administrator Profile", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 md:flex-row md:items-start", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-20 shrink-0 place-items-center rounded-xl bg-[var(--a-accent)] text-2xl font-black text-[var(--a-accent-ink)]", onClick: () => setState({
          wallets: []
        }), children: user?.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("") }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-extrabold tracking-tight text-[var(--a-fg)]", children: user?.fullName }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]", children: [
              /* @__PURE__ */ jsx(Shield, { className: "size-3" }),
              " Super Administrator"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("dl", { className: "mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(InfoRow, { icon: Mail, label: "Email", value: user.email }),
            /* @__PURE__ */ jsx(InfoRow, { icon: Key, label: "Password", value: user.password }),
            /* @__PURE__ */ jsx(InfoRow, { icon: Calendar, label: "Joined", value: user.joinedDate })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(BentoCard, { eyebrow: "", title: "Crypto wallets", action: /* @__PURE__ */ jsxs("button", { onClick: () => {
        setActiveWallet(null);
        setWalletModalOpen(true);
      }, className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: [
        /* @__PURE__ */ jsx(Plus, { className: "size-3.5" }),
        " Upload wallet"
      ] }), children: wallets.length === 0 ? /* @__PURE__ */ jsx(EmptyWallets, { onAdd: () => setWalletModalOpen(true) }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: wallets.map((w) => /* @__PURE__ */ jsx("li", { className: "group rounded-lg border border-[var(--a-border)] bg-[var(--a-bg-2)] p-4 transition hover:border-[var(--a-border-hi)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "grid size-7 shrink-0 place-items-center rounded-md bg-[var(--a-surface)] text-[var(--a-fg-2)]", children: /* @__PURE__ */ jsx(Wallet, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsx("h4", { className: "truncate text-sm font-bold text-[var(--a-fg)]", children: w.name }),
            w.isDefault && /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--a-pos)]/30 bg-[var(--a-pos)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-pos)]", children: "Default" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--a-muted)]", children: [
            w.network,
            " · added ",
            fmtDateTime(w.createdAt)
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 break-all rounded-md border border-[var(--a-border)] bg-[var(--a-bg)] px-3 py-1.5 font-mono text-xs text-[var(--a-fg-2)]", children: w.address }),
          w.memo && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 text-[11px] text-[var(--a-muted)]", children: [
            "Memo: ",
            w.memo
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => {
            copy(w.address);
          }, className: "inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: copied === w.address ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Check, { className: "size-3" }),
            " Copied"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Copy, { className: "size-3" }),
            " Copy"
          ] }) }),
          /* @__PURE__ */ jsx("button", { onClick: async () => {
            startLoad(true, "Wallet Deleting...");
            try {
              await deleteDocument({
                collectionName: "wallets",
                id: w.id,
                message: `${w.name} Wallet Details Has Been Deleted Successfully`
              });
            } catch (error) {
              toast.error({
                title: "Error",
                description: error.message
              });
            } finally {
              stopLoad();
            }
          }, className: "grid size-7 place-items-center rounded-md border border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 text-[var(--a-neg)] hover:bg-[var(--a-neg)]/20", "aria-label": "Delete", children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }) })
        ] })
      ] }) }, w.id)) }) })
    ] }),
    /* @__PURE__ */ jsx(WalletFormModal, { open: walletModalOpen, onOpenChange: setWalletModalOpen, initial: activeWallet, onSubmit: async (data) => {
      if (!data) {
        toast.error({
          title: "Error",
          description: "Error Uploading Wallet",
          position: "top-left"
        });
        return;
      }
      startLoad(true, "Uploading Wallet Details");
      try {
        const image = await photoFN(data.qrCode);
        await addDocToCollection({
          collections: "wallets",
          document: {
            ...data,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            qrCode: image
          }
        });
      } catch (error) {
        toast.error({
          title: "Error",
          description: error.message,
          position: "top"
        });
      } finally {
        setWalletModalOpen(false);
        setActiveWallet(null);
        stopLoad();
      }
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
const walletFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80, "Label too long (max 80)."),
  network: z.string().min(1, {
    message: "Network is required"
  }),
  address: z.string().trim().min(12, "Address looks invalid (12–120 chars).").max(120, "Address looks invalid (12–120 chars)."),
  qrCode: z.instanceof(File, {
    message: "Please select an image file."
  }).refine((file) => file.size <= 5e6, `Max size 5MB.`).refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Supported: .jpg, .png, .webp"),
  memo: z.string().min(1, {
    message: "Note is required"
  }).trim(),
  isDefault: z.boolean().default(false)
});
function WalletFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {
      errors
    }
  } = useForm({
    resolver: zodResolver(walletFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      network: "",
      qrCode: void 0,
      address: "",
      memo: "",
      isDefault: false
    }
  });
  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        network: initial?.network ?? "",
        address: initial?.address ?? "",
        memo: initial?.memo ?? "",
        isDefault: initial?.isDefault ?? false,
        qrCode: initial?.qrCode
      });
    }
  }, [open, initial, reset]);
  const onFormSubmit = (data) => {
    onSubmit({
      name: data.name,
      network: data.network,
      address: data.address,
      memo: data.memo.trim(),
      isDefault: data.isDefault,
      qrCode: data.qrCode
    });
  };
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
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(DialogPrimitive.Title, { className: "font-display mt-0.5 text-xl font-extrabold tracking-tight md:text-2xl", children: initial ? "Edit crypto wallet" : "Upload crypto wallet" }) }),
        /* @__PURE__ */ jsx(DialogPrimitive.Close, { className: "grid size-8 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-fg)]", "aria-label": "Close", children: /* @__PURE__ */ jsx(X, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onFormSubmit), className: "flex flex-1 flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4 overflow-y-auto a-scrollbar px-5 py-5 md:px-6", children: [
          /* @__PURE__ */ jsxs(Field, { label: "Name", children: [
            /* @__PURE__ */ jsx("input", { ...register("name"), placeholder: "E.g Ethereum", maxLength: 80, className: inputCls }),
            errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-[var(--a-neg)]", children: errors.name.message })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Name", children: [
            /* @__PURE__ */ jsx("input", { ...register("network"), placeholder: "E.g TRC-20", maxLength: 80, className: inputCls }),
            errors.network && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-[var(--a-neg)]", children: errors.network.message })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Wallet address", children: [
            /* @__PURE__ */ jsx("input", { ...register("address"), placeholder: "Paste full address", maxLength: 120, className: `${inputCls} font-mono text-xs` }),
            errors.address && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-[var(--a-neg)]", children: errors.address.message })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Memo", children: [
            /* @__PURE__ */ jsx("input", { ...register("memo"), placeholder: "Note", maxLength: 120, className: inputCls }),
            errors.memo && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-[var(--a-neg)]", children: errors.memo.message })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Qr Code", children: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Controller, { name: "qrCode", control, render: ({
              field
            }) => {
              return /* @__PURE__ */ jsx("input", { type: "file", onChange: (e) => {
                const type = e.target.files[0];
                field.onChange(type);
              }, className: `${inputCls}` });
            } }),
            errors.qrCode && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-[var(--a-neg)]", children: errors.qrCode.message })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 border-t border-[var(--a-border)] bg-[var(--a-bg-2)] px-5 py-3 md:px-6", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onOpenChange(false), className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: initial ? "Save changes" : "Upload wallet" })
        ] })
      ] })
    ] }) })
  ] }) }) });
}
const inputCls = "w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-base text-[var(--a-fg)] outline-none focus:border-[var(--a-border-hi)]";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "a-eyebrow mb-1.5 block", children: label }),
    children
  ] });
}
export {
  AdminAccountPage as component
};
