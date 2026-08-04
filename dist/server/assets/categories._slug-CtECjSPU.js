import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { V as Route, q as useArtworkContext, X as getArtworksByCategory } from "./router-07wj3SDc.js";
import { C as CategoryChips, M as MasonryGallery } from "./CategoryChips-DHIDM8fS.js";
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
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "./ArtworkCard-myx8HeRA.js";
import "./SmartImage-BnUWDzq7.js";
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
