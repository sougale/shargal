import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { y as useArtworkContext, h as useStore, b as useAuthStore, B as getArtworkBySlug, S as SmartImage, q as formatPrice, a as useToast } from "./router-BX1vAgXZ.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { A as AccountStatusBlocker } from "./AccountStatusBlocker-DLVsxeue.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
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
function CartPage() {
  const {
    artworks
  } = useArtworkContext();
  const {
    cart,
    setQuantity,
    removeFromCart,
    clearCart
  } = useStore();
  const user = useAuthStore((s) => s.user);
  const isAccountActive = user?.status === "active";
  const {
    toast
  } = useToast();
  const rows = cart.map((c) => ({
    item: c,
    artwork: getArtworkBySlug(c.slug, artworks)
  })).filter((r) => !!r.artwork);
  console.log(rows);
  const subtotal = rows.reduce((s, r) => s + r.artwork.price * r.item.quantity, 0);
  const shipping = rows.length ? 95 : 0;
  const total = subtotal + shipping;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Your order", title: "Cart", description: "Auctioned lots are bid on separately and cannot be added to cart." }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32 pt-6", children: rows.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center", children: [
      /* @__PURE__ */ jsx(ShoppingBag, { className: "size-10 text-detail", strokeWidth: 1.2 }),
      /* @__PURE__ */ jsx("p", { className: "text-detail", children: "Your cart is empty." }),
      /* @__PURE__ */ jsx(Link, { to: "/gallery", className: "border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Find a work" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-[1.6fr_1fr]", children: [
      /* @__PURE__ */ jsx("ul", { className: "flex flex-col divide-y divide-ink/10 border-y border-ink/10", children: rows.map(({
        item,
        artwork
      }) => /* @__PURE__ */ jsxs("li", { className: "flex gap-5 py-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/artworks/$slug", params: {
          slug: artwork.slug
        }, className: "block size-28 shrink-0 overflow-hidden bg-surface", children: /* @__PURE__ */ jsx(SmartImage, { src: artwork.image, alt: artwork.title, width: artwork.width, height: artwork.height, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: artwork.artist }),
              /* @__PURE__ */ jsx(Link, { to: "/artworks/$slug", params: {
                slug: artwork.slug
              }, className: "font-display text-2xl italic text-ink hover:text-clay", children: artwork.title }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-detail", children: [
                artwork.medium,
                " · ",
                artwork.dimensions
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => removeFromCart(item.slug), className: "text-detail hover:text-clay", "aria-label": "Remove", children: /* @__PURE__ */ jsx(Trash2, { className: "size-4", strokeWidth: 1.25 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-end justify-between pt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-ink/20", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setQuantity(item.slug, item.quantity - 1), className: "px-3 py-2 text-detail hover:text-ink", "aria-label": "Decrease", children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5", strokeWidth: 1.5 }) }),
              /* @__PURE__ */ jsx("span", { className: "min-w-8 text-center text-sm", children: item.quantity }),
              /* @__PURE__ */ jsx("button", { onClick: () => setQuantity(item.slug, item.quantity + 1), className: "px-3 py-2 text-detail hover:text-ink", "aria-label": "Increase", children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5", strokeWidth: 1.5 }) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-display text-xl italic", children: formatPrice(artwork.price * item.quantity) })
          ] })
        ] })
      ] }, item.slug)) }),
      /* @__PURE__ */ jsxs("aside", { className: "self-start border border-ink/15 bg-surface/40 p-6 lg:sticky lg:top-32", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl italic", children: "Order summary" }),
        /* @__PURE__ */ jsxs("dl", { className: "mt-6 flex flex-col gap-3 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-detail", children: "Subtotal" }),
            /* @__PURE__ */ jsx("dd", { children: formatPrice(subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-detail", children: "Shipping & handling" }),
            /* @__PURE__ */ jsx("dd", { children: formatPrice(shipping) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-baseline justify-between border-t border-ink/10 pt-4", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Total" }),
            /* @__PURE__ */ jsx("dd", { className: "font-display text-3xl italic", children: formatPrice(total) })
          ] })
        ] }),
        !isAccountActive && user ? /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(AccountStatusBlocker, { action: "general" }) }) : /* @__PURE__ */ jsx("button", { onClick: () => {
          const currentUser = useAuthStore.getState().user;
          const active = currentUser?.status === "active";
          if (!active) {
            toast({
              title: "Account not active",
              description: "Your account must be approved before you can checkout.",
              variant: "info"
            });
            return;
          }
          clearCart();
          toast({
            title: "Info",
            description: "Our Team Will Contact You Shortly",
            variant: "collection",
            position: "top"
          });
        }, disabled: !isAccountActive, className: "mt-6 w-full border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay disabled:opacity-50 disabled:pointer-events-none", children: "Proceed to checkout" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-detail", children: [
          rows.length,
          " ",
          rows.length === 1 ? "work" : "works",
          " · of",
          " ",
          artworks.length,
          " on view"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CartPage as component
};
