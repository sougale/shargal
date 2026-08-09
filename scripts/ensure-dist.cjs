#!/usr/bin/env node
/**
 * Fail fast on Render/start if the production build is missing.
 * Prevents serving a half-deleted committed dist/ that 500s every request.
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const required = [
  "dist/server/server.js",
  "dist/client",
];

const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));

if (missing.length) {
  console.error(
    [
      "",
      "Production build missing or incomplete:",
      ...missing.map((m) => `  - ${m}`),
      "",
      "On Render, set Build Command to:",
      "  npm install && npm run build",
      "",
      "Then redeploy (Clear build cache recommended).",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

// Soft check: server entry should have a sibling assets chunk directory
const serverAssets = path.join(root, "dist/server/assets");
if (!fs.existsSync(serverAssets) || fs.readdirSync(serverAssets).length === 0) {
  console.error(
    "\ndist/server/assets is empty. Run `npm run build` before starting.\n",
  );
  process.exit(1);
}

console.log("dist/ OK");
