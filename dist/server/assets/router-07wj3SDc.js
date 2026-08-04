import { useQuery, queryOptions, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Link, createRootRouteWithContext, useRouter, useRouterState, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, notFound, useParams, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { useState, useEffect, createContext, useContext, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Heart, ShoppingBag, User, X, Menu, Mail, MapPin, Instagram, BookOpen, Wallet, Gavel, ChevronDown, Share2, Bookmark, ShieldClose, AlertTriangle, Info, Check, Shield, Loader2, RefreshCw, Home, LogOut, ArrowUpRight, ArrowDownRight, ChevronUp, Pencil, RotateCcw, Save, ArrowLeft, ShieldCheck, Calendar, KeyRound, Ban, CheckCircle2, Download, Smartphone, Package, ExternalLink, MoreHorizontal, FileText, Crown, XCircle, Truck, Trash2 } from "lucide-react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import z__default from "zod";
import { Client, ID, Storage } from "appwrite";
import { getFirestore, doc, updateDoc, getDoc, collection, query, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
const appCss = "/assets/styles-B8B6cujf.css";
const StoreCtx = createContext(null);
const KEY$1 = "aethelred.store.v1";
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
const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      loggedIn: false,
      loading: true,
      // start true until listener resolves
      isAuthHydrated: false,
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state
        }));
      },
      setUser: (user) => {
        set({
          user,
          loggedIn: !!user,
          loading: false,
          isAuthHydrated: true
        });
      },
      setLoading: (loading, isAuthHydrated) => {
        set((state) => ({
          ...state,
          loading,
          ...isAuthHydrated !== void 0 ? { isAuthHydrated } : {}
        }));
      }
    }),
    {
      name: "authStore",
      storage: createJSONStorage(() => localStorage),
      // Only persist the user, not transient loading states
      partialize: (state) => ({ user: state.user, loggedIn: state.loggedIn })
    }
  )
);
const useDataStore = create()(
  persist(
    (set, get) => ({
      transactions: [],
      users: [],
      auctions: [],
      bids: [],
      wallets: Array.from({ length: 3 }).map((_, i) => ({
        address: "fsadfsdfsfasdfasfsagsafdgib;l;",
        id: `${i}`,
        image: "asdhfofhosdhbauodsfb;nsfdsa",
        name: "Ethereum",
        network: `TRC ${i + 21}`
      })),
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state
        }));
      }
    }),
    {
      name: "_dataStore",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
const ICON_STROKE = 1.25;
const aboutLinks = [
  { to: "/about", label: "Our story", note: "Founded 2019. Four seasons a year." },
  { to: "/contact", label: "Contact", note: "Inquiries, partnerships, press." },
  { to: "/contact", label: "Partnerships", note: "Patrons, sponsors and houses." },
  { to: "/about", label: "Journal", note: "Long-reads, studio visits, broadsheets." }
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
        /* @__PURE__ */ jsx("a", { href: "mailto:hello@aethelred.gallery", className: "hover:text-ink", children: "hello@aethelred.gallery" }),
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
          children: "Aethelred"
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
        /* @__PURE__ */ jsx(IconLink, { to: "/favourites", label: "Favourites", count: favCount, Icon: Heart }),
        /* @__PURE__ */ jsx(IconLink, { to: "/cart", label: "Cart", count: cartCount, Icon: ShoppingBag }),
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
              /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-x-10 gap-y-5", children: aboutLinks.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: l.to, onClick: closeNow, className: "group block", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-display text-2xl italic text-ink group-hover:text-clay", children: l.label }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-relaxed text-detail", children: l.note })
              ] }) }, l.label)) })
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
              children: "Aethelred"
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
            /* @__PURE__ */ jsx(MobileNavLink, { to: "/bids", label: "My bids", onNavigate: () => setMobileOpen(false) }),
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
                /* @__PURE__ */ jsx("a", { href: "mailto:hello@aethelred.gallery", children: "hello@aethelred.gallery" })
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
                /* @__PURE__ */ jsx("a", { href: "#", children: "@aethelred.gallery" })
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
                " Aethelred Gallery"
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
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl italic text-ink", children: "Aethelred Gallery" }),
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
              children: "Aethelred Pay ↗"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-20 flex max-w-7xl items-center justify-between border-t border-ink/10 pt-8 text-[10px] uppercase tracking-[0.22em] text-detail/70", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Aethelred Gallery"
      ] }),
      /* @__PURE__ */ jsx("span", { children: "Privacy · Terms" })
    ] })
  ] });
}
const KEY = "aethelred.wallet.v1";
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
  const [id, setId] = useState("");
  const { setUser } = useAuthStore(
    useShallow((state2) => ({
      setUser: state2.setState
    }))
  );
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
function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
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
const LOCAL_STORAGE_KEY = "aethered_met_arkworks";
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
  const [currentCategory, setCurrentCategory] = React.useState(
    MET_ARTWORK_SEARCH_TERMS[0]
  );
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
    staleTime: 1e3 * 60 * 5
    // 5 minutes
    // No initialData from localStorage — that causes SSR hydration mismatches
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
const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  project_id: "6a1af0640028491c4086",
  str_id: "6a1af09d000ab6a109fa"
};
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
    let modBalance;
    if (bidBalance == 0) {
      modBalance = balance - bidAmount;
    } else if (bidBalance > 0 && bidAmount > bidBalance) {
      const amount = bidAmount - bidBalance;
      modBalance = balance - amount;
    } else if (bidBalance > 0 && bidAmount < bidBalance) {
      const amount = bidBalance - bidAmount;
      modBalance = balance + amount;
    } else {
      modBalance = 0;
    }
    const currentUserDoc = doc(db, "users", userID);
    await updateDoc(currentUserDoc, {
      wallet: {
        balance: modBalance,
        bidBalance: bidAmount
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
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
const fetchCollection = async ({
  collectionName,
  options = []
}) => {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...options);
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    toast.error({
      title: "Error loading data",
      description: error.message || "Failed to load collection",
      position: "top"
    });
    throw error;
  }
};
const fetchDocument = async ({
  collectionName,
  id
}) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document ${collectionName}/${id}:`, error);
    toast.error({
      title: "Error loading document",
      description: error.message || "Failed to load document",
      position: "top"
    });
    throw error;
  }
};
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
function useChicagoArtworksByCategory(category, limit = 20) {
  return useQuery(chicagoQueries.artworksByCategory(category, limit));
}
function useChicagoArtworksByArtist(artistName, limit = 20) {
  return useQuery(chicagoQueries.artworksByArtist(artistName, limit));
}
function useChicagoArtist(name) {
  return useQuery(chicagoQueries.artist(name));
}
const firebaseQuery = {
  getCollection: (collection2, options = []) => queryOptions({
    queryKey: [collection2, ...options.map((o) => JSON.stringify(o))],
    queryFn: () => fetchCollection({ collectionName: collection2, options }),
    enabled: !!collection2,
    staleTime: 1e3 * 60 * 5
    // 5 minutes
  }),
  getDocument: (collection2, id) => queryOptions({
    queryKey: [collection2, id],
    queryFn: () => fetchDocument({ collectionName: collection2, id })
  })
};
function useFirebaseQueryCollection(collection2, options = []) {
  return useQuery(firebaseQuery.getCollection(collection2, options));
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
  const defaultCategory = MET_ARTWORK_SEARCH_TERMS[0];
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
  const transactions = useFirebaseQueryCollection("transactions");
  const users = useFirebaseQueryCollection("users");
  const auctions = useFirebaseQueryCollection("auctions");
  const bids = useFirebaseQueryCollection("bids");
  const { setState } = useDataStore(
    useShallow((state) => ({
      setState: state.setState
    }))
  );
  const isLoading = transactions.isLoading || users.isLoading || auctions.isLoading || bids.isLoading;
  if (transactions.data && users.data) {
    setState({
      transactions: transactions.data,
      users: users.data,
      auctions: auctions.data,
      bids: bids.data
    });
  }
  return {
    transactions: transactions.data ?? [],
    users: users.data ?? [],
    auctions: auctions.data ?? [],
    bids: bids.data ?? [],
    isLoading,
    // You can also expose the raw query objects if needed
    queries: {
      transactions,
      users,
      auctions,
      bids
    }
  };
}
const FirebaseContext = createContext(null);
function FirebaseProvider({ children }) {
  const data = useFirebaseDataHook();
  return /* @__PURE__ */ jsx(FirebaseContext.Provider, { value: data, children });
}
function useAuthListener() {
  const { setUser, setLoading } = useAuthStore(
    useShallow((s) => ({
      setUser: s.setUser,
      setLoading: s.setLoading
    }))
  );
  useEffect(() => {
    setLoading(true, false);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = { id: userSnap.id, ...userSnap.data() };
          setUser(userData);
        } else {
          console.warn("[auth] No Firestore user doc for uid:", firebaseUser.uid);
          setUser(null);
        }
      } catch (error) {
        console.error("[auth] Failed to fetch user document:", error);
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setUser, setLoading]);
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
        status: "active",
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
        const userLogin = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", userLogin.user.uid);
        const currentUserDoc = await getDoc(userRef);
        if (currentUserDoc.exists()) {
          const props = { id: currentUserDoc.id, ...currentUserDoc.data() };
          setUser(props);
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
const Route$w = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aethelred — A Curated Exhibition of Contemporary Artworks" },
      {
        name: "description",
        content: "A curated digital exhibition of paintings, sculpture, photography and digital works from a small circle of contemporary artists."
      },
      { name: "author", content: "Aethelred Gallery" },
      {
        property: "og:title",
        content: "Aethelred — A Curated Exhibition"
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
});
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
  const { queryClient } = Route$w.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWallet = pathname === "/wallet" || pathname.startsWith("/wallet/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  useAuthListener();
  const { loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated
    }))
  );
  const showWalletLoader = isWallet && (loading || !isAuthHydrated);
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(StoreProvider, { children: /* @__PURE__ */ jsx(FirebaseProvider, { children: /* @__PURE__ */ jsx(WalletProvider, { children: /* @__PURE__ */ jsx(ToastProvider, { children: isAdmin ? /* @__PURE__ */ jsx("div", { className: "admin-theme min-h-screen", children: /* @__PURE__ */ jsx(Outlet, {}) }) : isWallet ? /* @__PURE__ */ jsx("div", { className: "wallet-theme flex min-h-screen flex-col", children: showWalletLoader ? /* @__PURE__ */ jsx(WalletLoader, { fullscreen: true, message: "Loading your wallet", showSkeleton: true }) : /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(Outlet, {}) }) }) : /* @__PURE__ */ jsx(ArtWorkProvider, { children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-canvas", children: [
      /* @__PURE__ */ jsx(MegaNav, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12, filter: "blur(100px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          exit: { opacity: 0, y: 0, filter: "blur(20000px)" },
          transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1]
          },
          children: /* @__PURE__ */ jsx(Outlet, {})
        },
        pathname
      ) }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] }) }) }) }) }) }),
    /* @__PURE__ */ jsx(ReactQueryDevtools, { initialIsOpen: false })
  ] });
}
const $$splitComponentImporter$u = () => import("./wallet-0QoCNI8G.js");
const Route$v = createFileRoute("/wallet")({
  component: lazyRouteComponent($$splitComponentImporter$u, "component"),
  head: () => ({
    meta: [{
      title: "EmberPay — Aethelred Wallet"
    }]
  })
});
const $$splitComponentImporter$t = () => import("./sell-93Jqs_NR.js");
const Route$u = createFileRoute("/sell")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component"),
  head: () => ({
    meta: [{
      title: "Sell your work — Aethelred"
    }]
  })
});
({
  year: (/* @__PURE__ */ new Date()).getFullYear()
});
const $$splitComponentImporter$s = () => import("./profile-DgZNUNNH.js");
const Route$t = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component"),
  head: () => ({
    meta: [{
      title: "Profile — Aethelred"
    }]
  })
});
const $$splitComponentImporter$r = () => import("./generate-B0gRVKGd.js");
const Route$s = createFileRoute("/generate")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./gallery-C1FMBhhc.js");
const Route$r = createFileRoute("/gallery")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component"),
  head: () => ({
    meta: [{
      title: "Gallery — Aethelred"
    }, {
      name: "description",
      content: "Browse the full exhibition with refined filters across price, size, medium, theme, technique, country and colour."
    }]
  })
});
const $$splitComponentImporter$p = () => import("./favourites-DiR31nTB.js");
const Route$q = createFileRoute("/favourites")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component"),
  head: () => ({
    meta: [{
      title: "Favourites — Aethelred"
    }]
  })
});
const $$splitComponentImporter$o = () => import("./contact-kS9ZdWPo.js");
const Route$p = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component"),
  head: () => ({
    meta: [{
      title: "Contact — Aethelred"
    }, {
      name: "description",
      content: "Contact the gallery for inquiries about artworks, artists, private viewings or acquisitions."
    }]
  })
});
const $$splitComponentImporter$n = () => import("./connect-DW0IVjDZ.js");
const Route$o = createFileRoute("/connect")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component"),
  head: () => ({
    meta: [{
      title: "Connect Wallet — Aethelred"
    }]
  })
});
const $$splitComponentImporter$m = () => import("./cart-DWQxiuTN.js");
const Route$n = createFileRoute("/cart")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component"),
  head: () => ({
    meta: [{
      title: "Cart — Aethelred"
    }]
  })
});
const $$splitComponentImporter$l = () => import("./bids-CLF5izT1.js");
const Route$m = createFileRoute("/bids")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component"),
  head: () => ({
    meta: [{
      title: "My Bids — Aethelred"
    }]
  })
});
const $$splitComponentImporter$k = () => import("./admin-Yb8fFAo4.js");
const Route$l = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component"),
  head: () => ({
    meta: [{
      title: "Console — Aethelred Admin"
    }, {
      name: "description",
      content: "Operational control center for the Aethelred exhibition and wallet."
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  })
});
const $$splitComponentImporter$j = () => import("./about-BOyqfET6.js");
const Route$k = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component"),
  head: () => ({
    meta: [{
      title: "About — Aethelred"
    }, {
      name: "description",
      content: "Aethelred is a quiet digital gallery dedicated to slow, considered work from a small circle of contemporary artists."
    }]
  })
});
const $$splitComponentImporter$i = () => import("./index-DKpXxtof.js");
const Route$j = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component"),
  head: () => ({
    meta: [{
      title: "Aethelred — A Curated Exhibition of Contemporary Artworks"
    }, {
      name: "description",
      content: "Quiet, considered works from a small circle of contemporary artists. Browse the current exhibition by category, artist or medium."
    }]
  })
});
const $$splitComponentImporter$h = () => import("./categories.index-DqgxlQZE.js");
const Route$i = createFileRoute("/categories/")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component"),
  head: () => ({
    meta: [{
      title: "Categories — Aethelred"
    }, {
      name: "description",
      content: "Eight modes of design: abstract, figurative, minimalism, sculpture, photography, digital, mixed media and ceramics."
    }]
  })
});
const $$splitComponentImporter$g = () => import("./auctions.index-CHSwsFxI.js");
const Route$h = createFileRoute("/auctions/")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component"),
  head: () => ({
    meta: [{
      title: "Live Auction — Aethelred"
    }, {
      name: "description",
      content: "Bid on a curated selection of contemporary artworks across painting, sculpture, photography and ceramics. Live lots, timed closings."
    }]
  })
});
const $$splitComponentImporter$f = () => import("./artists.index-BKUu4g-x.js");
const Route$g = createFileRoute("/artists/")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component"),
  head: () => ({
    meta: [{
      title: "Artists — Aethelred"
    }, {
      name: "description",
      content: "The five artists in the current exhibition — ceramicists, sculptors, photographers and digital practitioners."
    }]
  })
});
const $$splitComponentImporter$e = () => import("./admin.index-CLAfsbF_.js");
const Route$f = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./wallet.withdraw-DqF0EYXQ.js");
const Route$e = createFileRoute("/wallet/withdraw")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
  head: () => ({
    meta: [{
      title: "Withdraw — EmberPay"
    }]
  })
});
const $$splitComponentImporter$c = () => import("./wallet.send-CmM5hq9u.js");
const Route$d = createFileRoute("/wallet/send")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  head: () => ({
    meta: [{
      title: "Send — EmberPay"
    }]
  })
});
const $$splitComponentImporter$b = () => import("./wallet.security-DTgNC3pT.js");
const Route$c = createFileRoute("/wallet/security")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  head: () => ({
    meta: [{
      title: "Security — EmberPay"
    }]
  })
});
const $$splitComponentImporter$a = () => import("./wallet.deposit-DeDUGShI.js");
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
const $$splitComponentImporter$9 = () => import("./wallet.activity-BpmMjJma.js");
const Route$a = createFileRoute("/wallet/activity")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  head: () => ({
    meta: [{
      title: "Activity — EmberPay"
    }]
  })
});
const $$splitComponentImporter$8 = () => import("./categories._slug-CtECjSPU.js");
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
      title: `${loaderData?.category.label ?? "Category"} — Aethelred`
    }, {
      name: "description",
      content: loaderData?.category.description ?? "Browse this mode of design within the current exhibition."
    }]
  })
});
const $$splitComponentImporter$7 = () => import("./auctions.mine-KCgW2x_R.js");
const Route$8 = createFileRoute("/auctions/mine")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
  head: () => ({
    meta: [{
      title: "My Auctions — Aethelred"
    }, {
      name: "description",
      content: "View and manage all auction lots you've consigned."
    }]
  })
});
const $$splitComponentImporter$6 = () => import("./auctions._slug-Dbjh2uwg.js");
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
  //         ? `Lot ${loaderData.lot.lotNumber} · ${loaderData.lot.title} — Aethelred Auction`
  //         : "Auction lot — Aethelred",
  //     },
  //     { name: "description", content: loaderData?.lot.description ?? "" },
  //   ],
  // }),
});
const $$splitComponentImporter$5 = () => import("./artworks._slug-DB8pIFdc.js");
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
  //         ? `${loaderData.artwork.title} — ${loaderData.artwork.artist} — Aethelred`
  //         : "Artwork — Aethelred",
  //     },
  //     {
  //       name: "description",
  //       content: loaderData?.artwork.description ?? "",
  //     },
  //   ],
  // }),
});
const $$splitComponentImporter$4 = () => import("./artists._slug-Bmmar7p_.js");
const Route$5 = createFileRoute("/artists/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
  // loader: ({ params }) => {
  //   const artist = getArtist(params.slug);
  //   if (!artist) throw notFound();
  //   return { artist };
  // },
  // head: ({ loaderData }) => ({
  //   meta: [
  //     { title: `${loaderData?.artist.name ?? "Artist"} — Aethelred` },
  //     { name: "description", content: loaderData?.artist.short ?? "" },
  //   ],
  // }),
});
const $$splitComponentImporter$3 = () => import("./admin.wallet-DOKdP54B.js");
const Route$4 = createFileRoute("/admin/wallet")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.exhibition-D9kGBJVW.js");
const Route$3 = createFileRoute("/admin/exhibition")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.account-DgYNdOYV.js");
const Route$2 = createFileRoute("/admin/account")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.users.index-DotsZsOG.js");
const Route$1 = createFileRoute("/admin/users/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
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
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: `inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${positive ? "bg-[var(--a-pos)]/15 text-[var(--a-pos)]" : "bg-[var(--a-neg)]/15 text-[var(--a-neg)]"}`,
              children: [
                positive ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "size-3" }),
                Math.abs(delta).toFixed(1),
                "%"
              ]
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
  completed: "bg-[var(--a-pos)]/15 text-[var(--a-pos)]",
  pending: "bg-[var(--a-warn)]/18 text-[var(--a-warn)]",
  review: "bg-[var(--a-info)]/18 text-[var(--a-info)]",
  suspended: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]",
  failed: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]",
  leading: "bg-[var(--a-warn)]/18 text-[var(--a-warn)]",
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
  return /* @__PURE__ */ jsx("div", { className: "mb-5 inline-flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-1", children: tabs.map((t) => {
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
    return draft[key] !== void 0 ? draft[key] : record[key];
  }
  function handleSave() {
    if (onSave && Object.keys(draft).length) onSave(draft);
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
  const cls = "w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-sm text-[var(--a-fg)] outline-none focus:border-[var(--a-border-hi)]";
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
    email: name.toLowerCase().replace(/[^a-z]+/g, ".") + "@aethelred.art",
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
const adminActivity = [
  {
    id: "a1",
    kind: "deposit",
    who: "Iris Okafor",
    detail: "topped up wallet",
    amount: 1200,
    at: "just now"
  },
  {
    id: "a2",
    kind: "bid",
    who: "Mateo Alvarez",
    detail: "bid on 'Quiet Tide'",
    amount: 4800,
    at: "2m"
  },
  { id: "a3", kind: "signup", who: "Wren Petrova", detail: "joined the platform", at: "6m" },
  {
    id: "a4",
    kind: "sale",
    who: "Yuki Tanaka",
    detail: "sold 'Marble Hour'",
    amount: 9200,
    at: "14m"
  },
  {
    id: "a5",
    kind: "withdraw",
    who: "Idris Bah",
    detail: "requested payout",
    amount: 540,
    at: "22m"
  },
  { id: "a6", kind: "listing", who: "Aisha Bello", detail: "listed 3 new works", at: "1h" },
  {
    id: "a7",
    kind: "bid",
    who: "Lukas Berg",
    detail: "bid on 'Untitled No. 7'",
    amount: 2300,
    at: "1h"
  },
  {
    id: "a8",
    kind: "deposit",
    who: "Noor Haddad",
    detail: "topped up wallet",
    amount: 420,
    at: "2h"
  },
  { id: "a9", kind: "sale", who: "Hana Kim", detail: "sold 'Pale Garden'", amount: 3100, at: "3h" }
];
const revenueSeries = Array.from({ length: 30 }).map((_, i) => {
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
  revenue: { value: 184250, delta: 12.4 },
  volume24h: { value: 92140, delta: -3.1 },
  activeAuctions: { value: 27, delta: 6 },
  newUsers: { value: 318, delta: 8.2 }
};
const pendingKyc = adminUsers.filter((u) => u.status === "pending").slice(0, 5).map((u) => ({ id: u.id, name: u.name, email: u.email, submitted: "2d ago" }));
const pendingWithdrawals = adminTxs.filter((t) => t.type === "withdraw" && t.status === "pending").slice(0, 6);
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
function getUserActivity(userId) {
  const idx = adminUsers.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  const user = adminUsers[idx];
  const pick = (arr, n, offset = 0) => Array.from({ length: n }, (_, i) => arr[(idx * 3 + offset + i * 2) % arr.length]);
  const bidArts = pick(artworks, 4);
  const bids = bidArts.map((a, i) => ({
    id: `bid_${idx}_${i}`,
    lotTitle: a.title,
    lotSlug: a.slug,
    amount: Math.round(a.price * (0.5 + (i + idx) % 5 * 0.1)),
    status: ["leading", "outbid", "won", "lost"][(idx + i) % 4],
    at: isoDaysAgo(((i + 1) * 2 + idx) % 20)
  }));
  const orderArts = pick(artworks, 3, 5);
  const orders = orderArts.map((a, i) => ({
    id: `ord_${idx}_${i}`,
    artworkTitle: a.title,
    artworkSlug: a.slug,
    image: a.image,
    amount: a.price,
    status: ["delivered", "shipped", "processing", "refunded"][(idx + i) % 4],
    at: isoDaysAgo(((i + 1) * 7 + idx) % 90)
  }));
  const favArts = pick(artworks, 6, 9);
  const favourites = favArts.map((a) => ({
    slug: a.slug,
    title: a.title,
    artist: a.artist,
    image: a.image,
    price: a.price
  }));
  const userTxs = adminTxs.filter((_, i) => (i + idx) % 4 !== 0).slice(0, 14).map((t) => ({ ...t, user: user.name, email: user.email }));
  const wallet = {
    available: user.balance,
    pending: Math.round(user.balance * 0.18),
    inEscrow: Math.round(user.balance * 0.32),
    lifetimeIn: Math.round(user.balance * 4.5),
    lifetimeOut: Math.round(user.balance * 2.1),
    feesPaid: Math.round(user.balance * 0.07),
    accountNumber: `AE-${1e3 + idx}-${idx * 7919 % 9e3 + 1e3}`,
    kycLevel: user.status === "pending" ? "Tier 1 · review" : user.status === "suspended" ? "Suspended" : "Tier 2 · verified",
    twoFactor: idx % 3 !== 0,
    devices: 1 + idx % 3
  };
  const series = Array.from({ length: 14 }).map((_, i) => ({
    day: `D${i + 1}`,
    balance: Math.max(
      120,
      Math.round(user.balance * (0.6 + Math.sin((i + idx) / 2) * 0.2 + i / 14 * 0.4))
    )
  }));
  const notes = [
    {
      id: "n1",
      author: "Avery Doss",
      body: "KYC docs verified manually. Cleared for higher withdrawal tier.",
      at: isoDaysAgo(3)
    },
    { id: "n2", author: "System", body: "Login from new device (Lisbon, PT).", at: isoDaysAgo(8) }
  ];
  return { user, bids, orders, favourites, txs: userTxs, wallet, series, notes };
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
const Route = createFileRoute("/admin/users/$id")({
  component: UserDetail
});
function UserDetail() {
  const { id } = useParams({ from: "/admin/users/$id" });
  const data = getUserActivity(id);
  const [bids, setBids] = useState(data?.bids ?? []);
  const [orders, setOrders] = useState(data?.orders ?? []);
  const [txs, setTxs] = useState(data?.txs ?? []);
  const [favourites, setFavourites] = useState(data?.favourites ?? []);
  const [notes, setNotes] = useState(data?.notes ?? []);
  const [target, setTarget] = useState(null);
  const favRows = useMemo(() => favourites.map((f) => ({ ...f, id: f.slug })), [favourites]);
  if (!data) {
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
  const { user, wallet, series } = data;
  const initials = user.name.split(" ").map((p) => p[0]).join("").slice(0, 2);
  const close = () => setTarget(null);
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
                style: { background: user.avatar },
                children: initials
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-extrabold tracking-tight text-[var(--a-fg)]", children: user.name }),
                /* @__PURE__ */ jsx(StatusChip, { value: user.status }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-[var(--a-border-hi)] bg-[var(--a-accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)]", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: "size-3" }),
                  " ",
                  user.role
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--a-muted)]", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "size-3" }),
                  " ",
                  user.email
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "size-3" }),
                  " Joined ",
                  fmtDateTime(user.joined)
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "size-3" }),
                  " Lisbon, PT"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "a-mono", children: wallet.accountNumber })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: [
              /* @__PURE__ */ jsx(Mail, { className: "size-3.5" }),
              " Message"
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]", children: [
              /* @__PURE__ */ jsx(KeyRound, { className: "size-3.5" }),
              " Reset password"
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-neg)] hover:bg-[var(--a-neg)]/10", children: [
              /* @__PURE__ */ jsx(Ban, { className: "size-3.5" }),
              " Suspend"
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3.5" }),
              " Approve"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(WalletStat, { label: "Available", value: fmtMoney(wallet.available), accent: true }),
      /* @__PURE__ */ jsx(WalletStat, { label: "Pending", value: fmtMoney(wallet.pending) }),
      /* @__PURE__ */ jsx(WalletStat, { label: "In escrow", value: fmtMoney(wallet.inEscrow) }),
      /* @__PURE__ */ jsx(WalletStat, { label: "Lifetime fees", value: fmtMoney(wallet.feesPaid) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-8",
          eyebrow: "Last 14 days",
          title: "Wallet balance trend",
          delay: 0.1,
          action: /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)] hover:text-[var(--a-fg)]", children: [
            /* @__PURE__ */ jsx(Download, { className: "size-3" }),
            " Export"
          ] }),
          children: /* @__PURE__ */ jsx("div", { className: "h-[240px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: series, margin: { left: -18, right: 8, top: 8, bottom: 0 }, children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "u-bal", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--a-accent)", stopOpacity: 0.5 }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--a-accent)", stopOpacity: 0 })
            ] }) }),
            /* @__PURE__ */ jsx(CartesianGrid, { stroke: "var(--a-border)", vertical: false }),
            /* @__PURE__ */ jsx(
              XAxis,
              {
                dataKey: "day",
                stroke: "var(--a-faint)",
                tick: { fontSize: 10 },
                tickLine: false,
                axisLine: false
              }
            ),
            /* @__PURE__ */ jsx(
              YAxis,
              {
                stroke: "var(--a-faint)",
                tick: { fontSize: 10 },
                tickLine: false,
                axisLine: false,
                width: 48
              }
            ),
            /* @__PURE__ */ jsx(
              Tooltip,
              {
                contentStyle: {
                  background: "var(--a-bg-2)",
                  border: "1px solid var(--a-border-hi)",
                  borderRadius: 8,
                  fontSize: 12
                },
                labelStyle: { color: "var(--a-muted)" }
              }
            ),
            /* @__PURE__ */ jsx(
              Area,
              {
                type: "monotone",
                dataKey: "balance",
                stroke: "var(--a-accent)",
                strokeWidth: 2,
                fill: "url(#u-bal)"
              }
            )
          ] }) }) })
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-4",
          eyebrow: "Security",
          title: "Account integrity",
          delay: 0.14,
          children: /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-xs", children: [
            /* @__PURE__ */ jsx(SecRow, { icon: ShieldCheck, label: "KYC", value: wallet.kycLevel, good: true }),
            /* @__PURE__ */ jsx(
              SecRow,
              {
                icon: KeyRound,
                label: "2FA",
                value: wallet.twoFactor ? "Enabled" : "Disabled",
                good: wallet.twoFactor
              }
            ),
            /* @__PURE__ */ jsx(SecRow, { icon: Smartphone, label: "Active devices", value: `${wallet.devices} trusted` }),
            /* @__PURE__ */ jsx(SecRow, { icon: Wallet, label: "Lifetime inflow", value: fmtMoney(wallet.lifetimeIn) }),
            /* @__PURE__ */ jsx(
              SecRow,
              {
                icon: RefreshCw,
                label: "Lifetime outflow",
                value: fmtMoney(wallet.lifetimeOut)
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-7",
          eyebrow: "Exhibition · Bidding",
          title: "Active & past bids",
          delay: 0.18,
          action: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]", children: [
            /* @__PURE__ */ jsx(Gavel, { className: "size-3" }),
            " ",
            bids.length,
            " total"
          ] }),
          children: /* @__PURE__ */ jsx(
            DataTable,
            {
              rows: bids,
              onRowClick: (r) => setTarget({ kind: "bid", row: r }),
              columns: [
                {
                  key: "lot",
                  header: "Lot",
                  render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "grid size-7 place-items-center rounded bg-[var(--a-surface-2)] text-[var(--a-accent)]", children: /* @__PURE__ */ jsx(Gavel, { className: "size-3" }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.lotTitle })
                  ] })
                },
                {
                  key: "amount",
                  header: "Bid",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.amount) })
                },
                { key: "status", header: "Status", render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status }) },
                {
                  key: "at",
                  header: "When",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.at) })
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
          eyebrow: "Exhibition · Purchases",
          title: "Orders",
          delay: 0.22,
          action: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]", children: [
            /* @__PURE__ */ jsx(Package, { className: "size-3" }),
            " ",
            orders.length,
            " total"
          ] }),
          children: /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: orders.map((o) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTarget({ kind: "order", row: o }),
              className: "flex w-full items-center gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5 text-left transition hover:border-[var(--a-border-hi)] hover:bg-[var(--a-surface)]",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: o.image,
                    alt: o.artworkTitle,
                    className: "size-12 rounded object-cover"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-[var(--a-fg)]", children: o.artworkTitle }),
                  /* @__PURE__ */ jsxs("p", { className: "a-mono text-[10px] text-[var(--a-muted)]", children: [
                    o.id,
                    " · ",
                    fmtDateTime(o.at)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(o.amount) }),
                  /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx(StatusChip, { value: o.status }) })
                ] })
              ]
            }
          ) }, o.id)) })
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-8",
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
              rows: txs,
              onRowClick: (r) => setTarget({ kind: "tx", row: r }),
              columns: [
                {
                  key: "id",
                  header: "Tx ID",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-muted)]", children: r.id })
                },
                {
                  key: "type",
                  header: "Type",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]", children: r.type })
                },
                {
                  key: "method",
                  header: "Method",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-fg-2)]", children: r.method })
                },
                {
                  key: "amount",
                  header: "Amount",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.amount) })
                },
                { key: "status", header: "Status", render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status }) },
                {
                  key: "at",
                  header: "When",
                  render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.createdAt) })
                }
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-4",
          eyebrow: "Exhibition · Watchlist",
          title: "Favourited works",
          delay: 0.3,
          action: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]", children: [
            /* @__PURE__ */ jsx(Heart, { className: "size-3" }),
            " ",
            favourites.length
          ] }),
          children: /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-2", children: favRows.slice(0, 6).map((f) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTarget({ kind: "fav", row: f }),
              className: "block w-full overflow-hidden rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] text-left transition hover:border-[var(--a-border-hi)]",
              children: [
                /* @__PURE__ */ jsx("img", { src: f.image, alt: f.title, className: "aspect-square w-full object-cover" }),
                /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "truncate text-[10px] font-semibold text-[var(--a-fg)]", children: f.title }),
                  /* @__PURE__ */ jsx("p", { className: "a-mono text-[10px] text-[var(--a-accent)]", children: fmtMoney(f.price) })
                ] })
              ]
            }
          ) }, f.slug)) })
        }
      ),
      /* @__PURE__ */ jsx(
        BentoCard,
        {
          className: "lg:col-span-12",
          eyebrow: "Internal",
          title: "Admin notes",
          delay: 0.34,
          action: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                const id2 = `n_${Date.now().toString(36)}`;
                const userNotes = {
                  id: id2,
                  at: (/* @__PURE__ */ new Date()).toISOString(),
                  author: "",
                  body: ""
                };
                setTarget({ kind: "note", row: userNotes });
              },
              className: "inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]",
              children: [
                /* @__PURE__ */ jsx(FileText, { className: "size-3" }),
                " Add note"
              ]
            }
          ),
          children: /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: notes.map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTarget({ kind: "note", row: n }),
              className: "flex w-full items-start gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-3 text-left transition hover:border-[var(--a-border-hi)]",
              children: [
                /* @__PURE__ */ jsx("span", { className: "grid size-8 place-items-center rounded bg-[var(--a-accent-2-soft)] text-[10px] font-bold text-[var(--a-accent-2)]", children: n.author.split(" ").map((p) => p[0]).join("").slice(0, 2) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: n.author }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--a-faint)]", children: fmtDateTime(n.at) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-[var(--a-fg-2)]", children: n.body || "(empty — click to edit)" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "grid size-7 place-items-center rounded text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "size-3.5" }) })
              ]
            }
          ) }, n.id)) })
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
        subtitle: `Lot ${target.row.lotSlug}`,
        record: target.row,
        fields: bidFields,
        onSave: (patch) => {
          setBids((prev) => prev.map((b) => b.id === target.row.id ? { ...b, ...patch } : b));
          close();
        },
        operations: [
          {
            id: "mark-leading",
            label: "Mark leading",
            icon: Crown,
            tone: "primary",
            onRun: () => {
              setBids(
                (prev) => prev.map((b) => b.id === target.row.id ? { ...b, status: "leading" } : b)
              );
              close();
            }
          },
          {
            id: "mark-won",
            label: "Mark won",
            icon: CheckCircle2,
            tone: "success",
            onRun: () => {
              setBids(
                (prev) => prev.map((b) => b.id === target.row.id ? { ...b, status: "won" } : b)
              );
              close();
            }
          },
          {
            id: "withdraw",
            label: "Withdraw bid",
            icon: XCircle,
            tone: "danger",
            confirm: "Withdraw this bid?",
            onRun: () => {
              setBids((prev) => prev.filter((b) => b.id !== target.row.id));
              close();
            }
          }
        ]
      }
    ),
    target?.kind === "order" && /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open: true,
        onOpenChange: (o) => !o && close(),
        eyebrow: "Order",
        title: target.row.artworkTitle,
        subtitle: `Order ${target.row.id}`,
        record: target.row,
        fields: orderFields,
        extra: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-2", children: "Artwork" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: target.row.image,
              alt: target.row.artworkTitle,
              className: "w-full rounded-md border border-[var(--a-border)] object-cover"
            }
          )
        ] }),
        onSave: (patch) => {
          setOrders((prev) => prev.map((o) => o.id === target.row.id ? { ...o, ...patch } : o));
          close();
        },
        operations: [
          {
            id: "ship",
            label: "Mark shipped",
            icon: Truck,
            tone: "primary",
            onRun: () => {
              setOrders(
                (prev) => prev.map((o) => o.id === target.row.id ? { ...o, status: "shipped" } : o)
              );
              close();
            }
          },
          {
            id: "deliver",
            label: "Mark delivered",
            icon: CheckCircle2,
            tone: "success",
            onRun: () => {
              setOrders(
                (prev) => prev.map((o) => o.id === target.row.id ? { ...o, status: "delivered" } : o)
              );
              close();
            }
          },
          {
            id: "refund",
            label: "Refund",
            icon: RotateCcw,
            tone: "danger",
            confirm: "Refund this order?",
            onRun: () => {
              setOrders(
                (prev) => prev.map((o) => o.id === target.row.id ? { ...o, status: "refunded" } : o)
              );
              close();
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
        onSave: (patch) => {
          setTxs((prev) => prev.map((t) => t.id === target.row.id ? { ...t, ...patch } : t));
          close();
        },
        operations: [
          {
            id: "approve",
            label: "Approve",
            icon: CheckCircle2,
            tone: "success",
            onRun: () => {
              setTxs(
                (prev) => prev.map((t) => t.id === target.row.id ? { ...t, status: "completed" } : t)
              );
              close();
            }
          },
          {
            id: "review",
            label: "Flag for review",
            icon: RefreshCw,
            onRun: () => {
              setTxs(
                (prev) => prev.map((t) => t.id === target.row.id ? { ...t, status: "review" } : t)
              );
              close();
            }
          },
          {
            id: "fail",
            label: "Mark failed",
            icon: XCircle,
            tone: "danger",
            confirm: "Mark this transaction as failed?",
            onRun: () => {
              setTxs(
                (prev) => prev.map((t) => t.id === target.row.id ? { ...t, status: "failed" } : t)
              );
              close();
            }
          }
        ]
      }
    ),
    target?.kind === "fav" && /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open: true,
        onOpenChange: (o) => !o && close(),
        eyebrow: "Watchlist",
        title: target.row.title,
        subtitle: target.row.artist,
        record: target.row,
        fields: favFields,
        extra: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "a-eyebrow mb-2", children: "Preview" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: target.row.image,
              alt: target.row.title,
              className: "w-full rounded-md border border-[var(--a-border)] object-cover"
            }
          )
        ] }),
        onSave: (patch) => {
          setFavourites(
            (prev) => prev.map((f) => f.slug === target.row.slug ? { ...f, ...patch } : f)
          );
          close();
        },
        operations: [
          {
            id: "remove",
            label: "Remove from watchlist",
            icon: Trash2,
            tone: "danger",
            confirm: "Remove this artwork from the user's watchlist?",
            onRun: () => {
              setFavourites((prev) => prev.filter((f) => f.slug !== target.row.slug));
              close();
            }
          }
        ]
      }
    ),
    target?.kind === "note" && /* @__PURE__ */ jsx(
      RecordSheet,
      {
        open: true,
        onOpenChange: (o) => !o && close(),
        eyebrow: "Admin note",
        title: target.row.author,
        subtitle: fmtDateTime(target.row.at),
        record: target.row,
        fields: noteFields,
        onSave: (patch) => {
          setNotes((prev) => prev.map((n) => n.id === target.row.id ? { ...n, ...patch } : n));
          close();
        },
        operations: [
          {
            id: "delete",
            label: "Delete note",
            icon: Trash2,
            tone: "danger",
            confirm: "Delete this note?",
            onRun: () => {
              setNotes((prev) => prev.filter((n) => n.id !== target.row.id));
              close();
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
  { key: "lotSlug", label: "Lot slug", kind: "readonly" },
  { key: "amount", label: "Bid amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "leading", label: "Leading" },
      { value: "outbid", label: "Outbid" },
      { value: "won", label: "Won" },
      { value: "lost", label: "Lost" }
    ]
  },
  { key: "at", label: "Placed at", kind: "readonly", render: (v) => fmtDateTime(String(v)) }
];
const orderFields = [
  { key: "id", label: "Order ID", kind: "readonly" },
  { key: "artworkTitle", label: "Artwork", editable: true },
  { key: "artworkSlug", label: "Slug", kind: "readonly" },
  { key: "amount", label: "Amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "refunded", label: "Refunded" }
    ]
  },
  { key: "at", label: "Placed at", kind: "readonly", render: (v) => fmtDateTime(String(v)) }
];
const txFields = [
  { key: "id", label: "Tx ID", kind: "readonly" },
  { key: "user", label: "User", kind: "readonly" },
  { key: "email", label: "Email", kind: "readonly" },
  {
    key: "type",
    label: "Type",
    kind: "select",
    editable: true,
    options: [
      { value: "deposit", label: "Deposit" },
      { value: "withdraw", label: "Withdraw" },
      { value: "transfer", label: "Transfer" },
      { value: "purchase", label: "Purchase" },
      { value: "sale", label: "Sale" }
    ]
  },
  { key: "method", label: "Method", editable: true },
  { key: "amount", label: "Amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "completed", label: "Completed" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "review", label: "Review" }
    ]
  },
  { key: "createdAt", label: "Created", kind: "readonly", render: (v) => fmtDateTime(String(v)) }
];
const favFields = [
  { key: "slug", label: "Slug", kind: "readonly" },
  { key: "title", label: "Title", editable: true },
  { key: "artist", label: "Artist", editable: true },
  { key: "price", label: "Listed price", kind: "money", editable: true }
];
const noteFields = [
  { key: "id", label: "Note ID", kind: "readonly" },
  { key: "author", label: "Author", editable: true },
  { key: "at", label: "Created", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
  { key: "body", label: "Body", kind: "textarea", editable: true, span: 2 }
];
function WalletStat({ label, value, accent }) {
  return /* @__PURE__ */ jsxs("div", { className: `a-card-elev p-4 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`, children: [
    /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: label }),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: `font-display mt-1.5 text-2xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`,
        children: value
      }
    )
  ] });
}
function SecRow({
  icon: Icon,
  label,
  value,
  good
}) {
  return /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5", children: [
    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-[var(--a-muted)]", children: [
      /* @__PURE__ */ jsx(Icon, { className: "size-3.5" }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-[var(--a-fg-2)]", children: label })
    ] }),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: `a-mono text-xs font-bold ${good ? "text-[var(--a-pos)]" : "text-[var(--a-fg)]"}`,
        children: value
      }
    )
  ] });
}
const WalletRoute = Route$v.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => Route$w
});
const SellRoute = Route$u.update({
  id: "/sell",
  path: "/sell",
  getParentRoute: () => Route$w
});
const ProfileRoute = Route$t.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$w
});
const GenerateRoute = Route$s.update({
  id: "/generate",
  path: "/generate",
  getParentRoute: () => Route$w
});
const GalleryRoute = Route$r.update({
  id: "/gallery",
  path: "/gallery",
  getParentRoute: () => Route$w
});
const FavouritesRoute = Route$q.update({
  id: "/favourites",
  path: "/favourites",
  getParentRoute: () => Route$w
});
const ContactRoute = Route$p.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$w
});
const ConnectRoute = Route$o.update({
  id: "/connect",
  path: "/connect",
  getParentRoute: () => Route$w
});
const CartRoute = Route$n.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$w
});
const BidsRoute = Route$m.update({
  id: "/bids",
  path: "/bids",
  getParentRoute: () => Route$w
});
const AdminRoute = Route$l.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$w
});
const AboutRoute = Route$k.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$w
});
const IndexRoute = Route$j.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$w
});
const CategoriesIndexRoute = Route$i.update({
  id: "/categories/",
  path: "/categories/",
  getParentRoute: () => Route$w
});
const AuctionsIndexRoute = Route$h.update({
  id: "/auctions/",
  path: "/auctions/",
  getParentRoute: () => Route$w
});
const ArtistsIndexRoute = Route$g.update({
  id: "/artists/",
  path: "/artists/",
  getParentRoute: () => Route$w
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
  getParentRoute: () => Route$w
});
const AuctionsMineRoute = Route$8.update({
  id: "/auctions/mine",
  path: "/auctions/mine",
  getParentRoute: () => Route$w
});
const AuctionsSlugRoute = Route$7.update({
  id: "/auctions/$slug",
  path: "/auctions/$slug",
  getParentRoute: () => Route$w
});
const ArtworksSlugRoute = Route$6.update({
  id: "/artworks/$slug",
  path: "/artworks/$slug",
  getParentRoute: () => Route$w
});
const ArtistsSlugRoute = Route$5.update({
  id: "/artists/$slug",
  path: "/artists/$slug",
  getParentRoute: () => Route$w
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
const routeTree = Route$w._addFileChildren(rootRouteChildren)._addFileTypes();
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
  art05 as $,
  useArtInstitute as A,
  SelectTrigger as B,
  SelectValue as C,
  SelectContent as D,
  SelectGroup as E,
  SelectItem as F,
  artists as G,
  SectionHeader as H,
  overviewKpis as I,
  BentoCard as J,
  KpiTile as K,
  revenueSeries as L,
  adminActivity as M,
  fmtMoney as N,
  pendingWithdrawals as O,
  pendingKyc as P,
  copyClipboard as Q,
  makeToken as R,
  Select as S,
  Err as T,
  TX_LABEL as U,
  Route$9 as V,
  WalletLoader as W,
  getArtworksByCategory as X,
  handleWalletBalance as Y,
  db as Z,
  metApi as _,
  useToast as a,
  art02 as a0,
  art07 as a1,
  art11 as a2,
  art04 as a3,
  art06 as a4,
  art12 as a5,
  art08 as a6,
  useChicagoArtist as a7,
  useChicagoArtworksByArtist as a8,
  changeChicagoToMod as a9,
  adminTxs as aa,
  adminUsers as ab,
  TabBar as ac,
  DataTable as ad,
  StatusChip as ae,
  RecordSheet as af,
  router as ag,
  useAuthStore as b,
  useDataStore as c,
  toast as d,
  useStore as e,
  formatMoney as f,
  getUserName as g,
  fmtDateTime as h,
  cn as i,
  filterOptions as j,
  formatPrice as k,
  categories as l,
  useMetArtworks as m,
  useChicagoArtworksByCategory as n,
  changeMetArtWorkProps as o,
  photoFN as p,
  useArtworkContext as q,
  findObj as r,
  getArtworkBySlug as s,
  txSign as t,
  useAuth as u,
  art09 as v,
  art10 as w,
  art01 as x,
  art03 as y,
  artworks as z
};
