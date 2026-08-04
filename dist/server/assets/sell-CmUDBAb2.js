import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, Upload, Loader2 } from "lucide-react";
import { A as AccountStatusBlocker } from "./AccountStatusBlocker-DLVsxeue.js";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import { F as Fields } from "./Fields-DF9Phyx1.js";
import { useFormContext, useForm, useWatch, FormProvider } from "react-hook-form";
import { d as toast, c as useDataStore, b as useAuthStore, R as Route, e as useDoc, p as photoFN, g as getUserName, i as inHours, s as sendUserNotification, f as sendAdminNotification } from "./router-BX1vAgXZ.js";
import { useShallow } from "zustand/shallow";
import z__default from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { L as Loader } from "./Loader-BKqcHLqb.js";
import "./currencies-G6nNjE1o.js";
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
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
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
const selectListings = (s) => s.listings ?? [];
function listingsShallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ak = a[i]?.slug ?? a[i]?.id;
    const bk = b[i]?.slug ?? b[i]?.id;
    if (ak !== bk) return false;
  }
  return true;
}
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
  // images can be empty when reusing from a previous listing (sourceImages are kept separately)
  images: z__default.array(z__default.instanceof(File, {
    message: "Please upload a valid file."
  }).refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Max file size is 5MB."
  }).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only .jpg, .jpeg, and .png formats are supported."
  })).optional().default([]),
  estimateLow: z__default.number().positive("Estimated Low Amount must be greater than 0").min(100, {
    message: "Minimum Amount Must Be Above 10"
  }).max(1e5, "Amount must be less than 1,000,000"),
  // price: z
  //   .number()
  //   .positive("Amount must be greater than 0")
  //   .max(1_000_000, "Amount must be less than 1,000,000"),
  estimateHigh: z__default.number().positive("Estimated High Amount must be greater than 0").min(200, {
    message: "Minimum Amount Must Be Above 10"
  }).max(2e5, {
    message: "Maximum Amount is a Million"
  }),
  startBid: z__default.number().positive("Start Bid Amount must be greater than 0").min(100, {
    message: "Start Bid is required"
  }).max(1e5, {
    message: "Maximum Amount is a Million"
  }),
  // currentBid: z
  //   .number()
  //   .positive("Current Bid Amount must be greater than 0")
  //   .min(1, { message: "Current Bid is required" }),
  endsAt: z__default.number().min(24, {
    message: "Minimum Time For Auction is 24 hours"
  }).max(96, {
    message: "Maximum Time Limit is 96 hours"
  })
});
function SellPage() {
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
  useAuthStore((s) => s.user?.status === "active");
  const {
    fromListing
  } = Route.useSearch();
  const listings = useDataStore(selectListings, listingsShallowEqual);
  const sourceListing = useMemo(() => {
    if (!fromListing || !Array.isArray(listings)) return null;
    return listings.find((l) => l.slug === fromListing) ?? null;
  }, [fromListing, listings]);
  const [imagesIndex, setImagesIndex] = useState(1);
  const [loadingForm, setLoadingForm] = useState(false);
  const [keptPreloaded, setKeptPreloaded] = useState([]);
  const didPrefillRef = useRef(false);
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
      // price: 0,
      startBid: 0,
      year: 0
    }
  });
  const {
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: {
      isValid,
      isLoading,
      isSubmitting
    }
  } = formControl;
  const watchedImages = useWatch({
    name: "images",
    control: formControl.control
  }) || [];
  useEffect(() => {
    formControl.trigger("images");
  }, [formControl]);
  useEffect(() => {
    if ((watchedImages?.length || 0) > 0 && keptPreloaded.length > 0) {
      setKeptPreloaded([]);
    }
  }, [watchedImages?.length]);
  useEffect(() => {
    if (!sourceListing || didPrefillRef.current) return;
    didPrefillRef.current = true;
    const catRaw = (sourceListing.category || "").toString();
    const bid = Number(sourceListing.bidAmount) || 0;
    setValue("title", sourceListing.title || "", {
      shouldValidate: true
    });
    setValue("year", Number(sourceListing.year) || (/* @__PURE__ */ new Date()).getFullYear(), {
      shouldValidate: true
    });
    setValue("medium", sourceListing.medium || "", {
      shouldValidate: true
    });
    setValue("dimensions", sourceListing.dimensions || "", {
      shouldValidate: true
    });
    setValue("description", sourceListing.description || "", {
      shouldValidate: true
    });
    setValue("provenance", sourceListing.provenance || "", {
      shouldValidate: true
    });
    setValue("condition", sourceListing.condition || "", {
      shouldValidate: true
    });
    setValue("category", catRaw ? catRaw.toLowerCase() : "painting", {
      shouldValidate: true
    });
    setValue("estimateLow", Math.max(100, Math.floor(bid * 0.8)) || 1e3, {
      shouldValidate: true
    });
    setValue("estimateHigh", Math.max(200, Math.floor(bid * 1.3)) || 1500, {
      shouldValidate: true
    });
    setValue("startBid", Math.max(100, bid) || 1e3, {
      shouldValidate: true
    });
    setValue("endsAt", 48, {
      shouldValidate: true
    });
    if (Array.isArray(sourceListing.images) && sourceListing.images.length > 0) {
      setKeptPreloaded(sourceListing.images);
      setImagesIndex(Math.min(3, Math.max(1, sourceListing.images.length)));
      formControl.clearErrors("images");
    }
  }, [sourceListing, setValue, formControl]);
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
    // {
    //   fieldType: "input",
    //   label: "Price",
    //   name: "price",
    //   format: "money" as const,
    // },
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
      label: "Ends At (in hours)",
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
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.status !== "active") {
      toast.error({
        title: "Account not active",
        description: "Your account must be approved before you can submit listings for sale."
      });
      setLoadingForm(false);
      return;
    }
    setLoadingForm(true);
    const newFiles = getValues("images") || [];
    let finalImages = [];
    try {
      if (newFiles.length > 0) {
        finalImages = await Promise.all([...newFiles].map(async (f) => await photoFN(f)));
      } else if (keptPreloaded.length > 0) {
        finalImages = [...keptPreloaded];
      }
      if (finalImages.length === 0) {
        toast.error({
          title: "Images required",
          description: "Please upload at least one image or reuse the images from your listing."
        });
        setLoadingForm(false);
        return;
      }
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
        images: finalImages,
        lotNumber: "",
        medium: getValues("medium"),
        provenance: getValues("provenance"),
        reserveMet: false,
        sellerSlug: getUserName(currentUser.email),
        slug: crypto.randomUUID(),
        startBid: getValues("startBid"),
        status: "pending",
        title: getValues("title"),
        year: getValues("year"),
        // added props
        userID: currentUser.userID
      };
      await addDocToCollection({
        collections: "auctions",
        document: payload
      });
      try {
        await sendUserNotification("listing_submitted", {
          to_email: currentUser.email,
          to_name: currentUser.fullName,
          title: getValues("title"),
          slug: payload.slug,
          bidAmount: getValues("startBid"),
          category: getValues("category"),
          medium: getValues("medium"),
          year: getValues("year"),
          fullName: currentUser.fullName
        });
        await sendAdminNotification("listing_submitted", {
          title: getValues("title"),
          slug: payload.slug,
          bidAmount: getValues("startBid"),
          category: getValues("category"),
          medium: getValues("medium"),
          year: getValues("year"),
          fullName: currentUser.fullName,
          email: currentUser.email
        });
      } catch (e) {
        console.warn("[email] listing notification failed", e);
      }
      reset();
      setKeptPreloaded([]);
      setImagesIndex(1);
      didPrefillRef.current = false;
      setTimeout(() => {
        toast.success({
          title: "Success",
          description: "Your Auction Lot Have Been Submitted For Review"
        });
      }, 800);
    } catch (error) {
      toast.error({
        title: "Error",
        description: error?.message || "Failed to submit auction lot."
      });
    } finally {
      setTimeout(() => {
        setLoadingForm(false);
      }, 600);
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
  const isReListing = !!sourceListing;
  const isAccountActive = user.status === "active";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Consign", title: isReListing ? "Re-list your work" : "Sell your artwork", description: isReListing ? `Creating a new auction from your won piece: ${sourceListing?.title}. Adjust details below and submit for review.` : "Upload a work to be reviewed for the next exhibition. Provide the most accurate details you can." }),
    loadingForm && /* @__PURE__ */ jsx(Loader, { message: "Please Hold As We Process This Request...", variant: "dots", size: "xs", fullScreen: true, className: "flex flex-col" }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-6 ", children: [
      isReListing && /* @__PURE__ */ jsxs("div", { className: "-mb-6 rounded border border-clay/40 bg-clay/5 px-4 py-3 text-sm text-clay", children: [
        "Re-listing",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: sourceListing?.title }),
        ". The previous images are pre-selected below. You can keep them or replace by uploading new ones."
      ] }),
      /* @__PURE__ */ jsx(FormProvider, { ...formControl, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-6", children: [
        !isAccountActive && /* @__PURE__ */ jsx(AccountStatusBlocker, { action: "sell" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(ImageUploader, { slotCount: imagesIndex, onSlotCountChange: setImagesIndex }),
          keptPreloaded.length > 0 && (watchedImages?.length || 0) === 0 && /* @__PURE__ */ jsxs("div", { className: "border border-ink/20 bg-surface/40 p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-[0.22em] text-detail", children: [
                "Reusing images from your won listing (",
                keptPreloaded.length,
                ")"
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                setKeptPreloaded([]);
                setImagesIndex(1);
              }, className: "text-[10px] uppercase tracking-[0.18em] border border-ink/30 px-2 py-0.5 hover:bg-ink hover:text-canvas", children: "Clear & upload new" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: keptPreloaded.map((src, i) => /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] overflow-hidden border border-ink/10 bg-surface", children: /* @__PURE__ */ jsx("img", { src, alt: `Previous view ${i + 1}`, className: "h-full w-full object-cover" }) }, i)) }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px] text-detail/70", children: "These images will be used for the new auction. Upload new images above to replace them." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: /* @__PURE__ */ jsx(Fields, { fields }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: loadingForm || !isAccountActive, className: "self-start border border-ink bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay disabled:opacity-50 disabled:pointer-events-none", children: loadingForm || isLoading || isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Submit For Review" }),
          /* @__PURE__ */ jsx("button", { disabled: loadingForm || !isAccountActive, className: "self-start border border-ink bg-canvas px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-ink hover:text-clay hover:bg-clay/5 hover:border-clay/80 disabled:opacity-50 disabled:pointer-events-none", onClick: () => {
            reset();
            setKeptPreloaded([]);
            setImagesIndex(1);
            didPrefillRef.current = false;
          }, type: "reset", children: "Reset" })
        ] })
      ] }) })
    ] })
  ] });
}
const inputCls = "w-full border border-ink/20 bg-canvas px-4 py-2.5 text-base text-ink placeholder:text-detail/50 focus:border-ink focus:outline-none";
export {
  SellPage as component
};
