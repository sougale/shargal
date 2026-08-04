import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { i as cn } from "./router-07wj3SDc.js";
function diff(endsAt) {
  const ms = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const total = Math.floor(ms / 1e3);
  const days = Math.floor(total / 86400);
  const hours = Math.floor(total % 86400 / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const seconds = total % 60;
  return { ms, days, hours, minutes, seconds };
}
function Countdown({ endsAt, size = "md", className }) {
  const [t, setT] = useState(null);
  useEffect(() => {
    setT(diff(endsAt));
    const id = setInterval(() => setT(diff(endsAt)), 1e3);
    return () => clearInterval(id);
  }, [endsAt]);
  if (!t) {
    return /* @__PURE__ */ jsx("div", { className: cn("inline-flex items-end gap-3 opacity-0", className), "aria-hidden": true, children: /* @__PURE__ */ jsx("span", { className: "font-display italic text-2xl", children: "00:00:00:00" }) });
  }
  const ended = t.ms === 0;
  const closing = t.ms > 0 && t.ms < 36e5;
  const numCls = size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-base" : "text-2xl";
  const labelCls = "text-[9px] uppercase tracking-[0.22em] text-detail";
  if (ended) {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: cn(
          "inline-flex items-center gap-2 border border-ink/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-detail",
          className
        ),
        children: [
          /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-detail" }),
          "Bidding closed"
        ]
      }
    );
  }
  const Cell = ({ value, label }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "font-display italic tabular-nums leading-none animate-in fade-in slide-in-from-bottom-1 duration-300",
          numCls,
          closing && "text-clay"
        ),
        children: String(value).padStart(2, "0")
      },
      value
    ),
    /* @__PURE__ */ jsx("span", { className: cn("mt-1", labelCls), children: label })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: cn("inline-flex items-end gap-3", closing && "[&_.dot]:bg-clay", className), children: [
    closing && /* @__PURE__ */ jsx("span", { className: "dot mb-2 size-2 animate-pulse rounded-full bg-clay" }),
    /* @__PURE__ */ jsx(Cell, { value: t.days, label: "Days" }),
    /* @__PURE__ */ jsx("span", { className: cn("font-display italic text-ink/30", numCls), children: ":" }),
    /* @__PURE__ */ jsx(Cell, { value: t.hours, label: "Hrs" }),
    /* @__PURE__ */ jsx("span", { className: cn("font-display italic text-ink/30", numCls), children: ":" }),
    /* @__PURE__ */ jsx(Cell, { value: t.minutes, label: "Min" }),
    /* @__PURE__ */ jsx("span", { className: cn("font-display italic text-ink/30", numCls), children: ":" }),
    /* @__PURE__ */ jsx(Cell, { value: t.seconds, label: "Sec" })
  ] });
}
export {
  Countdown as C
};
