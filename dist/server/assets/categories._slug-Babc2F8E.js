import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { a3 as Route, y as useArtworkContext, a4 as getArtworksByCategory } from "./router-BX1vAgXZ.js";
import { C as CategoryChips, M as MasonryGallery } from "./CategoryChips-B0nPtcvZ.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { useMemo } from "react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@tanstack/react-query-devtools";
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
import "./ArtworkCard-DFFAVlfH.js";
import "./Loader-BKqcHLqb.js";
function CategoryPage() {
  const {
    category
  } = Route.useLoaderData();
  const {
    artworks
  } = useArtworkContext();
  const works = useMemo(() => getArtworksByCategory(category.slug, artworks), [artworks, category]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Mode of design", title: category.label, description: category.description }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pb-10", children: /* @__PURE__ */ jsx(CategoryChips, { active: category.slug }) }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32 pt-10", children: /* @__PURE__ */ jsx(MasonryGallery, { artworks: works }) })
  ] });
}
export {
  CategoryPage as component
};
