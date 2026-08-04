import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { i as cn } from "./router-07wj3SDc.js";
const history = [
  {
    year: "2019",
    title: "An accidental beginning",
    body: "The first exhibition was assembled in a shared studio in Antwerp, almost by accident — six artists, twelve works and a single hand-printed broadsheet."
  },
  {
    year: "2021",
    title: "The first season",
    body: "Aethelred moved from one-off shows to a seasonal rhythm — four exhibitions a year, each held for a full quarter and accompanied by a printed catalogue."
  },
  {
    year: "2023",
    title: "Permanent rotation",
    body: "A small group of twelve artists were invited into permanent rotation. Each agreed to release a limited body of work each year, on the gallery's slow calendar."
  },
  {
    year: "2025",
    title: "Aethelred Digital",
    body: "The exhibition moves online — but on our terms: one hang at a time, no algorithm, no infinite scroll. The same quiet, in a different room."
  }
];
function HistoryTimeline() {
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 border-b border-ink/10 pb-6", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] uppercase tracking-[0.3em] text-detail", children: "Origin" }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl italic md:text-4xl", children: "A short history of the gallery" })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-4", children: history.map((m) => /* @__PURE__ */ jsxs("li", { className: "flex flex-col gap-3 bg-canvas p-8", children: [
      /* @__PURE__ */ jsx("span", { className: "font-display text-5xl italic text-clay", children: m.year }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl italic", children: m.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-detail", children: m.body })
    ] }, m.year)) })
  ] });
}
const partnerBenefits = [
  {
    no: "01",
    title: "Direct artist access",
    body: "Partners are invited to studio visits and a private quarterly preview of unreleased work, weeks before public release."
  },
  {
    no: "02",
    title: "Considered audience",
    body: "Our readership is small by design — collectors, curators, architects and editors who value restraint and provenance."
  },
  {
    no: "03",
    title: "Editorial integration",
    body: "Co-authored long-reads, video portraits and printed broadsheets — never display advertising or banners."
  },
  {
    no: "04",
    title: "Shared values",
    body: "We work only with partners whose materials, labour and ecology align with the slow philosophy of the gallery."
  },
  {
    no: "05",
    title: "Year-round visibility",
    body: "Permanent placement in the colophon, exhibition catalogues, opening invitations and the year-end publication."
  }
];
function PartnerReasons() {
  return /* @__PURE__ */ jsx("section", { className: "bg-ink text-canvas", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl gap-16 px-6 py-24 md:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:sticky lg:top-32 lg:self-start", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-5 text-[11px] uppercase tracking-[0.3em] text-canvas/55", children: "Why partner with Aethelred" }),
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-4xl italic leading-[1.02] md:text-6xl", children: [
        "A small audience,",
        /* @__PURE__ */ jsx("br", {}),
        "carefully kept."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 max-w-md text-canvas/75 leading-relaxed", children: "We work with a deliberately small circle of partners — makers, houses, journals and institutions whose craft is continuous with the work we hang." }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/contact",
          className: "mt-10 inline-block border border-canvas/40 px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:border-canvas hover:bg-canvas hover:text-ink",
          children: "Begin a conversation"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "grid grid-cols-1 gap-px bg-canvas/15 sm:grid-cols-2", children: partnerBenefits.map((p) => /* @__PURE__ */ jsxs("li", { className: "flex flex-col gap-4 bg-ink p-8", children: [
      /* @__PURE__ */ jsx("span", { className: "font-display text-3xl italic text-clay", children: p.no }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl italic", children: p.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-canvas/70", children: p.body })
    ] }, p.no)) })
  ] }) });
}
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const faqs = [
  {
    q: "How often do you mount a new exhibition?",
    a: "Four exhibitions a year, each running for a full season. We never overlap shows — one room, one hang, one quiet at a time."
  },
  {
    q: "Can I acquire a work directly through the site?",
    a: "Each artwork page has an inquiry button. We respond personally within two working days with availability, provenance and shipping options. We don't operate a checkout — every acquisition begins with a conversation."
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We crate and ship globally via specialist art handlers. Framing, climate-controlled transit and on-site installation can be arranged for collectors anywhere we deliver."
  },
  {
    q: "Do you accept commissions?",
    a: "Several artists in our programme take a small number of private commissions each year. Write to us with a short note about the space, the scale and the season you have in mind."
  },
  {
    q: "How do I become a partner or sponsor?",
    a: "We work with a small set of long-term partners whose craft and values are continuous with our own. Use the Contact page and write 'Partnership' in the subject line."
  },
  {
    q: "Is there a physical space?",
    a: "Aethelred is primarily a digital gallery. Twice a year we mount a printed exhibition in a guest space in Antwerp — open by appointment only, listed in our seasonal letter."
  }
];
function FaqAccordion() {
  return /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] uppercase tracking-[0.3em] text-detail", children: "Frequently asked" }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl italic leading-tight md:text-5xl", children: "Questions we hear often, answered plainly." })
    ] }),
    /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "w-full", children: faqs.map((f, i) => /* @__PURE__ */ jsxs(AccordionItem, { value: `item-${i}`, className: "border-b border-ink/10", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "py-6 text-left font-display text-xl italic text-ink hover:no-underline", children: f.q }),
      /* @__PURE__ */ jsx(AccordionContent, { className: "pb-6 text-base leading-relaxed text-detail", children: f.a })
    ] }, i)) })
  ] }) });
}
export {
  Accordion as A,
  FaqAccordion as F,
  HistoryTimeline as H,
  PartnerReasons as P,
  AccordionItem as a,
  AccordionTrigger as b,
  AccordionContent as c
};
