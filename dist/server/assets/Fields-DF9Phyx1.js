import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { b as useAuthStore, L as Select, M as SelectTrigger, N as SelectValue, O as SelectContent, P as SelectGroup, Q as SelectItem } from "./router-BX1vAgXZ.js";
import { a as formatMoneyInput, f as formatMoney, p as parseMoney } from "./currencies-G6nNjE1o.js";
function Fields({ fields }) {
  const formControl = useFormContext();
  const {
    register,
    control,
    formState: { errors }
  } = formControl;
  const user = useAuthStore((s) => s.user);
  const currency = user?.currency || "USD";
  const [focusedMoneyField, setFocusedMoneyField] = useState(null);
  return /* @__PURE__ */ jsx(Fragment, { children: fields.map((f) => {
    const inputType = f.fieldType == "input";
    const selectType = f.fieldType == "select";
    const textareaType = f.fieldType == "textarea";
    const error = errors[f.name]?.message;
    const errorMessage = typeof error == "string" && /* @__PURE__ */ jsx("p", { className: "mt-1.5 border border-clay/40 bg-clay/5 px-1.5 py-2 text-xs text-clay", children: error });
    return /* @__PURE__ */ jsxs("div", { children: [
      inputType && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
        Controller,
        {
          name: f.name,
          control,
          render: ({ field }) => {
            const isMoney = f.format === "money";
            const isNumber = !isMoney && f.attrs?.type === "number";
            const isFocused = focusedMoneyField === f.name;
            let displayValue = "";
            if (isMoney) {
              const raw = field.value;
              if (isFocused) {
                displayValue = raw != null && raw !== "" ? formatMoneyInput(String(raw)) : "";
              } else {
                const num = raw != null && raw !== "" ? Number(raw) : 0;
                displayValue = num > 0 ? formatMoney(num, currency, { withSymbol: true }) : "";
              }
            } else if (isNumber) {
              const raw = field.value;
              displayValue = raw != null ? String(raw) : "";
            } else {
              const raw = field.value;
              displayValue = raw != null ? String(raw) : "";
            }
            const inputTypeAttr = isMoney ? "text" : f.attrs?.type ?? void 0;
            const { type: _droppedType, ...restAttrs } = f.attrs ?? {};
            const passAttrs = isMoney ? restAttrs : f.attrs ?? {};
            return /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("label", { className: `flex flex-col gap-2 ${f.labelClass}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-[10px] uppercase tracking-[0.22em] text-detail`, children: f.label }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: inputTypeAttr,
                    value: displayValue,
                    onFocus: () => {
                      if (isMoney) setFocusedMoneyField(f.name);
                    },
                    onBlur: () => {
                      if (isMoney) {
                        setFocusedMoneyField(null);
                        const current = field.value;
                        if (current === "" || current == null || current === void 0) {
                          field.onChange(0);
                        }
                      }
                    },
                    onChange: (e) => {
                      const v = e.target.value;
                      if (isMoney) {
                        field.onChange(parseMoney(v));
                        return;
                      }
                      if (isNumber) {
                        const parsed = parseMoney(v);
                        field.onChange(parsed === 0 && v.trim() !== "0" ? "" : parsed);
                        return;
                      }
                      field.onChange(v);
                    },
                    ...passAttrs,
                    className: f.attrs?.className
                  }
                )
              ] }),
              errorMessage
            ] });
          }
        }
      ) }),
      selectType && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Controller,
          {
            control,
            name: f.name,
            render: ({ field }) => {
              return /* @__PURE__ */ jsxs("label", { className: `flex flex-col gap-2 ${f.labelClass}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-[10px] uppercase tracking-[0.22em] text-detail `, children: f.label }),
                /* @__PURE__ */ jsxs(Select, { onValueChange: (e) => field.onChange(e), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { ...f.attrs }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: f.options.map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o.value, children: o.label }, o.value)) }) })
                ] })
              ] });
            }
          }
        ),
        errorMessage
      ] }),
      textareaType && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("label", { className: `flex flex-col gap-2 ${f.labelClass}`, children: [
          /* @__PURE__ */ jsx("span", { className: `text-[10px] uppercase tracking-[0.22em] text-detail`, children: f.label }),
          /* @__PURE__ */ jsx("textarea", { ...register(f.name, { required: true }), ...f.attrs })
        ] }),
        errorMessage
      ] })
    ] }, f.name);
  }) });
}
export {
  Fields as F
};
