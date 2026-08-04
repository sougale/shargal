import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [complaint, setComplaint] = useState({
    name: "",
    email: "",
    subject: ""
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Inquiries", title: "Write to us.", description: "For acquisition inquiries, private viewings or general questions about the exhibition. We respond within two working days." }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-16 px-6 pb-32 lg:grid-cols-[1.2fr_1fr] lg:gap-24", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        setSent(true);
      }, className: "flex flex-col gap-8", children: [
        [{
          id: "name",
          label: "Your name",
          type: "text"
        }, {
          id: "email",
          label: "Email",
          type: "email"
        }, {
          id: "subject",
          label: "Subject",
          type: "text"
        }].map((f) => /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: f.label }),
          /* @__PURE__ */ jsx("input", { id: f.id, name: f.id, value: complaint[f.id], onChange: (e) => {
            const {
              name,
              value
            } = e.target;
            setComplaint((c) => ({
              ...c,
              [name]: value
            }));
          }, type: f.type, required: true, className: "border-b border-ink/20 bg-transparent pb-2 text-base outline-none transition-colors focus:border-ink" })
        ] }, f.id)),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Message" }),
          /* @__PURE__ */ jsx("textarea", { name: "message", required: true, rows: 5, className: "border-b border-ink/20 bg-transparent pb-2 text-base outline-none transition-colors focus:border-ink" })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: sent, className: "mt-4 self-start border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-clay hover:border-clay disabled:opacity-50 disabled:pointer-events-none", children: sent ? "Thank you — we'll be in touch" : "Send inquiry" })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "flex flex-col gap-10 text-sm leading-relaxed text-ink/80", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Gallery" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 font-display text-2xl italic", children: "Aethelred Gallery" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2", children: [
            "14 Linen Street",
            /* @__PURE__ */ jsx("br", {}),
            "Antwerp, Belgium"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Hours" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3", children: [
            "Tuesday – Saturday",
            /* @__PURE__ */ jsx("br", {}),
            "11:00 – 18:00"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Direct" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("a", { href: "mailto:hello@aethelred.gallery", className: "underline decoration-detail/30 underline-offset-4 hover:text-clay", children: "hello@aethelred.gallery" }),
            /* @__PURE__ */ jsx("br", {}),
            "+32 3 000 0000"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ContactPage as component
};
