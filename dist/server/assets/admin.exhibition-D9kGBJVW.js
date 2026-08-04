import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Palette, Users, Gavel, Layers, TrendingUp, Search, Pencil, Star, EyeOff, Copy, Hammer, Trash2, Award, Archive, Flag, Tag } from "lucide-react";
import { z as artworks, G as artists, l as categories, H as SectionHeader, N as fmtMoney, ac as TabBar, ad as DataTable, ae as StatusChip, af as RecordSheet } from "./router-07wj3SDc.js";
import { b as auctionLots } from "./auctions-BSTwHsAU.js";
import { AnimatePresence, motion } from "motion/react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
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
function ExhibitionAdmin() {
  const [tab, setTab] = useState("artworks");
  const [q, setQ] = useState("");
  const [artworks$1, setArtworks] = useState(artworks);
  const [artists$1, setArtists] = useState(artists);
  const [lots, setLots] = useState(auctionLots);
  const [categories$1, setCategories] = useState(categories);
  const totalValue = artworks$1.reduce((s, a) => s + a.price, 0);
  const avgPrice = artworks$1.length ? Math.round(totalValue / artworks$1.length) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "Exhibition", description: "Curate the catalog: artworks, artists, live auctions and categories. Click any row to view, edit and run operations." }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-2 gap-3 md:grid-cols-5", children: [
      /* @__PURE__ */ jsx(Kpi, { icon: Palette, label: "Artworks", value: artworks$1.length.toString() }),
      /* @__PURE__ */ jsx(Kpi, { icon: Users, label: "Artists", value: artists$1.length.toString() }),
      /* @__PURE__ */ jsx(Kpi, { icon: Gavel, label: "Live lots", value: lots.length.toString(), accent: true }),
      /* @__PURE__ */ jsx(Kpi, { icon: Layers, label: "Categories", value: categories$1.length.toString() }),
      /* @__PURE__ */ jsx(Kpi, { icon: TrendingUp, label: "Avg. price", value: fmtMoney(avgPrice) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx(TabBar, { tabs: [{
        id: "artworks",
        label: "Artworks",
        count: artworks$1.length
      }, {
        id: "artists",
        label: "Artists",
        count: artists$1.length
      }, {
        id: "auctions",
        label: "Auctions",
        count: lots.length
      }, {
        id: "categories",
        label: "Categories",
        count: categories$1.length
      }], active: tab, onChange: (id) => setTab(id) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)] " }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: `Search ${tab}…`, className: "h-9 w-64 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]" })
      ] })
    ] }),
    tab === "artworks" && /* @__PURE__ */ jsx(ArtworksPanel, { q, rows: artworks$1, setRows: setArtworks }),
    tab === "artists" && /* @__PURE__ */ jsx(ArtistsPanel, { q, rows: artists$1, setRows: setArtists, artworks: artworks$1 }),
    tab === "auctions" && /* @__PURE__ */ jsx(AuctionsPanel, { q, rows: lots, setRows: setLots }),
    tab === "categories" && /* @__PURE__ */ jsx(CategoriesPanel, { q, rows: categories$1, setRows: setCategories, artworks: artworks$1 })
  ] });
}
function ArtworksPanel({
  q,
  rows,
  setRows
}) {
  const [selected, setSelected] = useState(null);
  const ql = q.toLowerCase();
  const data = useMemo(() => rows.filter((a) => !q || a.title.toLowerCase().includes(ql) || a.artist.toLowerCase().includes(ql) || a.categoryLabel.toLowerCase().includes(ql)).map((a) => ({
    ...a,
    id: a.slug
  })), [rows, q, ql]);
  function patch(slug, p) {
    setRows(rows.map((a) => a.slug === slug ? {
      ...a,
      ...p
    } : a));
  }
  function remove(slug) {
    setRows(rows.filter((a) => a.slug !== slug));
  }
  function duplicate(slug) {
    const src = rows.find((a) => a.slug === slug);
    if (!src) return;
    setRows([{
      ...src,
      slug: `${src.slug}-copy-${Date.now()}`,
      title: `${src.title} (copy)`
    }, ...rows]);
  }
  const fields = [{
    key: "title",
    label: "Title",
    span: 2
  }, {
    key: "artist",
    label: "Artist"
  }, {
    key: "categoryLabel",
    label: "Category"
  }, {
    key: "medium",
    label: "Medium"
  }, {
    key: "dimensions",
    label: "Dimensions"
  }, {
    key: "year",
    label: "Year",
    kind: "number"
  }, {
    key: "price",
    label: "Price",
    kind: "money"
  }, {
    key: "highlight",
    label: "Highlighted",
    kind: "select",
    options: [{
      value: "true",
      label: "Yes"
    }, {
      value: "false",
      label: "No"
    }],
    render: (v) => v ? "Yes" : "No"
  }, {
    key: "slug",
    label: "Slug",
    editable: false
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTable, { rows: data, onRowClick: (r) => setSelected(r), columns: [{
      key: "art",
      header: "Artwork",
      render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("img", { src: r.image, alt: r.title, className: "size-10 rounded object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-[var(--a-fg)]", children: r.title }),
          /* @__PURE__ */ jsx("p", { className: "truncate text-[10px] text-[var(--a-muted)]", children: r.artist })
        ] })
      ] })
    }, {
      key: "cat",
      header: "Category",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]", children: r.categoryLabel })
    }, {
      key: "year",
      header: "Year",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-muted)]", children: r.year })
    }, {
      key: "price",
      header: "Price",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.price) })
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.highlight ? "active" : "review" })
    }, {
      key: "actions",
      header: "",
      className: "w-[60px] text-right",
      rowLink: false,
      render: (r) => /* @__PURE__ */ jsx("button", { onClick: (e) => {
        e.stopPropagation();
        setSelected(r);
      }, className: "grid size-7 place-items-center rounded border border-[var(--a-border)] text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]", children: /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }) })
    }] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), eyebrow: "Artwork", title: selected?.title ?? "", subtitle: selected ? `${selected.artist} · ${selected.categoryLabel}` : void 0, record: selected, fields, onSave: (p) => {
      if (!selected) return;
      const next = {
        ...p
      };
      if (typeof p.highlight === "string") next.highlight = p.highlight === "true";
      patch(selected.slug, next);
      setSelected({
        ...selected,
        ...next
      });
    }, extra: selected && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("img", { src: selected.image, alt: selected.title, className: "aspect-square w-full rounded object-cover" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-[var(--a-muted)]", children: selected.description ?? "No description." })
    ] }), operations: selected ? [{
      id: "highlight",
      label: selected.highlight ? "Remove highlight" : "Mark as highlight",
      icon: Star,
      tone: "primary",
      onRun: () => {
        patch(selected.slug, {
          highlight: !selected.highlight
        });
        setSelected({
          ...selected,
          highlight: !selected.highlight
        });
      }
    }, {
      id: "hide",
      label: "Hide from gallery",
      icon: EyeOff,
      onRun: () => alert("Hidden (mock)")
    }, {
      id: "duplicate",
      label: "Duplicate",
      icon: Copy,
      onRun: () => {
        duplicate(selected.slug);
        setSelected(null);
      }
    }, {
      id: "list",
      label: "List in auction",
      icon: Hammer,
      tone: "success",
      onRun: () => alert(`Listed "${selected.title}" in next auction (mock).`)
    }, {
      id: "delete",
      label: "Delete artwork",
      icon: Trash2,
      tone: "danger",
      confirm: `Delete "${selected.title}"?`,
      onRun: () => {
        remove(selected.slug);
        setSelected(null);
      }
    }] : void 0 })
  ] });
}
function ArtistsPanel({
  q,
  rows,
  setRows,
  artworks: artworks2
}) {
  const [selected, setSelected] = useState(null);
  const data = rows.filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase())).map((a) => ({
    ...a,
    id: a.slug
  }));
  function patch(slug, p) {
    setRows(rows.map((a) => a.slug === slug ? {
      ...a,
      ...p
    } : a));
  }
  const fields = [{
    key: "name",
    label: "Name",
    span: 2
  }, {
    key: "discipline",
    label: "Discipline"
  }, {
    key: "location",
    label: "Location"
  }, {
    key: "short",
    label: "Tagline",
    kind: "textarea",
    span: 2
  }, {
    key: "bio",
    label: "Bio",
    kind: "textarea",
    span: 2
  }, {
    key: "slug",
    label: "Slug",
    editable: false,
    span: 2
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTable, { rows: data, onRowClick: (r) => setSelected(r), columns: [{
      key: "name",
      header: "Artist",
      render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("img", { src: r.portrait, alt: r.name, className: "size-9 rounded-full object-cover" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.name }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--a-muted)]", children: r.discipline })
        ] })
      ] })
    }, {
      key: "loc",
      header: "Based in",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-fg-2)]", children: r.location })
    }, {
      key: "works",
      header: "Works",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-muted)]", children: artworks2.filter((a) => a.artistSlug === r.slug).length })
    }, {
      key: "status",
      header: "Status",
      render: () => /* @__PURE__ */ jsx(StatusChip, { value: "active" })
    }] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), eyebrow: "Artist", title: selected?.name ?? "", subtitle: selected?.discipline, record: selected, fields, onSave: (p) => {
      if (!selected) return;
      patch(selected.slug, p);
      setSelected({
        ...selected,
        ...p
      });
    }, extra: selected && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("img", { src: selected.portrait, alt: selected.name, className: "mx-auto aspect-square w-full rounded-full object-cover" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-3 text-xs text-[var(--a-muted)]", children: [
        artworks2.filter((a) => a.artistSlug === selected.slug).length,
        " works in catalog"
      ] })
    ] }), operations: selected ? [{
      id: "feature",
      label: "Feature artist",
      icon: Award,
      tone: "primary",
      onRun: () => alert(`Featured ${selected.name}.`)
    }, {
      id: "spotlight",
      label: "Add to spotlight",
      icon: Star,
      onRun: () => alert("Added to spotlight (mock).")
    }, {
      id: "archive",
      label: "Archive artist",
      icon: Archive,
      tone: "danger",
      confirm: `Archive ${selected.name}?`,
      onRun: () => {
        setRows(rows.filter((a) => a.slug !== selected.slug));
        setSelected(null);
      }
    }] : void 0 })
  ] });
}
function AuctionsPanel({
  q,
  rows,
  setRows
}) {
  const [selected, setSelected] = useState(null);
  const data = rows.filter((l) => !q || l.title.toLowerCase().includes(q.toLowerCase()) || l.lotNumber.includes(q)).map((l) => ({
    ...l,
    id: l.slug
  }));
  function patch(slug, p) {
    setRows(rows.map((l) => l.slug === slug ? {
      ...l,
      ...p
    } : l));
  }
  const fields = [{
    key: "title",
    label: "Lot title",
    span: 2
  }, {
    key: "lotNumber",
    label: "Lot #"
  }, {
    key: "categoryLabel",
    label: "Category"
  }, {
    key: "medium",
    label: "Medium"
  }, {
    key: "dimensions",
    label: "Dimensions"
  }, {
    key: "year",
    label: "Year",
    kind: "number"
  }, {
    key: "estimateLow",
    label: "Estimate low",
    kind: "money"
  }, {
    key: "estimateHigh",
    label: "Estimate high",
    kind: "money"
  }, {
    key: "currentBid",
    label: "Current bid",
    kind: "money"
  }, {
    key: "startBid",
    label: "Start bid",
    kind: "money"
  }, {
    key: "condition",
    label: "Condition"
  }, {
    key: "provenance",
    label: "Provenance",
    kind: "textarea",
    span: 2
  }, {
    key: "description",
    label: "Description",
    kind: "textarea",
    span: 2
  }, {
    key: "status",
    label: "Status",
    kind: "select",
    render(value, row) {
      return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: value }) });
    },
    options: [{
      label: "Active",
      value: "active"
    }, {
      label: "Pending",
      value: "pending"
    }, {
      label: "Suspended",
      value: "suspended"
    }]
  }];
  const [imagesHover, setImagesHover] = useState([]);
  const [uniqueImageID, setUniqueImageID] = useState(null);
  const open = (e, {
    id,
    images
  }) => {
    if (images.length) setImagesHover(images);
    if (id) {
      setUniqueImageID(id);
    }
  };
  const scheduleClose = () => {
    setUniqueImageID(null);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTable, { rows: data, onRowClick: (r) => setSelected(r), columns: [{
      key: "title",
      header: "Lot",
      render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-[105%] w-auto h-auto ml-1 p-2 flex gap-2 ", onMouseEnter: (e) => {
          e.stopPropagation();
          open(e, {
            id: r.id,
            images: r.images
          });
        }, onMouseLeave: () => {
          scheduleClose();
        }, children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: r.id === uniqueImageID && imagesHover.length > 0 && imagesHover.map((i, num) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: {
              opacity: 0,
              x: 10
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: 10
            },
            children: /* @__PURE__ */ jsx("img", { src: i, className: "size-16 transition object-cover aspect-auto rounded transition" }, i)
          }
        )) }) }),
        r.images?.[0] && /* @__PURE__ */ jsx("img", { onMouseEnter: (e) => {
          e.stopPropagation();
          open(e, {
            id: r.id,
            images: r.images
          });
        }, onMouseLeave: () => {
          scheduleClose();
        }, onClick: (e) => {
          e.stopPropagation();
          open(e, {
            id: r.id,
            images: r.images
          });
        }, src: r.images[0], alt: r.title, className: "size-12 border rounded object-cover" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.title }),
          /* @__PURE__ */ jsxs("p", { className: "a-mono text-[10px] text-[var(--a-muted)]", children: [
            "Lot ",
            r.lotNumber
          ] })
        ] })
      ] })
    }, {
      key: "estimate",
      header: "Estimate",
      render: (r) => /* @__PURE__ */ jsxs("span", { className: "a-mono text-xs text-[var(--a-fg-2)]", children: [
        fmtMoney(r.estimateLow),
        " – ",
        fmtMoney(r.estimateHigh)
      ] })
    }, {
      key: "bid",
      header: "Current bid",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-accent)]", children: fmtMoney(r.currentBid ?? 0) })
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status ?? "active" })
    }] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), eyebrow: `Lot ${selected?.lotNumber ?? ""}`, title: selected?.title ?? "", subtitle: selected ? `${selected.categoryLabel} · ${fmtMoney(selected.currentBid ?? 0)}` : void 0, record: selected, fields, onSave: (p) => {
      if (!selected) return;
      patch(selected.slug, p);
      setSelected({
        ...selected,
        ...p
      });
    }, extra: selected?.images?.[0] && /* @__PURE__ */ jsx("img", { src: selected.images[0], alt: selected.title, className: "aspect-square w-full rounded object-cover" }), operations: selected ? [
      // {
      //   id: "open",
      //   label: "Open bidding",
      //   icon: PlayCircle,
      //   tone: "success",
      //   onRun: () => {
      //     patch(selected.slug, { status: "active" } as Partial<AuctionLot>);
      //     setSelected({ ...selected, status: "active" });
      //   },
      // },
      // {
      //   id: "pause",
      //   label: "Pause lot",
      //   icon: Pause,
      //   onRun: () => {
      //     patch(selected.slug, { status: "pending" } as Partial<AuctionLot>);
      //     setSelected({ ...selected, status: "pending" });
      //   },
      // },
      {
        id: "close",
        label: "Close & award winner",
        icon: Hammer,
        tone: "primary",
        confirm: "Close this lot and award current high bidder?",
        onRun: () => alert("Lot closed (mock).")
      },
      {
        id: "withdraw",
        label: "Withdraw lot",
        icon: Archive,
        tone: "danger",
        confirm: "Withdraw this lot from auction?",
        onRun: () => {
          setRows(rows.filter((l) => l.slug !== selected.slug));
          setSelected(null);
        }
      },
      {
        id: "flag",
        label: "Flag for review",
        icon: Flag,
        onRun: () => alert("Flagged (mock).")
      }
    ] : void 0 })
  ] });
}
function CategoriesPanel({
  q,
  rows,
  setRows,
  artworks: artworks2
}) {
  const [selected, setSelected] = useState(null);
  const data = rows.filter((c) => !q || c.label.toLowerCase().includes(q.toLowerCase())).map((c) => ({
    ...c,
    id: c.slug
  }));
  function patch(slug, p) {
    setRows(rows.map((c) => c.slug === slug ? {
      ...c,
      ...p
    } : c));
  }
  const fields = [{
    key: "label",
    label: "Label",
    span: 2
  }, {
    key: "slug",
    label: "Slug",
    editable: false
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTable, { rows: data, onRowClick: (r) => setSelected(r), columns: [{
      key: "label",
      header: "Category",
      render: (r) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-xs font-semibold text-[var(--a-fg)]", children: [
        /* @__PURE__ */ jsx(Tag, { className: "size-3.5 text-[var(--a-accent)]" }),
        " ",
        r.label
      ] })
    }, {
      key: "slug",
      header: "Slug",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-muted)]", children: r.slug })
    }, {
      key: "count",
      header: "Works",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs text-[var(--a-fg-2)]", children: artworks2.filter((a) => a.category === r.slug).length })
    }] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), eyebrow: "Category", title: selected?.label ?? "", record: selected, fields, onSave: (p) => {
      if (!selected) return;
      patch(selected.slug, p);
      setSelected({
        ...selected,
        ...p
      });
    }, operations: selected ? [{
      id: "rename",
      label: "Bulk re-tag works",
      icon: Pencil,
      onRun: () => alert("Bulk retag started (mock).")
    }, {
      id: "delete",
      label: "Delete category",
      icon: Trash2,
      tone: "danger",
      confirm: `Delete category "${selected.label}"? Works will be uncategorised.`,
      onRun: () => {
        setRows(rows.filter((c) => c.slug !== selected.slug));
        setSelected(null);
      }
    }] : void 0 })
  ] });
}
function Kpi({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxs("div", { className: `a-card-elev p-3.5 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: label }),
      /* @__PURE__ */ jsx(Icon, { className: `size-4 ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-muted)]"}` })
    ] }),
    /* @__PURE__ */ jsx("p", { className: `font-display mt-1.5 text-xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`, children: value })
  ] });
}
export {
  ExhibitionAdmin as component
};
