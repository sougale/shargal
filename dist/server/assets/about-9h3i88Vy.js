import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { H as HistoryTimeline, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, P as PartnerReasons, F as FaqAccordion } from "./FaqAccordion-DuC-b7jo.js";
import "@tanstack/react-router";
import "react";
import "@radix-ui/react-accordion";
import "lucide-react";
import "./router-BX1vAgXZ.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
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
const principles = [{
  q: "One exhibition at a time",
  a: "We never overlap shows. Each hang is given a full season to be seen. The catalogue, the printed broadsheet and the online edition all belong to the same body of work."
}, {
  q: "Small editions, slow release",
  a: "Editioned work is released in runs of five to twelve. We don't print on demand. When an edition closes, it closes — provenance matters more than reach."
}, {
  q: "Materials with a memory",
  a: "We favour artists who work with materials that carry their own history — wood-fired clay, linen woven in the same mill since 1894, indigo dyed three times, paper made by hand."
}, {
  q: "A small audience, carefully kept",
  a: "We do not optimise for traffic. The seasonal letter goes to roughly two thousand collectors, curators, architects and editors. Joining it is by introduction."
}];
function AboutPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "About the gallery", title: "A quiet room for slow work." }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-16 px-6 pb-20 lg:grid-cols-[1fr_1.2fr] lg:gap-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-lg leading-relaxed text-ink/80", children: [
        /* @__PURE__ */ jsx("p", { children: "Sharjahbiennial is a curated digital exhibition space, founded on the belief that the appreciation of contemporary art deserves more quietness than the internet usually allows." }),
        /* @__PURE__ */ jsx("p", { children: "We hang one exhibition at a time, for one season at a time. Each show gathers a small circle of artists working at the slow end of their disciplines — ceramicists who fire one vessel at a time, photographers who wait for a single shaft of afternoon light, painters who measure their year in canvases." }),
        /* @__PURE__ */ jsx("p", { children: "The site is intentionally restrained: a serif headline, a quiet grid, a single warm accent. The work asks for room, and we try to give it." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-px self-start bg-ink/10", children: [{
        k: "Founded",
        v: "2019"
      }, {
        k: "Exhibitions per year",
        v: "Four"
      }, {
        k: "Artists in rotation",
        v: "Twelve"
      }, {
        k: "Editions per year",
        v: "Always small"
      }, {
        k: "Cities",
        v: "Antwerp · Kyoto · Lisbon"
      }, {
        k: "Printed catalogue",
        v: "Letterpress, ed. 200"
      }].map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between bg-canvas p-6", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: r.k }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-2xl italic", children: r.v })
      ] }, r.k)) })
    ] }),
    /* @__PURE__ */ jsx(HistoryTimeline, {}),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] uppercase tracking-[0.3em] text-detail", children: "Our principles" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl italic leading-tight md:text-5xl", children: "Four rules we hold to, season after season." })
      ] }),
      /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "w-full", children: principles.map((p, i) => /* @__PURE__ */ jsxs(AccordionItem, { value: `p-${i}`, className: "border-b border-ink/10", children: [
        /* @__PURE__ */ jsx(AccordionTrigger, { className: "py-6 text-left font-display text-xl italic text-ink hover:no-underline", children: p.q }),
        /* @__PURE__ */ jsx(AccordionContent, { className: "pb-6 text-base leading-relaxed text-detail", children: p.a })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx(PartnerReasons, {}),
    /* @__PURE__ */ jsx(FaqAccordion, {})
  ] });
}
export {
  AboutPage as component
};
