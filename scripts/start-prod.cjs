#!/usr/bin/env node
/**
 * Production start for Render.
 * Builds dist/ when missing so a dashboard Build Command of plain
 * `npm install` still produces a runnable app.
 */
const { existsSync, readdirSync } = require("node:fs");
const { join } = require("node:path");
const { spawnSync } = require("node:child_process");

const root = join(__dirname, "..");

function hasDist() {
  const server = join(root, "dist/server/server.js");
  const client = join(root, "dist/client");
  const assets = join(root, "dist/server/assets");
  if (!existsSync(server) || !existsSync(client)) return false;
  try {
    return readdirSync(assets).length > 0;
  } catch {
    return false;
  }
}

if (!hasDist()) {
  console.log("dist/ missing — running npm run build…");
  const build = spawnSync("npm", ["run", "build"], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (build.status !== 0) {
    console.error("Build failed. Set Render Build Command to: npm install && npm run build");
    process.exit(build.status ?? 1);
  }
  if (!hasDist()) {
    console.error("Build finished but dist/ is still incomplete.");
    process.exit(1);
  }
} else {
  console.log("dist/ OK");
}

const server = spawnSync(process.execPath, [join(root, "render-server.js")], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
process.exit(server.status ?? 1);
