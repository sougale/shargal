import { jsx, jsxs } from "react/jsx-runtime";
import { A as ArtworkCard } from "./ArtworkCard-DFFAVlfH.js";
import { L as Loader } from "./Loader-BKqcHLqb.js";
import { Link } from "@tanstack/react-router";
import { r as categories } from "./router-BX1vAgXZ.js";
function MasonryGallery({ artworks, loading }) {
  if (loading) return /* @__PURE__ */ jsx(Loader, { message: "Loading Artworks...", size: "sm", variant: "soft" });
  return /* @__PURE__ */ jsx("div", { className: "columns-1 gap-8 md:columns-2 lg:columns-3", children: artworks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-24 text-center text-sm text-detail", children: "No works in this category yet." }) : artworks.map((a, i) => /* @__PURE__ */ jsx(ArtworkCard, { artwork: a, priority: i < 3 }, a.slug)) });
}
function CategoryChips({ active = "all" }) {
  return /* @__PURE__ */ jsxs("div", { className: "no-scrollbar flex items-center gap-3 overflow-x-auto", children: [
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/gallery",
        className: `shrink-0 rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${active === "all" ? "border-ink bg-ink text-canvas" : "border-ink/15 text-detail hover:border-ink hover:text-ink"}`,
        children: "All Works"
      }
    ),
    categories.map((c) => /* @__PURE__ */ jsx(
      Link,
      {
        to: "/categories/$slug",
        params: { slug: c.slug },
        className: `shrink-0 rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${active === c.slug ? "border-ink bg-ink text-canvas" : "border-ink/15 text-detail hover:border-ink hover:text-ink"}`,
        children: c.label
      },
      c.slug
    ))
  ] });
}
export {
  CategoryChips as C,
  MasonryGallery as M
};
