// render-server.js
// Adapter to run TanStack Start's fetch handler on Render (Node.js)
// Serves dist/client static assets, then falls through to SSR.

import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = fileURLToPath(new URL("./dist/client", import.meta.url));

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

function resolveClientPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.split("?")[0]);
  const relative = decoded.replace(/^\/+/, "");
  if (!relative) return null;

  const candidate = normalize(join(CLIENT_DIR, relative));
  if (!candidate.startsWith(CLIENT_DIR + sep) && candidate !== CLIENT_DIR) {
    return null;
  }
  return candidate;
}

function tryServeStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;

  const filePath = resolveClientPath(url.pathname);
  if (!filePath || !existsSync(filePath)) return false;

  const stats = statSync(filePath);
  if (!stats.isFile()) return false;

  const type = MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("Content-Type", type);
  res.setHeader("Content-Length", String(stats.size));
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  createReadStream(filePath).pipe(res);
  return true;
}

async function start() {
  const { default: serverEntry } = await import("./dist/server/server.js");

  const httpServer = createServer(async (req, res) => {
    try {
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers.host;
      const url = new URL(req.url || "/", `${protocol}://${host}`);

      if (tryServeStatic(req, res, url)) return;

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      }

      let body;
      if (
        req.method !== "GET" &&
        req.method !== "HEAD" &&
        req.method !== "OPTIONS"
      ) {
        body = Readable.toWeb(req);
      }

      const request = new Request(url, {
        method: req.method,
        headers,
        body,
        duplex: "half",
      });

      const response = await serverEntry.fetch(request, {}, {});

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (response.body) {
        const reader = response.body.getReader();
        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(Buffer.from(value));
          await pump();
        };
        await pump();
      } else {
        res.end();
      }
    } catch (err) {
      console.error("Render server error:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Internal Server Error");
      } else {
        res.end();
      }
    }
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
