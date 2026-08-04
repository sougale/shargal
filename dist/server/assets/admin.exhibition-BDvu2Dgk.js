import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Gavel, Hammer, Search, Pause } from "lucide-react";
import { c as useDataStore, ac as AdminLoader, V as SectionHeader, ad as TabBar, e as useDoc, ae as DataTable, Z as fmtMoney, af as StatusChip, ag as RecordSheet, A as AuctionImageSwiper, m as db, s as sendUserNotification, f as sendAdminNotification, l as fmtDateTime, C as getAuctionBySlug, i as inHours, a as useToast } from "./router-BX1vAgXZ.js";
import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/shallow";
import { getDoc, doc, serverTimestamp } from "firebase/firestore";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
function ExhibitionAdmin() {
  const [tab, setTab] = useState("auctions");
  const [q, setQ] = useState("");
  const {
    auctions,
    bids
  } = useDataStore(useShallow((s) => ({
    auctions: s.auctions,
    bids: s.bids
  })));
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("Processing...");
  const [pageLoading, setPageLoading] = useState(false);
  useEffect(() => {
    if (auctions && auctions.length > 0 || bids && bids.length > 0) {
      setPageLoading(false);
    }
  }, [auctions?.length, bids?.length]);
  const startAction = (msg) => {
    setActionMessage(msg);
    setActionLoading(true);
  };
  const stopAction = () => setActionLoading(false);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1440px]", children: [
    /* @__PURE__ */ jsx(AdminLoader, { fullscreen: true, variant: "page", isLoading: pageLoading, message: "Loading exhibition", subMessage: "Preparing auction & bid data" }),
    /* @__PURE__ */ jsx(AdminLoader, { fullscreen: true, variant: "action", isLoading: actionLoading, message: actionMessage }),
    /* @__PURE__ */ jsx(SectionHeader, { title: "Exhibition", description: "Curate the catalog: artworks, artists, live auctions and categories. Click any row to view, edit and run operations." }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-2 gap-3 md:grid-cols-5", children: [
      /* @__PURE__ */ jsx(Kpi, { icon: Gavel, label: "Live lots", value: auctions.length.toString(), accent: true }),
      /* @__PURE__ */ jsx(Kpi, { icon: Hammer, label: "Live bids", value: bids.length.toString(), accent: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx(TabBar, { tabs: [
        // { id: "artworks", label: "Artworks", count: artworks.length },
        {
          id: "auctions",
          label: "All Auctions",
          count: auctions.length
        },
        {
          id: "bids",
          label: "All Bids",
          count: bids.length
        }
        // { id: "categories", label: "Categories", count: categories.length },
      ], active: tab, onChange: (id) => setTab(id) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)] " }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: `Search ${tab}…`, className: "h-9 w-64 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]" })
      ] })
    ] }),
    tab === "auctions" && /* @__PURE__ */ jsx(AuctionsPanel, { q, rows: auctions, startAction, stopAction }),
    tab === "bids" && /* @__PURE__ */ jsx(BidsPanel, { q, rows: bids, startAction, stopAction })
  ] });
}
function AuctionsPanel({
  q,
  rows,
  startAction,
  stopAction
}) {
  const [selected, setSelected] = useState(null);
  const data = rows.filter((l) => !q || l.title.toLowerCase().includes(q.toLowerCase()) || l.lotNumber.includes(q)).map((l) => ({
    ...l
  }));
  const {
    updateDocument
  } = useDoc();
  const {
    toast
  } = useToast();
  const fields = [
    {
      key: "title",
      label: "Lot title",
      span: 2
    },
    // { key: "lotNumber", label: "Lot #" },
    {
      key: "categoryLabel",
      label: "Category"
    },
    {
      key: "medium",
      label: "Medium"
    },
    {
      key: "dimensions",
      label: "Dimensions"
    },
    {
      key: "year",
      label: "Year",
      kind: "number"
    },
    {
      key: "estimateLow",
      label: "Estimate low",
      kind: "money"
    },
    {
      key: "estimateHigh",
      label: "Estimate high",
      kind: "money"
    },
    {
      key: "currentBid",
      label: "Current bid",
      kind: "money"
    },
    {
      key: "startBid",
      label: "Start bid",
      kind: "money"
    },
    {
      key: "condition",
      label: "Condition"
    },
    {
      key: "provenance",
      label: "Provenance",
      kind: "textarea"
    },
    {
      key: "description",
      label: "Description",
      kind: "textarea",
      span: 2
    },
    {
      key: "status",
      label: "Status",
      kind: "select",
      render(value, row) {
        return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: value }) });
      },
      options: [{
        label: "Active",
        value: "active"
      }, {
        label: "Pending",
        value: "pending"
      }, {
        label: "Suspended",
        value: "suspended"
      }]
    }
  ];
  const [imagesHover, setImagesHover] = useState([]);
  const [uniqueImageID, setUniqueImageID] = useState(null);
  const open = (e, {
    id,
    images
  }) => {
    if (images.length) setImagesHover(images);
    if (id) {
      setUniqueImageID(id);
    }
  };
  const scheduleClose = () => {
    setUniqueImageID(null);
  };
  const {
    deleteDocument
  } = useDoc();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTable, { rows: data, onRowClick: (r) => setSelected(r), columns: [{
      key: "title",
      header: "Lot",
      render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-[105%] w-auto h-auto ml-1 p-2 flex gap-2 ", onMouseEnter: (e) => {
          e.stopPropagation();
          open(e, {
            id: r.id,
            images: r.images
          });
        }, onMouseLeave: () => {
          scheduleClose();
        }, children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: r.id === uniqueImageID && imagesHover.length > 0 && imagesHover.map((i, num) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: {
              opacity: 0,
              x: 10
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: 10
            },
            children: /* @__PURE__ */ jsx("img", { src: i, className: "size-16 transition object-cover aspect-auto rounded transition" }, i)
          }
        )) }) }),
        r.images?.[0] && /* @__PURE__ */ jsx("img", { onMouseEnter: (e) => {
          e.stopPropagation();
          open(e, {
            id: r.id,
            images: r.images
          });
        }, onMouseLeave: () => {
          scheduleClose();
        }, onClick: (e) => {
          e.stopPropagation();
          open(e, {
            id: r.id,
            images: r.images
          });
        }, src: r.images[0], alt: r.title, className: "size-12 border rounded object-cover" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.title }),
          /* @__PURE__ */ jsx("p", { className: "a-mono text-[10px] text-[var(--a-muted)]", children: r.sellerSlug })
        ] })
      ] })
    }, {
      key: "estimate",
      header: "Estimate",
      render: (r) => /* @__PURE__ */ jsxs("span", { className: "a-mono text-xs text-[var(--a-fg-2)]", children: [
        fmtMoney(r.estimateLow),
        " – ",
        fmtMoney(r.estimateHigh)
      ] })
    }, {
      key: "bid",
      header: "Current bid",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-accent)]", children: fmtMoney(r.currentBid ?? 0) })
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: r.status ?? "active" })
    }] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), eyebrow: `${selected?.sellerSlug ?? ""}`, title: selected?.title ?? "", subtitle: selected ? `${selected.categoryLabel} · ${fmtMoney(selected.currentBid ?? 0)}` : void 0, record: selected, fields, onSave: async (p) => {
      if (!selected) return;
      startAction("Updating auction lot...");
      try {
        await updateDocument({
          collections: "auctions",
          document: {
            ...selected,
            id: selected.id,
            ...p
          }
        });
        const newStatus = p.status;
        if (newStatus && newStatus !== selected.status) {
          try {
            let sellerEmail = "";
            let sellerName = selected.sellerSlug;
            try {
              const sellerDoc = await getDoc(doc(db, "users", selected.userID));
              if (sellerDoc.exists()) {
                const s = sellerDoc.data();
                sellerEmail = s.email || "";
                sellerName = s.fullName || selected.sellerSlug;
              }
            } catch {
            }
            if (newStatus === "active") {
              if (sellerEmail) {
                await sendUserNotification("listing_approved", {
                  to_email: sellerEmail,
                  to_name: sellerName,
                  title: selected.title,
                  slug: selected.slug,
                  category: selected.categoryLabel,
                  medium: selected.medium
                });
              }
              await sendAdminNotification("listing_approved", {
                title: selected.title,
                slug: selected.slug,
                fullName: sellerName,
                email: sellerEmail
              });
            }
            if (newStatus === "suspended" || newStatus === "pending") {
              if (sellerEmail) {
                await sendUserNotification("listing_rejected", {
                  to_email: sellerEmail,
                  to_name: sellerName,
                  title: selected.title,
                  slug: selected.slug,
                  reason: "Status updated by admin to " + newStatus
                });
              }
              await sendAdminNotification("listing_rejected", {
                title: selected.title,
                slug: selected.slug,
                fullName: sellerName,
                email: sellerEmail,
                reason: "Status updated by admin to " + newStatus
              });
            }
          } catch (e) {
            console.warn("[email] listing status notification failed", e);
          }
        }
        toast({
          title: "Success",
          description: "Lot Modified Successfully",
          position: "top",
          variant: "info",
          duration: 5e4
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.code || error.message,
          position: "top",
          variant: "error",
          duration: 5e4
        });
      } finally {
        setSelected(null);
        stopAction();
      }
    }, extra: selected?.images?.length && /* @__PURE__ */ jsx(AuctionImageSwiper, { alt: selected.title, images: selected.images }), operations: selected ? [
      {
        id: "delete",
        label: "Delete Auction Lot",
        tone: "danger",
        icon: Pause,
        onRun: async () => {
          if (!selected) {
            toast({
              title: "Error",
              description: "Error In Selection",
              variant: "warning",
              position: "top"
            });
            return;
          }
          startAction("Deleting Auction Lot and returning funds...");
          try {
            await deleteDocument({
              collectionName: "bids",
              id: selected.id,
              message: "Auctioned Lot Successfully Deleted."
            });
          } catch (error) {
            toast({
              title: "Error",
              description: error.message || error.code,
              variant: "error",
              position: "bottom"
            });
          } finally {
            setSelected(null);
            stopAction();
          }
        }
      }
      // },
      // {
      //   id: "pause",
      //   label: "Pause lot",
      //   icon: Pause,
      //   onRun: () => {
      //     patch(selected.slug, { status: "pending" } as Partial<AuctionLot>);
      //     setSelected({ ...selected, status: "pending" });
      //   },
      // },
      // {
      //   id: "close",
      //   label: "Close & award winner",
      //   icon: Hammer,
      //   tone: "primary",
      //   onRun: () => {
      //     toast({
      //       title: "Bid Has Ended",
      //       variant: "default",
      //       position: "top-right",
      //       duration: 5000,
      //     });
      //   },
      // },
      // {
      //   id: "withdraw",
      //   label: "Withdraw lot",
      //   icon: Archive,
      //   tone: "danger",
      //   confirm: "Withdraw this lot from auction?",
      //   onRun: () => {
      //     setRows(rows.filter((l) => l.slug !== selected.slug));
      //     setSelected(null);
      //   },
      // },
      // {
      //   id: "flag",
      //   label: "Flag for review",
      //   icon: Flag,
      //   onRun: () => alert("Flagged (mock)."),
      // },
    ] : void 0 })
  ] });
}
function BidsPanel({
  q,
  rows,
  startAction,
  stopAction
}) {
  const [selected, setSelected] = useState(null);
  const data = rows.filter((l) => !q || l.lotTitle.toLowerCase().includes(q.toLowerCase()) || l.fullName.includes(q)).map((l) => ({
    ...l
  }));
  const {
    toast
  } = useToast();
  const fields = [
    {
      key: "lotTitle",
      label: "Lot title",
      span: 2
    },
    // { key: "lotNumber", label: "Lot #" },
    {
      key: "fullName",
      label: "FullName",
      editable: false
    },
    {
      key: "email",
      label: "Email",
      editable: false
    },
    {
      key: "bidAmount",
      label: "Bid Amount",
      editable: false,
      kind: "money"
    },
    {
      key: "lastBid",
      label: "Last Bid Price",
      editable: false,
      kind: "money"
    }
    // {
    //   key: "status",
    //   label: "Status",
    //   render(value, row) {
    //     return (
    //       <>
    //         <span className="capitalize">{value as string}</span>
    //       </>
    //     );
    //   },
    //   editable: false,
    // },
  ];
  const {
    updateDocument,
    addDocToCollection,
    deleteDocument
  } = useDoc();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTable, { rows: data, onRowClick: (r) => setSelected(r), columns: [{
      key: "lot",
      header: "Lot",
      render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-7 place-items-center rounded bg-[var(--a-surface-2)] text-[var(--a-accent)]", children: /* @__PURE__ */ jsx(Hammer, { className: "size-3" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-[var(--a-fg)]", children: r.lotTitle })
      ] })
    }, {
      key: "amount",
      header: "Bid",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "a-mono text-xs font-bold text-[var(--a-fg)]", children: fmtMoney(r.bidAmount) })
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsx(StatusChip, { value: "Leading" })
    }, {
      key: "at",
      header: "When",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--a-muted)]", children: fmtDateTime(r.placedAt) })
    }] }),
    /* @__PURE__ */ jsx(RecordSheet, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), eyebrow: `${selected?.fullName ?? ""}`, title: selected?.lotTitle ?? "", subtitle: selected ? `Current Bid Amount ${fmtMoney(selected.bidAmount)} · Last Bid Amount ${fmtMoney(selected.lastBid ?? 0)}` : void 0, record: selected, fields, onSave: async (p) => {
      if (!selected) return;
      startAction("Updating bid...");
      try {
        await updateDocument({
          collections: "bids",
          document: {
            ...selected,
            id: selected.id,
            ...p
          }
        });
        toast({
          title: "Success",
          description: "Bid Modified",
          variant: "info",
          duration: 5e4,
          position: "top"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || error.code,
          variant: "error",
          duration: 5e4,
          position: "top"
        });
      } finally {
        stopAction();
      }
    }, operations: selected ? [
      {
        id: "delete",
        label: "Delete Bid",
        tone: "danger",
        icon: Pause,
        onRun: async () => {
          if (!selected) {
            toast({
              title: "Error",
              description: "Error In Selections",
              variant: "warning",
              position: "bottom"
            });
            return;
          }
          startAction("Deleting bid and returning funds...");
          try {
            const bidder = await getDoc(doc(db, "users", selected.userID));
            if (bidder.exists()) {
              const data2 = bidder.data();
              await updateDocument({
                collections: "users",
                document: {
                  id: selected.userID,
                  wallet: {
                    balance: data2.wallet.balance + selected.bidAmount,
                    bidBalance: Math.max(0, data2.wallet.bidBalance - selected.bidAmount)
                  }
                }
              });
            }
            await deleteDocument({
              collectionName: "bids",
              id: selected.id,
              message: "Bid Successfully Deleted, And Funds Has Been Returned To User Who Bidded"
            });
          } catch (error) {
            toast({
              title: "Error",
              description: error.message || error.code,
              variant: "error",
              position: "bottom"
            });
          } finally {
            setSelected(null);
            stopAction();
          }
        }
      },
      {
        id: "close",
        label: "Close & award winner",
        icon: Hammer,
        tone: "primary",
        onRun: async () => {
          const Lot = await getAuctionBySlug(selected.slug);
          if (!selected || !Lot) {
            toast({
              title: "Error",
              description: "Error In Selections",
              variant: "warning",
              position: "bottom"
            });
            return;
          }
          startAction("Closing bid & transferring ownership...");
          try {
            const biddingUser = await getDoc(doc(db, "users", selected.userID));
            const originalUser = await getDoc(doc(db, "users", Lot.userID));
            if (biddingUser.exists() && originalUser.exists()) {
              const data2 = biddingUser.data();
              const data22 = originalUser.data();
              await updateDocument({
                collections: "users",
                document: {
                  id: selected.userID,
                  wallet: {
                    balance: data2.wallet.balance,
                    bidBalance: Math.max(0, data2.wallet.bidBalance - selected.bidAmount)
                  }
                }
              });
              const topBal = data22.wallet.balance + selected.bidAmount;
              console.log({
                topBal,
                bidBalance2: data22.wallet.bidBalance
              });
              await updateDocument({
                collections: "users",
                document: {
                  id: Lot.userID,
                  wallet: {
                    balance: topBal,
                    bidBalance: data22.wallet.bidBalance
                  }
                }
              });
              await addDocToCollection({
                collections: "listings",
                document: {
                  title: Lot?.title,
                  userName: data2.userName,
                  userID: selected.userID,
                  bidAmount: selected.bidAmount,
                  year: Lot?.year,
                  category: Lot?.category,
                  description: Lot?.description,
                  images: Lot?.images,
                  createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                  dimensions: Lot?.dimensions,
                  status: Lot?.status,
                  medium: Lot?.medium,
                  slug: crypto.randomUUID(),
                  provenance: Lot?.provenance,
                  condition: Lot?.condition,
                  totalBidCounts: Lot?.bidCount,
                  placedAt: selected.placedAt,
                  timeStamp: serverTimestamp()
                }
              });
              await updateDocument({
                collections: "auctions",
                document: {
                  id: selected.id,
                  endsAt: inHours(12),
                  status: "closed"
                }
              });
              await deleteDocument({
                collectionName: "bids",
                id: selected.id,
                message: "Bid Has Ended, Thus Added To The User Listing List And Deleted From Auctions In 12 hours From Now"
              });
              try {
                await sendUserNotification("auction_won", {
                  to_email: data2.email,
                  to_name: data2.fullName,
                  lotTitle: Lot.title,
                  slug: Lot.slug,
                  finalPrice: selected.bidAmount,
                  auctionID: Lot.id,
                  winnerName: data2.fullName
                });
                await sendUserNotification("auction_sold_to_seller", {
                  to_email: data22.email,
                  to_name: data22.fullName,
                  lotTitle: Lot.title,
                  slug: Lot.slug,
                  finalPrice: selected.bidAmount,
                  auctionID: Lot.id,
                  winnerName: data2.fullName,
                  sellerName: data22.fullName
                });
                await sendAdminNotification("auction_won", {
                  lotTitle: Lot.title,
                  slug: Lot.slug,
                  finalPrice: selected.bidAmount,
                  auctionID: Lot.id,
                  winnerName: data2.fullName,
                  sellerName: data22.fullName
                });
              } catch (e) {
                console.warn("[email] auction win/sale notification failed", e);
              }
            }
          } catch (error) {
            toast({
              title: "Error",
              description: error.message || error.code,
              variant: "error",
              position: "bottom"
            });
            console.log(error.message);
          } finally {
            setSelected(null);
            stopAction();
          }
        }
      }
      // {
      //   id: "withdraw",
      //   label: "Withdraw lot",
      //   icon: Archive,
      //   tone: "danger",
      //   confirm: "Withdraw this lot from auction?",
      //   onRun: () => {
      //     setRows(rows.filter((l) => l.slug !== selected.slug));
      //     setSelected(null);
      //   },
      // },
      // {
      //   id: "flag",
      //   label: "Flag for review",
      //   icon: Flag,
      //   onRun: () => alert("Flagged (mock)."),
      // },
    ] : void 0 })
  ] });
}
function Kpi({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxs("div", { className: `a-card-elev p-3.5 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "a-eyebrow", children: label }),
      /* @__PURE__ */ jsx(Icon, { className: `size-4 ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-muted)]"}` })
    ] }),
    /* @__PURE__ */ jsx("p", { className: `font-display mt-1.5 text-xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`, children: value })
  ] });
}
export {
  ExhibitionAdmin as component
};
