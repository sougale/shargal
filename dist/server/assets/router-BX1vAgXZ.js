import { useQuery, queryOptions, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Link, createRootRouteWithContext, useRouter, useRouterState, Outlet, HeadContent, Scripts, redirect, createFileRoute, lazyRouteComponent, notFound, useParams, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { useState, useEffect, createContext, useContext, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Share2, Bookmark, Heart, ShieldClose, AlertTriangle, Info, Check, Bell, ShoppingBag, User, Menu, Mail, MapPin, Instagram, BookOpen, Wallet, Gavel, ChevronDown, Shield, Loader2, RefreshCw, Home, LogOut, ArrowUpRight, ArrowDownRight, ChevronUp, Pencil, RotateCcw, Save, ChevronLeft, ChevronRight, Activity, Database, ArrowLeft, ShieldCheck, Calendar, CheckCircle2, Hammer, Package, ExternalLink, Pause, XCircle, Trash2 } from "lucide-react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import z__default, { z } from "zod";
import { Client, ID, Storage } from "appwrite";
import { getFirestore, doc, updateDoc, where, query, collection, onSnapshot, getDoc, addDoc, setDoc, deleteDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import emailjs from "@emailjs/browser";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
const appCss = "/assets/styles-CU2yEgDj.css";
const StoreCtx = createContext(null);
const KEY$1 = "sharjahbiennial.store.v1";
const empty$1 = {
  favorites: [],
  cart: [],
  bids: [],
  listings: [],
  connectedWalletId: null
};
function load$1() {
  if (typeof window === "undefined") return empty$1;
  try {
    const raw = localStorage.getItem(KEY$1);
    if (!raw) return empty$1;
    return { ...empty$1, ...JSON.parse(raw) };
  } catch {
    return empty$1;
  }
}
function StoreProvider({ children }) {
  const [state, setState] = useState(empty$1);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setState(load$1());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY$1, JSON.stringify(state));
    } catch {
    }
  }, [state, hydrated]);
  const value = {
    ...state,
    toggleFavorite: (slug) => setState((s) => ({
      ...s,
      favorites: s.favorites.includes(slug) ? s.favorites.filter((f) => f !== slug) : [...s.favorites, slug]
    })),
    isFavorite: (slug) => state.favorites.includes(slug),
    addToCart: (slug, qty = 1) => setState((s) => {
      const found = s.cart.find((c) => c.slug === slug);
      return {
        ...s,
        cart: found ? s.cart.map((c) => c.slug === slug ? { ...c, quantity: c.quantity + qty } : c) : [...s.cart, { slug, quantity: qty }]
      };
    }),
    removeFromCart: (slug) => setState((s) => ({ ...s, cart: s.cart.filter((c) => c.slug !== slug) })),
    removeFromBid: (slug) => setState((s) => ({ ...s, bids: s.bids.filter((b) => b.lotSlug !== slug) })),
    setQuantity: (slug, qty) => setState((s) => ({
      ...s,
      cart: qty <= 0 ? s.cart.filter((c) => c.slug !== slug) : s.cart.map((c) => c.slug === slug ? { ...c, quantity: qty } : c)
    })),
    clearCart: () => setState((s) => ({ ...s, cart: [] })),
    placeBid: (lotSlug, amount) => setState((s) => ({
      ...s,
      bids: [
        { lotSlug, amount, placedAt: (/* @__PURE__ */ new Date()).toISOString() },
        ...s.bids.filter((b) => !(b.lotSlug === lotSlug && b.amount === amount))
      ]
    })),
    addListing: (l) => setState((s) => ({
      ...s,
      listings: [
        { ...l, id: crypto.randomUUID(), createdAt: (/* @__PURE__ */ new Date()).toISOString() },
        ...s.listings
      ]
    })),
    removeListing: (id) => setState((s) => ({ ...s, listings: s.listings.filter((l) => l.id !== id) })),
    connectWallet: (accountId) => setState((s) => ({ ...s, connectedWalletId: accountId })),
    disconnectWallet: () => setState((s) => ({ ...s, connectedWalletId: null }))
  };
  return /* @__PURE__ */ jsx(StoreCtx.Provider, { value, children });
}
function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
const categories = [
  {
    slug: "abstract",
    label: "Abstract",
    description: "Painting and works on canvas that refuse representation in favour of pure material, gesture and field."
  },
  {
    slug: "figurative",
    label: "Figurative",
    description: "Drawings and paintings that return, again and again, to the architecture of the human body."
  },
  {
    slug: "minimalism",
    label: "Minimalism",
    description: "Works built from the smallest possible vocabulary — a line, a mark, a single resolved decision."
  },
  {
    slug: "sculpture",
    label: "Sculpture",
    description: "Three-dimensional works in plaster, stone, bronze and clay, occupying space rather than picturing it."
  },
  {
    slug: "photography",
    label: "Photography",
    description: "Photographs that treat light as their primary subject and architecture as their willing collaborator."
  },
  {
    slug: "digital",
    label: "Digital",
    description: "Digital and generative compositions, released in small editions and printed with archival care."
  },
  {
    slug: "mixed-media",
    label: "Mixed Media",
    description: "Assemblages of found and worked material — iron, silk, thread, paper — held together by attention."
  },
  {
    slug: "ceramics",
    label: "Ceramics",
    description: "Vessels and ceramic objects that sit between the functional and the contemplative."
  },
  {
    slug: "calligraphy",
    label: "Calligraphy",
    description: "The disciplined art of beautiful writing — ink, breath and gesture held in perfect tension on the page."
  },
  {
    slug: "drawings",
    label: "Drawings",
    description: "Works on paper that privilege line, mark and the directness of the hand above all else."
  },
  {
    slug: "horology",
    label: "Horology",
    description: "Timepieces and instruments that turn the measurement of duration into mechanical poetry."
  },
  {
    slug: "codices",
    label: "Codices",
    description: "Hand-bound books and manuscripts in which image, text and material form a single contemplative object."
  },
  {
    slug: "wallpaper",
    label: "Wallpaper",
    description: "Large-scale printed and painted surfaces made to transform the room rather than merely decorate it."
  },
  {
    slug: "paintings",
    label: "Paintings",
    description: "Works in oil, pigment and mixed media that explore surface, colour, light and the long patience of the hand."
  },
  {
    slug: "ceramics-porcelain",
    label: "Porcelain",
    description: "Fine porcelain vessels and objects fired to translucency, precision and quiet luminosity."
  }
];
const getCategory = (slug) => categories.find((c) => c.slug === slug);
const vincent = "/assets/Self-Portrait-artist-panel-board-Vincent-van-Gogh-1887-F1kTpzQs.jpg";
const jean = "/assets/Self-portrait-oil-canvas-J-A-D-Ingres-Conde-Museum-Ceyeui_y.jpg";
const marie = "/assets/Marie-Antoinette-canvas-KZwGzLQa.jpg";
const rembrant = "/assets/Self-Portrait-canvas-Rembrandt-van-Rijn-Washington-DC-BPyPIUHM.jpg";
const henrique = "/assets/Moulin-Rouge-oil-canvas-Henri-de-Toulouse-Lautrec(3)-Dn7Gtrj8.jpg";
const artists = [
  {
    slug: "vincent-van-gogh",
    name: "Vincent van Gogh",
    discipline: "Painting",
    location: "Auvers-sur-Oise, France",
    portrait: vincent,
    short: "Dutch Post-Impressionist painter whose bold color and expressive brushwork transformed modern art.",
    bio: "Vincent van Gogh was a Dutch painter whose work had a far-reaching influence on 20th-century art. His bold use of color, dramatic brushwork, and emotional honesty in depicting the natural world and human experience continue to resonate. He created over 2,000 artworks in just a decade, including iconic pieces like The Starry Night and Sunflowers."
  },
  {
    slug: "henri-de-toulouse-lautrec",
    name: "Henri de Toulouse-Lautrec",
    discipline: "Painting & Printmaking",
    location: "Paris, France",
    portrait: henrique,
    short: "French artist celebrated for his vivid depictions of Parisian nightlife and innovative poster designs.",
    bio: "Henri de Toulouse-Lautrec was a French painter, printmaker, and illustrator whose work captured the energy of Montmartre and the Moulin Rouge. Despite physical challenges, he produced an extraordinary body of work including paintings, lithographs, and posters that defined an era. His keen observation of Parisian society remains unmatched."
  },
  {
    slug: "rembrandt-van-rijn",
    name: "Rembrandt van Rijn",
    discipline: "Painting & Etching",
    location: "Amsterdam, Netherlands",
    portrait: rembrant,
    short: "Master of the Dutch Golden Age, renowned for his profound portraits and dramatic use of light and shadow.",
    bio: "Rembrandt van Rijn was a Dutch Golden Age painter and etcher whose mastery of light, shadow, and human emotion set him apart. He created hundreds of self-portraits, biblical scenes, and group portraits that explore the depths of the human condition. His innovative techniques in etching and painting continue to influence artists centuries later."
  },
  {
    slug: "elisabeth-vigee-le-brun",
    name: "Élisabeth Vigée Le Brun",
    discipline: "Portrait Painting",
    location: "Paris, France",
    portrait: marie,
    short: "Acclaimed French portraitist celebrated for her elegant depictions of European nobility and royalty.",
    bio: "Élisabeth Vigée Le Brun was a prominent French portrait painter who became the official portraitist of Marie Antoinette. She created over 600 portraits across Europe, known for her flattering yet insightful depictions of her subjects. Her work offers a rare female perspective on the aristocracy of the late 18th century."
  },
  {
    slug: "jean-auguste-dominique-ingres",
    name: "Jean Auguste Dominique Ingres",
    discipline: "Painting & Drawing",
    location: "Paris, France",
    portrait: jean,
    short: "French Neoclassical master whose precise line work and idealized forms defined a generation of artists.",
    bio: "Jean-Auguste-Dominique Ingres was a French Neoclassical painter whose emphasis on drawing and form made him one of the most influential artists of the 19th century. His portraits and historical paintings are celebrated for their exquisite draftsmanship, cool clarity, and timeless elegance. He served as a bridge between Neoclassicism and later artistic movements."
  }
];
const art09 = "/assets/art-09-Bcs5WR1G.jpg";
const art10 = "/assets/art-10-CVPJ_aRr.jpg";
const authPersistStorage = typeof window !== "undefined" ? createJSONStorage(() => localStorage) : void 0;
const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      loggedIn: false,
      loading: true,
      // start true until listener resolves
      isAuthHydrated: false,
      userID: null,
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state
        }));
      },
      setUser: (user) => {
        set((state) => {
          const current = state.user;
          if (current && user && current.userID === user.userID) {
            const same = current.wallet?.balance === user.wallet?.balance && current.wallet?.bidBalance === user.wallet?.bidBalance && current.fullName === user.fullName && current.status === user.status && current.blocked === user.blocked;
            if (same) {
              return state;
            }
          }
          if (current?.userID === user?.userID && current === user) {
            return state;
          }
          return {
            ...state,
            user,
            loggedIn: !!user,
            loading: false,
            isAuthHydrated: true
          };
        });
      },
      setLoading: (loading, isAuthHydrated) => {
        set((state) => {
          const nextIsHydrated = isAuthHydrated !== void 0 ? isAuthHydrated : state.isAuthHydrated;
          if (state.loading === loading && state.isAuthHydrated === nextIsHydrated) {
            return state;
          }
          return {
            ...state,
            loading,
            isAuthHydrated: nextIsHydrated
          };
        });
      }
    }),
    {
      name: "authStore",
      // Must use the SSR-safe storage (localStorage is undefined during server render).
      // Passing undefined tells zustand/persist to skip persistence on the server.
      storage: authPersistStorage,
      skipHydration: true,
      // Only persist the user, not transient loading states
      partialize: (state) => ({ user: state.user, loggedIn: state.loggedIn })
    }
  )
);
const dataPersistStorage = typeof window !== "undefined" ? createJSONStorage(() => localStorage) : void 0;
const useDataStore = create()(
  persist(
    (set, get) => ({
      transactions: [],
      users: [],
      auctions: [],
      bids: [],
      wallets: [],
      listings: [],
      // notifications are live-only from Firestore onSnapshot.
      // We deliberately do NOT persist them to avoid hydration + useSyncExternalStore loops.
      notifications: [],
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state
        }));
      }
    }),
    {
      name: "_dataStore",
      // Must use the SSR-safe storage (localStorage is undefined during server render).
      // Passing undefined tells zustand/persist to skip persistence on the server.
      storage: dataPersistStorage,
      skipHydration: true,
      // Only persist stable / cacheable data. Live snapshot collections (especially notifications)
      // can cause "getServerSnapshot" + max update depth errors when combined with rapid onSnapshot + selectors.
      partialize: (state) => ({
        transactions: state.transactions,
        users: state.users,
        auctions: state.auctions,
        bids: state.bids,
        wallets: state.wallets,
        listings: state.listings
        // explicitly exclude notifications
      })
    }
  )
);
let globalDefaultPosition = "bottom-right";
function setToastPosition(position) {
  globalDefaultPosition = position;
}
const POSITION_STYLES = {
  top: "top-6 left-1/2 -translate-x-1/2 items-center",
  bottom: "bottom-6 left-1/2 -translate-x-1/2 items-center",
  left: "left-6 top-1/2 -translate-y-1/2 items-start",
  right: "right-6 top-1/2 -translate-y-1/2 items-start",
  "top-left": "top-6 left-6 items-start",
  "top-right": "top-6 right-6 items-start",
  "bottom-left": "bottom-6 left-6 items-start",
  "bottom-right": "bottom-6 right-6 items-start"
};
const getDirection = (pos) => pos.includes("top") ? "up" : pos.includes("bottom") ? "down" : pos === "left" ? "left" : "right";
const getInitial = (dir) => dir === "up" ? { opacity: 0, y: -18, scale: 0.96 } : dir === "left" ? { opacity: 0, x: -18, scale: 0.96 } : dir === "right" ? { opacity: 0, x: 18, scale: 0.96 } : { opacity: 0, y: 18, scale: 0.96 };
const getExit = (dir) => dir === "up" ? { opacity: 0, y: -10, scale: 0.98 } : dir === "left" ? { opacity: 0, x: -10, scale: 0.98 } : dir === "right" ? { opacity: 0, x: 10, scale: 0.98 } : { opacity: 0, y: 8, scale: 0.98 };
const VARIANT_STYLES = {
  default: {
    container: "border-ink/[0.08] bg-[oklch(0.99_0.002_75)]",
    iconBg: "bg-ink/[0.045]",
    iconColor: "text-ink/60",
    progress: "bg-ink/35"
  },
  success: {
    container: "border-emerald-900/[0.12] bg-[oklch(0.975_0.015_145)]",
    iconBg: "bg-emerald-900/[0.07]",
    iconColor: "text-emerald-900/75",
    progress: "bg-emerald-900/45"
  },
  info: {
    container: "border-sky-900/[0.1] bg-[oklch(0.973_0.01_225)]",
    iconBg: "bg-sky-900/[0.06]",
    iconColor: "text-sky-900/65",
    progress: "bg-sky-900/40"
  },
  warning: {
    container: "border-amber-900/[0.13] bg-[oklch(0.978_0.018_72)]",
    iconBg: "bg-amber-900/[0.07]",
    iconColor: "text-amber-900/75",
    progress: "bg-amber-900/45"
  },
  error: {
    container: "border-rose-900/[0.13] bg-[oklch(0.975_0.02_18)]",
    iconBg: "bg-rose-900/[0.07]",
    iconColor: "text-rose-900/75",
    progress: "bg-rose-900/45"
  },
  collection: {
    container: "border-clay/25 bg-[oklch(0.982_0.018_36)]",
    iconBg: "bg-clay/[0.09]",
    iconColor: "text-clay",
    progress: "bg-clay/75"
  },
  reserved: {
    container: "border-ink/[0.09] bg-[oklch(0.978_0.006_70)]",
    iconBg: "bg-ink/[0.055]",
    iconColor: "text-ink/65",
    progress: "bg-ink/40"
  },
  shared: {
    container: "border-ink/[0.08] bg-[oklch(0.99_0.002_75)]",
    iconBg: "bg-ink/[0.045]",
    iconColor: "text-ink/60",
    progress: "bg-ink/35"
  }
};
const VARIANT_ICONS = {
  default: /* @__PURE__ */ jsx(Info, { className: "h-[14px] w-[14px]" }),
  success: /* @__PURE__ */ jsx(Check, { className: "h-[14px] w-[14px]" }),
  info: /* @__PURE__ */ jsx(Info, { className: "h-[14px] w-[14px]" }),
  warning: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-[14px] w-[14px]" }),
  error: /* @__PURE__ */ jsx(ShieldClose, { className: "h-[14px] w-[14px]" }),
  collection: /* @__PURE__ */ jsx(Heart, { className: "h-[14px] w-[14px]" }),
  reserved: /* @__PURE__ */ jsx(Bookmark, { className: "h-[14px] w-[14px]" }),
  shared: /* @__PURE__ */ jsx(Share2, { className: "h-[14px] w-[14px]" })
};
function ToastItem({
  toast: toast2,
  onDismiss,
  position
}) {
  const variant = toast2.variant || "default";
  const styles = VARIANT_STYLES[variant];
  const icon = VARIANT_ICONS[variant];
  const duration = toast2.duration ?? 4400;
  const dir = getDirection(position);
  React.useEffect(() => {
    if (duration) setTimeout(() => onDismiss(toast2.id), duration);
  }, [duration, onDismiss, toast2?.id]);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      layout: true,
      initial: getInitial(dir),
      animate: { opacity: 1, y: 0, x: 0, scale: 1 },
      exit: getExit(dir),
      transition: {
        type: "spring",
        stiffness: 340,
        damping: 32,
        mass: 0.9
      },
      whileHover: { y: dir === "up" ? 1 : -1.5 },
      className: cn(
        "group relative flex w-full max-w-[340px] overflow-hidden rounded-2xl border bg-white/95",
        "shadow-[0_10px_32px_-16px_rgb(0,0,0,0.12),0_1px_0_0_rgb(255,255,255,0.9)_inset]",
        styles.container
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "relative w-[3px] shrink-0 bg-ink/[0.035] overflow-hidden", children: /* @__PURE__ */ jsx(
          motion.div,
          {
            className: cn("absolute inset-x-0 top-0 origin-top", styles.progress),
            initial: { scaleY: 1 },
            animate: { scaleY: 0 },
            transition: { duration: duration / 1e3, ease: "linear" }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-start gap-3.5 pl-3.5 pr-4 py-[11px]", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-lg border border-ink/[0.04]",
                styles.iconBg
              ),
              children: /* @__PURE__ */ jsx("span", { className: cn("[&>svg]:h-3 [&>svg]:w-3", styles.iconColor), children: icon })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 pt-[1px] pr-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-[12.5px] leading-[1.2] tracking-[-0.18px] text-ink", children: toast2.title }),
            toast2.description && /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px] leading-[1.35] text-detail/90", children: toast2.description }),
            toast2.action && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  toast2.action.onClick();
                  onDismiss(toast2.id);
                },
                className: "mt-1.5 text-[9.5px] font-medium uppercase tracking-[1.6px] text-ink/50 hover:text-ink border-b border-ink/20 hover:border-ink/60 transition-colors",
                children: toast2.action.label
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onDismiss(toast2.id),
              className: "mt-0.5 h-5 w-5 rounded-md opacity-[0.22] hover:opacity-60 hover:bg-ink/5 flex items-center justify-center transition-all active:scale-90",
              "aria-label": "Dismiss",
              children: /* @__PURE__ */ jsx(X, { className: "h-2.5 w-2.5" })
            }
          )
        ] })
      ]
    }
  );
}
function Toaster() {
  const toasts = useToasts();
  const grouped = toasts.reduce(
    (acc, t) => {
      const pos = t.position ?? globalDefaultPosition;
      (acc[pos] ||= []).push(t);
      return acc;
    },
    {}
  );
  return /* @__PURE__ */ jsx(Fragment, { children: Object.keys(grouped).map((pos) => {
    const list = grouped[pos];
    if (!list?.length) return null;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "fixed z-[100] flex flex-col gap-2.5 pointer-events-none",
          POSITION_STYLES[pos]
        ),
        children: /* @__PURE__ */ jsx(AnimatePresence, { children: list.map((toast2) => /* @__PURE__ */ jsx("div", { className: "pointer-events-auto", children: /* @__PURE__ */ jsx(ToastItem, { toast: toast2, onDismiss: removeToast, position: pos }) }, toast2.id)) })
      },
      pos
    );
  }) });
}
let toastStore = {
  toasts: [],
  listeners: /* @__PURE__ */ new Set()
};
function notify() {
  toastStore.listeners.forEach((l) => l());
}
function addToast(props) {
  const id = Math.random().toString(36).slice(2, 9);
  const newToast = {
    id,
    position: props.position ?? globalDefaultPosition,
    ...props
  };
  toastStore.toasts = [...toastStore.toasts, newToast].slice(-7);
  notify();
  return id;
}
function removeToast(id) {
  toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id);
  notify();
}
function useToasts() {
  const [toasts, setToasts] = React.useState(toastStore.toasts);
  React.useEffect(() => {
    const listener = () => setToasts([...toastStore.toasts]);
    toastStore.listeners.add(listener);
    return () => toastStore.listeners.delete(listener);
  }, []);
  return toasts;
}
function useToast() {
  return {
    toast: (props) => addToast(props),
    dismiss: removeToast,
    dismissAll: () => {
      toastStore.toasts = [];
      notify();
    }
  };
}
const makeToast = (variant) => ({
  title,
  description,
  position
}) => addToast({ title, description, variant, position });
const toast = {
  default: makeToast("default"),
  success: makeToast("success"),
  info: makeToast("info"),
  warning: makeToast("warning"),
  error: makeToast("error"),
  // Project specific
  added: makeToast("collection"),
  reserved: makeToast("reserved"),
  shared: makeToast("shared"),
  dismiss: removeToast,
  setPosition: setToastPosition
};
function ToastProvider({ children }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    children,
    /* @__PURE__ */ jsx(Toaster, {})
  ] });
}
const firebaseConfig = {
  apiKey: "AIzaSyB-0b_JxDjYaXrHLpNX4-iobP88zF2f77Q",
  authDomain: "athetest.firebaseapp.com",
  projectId: "athetest",
  storageBucket: "athetest.firebasestorage.app",
  messagingSenderId: "540769027773",
  appId: "1:540769027773:web:4d509552c757487fcad9d4"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const copyClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.info({
      title: "Text Copied To Clipboard",
      position: "bottom-left"
    });
  });
};
z__default.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character").max(128, "Password is too long");
function makeToken() {
  const part = () => Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(0, 4).toUpperCase().padEnd(4, "X");
  return `AET-${part()}-${part()}-${part()}`;
}
function findObj({
  id,
  prop,
  collection: collection2
}) {
  const storeCollection = useDataStore.getState()[collection2];
  const obj = storeCollection.find((s) => s[prop] == id);
  return obj;
}
function getUserName(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    toast.warning({
      title: "Error Message",
      description: "Email is invalid",
      position: "top-right"
    });
    return "invalidemail";
  }
  const index = email.indexOf("@");
  const username = email.slice(0, index);
  return username;
}
async function photoFN(file) {
  const { endpoint, project_id, str_id } = appwriteConfig;
  try {
    const client = new Client().setEndpoint(endpoint).setProject(project_id);
    if (!client) throw new Error("Error File Creation");
    const uniqueID = ID.unique();
    const storage = new Storage(client);
    const createFileFN = await storage.createFile(str_id, uniqueID, file);
    const url = storage.getFileView(str_id, uniqueID);
    return url;
  } catch (error) {
    throw new Error(error.message);
  }
}
async function handleWalletBalance({
  balance,
  bidBalance,
  bidAmount,
  userID
}) {
  try {
    const modBalance = balance - bidAmount;
    const currentUserDoc = doc(db, "users", userID);
    await updateDoc(currentUserDoc, {
      wallet: {
        balance: modBalance,
        bidBalance: bidAmount + bidBalance
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
const checkForUserID = (arr, id) => {
  return arr.filter((a) => a.userID == id);
};
function useUserNotifications(userID, maxItems) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastSigRef = useRef("");
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    if (!userID) {
      if (mountedRef.current) {
        setNotifications([]);
        setIsLoading(false);
      }
      return;
    }
    setIsLoading(true);
    setError(null);
    const constraints = [where("userID", "==", userID)];
    const q = query(collection(db, "notifications"), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!mountedRef.current) return;
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            // Normalize createdAt to string for UI
            createdAt: data.createdAt ? typeof data.createdAt === "string" ? data.createdAt : data.createdAt.toDate?.().toISOString?.() ?? (/* @__PURE__ */ new Date()).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
          };
        });
        const sorted = [...list].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        const signature = sorted.map((n) => `${n.id}|${n.unread}|${n.createdAt}`).join(",");
        if (signature !== lastSigRef.current) {
          lastSigRef.current = signature;
          setNotifications(sorted);
        }
        setIsLoading(false);
      },
      (err) => {
        if (!mountedRef.current) return;
        console.error("[useUserNotifications] snapshot error", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    );
    return () => {
      mountedRef.current = false;
      unsub();
    };
  }, [userID, maxItems]);
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);
  return {
    notifications,
    unreadCount,
    isLoading,
    error
  };
}
const selectAuthForBell = (s) => ({
  userID: s.user?.userID ?? null,
  isAuthHydrated: s.isAuthHydrated
});
function NotificationBell() {
  const { userID, isAuthHydrated } = useAuthStore(useShallow(selectAuthForBell));
  const [open, setOpen] = useState(false);
  const { notifications: userNotifications, unreadCount } = useUserNotifications(userID);
  const notificationsRef = useRef([]);
  useEffect(() => {
    notificationsRef.current = userNotifications;
  }, [userNotifications]);
  const markAsRead = useCallback(async (notif) => {
    if (!notif.unread) return;
    try {
      await updateDoc(doc(db, "notifications", notif.id), { unread: false });
    } catch (e) {
      console.error("Failed to mark notification read", e);
    }
  }, []);
  const markAllRead = useCallback(async () => {
    const unread = notificationsRef.current.filter((n) => n.unread);
    if (unread.length === 0) return;
    await Promise.all(
      unread.map(
        (n) => updateDoc(doc(db, "notifications", n.id), { unread: false }).catch(() => {
        })
      )
    );
  }, []);
  useCallback(
    (notif) => () => {
      markAsRead(notif);
      setOpen(false);
    },
    [markAsRead]
  );
  useCallback(
    (notif) => () => markAsRead(notif),
    [markAsRead]
  );
  if (!isAuthHydrated) return null;
  if (!userID) return null;
  const items = userNotifications;
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: "relative inline-flex size-10 items-center justify-center text-ink/80 transition-colors hover:text-clay",
        "aria-label": "Notifications",
        children: [
          /* @__PURE__ */ jsx(Bell, { className: "size-4.5", strokeWidth: 1.5 }),
          unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-medium leading-4.5 text-canvas", children: unreadCount > 99 ? "99+" : unreadCount })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setOpen(false), "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute -right-36 z-50 mt-2 w-80 overflow-hidden rounded border border-ink/10 bg-canvas shadow-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-ink/10 px-4 py-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Notifications" }),
          unreadCount > 0 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: markAllRead,
              className: "text-[10px] uppercase tracking-[0.18em] text-clay hover:underline",
              children: "Mark all read"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[380px] overflow-y-auto", children: items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-8 text-center text-sm text-detail", children: "No notifications yet." }) : items.map((n) => /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "group border-b border-ink/5 px-4 py-3 last:border-b-0 hover:bg-surface/60",
              n.unread && "bg-clay/5"
            ),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "inline-block size-1.5 rounded-full",
                    n.unread ? "bg-clay" : "bg-ink/30"
                  )
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-ink", children: n.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs leading-snug text-detail", children: n.message }),
                n.data?.lotSlug && /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/auctions/$slug",
                    params: { slug: n.data.lotSlug },
                    className: "mt-1.5 inline-block text-[10px] uppercase tracking-[0.18em] text-clay hover:underline",
                    onClick: () => {
                      markAsRead(n);
                      setOpen(false);
                    },
                    children: "View lot →"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-detail/70", children: new Date(n.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) }),
                  n.unread && /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => markAsRead(n),
                      className: "text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-ink",
                      children: "Mark read"
                    }
                  )
                ] })
              ] })
            ] })
          },
          n.id
        )) }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-ink/10 bg-surface/40 px-4 py-2.5 text-center", children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/notifications",
            className: "text-[11px] uppercase tracking-[0.22em] text-ink hover:text-clay",
            onClick: () => setOpen(false),
            children: "View all notifications →"
          }
        ) })
      ] })
    ] })
  ] });
}
const ICON_STROKE = 1.25;
const aboutLinks = [
  {
    to: "/about",
    label: "Our story",
    note: "Founded 2019. Four seasons a year."
  },
  { to: "/contact", label: "Contact", note: "Inquiries, partnerships, press." }
  // { to: "/contact", label: "Partnerships", note: "Patrons, sponsors and houses." },
  // { to: "/about", label: "Journal", note: "Long-reads, studio visits, broadsheets." },
];
function MegaNav() {
  const [openPanel, setOpenPanel] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);
  const [mounted, setMounted] = useState(false);
  const { favorites, cart } = useStore();
  const favCount = favorites.length;
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenPanel(null), 180);
  };
  const openNow = (key) => {
    cancelClose();
    setOpenPanel(key);
  };
  const closeNow = () => {
    cancelClose();
    setOpenPanel(null);
  };
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-50 border-b border-ink/10 bg-canvas/95 backdrop-blur-md", children: [
    /* @__PURE__ */ jsx("div", { className: "hidden border-b border-ink/10 px-6 py-2 text-[10px] uppercase tracking-[0.22em] text-detail md:block", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: "Exhibition No. 12 · Spring 2026 · Open online, daily" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "mailto:support@sharjahbiennial.online",
            className: "hover:text-ink",
            children: "support@sharjahbiennial.online"
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "Antwerp · Kyoto · Lisbon" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-ink", children: "Instagram" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-ink", children: "Journal" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "font-display text-2xl italic tracking-tight text-ink",
          onClick: () => {
            setMobileOpen(false);
            closeNow();
          },
          children: "Sharjahbiennial"
        }
      ),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-9 md:flex ", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/gallery",
            className: "text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 hover:text-clay",
            activeProps: { className: "text-clay" },
            onMouseEnter: closeNow,
            children: "Gallery"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/auctions",
            className: "text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 hover:text-clay",
            activeProps: { className: "text-clay" },
            onMouseEnter: closeNow,
            children: "Auction"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/listings",
            className: "text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 hover:text-clay",
            activeProps: { className: "text-clay" },
            onMouseEnter: closeNow,
            children: "Listings"
          }
        ),
        ["categories", "artists", "about"].map((key) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onMouseEnter: () => openNow(key),
            onMouseLeave: scheduleClose,
            onFocus: () => openNow(key),
            onClick: () => openNow(key),
            className: `text-[11px] font-medium uppercase tracking-[0.22em] ${openPanel === key ? "text-clay" : "text-ink/80 hover:text-clay"}`,
            children: key
          },
          key
        ))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 md:gap-2", children: [
        /* @__PURE__ */ jsx(WalletNavIcon, {}),
        /* @__PURE__ */ jsx(NotificationBell, {}),
        /* @__PURE__ */ jsx(
          IconLink,
          {
            to: "/favourites",
            label: "Favourites",
            count: favCount,
            Icon: Heart
          }
        ),
        /* @__PURE__ */ jsx(
          IconLink,
          {
            to: "/cart",
            label: "Cart",
            count: cartCount,
            Icon: ShoppingBag
          }
        ),
        /* @__PURE__ */ jsx(IconLink, { to: "/profile", label: "Profile", Icon: User }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/contact",
            className: "ml-2 hidden border border-ink px-5 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-canvas md:inline-block",
            children: "Contact"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": mobileOpen ? "Close menu" : "Open menu",
            className: "text-ink md:hidden",
            onClick: () => setMobileOpen((v) => !v),
            children: mobileOpen ? /* @__PURE__ */ jsx(X, { className: "size-6", strokeWidth: ICON_STROKE }) : /* @__PURE__ */ jsx(Menu, { className: "size-6", strokeWidth: ICON_STROKE })
          }
        )
      ] })
    ] }),
    openPanel && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute left-0 right-0 top-full hidden border-t border-ink/10 bg-canvas shadow-[0_30px_50px_-30px_rgba(58,52,45,0.25)] md:block",
        onMouseEnter: cancelClose,
        onMouseLeave: scheduleClose,
        children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl grid-cols-[1.5fr_1fr] gap-12 px-6 py-12", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            openPanel === "categories" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "mb-6 text-[10px] uppercase tracking-[0.3em] text-detail", children: "Browse by mode of design" }),
              /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-x-10 gap-y-5", children: categories.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/categories/$slug",
                  params: { slug: c.slug },
                  onClick: closeNow,
                  className: "group block",
                  children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-display text-2xl italic text-ink group-hover:text-clay", children: c.label }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-relaxed text-detail", children: c.description })
                  ]
                }
              ) }, c.slug)) })
            ] }),
            openPanel === "artists" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "mb-6 text-[10px] uppercase tracking-[0.3em] text-detail", children: "Renowned, the world over" }),
              /* @__PURE__ */ jsx("ul", { className: "mb-10 grid grid-cols-2 gap-x-10 gap-y-4", children: artists.map((a) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/artists/$slug",
                  params: { slug: a.slug },
                  onClick: closeNow,
                  className: "group block",
                  children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-display text-xl italic text-ink group-hover:text-clay", children: a.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.18em] text-detail", children: a.discipline })
                  ]
                }
              ) }, a.slug)) })
            ] }),
            openPanel === "about" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "mb-6 text-[10px] uppercase tracking-[0.3em] text-detail", children: "The gallery" }),
              /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-x-10 gap-y-5", children: aboutLinks.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: l.to,
                  onClick: closeNow,
                  className: "group block",
                  children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-display text-2xl italic text-ink group-hover:text-clay", children: l.label }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-relaxed text-detail", children: l.note })
                  ]
                }
              ) }, l.label)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: openPanel === "categories" ? art09 : openPanel === "artists" ? "https://afar.brightspotcdn.com/dims4/default/9416106/2147483647/strip/true/crop/2000x1333+1+0/resize/1800x1200!/format/webp/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F3a%2F99%2Fd822ba7d4bff9525f0f14b7c5f98%2Fmassachusetts-peabody-essex-museum-shutterstock-edmonia-lewis-pr.jpg" : art10,
                alt: "",
                className: "aspect-[4/5] w-full object-cover pointer-events-none"
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-3 text-[10px] uppercase tracking-[0.22em] text-detail", children: [
              openPanel === "categories" && "Horizon Field — Søren Kjeldsen, 2024",
              openPanel === "artists" && "When she was 19, Edmonia Lewis met Frederick Douglass, who inspired her to pursue her art",
              openPanel === "about" && "From the spring catalogue — printed in editions of 200"
            ] })
          ] })
        ] })
      }
    ),
    mounted && mobileOpen && createPortal(
      /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-100 flex flex-col bg-canvas md:hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-[81px] shrink-0 items-center justify-between border-b border-ink/10 px-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              onClick: () => setMobileOpen(false),
              className: "font-display text-2xl italic tracking-tight text-ink",
              children: "sharjahbiennial"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Close menu",
              onClick: () => setMobileOpen(false),
              className: "text-ink",
              children: /* @__PURE__ */ jsx(X, { className: "size-6", strokeWidth: ICON_STROKE })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col overflow-y-auto", children: [
          /* @__PURE__ */ jsxs("nav", { className: "flex flex-col px-6 pt-8", children: [
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/gallery",
                label: "Gallery",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/auctions",
                label: "Auction",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavGroup,
              {
                label: "Categories",
                items: categories.map((c) => ({
                  to: "/categories/$slug",
                  params: { slug: c.slug },
                  label: c.label,
                  note: c.description
                })),
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavGroup,
              {
                label: "Artists",
                items: artists.map((a) => ({
                  to: "/artists/$slug",
                  params: { slug: a.slug },
                  label: a.name,
                  note: a.discipline
                })),
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavGroup,
              {
                label: "About",
                items: aboutLinks.map((l) => ({
                  to: l.to,
                  label: l.label,
                  note: l.note
                })),
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/favourites",
                label: `Favourites${favCount ? ` (${favCount})` : ""}`,
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/cart",
                label: `Cart${cartCount ? ` (${cartCount})` : ""}`,
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/wallet",
                label: "Wallet",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/connect",
                label: "Connect wallet",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/bids",
                label: "My bids",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/listings",
                label: "My listings",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/sell",
                label: "Sell your work",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/profile",
                label: "Profile",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/notifications",
                label: "Notifications",
                onNavigate: () => setMobileOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              MobileNavLink,
              {
                to: "/contact",
                label: "Contact",
                onNavigate: () => setMobileOpen(false)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto border-t border-ink/10 bg-sand/30 px-6 py-10", children: [
            /* @__PURE__ */ jsx("p", { className: "mb-6 text-[10px] uppercase tracking-[0.3em] text-detail", children: "The gallery" }),
            /* @__PURE__ */ jsxs("ul", { className: "flex flex-col gap-4 text-sm text-ink", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  Mail,
                  {
                    className: "mt-0.5 size-4 shrink-0 text-detail",
                    strokeWidth: ICON_STROKE
                  }
                ),
                /* @__PURE__ */ jsx("a", { href: "mailto:support@sharjahbiennial.online", children: "support@sharjahbiennial.online" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  MapPin,
                  {
                    className: "mt-0.5 size-4 shrink-0 text-detail",
                    strokeWidth: ICON_STROKE
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: "Antwerp · Kyoto · Lisbon" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  Instagram,
                  {
                    className: "mt-0.5 size-4 shrink-0 text-detail",
                    strokeWidth: ICON_STROKE
                  }
                ),
                /* @__PURE__ */ jsx("a", { href: "#", children: "@sharjahbiennial.online" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  BookOpen,
                  {
                    className: "mt-0.5 size-4 shrink-0 text-detail",
                    strokeWidth: ICON_STROKE
                  }
                ),
                /* @__PURE__ */ jsx("a", { href: "#", children: "Journal & broadsheets" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 border-t border-ink/10 pt-6 text-[10px] uppercase tracking-[0.22em] text-detail", children: [
              /* @__PURE__ */ jsx("p", { children: "Exhibition No. 12" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1", children: "Spring 2026 · Open online, daily" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-4 normal-case tracking-normal text-detail/70", children: [
                "© ",
                (/* @__PURE__ */ new Date()).getFullYear(),
                " sharjahbiennial"
              ] })
            ] })
          ] })
        ] })
      ] }),
      document.body
    )
  ] });
}
function MobileNavLink({
  to,
  label,
  onNavigate
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      to,
      onClick: onNavigate,
      className: "border-b border-ink/10 py-5 font-display text-3xl italic text-ink",
      children: label
    }
  );
}
function MobileNavGroup({
  label,
  items,
  onNavigate
}) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "border-b border-ink/10", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        "aria-expanded": open,
        className: "flex w-full items-center justify-between py-5 text-left font-display text-3xl italic text-ink",
        children: [
          /* @__PURE__ */ jsx("span", { children: label }),
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              className: `size-6 text-detail transition-transform duration-300 ${open ? "rotate-180" : ""}`,
              strokeWidth: ICON_STROKE
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-4 pb-6 pl-1 pr-2", children: items.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: item.to,
        params: item.params,
        onClick: onNavigate,
        className: "group block",
        children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-lg italic text-ink group-hover:text-clay", children: item.label }),
          item.note && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs leading-relaxed text-detail", children: item.note })
        ]
      }
    ) }, `${item.to}-${item.label}`)) })
  ] });
}
function IconLink({
  to,
  label,
  count,
  Icon
}) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to,
      "aria-label": label,
      className: "relative inline-flex size-10 items-center justify-center text-ink/80 transition-colors hover:text-clay",
      activeProps: { className: "text-clay" },
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "size-4.5", strokeWidth: ICON_STROKE }),
        typeof count === "number" && count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-medium leading-4.5 text-canvas", children: count > 99 ? "99+" : count })
      ]
    }
  );
}
function WalletNavIcon() {
  const { user } = useAuthStore();
  if (user) {
    return /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/wallet",
        "aria-label": "Open wallet",
        className: "ml-1 hidden items-center gap-2 divide-2 border border-ink/20 px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] text-ink hover:border-ink md:inline-flex",
        activeProps: { className: "border-clay text-clay" },
        children: [
          /* @__PURE__ */ jsx(Wallet, { className: "size-[15px]", strokeWidth: ICON_STROKE }),
          "$",
          user?.wallet?.balance.toLocaleString(),
          /* @__PURE__ */ jsx(Gavel, { className: "size-[15px]", strokeWidth: ICON_STROKE }),
          "$",
          user?.wallet?.bidBalance.toLocaleString()
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/connect",
      "aria-label": "Connect wallet",
      className: "relative inline-flex size-10 items-center justify-center text-ink/80 transition-colors hover:text-clay",
      children: [
        /* @__PURE__ */ jsx(Wallet, { className: "size-[18px]", strokeWidth: ICON_STROKE }),
        /* @__PURE__ */ jsx("span", { className: "absolute right-1 top-1.5 size-1.5 rounded-full bg-clay" })
      ]
    }
  );
}
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "border-t border-ink/10 px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-16 md:flex-row md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl italic text-ink", children: "sharjahbiennial" }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm leading-relaxed text-detail", children: "A digital sanctuary for the appreciation of modern thought and traditional craft. New works released seasonally." }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            className: "mt-8 flex items-center border-b border-ink/30 pb-2",
            onSubmit: (e) => e.preventDefault(),
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  required: true,
                  placeholder: "Your email",
                  className: "w-full bg-transparent text-sm outline-none placeholder:text-detail/60"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "text-[10px] font-medium uppercase tracking-[0.22em] text-ink hover:text-clay",
                  children: "Subscribe"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-12 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink", children: "Visit" }),
          /* @__PURE__ */ jsx(Link, { to: "/gallery", className: "text-sm text-detail hover:text-ink", children: "Gallery" }),
          /* @__PURE__ */ jsx(Link, { to: "/categories", className: "text-sm text-detail hover:text-ink", children: "Categories" }),
          /* @__PURE__ */ jsx(Link, { to: "/artists", className: "text-sm text-detail hover:text-ink", children: "Artists" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink", children: "Gallery" }),
          /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-sm text-detail hover:text-ink", children: "About" }),
          /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-sm text-detail hover:text-ink", children: "Contact" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm text-detail hover:text-ink", children: "Press" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink", children: "Follow" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm text-detail hover:text-ink", children: "Instagram" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm text-detail hover:text-ink", children: "Are.na" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm text-detail hover:text-ink", children: "Journal" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/wallet",
              className: "mt-2 inline-flex items-center gap-1 text-sm text-clay hover:underline",
              children: "Sharjahbiennial Pay ↗"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-20 flex max-w-7xl items-center justify-between border-t border-ink/10 pt-8 text-[10px] uppercase tracking-[0.22em] text-detail/70", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " sharjahbiennial"
      ] }),
      /* @__PURE__ */ jsx("span", { children: "Privacy · Terms" })
    ] })
  ] });
}
const KEY = "sharjahbiennial.wallet.v1";
const empty = { accounts: [], currentAccountId: null, transactions: [] };
function load() {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}
function WalletProvider({ children }) {
  const [state, setState] = useState(empty);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
    }
  }, [state, hydrated]);
  return /* @__PURE__ */ jsx(Fragment, { children });
}
const TX_LABEL = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  transfer_out: "Sent",
  transfer_in: "Received",
  purchase: "Purchase",
  bid_hold: "Bid placed",
  bid_release: "Bid released",
  sale: "Sale"
};
function txSign(type) {
  return type === "deposit" || type === "transfer_in" || type === "bid_release" || type === "sale" ? 1 : -1;
}
const BASE_URL = `https://collectionapi.metmuseum.org/public/collection/v1`;
const metApi = {
  // Search artworks — returns array of object IDs
  async search(query2, options = {}) {
    const params = new URLSearchParams({ q: query2 });
    if (options.hasImages) params.set("hasImages", "true");
    if (options.isPublicDomain) params.set("isPublicDomain", "true");
    if (options.departmentId) params.set("departmentId", String(options.departmentId));
    const response = await fetch(`${BASE_URL}/search?${params}`);
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    console.log({ query: query2, params });
    return response.json();
  },
  // Fetch a single artwork by ID
  async getArtwork(id) {
    const response = await fetch(`${BASE_URL}/objects/${id}`);
    if (!response.ok) throw new Error(`Artwork ${id} not found`);
    return response.json();
  },
  // Fetch multiple artworks by IDs — skips ones with no image
  async getArtworks(ids, limit = 20) {
    const sliced = ids.slice(0, limit);
    const results = await Promise.allSettled(sliced.map((id) => metApi.getArtwork(id)));
    return results.filter(
      (r) => r.status === "fulfilled" && !!r.value.primaryImageSmall && !!r.value.primaryImage && !!r.value.artistDisplayName && !!r.value.accessionYear && !!r.value.measurements && !!r.value.artistDisplayName && !!r.value.artistDisplayBio && !!r.value.title
    ).map((r) => r.value);
  },
  // Fetch all departments
  async getDepartments() {
    const response = await fetch(`${BASE_URL}/departments`);
    if (!response.ok) throw new Error("Failed to fetch departments");
    return response.json();
  },
  // Search artworks by artist name
  async searchByArtist(artistName, options = {}) {
    const params = new URLSearchParams({
      q: artistName,
      artistOrCulture: "true"
    });
    if (options.hasImages) params.set("hasImages", "true");
    if (options.isPublicDomain) params.set("isPublicDomain", "true");
    const response = await fetch(`${BASE_URL}/search?${params}`);
    if (!response.ok) throw new Error(`Artist search failed: ${response.status}`);
    return response.json();
  },
  // Build artist profile from their artworks (only for the specific artist)
  buildArtistProfile(artworks2, total) {
    if (artworks2.length === 0) return null;
    const sourceArtwork = artworks2.find((a) => a.constituents && a.constituents.length > 0) || artworks2[0];
    const constituent = sourceArtwork?.constituents?.[0];
    const departments = [...new Set(artworks2.map((a) => a.department).filter(Boolean))];
    return {
      constituentID: constituent?.constituentID ?? 0,
      name: sourceArtwork?.artistDisplayName || "Unknown Artist",
      gender: constituent?.gender ?? "",
      wikidataURL: constituent?.constituentWikidata_URL ?? "",
      ulanURL: constituent?.constituentULAN_URL ?? "",
      nationality: sourceArtwork?.artistNationality ?? "",
      bio: sourceArtwork?.artistDisplayBio ?? "",
      beginDate: sourceArtwork?.artistBeginDate ?? "",
      endDate: sourceArtwork?.artistEndDate ?? "",
      totalWorks: total,
      departments,
      artworks: artworks2
      // only this artist's artworks
    };
  }
};
const LOCAL_STORAGE_KEY = "sharjahbiennial_met_artworks";
function loadFromLocalStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.artworks)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
function saveToLocalStorage(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
}
const MET_ARTWORK_SEARCH_TERMS = [
  "portrait",
  "landscape",
  "still life",
  "nude",
  "flowers",
  "mythology",
  "animal",
  "horse",
  "bird",
  "architecture",
  "interior",
  "cityscape",
  "seascape",
  "self portrait",
  "woman",
  "man",
  "child",
  "battle",
  "dance",
  "music",
  "religion",
  "sculpture",
  "photograph",
  "drawing",
  "print",
  "ceramic",
  "furniture",
  "egyptian",
  "greek",
  "roman",
  "chinese",
  "japanese",
  "islamic",
  "african",
  "renaissance",
  "baroque",
  "impressionist",
  "modern"
];
function getRandomCategory() {
  return MET_ARTWORK_SEARCH_TERMS[Math.floor(Math.random() * MET_ARTWORK_SEARCH_TERMS.length)];
}
function useMetArtworks(initialQuery) {
  const [currentCategory, setCurrentCategory] = React.useState(getRandomCategory());
  const persisted = React.useMemo(() => loadFromLocalStorage(), []);
  const artworksQuery = useQuery({
    queryKey: ["met", "full-search", currentCategory],
    queryFn: async () => {
      const searchRes = await metApi.search(currentCategory, {
        hasImages: true,
        isPublicDomain: true
      });
      if (!searchRes.objectIDs?.length) {
        return { artworks: [], total: 0 };
      }
      const artworks2 = await metApi.getArtworks(searchRes.objectIDs, 40);
      saveToLocalStorage({
        artworks: artworks2,
        total: searchRes.total || artworks2.length,
        timestamp: Date.now()
      });
      return {
        artworks: artworks2,
        total: searchRes.total || artworks2.length
      };
    },
    // Seed with localStorage data so something is visible on first mount
    // even before the network request finishes.
    initialData: persisted ?? void 0,
    // While a new category/search request is in flight, keep showing the previous data
    // (either from cache or from what we just loaded from localStorage).
    placeholderData: (previousData) => previousData,
    staleTime: 1e3 * 60 * 5
    // 5 minutes
  });
  const search = (queryStr) => {
    setCurrentCategory(queryStr);
  };
  const fetchRandomCategory = () => {
    const next = getRandomCategory();
    setCurrentCategory(next);
  };
  return {
    artworks: artworksQuery.data?.artworks ?? [],
    isLoading: artworksQuery.isLoading,
    error: artworksQuery.error ? artworksQuery.error.message : null,
    total: artworksQuery.data?.total ?? 0,
    search,
    fetchRandomCategory,
    currentCategory
  };
}
const BASE = "https://api.artic.edu/api/v1";
async function fetchChicagoArtworksByCategory(category, limit = 20) {
  const res = await fetch(
    `${BASE}/artworks/search?q=${encodeURIComponent(category)}&limit=${limit}&fields=id,title,artist_display,date_display,medium_display,image_id,classification_titles,thumbnail`
  );
  if (!res.ok) throw new Error("Failed to fetch Chicago artworks");
  const data = await res.json();
  return data.data ?? [];
}
async function searchChicagoArtworksByArtist(artistName, limit = 20) {
  const res = await fetch(
    `${BASE}/artworks/search?q=${encodeURIComponent(artistName)}&limit=${limit}&fields=id,title,artist_display,date_display,medium_display,image_id,classification_titles,thumbnail`
  );
  if (!res.ok) throw new Error("Failed to search Chicago artworks");
  const data = await res.json();
  return data.data ?? [];
}
async function fetchChicagoArtistByName(name) {
  const cleanName = name.split("↵")[0].trim().split(",")[0].trim();
  const res = await fetch(
    `${BASE}/artists/search?q=${encodeURIComponent(cleanName)}&limit=5&fields=id,title,alt_titles,description,birth_date,death_date,birth_place,death_place,nationality,date_display,thumbnail`
  );
  if (!res.ok) throw new Error("Failed to fetch Chicago artist");
  const data = await res.json();
  return data.data?.[0] ?? null;
}
function getChicagoImageUrl(imageId) {
  if (!imageId) return "";
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}
function subscribeToCollection(collectionName, onData, options = [], onError) {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...options);
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      onData(data);
    },
    (error) => {
      console.error(`Realtime listener error on ${collectionName}:`, error);
      onError?.(error);
      toast.error({
        title: "Realtime sync error",
        description: error.message || `Failed to sync ${collectionName}`,
        position: "top"
      });
    }
  );
}
const chicagoQueries = {
  // Artworks by category (e.g. "Painting", "Photography")
  artworksByCategory: (category, limit = 20) => queryOptions({
    queryKey: ["chicago", "artworks", category, limit],
    queryFn: () => fetchChicagoArtworksByCategory(category, limit),
    staleTime: 1e3 * 60 * 10
    // 10 minutes
  }),
  // Search artworks by artist name
  artworksByArtist: (artistName, limit = 20) => queryOptions({
    queryKey: ["chicago", "artworks", "search", artistName, limit],
    queryFn: () => searchChicagoArtworksByArtist(artistName, limit),
    staleTime: 1e3 * 60 * 10
  }),
  // Single artist profile
  artist: (name) => queryOptions({
    queryKey: ["chicago", "artist", name],
    queryFn: () => fetchChicagoArtistByName(name),
    staleTime: 1e3 * 60 * 15
    // Artists change less often
  })
};
function useChicagoArtworksByArtist(artistName, limit = 20) {
  return useQuery(chicagoQueries.artworksByArtist(artistName, limit));
}
function useChicagoArtist(name) {
  return useQuery(chicagoQueries.artist(name));
}
function shallowEqualArrays(a, b) {
  if (a === b) return true;
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i];
    if (ai === bi) continue;
    if (ai && bi && typeof ai === "object" && typeof bi === "object") {
      if (ai.id !== void 0 && bi.id !== void 0) {
        if (ai.id !== bi.id) return false;
      }
      try {
        if (JSON.stringify(ai) !== JSON.stringify(bi)) return false;
      } catch {
        return false;
      }
      continue;
    }
    if (ai !== bi) return false;
  }
  return true;
}
function useRealtimeCollection(collectionName, options = []) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const setState = useDataStore((s) => s.setState);
  const lastDataRef = useRef(null);
  const optionsKey = useMemo(() => JSON.stringify(options.map((o) => o.toString())), [options]);
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const unsubscribe = subscribeToCollection(
      collectionName,
      (incoming) => {
        const prev = lastDataRef.current;
        if (!prev || !shallowEqualArrays(prev, incoming)) {
          lastDataRef.current = incoming;
          setState({ [collectionName]: incoming });
        }
        setIsLoading(false);
      },
      options,
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [collectionName, optionsKey, setState]);
  const data = useDataStore((s) => s[collectionName] ?? []);
  return {
    data,
    isLoading,
    error
  };
}
const CHICAGO_LOCAL_STORAGE_KEY = "aetherel_chicago_artworks";
function saveChicagoToLocalStorage(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHICAGO_LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
}
const useArtInstitute = (options) => {
  const categories2 = [
    { name: "Painting" },
    { name: "Prints" },
    { name: "Photography" },
    { name: "Sculpture" },
    { name: "Drawing" }
  ];
  const defaultCategory = MET_ARTWORK_SEARCH_TERMS[Math.floor(Math.random() * categories2.length)];
  const artworksQuery = useQuery({
    ...chicagoQueries.artworksByCategory(defaultCategory, 20)
  });
  const [artistName, setArtistName] = React.useState(null);
  const artistQuery = useQuery({
    ...chicagoQueries.artist(artistName || ""),
    enabled: !!artistName
  });
  const [searchArtist, setSearchArtist] = React.useState(null);
  const searchQuery = useQuery({
    ...chicagoQueries.artworksByArtist(searchArtist || "", 20),
    enabled: !!searchArtist
  });
  React.useEffect(() => {
    const currentArtworks = searchArtist ? searchQuery.data ?? [] : artworksQuery.data ?? [];
    const currentArtist = artistQuery.data ?? null;
    if (currentArtworks.length > 0 || currentArtist) {
      saveChicagoToLocalStorage({
        artworks: currentArtworks,
        artist: currentArtist
      });
    }
  }, [artworksQuery.data, artistQuery.data, searchQuery.data, searchArtist]);
  const fetchArtistByName = (name) => setArtistName(name);
  const searchByArtist = (name) => setSearchArtist(name);
  const fetchArtworksByCategory = (category) => {
    console.log(
      "[useArtInstitute] fetchArtworksByCategory — use useChicagoArtworksByCategory directly for best results"
    );
  };
  return {
    categories: categories2,
    artworks: searchArtist ? searchQuery.data ?? [] : artworksQuery.data ?? [],
    loading: artworksQuery.isLoading || searchQuery.isLoading || artistQuery.isLoading,
    error: artworksQuery.error?.message || searchQuery.error?.message || artistQuery.error?.message || null,
    selectedArtist: artistQuery.data ?? null,
    fetchArtistByName,
    fetchArtworksByCategory,
    searchByArtist,
    getImageUrl: getChicagoImageUrl
  };
};
const art01 = "/assets/art-01-D6vOXljs.jpg";
const art02 = "/assets/art-02-CrID1b2Y.jpg";
const art03 = "/assets/art-03-ChSVcTT-.jpg";
const art04 = "/assets/art-04-B9EqAlFj.jpg";
const art05 = "/assets/art-05-CipSDjgP.jpg";
const art06 = "/assets/art-06-DmVB4Ju7.jpg";
const art07 = "/assets/art-07-tSyyWTke.jpg";
const art08 = "/assets/art-08-DqouqKvo.jpg";
const art11 = "/assets/art-11-HRNf3wUz.jpg";
const art12 = "/assets/art-12-CGehVAzI.jpg";
const getImageUrl = (imageId) => {
  if (!imageId) return "";
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
};
const orientationFrom = (w, h) => w === h ? "square" : h > w ? "portrait" : "landscape";
const changeChicagoToMod = (arr) => arr.map((ca) => ({
  image: getImageUrl(ca.image_id),
  title: ca.title,
  id: ca.id,
  name: ca.artist_display,
  width: ca.thumbnail?.width || 100,
  height: ca.thumbnail?.height || 100,
  medium: ca.medium_display,
  price: ca.id / 100
})).filter(
  (img) => !!img.image && !!img.title && !!img.id && !!img.name && !!img.width && !!img.height && img.medium !== void 0 && !!img.price
);
const changeMetArtWorkProps = (arr = []) => arr.map((a) => ({
  artist: a.artistDisplayName,
  category: a.classification?.toLowerCase(),
  title: a.title,
  country: a.country,
  medium: a.medium,
  slug: String(a.objectID),
  height: a?.measurements[0]?.elementMeasurements?.Height || 100,
  width: a?.measurements[0]?.elementMeasurements?.Width || 100,
  measurement: a.measurements,
  description: a.artistDisplayBio,
  sizeCategory: "large",
  theme: a.department,
  orientation: orientationFrom(
    a?.measurements[0]?.elementMeasurements?.Width || 100,
    a?.measurements[0]?.elementMeasurements?.Height || 100
  ),
  style: a.artistNationality,
  dominantColor: "Cool",
  highlight: a.isHighlight,
  artistSlug: a.artistDisplayName,
  categoryLabel: "",
  year: Number(a.accessionYear),
  image: a.primaryImage,
  price: 9 * a.objectID / 1e3,
  dimensions: a.dimensions || "Unknown",
  // Added dimensions
  technique: "Unknown"
  // Added technique
}));
const formatPrice = (n) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}).format(n);
const seed = [
  {
    slug: "linen-study-no-4",
    title: "Linen Study No. 4",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil and pigment on linen",
    dimensions: "160 × 120 cm",
    image: art01,
    width: 800,
    height: 1088,
    description: "An extended meditation on light moving across a linen surface — pigment built up in slow strata until the canvas becomes a quiet topography of warmth.",
    price: 9800,
    sizeCategory: "large",
    theme: "Abstract Form",
    style: "Colour Field",
    technique: "Oil",
    country: "Denmark",
    dominantColor: "Warm",
    highlight: true
  },
  {
    slug: "vessel-i",
    title: "Vessel I",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2024,
    medium: "Hand-thrown plaster",
    dimensions: "42 × 24 × 24 cm",
    image: art02,
    width: 800,
    height: 1216,
    description: "The opening work in a study of containment — a hand-thrown plaster vessel whose proportions echo the silence of an empty room.",
    price: 3200,
    sizeCategory: "medium",
    theme: "Still Life",
    style: "Minimal",
    technique: "Hand-thrown",
    country: "Belgium",
    dominantColor: "Neutral",
    highlight: false
  },
  {
    slug: "descent",
    title: "Descent",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "photography",
    categoryLabel: "Photography",
    year: 2023,
    medium: "Archival pigment print",
    dimensions: "90 × 100 cm",
    image: art03,
    width: 800,
    height: 896,
    description: "A photograph of a curved stairwell at the moment a single shaft of afternoon light folds itself against the wall.",
    price: 2400,
    sizeCategory: "medium",
    theme: "Architecture",
    style: "Documentary",
    technique: "Pigment print",
    country: "Scotland",
    dominantColor: "Monochrome",
    highlight: true
  },
  {
    slug: "tracing-breath",
    title: "Tracing Breath",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "minimalism",
    categoryLabel: "Minimalism",
    year: 2024,
    medium: "Ink on cream paper",
    dimensions: "70 × 70 cm",
    image: art04,
    width: 800,
    height: 800,
    description: "A single continuous line — drawn without lifting the pen — that records the act of looking as quietly as it can.",
    price: 1800,
    sizeCategory: "small",
    theme: "Gesture",
    style: "Minimal",
    technique: "Ink",
    country: "Portugal",
    dominantColor: "Neutral",
    highlight: false
  },
  {
    slug: "study-of-drape",
    title: "Study of Drape",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "figurative",
    categoryLabel: "Figurative",
    year: 2023,
    medium: "Charcoal on warm linen paper",
    dimensions: "100 × 70 cm",
    image: art05,
    width: 800,
    height: 1120,
    description: "A charcoal study from the artist's long-running figure series, exploring weight, cloth, and the architecture of the body's silhouette.",
    price: 2600,
    sizeCategory: "medium",
    theme: "Portrait",
    style: "Romantic",
    technique: "Charcoal",
    country: "Denmark",
    dominantColor: "Monochrome",
    highlight: false
  },
  {
    slug: "equilibrium",
    title: "Equilibrium",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "digital",
    categoryLabel: "Digital",
    year: 2024,
    medium: "Digital composition, edition of 12",
    dimensions: "Variable",
    image: art06,
    width: 800,
    height: 992,
    description: "A digital still in which a smooth stone hovers above the sea — composed entirely in shades of dawn.",
    price: 1400,
    sizeCategory: "small",
    theme: "Nature",
    style: "Surreal",
    technique: "Digital print",
    country: "Portugal",
    dominantColor: "Cool",
    highlight: true
  },
  {
    slug: "oxidized-grace",
    title: "Oxidised Grace",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Black stoneware, raw clay base",
    dimensions: "38 × 30 × 30 cm",
    image: art07,
    width: 800,
    height: 1184,
    description: "A matte black vessel resting on its own bed of raw sand — a piece that refuses the pedestal and chooses the ground instead.",
    price: 4200,
    sizeCategory: "medium",
    theme: "Still Life",
    style: "Brutalist",
    technique: "Hand-thrown",
    country: "Belgium",
    dominantColor: "Monochrome",
    highlight: true
  },
  {
    slug: "fragile-archive",
    title: "Fragile Archive",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "mixed-media",
    categoryLabel: "Mixed Media",
    year: 2023,
    medium: "Rusted iron, silk, found thread",
    dimensions: "85 × 70 cm",
    image: art08,
    width: 800,
    height: 1024,
    description: "A composition assembled from a year of small findings — silk, rust, and waxed thread arranged with the care of a botanist's catalogue.",
    price: 3600,
    sizeCategory: "medium",
    theme: "Memory",
    style: "Assemblage",
    technique: "Mixed materials",
    country: "Japan",
    dominantColor: "Earth",
    highlight: false
  },
  {
    slug: "horizon-field",
    title: "Horizon Field",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "180 × 160 cm",
    image: art09,
    width: 800,
    height: 896,
    description: "A colour-field painting in the slow tradition — bands of clay, sand and bone, layered until the horizon becomes a question rather than a line.",
    price: 12500,
    sizeCategory: "large",
    theme: "Landscape",
    style: "Colour Field",
    technique: "Oil",
    country: "Denmark",
    dominantColor: "Earth",
    highlight: true
  },
  {
    slug: "breathable-space",
    title: "Breathable Space",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "photography",
    categoryLabel: "Photography",
    year: 2024,
    medium: "Archival pigment print",
    dimensions: "100 × 140 cm",
    image: art10,
    width: 800,
    height: 1120,
    description: "A still life of sunlit linen — a study of how much room a single fabric can take up before it stops being a thing and becomes a quality of light.",
    price: 2800,
    sizeCategory: "medium",
    theme: "Still Life",
    style: "Impressionist",
    technique: "Pigment print",
    country: "Japan",
    dominantColor: "Warm",
    highlight: false
  },
  {
    slug: "monolith-i",
    title: "Monolith I",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2023,
    medium: "Polished bronze on travertine",
    dimensions: "48 × 40 × 40 cm",
    image: art11,
    width: 800,
    height: 1024,
    description: "A polished bronze sphere on a travertine plinth — a sculpture that gathers the room into its own surface and returns it, softer.",
    price: 8400,
    sizeCategory: "large",
    theme: "Abstract Form",
    style: "Minimal",
    technique: "Cast bronze",
    country: "Scotland",
    dominantColor: "Warm",
    highlight: true
  },
  {
    slug: "concentric",
    title: "Concentric",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "digital",
    categoryLabel: "Digital",
    year: 2024,
    medium: "Generative print, edition of 8",
    dimensions: "80 × 80 cm",
    image: art12,
    width: 800,
    height: 800,
    description: "A generative composition rendered in two grains of sand — a quiet meditation on the smallest possible amount of pattern.",
    price: 1600,
    sizeCategory: "small",
    theme: "Pattern",
    style: "Generative",
    technique: "Digital print",
    country: "Portugal",
    dominantColor: "Neutral",
    highlight: false
  },
  // — 12 new works (cycle imagery) —
  {
    slug: "quiet-meridian",
    title: "Quiet Meridian",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2025,
    medium: "Oil on raw linen",
    dimensions: "140 × 110 cm",
    image: art09,
    width: 800,
    height: 896,
    description: "A long, slow band of warm grey laid across raw linen — the painting equivalent of an afternoon held very still.",
    price: 7400,
    sizeCategory: "large",
    theme: "Landscape",
    style: "Colour Field",
    technique: "Oil",
    country: "Denmark",
    dominantColor: "Neutral",
    highlight: false
  },
  {
    slug: "second-vessel",
    title: "Second Vessel",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2025,
    medium: "Porcelain with iron wash",
    dimensions: "30 × 22 × 22 cm",
    image: art02,
    width: 800,
    height: 1216,
    description: "A porcelain piece whose iron wash settles in the throwing rings — a record of the hands that made it.",
    price: 2900,
    sizeCategory: "small",
    theme: "Still Life",
    style: "Minimal",
    technique: "Hand-thrown",
    country: "Belgium",
    dominantColor: "Earth",
    highlight: false
  },
  {
    slug: "north-window",
    title: "North Window",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "photography",
    categoryLabel: "Photography",
    year: 2024,
    medium: "Silver gelatin print, edition of 6",
    dimensions: "60 × 50 cm",
    image: art03,
    width: 800,
    height: 896,
    description: "Three hours of overcast January, photographed through the artist's studio window — printed darkly, then darker still.",
    price: 1900,
    sizeCategory: "small",
    theme: "Architecture",
    style: "Documentary",
    technique: "Silver gelatin",
    country: "Scotland",
    dominantColor: "Monochrome",
    highlight: false
  },
  {
    slug: "small-script",
    title: "Small Script",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "minimalism",
    categoryLabel: "Minimalism",
    year: 2025,
    medium: "Pencil on toned paper",
    dimensions: "40 × 30 cm",
    image: art04,
    width: 800,
    height: 800,
    description: "Eleven short marks made on the morning of the spring equinox — kept exactly as they were made.",
    price: 950,
    sizeCategory: "small",
    theme: "Gesture",
    style: "Minimal",
    technique: "Pencil",
    country: "Portugal",
    dominantColor: "Neutral",
    highlight: true
  },
  {
    slug: "weight-of-water",
    title: "Weight of Water",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "mixed-media",
    categoryLabel: "Mixed Media",
    year: 2025,
    medium: "Indigo-dyed silk, river stone",
    dimensions: "120 × 90 cm",
    image: art08,
    width: 800,
    height: 1024,
    description: "Indigo silk pulled taut around a single river stone — a study of how little material is required to hold a feeling.",
    price: 4100,
    sizeCategory: "medium",
    theme: "Nature",
    style: "Assemblage",
    technique: "Textile",
    country: "Japan",
    dominantColor: "Cool",
    highlight: true
  },
  {
    slug: "field-recording",
    title: "Field Recording",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "figurative",
    categoryLabel: "Figurative",
    year: 2024,
    medium: "Charcoal and pastel on paper",
    dimensions: "80 × 60 cm",
    image: art05,
    width: 800,
    height: 1120,
    description: "A figure half-turning, drawn at the speed of memory rather than the speed of life.",
    price: 2100,
    sizeCategory: "medium",
    theme: "Portrait",
    style: "Romantic",
    technique: "Charcoal",
    country: "Denmark",
    dominantColor: "Warm",
    highlight: false
  },
  {
    slug: "soft-grid",
    title: "Soft Grid",
    artistSlug: "amara-osei",
    artist: "Amara Osei",
    category: "digital",
    categoryLabel: "Digital",
    year: 2025,
    medium: "Generative composition, edition of 10",
    dimensions: "60 × 60 cm",
    image: art12,
    width: 800,
    height: 800,
    description: "A grid that has forgotten the rule of the grid — released slowly, ten copies only.",
    price: 1100,
    sizeCategory: "small",
    theme: "Pattern",
    style: "Generative",
    technique: "Digital print",
    country: "Portugal",
    dominantColor: "Cool",
    highlight: false
  },
  {
    slug: "bowl-for-an-empty-table",
    title: "Bowl for an Empty Table",
    artistSlug: "elena-vos",
    artist: "Elena Vos",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Wood-fired stoneware",
    dimensions: "18 × 32 × 32 cm",
    image: art07,
    width: 800,
    height: 1184,
    description: "A wide wood-fired bowl with a single ash mark across the lip — the kiln, signing its own work.",
    price: 1700,
    sizeCategory: "small",
    theme: "Still Life",
    style: "Wabi-sabi",
    technique: "Wood-fired",
    country: "Belgium",
    dominantColor: "Earth",
    highlight: false
  },
  {
    slug: "longform-light",
    title: "Longform Light",
    artistSlug: "sachi-tanaka",
    artist: "Sachi Tanaka",
    category: "photography",
    categoryLabel: "Photography",
    year: 2025,
    medium: "Archival pigment print, edition of 5",
    dimensions: "120 × 90 cm",
    image: art10,
    width: 800,
    height: 1120,
    description: "A six-hour exposure of an unmoving room — a photograph that confuses the difference between presence and patience.",
    price: 3400,
    sizeCategory: "large",
    theme: "Architecture",
    style: "Documentary",
    technique: "Pigment print",
    country: "Japan",
    dominantColor: "Warm",
    highlight: true
  },
  {
    slug: "second-monolith",
    title: "Second Monolith",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2024,
    medium: "Brushed steel on basalt",
    dimensions: "60 × 22 × 22 cm",
    image: art11,
    width: 800,
    height: 1024,
    description: "An upright in brushed steel, balanced on a single block of basalt — a sculpture that earns its quietness through weight.",
    price: 6800,
    sizeCategory: "large",
    theme: "Abstract Form",
    style: "Brutalist",
    technique: "Welded steel",
    country: "Scotland",
    dominantColor: "Cool",
    highlight: false
  },
  {
    slug: "evening-pigment",
    title: "Evening Pigment",
    artistSlug: "soren-kjeldsen",
    artist: "Søren Kjeldsen",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2025,
    medium: "Pigment and wax on board",
    dimensions: "60 × 50 cm",
    image: art01,
    width: 800,
    height: 1088,
    description: "Three layers of dusk-coloured pigment, sealed under wax — a small panel that holds the whole evening.",
    price: 2200,
    sizeCategory: "small",
    theme: "Landscape",
    style: "Colour Field",
    technique: "Mixed materials",
    country: "Denmark",
    dominantColor: "Warm",
    highlight: true
  },
  {
    slug: "the-small-room",
    title: "The Small Room",
    artistSlug: "marcus-thorne",
    artist: "Marcus Thorne",
    category: "photography",
    categoryLabel: "Photography",
    year: 2025,
    medium: "Archival pigment print",
    dimensions: "70 × 70 cm",
    image: art06,
    width: 800,
    height: 992,
    description: "A photograph of a corner of an unfurnished room, lit only by the door left slightly open behind the camera.",
    price: 2050,
    sizeCategory: "medium",
    theme: "Architecture",
    style: "Documentary",
    technique: "Pigment print",
    country: "Scotland",
    dominantColor: "Neutral",
    highlight: false
  }
];
const artworks = seed.map((a) => ({
  ...a,
  orientation: orientationFrom(a.width, a.height)
}));
const getArtworkBySlug = (slug, list = []) => {
  if (!slug || !Array.isArray(list) || list.length === 0) {
    return void 0;
  }
  const target = String(slug).trim().toLowerCase();
  return list.find((a) => a.slug.toLowerCase() === target);
};
const getArtworksByCategory = (slug, artworks2 = []) => artworks2.filter((a) => a.category === slug);
const uniq = (arr) => Array.from(new Set(arr)).sort();
const filterOptions = {
  size: ["small", "medium", "large"],
  orientation: ["portrait", "landscape", "square"],
  medium: uniq(artworks.map((a) => a.medium)),
  theme: uniq(artworks.map((a) => a.theme)),
  style: uniq(artworks.map((a) => a.style)),
  technique: uniq(artworks.map((a) => a.technique)),
  country: uniq(artworks.map((a) => a.country)),
  color: uniq(artworks.map((a) => a.dominantColor)),
  category: uniq(artworks.map((a) => a.category)),
  priceMin: Math.floor(Math.min(...artworks.map((a) => a.price)) / 100) * 100,
  priceMax: Math.ceil(Math.max(...artworks.map((a) => a.price)) / 100) * 100
};
const ArtworkContext = createContext(null);
function ArtWorkProvider({ children }) {
  const met = useMetArtworks();
  const chicago = useArtInstitute();
  const modMetArtwork = changeMetArtWorkProps(met.artworks);
  const modChicagoArtworks = changeChicagoToMod(chicago.artworks);
  const value = {
    artworks: modMetArtwork,
    loadingAws: met.isLoading,
    errorAws: met.error,
    chicagoArtworks: modChicagoArtworks,
    loadingCA: chicago.loading,
    errorCA: chicago.error,
    refetchMet: () => {
      window.location.reload();
    },
    refetchChicago: () => {
      window.location.reload();
    }
  };
  return /* @__PURE__ */ jsx(ArtworkContext.Provider, { value, children });
}
const useArtworkContext = () => {
  const context = useContext(ArtworkContext);
  if (!context) throw new Error("useArtworkContext must be used inside ArtWorkProvider");
  return context;
};
function useFirebaseDataHook() {
  const { user } = useAuthStore();
  const isUser = user?.role === "user";
  const txConstraints = useMemo(
    () => isUser ? [where("userID", "==", user?.userID)] : [],
    [isUser, user?.userID]
  );
  const bidsConstraints = useMemo(
    () => isUser ? [where("userID", "==", user?.userID)] : [],
    [isUser, user?.userID]
  );
  const listingsConstraints = useMemo(
    () => isUser ? [where("userID", "==", user?.userID)] : [],
    [isUser, user?.userID]
  );
  useMemo(
    () => user?.userID ? [where("userID", "==", user?.userID)] : [],
    [user?.userID]
  );
  const transactions = useRealtimeCollection("transactions", txConstraints);
  const users = useRealtimeCollection("users");
  const auctions = useRealtimeCollection("auctions");
  const bids = useRealtimeCollection("bids", bidsConstraints);
  const listings = useRealtimeCollection("listings", listingsConstraints);
  const wallets = useRealtimeCollection("wallets");
  const isLoading = transactions.isLoading || users.isLoading || auctions.isLoading || bids.isLoading || listings.isLoading || wallets.isLoading;
  return {
    transactions: transactions.data ?? [],
    users: users.data ?? [],
    auctions: auctions.data ?? [],
    bids: bids.data ?? [],
    listings: listings.data ?? [],
    wallets: wallets.data ?? [],
    // notifications are no longer provided globally to avoid snapshot loops.
    // Use useUserNotifications(userID) instead.
    notifications: [],
    isLoading,
    // Raw realtime query objects (contain error, isLoading, etc.)
    queries: {
      transactions,
      users,
      auctions,
      bids,
      listings,
      wallets
    }
  };
}
const FirebaseContext = createContext(null);
function FirebaseProvider({ children }) {
  const data = useFirebaseDataHook();
  return /* @__PURE__ */ jsx(
    FirebaseContext.Provider,
    {
      value: { ...data, notifications: data.notifications ?? [] },
      children
    }
  );
}
function useAuthListener() {
  const userUnsubRef = useRef(null);
  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (userUnsubRef.current) {
        userUnsubRef.current();
        userUnsubRef.current = null;
      }
      const { setUser, setLoading } = useAuthStore.getState();
      if (!firebaseUser) {
        setUser(null);
        setLoading(false, true);
        return;
      }
      setLoading(true, false);
      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const initialData = { id: userSnap.id, ...userSnap.data() };
          setUser(initialData);
          const unsub = onSnapshot(
            userRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const liveData = { id: docSnap.id, ...docSnap.data() };
                const { setUser: setUserLive } = useAuthStore.getState();
                setUserLive(liveData);
              }
            },
            (err) => {
              console.error("[auth] user doc onSnapshot error", err);
            }
          );
          userUnsubRef.current = unsub;
        } else {
          console.warn("[auth] No Firestore user doc for uid:", firebaseUser.uid);
          const { setUser: setUserNull } = useAuthStore.getState();
          setUserNull(null);
        }
      } catch (error) {
        console.error("[auth] Failed to fetch user document:", error);
        const { setUser: setUserErr } = useAuthStore.getState();
        setUserErr(null);
      } finally {
        const { setLoading: setLoadingDone } = useAuthStore.getState();
        setLoadingDone(false, true);
      }
    });
    return () => {
      authUnsub();
      if (userUnsubRef.current) {
        userUnsubRef.current();
        userUnsubRef.current = null;
      }
    };
  }, []);
}
function useDoc() {
  const addDocToCollection = async ({
    collections,
    document: document2
  }) => {
    try {
      const colref = collection(db, collections);
      const addDocument = await addDoc(colref, document2);
      const currentDoc = doc(colref, addDocument.id);
      await updateDoc(currentDoc, {
        id: addDocument.id,
        ...collections == "auctions" ? {
          lotNumber: addDocument.id
        } : {}
      });
      return { ...document2, id: addDocument.id };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const updateDocument = async ({
    collections,
    document: document2
  }) => {
    const colref = collection(db, collections);
    const currentDoc = doc(colref, document2.id);
    try {
      await updateDoc(currentDoc, document2);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const setDocument = async ({
    collections,
    document: document2
  }) => {
    const colref = collection(db, collections);
    const currentDoc = doc(colref, document2.id);
    try {
      await setDoc(currentDoc, { ...document2, id: document2.id });
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const deleteDocument = async ({
    collectionName,
    id,
    message
  }) => {
    const colref = collection(db, collectionName);
    const currentDoc = doc(colref, id);
    await deleteDoc(currentDoc).then(
      () => message && toast.reserved({
        title: message || "Deleted Successfullly"
      })
    ).catch(
      (err) => toast.error({
        title: err.message
      })
    );
  };
  return {
    addDocToCollection,
    updateDocument,
    deleteDocument,
    setDocument
  };
}
const now = Date.now();
const inHours = (h) => new Date(now + h * 36e5).toISOString();
const auctionCategories = [
  { slug: "all", label: "All Lots" },
  { slug: "abstract", label: "Abstract" },
  { slug: "figurative", label: "Figurative" },
  { slug: "sculpture", label: "Sculpture" },
  { slug: "photography", label: "Photography" },
  { slug: "ceramics", label: "Ceramics" },
  { slug: "mixed-media", label: "Mixed Media" },
  { slug: "digital", label: "Digital" },
  { slug: "minimalism", label: "Minimalism" }
];
const auctionLots = [
  {
    slug: "lot-001-linen-meridian",
    lotNumber: "001",
    title: "Linen Meridian",
    sellerSlug: "soren-kjeldsen",
    status: "suspended",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil and pigment on raw linen",
    dimensions: "160 × 120 cm",
    description: "A late-afternoon meditation in warm grey and bone — pigment built in twelve slow layers across raw linen, the horizon set just above the mid-line.",
    provenance: "Studio of the artist, Copenhagen. Signed verso.",
    condition: "Excellent. Edges unframed; gallery wrap.",
    images: [art01, art09, art05],
    estimateLow: 9e3,
    estimateHigh: 12e3,
    startBid: 7500,
    currentBid: 10400,
    bidCount: 17,
    reserveMet: true,
    endsAt: inHours(46)
  },
  {
    slug: "lot-002-vessel-iii",
    lotNumber: "002",
    title: "Vessel III",
    sellerSlug: "elena-vos",
    status: "suspended",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Hand-thrown porcelain, iron wash",
    dimensions: "44 × 26 × 26 cm",
    description: "The third in a continuing study of containment — porcelain thrown at the wheel, then dressed in a slow iron wash that settles in the throwing rings.",
    provenance: "Vos Studio, Antwerp. Inventory mark to base.",
    condition: "Pristine. No restoration.",
    images: [art02, art07],
    estimateLow: 2800,
    estimateHigh: 3800,
    startBid: 2200,
    currentBid: 3100,
    bidCount: 9,
    reserveMet: true,
    endsAt: inHours(14)
  },
  {
    slug: "lot-003-descent",
    lotNumber: "003",
    title: "Descent (Stair Study)",
    sellerSlug: "marcus-thorne",
    status: "suspended",
    category: "photography",
    categoryLabel: "Photography",
    year: 2023,
    medium: "Archival pigment print, edition 2 of 6",
    dimensions: "90 × 100 cm",
    description: "A photograph of a curved stairwell taken at the moment a single shaft of January light folds itself against the wall.",
    provenance: "From the Architecture of Light series. Signed and numbered.",
    condition: "Mint. Sealed in archival sleeve.",
    images: [art03, art11],
    estimateLow: 2200,
    estimateHigh: 2800,
    startBid: 1800,
    currentBid: 2050,
    bidCount: 6,
    reserveMet: false,
    endsAt: inHours(72)
  },
  {
    slug: "lot-004-tracing-breath",
    lotNumber: "004",
    title: "Tracing Breath",
    sellerSlug: "amara-osei",
    status: "suspended",
    category: "minimalism",
    categoryLabel: "Minimalism",
    year: 2024,
    medium: "Ink on cream paper",
    dimensions: "70 × 70 cm",
    description: "A single unbroken line drawn at first light — a record of looking, kept exactly as it was made.",
    provenance: "Drawn in the artist's Lisbon studio, March 2024.",
    condition: "Excellent; floated in archival mat.",
    images: [art04, art06, art12],
    estimateLow: 1600,
    estimateHigh: 2200,
    startBid: 1200,
    currentBid: 1750,
    bidCount: 11,
    reserveMet: true,
    endsAt: inHours(5)
  },
  {
    slug: "lot-005-study-of-drape",
    lotNumber: "005",
    title: "Study of Drape",
    sellerSlug: "soren-kjeldsen",
    status: "active",
    category: "figurative",
    categoryLabel: "Figurative",
    year: 2023,
    medium: "Charcoal on warm linen paper",
    dimensions: "100 × 70 cm",
    description: "A charcoal study from the artist's long-running figure series — weight, cloth, and the architecture of the silhouette.",
    provenance: "Studio of the artist, Copenhagen.",
    condition: "Very good. Light handling at upper edge.",
    images: [art05, art01],
    estimateLow: 2400,
    estimateHigh: 3200,
    startBid: 1900,
    currentBid: 2600,
    bidCount: 8,
    reserveMet: true,
    endsAt: inHours(96)
  },
  {
    slug: "lot-006-oxidised-grace",
    lotNumber: "006",
    title: "Oxidised Grace",
    sellerSlug: "elena-vos",
    status: "active",
    category: "ceramics",
    categoryLabel: "Ceramics",
    year: 2024,
    medium: "Black stoneware, raw sand base",
    dimensions: "38 × 30 × 30 cm",
    description: "A matte black vessel that refuses the pedestal and chooses the ground instead.",
    provenance: "Vos Studio, Antwerp.",
    condition: "Excellent.",
    images: [art07, art02],
    estimateLow: 3800,
    estimateHigh: 5e3,
    startBid: 3e3,
    currentBid: 4200,
    bidCount: 13,
    reserveMet: true,
    endsAt: inHours(28)
  },
  {
    slug: "lot-007-fragile-archive",
    lotNumber: "007",
    title: "Fragile Archive",
    sellerSlug: "sachi-tanaka",
    status: "pending",
    category: "mixed-media",
    categoryLabel: "Mixed Media",
    year: 2023,
    medium: "Rusted iron, indigo silk, waxed thread",
    dimensions: "85 × 70 cm",
    description: "A composition assembled from a year of small findings — silk, rust, and waxed thread arranged with the care of a botanist's catalogue.",
    provenance: "From the artist's Kyoto machiya.",
    condition: "Excellent; framed under museum glass.",
    images: [art08, art10],
    estimateLow: 3400,
    estimateHigh: 4400,
    startBid: 2800,
    currentBid: 3600,
    bidCount: 7,
    reserveMet: true,
    endsAt: inHours(60)
  },
  {
    slug: "lot-008-horizon-field",
    lotNumber: "008",
    title: "Horizon Field",
    sellerSlug: "soren-kjeldsen",
    status: "pending",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "180 × 160 cm",
    description: "A colour-field painting in the slow tradition — bands of clay, sand and bone, layered until the horizon becomes a question rather than a line.",
    provenance: "Studio of the artist, Copenhagen.",
    condition: "Pristine.",
    images: [art09, art01],
    estimateLow: 11e3,
    estimateHigh: 14e3,
    startBid: 9e3,
    currentBid: 12500,
    bidCount: 22,
    reserveMet: true,
    endsAt: inHours(120)
  },
  {
    slug: "lot-009-breathable-space",
    lotNumber: "009",
    title: "Breathable Space",
    sellerSlug: "sachi-tanaka",
    status: "pending",
    category: "photography",
    categoryLabel: "Photography",
    year: 2024,
    medium: "Archival pigment print, edition 1 of 5",
    dimensions: "100 × 140 cm",
    description: "A still life of sunlit linen — how much room a single fabric can take up before it stops being a thing and becomes a quality of light.",
    provenance: "Direct from the artist.",
    condition: "Mint.",
    images: [art10, art08],
    estimateLow: 2600,
    estimateHigh: 3400,
    startBid: 2e3,
    currentBid: 2800,
    bidCount: 5,
    reserveMet: false,
    endsAt: inHours(8)
  },
  {
    slug: "lot-010-monolith-i",
    lotNumber: "010",
    title: "Monolith I",
    sellerSlug: "marcus-thorne",
    status: "active",
    category: "sculpture",
    categoryLabel: "Sculpture",
    year: 2023,
    medium: "Polished bronze on travertine",
    dimensions: "48 × 40 × 40 cm",
    description: "A polished bronze sphere on a travertine plinth — a sculpture that gathers the room into its surface and returns it, softer.",
    provenance: "Thorne Studio, Glasgow.",
    condition: "Excellent.",
    images: [art11, art03],
    estimateLow: 7500,
    estimateHigh: 9500,
    startBid: 6e3,
    currentBid: 8400,
    bidCount: 15,
    reserveMet: true,
    endsAt: inHours(36)
  },
  {
    slug: "lot-011-concentric",
    lotNumber: "011",
    title: "Concentric",
    sellerSlug: "amara-osei",
    status: "active",
    category: "digital",
    categoryLabel: "Digital",
    year: 2024,
    medium: "Generative print, edition 3 of 8",
    dimensions: "80 × 80 cm",
    description: "A generative composition rendered in two grains of sand — the smallest possible amount of pattern.",
    provenance: "From the Concentric series.",
    condition: "Mint.",
    images: [art12, art04, art06],
    estimateLow: 1400,
    estimateHigh: 2e3,
    startBid: 1100,
    currentBid: 1600,
    bidCount: 4,
    reserveMet: true,
    endsAt: inHours(20)
  },
  {
    slug: "lot-012-evening-pigment",
    lotNumber: "012",
    title: "Evening Pigment",
    sellerSlug: "soren-kjeldsen",
    status: "active",
    category: "abstract",
    categoryLabel: "Abstract",
    year: 2025,
    medium: "Pigment and wax on board",
    dimensions: "60 × 50 cm",
    description: "Three layers of dusk-coloured pigment, sealed under wax — a small panel that holds the whole evening.",
    provenance: "Studio of the artist, Copenhagen.",
    condition: "Pristine.",
    images: [art01, art09, art05],
    estimateLow: 2e3,
    estimateHigh: 2800,
    startBid: 1600,
    currentBid: 2200,
    bidCount: 6,
    reserveMet: true,
    endsAt: inHours(54)
  }
];
const formatBid = (n) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}).format(n);
const getAuctionBySlug = (slug) => useDataStore.getState().auctions.find((l) => l.slug === slug);
const getLotsBySeller = (sellerSlug) => useDataStore.getState().auctions.filter((l) => l.sellerSlug === sellerSlug);
const getSeller = (slug) => artists.find((a) => a.slug === slug);
Math.floor(Math.min(...auctionLots.map((l) => l.currentBid)) / 100) * 100;
Math.ceil(Math.max(...auctionLots.map((l) => l.currentBid)) / 100) * 100;
const SITE_INFO = {
  name: "sharjahbiennial",
  date: (/* @__PURE__ */ new Date()).getFullYear(),
  contact: {
    email: "support@sharjahbiennial.online",
    phone: "+1 (234) 567-8901"
  }
};
const ADMIN_EMAIL = "support@sharjahbiennial.online";
const BRAND = {
  canvas: "#F9F5F0",
  surface: "#F0E9E0",
  ink: "#4D4035",
  clay: "#8C5C3D",
  accent: "#C9A37B",
  detail: "#8D7A66",
  white: "#FFFFFF"
};
function getBaseStyles() {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background-color: ${BRAND.canvas};
        font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: ${BRAND.ink};
        line-height: 1.6;
      }
      
      .email-container {
        max-width: 620px;
        margin: 40px auto;
        background: ${BRAND.white};
        border-radius: 0;
        overflow: hidden;
        border: 1px solid ${BRAND.surface};
      }
      
      .email-header {
        background: ${BRAND.ink};
        color: ${BRAND.white};
        padding: 32px 40px;
        text-align: center;
      }
      
      .email-header h1 {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 28px;
        font-weight: 400;
        margin: 0;
        letter-spacing: -0.02em;
      }
      
      .email-header p {
        margin: 8px 0 0;
        font-size: 13px;
        opacity: 0.75;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      
      .email-body {
        padding: 48px 40px;
      }
      
      .email-title {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 26px;
        font-weight: 400;
        color: ${BRAND.ink};
        margin: 0 0 12px;
        line-height: 1.2;
      }
      
      .email-subtitle {
        font-size: 15px;
        color: ${BRAND.detail};
        margin: 0 0 32px;
      }
      
      .detail-card {
        background: ${BRAND.canvas};
        border: 1px solid ${BRAND.surface};
        padding: 24px;
        margin: 24px 0;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid ${BRAND.surface};
        font-size: 14px;
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        color: ${BRAND.detail};
        font-weight: 500;
      }
      
      .detail-value {
        color: ${BRAND.ink};
        font-weight: 600;
        text-align: right;
      }
      
      .price {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 28px;
        color: ${BRAND.clay};
        font-weight: 400;
        letter-spacing: -0.01em;
      }
      
      .button {
        display: inline-block;
        background: ${BRAND.ink};
        color: ${BRAND.white} !important;
        padding: 14px 32px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.5px;
        margin-top: 16px;
        transition: all 0.2s ease;
      }
      
      .button:hover {
        background: ${BRAND.clay};
      }
      
      .button-secondary {
        background: transparent;
        color: ${BRAND.ink} !important;
        border: 1px solid ${BRAND.ink};
      }
      
      .status-badge {
        display: inline-block;
        padding: 4px 14px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        background: ${BRAND.clay};
        color: ${BRAND.white};
      }
      
      .status-active { background: #4A7043; }
      .status-pending { background: #B38B4D; }
      .status-suspended { background: #8B4B4B; }
      
      .divider {
        height: 1px;
        background: ${BRAND.surface};
        margin: 32px 0;
      }
      
      .footer {
        background: ${BRAND.canvas};
        padding: 28px 40px;
        font-size: 13px;
        color: ${BRAND.detail};
        text-align: center;
        border-top: 1px solid ${BRAND.surface};
      }
      
      .footer a {
        color: ${BRAND.clay};
        text-decoration: none;
      }
      
      .art-accent {
        display: inline-block;
        width: 24px;
        height: 1px;
        background: ${BRAND.accent};
        margin: 0 12px;
        vertical-align: middle;
      }
    </style>
  `;
}
function getAdminBaseStyles() {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background-color: #F5F3EF;
        font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #3D2F26;
        line-height: 1.6;
      }
      
      .email-container {
        max-width: 620px;
        margin: 40px auto;
        background: #FFFFFF;
        border-radius: 0;
        overflow: hidden;
        border: 2px solid #8C5C3D;
      }
      
      .email-header {
        background: #2C2520;
        color: #FFFFFF;
        padding: 20px 40px;
        text-align: center;
      }
      
      .email-header h1 {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 22px;
        font-weight: 400;
        margin: 0;
        letter-spacing: -0.02em;
      }
      
      .admin-badge {
        display: inline-block;
        background: #8C5C3D;
        color: #FFFFFF;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2px;
        padding: 4px 14px;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      
      .email-header p {
        margin: 4px 0 0;
        font-size: 12px;
        opacity: 0.7;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      
      .email-body {
        padding: 36px 40px;
      }
      
      .email-title {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 22px;
        font-weight: 400;
        color: #2C2520;
        margin: 0 0 8px;
        line-height: 1.2;
      }
      
      .email-subtitle {
        font-size: 14px;
        color: #6B5C4F;
        margin: 0 0 24px;
        font-weight: 500;
      }
      
      .detail-card {
        background: #F9F5F0;
        border: 1px solid #E8DFD4;
        padding: 20px;
        margin: 20px 0;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 9px 0;
        border-bottom: 1px solid #E8DFD4;
        font-size: 14px;
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        color: #6B5C4F;
        font-weight: 500;
      }
      
      .detail-value {
        color: #2C2520;
        font-weight: 600;
        text-align: right;
      }
      
      .price {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 24px;
        color: #8C5C3D;
        font-weight: 400;
        letter-spacing: -0.01em;
      }
      
      .button {
        display: inline-block;
        background: #2C2520;
        color: #FFFFFF !important;
        padding: 12px 28px;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.5px;
        margin-top: 12px;
      }
      
      .alert-banner {
        background: #2C2520;
        color: #FFFFFF;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .alert-banner::before {
        content: "ADMIN ALERT";
        background: #8C5C3D;
        padding: 2px 8px;
        font-size: 10px;
        letter-spacing: 1px;
      }
      
      .divider {
        height: 1px;
        background: #E8DFD4;
        margin: 24px 0;
      }
      
      .footer {
        background: #F5F3EF;
        padding: 20px 40px;
        font-size: 12px;
        color: #6B5C4F;
        text-align: center;
        border-top: 1px solid #E8DFD4;
      }
      
      .footer a {
        color: #8C5C3D;
        text-decoration: none;
      }
    </style>
  `;
}
function createEmailWrapper(content) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>sharjahbiennial</h1>
            <p>Est. ${SITE_INFO.date}</p>
          </div>
          ${content}
          <div class="footer">
            <p>
              ${SITE_INFO.name}<br>
              <a href="mailto:${SITE_INFO.contact.email}">${SITE_INFO.contact.email}</a>
              ${` • ${SITE_INFO.contact.phone}`}
            </p>
            <p style="margin-top: 12px; font-size: 11px; opacity: 0.6;">
              This email was sent from sharjahbiennial. 
              Please do not reply directly to this message.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
function createAdminEmailWrapper(content) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getAdminBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="admin-badge">ADMIN NOTIFICATION</div>
            <h1>sharjahbiennial</h1>
            <p>Internal Alert • ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
          ${content}
          <div class="footer">
            <p>
              This is an automated admin alert for <strong>support@sharjahbiennial.online</strong><br>
              <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>
            </p>
            <p style="margin-top: 10px; font-size: 11px; opacity: 0.6;">
              User-facing content should not be included in this message.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}
function formatDate(dateString) {
  if (!dateString)
    return (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function userRegistered(data) {
  const name = data.fullName || data.userName || "there";
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Welcome to sharjahbiennial</h2>
      <p class="email-subtitle">Your account has been successfully created.</p>
      
      <p style="font-size: 15px; margin-bottom: 24px;">
        Hello ${name},<br><br>
        We're delighted to have you join our community of artists, collectors, and art enthusiasts.
        Your account is currently under review and will be activated shortly.
      </p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Account Status</span>
          <span class="status-badge status-pending">PENDING</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
      </div>
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You will receive another email once your account has been approved. 
        In the meantime, feel free to explore the gallery.
      </p>
    </div>
  `);
  return {
    subject: "Welcome to sharjahbiennial",
    html
  };
}
function welcomeUser(data) {
  const name = data.fullName || data.userName || "there";
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Your Account is Now Active</h2>
      <p class="email-subtitle">Welcome to the Sharjahbiennial community.</p>
      
      <p style="font-size: 15px;">
        Hello ${name},<br><br>
        Great news — your account has been approved and is now fully active.
      </p>
      
      <div style="margin: 32px 0;">
        <a href="${typeof window !== "undefined" ? window.location.origin : ""}/gallery" class="button">
          Explore the Gallery
        </a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You can now list artwork, place bids, and participate in auctions.
      </p>
    </div>
  `);
  return {
    subject: "Your Sharjahbiennial Account is Active",
    html
  };
}
function listingSubmitted(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Artwork Submitted</h2>
      <p class="email-subtitle">A new listing is awaiting your review.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Artist</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Category</span>
          <span class="detail-value">${data.category || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Medium</span>
          <span class="detail-value">${data.medium || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Starting Price</span>
          <span class="detail-value">${data.bidAmount ? formatCurrency(data.bidAmount) : "—"}</span>
        </div>
      </div>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/admin" class="button">
        Review in Admin Panel
      </a>
    </div>
  `);
  return {
    subject: `New Listing: ${data.title}`,
    html
  };
}
function listingApproved(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Your Artwork Has Been Approved</h2>
      <p class="email-subtitle">It is now live on sharjahbiennial.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="status-badge status-active">LIVE</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        Congratulations. Your piece is now visible to collectors and art lovers.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/artworks/${data.slug}" class="button">
        View Your Listing
      </a>
    </div>
  `);
  return {
    subject: `Approved: ${data.title}`,
    html
  };
}
function listingRejected(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Listing Review Update</h2>
      <p class="email-subtitle">Your submission requires attention.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="status-badge status-suspended">NOT APPROVED</span>
        </div>
      </div>
      
      ${data.reason ? `
        <p style="font-size: 15px; margin: 24px 0;">
          <strong>Feedback from our curators:</strong><br>
          ${data.reason}
        </p>
      ` : ""}
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You may edit and resubmit your artwork from your dashboard.
      </p>
    </div>
  `);
  return {
    subject: `Update on: ${data.title}`,
    html
  };
}
function bidPlaced(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Bid Confirmation</h2>
      <p class="email-subtitle">Your bid has been successfully placed.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Your Bid</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Placed On</span>
          <span class="detail-value">${formatDate(data.placedAt)}</span>
        </div>
      </div>
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You will be notified if you are outbid or if you win the auction.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/auctions/${data.slug}" class="button">
        View Auction
      </a>
    </div>
  `);
  return {
    subject: `Bid Placed: ${data.lotTitle}`,
    html
  };
}
function outbidNotification(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">You've Been Outbid</h2>
      <p class="email-subtitle">Another collector has placed a higher bid.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Your Previous Bid</span>
          <span class="detail-value">${formatCurrency(data.previousBid || 0)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Current Highest Bid</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
      </div>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/auctions/${data.slug}" class="button">
        Place a New Bid
      </a>
    </div>
  `);
  return {
    subject: `Outbid on: ${data.lotTitle}`,
    html
  };
}
function auctionWon(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Congratulations — You Won</h2>
      <p class="email-subtitle">The auction has closed in your favor.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Final Price</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        We will contact you shortly with payment and shipping instructions.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/auctions/${data.slug}" class="button">
        View Auction Details
      </a>
    </div>
  `);
  return {
    subject: `You Won: ${data.lotTitle}`,
    html
  };
}
function auctionSoldToSeller(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Your Artwork Has Sold</h2>
      <p class="email-subtitle">Congratulations on the successful sale.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Sold For</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Buyer</span>
          <span class="detail-value">${data.winnerName || "Collector"}</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        Our team will reach out shortly regarding next steps and payout.
      </p>
    </div>
  `);
  return {
    subject: `Sold: ${data.lotTitle}`,
    html
  };
}
function accountStatusChanged(data) {
  const statusText = data.status.toUpperCase();
  const statusClass = `status-${data.status}`;
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Account Status Update</h2>
      <p class="email-subtitle">Your account status has changed.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Current Status</span>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        ${data.reason ? `
          <div class="detail-row" style="margin-top: 12px; padding-top: 16px; border-top: 1px solid ${BRAND.surface};">
            <span class="detail-label">Reason</span>
            <span class="detail-value" style="max-width: 280px; text-align: left;">${data.reason}</span>
          </div>
        ` : ""}
      </div>
      
      ${data.status === "active" ? `
        <a href="${typeof window !== "undefined" ? window.location.origin : ""}/gallery" class="button">
          Continue to Gallery
        </a>
      ` : ""}
    </div>
  `);
  return {
    subject: `Account Status: ${statusText}`,
    html
  };
}
function walletTransaction(data) {
  const isDeposit = data.type === "deposit";
  const title = isDeposit ? "Deposit Confirmed" : "Withdrawal Processed";
  const subtitle = isDeposit ? "Funds have been added to your wallet." : "Your withdrawal request has been completed.";
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">${title}</h2>
      <p class="email-subtitle">${subtitle}</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value price">${formatCurrency(data.amount, data.currency)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Transaction ID</span>
          <span class="detail-value" style="font-family: monospace; font-size: 13px;">${data.transactionId || "—"}</span>
        </div>
        ${data.balance !== void 0 ? `
          <div class="detail-row">
            <span class="detail-label">New Balance</span>
            <span class="detail-value">${formatCurrency(data.balance, data.currency)}</span>
          </div>
        ` : ""}
      </div>
    </div>
  `);
  return {
    subject: `${isDeposit ? "Deposit" : "Withdrawal"}: ${formatCurrency(data.amount, data.currency)}`,
    html
  };
}
function purchaseCompleted(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Purchase Confirmed</h2>
      <p class="email-subtitle">Thank you for your purchase.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        We will contact you shortly with shipping and collection details.
      </p>
    </div>
  `);
  return {
    subject: `Purchase Confirmed: ${data.lotTitle}`,
    html
  };
}
function contactFormSubmission(data) {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Contact Message</h2>
      <p class="email-subtitle">Received from the website contact form.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">From</span>
          <span class="detail-value">${data.name} &lt;${data.email}&gt;</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Subject</span>
          <span class="detail-value">${data.subject}</span>
        </div>
      </div>
      
      <div style="background: ${BRAND.canvas}; padding: 24px; margin: 24px 0; border-left: 3px solid ${BRAND.clay};">
        <p style="white-space: pre-line; margin: 0; font-size: 15px;">
          ${data.message}
        </p>
      </div>
    </div>
  `);
  return {
    subject: `Contact Form: ${data.subject}`,
    html
  };
}
const safe = (v, fallback = "—") => v != null && v !== "" ? String(v) : fallback;
function adminUserRegistered(data) {
  const name = safe(data.fullName || data.userName, "Unknown User");
  const email = safe(data.email || data.userEmail);
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New User Registration</h2>
      <p class="email-subtitle">A user has just created an account on the platform.</p>
      
      <div class="alert-banner">
        User action detected
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Full Name</span>
          <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email Address</span>
          <span class="detail-value">${email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Registered At</span>
          <span class="detail-value">${formatDate()}</span>
        </div>
      </div>
      
      <p style="font-size: 13px; color: #6B5C4F; margin: 16px 0 0;">
        This account is currently pending review. Check the admin dashboard to approve or reject.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/admin" class="button">
        Review New User
      </a>
    </div>
  `);
  return {
    subject: `[ADMIN] New User Registered: ${name}`,
    html
  };
}
function adminListingSubmitted(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Artwork Submission</h2>
      <p class="email-subtitle">A user has submitted a new listing for review.</p>
      
      <div class="alert-banner">
        Action: User submitted artwork
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork Title</span>
          <span class="detail-value">${safe(data.title)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted By</span>
          <span class="detail-value">${safe(data.fullName || data.userName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${safe(data.email || data.userEmail)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Category</span>
          <span class="detail-value">${safe(data.category)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Medium</span>
          <span class="detail-value">${safe(data.medium)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Starting Price</span>
          <span class="detail-value">${data.bidAmount ? formatCurrency(data.bidAmount) : "—"}</span>
        </div>
      </div>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/admin" class="button">
        Review Submission
      </a>
    </div>
  `);
  return {
    subject: `[ADMIN] New Listing Submitted: ${safe(data.title)}`,
    html
  };
}
function adminListingApproved(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Listing Approved</h2>
      <p class="email-subtitle">An admin has approved a user's artwork listing.</p>
      
      <div class="alert-banner">
        Action: Listing published
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${safe(data.title)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Owner</span>
          <span class="detail-value">${safe(data.fullName || data.userName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${safe(data.email || data.userEmail)}</span>
        </div>
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Listing Approved: ${safe(data.title)}`,
    html
  };
}
function adminListingRejected(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Listing Rejected</h2>
      <p class="email-subtitle">An admin has rejected a user's artwork submission.</p>
      
      <div class="alert-banner">
        Action: Listing rejected
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${safe(data.title)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted By</span>
          <span class="detail-value">${safe(data.fullName || data.userName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${safe(data.email || data.userEmail)}</span>
        </div>
        ${data.reason ? `
        <div class="detail-row" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid #E8DFD4;">
          <span class="detail-label">Rejection Reason</span>
          <span class="detail-value" style="text-align: left; max-width: 300px;">${safe(data.reason)}</span>
        </div>` : ""}
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Listing Rejected: ${safe(data.title)}`,
    html
  };
}
function adminBidPlaced(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Bid Placed</h2>
      <p class="email-subtitle">A user has placed a bid on an active auction.</p>
      
      <div class="alert-banner">
        Action: Bid submitted by user
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${safe(data.lotTitle)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bid Amount</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Placed By</span>
          <span class="detail-value">${safe(data.fullName || data.userName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bidder Email</span>
          <span class="detail-value">${safe(data.email || data.userEmail)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Placed At</span>
          <span class="detail-value">${formatDate(data.placedAt)}</span>
        </div>
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] New Bid: ${safe(data.lotTitle)} — ${formatCurrency(data.bidAmount)}`,
    html
  };
}
function adminOutbidNotification(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Outbid Event</h2>
      <p class="email-subtitle">A user has been outbid on an auction.</p>
      
      <div class="alert-banner">
        Action: Higher bid received
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${safe(data.lotTitle)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">New Highest Bid</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Previous Bid</span>
          <span class="detail-value">${formatCurrency(data.previousBid || 0)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Outbid User</span>
          <span class="detail-value">${safe(data.fullName || data.userName)}</span>
        </div>
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Outbid Event: ${safe(data.lotTitle)}`,
    html
  };
}
function adminAuctionWon(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Auction Closed — Winner Declared</h2>
      <p class="email-subtitle">An auction has ended and a user has won.</p>
      
      <div class="alert-banner">
        Action: Auction completed
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${safe(data.lotTitle)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Final Sale Price</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Winner</span>
          <span class="detail-value">${safe(data.winnerName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Seller</span>
          <span class="detail-value">${safe(data.sellerName)}</span>
        </div>
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Auction Won: ${safe(data.lotTitle)} — ${formatCurrency(data.finalPrice)}`,
    html
  };
}
function adminAuctionSoldToSeller(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Artwork Sold</h2>
      <p class="email-subtitle">A user's artwork has been sold via auction.</p>
      
      <div class="alert-banner">
        Action: Sale completed
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Sold For</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Buyer (Winner)</span>
          <span class="detail-value">${data.winnerName || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Seller</span>
          <span class="detail-value">${data.sellerName || data.fullName || data.userName}</span>
        </div>
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Artwork Sold: ${data.lotTitle}`,
    html
  };
}
function adminAccountStatusChanged(data) {
  const name = data.fullName || data.userName || "Unknown User";
  const statusText = data.status.toUpperCase();
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">User Account Status Changed</h2>
      <p class="email-subtitle">An admin has updated a user's account status.</p>
      
      <div class="alert-banner">
        Action: Account status update
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">User</span>
          <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">New Status</span>
          <span class="detail-value" style="font-weight: 700; text-transform: uppercase;">${statusText}</span>
        </div>
        ${data.reason ? `
        <div class="detail-row" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid #E8DFD4;">
          <span class="detail-label">Reason</span>
          <span class="detail-value" style="text-align: left; max-width: 280px;">${data.reason}</span>
        </div>` : ""}
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Account ${statusText}: ${name}`,
    html
  };
}
function adminWalletTransaction(data) {
  const isDeposit = data.type === "deposit";
  const name = data.fullName || data.userName || "Unknown User";
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">${isDeposit ? "Wallet Deposit" : "Wallet Withdrawal"} Processed</h2>
      <p class="email-subtitle">A user has ${isDeposit ? "added funds to" : "withdrawn funds from"} their wallet.</p>
      
      <div class="alert-banner">
        Action: Wallet transaction
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">User</span>
          <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value price">${formatCurrency(data.amount, data.currency)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Transaction ID</span>
          <span class="detail-value" style="font-family: monospace; font-size: 12px;">${data.transactionId || "—"}</span>
        </div>
        ${data.balance !== void 0 ? `
        <div class="detail-row">
          <span class="detail-label">New Balance</span>
          <span class="detail-value">${formatCurrency(data.balance, data.currency)}</span>
        </div>` : ""}
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] ${isDeposit ? "Deposit" : "Withdrawal"}: ${formatCurrency(data.amount, data.currency)} — ${name}`,
    html
  };
}
function adminPurchaseCompleted(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Purchase Completed</h2>
      <p class="email-subtitle">A user has completed a purchase from an auction.</p>
      
      <div class="alert-banner">
        Action: Purchase finalized
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Buyer</span>
          <span class="detail-value">${data.winnerName || data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Purchase Completed: ${data.lotTitle}`,
    html
  };
}
function adminContactFormSubmission(data) {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Contact Form Submission</h2>
      <p class="email-subtitle">A visitor has submitted a message via the contact form.</p>
      
      <div class="alert-banner">
        Action: Contact form received
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">From</span>
          <span class="detail-value">${data.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Subject</span>
          <span class="detail-value">${data.subject}</span>
        </div>
      </div>
      
      <div style="background: #F9F5F0; padding: 18px; margin: 20px 0; border-left: 3px solid #8C5C3D;">
        <p style="white-space: pre-line; margin: 0; font-size: 14px; color: #3D2F26;">
          ${data.message}
        </p>
      </div>
    </div>
  `);
  return {
    subject: `[ADMIN] Contact Form: ${data.subject}`,
    html
  };
}
function generateEmailTemplate(activity, data, recipientType = "user") {
  const isAdmin = recipientType === "admin" || activity.startsWith("admin_");
  if (isAdmin) {
    switch (activity) {
      case "user_registered":
        return adminUserRegistered(data);
      case "admin_new_listing":
      case "listing_submitted":
        return adminListingSubmitted(data);
      case "listing_approved":
        return adminListingApproved(data);
      case "listing_rejected":
        return adminListingRejected(data);
      case "bid_placed":
        return adminBidPlaced(data);
      case "outbid_notification":
        return adminOutbidNotification(data);
      case "auction_won":
      case "auction_closed":
        return adminAuctionWon(data);
      case "auction_sold_to_seller":
        return adminAuctionSoldToSeller(data);
      case "account_suspended":
      case "account_pending":
        return adminAccountStatusChanged(data);
      case "wallet_deposit":
        return adminWalletTransaction({ ...data, type: "deposit" });
      case "wallet_withdrawal":
        return adminWalletTransaction({ ...data, type: "withdrawal" });
      case "purchase_completed":
        return adminPurchaseCompleted(data);
      case "contact_form_submission":
        return adminContactFormSubmission(data);
      case "admin_new_bid":
        return adminBidPlaced(data);
      default:
        return {
          subject: `[ADMIN] Notification`,
          html: createAdminEmailWrapper(`
            <div class="email-body">
              <h2 class="email-title">Admin Alert</h2>
              <div class="detail-card">
                <pre style="font-size: 12px; white-space: pre-wrap; margin: 0;">${JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          `)
        };
    }
  }
  switch (activity) {
    case "user_registered":
      return userRegistered(data);
    case "welcome_user":
    case "account_activated":
      return welcomeUser(data);
    case "listing_submitted":
    case "admin_new_listing":
      return listingSubmitted(data);
    case "listing_approved":
      return listingApproved(data);
    case "listing_rejected":
      return listingRejected(data);
    case "bid_placed":
      return bidPlaced(data);
    case "outbid_notification":
      return outbidNotification(data);
    case "auction_won":
      return auctionWon(data);
    case "auction_sold_to_seller":
      return auctionSoldToSeller(data);
    case "auction_closed":
      return auctionWon(data);
    case "account_suspended":
    case "account_pending":
      return accountStatusChanged(data);
    case "wallet_deposit":
      return walletTransaction({ ...data, type: "deposit" });
    case "wallet_withdrawal":
      return walletTransaction({ ...data, type: "withdrawal" });
    case "purchase_completed":
      return purchaseCompleted(data);
    case "contact_form_submission":
      return contactFormSubmission(data);
    case "admin_new_bid":
      return bidPlaced(data);
    // fallback for user path
    default:
      return {
        subject: "Sharjahbiennial Notification",
        html: createEmailWrapper(`
          <div class="email-body">
            <h2 class="email-title">Notification</h2>
            <p>${JSON.stringify(data, null, 2)}</p>
          </div>
        `)
      };
  }
}
function shouldUseAdminTemplate(activity) {
  return activity.startsWith("admin_");
}
async function sendGalleryEmail(activity, options, config, recipientType = "user") {
  try {
    const isAdmin = recipientType === "admin" || shouldUseAdminTemplate(activity);
    const targetEmail = isAdmin ? ADMIN_EMAIL : options.to_email;
    const { subject, html } = generateEmailTemplate(
      activity,
      { ...options, to_email: targetEmail },
      isAdmin ? "admin" : "user"
    );
    const emailjsConfig = {
      serviceID: "service_rfbm5hs",
      templateID: "template_33bhbtr",
      publicKey: "hSB8de6Pw2-ObeMsX"
    };
    await emailjs.send(
      emailjsConfig.serviceID,
      emailjsConfig.templateID,
      {
        title: subject,
        template: html,
        email: targetEmail
      },
      emailjsConfig.publicKey
    );
    return { success: true };
  } catch (error) {
    console.error("[emailjsTemplate] Failed to send email:", error);
    return { success: false, error };
  }
}
async function sendAdminNotification(activity, data = {}) {
  return sendGalleryEmail(
    activity,
    {
      to_email: ADMIN_EMAIL,
      to_name: "Admin",
      ...data
      // include all the payload fields (fullName, email, title, amount, etc.)
    },
    void 0,
    "admin"
  );
}
async function sendUserNotification(activity, options) {
  return sendGalleryEmail(activity, options, void 0, "user");
}
function useAuctionAutoCloser() {
  const docRef = useRef(null);
  if (!docRef.current) {
    docRef.current = useDoc();
  }
  const { updateDocument, setDocument, deleteDocument, addDocToCollection } = docRef.current;
  const processingRef = useRef(/* @__PURE__ */ new Set());
  useEffect(() => {
    let cancelled = false;
    const closeExpiredAuctions = async () => {
      if (cancelled) return;
      const { auctions } = useDataStore.getState();
      const now2 = Date.now();
      for (const lot of auctions) {
        if (lot.status === "closed") continue;
        if (!lot.endsAt) continue;
        const endsAtMs = new Date(lot.endsAt).getTime();
        if (Number.isNaN(endsAtMs) || endsAtMs > now2) continue;
        if (processingRef.current.has(lot.id)) continue;
        processingRef.current.add(lot.id);
        try {
          const auctionSnap = await getDoc(doc(db, "auctions", lot.id));
          if (!auctionSnap.exists()) continue;
          const freshLot = {
            id: auctionSnap.id,
            ...auctionSnap.data()
          };
          if (freshLot.status === "closed") continue;
          if (new Date(freshLot.endsAt).getTime() > Date.now()) continue;
          const bidSnap = await getDoc(doc(db, "bids", freshLot.id));
          const winningBid = bidSnap.exists() ? { id: bidSnap.id, ...bidSnap.data() } : null;
          if (winningBid && winningBid.userID) {
            const [winnerSnap, sellerSnap] = await Promise.all([
              getDoc(doc(db, "users", winningBid.userID)),
              getDoc(doc(db, "users", freshLot.userID))
            ]);
            if (winnerSnap.exists() && sellerSnap.exists()) {
              const winner = winnerSnap.data();
              const seller = sellerSnap.data();
              const newWinnerBidBalance = Math.max(
                0,
                (winner.wallet?.bidBalance ?? 0) - winningBid.bidAmount
              );
              await updateDocument({
                collections: "users",
                document: {
                  id: winner.userID,
                  wallet: {
                    balance: winner.wallet?.balance ?? 0,
                    bidBalance: newWinnerBidBalance
                  }
                }
              });
              const newSellerBalance = (seller.wallet?.balance ?? 0) + winningBid.bidAmount;
              await updateDocument({
                collections: "users",
                document: {
                  id: seller.userID,
                  wallet: {
                    balance: newSellerBalance,
                    bidBalance: seller.wallet?.bidBalance ?? 0
                  }
                }
              });
              const listingPayload = {
                title: freshLot.title,
                userName: winner.userName,
                userID: winner.userID,
                bidAmount: winningBid.bidAmount,
                year: freshLot.year,
                category: freshLot.category,
                description: freshLot.description,
                images: freshLot.images ?? [],
                createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                dimensions: freshLot.dimensions,
                status: freshLot.status,
                // or "closed" - matching the admin close flow
                medium: freshLot.medium,
                slug: crypto.randomUUID(),
                provenance: freshLot.provenance,
                condition: freshLot.condition,
                totalBidCounts: freshLot.bidCount ?? 0,
                placedAt: winningBid.placedAt,
                timeStamp: serverTimestamp()
              };
              await addDocToCollection({
                collections: "listings",
                document: listingPayload
              });
              const winNotification = {
                userID: winner.userID,
                type: "auction_won",
                title: "Auction won!",
                message: `Congratulations! You won "${freshLot.title}" for ${formatBid(winningBid.bidAmount)}. The piece has been added to your listings.`,
                data: {
                  lotSlug: freshLot.slug,
                  lotTitle: freshLot.title,
                  auctionID: freshLot.id,
                  newBidAmount: winningBid.bidAmount
                },
                unread: true,
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              };
              await setDocument({
                collections: "notifications",
                document: {
                  ...winNotification,
                  id: `won-${freshLot.id}-${Date.now()}`
                }
              });
              const sellerNotification = {
                userID: seller.userID,
                type: "general",
                title: "Your auction has closed",
                message: `Your lot "${freshLot.title}" sold for ${formatBid(winningBid.bidAmount)} to ${winner.userName || winner.email}. Funds have been added to your balance and the piece has been transferred.`,
                data: {
                  lotSlug: freshLot.slug,
                  lotTitle: freshLot.title,
                  auctionID: freshLot.id,
                  newBidAmount: winningBid.bidAmount
                },
                unread: true,
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              };
              await setDocument({
                collections: "notifications",
                document: {
                  ...sellerNotification,
                  id: `sold-${freshLot.id}-${Date.now()}`
                }
              }).catch(() => {
              });
              try {
                await sendUserNotification("auction_won", {
                  to_email: winner.email,
                  to_name: winner.fullName,
                  lotTitle: freshLot.title,
                  slug: freshLot.slug,
                  finalPrice: winningBid.bidAmount,
                  auctionID: freshLot.id,
                  winnerName: winner.fullName
                });
                await sendUserNotification("auction_sold_to_seller", {
                  to_email: seller.email,
                  to_name: seller.fullName,
                  lotTitle: freshLot.title,
                  slug: freshLot.slug,
                  finalPrice: winningBid.bidAmount,
                  auctionID: freshLot.id,
                  winnerName: winner.fullName,
                  sellerName: seller.fullName
                });
                await sendAdminNotification("auction_won", {
                  lotTitle: freshLot.title,
                  slug: freshLot.slug,
                  finalPrice: winningBid.bidAmount,
                  auctionID: freshLot.id,
                  winnerName: winner.fullName,
                  sellerName: seller.fullName
                });
              } catch (e) {
                console.warn(
                  "[email] auto-close auction notification failed",
                  e
                );
              }
            }
            await deleteDocument({
              collectionName: "bids",
              id: winningBid.id
              // No message => no toast for automatic close
            });
          }
          await updateDocument({
            collections: "auctions",
            document: {
              id: freshLot.id,
              status: "closed"
            }
          });
        } catch (err) {
          console.error(
            "[useAuctionAutoCloser] Failed to auto-close auction",
            lot.id,
            err
          );
        } finally {
          setTimeout(() => {
            processingRef.current.delete(lot.id);
          }, 2e4);
        }
      }
    };
    const initialTimeout = setTimeout(closeExpiredAuctions, 2500);
    const interval = setInterval(closeExpiredAuctions, 2e4);
    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);
}
function WalletLoader({
  fullscreen = true,
  message = "Syncing your wallet",
  className,
  compact = false,
  showSkeleton = true,
  partial = false,
  isLoading = true
}) {
  if (!isLoading) return null;
  const isPartial = partial && !fullscreen;
  const containerClasses = cn(
    // Only add wallet-theme when we are the one providing the surface (fullscreen or partial card)
    (fullscreen || isPartial) && "wallet-theme",
    fullscreen && !isPartial ? "fixed inset-0 z-[200] flex items-center justify-center bg-[var(--w-bg)]" : isPartial ? "flex w-full items-center justify-center" : "flex w-full items-center justify-center py-12",
    className
  );
  const cardClasses = isPartial ? "w-full max-w-md rounded-3xl border border-[var(--w-border)] bg-[var(--w-surface)] p-8 shadow-2xl wallet-ring" : "";
  const inner = /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center text-center",
        compact ? "gap-3" : "gap-8",
        !isPartial && "max-w-xs px-6"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute size-20 rounded-full",
              style: { background: "var(--w-brand)", opacity: 0.08 },
              animate: {
                scale: [1, 1.35, 1],
                opacity: [0.08, 0.03, 0.08]
              },
              transition: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute size-14 rounded-full border",
              style: { borderColor: "var(--w-brand)", opacity: 0.25 },
              animate: { scale: [1, 1.15, 1], opacity: [0.25, 0.1, 0.25] },
              transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "relative grid place-items-center rounded-2xl shadow-xl",
                compact ? "size-12" : "size-16"
              ),
              style: { background: "var(--w-brand)", color: "var(--w-brand-contrast)" },
              children: /* @__PURE__ */ jsx(Wallet, { className: cn(compact ? "size-6" : "size-8"), strokeWidth: 2.5 })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] p-1",
              animate: { rotate: 360 },
              transition: { duration: 3.5, repeat: Infinity, ease: "linear" },
              children: /* @__PURE__ */ jsx(Shield, { className: "size-3 text-[var(--w-brand)]", strokeWidth: 3 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: cn(compact ? "space-y-0.5" : "space-y-1.5"), children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: cn(
                "font-semibold tracking-tight text-[var(--w-fg)]",
                compact ? "text-base" : "text-2xl"
              ),
              children: message
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--w-muted)]", children: "Securing session • EmberPay" })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "relative overflow-hidden rounded-full bg-[var(--w-surface)]",
              compact ? "h-0.5 w-36" : "h-px w-48"
            ),
            children: /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "absolute inset-y-0 left-0 bg-[var(--w-brand)]",
                animate: { x: ["-100%", "300%"] },
                transition: {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1]
                },
                style: { width: "28%" }
              }
            )
          }
        ),
        !compact && showSkeleton && /* @__PURE__ */ jsxs("div", { className: "mt-1 w-full max-w-[280px] space-y-2.5 pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] px-4 py-3.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-2.5 w-14 rounded-full bg-[var(--w-border)]/70" }),
              /* @__PURE__ */ jsx("div", { className: "h-7 w-32 rounded bg-[var(--w-border)]/60" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "size-9 rounded-xl bg-[var(--w-border)]/60" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1.5 rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] p-3.5", children: [0, 1].map((i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "size-8 rounded-xl bg-[var(--w-border)]/60" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "h-2.5 w-3/4 rounded-full bg-[var(--w-border)]/60" }),
              /* @__PURE__ */ jsx("div", { className: "h-2 w-1/3 rounded-full bg-[var(--w-border)]/50" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-3 w-14 rounded-full bg-[var(--w-border)]/60" })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 text-[10px] text-[var(--w-muted)]", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "size-3 animate-spin" }),
          /* @__PURE__ */ jsx("span", { children: "Verifying credentials" })
        ] })
      ]
    }
  );
  const body = isPartial ? /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 8, scale: 0.985 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      className: cardClasses,
      children: inner
    }
  ) : inner;
  return /* @__PURE__ */ jsx("div", { className: containerClasses, children: body });
}
function useAuth() {
  const { setUser } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setUser
    }))
  );
  const registerUser = async (user) => {
    try {
      const {
        user: { uid }
      } = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const currentUser = doc(db, "users", uid);
      const acc = {
        blocked: false,
        userID: uid,
        id: uid,
        role: "user",
        status: "pending",
        currency: "USD",
        category: "users",
        symbol: "$",
        email: user.email.trim(),
        userName: getUserName(user.email.trim()),
        fullName: user.fullName.trim(),
        password: user.password,
        token: makeToken(),
        wallet: {
          balance: 0,
          bidBalance: 0
        },
        createdAt: serverTimestamp(),
        joinedDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      setUser(acc);
      await setDoc(currentUser, acc);
      try {
        await sendUserNotification("user_registered", {
          to_email: acc.email,
          to_name: acc.fullName,
          fullName: acc.fullName,
          email: acc.email,
          status: "pending"
        });
        await sendAdminNotification("user_registered", {
          fullName: acc.fullName,
          email: acc.email,
          status: "pending"
        });
      } catch (e) {
        console.warn("[email] registration email failed", e);
      }
      return {
        ...acc
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Register failed";
      throw new Error(message);
    }
  };
  const loginUser = useCallback(
    async (email, password) => {
      try {
        const userLogin = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userRef = doc(db, "users", userLogin.user.uid);
        const currentUserDoc = await getDoc(userRef);
        if (currentUserDoc.exists()) {
          const props = {
            id: currentUserDoc.id,
            ...currentUserDoc.data()
          };
          setUser(props);
          return props;
        } else {
          setUser(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        throw new Error(message);
      }
    },
    [setUser]
  );
  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign out failed";
      throw new Error(message);
    }
  }, [setUser]);
  return {
    registerUser,
    loginUser,
    logOut
  };
}
function WalletError({
  error,
  reset,
  title = "Wallet sync failed",
  message
}) {
  const [retrying, setRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { logOut } = useAuth();
  const handleRetry = async () => {
    if (!reset) return;
    setRetrying(true);
    await new Promise((r) => setTimeout(r, 650));
    try {
      reset();
    } finally {
      setTimeout(() => setRetrying(false), 300);
    }
  };
  const handleSignOut = async () => {
    try {
      await logOut?.();
    } catch {
      window.location.href = "/wallet";
    }
  };
  const friendlyMessage = message || "We couldn't load your wallet data. This can happen after a network blip or when the session needs refreshing.";
  return /* @__PURE__ */ jsx("div", { className: "wallet-theme flex min-h-[70vh] items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20, scale: 0.985 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      className: "w-full max-w-md",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-8 shadow-2xl wallet-ring", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 wallet-dotgrid opacity-20", "aria-hidden": true }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { scale: 0.6, rotate: -8 },
                animate: { scale: 1, rotate: 0 },
                transition: { type: "spring", stiffness: 260, damping: 18 },
                className: "mb-6 grid size-20 place-items-center rounded-2xl border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)]",
                children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Wallet, { className: "size-9 text-[var(--w-brand)]", strokeWidth: 2.2 }),
                  /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { scale: 0 },
                      animate: { scale: 1 },
                      className: "absolute -right-1 -top-1 rounded-full bg-[var(--w-bg)] p-1",
                      children: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 text-[var(--w-brand)]", strokeWidth: 3 })
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold tracking-tight text-[var(--w-fg)]", children: title }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-[28ch] text-[15px] leading-relaxed text-[var(--w-muted)]", children: friendlyMessage }),
            error && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowDetails((v) => !v),
                className: "mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--w-muted)] hover:text-[var(--w-fg)] transition",
                children: [
                  showDetails ? "Hide" : "Show",
                  " technical details"
                ]
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { children: showDetails && error && /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                className: "mt-3 w-full overflow-hidden",
                children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[var(--w-border)] bg-[var(--w-bg-2)] p-3 text-left", children: /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-[var(--w-muted)] break-words", children: error.message || String(error) }) })
              }
            ) }),
            reset && /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { y: -1 },
                whileTap: { scale: 0.985 },
                onClick: handleRetry,
                disabled: retrying,
                className: "mt-8 flex w-full items-center justify-center gap-2 rounded-[1.4rem] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] shadow-xl transition disabled:opacity-70",
                style: {
                  background: "var(--w-brand)",
                  color: "var(--w-brand-contrast)"
                },
                children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: retrying ? /* @__PURE__ */ jsxs(
                  motion.span,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: "inline-flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { className: "size-4 animate-spin" }),
                      "RETRYING..."
                    ]
                  },
                  "retrying"
                ) : /* @__PURE__ */ jsxs(
                  motion.span,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: "inline-flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }),
                      "TRY AGAIN"
                    ]
                  },
                  "idle"
                ) })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex w-full flex-col gap-2.5 sm:flex-row", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/wallet",
                  className: "flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-4 py-3 text-sm font-semibold text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/40",
                  children: [
                    /* @__PURE__ */ jsx(Home, { className: "size-4" }),
                    "Back to wallet"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleSignOut,
                  className: "flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-surface)] px-4 py-3 text-sm font-semibold text-[var(--w-muted)] transition hover:bg-[var(--w-bg-2)] hover:text-[var(--w-fg)]",
                  children: [
                    /* @__PURE__ */ jsx(LogOut, { className: "size-4" }),
                    "Sign out"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--w-muted)]/70", children: "EmberPay • Secure by default" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-[11px] text-[var(--w-muted)]", children: "If this keeps happening, try refreshing the page or contact support." })
      ]
    }
  ) });
}
const selectAuthLoading = (s) => s.loading;
const selectAuthHydrated = (s) => s.isAuthHydrated;
const selectUser = (s) => s.user;
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen flex-col", children: /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center px-6 py-32", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.3em] text-detail", children: "404" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-6 font-display text-6xl italic text-ink", children: "Lost in the gallery" }),
    /* @__PURE__ */ jsx("p", { className: "mt-6 text-detail", children: "The page you're looking for doesn't exist, or has been moved to another wall." }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "mt-10 inline-block border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas",
        children: "Return home"
      }
    )
  ] }) }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWallet = pathname === "/wallet" || pathname.startsWith("/wallet/");
  if (isWallet) {
    return /* @__PURE__ */ jsx(WalletError, { error, reset });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl italic text-ink", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-detail", children: "Something went wrong on our end." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "border border-ink bg-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "border border-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em]",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$y = createRootRouteWithContext()(
  {
    // This runs on EVERY navigation.
    // If the user is an admin, they are ONLY allowed to be on /admin routes.
    // beforeLoad: enforceAdminOnly,
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          title: "Sharjahbiennial — A Curated Exhibition of Contemporary Artworks"
        },
        {
          name: "description",
          content: "A curated digital exhibition of paintings, sculpture, photography and digital works from a small circle of contemporary artists."
        },
        { name: "author", content: "sharjahbiennial" },
        {
          property: "og:title",
          content: "Sharjahbiennial — A Curated Exhibition"
        },
        {
          property: "og:description",
          content: "Quiet, considered works from a small circle of contemporary artists."
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" }
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap"
        }
      ]
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent
  }
);
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$y.useRouteContext();
  const { pathname, routeKey } = useRouterState({
    select: (s) => {
      const p = s.location.pathname;
      return {
        pathname: p,
        routeKey: `${p}${s.location.searchStr ?? ""}`
      };
    }
  });
  const isWallet = pathname === "/wallet" || pathname.startsWith("/wallet/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  useAuthListener();
  useAuctionAutoCloser();
  const loading = useAuthStore(selectAuthLoading, Object.is);
  const isAuthHydrated = useAuthStore(selectAuthHydrated, Object.is);
  useAuthStore(selectUser, Object.is);
  const showWalletLoader = isWallet && (loading || !isAuthHydrated);
  useRouter();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(StoreProvider, { children: /* @__PURE__ */ jsx(FirebaseProvider, { children: /* @__PURE__ */ jsx(WalletProvider, { children: /* @__PURE__ */ jsx(ToastProvider, { children: isAdmin ? /* @__PURE__ */ jsx("div", { className: "admin-theme min-h-screen", children: /* @__PURE__ */ jsx(Outlet, {}) }) : isWallet ? /* @__PURE__ */ jsx("div", { className: "wallet-theme flex min-h-screen flex-col", children: showWalletLoader ? /* @__PURE__ */ jsx(
      WalletLoader,
      {
        fullscreen: true,
        message: "Loading your wallet",
        showSkeleton: true
      }
    ) : /* @__PURE__ */ jsx(Outlet, {}) }) : /* @__PURE__ */ jsx(ArtWorkProvider, { children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-canvas", children: [
      /* @__PURE__ */ jsx(MegaNav, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1]
          },
          children: /* @__PURE__ */ jsx(Outlet, {})
        },
        routeKey
      ) }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] }) }) }) }) }) }),
    /* @__PURE__ */ jsx(ReactQueryDevtools, { initialIsOpen: false })
  ] });
}
const requireAuth = async () => {
  try {
    const user = await useAuthStore.getState().user;
    if (user && user.createdAt instanceof Timestamp) {
      user.createdAt = user.createdAt.toDate().toISOString();
    }
    return { user };
  } catch {
    throw redirect({ to: "/connect" });
  }
};
const $$splitComponentImporter$w = () => import("./wallet-iQ0Gv1CP.js");
const Route$x = createFileRoute("/wallet")({
  component: lazyRouteComponent($$splitComponentImporter$w, "component"),
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{
      title: "EmberPay — Sharjahbiennial Wallet"
    }]
  })
});
const $$splitComponentImporter$v = () => import("./sell-CmUDBAb2.js");
const Route$w = createFileRoute("/sell")({
  component: lazyRouteComponent($$splitComponentImporter$v, "component"),
  head: () => ({
    meta: [{
      title: "Sell your work — sharjahbiennial"
    }]
  }),
  validateSearch: (search) => ({
    fromListing: typeof search.fromListing === "string" ? search.fromListing : void 0
  })
});
({
  year: (/* @__PURE__ */ new Date()).getFullYear()
});
const $$splitComponentImporter$u = () => import("./profile-DYXietZq.js");
const Route$v = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$u, "component"),
  head: () => ({
    meta: [{
      title: "Profile — sharjahbiennial"
    }]
  })
});
const $$splitComponentImporter$t = () => import("./notifications-DzhyahbL.js");
const Route$u = createFileRoute("/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./listings-B5qwx6Bo.js");
const Route$t = createFileRoute("/listings")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component"),
  head: () => ({
    meta: [{
      title: "My Listings — sharjahbiennial"
    }, {
      name: "description",
      content: "Auction works you have successfully won. Your acquired collection."
    }]
  })
});
const $$splitComponentImporter$r = () => import("./generate-BIlNQ87q.js");
const Route$s = createFileRoute("/generate")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./gallery--l2szscd.js");
const Route$r = createFileRoute("/gallery")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component"),
  head: () => ({
    meta: [{
      title: "Gallery — sharjahbiennial"
    }, {
      name: "description",
      content: "Browse the full exhibition with refined filters across price, size, medium, theme, technique, country and colour."
    }]
  })
});
const $$splitComponentImporter$p = () => import("./favourites-DxPi0XMY.js");
const Route$q = createFileRoute("/favourites")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component"),
  head: () => ({
    meta: [{
      title: "Favourites — sharjahbiennial"
    }]
  })
});
const $$splitComponentImporter$o = () => import("./contact-rRB1KHbq.js");
const Route$p = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component"),
  head: () => ({
    meta: [{
      title: "Contact — sharjahbiennial"
    }, {
      name: "description",
      content: "Contact the gallery for inquiries about artworks, artists, private viewings or acquisitions."
    }]
  })
});
const $$splitComponentImporter$n = () => import("./connect-De0PzTWF.js");
const Route$o = createFileRoute("/connect")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component"),
  head: () => ({
    meta: [{
      title: "Connect Wallet — sharjahbiennial"
    }]
  })
});
const $$splitComponentImporter$m = () => import("./cart-Y7WczkG-.js");
const Route$n = createFileRoute("/cart")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component"),
  head: () => ({
    meta: [{
      title: "Cart — sharjahbiennial"
    }]
  })
});
const $$splitComponentImporter$l = () => import("./bids-CvDviyNz.js");
const Route$m = createFileRoute("/bids")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component"),
  head: () => ({
    meta: [{
      title: "My Bids — sharjahbiennial"
    }]
  })
});
const $$splitComponentImporter$k = () => import("./admin-BT7QmKgg.js");
const Route$l = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component"),
  head: () => ({
    meta: [{
      title: "Console — Sharjahbiennial Admin"
    }, {
      name: "description",
      content: "Operational control center for the Sharjahbiennial exhibition and wallet."
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  })
});
const $$splitComponentImporter$j = () => import("./about-9h3i88Vy.js");
const Route$k = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component"),
  head: () => ({
    meta: [{
      title: "About — sharjahbiennial"
    }, {
      name: "description",
      content: "Sharjahbiennial is a quiet digital gallery dedicated to slow, considered work from a small circle of contemporary artists."
    }]
  })
});
const $$splitComponentImporter$i = () => import("./index-BhpKbjqJ.js");
const Route$j = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component"),
  head: () => ({
    meta: [{
      title: "Sharjahbiennial — A Curated Exhibition of Contemporary Artworks"
    }, {
      name: "description",
      content: "Quiet, considered works from a small circle of contemporary artists. Browse the current exhibition by category, artist or medium."
    }]
  })
});
const $$splitComponentImporter$h = () => import("./categories.index-BskJm3xU.js");
const Route$i = createFileRoute("/categories/")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component"),
  head: () => ({
    meta: [{
      title: "Categories — sharjahbiennial"
    }, {
      name: "description",
      content: "Eight modes of design: abstract, figurative, minimalism, sculpture, photography, digital, mixed media and ceramics."
    }]
  })
});
const $$splitComponentImporter$g = () => import("./auctions.index-BvTnlo7-.js");
const Route$h = createFileRoute("/auctions/")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component"),
  head: () => ({
    meta: [{
      title: "Live Auction — sharjahbiennial"
    }, {
      name: "description",
      content: "Bid on a curated selection of contemporary artworks across painting, sculpture, photography and ceramics. Live lots, timed closings."
    }]
  })
});
const $$splitComponentImporter$f = () => import("./artists.index-BH-Qj4rj.js");
const Route$g = createFileRoute("/artists/")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component"),
  head: () => ({
    meta: [{
      title: "Artists — sharjahbiennial"
    }, {
      name: "description",
      content: "The five artists in the current exhibition — ceramicists, sculptors, photographers and digital practitioners."
    }]
  })
});
const $$splitComponentImporter$e = () => import("./admin.index-S5Rhl-an.js");
const Route$f = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./wallet.withdraw-CnpdfA75.js");
const Route$e = createFileRoute("/wallet/withdraw")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
  head: () => ({
    meta: [{
      title: "Withdraw — EmberPay"
    }]
  })
});
const $$splitComponentImporter$c = () => import("./wallet.send-ppJYYT-3.js");
const Route$d = createFileRoute("/wallet/send")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  head: () => ({
    meta: [{
      title: "Send — EmberPay"
    }]
  })
});
const $$splitComponentImporter$b = () => import("./wallet.security-_HFbFU9o.js");
const Route$c = createFileRoute("/wallet/security")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  head: () => ({
    meta: [{
      title: "Security — EmberPay"
    }]
  })
});
const $$splitComponentImporter$a = () => import("./wallet.deposit-ddVFLhVB.js");
const Route$b = createFileRoute("/wallet/deposit")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
  head: () => ({
    meta: [{
      title: "Deposit — EmberPay"
    }]
  })
});
function Err({
  msg
}) {
  return /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake", children: msg });
}
const $$splitComponentImporter$9 = () => import("./wallet.activity-CcttEAX5.js");
const Route$a = createFileRoute("/wallet/activity")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  head: () => ({
    meta: [{
      title: "Activity — EmberPay"
    }]
  })
});
const $$splitComponentImporter$8 = () => import("./categories._slug-Babc2F8E.js");
const Route$9 = createFileRoute("/categories/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  loader: ({
    params
  }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return {
      category
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.category.label ?? "Category"} — sharjahbiennial`
    }, {
      name: "description",
      content: loaderData?.category.description ?? "Browse this mode of design within the current exhibition."
    }]
  })
});
const $$splitComponentImporter$7 = () => import("./auctions.mine-CfV62xAW.js");
const Route$8 = createFileRoute("/auctions/mine")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
  head: () => ({
    meta: [{
      title: "My Auctions — sharjahbiennial"
    }, {
      name: "description",
      content: "View and manage all auction lots you've consigned."
    }]
  })
});
const $$splitComponentImporter$6 = () => import("./auctions._slug-jsNiqJfR.js");
const Route$7 = createFileRoute("/auctions/$slug")({
  // loader: ({ params }) => {
  //   const lot = getAuctionBySlug(params.slug);
  //   if (!lot) throw notFound();
  //   return { lot };
  // },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
  // head: ({ loaderData }) => ({
  //   meta: [
  //     {
  //       title: loaderData
  //         ? `Lot ${loaderData.lot.lotNumber} · ${loaderData.lot.title} — Sharjahbiennial Auction`
  //         : "Auction lot — sharjahbiennial",
  //     },
  //     { name: "description", content: loaderData?.lot.description ?? "" },
  //   ],
  // }),
});
const $$splitComponentImporter$5 = () => import("./artworks._slug-DFklZKCY.js");
const Route$6 = createFileRoute("/artworks/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
  // loader: ({ params }) => {
  //   if (!artwork) throw notFound();
  //   return { artwork };
  // },
  // head: ({ loaderData }) => ({
  //   meta: [
  //     {
  //       title: loaderData
  //         ? `${loaderData.artwork.title} — ${loaderData.artwork.artist} — sharjahbiennial`
  //         : "Artwork — sharjahbiennial",
  //     },
  //     {
  //       name: "description",
  //       content: loaderData?.artwork.description ?? "",
  //     },
  //   ],
  // }),
});
const $$splitComponentImporter$4 = () => import("./artists._slug-D27FVvtA.js");
const Route$5 = createFileRoute("/artists/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
  // loader: ({ params }) => {
  //   const artist = getArtist(params.slug);
  //   if (!artist) throw notFound();
  //   return { artist };
  // },
  // head: ({ loaderData }) => ({
  //   meta: [
  //     { title: `${loaderData?.artist.name ?? "Artist"} — sharjahbiennial` },
  //     { name: "description", content: loaderData?.artist.short ?? "" },
  //   ],
  // }),
});
const $$splitComponentImporter$3 = () => import("./admin.wallet-rEwKr_vu.js");
const Route$4 = createFileRoute("/admin/wallet")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function BentoCard({
  title,
  eyebrow,
  action,
  children,
  className = "",
  delay = 0
}) {
  return /* @__PURE__ */ jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay, ease: "easeOut" },
      className: `a-card-elev flex flex-col p-5 ${className}`,
      children: [
        (title || action || eyebrow) && /* @__PURE__ */ jsxs("header", { className: "mb-4 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            eyebrow && /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-1", children: eyebrow }),
            title && /* @__PURE__ */ jsx("h3", { className: "truncate text-sm font-bold text-[var(--a-fg)]", children: title })
          ] }),
          action
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0", children })
      ]
    }
  );
}
function KpiTile({
  label,
  value,
  delta,
  format = "currency",
  delay = 0
}) {
  const positive = delta >= 0;
  const formatted = format === "currency" ? new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value) : new Intl.NumberFormat("en-US").format(value);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay, ease: "easeOut" },
      className: "a-card-elev relative overflow-hidden p-5",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: label }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${positive ? "bg-[var(--a-pos)]/15 text-[var(--a-pos)]" : "bg-[var(--a-neg)]/15 text-[var(--a-neg)]"}`,
              children: positive ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "size-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-display mt-3 text-3xl font-extrabold tracking-tight text-[var(--a-fg)]", children: formatted }),
        /* @__PURE__ */ jsx(Sparkline, { positive })
      ]
    }
  );
}
function Sparkline({ positive }) {
  const pts = positive ? "0,28 10,24 22,26 34,18 48,20 60,12 72,16 86,8 100,11" : "0,10 10,16 22,14 34,20 48,18 60,24 72,22 86,28 100,26";
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 100 32", className: "mt-4 h-9 w-full", preserveAspectRatio: "none", children: /* @__PURE__ */ jsx(
    "polyline",
    {
      fill: "none",
      stroke: positive ? "var(--a-accent)" : "var(--a-neg)",
      strokeWidth: "1.6",
      strokeLinejoin: "round",
      strokeLinecap: "round",
      points: pts
    }
  ) });
}
const STATUS_STYLES = {
  active: "bg-[var(--a-pos)]/15 text-[var(--a-pos)]",
  Approved: "bg-[var(--a-pos)]/15 text-[var(--a-pos)]",
  completed: "bg-[var(--a-pos)]/15 text-[var(--a-pos)]",
  pending: "bg-[var(--a-warn)]/18 text-[var(--a-warn)]",
  Pending: "bg-[var(--a-warn)]/18 text-[var(--a-warn)]",
  review: "bg-[var(--a-info)]/18 text-[var(--a-info)]",
  suspended: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]",
  failed: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]",
  Failed: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]",
  leading: "bg-[var(--a-warn)]/18 text-[var(--a-warn)]",
  "On Hold": "bg-[var(--a-warn)]/18 text-[var(--a-warn)]",
  won: "bg-[var(--a-pos)]/15 text-[var(--a-pos)]",
  outbid: "bg-[var(--a-info)]/18 text-[var(--a-info)]",
  lost: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]"
};
function StatusChip({ value }) {
  const cls = STATUS_STYLES[value] || "bg-[var(--a-surface-2)] text-[var(--a-muted)]";
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-current" }),
        value
      ]
    }
  );
}
function SectionHeader({
  title,
  description,
  action
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-end justify-between gap-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { className: "a-eyebrow", children: [
        "Admin · ",
        title
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--a-fg)]", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-xl text-sm text-[var(--a-muted)]", children: description })
    ] }),
    action
  ] });
}
function DataTable({
  columns,
  rows,
  empty: empty2 = "No records.",
  onRowClick,
  getRowLink
}) {
  function handleRowKeyDown(event, row) {
    if (event.target instanceof HTMLElement) {
      const interactive = event.target.closest("a,button,input,select,textarea,[role='button']");
      if (interactive) return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick?.(row);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-md border border-[var(--a-border)]", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto a-scrollbar", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[640px] border-collapse text-sm", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-[var(--a-bg-2)] text-[var(--a-muted)]", children: columns.map((c) => /* @__PURE__ */ jsx(
      "th",
      {
        className: `border-b border-[var(--a-border)] px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider ${c.className ?? ""}`,
        children: c.header
      },
      c.key
    )) }) }),
    /* @__PURE__ */ jsx("tbody", { children: rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
      "td",
      {
        colSpan: columns.length,
        className: "px-4 py-10 text-center text-sm text-[var(--a-muted)]",
        children: empty2
      }
    ) }) : rows.map((row, i) => /* @__PURE__ */ jsx(
      "tr",
      {
        onClick: onRowClick ? () => onRowClick(row) : void 0,
        onKeyDown: onRowClick ? (event) => handleRowKeyDown(event, row) : void 0,
        tabIndex: onRowClick ? 0 : void 0,
        className: `transition hover:bg-[var(--a-surface-2)]/70 ${onRowClick ? "a-row-link" : ""} ${i % 2 === 0 ? "bg-[var(--a-surface)]/40" : "bg-transparent"}`,
        children: columns.map((c) => {
          const rowLink = getRowLink?.(row);
          const shouldWrapWithLink = Boolean(rowLink) && c.rowLink !== false;
          return /* @__PURE__ */ jsx(
            "td",
            {
              className: `border-b border-[var(--a-border)]/60 px-4 py-3 align-middle ${c.className ?? ""}`,
              children: shouldWrapWithLink && rowLink ? /* @__PURE__ */ jsx(
                Link,
                {
                  to: rowLink.to,
                  params: rowLink.params,
                  className: "group/table-row-link -m-4 block rounded-sm p-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--a-accent)]",
                  children: c.render(row)
                }
              ) : c.render(row)
            },
            c.key
          );
        })
      },
      row.id
    )) })
  ] }) }) });
}
function TabBar({
  tabs,
  active,
  onChange
}) {
  return /* @__PURE__ */ jsx("div", { className: "mb-5 inline-flex flex-wrap rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-1", children: tabs.map((t) => {
    const isActive = t.id === active;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onChange(t.id),
        className: `relative rounded-[6px] px-3 py-1.5 text-xs font-semibold transition ${isActive ? "bg-[var(--a-accent)] text-[var(--a-accent-ink)]" : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"}`,
        children: [
          t.label,
          typeof t.count === "number" && /* @__PURE__ */ jsx(
            "span",
            {
              className: `ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] ${isActive ? "bg-[var(--a-accent-ink)]/15 text-[var(--a-accent-ink)]" : "bg-[var(--a-bg-2)] text-[var(--a-muted)]"}`,
              children: t.count
            }
          )
        ]
      },
      t.id
    );
  }) });
}
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
function RecordSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  eyebrow,
  record,
  fields,
  operations,
  extra,
  onSave
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  useEffect(() => {
    if (open) {
      setEditing(false);
      setDraft({});
    }
  }, [open, record?.id]);
  if (!record) return null;
  function update(key, value) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  function getValue(key) {
    if (key in draft) return draft[key];
    return getByPath(record, key);
  }
  function handleSave() {
    if (onSave && Object.keys(draft).length > 0) {
      const patch = buildPatch(draft);
      onSave(patch);
    }
    setEditing(false);
    setDraft({});
  }
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { open, onOpenChange, children: /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { forceMount: true, children: [
    /* @__PURE__ */ jsx(DialogPrimitive.Overlay, { asChild: true, forceMount: true, children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      }
    ) }),
    /* @__PURE__ */ jsx(DialogPrimitive.Content, { asChild: true, forceMount: true, "aria-describedby": void 0, children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 24 },
        transition: { duration: 0.2, ease: "easeOut" },
        className: "admin-theme fixed inset-0 z-50 flex flex-col bg-[#0f0f10] text-[var(--a-fg)] md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[min(960px,94vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:border-[var(--a-border-hi)] md:shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs(DialogPrimitive.Description, { className: "sr-only", children: [
            title,
            " details panel"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-[var(--a-border)] px-5 py-4 md:px-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              eyebrow && /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: eyebrow }),
              /* @__PURE__ */ jsx(DialogPrimitive.Title, { className: "font-display mt-0.5 truncate text-xl font-extrabold tracking-tight md:text-2xl", children: title }),
              subtitle && /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-xs text-[var(--a-muted)]", children: subtitle })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              onSave && !editing && /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setEditing(true),
                  className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]",
                  children: [
                    /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }),
                    " Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                DialogPrimitive.Close,
                {
                  className: "grid size-8 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-fg)]",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx(X, { className: "size-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto a-scrollbar px-5 py-5 md:px-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-3", children: [
              /* @__PURE__ */ jsx("div", { className: extra ? "md:col-span-2" : "md:col-span-3", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: fields.map((f) => {
                const value = getValue(f.key);
                const isEditing = editing && f.editable !== false && f.kind !== "readonly";
                return /* @__PURE__ */ jsxs("div", { className: f.span === 2 ? "sm:col-span-2" : void 0, children: [
                  /* @__PURE__ */ jsx("label", { className: "a-eyebrow mb-1.5 block", children: f.label }),
                  isEditing ? /* @__PURE__ */ jsx(
                    EditField,
                    {
                      kind: f.kind ?? "text",
                      value,
                      options: f.options,
                      onChange: (v) => update(f.key, v)
                    }
                  ) : /* @__PURE__ */ jsx(ViewField, { field: f, value, row: record }),
                  f.hint && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-[var(--a-faint)]", children: f.hint })
                ] }, f.key);
              }) }) }),
              extra && /* @__PURE__ */ jsx("aside", { className: "md:col-span-1", children: /* @__PURE__ */ jsx("div", { className: "rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-4", children: extra }) })
            ] }),
            operations && operations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
              /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-2", children: "Operations" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: operations.map((op) => {
                const Icon = op.icon;
                const tone = op.tone === "danger" ? "border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 text-[var(--a-neg)] hover:bg-[var(--a-neg)]/20" : op.tone === "success" ? "border-[var(--a-pos)]/30 bg-[var(--a-pos)]/10 text-[var(--a-pos)] hover:bg-[var(--a-pos)]/20" : op.tone === "primary" ? "border-transparent bg-[var(--a-accent)] text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]" : "border-[var(--a-border)] bg-[var(--a-surface)] text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]";
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => {
                      if (op.confirm && !confirm(op.confirm)) return;
                      op.onRun();
                    },
                    className: `inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition ${tone}`,
                    children: [
                      Icon && /* @__PURE__ */ jsx(Icon, { className: "size-3.5" }),
                      " ",
                      op.label
                    ]
                  },
                  op.id
                );
              }) })
            ] })
          ] }),
          editing && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 border-t border-[var(--a-border)] bg-[var(--a-bg-2)] px-5 py-3 md:px-6", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setEditing(false);
                  setDraft({});
                },
                className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]",
                children: [
                  /* @__PURE__ */ jsx(RotateCcw, { className: "size-3.5" }),
                  " Cancel"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleSave,
                className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "size-3.5" }),
                  " Save changes"
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] }) }) });
}
function ViewField({ field, value, row }) {
  if (field.render) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2 text-sm text-[var(--a-fg)]", children: field.render(value, row) });
  }
  const display = value === null || value === void 0 || value === "" ? "—" : field.kind === "money" && typeof value === "number" ? new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value) : String(value);
  return /* @__PURE__ */ jsx("div", { className: "break-words rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2 text-sm text-[var(--a-fg)]", children: display });
}
function EditField({
  kind,
  value,
  options,
  onChange
}) {
  const cls = "w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-base text-[var(--a-fg)] outline-none focus:border-[var(--a-border-hi)]";
  if (kind === "textarea") {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: `${cls} min-h-[88px]`,
        value: value ?? "",
        onChange: (e) => onChange(e.target.value)
      }
    );
  }
  if (kind === "select" && options) {
    return /* @__PURE__ */ jsxs(Select, { onValueChange: (e) => onChange(e), value: value ?? "", children: [
      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
      /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: options.map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o.value, children: o.label }, o.value)) }) })
    ] });
  }
  return /* @__PURE__ */ jsx(
    "input",
    {
      type: kind === "number" || kind === "money" ? "number" : "text",
      className: cls,
      value: value ?? "",
      onChange: (e) => onChange(
        kind === "number" || kind === "money" ? e.target.value === "" ? 0 : Number(e.target.value) : e.target.value
      )
    }
  );
}
function getByPath(obj, path) {
  if (!obj || !path) return void 0;
  return path.split(".").reduce((acc, k) => acc != null ? acc[k] : void 0, obj);
}
function setByPath(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((acc, k) => {
    if (acc[k] == null || typeof acc[k] !== "object") acc[k] = {};
    return acc[k];
  }, obj);
  target[last] = value;
  return obj;
}
function buildPatch(draft) {
  const result = {};
  for (const [k, v] of Object.entries(draft)) {
    if (k.includes(".")) {
      setByPath(result, k, v);
    } else {
      result[k] = v;
    }
  }
  return result;
}
const seedNames = [
  "Iris Okafor",
  "Mateo Alvarez",
  "Yuki Tanaka",
  "Aisha Bello",
  "Lukas Berg",
  "Noor Haddad",
  "Priya Menon",
  "Diego Costa",
  "Hana Kim",
  "Marcus Reed",
  "Salome Ndlovu",
  "Theo Laurent",
  "Wren Petrova",
  "Junior Adeyemi",
  "Carla Moreno",
  "Sven Holm",
  "Lila Rashid",
  "Onyeka Eze",
  "Aria Volkov",
  "Idris Bah"
];
const EPOCH = Date.UTC(2026, 4, 30, 12, 0, 0);
function isoDaysAgo(d) {
  return new Date(EPOCH - d * 864e5).toISOString();
}
const adminUsers = seedNames.map((name, i) => {
  const role = i === 0 ? "admin" : i < 4 ? "moderator" : "user";
  const status = i % 11 === 0 ? "suspended" : i % 7 === 0 ? "pending" : "active";
  return {
    id: `usr_${1e3 + i}`,
    name,
    email: name.toLowerCase().replace(/[^a-z]+/g, ".") + "@sharjahbiennial.online",
    role,
    status,
    joined: isoDaysAgo(180 - i * 7),
    lastSeen: isoDaysAgo(i * 3 % 30),
    balance: Math.round(i * 137 % 9e3 + 250),
    avatar: ["#f5d76e", "#7dd3fc", "#fda4af", "#86efac", "#c4b5fd"][i % 5]
  };
});
const txKinds = ["deposit", "withdraw", "transfer", "purchase", "sale"];
const methods = ["Card", "Bank transfer", "Apple Pay", "Wallet", "SWIFT"];
const statuses = ["completed", "completed", "completed", "pending", "review", "failed"];
const adminTxs = Array.from({ length: 48 }).map((_, i) => {
  const u = adminUsers[i % adminUsers.length];
  return {
    id: `tx_${5e3 + i}`,
    user: u.name,
    email: u.email,
    type: txKinds[i % txKinds.length],
    amount: Math.round(i * 73 % 4200 + 35),
    status: statuses[i % statuses.length],
    method: methods[i % methods.length],
    createdAt: isoDaysAgo(i * 0.7 % 30)
  };
});
Array.from({ length: 30 }).map((_, i) => {
  const base = 1800 + Math.sin(i / 3) * 600;
  const noise = i * 53 % 400 - 200;
  return {
    day: `D${i + 1}`,
    revenue: Math.max(400, Math.round(base + noise)),
    volume: Math.max(900, Math.round(base * 1.7 + noise * 2))
  };
});
Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  visits: 800 + i * 137 % 900,
  bids: 30 + i * 17 % 80
}));
const overviewKpis = {
  revenue: { delta: 12.4 },
  volume24h: { delta: -3.1 },
  activeAuctions: { delta: 6 },
  newUsers: { delta: 8.2 }
};
adminUsers.filter((u) => u.status === "pending").slice(0, 5).map((u) => ({ id: u.id, name: u.name, email: u.email, submitted: "2d ago" }));
adminTxs.filter((t) => t.type === "withdraw" && t.status === "pending").slice(0, 6);
function fmtMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}
function fmtDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  });
}
({
  lastLogin: isoDaysAgo(1),
  lastPasswordReset: isoDaysAgo(19)
});
[
  {
    id: "cw_1",
    label: "Treasury settlement wallet",
    asset: "USDT",
    network: "Ethereum",
    address: "0x84f8c2c51fc9a1c8b1d3f9c15a7258bd2b3102ad",
    provider: "Fireblocks",
    memo: "Primary ops rail",
    fileName: "treasury-wallet-proof.pdf",
    status: "active",
    addedAt: isoDaysAgo(14)
  },
  {
    id: "cw_2",
    label: "Collector payout reserve",
    asset: "BTC",
    network: "Bitcoin",
    address: "bc1q3mzun7f2r6vw7sj8ec0k5p4u0w86wsd5u9e4vh",
    provider: "Ledger Enterprise",
    status: "review",
    addedAt: isoDaysAgo(5)
  }
];
const $$splitComponentImporter$2 = () => import("./admin.exhibition-BDvu2Dgk.js");
const Route$3 = createFileRoute("/admin/exhibition")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.account-CMwvvHth.js");
const Route$2 = createFileRoute("/admin/account")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
z.object({
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
const $$splitComponentImporter = () => import("./admin.users.index-Osic1stG.js");
const Route$1 = createFileRoute("/admin/users/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const loadedImageCache = /* @__PURE__ */ new Set();
function SmartImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  priority = false,
  objectFit = "cover"
}) {
  const wasPreviouslyLoaded = loadedImageCache.has(src);
  const [isLoaded, setIsLoaded] = useState(wasPreviouslyLoaded);
  const imgRef = useRef(null);
  useEffect(() => {
    if (isLoaded) return;
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      loadedImageCache.add(src);
      setIsLoaded(true);
    }
  }, [src, isLoaded]);
  const handleLoad = () => {
    loadedImageCache.add(src);
    setIsLoaded(true);
  };
  const showFinalState = isLoaded || wasPreviouslyLoaded;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("relative overflow-hidden bg-surface", className),
      style: { aspectRatio: `${width || 100} / ${height || 100}` },
      children: /* @__PURE__ */ jsx(
        motion.img,
        {
          ref: imgRef,
          src,
          alt,
          loading: priority ? "eager" : "lazy",
          fetchPriority: priority ? "high" : "auto",
          decoding: "async",
          onLoad: handleLoad,
          initial: showFinalState ? false : { opacity: 0, filter: "blur(18px)", scale: 1.02 },
          whileInView: { opacity: 1, scale: 1, filter: "blur(0px)" },
          viewport: { once: false },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          className: cn(
            "absolute inset-0 h-full w-full will-change-[filter,opacity,transform]",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            imgClassName
          )
        }
      )
    }
  );
}
function AuctionImageSwiper({ images, alt, priority, aspect = "aspect-[4/5]" }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const sync = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
  }, [embla]);
  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync);
    embla.on("reInit", sync);
  }, [embla, sync]);
  const single = images.length <= 1;
  return /* @__PURE__ */ jsxs("div", { className: cn("relative overflow-hidden bg-surface", aspect), children: [
    /* @__PURE__ */ jsx("div", { ref: emblaRef, className: "h-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex h-full", children: images.map((src, i) => /* @__PURE__ */ jsx("div", { className: "relative h-full min-w-0 flex-[0_0_100%]", children: /* @__PURE__ */ jsx(
      SmartImage,
      {
        src,
        alt: `${alt} — view ${i + 1}`,
        priority: priority && i === 0,
        className: "absolute inset-0 h-full w-full object-cover"
      }
    ) }, `${src}-${i}`)) }) }),
    !single && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": "Previous image",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            embla?.scrollPrev();
          },
          className: "absolute left-3 top-1/2 z-10 -translate-y-1/2 border border-canvas/40 bg-canvas/70 p-1.5 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-canvas group-hover:opacity-100",
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": "Next image",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            embla?.scrollNext();
          },
          className: "absolute right-3 top-1/2 z-10 -translate-y-1/2 border border-canvas/40 bg-canvas/70 p-1.5 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-canvas group-hover:opacity-100",
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5", children: images.map((_, i) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": `Go to image ${i + 1}`,
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            embla?.scrollTo(i);
          },
          className: cn(
            "h-1 w-6 transition-all",
            selected === i ? "bg-canvas" : "bg-canvas/40"
          )
        },
        i
      )) })
    ] })
  ] });
}
function AdminLoader({
  fullscreen = true,
  partial = false,
  message = "Preparing console",
  subMessage,
  isLoading = true,
  variant = "page",
  className,
  showSkeleton = true
}) {
  if (!isLoading) return null;
  const isAction = variant === "action";
  const isPage = variant === "page" || !isAction && fullscreen;
  const containerClasses = cn(
    "admin-theme",
    fullscreen && !partial ? "fixed inset-0 z-[300] flex items-center justify-center !bg-[var(--a-bg)]/5 backdrop-blur-md" : partial ? "flex w-full items-center justify-center py-8" : "flex w-full items-center justify-center",
    className
  );
  const cardClasses = partial ? "w-full max-w-md rounded-2xl border border-[var(--a-border)] bg-[var(--a-surface)] p-8 shadow-xl" : "";
  const inner = /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center text-center",
        isAction ? "gap-6" : "gap-7",
        !partial && "max-w-sm px-6"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute size-20 rounded-full",
              style: { background: "var(--a-accent)", opacity: 0.06 },
              animate: {
                scale: [1, 1.4, 1],
                opacity: [0.06, 0.02, 0.06]
              },
              transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute size-[66px] rounded-full border",
              style: { borderColor: "var(--a-accent)", opacity: 0.15 },
              animate: { scale: [1, 1.18, 1], opacity: [0.15, 0.05, 0.15] },
              transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "relative grid place-items-center rounded-2xl shadow-2xl ring-1 ring-[var(--a-border-hi)]",
                isAction ? "size-14" : "size-16"
              ),
              style: { background: "var(--a-accent)", color: "var(--a-accent-ink)" },
              children: isAction ? /* @__PURE__ */ jsx(Activity, { className: cn("size-7"), strokeWidth: 2.5 }) : /* @__PURE__ */ jsx(Shield, { className: cn("size-8"), strokeWidth: 2.25 })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border border-[var(--a-border)] bg-[var(--a-surface)] p-1.5",
              animate: { rotate: 360 },
              transition: { duration: 2.8, repeat: Infinity, ease: "linear" },
              children: /* @__PURE__ */ jsx(Loader2, { className: "size-3 text-[var(--a-accent)]", strokeWidth: 3 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: cn(
                "font-display font-semibold tracking-[-0.01em] text-[var(--a-fg)]",
                isAction ? "text-lg" : "text-2xl"
              ),
              children: message
            }
          ),
          (subMessage || isPage) && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--a-muted)]", children: subMessage || "Sharjahbiennial Admin • Securing session" })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "relative h-px w-48 overflow-hidden rounded-full",
              isAction ? "w-40" : "w-52"
            ),
            style: { background: "var(--a-border)" },
            children: /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "absolute inset-y-0 left-0 bg-[var(--a-accent)]",
                animate: { x: ["-120%", "280%"] },
                transition: {
                  duration: isAction ? 1.1 : 1.65,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1]
                },
                style: { width: "22%" }
              }
            )
          }
        ),
        !isAction && showSkeleton && !partial && /* @__PURE__ */ jsxs("div", { className: "mt-2 w-full max-w-[320px] space-y-2.5 pt-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-2 w-12 rounded bg-[var(--a-border)]/70" }),
              /* @__PURE__ */ jsx("div", { className: "h-6 w-28 rounded bg-[var(--a-border)]/50" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "size-8 rounded-lg bg-[var(--a-border)]/50" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1.5 rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-3.5", children: [0, 1].map((i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "size-7 rounded-md bg-[var(--a-border)]/50" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "h-2 w-2/3 rounded bg-[var(--a-border)]/50" }),
              /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1/3 rounded bg-[var(--a-border)]/40" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2.5 w-12 rounded bg-[var(--a-border)]/50" })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-1 text-[10px] text-[var(--a-muted)]", children: [
          /* @__PURE__ */ jsx(Database, { className: "size-3" }),
          /* @__PURE__ */ jsx("span", { className: "tracking-widest", children: "SYNCHRONIZING" })
        ] })
      ]
    }
  );
  const body = partial ? /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 6, scale: 0.985 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
      className: cardClasses,
      children: inner
    }
  ) : /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 },
      children: inner
    }
  );
  return /* @__PURE__ */ jsx("div", { className: containerClasses, children: body });
}
const Route = createFileRoute("/admin/users/$id")({
  component: UserDetail
});
function UserDetail() {
  const { users, userAuctions, transactions, userBids, storeListings } = useDataStore(
    useShallow((s) => ({
      users: s.users,
      userAuctions: s.auctions,
      transactions: s.transactions,
      userBids: s.bids,
      storeListings: s.listings
    }))
  );
  const { id } = useParams({ from: "/admin/users/$id" });
  const currentUser = users.find((u) => u.id == id);
  const [bids, setBids] = useState(userBids ?? []);
  const [txs, setTxs] = useState(transactions ?? []);
  const [auctions, setAuctions] = useState(userAuctions ?? []);
  const [listings, setListings] = useState(storeListings ?? []);
  const [target, setTarget] = useState(null);
  const [open, setOpen] = useState(false);
  if (!currentUser) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/admin/users",
          className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }),
            " Back to users"
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-[var(--a-muted)]", children: "User not found." })
    ] });
  }
  const initials = currentUser.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2);
  const close = () => setTarget(null);
  const accFields = [
    { key: "fullName", label: "Name", span: 2, editable: false },
    { key: "email", label: "Email", editable: false },
    {
      key: "token",
      label: "Token",
      editable: false
    },
    { key: "userName", label: "User Name/Seller Slug" },
    {
      key: "status",
      label: "Status",
      kind: "select",
      options: ["active", "pending", "suspended"].map((v) => ({
        value: v,
        label: v
      }))
    },
    { key: "wallet.balance", label: "Wallet balance", kind: "money" },
    { key: "wallet.bidBalance", label: "Wallet Bid Balance", kind: "money" },
    {
      key: "joinedDate",
      label: "Joined",
      editable: false,
      render: (v) => fmtDateTime(v)
    }
  ];
  const { toast: toast2 } = useToast();
  const { updateDocument, addDocToCollection, deleteDocument } = useDoc();
  const errorToast = (error, position, description, action) => {
    toast2({
      title: "Error",
      description: error.message,
      action: void 0,
      variant: "error",
      position
    });
  };
  const modToast = () => {
    toast2({
      title: "Success",
      description: "Changes Made",
      variant: "info",
      duration: 4e4
    });
  };
  const warnToast = () => {
    toast2({
      title: "Error",
      description: "Error In Selection",
      variant: "warning",
      duration: 4e4
    });
  };
  const [imagesHover, setImagesHover] = useState([]);
  const [uniqueImageID, setUniqueImageID] = useState(null);
  const openImages = (e, { id: id2, images }) => {
    if (images.length) setImagesHover(images);
    if (id2) {
      setUniqueImageID(id2);
    }
  };
  const scheduleClose = () => {
    setUniqueImageID(null);
  };
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("Processing...");
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    if (users && users.length > 0) {
      setPageLoading(false);
    }
  }, [users?.length]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/admin/users",
        className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }),
          " Back to users"
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      AdminLoader,
      {
        fullscreen: true,
        variant: "page",
        isLoading: pageLoading,
        message: "Loading user",
        subMessage: "Fetching profile & activity"
      }
    ),
    /* @__PURE__ */ jsx(
      AdminLoader,
      {
        fullscreen: true,
        variant: "action",
        isLoading: actionLoading,
        message: actionMessage
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "a-card-elev mt-4 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "grid size-16 place-items-center rounded-xl text-lg font-extrabold text-[var(--a-accent-ink)] shadow-lg",
                style: { background: "orange" },
                children: initials
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-extrabold tracking-tight text-[var(--a-fg)]", children: currentUser.fullName }),
                /* @__PURE__ */ jsx(StatusChip, { value: currentUser.status }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-[var(--a-border-hi)] bg-[var(--a-accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)]", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: "size-3" }),
                  " ",
                  currentUser.role
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--a-muted)]", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "size-3" }),
                  " ",
                  currentUser.email
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "size-3" }),
                  " Joined",
                  " ",
                  fmtDateTime(currentUser.joinedDate)
                ] }),
                /* @__PURE__ */ jsx("span", { className: "a-mono", children: currentUser.token })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: [
              /* @__PURE__ */ jsx(Mail, { className: "size-3.5" }),
              " Message"
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]",
                onClick: () => setOpen(true),
                children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3.5" }),
                  " View Details"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open,
        onOpenChange: setOpen,
        fields: accFields,
        record: currentUser,
        title: currentUser.fullName + " Information",
        subtitle: "",
        eyebrow: fmtMoney(currentUser.wallet.balance),
        onSave: async (p) => {
          if (!currentUser) {
            warnToast();
            return;
          }
          setActionMessage("Saving user details...");
          setActionLoading(true);
          try {
            await updateDocument({
              collections: "users",
              document: {
                ...currentUser,
                ...p
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            close();
            setActionLoading(false);
          }
        },
        operations: [
          {
            id: "activate",
            label: "Activate User",
            icon: Check,
            tone: "success",
            onRun: async () => {
              if (!currentUser) {
                warnToast();
                return;
              }
              setActionMessage("Activating user...");
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    ...currentUser,
                    status: "active"
                  }
                });
                try {
                  await sendUserNotification("account_activated", {
                    to_email: currentUser.email,
                    to_name: currentUser.fullName,
                    fullName: currentUser.fullName,
                    status: "active"
                  });
                } catch (e) {
                  console.warn("[email] account activated failed", e);
                }
                modToast();
              } catch (error) {
                errorToast(error);
              } finally {
                close();
                setActionLoading(false);
              }
            }
          },
          {
            id: "suspend",
            label: "Suspend User",
            icon: X,
            tone: "danger",
            onRun: async () => {
              if (!currentUser) {
                warnToast();
                return;
              }
              setActionMessage("Suspending user...");
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    ...currentUser,
                    status: "suspended"
                  }
                });
                try {
                  await sendUserNotification("account_suspended", {
                    to_email: currentUser.email,
                    to_name: currentUser.fullName,
                    fullName: currentUser.fullName,
                    status: "suspended"
                  });
                } catch (e) {
                  console.warn("[email] account suspended failed", e);
                }
                modToast();
              } catch (error) {
                errorToast(error);
              } finally {
                close();
                setActionLoading(false);
              }
            }
          }
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(
        WalletStat,
        {
          label: "Balance",
          value: fmtMoney(currentUser.wallet.balance),
          accent: true
        }
      ),
      /* @__PURE__ */ jsx(
        WalletStat,
        {
          label: "Bid Balance",
          value: fmtMoney(currentUser.wallet.bidBalance)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-7",
          eyebrow: "Exhibition · Auctions",
          title: `Listed Auctions From ${currentUser.fullName}`,
          delay: 0.12,
          action: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]", children: [
            /* @__PURE__ */ jsx(Gavel, { className: "size-3" }),
            " ",
            auctions.length,
            " total"
          ] }),
          children: /* @__PURE__ */ jsx(
            DataTable,
            {
              rows: auctions.filter((a) => a.userID == currentUser.userID),
              onRowClick: (r) => setTarget({ kind: "auction", row: r }),
              columns: [
                {
                  key: "title",
                  header: "Lot",
                  render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 relative", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute -top-[105%] w-auto h-auto ml-1 p-2 flex gap-2 ",
                        onMouseEnter: (e) => {
                          e.stopPropagation();
                          openImages(e, { id: r.id, images: r.images });
                        },
                        onMouseLeave: () => {
                          scheduleClose();
                        },
                        children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: r.id === uniqueImageID && imagesHover.length > 0 && imagesHover.map((i, num) => /* @__PURE__ */ jsx(
                          motion.div,
                          {
                            initial: { opacity: 0, x: 10 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: 10 },
                            children: /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: i,
                                className: "size-16 transition object-cover aspect-auto rounded transition"
                              },
                              i
                            )
                          }
                        )) })
                      }
                    ),
                    r.images?.[0] && /* @__PURE__ */ jsx(
                      "img",
                      {
                        onMouseEnter: (e) => {
                          e.stopPropagation();
                          openImages(e, { id: r.id, images: r.images });
                        },
                        onMouseLeave: () => {
                          scheduleClose();
                        },
                        onClick: (e) => {
                          e.stopPropagation();
                          openImages(e, { id: r.id, images: r.images });
                        },
                        src: r.images[0],
                        alt: r.title,
                        className: "size-12 border rounded object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.title }),
                      /* @__PURE__ */ jsx("p", { className: "a-mono text-[10px] text-[var(--a-muted)]", children: r.sellerSlug })
                    ] })
                  ] })
                },
                {
                  key: "estimate",
                  header: "Estimate",
                  render: (r) => /* @__PURE__ */ jsxs("span", { className: "a-mono text-xs text-[var(--a-fg-2)]", children: [
                    fmtMoney(r.estimateLow),
                    " – ",
                    fmtMoney(r.estimateHigh)
                  ] })
                },
                {
                  key: "bid",
                  header: "Current bid",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-accent)]", children: fmtMoney(r.currentBid ?? 0) })
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => /* @__PURE__ */ jsx(StatusChip, { va: true, lue: r.status ?? "active" })
                }
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-5",
          eyebrow: "Exhibition · Bidding",
          title: "Active & past bids",
          delay: 0.18,
          action: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]", children: [
            /* @__PURE__ */ jsx(Hammer, { className: "size-3" }),
            " ",
            bids.length,
            " total"
          ] }),
          children: /* @__PURE__ */ jsx(
            DataTable,
            {
              rows: bids.filter((b) => b.userID == currentUser.userID),
              onRowClick: (r) => setTarget({ kind: "bid", row: r }),
              columns: [
                {
                  key: "lot",
                  header: "Lot",
                  render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "grid size-7 place-items-center rounded bg-[var(--a-surface-2)] text-[var(--a-accent)]", children: /* @__PURE__ */ jsx(Hammer, { className: "size-3" }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.lotTitle })
                  ] })
                },
                {
                  key: "amount",
                  header: "Bid",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.bidAmount) })
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: "Leading" })
                },
                {
                  key: "at",
                  header: "When",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.placedAt) })
                }
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-5",
          eyebrow: "Marketplace · Owned",
          title: "Listings",
          delay: 0.22,
          action: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]", children: [
            /* @__PURE__ */ jsx(Package, { className: "size-3" }),
            " ",
            listings.filter((l) => l.userID == currentUser.userID).length,
            " ",
            "total"
          ] }),
          children: /* @__PURE__ */ jsx(
            DataTable,
            {
              rows: listings.filter((l) => l.userID == currentUser.userID),
              onRowClick: (r) => setTarget({ kind: "listing", row: r }),
              columns: [
                {
                  key: "title",
                  header: "Lot",
                  render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    r.images?.[0] && /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: r.images[0],
                        alt: r.title,
                        className: "size-8 border rounded object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)] truncate", children: r.title }),
                      /* @__PURE__ */ jsx("p", { className: "a-mono text-[10px] text-[var(--a-muted)] truncate", children: r.category })
                    ] })
                  ] })
                },
                {
                  key: "bidAmount",
                  header: "Price",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-accent)]", children: fmtMoney(r.bidAmount) })
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status ?? "sold" })
                },
                {
                  key: "createdAt",
                  header: "When",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.createdAt || r.placedAt) })
                }
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-7",
          eyebrow: "Wallet · Ledger",
          title: "Recent transactions",
          delay: 0.26,
          action: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/admin/wallet",
              className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline",
              children: [
                "Open ledger ",
                /* @__PURE__ */ jsx(ExternalLink, { className: "size-3" })
              ]
            }
          ),
          children: /* @__PURE__ */ jsx(
            DataTable,
            {
              rows: txs.filter((t) => t.userID == currentUser.userID),
              onRowClick: (r) => setTarget({ kind: "tx", row: r }),
              columns: [
                {
                  key: "fullName",
                  header: "Full Name",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-muted)]", children: r.fullName })
                },
                {
                  key: "type",
                  header: "Type",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]", children: r.type })
                },
                {
                  key: "method",
                  header: "Method",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-fg-2)]", children: r.channel })
                },
                {
                  key: "amount",
                  header: "Amount",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.amount) })
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status })
                },
                {
                  key: "at",
                  header: "When",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.createdAt) })
                }
              ]
            }
          )
        }
      )
    ] }),
    target?.kind === "bid" && /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open: true,
        onOpenChange: (o) => !o && close(),
        eyebrow: "Bid",
        title: target.row.lotTitle,
        subtitle: `Lot ${target.row.lotTitle}`,
        record: target.row,
        fields: bidFields,
        operations: [
          {
            id: "delete",
            label: "Delete Bid",
            tone: "danger",
            icon: Pause,
            onRun: async () => {
              if (!target.row) {
                toast2({
                  title: "Error",
                  description: "Error In Selections",
                  variant: "warning",
                  position: "bottom"
                });
                return;
              }
              setActionMessage("Deleting bid and returning funds...");
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    id: target.row.userID,
                    wallet: {
                      balance: currentUser.wallet.balance + target.row.bidAmount,
                      bidBalance: Math.max(
                        0,
                        currentUser.wallet.bidBalance - target.row.bidAmount
                      )
                    }
                  }
                });
                await deleteDocument({
                  collectionName: "bids",
                  id: target.row.id,
                  message: "Bid Successfully Deleted, And Funds Has Been Returned To User Who Bidded"
                });
              } catch (error) {
                toast2({
                  title: "Error",
                  description: error.message || error.code,
                  variant: "error",
                  position: "bottom"
                });
              } finally {
                setTarget(null);
                setActionLoading(false);
              }
            }
          },
          {
            id: "close",
            label: "Close & award winner",
            icon: Hammer,
            tone: "primary",
            onRun: async () => {
              const Lot = await getAuctionBySlug(target.row.slug);
              if (!target.row || !Lot) {
                toast2({
                  title: "Error",
                  description: "Error In Selections",
                  variant: "warning",
                  position: "bottom"
                });
                return;
              }
              setActionMessage(
                "Closing auction and transferring ownership..."
              );
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    id: target.row.userID,
                    wallet: {
                      balance: currentUser.wallet.balance,
                      bidBalance: Math.max(
                        0,
                        currentUser.wallet.bidBalance - target.row.bidAmount
                      )
                    }
                  }
                });
                const originalUser = await getDoc(
                  doc(db, "users", Lot.userID)
                );
                if (originalUser.exists()) {
                  const data = originalUser.data();
                  const topbal2 = data.wallet.balance + target.row.bidAmount;
                  await updateDocument({
                    collections: "users",
                    document: {
                      id: Lot.userID,
                      wallet: {
                        balance: topbal2,
                        bidBalance: data.wallet.bidBalance
                      }
                    }
                  });
                }
                await addDocToCollection({
                  collections: "listings",
                  document: {
                    title: Lot?.title,
                    userName: currentUser.userName,
                    userID: target.row.userID,
                    bidAmount: target.row.bidAmount,
                    year: Lot?.year,
                    category: Lot?.category,
                    description: Lot?.description,
                    images: Lot?.images,
                    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                    dimensions: Lot?.dimensions,
                    status: Lot?.status,
                    medium: Lot?.medium,
                    slug: crypto.randomUUID(),
                    provenance: Lot?.provenance,
                    condition: Lot?.condition,
                    totalBidCounts: Lot?.bidCount,
                    placedAt: target.row.placedAt,
                    timeStamp: serverTimestamp()
                  }
                });
                await updateDocument({
                  collections: "auctions",
                  document: {
                    id: target.row.id,
                    endsAt: inHours(12),
                    status: "closed"
                  }
                });
                await deleteDocument({
                  collectionName: "bids",
                  id: target.row.id,
                  message: "Bid Has Ended, Thus Added To The User Listing List And Deleted From Auctions In 12 hours From Now"
                });
                try {
                  await addDocToCollection({
                    collections: "transactions",
                    document: {
                      channel: "Auction",
                      amount: target.row.bidAmount,
                      balanceAfter: currentUser.wallet.balance,
                      date: serverTimestamp(),
                      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                      currency: currentUser.currency || "USD",
                      symbol: currentUser.symbol || "$",
                      email: currentUser.email,
                      fullName: currentUser.fullName,
                      status: "Approved",
                      title: "Purchase (Auction Win)",
                      type: "purchase",
                      userID: target.row.userID,
                      counterparty: data2?.fullName || Lot.sellerSlug,
                      note: `Won ${Lot.title}`
                    }
                  });
                  if (data2) {
                    await addDocToCollection({
                      collections: "transactions",
                      document: {
                        channel: "Auction",
                        amount: target.row.bidAmount,
                        balanceAfter: topbal,
                        date: serverTimestamp(),
                        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                        currency: data2.currency || "USD",
                        symbol: data2.symbol || "$",
                        email: data2.email,
                        fullName: data2.fullName,
                        status: "Approved",
                        title: "Sale (Auction)",
                        type: "sale",
                        userID: Lot.userID,
                        counterparty: currentUser.fullName,
                        note: `Sold ${Lot.title}`
                      }
                    });
                  }
                } catch (e) {
                  console.warn(
                    "[activity] failed to record purchase/sale tx from user detail",
                    e
                  );
                }
                try {
                  const winner = currentUser;
                  const sellerSnap = await getDoc(
                    doc(db, "users", Lot.userID)
                  );
                  const seller = sellerSnap.exists() ? sellerSnap.data() : null;
                  await sendUserNotification("auction_won", {
                    to_email: winner.email,
                    to_name: winner.fullName,
                    lotTitle: Lot.title,
                    slug: Lot.slug,
                    finalPrice: target.row.bidAmount,
                    auctionID: Lot.id,
                    winnerName: winner.fullName
                  });
                  if (seller?.email) {
                    await sendUserNotification("auction_sold_to_seller", {
                      to_email: seller.email,
                      to_name: seller.fullName,
                      lotTitle: Lot.title,
                      slug: Lot.slug,
                      finalPrice: target.row.bidAmount,
                      auctionID: Lot.id,
                      winnerName: winner.fullName,
                      sellerName: seller.fullName
                    });
                  }
                  await sendAdminNotification("auction_won", {
                    lotTitle: Lot.title,
                    slug: Lot.slug,
                    finalPrice: target.row.bidAmount,
                    auctionID: Lot.id,
                    winnerName: winner.fullName,
                    sellerName: seller?.fullName || Lot.sellerSlug
                  });
                } catch (e) {
                  console.warn("[email] close bid notification failed", e);
                }
              } catch (error) {
                toast2({
                  title: "Error",
                  description: error.message || error.code,
                  variant: "error",
                  position: "bottom"
                });
              } finally {
                setTarget(null);
                setActionLoading(false);
              }
            }
          }
        ]
      }
    ),
    target?.kind === "tx" && /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open: true,
        onOpenChange: (o) => !o && close(),
        eyebrow: "Wallet ledger",
        title: `${target.row.type.toUpperCase()} · ${fmtMoney(target.row.amount)}`,
        subtitle: `Tx ${target.row.id}`,
        record: target.row,
        fields: txFields,
        onSave: async (p) => {
          if (!target.row) {
            toast2({
              title: "Error",
              description: "Error in Selection",
              variant: "warning"
            });
            return;
          }
          setActionMessage("Updating transaction...");
          setActionLoading(true);
          try {
            await updateDocument({
              collections: "transactions",
              document: {
                ...target.row,
                ...p
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setTarget(null);
            setActionLoading(false);
          }
        },
        operations: [
          {
            id: "approve",
            label: "Approve",
            icon: CheckCircle2,
            tone: "success",
            onRun: async () => {
              if (!target.row) {
                warnToast();
                return;
              }
              setActionMessage("Approving transaction...");
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "transactions",
                  document: {
                    status: "Approved",
                    id: target.row.id
                  }
                });
                modToast();
              } catch (error) {
                errorToast(error);
              } finally {
                setTarget(null);
                setActionLoading(false);
              }
            }
          },
          {
            id: "decline",
            label: "Decline",
            icon: XCircle,
            tone: "danger",
            onRun: async () => {
              if (!target.row) {
                warnToast();
                return;
              }
              setActionMessage("Declining transaction...");
              setActionLoading(true);
              try {
                await updateDocument({
                  collections: "transactions",
                  document: {
                    status: "Failed",
                    id: target.row.id
                  }
                });
                modToast();
              } catch (error) {
                errorToast(error);
              } finally {
                setTarget(null);
                setActionLoading(false);
              }
            }
          }
        ]
      }
    ),
    target?.kind === "auction" && /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open: true,
        onOpenChange: (o) => !o && close(),
        eyebrow: "Auctioned ArtWork Details",
        title: `${target.row.title.toUpperCase()} · ${target.row.sellerSlug}`,
        subtitle: ` ${target.row.category}`,
        record: target.row,
        fields: auctionFields,
        onSave: async (p) => {
          if (!target.row) {
            warnToast();
            return;
          }
          setActionMessage("Updating auction lot...");
          setActionLoading(true);
          try {
            await updateDocument({
              collections: "auctions",
              document: {
                ...target.row,
                id: target.row.id,
                ...p
              }
            });
            toast2({
              title: "Success",
              description: "Lot Modified Successfully",
              position: "top",
              variant: "info",
              duration: 5e4
            });
          } catch (error) {
            toast2({
              title: "Error",
              description: error.code || error.message,
              position: "top",
              variant: "error",
              duration: 5e4
            });
          } finally {
            setTarget(null);
            setActionLoading(false);
          }
        },
        extra: target.row.images.length && /* @__PURE__ */ jsx(
          AuctionImageSwiper,
          {
            images: target.row.images,
            alt: currentUser.fullName
          }
        )
      }
    ),
    target?.kind === "listing" && /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open: true,
        onOpenChange: (o) => !o && close(),
        eyebrow: "Listing",
        title: target.row.title,
        subtitle: `${target.row.category} · ${target.row.medium ?? ""}`,
        record: target.row,
        fields: listingFields,
        extra: target.row.images?.length ? /* @__PURE__ */ jsx(
          AuctionImageSwiper,
          {
            images: target.row.images,
            alt: target.row.title
          }
        ) : void 0,
        onSave: async (p) => {
          if (!target.row) {
            warnToast();
            return;
          }
          setActionMessage("Updating listing...");
          setActionLoading(true);
          try {
            await updateDocument({
              collections: "listings",
              document: {
                ...target.row,
                ...p
              }
            });
            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setTarget(null);
            setActionLoading(false);
          }
        },
        operations: [
          {
            id: "delete",
            label: "Delete Listing",
            tone: "danger",
            icon: Trash2,
            onRun: async () => {
              if (!target.row) {
                warnToast();
                return;
              }
              setActionMessage("Deleting listing...");
              setActionLoading(true);
              try {
                await deleteDocument({
                  collectionName: "listings",
                  id: target.row.slug,
                  message: "Listing removed successfully"
                });
              } catch (error) {
                errorToast(error);
              } finally {
                setTarget(null);
                setActionLoading(false);
              }
            }
          }
        ]
      }
    )
  ] });
}
const bidFields = [
  { key: "id", label: "Bid ID", kind: "readonly" },
  { key: "lotTitle", label: "Lot title", editable: true },
  { key: "bidAmount", label: "Bid amount", kind: "money", editable: true },
  // {
  //   key: "status",
  //   label: "Status",
  //   kind: "select",
  //   editable: true,
  //   options: [
  //     { value: "leading", label: "Leading" },
  //     { value: "outbid", label: "Outbid" },
  //     { value: "won", label: "Won" },
  //     { value: "lost", label: "Lost" },
  //   ],
  // },
  {
    key: "placedAt",
    label: "Placed at",
    kind: "readonly",
    render: (v) => fmtDateTime(String(v))
  }
];
const txFields = [
  // { key: "id", label: "Tx ID", kind: "readonly" },
  { key: "fullName", label: "FullName", kind: "readonly" },
  { key: "email", label: "Email", kind: "readonly" },
  {
    key: "type",
    label: "Type",
    kind: "select",
    editable: false,
    options: [
      { value: "deposit", label: "Deposit" },
      { value: "withdraw", label: "Withdraw" },
      { value: "transfer", label: "Transfer" },
      { value: "purchase", label: "Purchase" },
      { value: "sale", label: "Sale" }
    ]
  },
  { key: "channel", label: "Method", editable: false },
  { key: "amount", label: "Amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "Approved", label: "Approved" },
      { value: "Pending", label: "Pending" },
      { value: "Failed", label: "Failed" },
      { value: "On Hold", label: "On Hold" }
    ]
  },
  {
    key: "createdAt",
    label: "Created",
    kind: "readonly",
    render: (v) => fmtDateTime(String(v))
  }
];
const auctionFields = [
  { key: "title", label: "Lot title", span: 2 },
  // { key: "lotNumber", label: "Lot #" },
  { key: "categoryLabel", label: "Category" },
  { key: "medium", label: "Medium" },
  { key: "dimensions", label: "Dimensions" },
  { key: "year", label: "Year", kind: "number" },
  { key: "estimateLow", label: "Estimate low", kind: "money" },
  { key: "estimateHigh", label: "Estimate high", kind: "money" },
  { key: "currentBid", label: "Current bid", kind: "money" },
  { key: "startBid", label: "Start bid", kind: "money" },
  { key: "condition", label: "Condition" },
  { key: "provenance", label: "Provenance", kind: "textarea" },
  { key: "description", label: "Description", kind: "textarea", span: 2 }
  // {
  //   key: "status",
  //   label: "Status",
  //   kind: "select",
  //   render(value, row) {
  //     return (
  //       <>
  //         <span className="capitalize">{value as string}</span>
  //       </>
  //     );
  //   },
  //   options: [
  //     {
  //       label: "Active",
  //       value: "active",
  //     },
  //     {
  //       label: "Pending",
  //       value: "pending",
  //     },
  //     {
  //       label: "Suspended",
  //       value: "suspended",
  //     },
  //   ],
  // },
];
const listingFields = [
  { key: "title", label: "Title", span: 2, editable: true },
  { key: "slug", label: "Slug", kind: "readonly" },
  { key: "category", label: "Category", editable: true },
  { key: "medium", label: "Medium", editable: true },
  { key: "year", label: "Year", kind: "number", editable: true },
  { key: "dimensions", label: "Dimensions", editable: true },
  { key: "condition", label: "Condition", editable: true },
  { key: "provenance", label: "Provenance", kind: "textarea", editable: true },
  {
    key: "description",
    label: "Description",
    kind: "textarea",
    span: 2,
    editable: true
  },
  { key: "bidAmount", label: "Price", kind: "money", editable: true },
  { key: "status", label: "Status", editable: true },
  {
    key: "createdAt",
    label: "Created",
    kind: "readonly",
    render: (v) => fmtDateTime(String(v))
  },
  {
    key: "placedAt",
    label: "Placed at",
    kind: "readonly",
    render: (v) => fmtDateTime(String(v))
  }
];
function WalletStat({
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `a-card-elev p-4 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`,
      children: [
        /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: label }),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: `font-display mt-1.5 text-2xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`,
            children: value
          }
        )
      ]
    }
  );
}
const WalletRoute = Route$x.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => Route$y
});
const SellRoute = Route$w.update({
  id: "/sell",
  path: "/sell",
  getParentRoute: () => Route$y
});
const ProfileRoute = Route$v.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$y
});
const NotificationsRoute = Route$u.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$y
});
const ListingsRoute = Route$t.update({
  id: "/listings",
  path: "/listings",
  getParentRoute: () => Route$y
});
const GenerateRoute = Route$s.update({
  id: "/generate",
  path: "/generate",
  getParentRoute: () => Route$y
});
const GalleryRoute = Route$r.update({
  id: "/gallery",
  path: "/gallery",
  getParentRoute: () => Route$y
});
const FavouritesRoute = Route$q.update({
  id: "/favourites",
  path: "/favourites",
  getParentRoute: () => Route$y
});
const ContactRoute = Route$p.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$y
});
const ConnectRoute = Route$o.update({
  id: "/connect",
  path: "/connect",
  getParentRoute: () => Route$y
});
const CartRoute = Route$n.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$y
});
const BidsRoute = Route$m.update({
  id: "/bids",
  path: "/bids",
  getParentRoute: () => Route$y
});
const AdminRoute = Route$l.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$y
});
const AboutRoute = Route$k.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$y
});
const IndexRoute = Route$j.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$y
});
const CategoriesIndexRoute = Route$i.update({
  id: "/categories/",
  path: "/categories/",
  getParentRoute: () => Route$y
});
const AuctionsIndexRoute = Route$h.update({
  id: "/auctions/",
  path: "/auctions/",
  getParentRoute: () => Route$y
});
const ArtistsIndexRoute = Route$g.update({
  id: "/artists/",
  path: "/artists/",
  getParentRoute: () => Route$y
});
const AdminIndexRoute = Route$f.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const WalletWithdrawRoute = Route$e.update({
  id: "/withdraw",
  path: "/withdraw",
  getParentRoute: () => WalletRoute
});
const WalletSendRoute = Route$d.update({
  id: "/send",
  path: "/send",
  getParentRoute: () => WalletRoute
});
const WalletSecurityRoute = Route$c.update({
  id: "/security",
  path: "/security",
  getParentRoute: () => WalletRoute
});
const WalletDepositRoute = Route$b.update({
  id: "/deposit",
  path: "/deposit",
  getParentRoute: () => WalletRoute
});
const WalletActivityRoute = Route$a.update({
  id: "/activity",
  path: "/activity",
  getParentRoute: () => WalletRoute
});
const CategoriesSlugRoute = Route$9.update({
  id: "/categories/$slug",
  path: "/categories/$slug",
  getParentRoute: () => Route$y
});
const AuctionsMineRoute = Route$8.update({
  id: "/auctions/mine",
  path: "/auctions/mine",
  getParentRoute: () => Route$y
});
const AuctionsSlugRoute = Route$7.update({
  id: "/auctions/$slug",
  path: "/auctions/$slug",
  getParentRoute: () => Route$y
});
const ArtworksSlugRoute = Route$6.update({
  id: "/artworks/$slug",
  path: "/artworks/$slug",
  getParentRoute: () => Route$y
});
const ArtistsSlugRoute = Route$5.update({
  id: "/artists/$slug",
  path: "/artists/$slug",
  getParentRoute: () => Route$y
});
const AdminWalletRoute = Route$4.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => AdminRoute
});
const AdminExhibitionRoute = Route$3.update({
  id: "/exhibition",
  path: "/exhibition",
  getParentRoute: () => AdminRoute
});
const AdminAccountRoute = Route$2.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => AdminRoute
});
const AdminUsersIndexRoute = Route$1.update({
  id: "/users/",
  path: "/users/",
  getParentRoute: () => AdminRoute
});
const AdminUsersIdRoute = Route.update({
  id: "/users/$id",
  path: "/users/$id",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminAccountRoute,
  AdminExhibitionRoute,
  AdminWalletRoute,
  AdminIndexRoute,
  AdminUsersIdRoute,
  AdminUsersIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const WalletRouteChildren = {
  WalletActivityRoute,
  WalletDepositRoute,
  WalletSecurityRoute,
  WalletSendRoute,
  WalletWithdrawRoute
};
const WalletRouteWithChildren = WalletRoute._addFileChildren(WalletRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AdminRoute: AdminRouteWithChildren,
  BidsRoute,
  CartRoute,
  ConnectRoute,
  ContactRoute,
  FavouritesRoute,
  GalleryRoute,
  GenerateRoute,
  ListingsRoute,
  NotificationsRoute,
  ProfileRoute,
  SellRoute,
  WalletRoute: WalletRouteWithChildren,
  ArtistsSlugRoute,
  ArtworksSlugRoute,
  AuctionsSlugRoute,
  AuctionsMineRoute,
  CategoriesSlugRoute,
  ArtistsIndexRoute,
  AuctionsIndexRoute,
  CategoriesIndexRoute
};
const routeTree = Route$y._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Good defaults for a museum/gallery app
        staleTime: 1e3 * 60 * 5,
        // 5 minutes
        gcTime: 1e3 * 60 * 30,
        // 30 minutes (formerly cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
      },
      mutations: {
        retry: 1
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  copyClipboard as $,
  AuctionImageSwiper as A,
  getArtworkBySlug as B,
  getAuctionBySlug as C,
  art09 as D,
  art10 as E,
  art01 as F,
  art03 as G,
  artworks as H,
  useArtInstitute as I,
  getChicagoImageUrl as J,
  auctionCategories as K,
  Select as L,
  SelectTrigger as M,
  SelectValue as N,
  SelectContent as O,
  SelectGroup as P,
  SelectItem as Q,
  Route$w as R,
  SmartImage as S,
  auctionLots as T,
  artists as U,
  SectionHeader as V,
  KpiTile as W,
  overviewKpis as X,
  BentoCard as Y,
  fmtMoney as Z,
  WalletLoader as _,
  useToast as a,
  makeToken as a0,
  Err as a1,
  TX_LABEL as a2,
  Route$9 as a3,
  getArtworksByCategory as a4,
  getSeller as a5,
  getLotsBySeller as a6,
  handleWalletBalance as a7,
  metApi as a8,
  useChicagoArtist as a9,
  useChicagoArtworksByArtist as aa,
  changeChicagoToMod as ab,
  AdminLoader as ac,
  TabBar as ad,
  DataTable as ae,
  StatusChip as af,
  RecordSheet as ag,
  router as ah,
  useAuthStore as b,
  useDataStore as c,
  toast as d,
  useDoc as e,
  sendAdminNotification as f,
  getUserName as g,
  useStore as h,
  inHours as i,
  checkForUserID as j,
  formatBid as k,
  fmtDateTime as l,
  db as m,
  cn as n,
  useUserNotifications as o,
  photoFN as p,
  formatPrice as q,
  categories as r,
  sendUserNotification as s,
  txSign as t,
  useAuth as u,
  filterOptions as v,
  useMetArtworks as w,
  changeMetArtWorkProps as x,
  useArtworkContext as y,
  findObj as z
};
