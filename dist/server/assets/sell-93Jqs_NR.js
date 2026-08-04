import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, Upload, Loader2, Trash2 } from "lucide-react";
import { d as toast, e as useStore, c as useDataStore, b as useAuthStore, p as photoFN, g as getUserName, f as formatMoney } from "./router-07wj3SDc.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { F as Fields } from "./Fields-DFgKoI-S.js";
import { useFormContext, useForm, FormProvider } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import z__default from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { i as inHours } from "./auctions-BSTwHsAU.js";
import { u as useDoc } from "./useDoc-ZchnV3Lq.js";
import { L as Loader } from "./Loader-CCvwETFd.js";
import { A as AuctionImageSwiper } from "./AuctionImageSwiper-DoZ88T7q.js";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "recharts";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "./currencies-G6nNjE1o.js";
import "embla-carousel-react";
import "./SmartImage-BnUWDzq7.js";
function ImageUploader({
  name = "images",
  slotCount,
  onSlotCountChange,
  maxSlots = 6
}) {
  const {
    setValue,
    getValues,
    formState: { errors, isDirty, isValid, isLoading }
  } = useFormContext();
  const [convertedImages, setConvertedImages] = useState([]);
  const images = getValues(name) || [];
  const handleFile = (file, index) => {
    if (file.size > 4e6) {
      toast.info({
        title: "Info",
        description: "Please choose an image under 4 MB."
      });
      return;
    }
    const url = URL.createObjectURL(file);
    const nextConvertedImages = [...convertedImages];
    nextConvertedImages[index] = url;
    setConvertedImages((ci) => [...nextConvertedImages]);
    const next = [...images];
    next[index] = file;
    const cleaned = next.filter(Boolean).slice(0, slotCount);
    console.log(cleaned);
    console.log(convertedImages);
    setValue(name, cleaned, { shouldValidate: true });
  };
  const addSlot = () => {
    if (slotCount < maxSlots) onSlotCountChange(slotCount + 1);
  };
  const removeSlot = () => {
    const nextCount = Math.max(1, slotCount - 1);
    onSlotCountChange(nextCount);
    const trimmed = images.slice(0, nextCount);
    setValue(name, trimmed, { shouldValidate: true });
    setConvertedImages((ci) => ci.slice(0, nextCount));
  };
  const errorMessage = typeof errors[name]?.message === "string" ? errors[name]?.message : null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-1 justify-end", children: [
      slotCount != maxSlots && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: addSlot,
          className: "flex gap-1 text-canvas p-2 text-xs bg-clay font-medium hover:bg-clay/90",
          children: [
            "Add Image Slot ",
            /* @__PURE__ */ jsx(Plus, { className: "size-4" })
          ]
        }
      ),
      slotCount >= 2 && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: removeSlot,
          className: "flex gap-1 text-canvas p-2 text-xs bg-clay font-medium hover:bg-clay/90",
          children: [
            /* @__PURE__ */ jsx(Minus, { className: "size-4" }),
            " Remove Image Slot"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: `grid ${slotCount > 1 ? "grid-cols-2 gap-px" : "grid-cols-1"}`, children: Array.from({ length: slotCount }).map((_, i) => {
      const hasImage = !!images[i];
      return /* @__PURE__ */ jsxs(
        "label",
        {
          className: "group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-ink/20 bg-surface/30 transition-colors hover:border-ink/40",
          children: [
            hasImage ? /* @__PURE__ */ jsx(
              "img",
              {
                src: convertedImages[i],
                alt: `Upload ${i + 1}`,
                className: "h-full w-full object-cover"
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [
              /* @__PURE__ */ jsx(Upload, { className: "size-8 text-detail", strokeWidth: 1.25 }),
              /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[11px] uppercase tracking-[0.12em] text-detail", children: "Upload image of the work" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-detail/70", children: "JPG or PNG · up to 4 MB" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: (e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f, i);
                }
              }
            )
          ]
        },
        i
      );
    }) }),
    errorMessage && /* @__PURE__ */ jsx("p", { className: "mt-1.5 border border-clay/40 bg-clay/5 px-1.5 py-2 text-xs text-clay", children: errorMessage })
  ] });
}
const EMPTY_TEXT = "N/A";
const categories = ["Painting", "Sculpture", "Photography", "Drawing", "Mixed Media", "Ceramics", "Digital"];
({
  year: (/* @__PURE__ */ new Date()).getFullYear()
});
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const auctionSchema = z__default.object({
  title: z__default.string().min(1, {
    message: "Title is required"
  }),
  category: z__default.string().min(1, {
    message: "Select A Category"
  }),
  year: z__default.number().min(1950, {
    message: "Year Must Not Go Below 1950"
  }).max((/* @__PURE__ */ new Date()).getFullYear(), {
    message: "Current Year Is The Year Of Upload"
  }),
  medium: z__default.string().min(1, {
    message: "Medium is required"
  }),
  dimensions: z__default.string().min(1, {
    message: "Dimensions is required"
  }),
  description: z__default.string().min(1, {
    message: "Description is required"
  }),
  provenance: z__default.string().min(1, {
    message: "Provenance is requred"
  }),
  condition: z__default.string().min(1, {
    message: "Condition is required"
  }),
  images: z__default.array(z__default.instanceof(File, {
    message: "Please upload a valid file."
  }).refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Max file size is 5MB."
  }).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only .jpg, .jpeg, and .png formats are supported."
  })).min(1, {
    message: "At least one image is required"
  }),
  estimateLow: z__default.number().positive("Estimated Low Amount must be greater than 0").min(10, {
    message: "Minimum Amount Must Be Above 10"
  }).max(1e6, "Amount must be less than 1,000,000"),
  price: z__default.number().positive("Amount must be greater than 0").max(1e6, "Amount must be less than 1,000,000"),
  estimateHigh: z__default.number().positive("Estimated High Amount must be greater than 0").min(10, {
    message: "Minimum Amount Must Be Above 10"
  }).max(1e6, {
    message: "Maximum Amount is a Million"
  }),
  startBid: z__default.number().positive("Start Bid Amount must be greater than 0").min(1, {
    message: "Start Bid is required"
  }).max(1e6, {
    message: "Maximum Amount is a Million"
  }),
  // currentBid: z
  //   .number()
  //   .positive("Current Bid Amount must be greater than 0")
  //   .min(1, { message: "Current Bid is required" }),
  endsAt: z__default.number().min(1, {
    message: "Bid Time Range in hours is required"
  })
});
function SellPage() {
  const {
    listings,
    addListing,
    removeListing
  } = useStore();
  const {
    auctions
  } = useDataStore(useShallow((s) => ({
    auctions: s.auctions
  })));
  const {
    user,
    loading,
    isAuthHydrated
  } = useAuthStore(useShallow((s) => ({
    user: s.user,
    loading: s.loading,
    isAuthHydrated: s.isAuthHydrated
  })));
  const [imagesIndex, setImagesIndex] = useState(1);
  const [loadingForm, setLoadingForm] = useState(false);
  const {
    addDocToCollection,
    deleteDocument
  } = useDoc();
  const formControl = useForm({
    resolver: zodResolver(auctionSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      condition: "",
      // currentBid: 0,
      description: "",
      dimensions: "",
      endsAt: 0,
      estimateHigh: 0,
      images: [],
      estimateLow: 0,
      medium: "",
      provenance: "",
      price: 0,
      startBid: 0,
      year: 0
    }
  });
  const {
    setValue,
    handleSubmit,
    getValues,
    formState: {
      isValid,
      isLoading,
      isSubmitting
    }
  } = formControl;
  useEffect(() => {
    formControl.trigger("images");
  }, [formControl]);
  if (loading || !isAuthHydrated) {
    return /* @__PURE__ */ jsx(Loader, { message: "Loading...", className: "min-h-[60vh]" });
  }
  if (!user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[60vh] flex items-center justify-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-detail", children: "Consign" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-4xl italic text-ink", children: "Sign in to sell" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-detail", children: "You need an account to list artwork for exhibition." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/connect", className: "inline-block border border-ink bg-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay", children: "Sign in" }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block border border-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas", children: "Browse" })
      ] })
    ] }) });
  }
  const fields = [
    {
      fieldType: "input",
      label: "Title",
      name: "title"
    },
    {
      fieldType: "input",
      label: "Medium",
      name: "medium",
      attrs: {
        placeholder: "e.g. Oil on linen"
      }
    },
    {
      fieldType: "input",
      label: "Dimensions",
      name: "dimensions",
      attrs: {
        placeholder: "e.g. 80 × 60 cm"
      }
    },
    {
      fieldType: "input",
      label: "Provenance",
      name: "provenance",
      attrs: {
        placeholder: "Authenticity of the artwork"
      }
    },
    {
      fieldType: "input",
      label: "Condition",
      name: "condition",
      attrs: {
        placeholder: "Condition of the artwork"
      }
    },
    {
      fieldType: "input",
      label: "Year",
      name: "year",
      attrs: {
        type: "number",
        placeholder: "Year"
      }
    },
    {
      fieldType: "input",
      label: "Price",
      name: "price",
      format: "money"
    },
    {
      fieldType: "input",
      label: "Estimate Low",
      name: "estimateLow",
      format: "money"
    },
    {
      fieldType: "input",
      label: "Estimate High",
      name: "estimateHigh",
      format: "money"
    },
    {
      fieldType: "input",
      label: "Start Bid",
      name: "startBid",
      format: "money"
    },
    // { fieldType: "input", label: "Current Bid", name: "currentBid", format: "money" as const },
    {
      fieldType: "select",
      label: "Category",
      name: "category",
      options: categories.map((c) => ({
        label: c,
        value: c.toLowerCase()
      }))
    },
    {
      fieldType: "input",
      label: "Ends At",
      name: "endsAt",
      attrs: {
        type: "number",
        placeholder: "In hours"
      }
    },
    {
      fieldType: "textarea",
      label: "Description",
      name: "description",
      attrs: {
        placeholder: "A few sentences about the work, its materials, and its making."
      }
    }
  ].map((f) => ({
    ...f,
    attrs: {
      ...f.attrs,
      className: inputCls
    }
  }));
  const submit = handleSubmit(async (data) => {
    setLoadingForm(true);
    const transformedImages = await Promise.all([...getValues("images")].map(async (f) => await photoFN(f)));
    try {
      const payload = {
        bidCount: 0,
        category: getValues("category").toLowerCase(),
        categoryLabel: getValues("category"),
        condition: getValues("condition"),
        currentBid: 0,
        description: getValues("description"),
        dimensions: getValues("dimensions"),
        endsAt: inHours(isNaN(getValues("endsAt")) ? 0 : Number(getValues("endsAt"))),
        estimateHigh: getValues("estimateHigh"),
        estimateLow: getValues("estimateLow"),
        images: transformedImages,
        lotNumber: "",
        medium: getValues("medium"),
        provenance: getValues("provenance"),
        reserveMet: false,
        sellerSlug: getUserName(user?.email),
        slug: crypto.randomUUID(),
        startBid: getValues("startBid"),
        status: "pending",
        title: getValues("title"),
        year: getValues("year"),
        // added props
        userID: user?.userID,
        price: getValues("price")
      };
      formControl.reset();
      setImagesIndex(1);
      await addDocToCollection({
        collections: "auctions",
        document: payload
      });
      setTimeout(() => {
        toast.success({
          title: "Success",
          description: "Your Auction Lot Have Been Submitted For Review"
        });
      }, 3100);
    } catch (error) {
      toast.error({
        title: "Error Message",
        description: error.message
      });
    } finally {
      setTimeout(() => {
        setLoadingForm(false);
      }, 3e3);
    }
  }, (invalidate) => {
    console.log(invalidate);
    Object.keys(invalidate).forEach((k) => {
      toast.reserved({
        title: invalidate[k]?.message || EMPTY_TEXT,
        description: "Invalid Form Fields",
        position: "top-left"
      });
    });
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Consign", title: "Sell your artwork", description: "Upload a work to be reviewed for the next exhibition. Provide the most accurate details you can." }),
    loadingForm && /* @__PURE__ */ jsx(Loader, { message: "Please Hold As We Process This Request...", variant: "dots", size: "xs", fullScreen: true, className: "flex flex-col" }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-6 lg:grid-cols-[1.4fr_1fr]", children: /* @__PURE__ */ jsxs(FormProvider, { ...formControl, children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsx(ImageUploader, { slotCount: imagesIndex, onSlotCountChange: setImagesIndex }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: /* @__PURE__ */ jsx(Fields, { fields }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: loadingForm, className: "self-start border border-ink bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay disabled:opacity-50 disabled:pointer-events-none", children: loadingForm || isLoading || isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Submit For Review" }),
          /* @__PURE__ */ jsx("button", { disabled: loadingForm, className: "self-start border border-ink bg-canvas px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-ink hover:text-clay hover:bg-clay/5 hover:border-clay/80 disabled:opacity-50 disabled:pointer-events-none", onClick: () => {
            formControl.reset();
            setImagesIndex(1);
          }, type: "reset", children: "Reset" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "self-start lg:sticky lg:top-32", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl italic", children: "Your listings" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-detail", children: "Drafts you've submitted so far." }),
        auctions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "mt-6 border border-dashed border-ink/15 p-8 text-center text-sm text-detail", children: "No listings yet." }) : /* @__PURE__ */ jsx("ul", { className: "mt-6 flex flex-col gap-4", children: auctions.map((a) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 border border-ink/10 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 ", children: /* @__PURE__ */ jsx(AuctionImageSwiper, { images: a.images, alt: "Auctions Drafts", aspect: "aspect-[5/5]" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: a.category }),
            /* @__PURE__ */ jsx("p", { className: "font-display text-lg italic", children: a.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-detail", children: a.sellerSlug }),
            /* @__PURE__ */ jsx("p", { className: "mt-auto text-sm", children: formatMoney(a.price) })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: async () => {
            setLoadingForm(true);
            setTimeout(() => {
              setLoadingForm(false);
            }, 2e3);
            await deleteDocument({
              collectionName: "auctions",
              id: a.id,
              message: `${a.title} Has Been Deleted Successfully From Your Draft`
            });
          }, className: "self-start text-detail hover:text-clay", "aria-label": "Remove", children: /* @__PURE__ */ jsx(Trash2, { className: "size-4", strokeWidth: 1.25 }) })
        ] }, a.id)) })
      ] })
    ] }) })
  ] });
}
const inputCls = "w-full border border-ink/20 bg-canvas px-4 py-2.5 text-base text-ink placeholder:text-detail/50 focus:border-ink focus:outline-none";
export {
  SellPage as component
};
