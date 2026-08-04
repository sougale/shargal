import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { S as SmartImage } from "./SmartImage-BnUWDzq7.js";
import { i as cn } from "./router-07wj3SDc.js";
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
export {
  AuctionImageSwiper as A
};
