// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

// DOM-style listeners (work in browser / edge runtimes)
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

// Node.js server environment (TanStack Start dev + production server)
// h3 / Nitro run on Node, where uncaught errors surface on process.
if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("uncaughtException", (err) => {
    record(err);
    // Do not rethrow here; we just want the stack for the SSR error page.
  });

  process.on("unhandledRejection", (reason) => {
    record(reason);
  });
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
