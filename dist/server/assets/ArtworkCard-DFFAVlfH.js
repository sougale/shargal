import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { S as SmartImage, q as formatPrice } from "./router-BX1vAgXZ.js";
function ArtworkCard({ artwork, priority }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/artworks/$slug",
      params: { slug: artwork.slug },
      className: "group mb-10 block break-inside-avoid",
      onClick: () => {
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-surface outline outline-1 -outline-offset-1 outline-ink/5", children: /* @__PURE__ */ jsx(
          SmartImage,
          {
            src: artwork.image,
            alt: `${artwork.title} by ${artwork.artist}`,
            width: artwork.width,
            height: artwork.height,
            priority,
            className: "w-full",
            imgClassName: "transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: artwork.artist }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 font-display text-2xl italic leading-tight text-ink", children: artwork.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-detail", children: artwork.medium }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-baseline gap-3 justify-between border-t border-ink/10 pt-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-detail line-clamp-1", children: artwork.dimensions }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-ink", children: formatPrice(artwork.price) })
          ] })
        ] })
      ]
    }
  );
}
export {
  ArtworkCard as A
};
