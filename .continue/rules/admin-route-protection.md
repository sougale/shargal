---
description: Standard pattern for protecting the entire admin section using
  TanStack Router beforeLoad guards.
alwaysApply: true
---

Use `beforeLoad: requireAdmin` (from @/lib/routeGuards) on the /admin layout route and any sensitive admin sub-routes. The guard waits for auth hydration then enforces user.role === "admin". Unauthenticated → /connect, non-admins → /wallet.