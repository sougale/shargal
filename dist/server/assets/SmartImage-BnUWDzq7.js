import { jsx } from "react/jsx-runtime";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { i as cn } from "./router-07wj3SDc.js";
const loadedImageCache = /* @__PURE__ */ new Set();
function SmartImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  priority = false,
  objectFit = "cover"
}) {
  const wasPreviouslyLoaded = loadedImageCache.has(src);
  const [isLoaded, setIsLoaded] = useState(wasPreviouslyLoaded);
  const imgRef = useRef(null);
  useEffect(() => {
    if (isLoaded) return;
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      loadedImageCache.add(src);
      setIsLoaded(true);
    }
  }, [src, isLoaded]);
  const handleLoad = () => {
    loadedImageCache.add(src);
    setIsLoaded(true);
  };
  const showFinalState = isLoaded || wasPreviouslyLoaded;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("relative overflow-hidden bg-surface", className),
      style: { aspectRatio: `${width || 100} / ${height || 100}` },
      children: /* @__PURE__ */ jsx(
        motion.img,
        {
          ref: imgRef,
          src,
          alt,
          loading: priority ? "eager" : "lazy",
          fetchPriority: priority ? "high" : "auto",
          decoding: "async",
          onLoad: handleLoad,
          initial: showFinalState ? false : { opacity: 0, filter: "blur(18px)", scale: 1.02 },
          whileInView: { opacity: 1, scale: 1, filter: "blur(0px)" },
          viewport: { once: false },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          className: cn(
            "absolute inset-0 h-full w-full will-change-[filter,opacity,transform]",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            imgClassName
          )
        }
      )
    }
  );
}
export {
  SmartImage as S
};
