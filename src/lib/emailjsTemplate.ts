import { SITE_INFO } from "./siteInfo";

// Static import of the installed package (used for runtime sending + EmailJS code editor)
import emailjs from "@emailjs/browser";

/**
 * EmailJS Template Generator for sharjahbiennial
 *
 * This file provides a centralized way to generate beautifully designed
 * email templates for all user and admin notifications across the platform.
 *
 * Usage with EmailJS:
 *   const { subject, html } = generateEmailTemplate("bid_placed", data);
 *   emailjs.send(serviceId, templateId, { subject, message: html, to_email, ... });
 */

export type EmailActivityType =
  | "user_registered"
  | "welcome_user"
  | "listing_submitted"
  | "listing_approved"
  | "listing_rejected"
  | "bid_placed"
  | "outbid_notification"
  | "auction_won"
  | "auction_sold_to_seller"
  | "auction_closed"
  | "account_activated"
  | "account_suspended"
  | "account_pending"
  | "wallet_deposit"
  | "wallet_withdrawal"
  | "purchase_completed"
  | "contact_form_submission"
  | "admin_new_listing"
  | "admin_new_bid";

export interface EmailTemplateResult {
  subject: string;
  html: string;
}

interface BaseTemplateData {
  userName?: string;
  userEmail?: string;
  fullName?: string;
  email?: string;
}

interface ListingData extends BaseTemplateData {
  title: string;
  slug: string;
  bidAmount?: number;
  category?: string;
  medium?: string;
  year?: string | number;
}

interface BidData extends BaseTemplateData {
  lotTitle: string;
  slug: string;
  bidAmount: number;
  previousBid?: number;
  auctionID: string;
  placedAt?: string;
}

interface AuctionData extends BaseTemplateData {
  lotTitle: string;
  slug: string;
  finalPrice: number;
  winnerName?: string;
  sellerName?: string;
  auctionID: string;
}

interface WalletData extends BaseTemplateData {
  amount: number;
  currency?: string;
  transactionId?: string;
  balance?: number;
}

interface AccountData extends BaseTemplateData {
  status: "active" | "pending" | "suspended";
  reason?: string;
}

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Brand colors matching the project design
const BRAND = {
  canvas: "#F9F5F0",
  surface: "#F0E9E0",
  ink: "#4D4035",
  clay: "#8C5C3D",
  accent: "#C9A37B",
  detail: "#8D7A66",
  white: "#FFFFFF",
  darkBg: "#2C2520",
};

function getBaseStyles(): string {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background-color: ${BRAND.canvas};
        font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: ${BRAND.ink};
        line-height: 1.6;
      }
      
      .email-container {
        max-width: 620px;
        margin: 40px auto;
        background: ${BRAND.white};
        border-radius: 0;
        overflow: hidden;
        border: 1px solid ${BRAND.surface};
      }
      
      .email-header {
        background: ${BRAND.ink};
        color: ${BRAND.white};
        padding: 32px 40px;
        text-align: center;
      }
      
      .email-header h1 {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 28px;
        font-weight: 400;
        margin: 0;
        letter-spacing: -0.02em;
      }
      
      .email-header p {
        margin: 8px 0 0;
        font-size: 13px;
        opacity: 0.75;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      
      .email-body {
        padding: 48px 40px;
      }
      
      .email-title {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 26px;
        font-weight: 400;
        color: ${BRAND.ink};
        margin: 0 0 12px;
        line-height: 1.2;
      }
      
      .email-subtitle {
        font-size: 15px;
        color: ${BRAND.detail};
        margin: 0 0 32px;
      }
      
      .detail-card {
        background: ${BRAND.canvas};
        border: 1px solid ${BRAND.surface};
        padding: 24px;
        margin: 24px 0;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid ${BRAND.surface};
        font-size: 14px;
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        color: ${BRAND.detail};
        font-weight: 500;
      }
      
      .detail-value {
        color: ${BRAND.ink};
        font-weight: 600;
        text-align: right;
      }
      
      .price {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 28px;
        color: ${BRAND.clay};
        font-weight: 400;
        letter-spacing: -0.01em;
      }
      
      .button {
        display: inline-block;
        background: ${BRAND.ink};
        color: ${BRAND.white} !important;
        padding: 14px 32px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.5px;
        margin-top: 16px;
        transition: all 0.2s ease;
      }
      
      .button:hover {
        background: ${BRAND.clay};
      }
      
      .button-secondary {
        background: transparent;
        color: ${BRAND.ink} !important;
        border: 1px solid ${BRAND.ink};
      }
      
      .status-badge {
        display: inline-block;
        padding: 4px 14px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        background: ${BRAND.clay};
        color: ${BRAND.white};
      }
      
      .status-active { background: #4A7043; }
      .status-pending { background: #B38B4D; }
      .status-suspended { background: #8B4B4B; }
      
      .divider {
        height: 1px;
        background: ${BRAND.surface};
        margin: 32px 0;
      }
      
      .footer {
        background: ${BRAND.canvas};
        padding: 28px 40px;
        font-size: 13px;
        color: ${BRAND.detail};
        text-align: center;
        border-top: 1px solid ${BRAND.surface};
      }
      
      .footer a {
        color: ${BRAND.clay};
        text-decoration: none;
      }
      
      .art-accent {
        display: inline-block;
        width: 24px;
        height: 1px;
        background: ${BRAND.accent};
        margin: 0 12px;
        vertical-align: middle;
      }
    </style>
  `;
}

function createEmailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>sharjahbiennial</h1>
            <p>Est. ${SITE_INFO.date}</p>
          </div>
          ${content}
          <div class="footer">
            <p>
              ${SITE_INFO.name}<br>
              <a href="mailto:${SITE_INFO.contact.email}">${SITE_INFO.contact.email}</a>
              ${SITE_INFO.contact.phone ? ` • ${SITE_INFO.contact.phone}` : ""}
            </p>
            <p style="margin-top: 12px; font-size: 11px; opacity: 0.6;">
              This email was sent from sharjahbiennial. 
              Please do not reply directly to this message.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(dateString?: string): string {
  if (!dateString)
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ============================================
   TEMPLATE GENERATORS
   ============================================ */

function userRegistered(data: BaseTemplateData): EmailTemplateResult {
  const name = data.fullName || data.userName || "there";

  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Welcome to sharjahbiennial</h2>
      <p class="email-subtitle">Your account has been successfully created.</p>
      
      <p style="font-size: 15px; margin-bottom: 24px;">
        Hello ${name},<br><br>
        We're delighted to have you join our community of artists, collectors, and art enthusiasts.
        Your account is currently under review and will be activated shortly.
      </p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Account Status</span>
          <span class="status-badge status-pending">PENDING</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
      </div>
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You will receive another email once your account has been approved. 
        In the meantime, feel free to explore the gallery.
      </p>
    </div>
  `);

  return {
    subject: "Welcome to sharjahbiennial",
    html,
  };
}

function welcomeUser(data: BaseTemplateData): EmailTemplateResult {
  const name = data.fullName || data.userName || "there";

  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Your Account is Now Active</h2>
      <p class="email-subtitle">Welcome to the Sharjahbiennial community.</p>
      
      <p style="font-size: 15px;">
        Hello ${name},<br><br>
        Great news — your account has been approved and is now fully active.
      </p>
      
      <div style="margin: 32px 0;">
        <a href="${typeof window !== "undefined" ? window.location.origin : ""}/gallery" class="button">
          Explore the Gallery
        </a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You can now list artwork, place bids, and participate in auctions.
      </p>
    </div>
  `);

  return {
    subject: "Your Sharjahbiennial Account is Active",
    html,
  };
}

function listingSubmitted(data: ListingData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Artwork Submitted</h2>
      <p class="email-subtitle">A new listing is awaiting your review.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Artist</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Category</span>
          <span class="detail-value">${data.category || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Medium</span>
          <span class="detail-value">${data.medium || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Starting Price</span>
          <span class="detail-value">${data.bidAmount ? formatCurrency(data.bidAmount) : "—"}</span>
        </div>
      </div>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/admin" class="button">
        Review in Admin Panel
      </a>
    </div>
  `);

  return {
    subject: `New Listing: ${data.title}`,
    html,
  };
}

function listingApproved(data: ListingData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Your Artwork Has Been Approved</h2>
      <p class="email-subtitle">It is now live on sharjahbiennial.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="status-badge status-active">LIVE</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        Congratulations. Your piece is now visible to collectors and art lovers.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/artworks/${data.slug}" class="button">
        View Your Listing
      </a>
    </div>
  `);

  return {
    subject: `Approved: ${data.title}`,
    html,
  };
}

function listingRejected(
  data: ListingData & { reason?: string }
): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Listing Review Update</h2>
      <p class="email-subtitle">Your submission requires attention.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="status-badge status-suspended">NOT APPROVED</span>
        </div>
      </div>
      
      ${
        data.reason
          ? `
        <p style="font-size: 15px; margin: 24px 0;">
          <strong>Feedback from our curators:</strong><br>
          ${data.reason}
        </p>
      `
          : ""
      }
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You may edit and resubmit your artwork from your dashboard.
      </p>
    </div>
  `);

  return {
    subject: `Update on: ${data.title}`,
    html,
  };
}

function bidPlaced(data: BidData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Bid Confirmation</h2>
      <p class="email-subtitle">Your bid has been successfully placed.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Your Bid</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Placed On</span>
          <span class="detail-value">${formatDate(data.placedAt)}</span>
        </div>
      </div>
      
      <p style="font-size: 14px; color: ${BRAND.detail};">
        You will be notified if you are outbid or if you win the auction.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/auctions/${data.slug}" class="button">
        View Auction
      </a>
    </div>
  `);

  return {
    subject: `Bid Placed: ${data.lotTitle}`,
    html,
  };
}

function outbidNotification(data: BidData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">You've Been Outbid</h2>
      <p class="email-subtitle">Another collector has placed a higher bid.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Your Previous Bid</span>
          <span class="detail-value">${formatCurrency(data.previousBid || 0)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Current Highest Bid</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
      </div>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/auctions/${data.slug}" class="button">
        Place a New Bid
      </a>
    </div>
  `);

  return {
    subject: `Outbid on: ${data.lotTitle}`,
    html,
  };
}

function auctionWon(data: AuctionData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Congratulations — You Won</h2>
      <p class="email-subtitle">The auction has closed in your favor.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Final Price</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        We will contact you shortly with payment and shipping instructions.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/auctions/${data.slug}" class="button">
        View Auction Details
      </a>
    </div>
  `);

  return {
    subject: `You Won: ${data.lotTitle}`,
    html,
  };
}

function auctionSoldToSeller(data: AuctionData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Your Artwork Has Sold</h2>
      <p class="email-subtitle">Congratulations on the successful sale.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Sold For</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Buyer</span>
          <span class="detail-value">${data.winnerName || "Collector"}</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        Our team will reach out shortly regarding next steps and payout.
      </p>
    </div>
  `);

  return {
    subject: `Sold: ${data.lotTitle}`,
    html,
  };
}

function accountStatusChanged(data: AccountData): EmailTemplateResult {
  const statusText = data.status.toUpperCase();
  const statusClass = `status-${data.status}`;

  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Account Status Update</h2>
      <p class="email-subtitle">Your account status has changed.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Current Status</span>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        ${
          data.reason
            ? `
          <div class="detail-row" style="margin-top: 12px; padding-top: 16px; border-top: 1px solid ${BRAND.surface};">
            <span class="detail-label">Reason</span>
            <span class="detail-value" style="max-width: 280px; text-align: left;">${data.reason}</span>
          </div>
        `
            : ""
        }
      </div>
      
      ${
        data.status === "active"
          ? `
        <a href="${typeof window !== "undefined" ? window.location.origin : ""}/gallery" class="button">
          Continue to Gallery
        </a>
      `
          : ""
      }
    </div>
  `);

  return {
    subject: `Account Status: ${statusText}`,
    html,
  };
}

function walletTransaction(
  data: WalletData & { type: "deposit" | "withdrawal" }
): EmailTemplateResult {
  const isDeposit = data.type === "deposit";
  const title = isDeposit ? "Deposit Confirmed" : "Withdrawal Processed";
  const subtitle = isDeposit
    ? "Funds have been added to your wallet."
    : "Your withdrawal request has been completed.";

  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">${title}</h2>
      <p class="email-subtitle">${subtitle}</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value price">${formatCurrency(data.amount, data.currency)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Transaction ID</span>
          <span class="detail-value" style="font-family: monospace; font-size: 13px;">${data.transactionId || "—"}</span>
        </div>
        ${
          data.balance !== undefined
            ? `
          <div class="detail-row">
            <span class="detail-label">New Balance</span>
            <span class="detail-value">${formatCurrency(data.balance, data.currency)}</span>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `);

  return {
    subject: `${isDeposit ? "Deposit" : "Withdrawal"}: ${formatCurrency(data.amount, data.currency)}`,
    html,
  };
}

function purchaseCompleted(data: AuctionData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Purchase Confirmed</h2>
      <p class="email-subtitle">Thank you for your purchase.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
      </div>
      
      <p style="font-size: 15px;">
        We will contact you shortly with shipping and collection details.
      </p>
    </div>
  `);

  return {
    subject: `Purchase Confirmed: ${data.lotTitle}`,
    html,
  };
}

function contactFormSubmission(data: ContactData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Contact Message</h2>
      <p class="email-subtitle">Received from the website contact form.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">From</span>
          <span class="detail-value">${data.name} &lt;${data.email}&gt;</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Subject</span>
          <span class="detail-value">${data.subject}</span>
        </div>
      </div>
      
      <div style="background: ${BRAND.canvas}; padding: 24px; margin: 24px 0; border-left: 3px solid ${BRAND.clay};">
        <p style="white-space: pre-line; margin: 0; font-size: 15px;">
          ${data.message}
        </p>
      </div>
    </div>
  `);

  return {
    subject: `Contact Form: ${data.subject}`,
    html,
  };
}

function adminNewListing(data: ListingData): EmailTemplateResult {
  return listingSubmitted(data);
}

function adminNewBid(data: BidData): EmailTemplateResult {
  const html = createEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Bid Received</h2>
      <p class="email-subtitle">A collector has placed a bid on an auction.</p>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bid Amount</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bidder</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
      </div>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/admin" class="button">
        View in Admin Dashboard
      </a>
    </div>
  `);

  return {
    subject: `New Bid: ${data.lotTitle}`,
    html,
  };
}

/* ============================================
   MAIN EXPORTED FUNCTION
   ============================================ */

export function generateEmailTemplate(
  activity: EmailActivityType,
  data: any
): EmailTemplateResult {
  switch (activity) {
    case "user_registered":
      return userRegistered(data);

    case "welcome_user":
    case "account_activated":
      return welcomeUser(data);

    case "listing_submitted":
    case "admin_new_listing":
      return listingSubmitted(data);

    case "listing_approved":
      return listingApproved(data);

    case "listing_rejected":
      return listingRejected(data);

    case "bid_placed":
      return bidPlaced(data);

    case "outbid_notification":
      return outbidNotification(data);

    case "auction_won":
      return auctionWon(data);

    case "auction_sold_to_seller":
      return auctionSoldToSeller(data);

    case "auction_closed":
      return auctionWon(data); // reuse won template or customize as needed

    case "account_suspended":
    case "account_pending":
      return accountStatusChanged(data);

    case "wallet_deposit":
      return walletTransaction({ ...data, type: "deposit" });

    case "wallet_withdrawal":
      return walletTransaction({ ...data, type: "withdrawal" });

    case "purchase_completed":
      return purchaseCompleted(data);

    case "contact_form_submission":
      return contactFormSubmission(data);

    case "admin_new_bid":
      return adminNewBid(data);

    default:
      return {
        subject: "Sharjahbiennial Notification",
        html: createEmailWrapper(`
          <div class="email-body">
            <h2 class="email-title">Notification</h2>
            <p>${JSON.stringify(data, null, 2)}</p>
          </div>
        `),
      };
  }
}

/* ============================================
   HELPER: Get all supported activities
   ============================================ */

export function getSupportedEmailActivities(): EmailActivityType[] {
  return [
    "user_registered",
    "welcome_user",
    "listing_submitted",
    "listing_approved",
    "listing_rejected",
    "bid_placed",
    "outbid_notification",
    "auction_won",
    "auction_sold_to_seller",
    "account_activated",
    "account_suspended",
    "account_pending",
    "wallet_deposit",
    "wallet_withdrawal",
    "purchase_completed",
    "contact_form_submission",
    "admin_new_listing",
    "admin_new_bid",
  ];
}

export default generateEmailTemplate;

/* ============================================
   OPTIONAL: EmailJS Sender Helper
   
   Install first:
   npm install @emailjs/browser
   
   Usage:
   import { sendGalleryEmail } from "@/lib/emailjsTemplate";
   
   await sendGalleryEmail("bid_placed", {
     to_email: "user@example.com",
     to_name: "John Doe",
     ...bidData
   });
   ============================================ */

interface SendEmailOptions {
  to_email: string;
  to_name?: string;
  reply_to?: string;
  [key: string]: any;
}

/**
 * Sends an email using EmailJS with a beautifully designed template.
 * Make sure to configure your EmailJS service in the .env or config.
 */
export async function sendGalleryEmail(
  activity: EmailActivityType,
  options: SendEmailOptions,
  config?: {
    serviceId?: string;
    templateId?: string;
    publicKey?: string;
  }
): Promise<{ success: boolean; error?: any }> {
  try {
    const { serviceId, templateId, publicKey } = {
      serviceId: config?.serviceId || import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId:
        config?.templateId || import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: config?.publicKey || import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    };

    if (!serviceId || !templateId || !publicKey) {
      console.warn(
        "[emailjsTemplate] Missing EmailJS configuration. Set VITE_EMAILJS_* env vars."
      );
      return { success: false, error: "Missing EmailJS config" };
    }

    const { subject, html } = generateEmailTemplate(activity, options);

    const templateParams = {
      subject,
      message: html, // Use as HTML content in your EmailJS template
      to_name: options.to_name || options.fullName || options.userName || "",
      reply_to: options.reply_to || SITE_INFO.contact.email,
      // Pass through any additional fields the user wants available in the template
      ...options,
      to_email: options.to_email,
    };

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    return { success: true };
  } catch (error) {
    console.error("[emailjsTemplate] Failed to send email:", error);
    return { success: false, error };
  }
}

/**
 * Convenience wrapper specifically for notifying both user + admin.
 * Example: notifyBoth("bid_placed", userData, adminData)
 */
export async function notifyBoth(
  activity: EmailActivityType,
  userOptions: SendEmailOptions,
  adminOptions?: SendEmailOptions
): Promise<{ user: { success: boolean }; admin?: { success: boolean } }> {
  const userResult = await sendGalleryEmail(activity, userOptions);

  let adminResult;
  if (adminOptions) {
    adminResult = await sendGalleryEmail(activity, {
      ...adminOptions,
      to_email: adminOptions.to_email || SITE_INFO.contact.email,
    });
  }

  return {
    user: userResult,
    admin: adminResult,
  };
}
