import { SITE_INFO } from "./siteInfo";

// Static import of the installed package (used for runtime sending + EmailJS code editor)
import emailjs from "@emailjs/browser";

// Admin notification email (always used for admin templates)
export const ADMIN_EMAIL = "support@sharjahbiennial.online";

// Type to distinguish user vs admin email generation
export type EmailRecipientType = "user" | "admin";

/**
 * EmailJS Template Generator for sharjahbiennial
 *
 * IMPORTANT RULES:
 * - USER templates: sent to the user's email address, friendly customer-facing language
 * - ADMIN templates: sent ONLY to support@sharjahbiennial.online, different design + wording describing what the USER just did
 *
 * Usage:
 *   // User notification
 *   await sendUserNotification("bid_placed", { to_email: userEmail, ...data });
 *
 *   // Admin notification (always goes to support@sharjahbiennial.online)
 *   await sendAdminNotification("bid_placed", { ...data });
 *
 *   // Both
 *   await notifyBoth("bid_placed", userData, adminData);
 *
 *   // Or via generateEmailTemplate directly:
 *   const { subject, html } = generateEmailTemplate("bid_placed", data, "user");   // user template
 *   const { subject, html } = generateEmailTemplate("bid_placed", data, "admin");  // admin template
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

// Separate styles for ADMIN emails (different design)
function getAdminBaseStyles(): string {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background-color: #F5F3EF;
        font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #3D2F26;
        line-height: 1.6;
      }
      
      .email-container {
        max-width: 620px;
        margin: 40px auto;
        background: #FFFFFF;
        border-radius: 0;
        overflow: hidden;
        border: 2px solid #8C5C3D;
      }
      
      .email-header {
        background: #2C2520;
        color: #FFFFFF;
        padding: 20px 40px;
        text-align: center;
      }
      
      .email-header h1 {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 22px;
        font-weight: 400;
        margin: 0;
        letter-spacing: -0.02em;
      }
      
      .admin-badge {
        display: inline-block;
        background: #8C5C3D;
        color: #FFFFFF;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2px;
        padding: 4px 14px;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      
      .email-header p {
        margin: 4px 0 0;
        font-size: 12px;
        opacity: 0.7;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      
      .email-body {
        padding: 36px 40px;
      }
      
      .email-title {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 22px;
        font-weight: 400;
        color: #2C2520;
        margin: 0 0 8px;
        line-height: 1.2;
      }
      
      .email-subtitle {
        font-size: 14px;
        color: #6B5C4F;
        margin: 0 0 24px;
        font-weight: 500;
      }
      
      .detail-card {
        background: #F9F5F0;
        border: 1px solid #E8DFD4;
        padding: 20px;
        margin: 20px 0;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 9px 0;
        border-bottom: 1px solid #E8DFD4;
        font-size: 14px;
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        color: #6B5C4F;
        font-weight: 500;
      }
      
      .detail-value {
        color: #2C2520;
        font-weight: 600;
        text-align: right;
      }
      
      .price {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 24px;
        color: #8C5C3D;
        font-weight: 400;
        letter-spacing: -0.01em;
      }
      
      .button {
        display: inline-block;
        background: #2C2520;
        color: #FFFFFF !important;
        padding: 12px 28px;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.5px;
        margin-top: 12px;
      }
      
      .alert-banner {
        background: #2C2520;
        color: #FFFFFF;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .alert-banner::before {
        content: "ADMIN ALERT";
        background: #8C5C3D;
        padding: 2px 8px;
        font-size: 10px;
        letter-spacing: 1px;
      }
      
      .divider {
        height: 1px;
        background: #E8DFD4;
        margin: 24px 0;
      }
      
      .footer {
        background: #F5F3EF;
        padding: 20px 40px;
        font-size: 12px;
        color: #6B5C4F;
        text-align: center;
        border-top: 1px solid #E8DFD4;
      }
      
      .footer a {
        color: #8C5C3D;
        text-decoration: none;
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

// Admin-specific email wrapper with distinct design
function createAdminEmailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getAdminBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="admin-badge">ADMIN NOTIFICATION</div>
            <h1>sharjahbiennial</h1>
            <p>Internal Alert • ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
          ${content}
          <div class="footer">
            <p>
              This is an automated admin alert for <strong>support@sharjahbiennial.online</strong><br>
              <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>
            </p>
            <p style="margin-top: 10px; font-size: 11px; opacity: 0.6;">
              User-facing content should not be included in this message.
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

/* ============================================
   ADMIN-SPECIFIC TEMPLATE GENERATORS
   (Different design + text, always sent to support@sharjahbiennial.online)
   ============================================ */

function adminUserRegistered(data: BaseTemplateData): EmailTemplateResult {
  const name = data.fullName || data.userName || "Unknown User";

  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New User Registration</h2>
      <p class="email-subtitle">A user has just created an account on the platform.</p>
      
      <div class="alert-banner">
        User action detected
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Full Name</span>
          <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email Address</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Registered At</span>
          <span class="detail-value">${formatDate()}</span>
        </div>
      </div>
      
      <p style="font-size: 13px; color: #6B5C4F; margin: 16px 0 0;">
        This account is currently pending review. Check the admin dashboard to approve or reject.
      </p>
      
      <a href="${typeof window !== "undefined" ? window.location.origin : ""}/admin" class="button">
        Review New User
      </a>
    </div>
  `);

  return {
    subject: `[ADMIN] New User Registered: ${name}`,
    html,
  };
}

function adminWelcomeUser(data: BaseTemplateData): EmailTemplateResult {
  const name = data.fullName || data.userName || "Unknown User";

  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">User Account Activated</h2>
      <p class="email-subtitle">An admin has activated a user's account.</p>
      
      <div class="alert-banner">
        Account status changed
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">User</span>
          <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value" style="color: #4A7043; font-weight: 700;">ACTIVE</span>
        </div>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] User Activated: ${name}`,
    html,
  };
}

function adminListingSubmitted(data: ListingData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Artwork Submission</h2>
      <p class="email-subtitle">A user has submitted a new listing for review.</p>
      
      <div class="alert-banner">
        Action: User submitted artwork
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork Title</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted By</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
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
        Review Submission
      </a>
    </div>
  `);

  return {
    subject: `[ADMIN] New Listing Submitted: ${data.title}`,
    html,
  };
}

function adminListingApproved(data: ListingData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Listing Approved</h2>
      <p class="email-subtitle">An admin has approved a user's artwork listing.</p>
      
      <div class="alert-banner">
        Action: Listing published
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Owner</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Listing Approved: ${data.title}`,
    html,
  };
}

function adminListingRejected(
  data: ListingData & { reason?: string }
): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Listing Rejected</h2>
      <p class="email-subtitle">An admin has rejected a user's artwork submission.</p>
      
      <div class="alert-banner">
        Action: Listing rejected
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted By</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        ${
          data.reason
            ? `
        <div class="detail-row" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid #E8DFD4;">
          <span class="detail-label">Rejection Reason</span>
          <span class="detail-value" style="text-align: left; max-width: 300px;">${data.reason}</span>
        </div>`
            : ""
        }
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Listing Rejected: ${data.title}`,
    html,
  };
}

function adminBidPlaced(data: BidData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Bid Placed</h2>
      <p class="email-subtitle">A user has placed a bid on an active auction.</p>
      
      <div class="alert-banner">
        Action: Bid submitted by user
      </div>
      
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
          <span class="detail-label">Placed By</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bidder Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Placed At</span>
          <span class="detail-value">${formatDate(data.placedAt)}</span>
        </div>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] New Bid: ${data.lotTitle} — ${formatCurrency(data.bidAmount)}`,
    html,
  };
}

function adminOutbidNotification(data: BidData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Outbid Event</h2>
      <p class="email-subtitle">A user has been outbid on an auction.</p>
      
      <div class="alert-banner">
        Action: Higher bid received
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">New Highest Bid</span>
          <span class="detail-value price">${formatCurrency(data.bidAmount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Previous Bid</span>
          <span class="detail-value">${formatCurrency(data.previousBid || 0)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Outbid User</span>
          <span class="detail-value">${data.fullName || data.userName}</span>
        </div>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Outbid Event: ${data.lotTitle}`,
    html,
  };
}

function adminAuctionWon(data: AuctionData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Auction Closed — Winner Declared</h2>
      <p class="email-subtitle">An auction has ended and a user has won.</p>
      
      <div class="alert-banner">
        Action: Auction completed
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Final Sale Price</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Winner</span>
          <span class="detail-value">${data.winnerName || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Seller</span>
          <span class="detail-value">${data.sellerName || "—"}</span>
        </div>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Auction Won: ${data.lotTitle} — ${formatCurrency(data.finalPrice)}`,
    html,
  };
}

function adminAuctionSoldToSeller(data: AuctionData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Artwork Sold</h2>
      <p class="email-subtitle">A user's artwork has been sold via auction.</p>
      
      <div class="alert-banner">
        Action: Sale completed
      </div>
      
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
          <span class="detail-label">Buyer (Winner)</span>
          <span class="detail-value">${data.winnerName || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Seller</span>
          <span class="detail-value">${data.sellerName || data.fullName || data.userName}</span>
        </div>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Artwork Sold: ${data.lotTitle}`,
    html,
  };
}

function adminAccountStatusChanged(data: AccountData): EmailTemplateResult {
  const name = data.fullName || data.userName || "Unknown User";
  const statusText = data.status.toUpperCase();

  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">User Account Status Changed</h2>
      <p class="email-subtitle">An admin has updated a user's account status.</p>
      
      <div class="alert-banner">
        Action: Account status update
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">User</span>
          <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">New Status</span>
          <span class="detail-value" style="font-weight: 700; text-transform: uppercase;">${statusText}</span>
        </div>
        ${
          data.reason
            ? `
        <div class="detail-row" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid #E8DFD4;">
          <span class="detail-label">Reason</span>
          <span class="detail-value" style="text-align: left; max-width: 280px;">${data.reason}</span>
        </div>`
            : ""
        }
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Account ${statusText}: ${name}`,
    html,
  };
}

function adminWalletTransaction(
  data: WalletData & { type: "deposit" | "withdrawal" }
): EmailTemplateResult {
  const isDeposit = data.type === "deposit";
  const name = data.fullName || data.userName || "Unknown User";

  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">${isDeposit ? "Wallet Deposit" : "Wallet Withdrawal"} Processed</h2>
      <p class="email-subtitle">A user has ${isDeposit ? "added funds to" : "withdrawn funds from"} their wallet.</p>
      
      <div class="alert-banner">
        Action: Wallet transaction
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">User</span>
          <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || data.userEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value price">${formatCurrency(data.amount, data.currency)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Transaction ID</span>
          <span class="detail-value" style="font-family: monospace; font-size: 12px;">${data.transactionId || "—"}</span>
        </div>
        ${
          data.balance !== undefined
            ? `
        <div class="detail-row">
          <span class="detail-label">New Balance</span>
          <span class="detail-value">${formatCurrency(data.balance, data.currency)}</span>
        </div>`
            : ""
        }
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] ${isDeposit ? "Deposit" : "Withdrawal"}: ${formatCurrency(data.amount, data.currency)} — ${name}`,
    html,
  };
}

function adminPurchaseCompleted(data: AuctionData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">Purchase Completed</h2>
      <p class="email-subtitle">A user has completed a purchase from an auction.</p>
      
      <div class="alert-banner">
        Action: Purchase finalized
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Artwork</span>
          <span class="detail-value">${data.lotTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Buyer</span>
          <span class="detail-value">${data.winnerName || data.fullName || data.userName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value price">${formatCurrency(data.finalPrice)}</span>
        </div>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Purchase Completed: ${data.lotTitle}`,
    html,
  };
}

function adminContactFormSubmission(data: ContactData): EmailTemplateResult {
  const html = createAdminEmailWrapper(`
    <div class="email-body">
      <h2 class="email-title">New Contact Form Submission</h2>
      <p class="email-subtitle">A visitor has submitted a message via the contact form.</p>
      
      <div class="alert-banner">
        Action: Contact form received
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">From</span>
          <span class="detail-value">${data.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Subject</span>
          <span class="detail-value">${data.subject}</span>
        </div>
      </div>
      
      <div style="background: #F9F5F0; padding: 18px; margin: 20px 0; border-left: 3px solid #8C5C3D;">
        <p style="white-space: pre-line; margin: 0; font-size: 14px; color: #3D2F26;">
          ${data.message}
        </p>
      </div>
    </div>
  `);

  return {
    subject: `[ADMIN] Contact Form: ${data.subject}`,
    html,
  };
}

// Legacy admin functions kept for backward compatibility (now use dedicated admin templates)
function adminNewListing(data: ListingData): EmailTemplateResult {
  return adminListingSubmitted(data);
}

function adminNewBid(data: BidData): EmailTemplateResult {
  return adminBidPlaced(data);
}

/* ============================================
   MAIN EXPORTED FUNCTION
   ============================================ */

export function generateEmailTemplate(
  activity: EmailActivityType,
  data: any,
  recipientType: EmailRecipientType = "user"
): EmailTemplateResult {
  const isAdmin = recipientType === "admin" || activity.startsWith("admin_");

  if (isAdmin) {
    // ADMIN templates - always sent to support@sharjahbiennial.online
    switch (activity) {
      case "user_registered":
        return adminUserRegistered(data);

      case "admin_new_listing":
      case "listing_submitted":
        return adminListingSubmitted(data);

      case "listing_approved":
        return adminListingApproved(data);

      case "listing_rejected":
        return adminListingRejected(data);

      case "bid_placed":
        return adminBidPlaced(data);

      case "outbid_notification":
        return adminOutbidNotification(data);

      case "auction_won":
      case "auction_closed":
        return adminAuctionWon(data);

      case "auction_sold_to_seller":
        return adminAuctionSoldToSeller(data);

      case "account_suspended":
      case "account_pending":
        return adminAccountStatusChanged(data);

      case "wallet_deposit":
        return adminWalletTransaction({ ...data, type: "deposit" });

      case "wallet_withdrawal":
        return adminWalletTransaction({ ...data, type: "withdrawal" });

      case "purchase_completed":
        return adminPurchaseCompleted(data);

      case "contact_form_submission":
        return adminContactFormSubmission(data);

      case "admin_new_bid":
        return adminBidPlaced(data);

      default:
        return {
          subject: `[ADMIN] Notification`,
          html: createAdminEmailWrapper(`
            <div class="email-body">
              <h2 class="email-title">Admin Alert</h2>
              <div class="detail-card">
                <pre style="font-size: 12px; white-space: pre-wrap; margin: 0;">${JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          `),
        };
    }
  }

  // USER templates - always sent to the user's email
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
      return auctionWon(data);

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
      return bidPlaced(data); // fallback for user path

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
 * Determines if an activity should use admin template.
 * Admin templates are triggered either by explicit "admin_*" activities
 * or when explicitly requested via recipientType.
 */
function shouldUseAdminTemplate(activity: EmailActivityType): boolean {
  return activity.startsWith("admin_");
}

/**
 * Sends an email using EmailJS with a beautifully designed template.
 *
 * IMPORTANT:
 * - If recipientType is "admin" OR activity starts with "admin_", the email is ALWAYS sent to support@sharjahbiennial.online
 * - User emails are ALWAYS sent to the provided to_email (the user's address)
 * - Admin and user templates have completely different designs and wording
 */
export async function sendGalleryEmail(
  activity: EmailActivityType,
  options: SendEmailOptions,
  config?: {
    serviceId?: string;
    templateId?: string;
    publicKey?: string;
  },
  recipientType: EmailRecipientType = "user"
): Promise<{ success: boolean; error?: any }> {
  try {
    const isAdmin =
      recipientType === "admin" || shouldUseAdminTemplate(activity);

    // Force admin emails to go to support@sharjahbiennial.online
    const targetEmail = isAdmin ? ADMIN_EMAIL : options.to_email;

    const { subject, html } = generateEmailTemplate(
      activity,
      { ...options, to_email: targetEmail },
      isAdmin ? "admin" : "user"
    );

    const emailjsConfig = {
      serviceID: "service_rfbm5hs",
      templateID: "template_33bhbtr",
      publicKey: "hSB8de6Pw2-ObeMsX",
    };

    await emailjs.send(
      emailjsConfig.serviceID,
      emailjsConfig.templateID,
      {
        title: subject,
        template: html,
        email: targetEmail,
      },
      emailjsConfig.publicKey
    );

    return { success: true };
  } catch (error) {
    console.error("[emailjsTemplate] Failed to send email:", error);
    return { success: false, error };
  }
}

/**
 * Convenience wrapper specifically for notifying BOTH user AND admin.
 *
 * - User always receives the USER template sent to their own email address
 * - Admin always receives the ADMIN template sent to support@sharjahbiennial.online
 *
 * The admin template has completely different design/text and describes the action the user performed.
 */
export async function notifyBoth(
  activity: EmailActivityType,
  userOptions: SendEmailOptions,
  adminOptions?: Partial<SendEmailOptions>
): Promise<{ user: { success: boolean }; admin?: { success: boolean } }> {
  // USER: always sent to the user's email, using user template
  const userResult = await sendGalleryEmail(
    activity,
    userOptions,
    undefined,
    "user"
  );

  // ADMIN: always sent to support@sharjahbiennial.online, using admin template
  // We pass the same activity; generateEmailTemplate will produce the admin version when recipientType="admin"
  const adminResult = await sendGalleryEmail(
    activity,
    {
      to_email: ADMIN_EMAIL,
      to_name: "Admin",
      ...adminOptions,
    },
    undefined,
    "admin"
  );

  return {
    user: userResult,
    admin: adminResult,
  };
}

/**
 * Send ONLY an admin notification (to support@sharjahbiennial.online).
 * Uses the admin-specific template design and wording.
 */
export async function sendAdminNotification(
  activity: EmailActivityType,
  data: any
): Promise<{ success: boolean; error?: any }> {
  return sendGalleryEmail(
    activity,
    { to_email: ADMIN_EMAIL, to_name: "Admin" },
    undefined,
    "admin"
  );
}

/**
 * Send ONLY a user notification (to the user's email address).
 * Uses the user-specific template design and wording.
 */
export async function sendUserNotification(
  activity: EmailActivityType,
  options: SendEmailOptions
): Promise<{ success: boolean; error?: any }> {
  return sendGalleryEmail(activity, options, undefined, "user");
}
