import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Listing } from "@/types";
import { Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { AccountStatusBlocker } from "@/components/site/AccountStatusBlocker";
import { useStore, type UserListing } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";
import Fields, { FieldProps } from "@/components/site/Fields";
import ImageUploader from "@/components/site/ImageUploader";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuctionLot, inHours } from "@/data/auctions";
import { CategorySlug } from "@/data/artworks";
import { getUserName, photoFN } from "@/utils";
import useDoc from "@/hooks/useDoc";
import { toast } from "@/lib/useToast";
import { EMPTY_TEXT } from "@/lib/emptyState";
import { sendGalleryEmail } from "@/lib/emailjsTemplate";
import { SITE_INFO } from "@/lib/siteInfo";
import { Loader } from "@/components/site/Loader";
import { AuctionImageSwiper } from "@/components/site/AuctionImageSwiper";
import { formatMoney } from "@/lib/wallet";

export const Route = createFileRoute("/sell")({
  component: SellPage,
  head: () => ({ meta: [{ title: "Sell your work — sharjahbiennial" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    fromListing: typeof search.fromListing === "string" ? search.fromListing : undefined,
  }),
});

// Stable selectors to avoid re-render storms from live snapshots
const selectListings = (s: any) => s.listings ?? [];

function listingsShallowEqual(a: any[], b: any[]) {
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

const categories = [
  "Painting",
  "Sculpture",
  "Photography",
  "Drawing",
  "Mixed Media",
  "Ceramics",
  "Digital",
];

const empty = {
  title: "",
  artist: "",
  medium: "",
  dimensions: "",
  year: new Date().getFullYear(),
  price: 0,
  category: categories[0],
  description: "",
  image: "",
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const auctionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Select A Category" }),
  year: z
    .number()
    .min(1950, { message: "Year Must Not Go Below 1950" })
    .max(new Date().getFullYear(), { message: "Current Year Is The Year Of Upload" }),
  medium: z.string().min(1, { message: "Medium is required" }),
  dimensions: z.string().min(1, { message: "Dimensions is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  provenance: z.string().min(1, { message: "Provenance is requred" }),
  condition: z.string().min(1, { message: "Condition is required" }),
  // images can be empty when reusing from a previous listing (sourceImages are kept separately)
  images: z
    .array(
      z
        .instanceof(File, { message: "Please upload a valid file." })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Max file size is 5MB.",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: "Only .jpg, .jpeg, and .png formats are supported.",
        }),
    )
    .optional()
    .default([]),
  estimateLow: z
    .number()
    .positive("Estimated Low Amount must be greater than 0")
    .min(100, { message: "Minimum Amount Must Be Above 10" })
    .max(100_000, "Amount must be less than 1,000,000"),
  // price: z
  //   .number()
  //   .positive("Amount must be greater than 0")
  //   .max(1_000_000, "Amount must be less than 1,000,000"),
  estimateHigh: z
    .number()
    .positive("Estimated High Amount must be greater than 0")
    .min(200, { message: "Minimum Amount Must Be Above 10" })
    .max(200_000, { message: "Maximum Amount is a Million" }),
  startBid: z
    .number()
    .positive("Start Bid Amount must be greater than 0")
    .min(100, { message: "Start Bid is required" })
    .max(100_000, { message: "Maximum Amount is a Million" }),
  // currentBid: z
  //   .number()
  //   .positive("Current Bid Amount must be greater than 0")
  //   .min(1, { message: "Current Bid is required" }),
  endsAt: z
    .number()
    .min(24, { message: "Minimum Time For Auction is 24 hours" })
    .max(96, { message: "Maximum Time Limit is 96 hours" }),
});

function SellPage() {
  // ================================================================
  // ALL HOOKS MUST BE DECLARED HERE, UNCONDITIONALLY, IN THE SAME ORDER EVERY RENDER.
  // No hooks, no useState, no useEffect, no useForm, nothing after the early returns.
  // ================================================================

  const { auctions } = useDataStore(
    useShallow((s) => ({
      auctions: s.auctions,
    })),
  );

  const { user, loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated,
    })),
  );

  // Primitive status selector — when admin approves/suspends via onSnapshot,
  // this component re-renders immediately and blocks the form + button.
  const isUserActive = useAuthStore((s) => s.user?.status === "active");

  // Read the search param that listings.tsx passes when user clicks "Edit & Re-auction"
  const { fromListing } = Route.useSearch();

  // Stable listings read (avoid re-renders from live snapshots)
  const listings = useDataStore(selectListings, listingsShallowEqual);

  // Find the source listing to prefill from (stable)
  const sourceListing = useMemo(() => {
    if (!fromListing || !Array.isArray(listings)) return null;
    return listings.find((l: Listing) => l.slug === fromListing) ?? null;
  }, [fromListing, listings]);

  const [imagesIndex, setImagesIndex] = useState(1);
  const [loadingForm, setLoadingForm] = useState(false);
  const [keptPreloaded, setKeptPreloaded] = useState<string[]>([]);
  const didPrefillRef = useRef(false);
  const { addDocToCollection, deleteDocument } = useDoc();

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
      year: 0,
    },
  });

  const {
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isValid, isLoading, isSubmitting },
  } = formControl;

  // Watch for new image uploads so we can drop kept images when user starts uploading replacements
  const watchedImages = useWatch({ name: "images", control: formControl.control }) || [];

  useEffect(() => {
    formControl.trigger("images");
  }, [formControl]);

  // If user uploads any new files while we had kept images, discard the old ones
  useEffect(() => {
    if ((watchedImages?.length || 0) > 0 && keptPreloaded.length > 0) {
      setKeptPreloaded([]);
    }
  }, [watchedImages?.length]);

  // Prefill from won listing when redirected via ?fromListing=slug
  useEffect(() => {
    if (!sourceListing || didPrefillRef.current) return;

    didPrefillRef.current = true;

    const catRaw = (sourceListing.category || "").toString();

    const bid = Number(sourceListing.bidAmount) || 0;

    setValue("title", sourceListing.title || "", { shouldValidate: true });
    setValue("year", Number(sourceListing.year) || new Date().getFullYear(), {
      shouldValidate: true,
    });
    setValue("medium", sourceListing.medium || "", { shouldValidate: true });
    setValue("dimensions", sourceListing.dimensions || "", { shouldValidate: true });
    setValue("description", sourceListing.description || "", { shouldValidate: true });
    setValue("provenance", sourceListing.provenance || "", { shouldValidate: true });
    setValue("condition", sourceListing.condition || "", { shouldValidate: true });
    // Match the select option values (lowercase)
    setValue("category", catRaw ? catRaw.toLowerCase() : "painting", { shouldValidate: true });

    // Money fields - fall back to winning bid
    setValue("estimateLow", Math.max(100, Math.floor(bid * 0.8)) || 1000, { shouldValidate: true });
    setValue("estimateHigh", Math.max(200, Math.floor(bid * 1.3)) || 1500, {
      shouldValidate: true,
    });
    setValue("startBid", Math.max(100, bid) || 1000, { shouldValidate: true });
    setValue("endsAt", 48, { shouldValidate: true });

    if (Array.isArray(sourceListing.images) && sourceListing.images.length > 0) {
      setKeptPreloaded(sourceListing.images);
      // Show a reasonable number of upload slots in case user wants to replace
      setImagesIndex(Math.min(3, Math.max(1, sourceListing.images.length)));
      // Clear any image validation errors since we are reusing
      formControl.clearErrors("images");
    }
  }, [sourceListing, setValue, formControl]);

  // --- Early returns are now safe ---
  if (loading || !isAuthHydrated) {
    return <Loader message="Loading..." className="min-h-[60vh]" />;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-detail">Consign</p>
          <h1 className="mt-3 font-display text-4xl italic text-ink">Sign in to sell</h1>
          <p className="mt-3 text-sm text-detail">
            You need an account to list artwork for exhibition.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/connect"
              className="inline-block border border-ink bg-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
            >
              Sign in
            </Link>
            <Link
              to="/"
              className="inline-block border border-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Non-hook code only below this line.
  const fields = (
    [
      { fieldType: "input", label: "Title", name: "title" },
      {
        fieldType: "input",
        label: "Medium",
        name: "medium",
        attrs: { placeholder: "e.g. Oil on linen" },
      },
      {
        fieldType: "input",
        label: "Dimensions",
        name: "dimensions",
        attrs: { placeholder: "e.g. 80 × 60 cm" },
      },
      {
        fieldType: "input",
        label: "Provenance",
        name: "provenance",
        attrs: { placeholder: "Authenticity of the artwork" },
      },
      {
        fieldType: "input",
        label: "Condition",
        name: "condition",
        attrs: { placeholder: "Condition of the artwork" },
      },
      {
        fieldType: "input",
        label: "Year",
        name: "year",
        attrs: { type: "number", placeholder: "Year" },
      },
      // {
      //   fieldType: "input",
      //   label: "Price",
      //   name: "price",
      //   format: "money" as const,
      // },
      { fieldType: "input", label: "Estimate Low", name: "estimateLow", format: "money" as const },
      {
        fieldType: "input",
        label: "Estimate High",
        name: "estimateHigh",
        format: "money" as const,
      },
      { fieldType: "input", label: "Start Bid", name: "startBid", format: "money" as const },
      // { fieldType: "input", label: "Current Bid", name: "currentBid", format: "money" as const },
      {
        fieldType: "select",
        label: "Category",
        name: "category",
        options: categories.map((c) => ({ label: c, value: c.toLowerCase() })),
      },
      {
        fieldType: "input",
        label: "Ends At (in hours)",
        name: "endsAt",
        attrs: {
          type: "number",
          placeholder: "In hours",
        },
      },
      {
        fieldType: "textarea",
        label: "Description",
        name: "description",
        attrs: { placeholder: "A few sentences about the work, its materials, and its making." },
      },
    ] as FieldProps["fields"]
  ).map((f) => ({
    ...f,
    attrs: { ...f.attrs, className: inputCls },
  })) as FieldProps["fields"];

  const submit = handleSubmit(
    async (data) => {
      // ALWAYS read the absolute latest user from the store inside the handler.
      // This defeats stale closures from rapid Firestore snapshots.
      const currentUser = useAuthStore.getState().user;

      if (!currentUser || currentUser.status !== "active") {
        toast.error({
          title: "Account not active",
          description: "Your account must be approved before you can submit listings for sale.",
        });
        setLoadingForm(false);
        return;
      }

      setLoadingForm(true);

      // Determine final images:
      // 1. Prefer newly uploaded files
      // 2. Fall back to kept images from the source listing (when user clicked "Edit & Re-auction")
      const newFiles: File[] = getValues("images") || [];
      let finalImages: string[] = [];

      try {
        if (newFiles.length > 0) {
          finalImages = await Promise.all([...newFiles].map(async (f) => await photoFN(f)));
        } else if (keptPreloaded.length > 0) {
          finalImages = [...keptPreloaded];
        }

        if (finalImages.length === 0) {
          toast.error({
            title: "Images required",
            description: "Please upload at least one image or reuse the images from your listing.",
          });
          setLoadingForm(false);
          return;
        }

        const payload: Omit<AuctionLot, "id"> = {
          bidCount: 0,
          category: getValues("category").toLowerCase() as CategorySlug,
          categoryLabel: getValues("category") as CategorySlug,
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
          userID: currentUser.userID,
        };

        await addDocToCollection({
          collections: "auctions",
          document: payload,
        });

        // Notify user and admin of new listing submission
        try {
          await sendGalleryEmail("listing_submitted", {
            to_email: currentUser.email,
            to_name: currentUser.fullName,
            title: getValues("title"),
            slug: payload.slug,
            bidAmount: getValues("startBid"),
            category: getValues("category"),
            medium: getValues("medium"),
            year: getValues("year"),
            fullName: currentUser.fullName,
          });

          await sendGalleryEmail("admin_new_listing", {
            to_email: SITE_INFO.contact.email,
            to_name: "Admin",
            title: getValues("title"),
            slug: payload.slug,
            bidAmount: getValues("startBid"),
            category: getValues("category"),
            medium: getValues("medium"),
            fullName: currentUser.fullName,
          });
        } catch (e) {
          console.warn("[email] listing notification failed", e);
        }

        // Reset local state
        reset();
        setKeptPreloaded([]);
        setImagesIndex(1);
        didPrefillRef.current = false;

        setTimeout(() => {
          toast.success({
            title: "Success",
            description: "Your Auction Lot Have Been Submitted For Review",
          });
        }, 800);
      } catch (error: any) {
        toast.error({
          title: "Error",
          description: error?.message || "Failed to submit auction lot.",
        });
      } finally {
        setTimeout(() => {
          setLoadingForm(false);
        }, 600);
      }
    },
    (invalidate) => {
      console.log(invalidate);

      Object.keys(invalidate).forEach((k) => {
        toast.reserved({
          title: invalidate[k as keyof typeof invalidate]?.message || EMPTY_TEXT,
          description: "Invalid Form Fields",
          position: "top-left",
        });
      });
    },
  );

  // Show a helpful banner when coming from "Edit & Re-auction"
  const isReListing = !!sourceListing;
  const isAccountActive = user.status === "active";

  return (
    <>
      <PageHeader
        eyebrow="Consign"
        title={isReListing ? "Re-list your work" : "Sell your artwork"}
        description={
          isReListing
            ? `Creating a new auction from your won piece: ${sourceListing?.title}. Adjust details below and submit for review.`
            : "Upload a work to be reviewed for the next exhibition. Provide the most accurate details you can."
        }
      />

      {loadingForm && (
        <Loader
          message="Please Hold As We Process This Request..."
          variant="dots"
          size="xs"
          fullScreen
          className="flex flex-col"
        />
      )}

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-6 ">
        {isReListing && (
          <div className="-mb-6 rounded border border-clay/40 bg-clay/5 px-4 py-3 text-sm text-clay">
            Re-listing <span className="font-medium">{sourceListing?.title}</span>. The previous
            images are pre-selected below. You can keep them or replace by uploading new ones.
          </div>
        )}

        <FormProvider {...formControl}>
          <form onSubmit={submit} className="flex flex-col gap-6">
            {!isAccountActive && <AccountStatusBlocker action="sell" />}

            {/* Image Uploader */}
            <div className="space-y-3">
              <ImageUploader slotCount={imagesIndex} onSlotCountChange={setImagesIndex} />

              {/* Show reused images from the won listing when user clicked "Edit & Re-auction" */}
              {keptPreloaded.length > 0 && (watchedImages?.length || 0) === 0 && (
                <div className="border border-ink/20 bg-surface/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                      Reusing images from your won listing ({keptPreloaded.length})
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setKeptPreloaded([]);
                        setImagesIndex(1);
                      }}
                      className="text-[10px] uppercase tracking-[0.18em] border border-ink/30 px-2 py-0.5 hover:bg-ink hover:text-canvas"
                    >
                      Clear &amp; upload new
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {keptPreloaded.map((src, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] overflow-hidden border border-ink/10 bg-surface"
                      >
                        <img
                          src={src}
                          alt={`Previous view ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="mt-2 text-[10px] text-detail/70">
                    These images will be used for the new auction. Upload new images above to
                    replace them.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Fields fields={fields} />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loadingForm || !isAccountActive}
                className="self-start border border-ink bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay disabled:opacity-50 disabled:pointer-events-none"
              >
                {loadingForm || isLoading || isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit For Review"
                )}
              </button>
              <button
                disabled={loadingForm || !isAccountActive}
                className="self-start border border-ink bg-canvas px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-ink hover:text-clay hover:bg-clay/5 hover:border-clay/80 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  reset();
                  setKeptPreloaded([]);
                  setImagesIndex(1);
                  didPrefillRef.current = false;
                }}
                type="reset"
              >
                Reset
              </button>
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
}

const inputCls =
  "w-full border border-ink/20 bg-canvas px-4 py-2.5 text-base text-ink placeholder:text-detail/50 focus:border-ink focus:outline-none";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-detail">{label}</span>
      {children}
    </label>
  );
}
