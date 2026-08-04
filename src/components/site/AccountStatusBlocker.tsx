import { useAuthStore } from "@/store/zustand";
import { AlertCircle, Clock, Ban } from "lucide-react";

interface AccountStatusBlockerProps {
  /** Optional override - otherwise reads from auth store */
  status?: "active" | "pending" | "suspended";
  /** Context for the message */
  action?: "bid" | "sell" | "general";
  className?: string;
}

export function AccountStatusBlocker({
  status: statusProp,
  action = "general",
  className = "",
}: AccountStatusBlockerProps) {
  const user = useAuthStore((s) => s.user);
  const status = statusProp ?? user?.status ?? "pending";

  const isPending = status === "pending";
  const isSuspended = status === "suspended";

  const getTitle = () => {
    if (isSuspended) return "Account Suspended";
    return "Account Pending Approval";
  };

  const getIcon = () => {
    if (isSuspended) return <Ban className="size-5" />;
    return <Clock className="size-5" />;
  };

  const getDescription = () => {
    if (isSuspended) {
      return "Your account has been suspended. You cannot place bids or submit new listings at this time.";
    }
    return "Your account is awaiting admin approval. You cannot place bids or submit artwork for sale until an administrator sets your status to active.";
  };

  const getActionText = () => {
    if (action === "bid") return "bidding on auctions";
    if (action === "sell") return "submitting artwork for sale";
    return "performing this activity";
  };

  return (
    <div
      className={`rounded border border-ink/15 bg-surface/60 p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex items-center justify-center rounded bg-ink/5 p-2 text-detail">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.22em] text-detail font-medium">
            {getTitle()}
          </p>
          <p className="mt-2 text-sm text-ink/80">
            {getDescription()} You must wait for approval before {getActionText()}.
          </p>

          {user && (
            <div className="mt-3 rounded bg-canvas/60 p-3 text-xs">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-detail">
                <span>
                  <span className="uppercase tracking-[0.18em]">Name:</span>{" "}
                  {user.fullName || "—"}
                </span>
                <span>
                  <span className="uppercase tracking-[0.18em]">Email:</span>{" "}
                  {user.email}
                </span>
                <span>
                  <span className="uppercase tracking-[0.18em]">Status:</span>{" "}
                  <span
                    className={
                      isSuspended
                        ? "text-red-600"
                        : "text-amber-600"
                    }
                  >
                    {status}
                  </span>
                </span>
              </div>
            </div>
          )}

          <p className="mt-3 text-[11px] text-detail/70">
            If you believe this is an error, please contact support or wait for admin review.
          </p>
        </div>
      </div>
    </div>
  );
}
