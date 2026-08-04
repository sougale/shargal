import { useEffect, useRef } from "react";
import { useDataStore } from "@/store/zustand";
import useDoc from "@/hooks/useDoc";
import { db } from "@/services/firebase";
import { doc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { AuctionLot } from "@/data/auctions";
import { Bid, Listing, Notification, WalletAccount } from "@/types";
import { formatBid } from "@/data/auctions";
import { sendGalleryEmail } from "@/lib/emailjsTemplate";
import { SITE_INFO } from "@/lib/siteInfo";

/**
 * useAuctionAutoCloser
 *
 * Background hook that periodically checks for expired auctions (endsAt < now)
 * and automatically:
 *   - Sets auction status to "closed"
 *   - Awards the lot to the last (highest) bidder as a new Listing
 *   - Transfers funds: deducts from winner's bidBalance, credits seller's balance
 *   - Deletes the winning bid document
 *   - Sends an "auction_won" notification to the winner
 *
 * Runs on any client that mounts this hook (safe because of fresh reads + guards).
 */
export function useAuctionAutoCloser() {
  // Grab the doc helpers once. useDoc returns stable methods (no internal state),
  // but we still stabilize via ref to prevent effect restart on parent re-renders.
  const docRef = useRef<ReturnType<typeof useDoc> | null>(null);
  if (!docRef.current) {
    docRef.current = useDoc();
  }
  const { updateDocument, setDocument, deleteDocument, addDocToCollection } = docRef.current;

  // Track lots we're currently processing to prevent duplicate work across rapid snapshots
  const processingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const closeExpiredAuctions = async () => {
      if (cancelled) return;

      const { auctions } = useDataStore.getState();
      const now = Date.now();

      for (const lot of auctions) {
        // Skip if already closed or not yet expired
        if (lot.status === "closed") continue;

        if (!lot.endsAt) continue;

        const endsAtMs = new Date(lot.endsAt).getTime();
        if (Number.isNaN(endsAtMs) || endsAtMs > now) continue;

        // Already being processed in this tab / hook instance
        if (processingRef.current.has(lot.id)) continue;

        processingRef.current.add(lot.id);

        try {
          // 1. Fresh read of the auction to avoid race conditions across clients
          const auctionSnap = await getDoc(doc(db, "auctions", lot.id));
          if (!auctionSnap.exists()) continue;

          const freshLot = { id: auctionSnap.id, ...auctionSnap.data() } as AuctionLot;

          if (freshLot.status === "closed") continue;
          if (new Date(freshLot.endsAt).getTime() > Date.now()) continue;

          // 2. Find the winning bid (bid documents are keyed by auction id)
          const bidSnap = await getDoc(doc(db, "bids", freshLot.id));
          const winningBid = bidSnap.exists()
            ? ({ id: bidSnap.id, ...bidSnap.data() } as Bid)
            : null;

          if (winningBid && winningBid.userID) {
            // 3. Load winner and seller user docs
            const [winnerSnap, sellerSnap] = await Promise.all([
              getDoc(doc(db, "users", winningBid.userID)),
              getDoc(doc(db, "users", freshLot.userID)),
            ]);

            if (winnerSnap.exists() && sellerSnap.exists()) {
              const winner = winnerSnap.data() as WalletAccount;
              const seller = sellerSnap.data() as WalletAccount;

              // 4. Fund transfer
              // Winner: release the hold from bidBalance (they "spent" it)
              const newWinnerBidBalance = Math.max(
                0,
                (winner.wallet?.bidBalance ?? 0) - winningBid.bidAmount,
              );

              await updateDocument({
                collections: "users",
                document: {
                  id: winner.userID,
                  wallet: {
                    balance: winner.wallet?.balance ?? 0,
                    bidBalance: newWinnerBidBalance,
                  },
                },
              });

              // Seller: receive the final bid amount into available balance
              const newSellerBalance = (seller.wallet?.balance ?? 0) + winningBid.bidAmount;

              await updateDocument({
                collections: "users",
                document: {
                  id: seller.userID,
                  wallet: {
                    balance: newSellerBalance,
                    bidBalance: seller.wallet?.bidBalance ?? 0,
                  },
                },
              });

              // 5. Create listing for the winner (matches admin.exhibition.tsx "Close & award winner" shape)
              const listingPayload: Omit<Listing, "id"> = {
                title: freshLot.title,
                userName: winner.userName,
                userID: winner.userID,
                bidAmount: winningBid.bidAmount,
                year: freshLot.year,
                category: freshLot.category,
                description: freshLot.description,
                images: freshLot.images ?? [],
                createdAt: new Date().toISOString(),
                dimensions: freshLot.dimensions,
                status: freshLot.status, // or "closed" - matching the admin close flow
                medium: freshLot.medium,
                slug: crypto.randomUUID(),
                provenance: freshLot.provenance,
                condition: freshLot.condition,
                totalBidCounts: freshLot.bidCount ?? 0,
                placedAt: winningBid.placedAt,
                timeStamp: serverTimestamp() as unknown as Timestamp,
              };

              await addDocToCollection({
                collections: "listings",
                document: listingPayload,
              });

              // 6. Notify the winner
              const winNotification: Omit<Notification, "id"> = {
                userID: winner.userID,
                type: "auction_won",
                title: "Auction won!",
                message: `Congratulations! You won "${freshLot.title}" for ${formatBid(winningBid.bidAmount)}. The piece has been added to your listings.`,
                data: {
                  lotSlug: freshLot.slug,
                  lotTitle: freshLot.title,
                  auctionID: freshLot.id,
                  newBidAmount: winningBid.bidAmount,
                },
                unread: true,
                createdAt: new Date().toISOString(),
              };

              await setDocument({
                collections: "notifications",
                document: {
                  ...winNotification,
                  id: `won-${freshLot.id}-${Date.now()}`,
                },
              });

              // Also notify the seller that their piece sold
              const sellerNotification: Omit<Notification, "id"> = {
                userID: seller.userID,
                type: "general",
                title: "Your auction has closed",
                message: `Your lot "${freshLot.title}" sold for ${formatBid(winningBid.bidAmount)} to ${winner.userName || winner.email}. Funds have been added to your balance and the piece has been transferred.`,
                data: {
                  lotSlug: freshLot.slug,
                  lotTitle: freshLot.title,
                  auctionID: freshLot.id,
                  newBidAmount: winningBid.bidAmount,
                },
                unread: true,
                createdAt: new Date().toISOString(),
              };

              await setDocument({
                collections: "notifications",
                document: {
                  ...sellerNotification,
                  id: `sold-${freshLot.id}-${Date.now()}`,
                },
              }).catch(() => {});

              // Email notifications for auto-closed auction
              try {
                await sendGalleryEmail("auction_won", {
                  to_email: winner.email,
                  to_name: winner.fullName,
                  lotTitle: freshLot.title,
                  slug: freshLot.slug,
                  finalPrice: winningBid.bidAmount,
                  auctionID: freshLot.id,
                  winnerName: winner.fullName,
                });

                await sendGalleryEmail("auction_sold_to_seller", {
                  to_email: seller.email,
                  to_name: seller.fullName,
                  lotTitle: freshLot.title,
                  slug: freshLot.slug,
                  finalPrice: winningBid.bidAmount,
                  auctionID: freshLot.id,
                  winnerName: winner.fullName,
                  sellerName: seller.fullName,
                });

                // Also notify admin
                await sendGalleryEmail("auction_won", {
                  to_email: SITE_INFO.contact.email,
                  to_name: "Admin",
                  lotTitle: freshLot.title,
                  slug: freshLot.slug,
                  finalPrice: winningBid.bidAmount,
                  auctionID: freshLot.id,
                  winnerName: winner.fullName,
                });
              } catch (e) {
                console.warn("[email] auto-close auction notification failed", e);
              }
            }

            // 7. Delete the bid record (as requested)
            await deleteDocument({
              collectionName: "bids",
              id: winningBid.id,
              // No message => no toast for automatic close
            });
          }

          // 8. Mark the auction as closed (even if there were no bids)
          await updateDocument({
            collections: "auctions",
            document: {
              id: freshLot.id,
              status: "closed",
            },
          });
        } catch (err) {
          // Silent fail in background; log for debugging
          console.error("[useAuctionAutoCloser] Failed to auto-close auction", lot.id, err);
        } finally {
          // Keep the lot out of processing for a bit so snapshots can settle
          setTimeout(() => {
            processingRef.current.delete(lot.id);
          }, 20_000);
        }
      }
    };

    // Run once soon after mount, then every 20s
    const initialTimeout = setTimeout(closeExpiredAuctions, 2500);
    const interval = setInterval(closeExpiredAuctions, 20_000);

    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []); // We intentionally use [] + internal ref for doc helpers.
  // The timer reads live data via useDataStore.getState() + fresh Firestore gets.
}
