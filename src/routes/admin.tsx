import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { requireAdmin } from "@/lib/routeGuards";
import { useAuthStore } from "@/store/zustand";

export const Route = createFileRoute("/admin")({
  beforeLoad: requireAdmin,
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Console — Sharjahbiennial Admin" },
      {
        name: "description",
        content:
          "Operational control center for the Sharjahbiennial exhibition and wallet.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const selectUser = (s: ReturnType<typeof useAuthStore.getState>) => s.user;
const selectHydrated = (s: ReturnType<typeof useAuthStore.getState>) =>
  s.isAuthHydrated;
const selectLoading = (s: ReturnType<typeof useAuthStore.getState>) => s.loading;

function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore(selectUser, Object.is);
  const isAuthHydrated = useAuthStore(selectHydrated, Object.is);
  const loading = useAuthStore(selectLoading, Object.is);

  // Runtime guard: covers SSR pass-through, hard refresh, and live role changes.
  useEffect(() => {
    if (!isAuthHydrated || loading) return;
    if (!user) {
      navigate({ to: "/connect", replace: true });
      return;
    }
    if (user.role !== "admin") {
      navigate({ to: "/profile", replace: true });
    }
  }, [user, isAuthHydrated, loading, navigate]);

  if (!isAuthHydrated || loading) {
    return (
      <AdminLoader
        fullscreen
        isLoading
        message="Verifying access"
        subMessage="Checking admin credentials"
      />
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <AdminLoader
        fullscreen
        isLoading
        message="Redirecting"
        subMessage="Admin access required"
      />
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
