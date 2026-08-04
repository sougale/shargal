import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { j as filterOptions, k as formatPrice, l as categories, m as useMetArtworks, n as useChicagoArtworksByCategory, o as changeMetArtWorkProps } from "./router-07wj3SDc.js";
import { C as CategoryChips, M as MasonryGallery } from "./CategoryChips-DHIDM8fS.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { SlidersHorizontal, X } from "lucide-react";
import { S as Sheet, a as SheetTrigger, b as SheetContent, c as SheetHeader, d as SheetTitle, e as Slider, f as Switch } from "./switch-C_A7R2Ay.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
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
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "./ArtworkCard-myx8HeRA.js";
import "./SmartImage-BnUWDzq7.js";
import "class-variance-authority";
import "@radix-ui/react-slider";
import "@radix-ui/react-switch";
const makeDefaultFilters = (priceMin, priceMax) => ({
  priceMin,
  priceMax,
  category: [],
  size: [],
  orientation: [],
  medium: [],
  theme: [],
  style: [],
  technique: [],
  country: [],
  color: [],
  highlight: false
});
const isDefault = (f, priceMin, priceMax) => f.priceMin === priceMin && f.priceMax === priceMax && !f.highlight && f.category.length === 0 && f.size.length === 0 && f.orientation.length === 0 && f.medium.length === 0 && f.theme.length === 0 && f.style.length === 0 && f.technique.length === 0 && f.country.length === 0 && f.color.length === 0;
const labelize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function FilterDrawer({ value, onChange, totalCount, matchCount }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const openSheet = (o) => {
    if (o) setDraft(value);
    setOpen(o);
  };
  const toggle = (key, item) => {
    setDraft((d) => {
      const arr = d[key];
      const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      return { ...d, [key]: next };
    });
  };
  const apply = () => {
    onChange(draft);
    setOpen(false);
  };
  const reset = () => {
    const d = makeDefaultFilters(filterOptions.priceMin, filterOptions.priceMax);
    setDraft(d);
    onChange(d);
  };
  const ChipList = ({
    options,
    selected,
    onToggle,
    transform
  }) => /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: options.map((opt) => {
    const active = selected.includes(opt);
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onToggle(opt),
        className: `border px-3 py-1.5 text-xs transition-colors ${active ? "border-ink bg-ink text-canvas" : "border-ink/20 text-detail hover:border-ink hover:text-ink"}`,
        children: transform ? transform(opt) : opt
      },
      opt
    );
  }) });
  const Section = ({ title, children }) => /* @__PURE__ */ jsxs("section", { className: "border-t border-ink/10 py-6 first:border-t-0 first:pt-0", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[10px] uppercase tracking-[0.22em] text-detail", children: title }),
    children
  ] });
  return /* @__PURE__ */ jsxs(Sheet, { open, onOpenChange: openSheet, children: [
    /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-canvas",
        children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-3.5" }),
          "Filters"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(
      SheetContent,
      {
        side: "right",
        className: "flex h-full w-full max-w-none flex-col gap-0 overflow-hidden bg-canvas p-0 sm:w-[440px] sm:max-w-[440px]",
        children: [
          /* @__PURE__ */ jsx(SheetHeader, { className: "flex flex-row items-center justify-between border-b border-ink/10 px-6 py-5", children: /* @__PURE__ */ jsx(SheetTitle, { className: "font-display text-2xl italic", children: "Refine the view" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-6", children: [
            /* @__PURE__ */ jsx(
              Section,
              {
                title: `Price · ${formatPrice(draft.priceMin)} — ${formatPrice(draft.priceMax)}`,
                children: /* @__PURE__ */ jsx(
                  Slider,
                  {
                    value: [draft.priceMin, draft.priceMax],
                    min: filterOptions.priceMin,
                    max: filterOptions.priceMax,
                    step: 100,
                    onValueChange: ([min, max]) => setDraft((d) => ({ ...d, priceMin: min, priceMax: max }))
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(Section, { title: "Category", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: categories.map((c) => c.slug),
                selected: draft.category,
                onToggle: (v) => toggle("category", v),
                transform: (v) => categories.find((c) => c.slug === v)?.label ?? v
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Size", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.size,
                selected: draft.size,
                onToggle: (v) => toggle("size", v),
                transform: labelize
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Orientation", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.orientation,
                selected: draft.orientation,
                onToggle: (v) => toggle("orientation", v),
                transform: labelize
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Medium", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.medium,
                selected: draft.medium,
                onToggle: (v) => toggle("medium", v)
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Theme", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.theme,
                selected: draft.theme,
                onToggle: (v) => toggle("theme", v)
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Style", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.style,
                selected: draft.style,
                onToggle: (v) => toggle("style", v)
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Technique", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.technique,
                selected: draft.technique,
                onToggle: (v) => toggle("technique", v)
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Country", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.country,
                selected: draft.country,
                onToggle: (v) => toggle("country", v)
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Colour", children: /* @__PURE__ */ jsx(
              ChipList,
              {
                options: filterOptions.color,
                selected: draft.color,
                onToggle: (v) => toggle("color", v)
              }
            ) }),
            /* @__PURE__ */ jsx(Section, { title: "Highlights", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-ink", children: "Show curator's picks only" }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: draft.highlight,
                  onCheckedChange: (v) => setDraft((d) => ({ ...d, highlight: !!v }))
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("footer", { className: "flex items-center gap-3 border-t border-ink/10 bg-surface/60 px-6 py-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: reset,
                className: "text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink",
                children: "Reset"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: apply,
                className: "ml-auto border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay",
                children: [
                  "Show ",
                  matchCount,
                  " of ",
                  totalCount
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function ActiveFilterChips({ value, onChange }) {
  if (isDefault(value, filterOptions.priceMin, filterOptions.priceMax)) {
    return null;
  }
  const removeFromMulti = (key, item) => {
    onChange({
      ...value,
      [key]: value[key].filter((x) => x !== item)
    });
  };
  const chips = [];
  if (value.priceMin !== filterOptions.priceMin || value.priceMax !== filterOptions.priceMax) {
    chips.push({
      label: `${formatPrice(value.priceMin)} — ${formatPrice(value.priceMax)}`,
      onRemove: () => onChange({
        ...value,
        priceMin: filterOptions.priceMin,
        priceMax: filterOptions.priceMax
      })
    });
  }
  for (const c of value.category) {
    chips.push({
      label: categories.find((x) => x.slug === c)?.label ?? c,
      onRemove: () => removeFromMulti("category", c)
    });
  }
  const simple = [
    { key: "size", values: value.size },
    { key: "orientation", values: value.orientation },
    { key: "medium", values: value.medium },
    { key: "theme", values: value.theme },
    { key: "style", values: value.style },
    { key: "technique", values: value.technique },
    { key: "country", values: value.country },
    { key: "color", values: value.color }
  ];
  for (const s of simple) {
    for (const v of s.values) {
      chips.push({
        label: v.charAt(0).toUpperCase() + v.slice(1),
        onRemove: () => removeFromMulti(s.key, v)
      });
    }
  }
  if (value.highlight) {
    chips.push({
      label: "Curator's picks",
      onRemove: () => onChange({ ...value, highlight: false })
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: "mr-1 text-[10px] uppercase tracking-[0.22em] text-detail", children: "Filtered by" }),
    chips.map((c, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: c.onRemove,
        className: "group inline-flex items-center gap-2 border border-ink/20 bg-canvas px-3 py-1.5 text-xs text-ink hover:border-clay hover:text-clay",
        children: [
          c.label,
          /* @__PURE__ */ jsx(X, { className: "size-3 text-detail group-hover:text-clay" })
        ]
      },
      i
    ))
  ] });
}
function applyFilters(f, artworks) {
  return artworks.filter((a) => {
    if (a.price < f.priceMin || a.price > f.priceMax) return false;
    if (f.category.length && !f.category.some((fc) => fc == a.category)) return false;
    if (f.size.length && !f.size.includes(a.sizeCategory)) return false;
    if (f.orientation.length && !f.orientation.includes(a.orientation)) return false;
    if (f.medium.length && !f.medium.includes(a.medium)) return false;
    if (f.theme.length && !f.theme.includes(a.theme)) return false;
    if (f.style.length && !f.style.includes(a.style)) return false;
    if (f.technique.length && !f.technique.includes(a.technique)) return false;
    if (f.country.length && !f.country.includes(a.country)) return false;
    if (f.color.length && !f.color.includes(a.dominantColor)) return false;
    if (f.highlight && !a.highlight) return false;
    return true;
  });
}
function GalleryPage() {
  const [filters, setFilters] = useState(() => makeDefaultFilters(filterOptions.priceMin, filterOptions.priceMax));
  const met = useMetArtworks();
  const chicago = useChicagoArtworksByCategory("Painting", 30);
  const modMetArtworks = changeMetArtWorkProps(met.artworks);
  const filtered = useMemo(() => applyFilters(filters, modMetArtworks), [filters, modMetArtworks]);
  met.isLoading || chicago.isLoading;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "The exhibition", title: "All Works", description: "The full hang of the current exhibition. Filter by mode of design, price, medium, theme, or any combination." }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pb-6", children: /* @__PURE__ */ jsx(CategoryChips, { active: "all" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-start md:justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-1 flex-wrap items-center gap-2", children: /* @__PURE__ */ jsx(ActiveFilterChips, { value: filters, onChange: setFilters }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: [
          filtered.length,
          " ",
          filtered.length === 1 ? "work" : "works"
        ] }),
        /* @__PURE__ */ jsx(FilterDrawer, { value: filters, onChange: setFilters, totalCount: modMetArtworks.length, matchCount: filtered.length })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 pb-32 pt-6", children: /* @__PURE__ */ jsx(MasonryGallery, { artworks: filtered }) })
  ] });
}
export {
  GalleryPage as component
};
