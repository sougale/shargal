import { jsx, jsxs } from "react/jsx-runtime";
import { b as useAuthStore } from "./router-BX1vAgXZ.js";
import { Ban, Clock } from "lucide-react";
function AccountStatusBlocker({
  status: statusProp,
  action = "general",
  className = ""
}) {
  const user = useAuthStore((s) => s.user);
  const status = statusProp ?? user?.status ?? "pending";
  const isSuspended = status === "suspended";
  const getTitle = () => {
    if (isSuspended) return "Account Suspended";
    return "Account Pending Approval";
  };
  const getIcon = () => {
    if (isSuspended) return /* @__PURE__ */ jsx(Ban, { className: "size-5" });
    return /* @__PURE__ */ jsx(Clock, { className: "size-5" });
  };
  const getDescription = () => {
    if (isSuspended) {
      return "Your account has been suspended. You cannot place bids or submit new listings at this time.";
    }
    return "Your account is awaiting admin approval. You cannot place bids or submit artwork for sale until an administrator sets your status to active.";
  };
  const getActionText = () => {
    if (action === "bid") return "bidding on auctions";
    if (action === "sell") return "submitting artwork for sale";
    return "performing this activity";
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `rounded border border-ink/15 bg-surface/60 p-5 ${className}`,
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "mt-0.5 inline-flex items-center justify-center rounded bg-ink/5 p-2 text-detail", children: getIcon() }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail font-medium", children: getTitle() }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-ink/80", children: [
            getDescription(),
            " You must wait for approval before ",
            getActionText(),
            "."
          ] }),
          user && /* @__PURE__ */ jsx("div", { className: "mt-3 rounded bg-canvas/60 p-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-detail", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("span", { className: "uppercase tracking-[0.18em]", children: "Name:" }),
              " ",
              user.fullName || "—"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("span", { className: "uppercase tracking-[0.18em]", children: "Email:" }),
              " ",
              user.email
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("span", { className: "uppercase tracking-[0.18em]", children: "Status:" }),
              " ",
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: isSuspended ? "text-red-600" : "text-amber-600",
                  children: status
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-[11px] text-detail/70", children: "If you believe this is an error, please contact support or wait for admin review." })
        ] })
      ] })
    }
  );
}
export {
  AccountStatusBlocker as A
};
