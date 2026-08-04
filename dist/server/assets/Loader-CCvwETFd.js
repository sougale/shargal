import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "motion/react";
import { i as cn } from "./router-07wj3SDc.js";
function Loader({
  size = "md",
  message,
  className,
  fullScreen = false,
  variant = "soft"
}) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7"
  };
  const baseContainer = "flex flex-col items-center justify-center gap-3";
  const containerClasses = fullScreen ? cn(
    "fixed inset-0 z-[60] flex items-center justify-center bg-canvas/70 backdrop-blur-[2px]",
    className
  ) : cn(baseContainer, className);
  if (variant === "dots") {
    return /* @__PURE__ */ jsxs("div", { className: containerClasses, children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx(
        motion.div,
        {
          className: cn("rounded-full bg-ink/60", sizeClasses[size]),
          animate: {
            opacity: [0.3, 1, 0.3],
            scale: [0.85, 1, 0.85]
          },
          transition: {
            duration: 1.1,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut"
          }
        },
        i
      )) }),
      message && /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-detail", children: message })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: containerClasses, children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: cn(
          "rounded-full border border-ink/15",
          sizeClasses[size],
          variant === "default" && "border-ink/30"
        ),
        animate: {
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.9, 0.4],
          borderColor: ["rgba(0,0,0,0.08)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.08)"]
        },
        transition: {
          duration: 1.6,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1]
        }
      }
    ),
    message && /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-detail", children: message })
  ] });
}
export {
  Loader as L
};
