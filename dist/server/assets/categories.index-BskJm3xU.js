import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { y as useArtworkContext, r as categories } from "./router-BX1vAgXZ.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react";
import "react-dom";
import "lucide-react";
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
function CategoriesIndex() {
  const {
    artworks
  } = useArtworkContext();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Browse by", title: "Modes of Design", description: "The works in this exhibition are arranged into eight modes — each a different relationship between material, gesture and intent." }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-2", children: categories.map((c) => {
      const count = artworks.filter((a) => a.category === c.slug).length;
      return /* @__PURE__ */ jsxs(Link, { to: "/categories/$slug", params: {
        slug: c.slug
      }, className: "group flex flex-col gap-4 bg-canvas p-10 transition-colors hover:bg-surface", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: String(categories.indexOf(c) + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
            count,
            " ",
            count === 1 ? "work" : "works"
          ] })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-5xl italic", children: c.label }),
        /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm leading-relaxed text-detail", children: c.description }),
        /* @__PURE__ */ jsx("span", { className: "mt-4 text-[11px] uppercase tracking-[0.22em] text-ink group-hover:text-clay", children: "View works →" })
      ] }, c.slug);
    }) }) })
  ] });
}
export {
  CategoriesIndex as component
};
