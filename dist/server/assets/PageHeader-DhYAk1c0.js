import { jsxs, jsx } from "react/jsx-runtime";
function PageHeader({ eyebrow, title, description }) {
  return /* @__PURE__ */ jsxs("header", { className: "mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-20 md:pt-28", children: [
    eyebrow && /* @__PURE__ */ jsx("p", { className: "mb-6 text-[11px] uppercase tracking-[0.3em] text-detail", children: eyebrow }),
    /* @__PURE__ */ jsx("h1", { className: "max-w-4xl font-display text-5xl italic leading-[0.95] md:text-7xl lg:text-8xl", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "mt-8 max-w-2xl text-lg leading-relaxed text-detail md:text-xl", children: description })
  ] });
}
export {
  PageHeader as P
};
