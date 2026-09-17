#!/usr/bin/env node
/**
 * Auto Screenshot Pipeline for the portfolio.
 *
 * Scans the configured GitHub user's repos, runs each web app locally,
 * captures full-page screenshots, builds a montage hero banner, saves
 * everything into public/images/projects/, and wires the metadata into
 * src/data/github-metadata.json so project cards show real system photos.
 *
 * Designed to run in GitHub Actions (fully automatic, daily cron) or
 * manually with:  node scripts/auto-screenshots.mjs [--repo=<name>]
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import net from "node:net";
import { execSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(REPO_ROOT, "src", "data", "screenshot-sources.json");
const METADATA_PATH = path.join(REPO_ROOT, "src", "data", "github-metadata.json");
const SHOTS_DIR = path.join(REPO_ROOT, "public", "images", "projects");

const PORT_RANGE = Array.from({ length: 11 }, (_, i) => 3000 + i);
const DEFAULT_ROUTES = ["/", "/dashboard", "/login", "/products", "/inventory", "/pos", "/reports"];
const COMMON_TECH = new Set([
  "next", "next-auth", "react", "react-dom", "vue", "vite", "express",
  "fastify", "svelte", "angular", "tailwindcss", "bootstrap", "jquery",
  "prisma", "@prisma/client", "@tanstack/react-query", "trpc", "@trpc/server",
  "zustand", "redux", "recharts", "node-schedule", "mysql2", "pg",
]);

let log = [];
const info = (msg) => {
  log.push(msg);
  console.log(`[auto-screenshots] ${msg}`);
};

function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

function loadMetadata() {
  if (!fs.existsSync(METADATA_PATH)) return {};
  return JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));
}

function saveMetadata(meta) {
  fs.writeFileSync(METADATA_PATH, JSON.stringify(meta, null, 2) + "\n", "utf8");
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { "User-Agent": "auto-screenshots", Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function listRepos(username) {
  const repos = [];
  let page = 1;
  while (true) {
    const batch = await fetchJson(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
    );
    if (batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return repos.filter((r) => !r.fork && !r.archived);
}

function pickProjectRoot(cloneDir, subdir) {
  if (subdir) return path.join(cloneDir, subdir);
  if (fs.existsSync(path.join(cloneDir, "package.json"))) return cloneDir;
  const candidates = fs.readdirSync(cloneDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(cloneDir, d.name))
    .filter((d) => fs.existsSync(path.join(d, "package.json")));
  return candidates[0] ?? null;
}

async function findFreePort() {
  for (const port of PORT_RANGE) {
    const free = await new Promise((resolve) => {
      const srv = net.createServer();
      srv.once("error", () => resolve(false));
      srv.once("listening", () => srv.close(() => resolve(true)));
      srv.listen(port, "127.0.0.1");
    });
    if (free) return port;
  }
  throw new Error("No free port in 3000-3010");
}

async function waitForServer(url, timeoutMs = 180000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.status < 500) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

function killProcessTree(proc) {
  if (!proc || proc.killed) return;
  if (process.platform === "win32") {
    try {
      execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: "ignore" });
      return;
    } catch {
      /* fall through to generic kill */
    }
  } else {
    try {
      process.kill(-proc.pid, "SIGKILL");
      return;
    } catch {
      /* fall through to generic kill */
    }
  }
  try { proc.kill("SIGKILL"); } catch { /* ignore */ }
}

function detectPm(dir) {
  if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(dir, "yarn.lock"))) return "yarn";
  return "npm";
}

function installCmd(pm) {
  if (pm === "pnpm") return "pnpm install --reporter=silent";
  if (pm === "yarn") return "yarn install --silent";
  return "npm install --no-audit --no-fund --loglevel=error";
}

function pickDevScript(projectDir) {
  try {
    const scripts = JSON.parse(fs.readFileSync(path.join(projectDir, "package.json"), "utf8")).scripts ?? {};
    if (scripts.dev) return "dev";
    if (scripts.start) return "start";
  } catch { /* ignore */ }
  return "dev";
}

function devArgs(projectDir, port, scriptName) {
  const pkgPath = path.join(projectDir, "package.json");
  let script = "";
  try {
    script = JSON.parse(fs.readFileSync(pkgPath, "utf8")).scripts?.[scriptName] ?? "";
  } catch { /* ignore */ }
  if (script.includes("next")) return ["--port", String(port), "--hostname", "127.0.0.1"];
  if (script.includes("vite")) return ["--port", String(port), "--host", "127.0.0.1"];
  return [];
}

async function runDevServer(projectDir, port) {
  const env = { ...process.env, PORT: String(port), HOST: "127.0.0.1" };
  const pm = detectPm(projectDir);
  const scriptName = pickDevScript(projectDir);
  const args = ["run", scriptName, "--", ...devArgs(projectDir, port, scriptName)];
  const proc = spawn(pm, args, {
    cwd: projectDir,
    env,
    shell: process.platform === "win32",
    detached: process.platform !== "win32",
    stdio: "ignore",
  });
  return proc;
}

async function discoverRoutes(baseUrl, configuredRoutes) {
  const routes = [];
  if (configuredRoutes && configuredRoutes.length > 0) {
    return [...new Set(configuredRoutes)];
  }
  // Try sitemap.xml
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const body = await res.text();
      const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      for (const loc of locs) {
        try {
          const u = new URL(loc);
          if (u.origin === new URL(baseUrl).origin && !u.pathname.startsWith("/api")) {
            routes.push(u.pathname + u.search);
          }
        } catch { /* ignore invalid */ }
      }
    }
  } catch { /* no sitemap */ }
  return routes.length > 0 ? [...new Set(routes)] : [...DEFAULT_ROUTES];
}

async function captureShots(baseUrl, routes, outputDir, prefix) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const shots = [];

  for (const route of routes) {
    const url = route.startsWith("http") ? route : `${baseUrl}${route}`;
    const name = route
      .replace(/^\/+/, "")
      .replace(/[\/?&=.#]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "home";
    const outFile = path.join(outputDir, `${prefix}-${name}.png`);
    try {
      const resp = await page.goto(url, { waitUntil: "load", timeout: 45000 });
      if (resp && resp.status() >= 400) {
        info(`  skip ${route} (HTTP ${resp.status()})`);
        continue;
      }
      await page.waitForTimeout(1600);
      await page.screenshot({ path: outFile });
      shots.push(outFile);
      info(`  captured ${route} -> ${path.basename(outFile)}`);
    } catch (e) {
      info(`  skip ${route} (${e.message.slice(0, 80)})`);
    }
  }

  await browser.close();
  return shots;
}

async function buildMontage(shots, outputFile, title, subtitle) {
  if (shots.length === 0) return null;
  const four = shots.slice(0, 4).map((s) => path.resolve(s));
  const htmlFile = path.join(path.dirname(outputFile), "hero-src.html");
  const cells = four
    .map((s) => `<div class="frame"><img src="${s.replaceAll(path.sep, "/")}" /></div>`)
    .join("");

  const html = `<!doctype html><html><head><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:675px; overflow:hidden; display:flex; flex-direction:column;
         background:#f8fafc; font-family:'Segoe UI', Arial, sans-serif; padding:10px;
         background-image:radial-gradient(circle at 15% 10%, rgba(13,148,136,0.12), transparent 40%),
                          radial-gradient(circle at 90% 90%, rgba(79,70,229,0.10), transparent 40%); }
  .bar { display:flex; align-items:center; gap:12px; padding:12px 18px; background:#0f172a;
         border-radius:12px; color:#fff; }
  .dots { display:flex; gap:7px; }
  .dot { width:12px; height:12px; border-radius:50%; display:inline-block; }
  .title { font-size:17px; font-weight:700; letter-spacing:0.2px; }
  .sub { font-size:12px; color:#94a3b8; margin-top:2px; }
  .grid { flex:1; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr;
          gap:10px; margin-top:10px; }
  .frame { position:relative; border-radius:12px; overflow:hidden; background:#fff;
           box-shadow:0 8px 24px rgba(2,6,23,0.20); border:1px solid #e2e8f0; }
  .frame img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:top; }
</style></head><body>
  <div class="bar">
    <div class="dots">
      <span class="dot" style="background:#ef4444"></span>
      <span class="dot" style="background:#f59e0b"></span>
      <span class="dot" style="background:#22c55e"></span>
    </div>
    <div>
      <div class="title">${escapeHtml(title)}</div>
      <div class="sub">${escapeHtml(subtitle)}</div>
    </div>
  </div>
  <div class="grid">${cells}</div>
</body></html>`;

  fs.writeFileSync(htmlFile, html, "utf8");

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 675 } });
  await page.goto(`file:///${path.resolve(htmlFile).replaceAll(path.sep, "/")}`, {
    waitUntil: "load",
    timeout: 60000,
  });
  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs.length === 4 && imgs.every((i) => i.complete && i.naturalWidth > 0);
  }, { timeout: 30000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: outputFile });
  await browser.close();
  fs.rmSync(htmlFile, { force: true });
  return outputFile;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function buildMetadataEntry(repo, config, shots, heroFile, projectDir) {
  const projectConfig = config?.projects?.[repo.name];
  const name = projectConfig?.name ?? repo.name.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const category = projectConfig?.category ?? "web";
  return {
    name,
    description: projectConfig?.description ?? repo.description ?? "",
    image: `/images/projects/${heroFile}`,
    screenshots: shots.map((s) => `/images/projects/${path.basename(s)}`),
    category,
    featured: projectConfig?.featured ?? false,
    techStack: projectConfig?.techStack ?? detectTechStack(projectDir),
    _auto: true,
    _repoPushedAt: repo.pushed_at ?? null,
    _processed: new Date().toISOString(),
  };
}

function detectTechStack(projectDir) {
  const pkgPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(pkgPath)) return "Web";
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    const hits = Object.keys(deps).filter((d) => COMMON_TECH.has(d));
    const labels = hits.map((d) => {
      if (d === "next") return "Next.js";
      if (d === "react" || d === "react-dom") return "React";
      if (d === "vue") return "Vue";
      if (d === "vite") return "Vite";
      if (d === "express") return "Express";
      if (d === "svelte") return "Svelte";
      if (d === "angular") return "Angular";
      if (d.includes("tailwind")) return "Tailwind CSS";
      if (d.includes("prisma")) return "Prisma";
      return d;
    });
    const unique = [...new Set(labels)];
    if (unique.length > 0) return unique.join(", ");
    return Object.keys(pkg.dependencies ?? {}).slice(0, 3).join(", ") || "Web";
  } catch {
    return "Web";
  }
}

function cleanOldShots(repoName) {
  const meta = loadMetadata();
  const entry = meta[repoName];
  if (!entry) return;
  const oldFiles = [entry.image, ...(entry.screenshots ?? [])].filter(Boolean);
  let removed = 0;
  for (const rel of oldFiles) {
    const file = path.join(SHOTS_DIR, rel.split("/").pop());
    if (fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      removed++;
    }
  }
  if (removed > 0) info(`   cleaned ${removed} old screenshot file(s) for ${repoName}`);
}

function alreadyUpToDate(repo, meta) {
  const entry = meta?.[repo.name];
  if (!entry) return false;
  if (entry._auto !== true) return false;
  if (!entry.screenshots?.length || !entry.image) return false;
  if (entry._repoPushedAt && repo.pushed_at && entry._repoPushedAt !== repo.pushed_at) {
    info(`   ${repo.name}: repo changed since last capture — will refresh`);
    return false;
  }
  const hero = path.join(SHOTS_DIR, entry.image.split("/").pop());
  if (!fs.existsSync(hero)) return false;
  return true;
}

async function processRepo(repo, config, forcedRepo, baseScratch) {
  const projectConfig = config?.projects?.[repo.name];
  const scratch = fs.mkdtempSync(path.join(baseScratch, `${repo.name}-`));
  info(`>> Processing ${repo.name} (${repo.clone_url})`);
  cleanOldShots(repo.name);
  let proc = null;

  try {
    cloneRepo(repo, scratch);

    const projectDir = pickProjectRoot(scratch, projectConfig?.subdir);
    if (!projectDir) {
      info(`!! ${repo.name}: no package.json found — likely PHP/MySQL or static. Skipping (manual fallback).`);
      return { skipped: true, reason: "no-node-app" };
    }

    info(`   installing deps in ${path.basename(projectDir)} (${detectPm(projectDir)} install)...`);
    execSync(installCmd(detectPm(projectDir)), {
      cwd: projectDir,
      stdio: ["ignore", "ignore", "inherit"],
      env: { ...process.env, CI: "true" },
      timeout: 420000,
    });

    const port = await findFreePort();
    const baseUrl = `http://127.0.0.1:${port}`;
    info(`   starting dev server on port ${port}...`);
    proc = await runDevServer(projectDir, port);
    const ready = await waitForServer(baseUrl);
    if (!ready) {
      info(`!! ${repo.name}: dev server did not become ready. Skipping.`);
      return { skipped: true, reason: "server-not-ready" };
    }
    info(`   server ready at ${baseUrl}`);

    const routes = await discoverRoutes(baseUrl, projectConfig?.routes);
    info(`   routes to capture (${routes.length}): ${routes.join(", ")}`);

    const shots = await captureShots(baseUrl, routes, SHOTS_DIR, repo.name);

    if (shots.length === 0) {
      info(`!! ${repo.name}: no valid screenshots captured.`);
      return { skipped: true, reason: "no-shots" };
    }

    const title = projectConfig?.name ?? repo.name.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const description = projectConfig?.description ?? repo.description ?? "";

    const heroFile = `${repo.name}-hero.png`;
    await buildMontage(shots, path.join(SHOTS_DIR, heroFile), title, description);
    info(`   hero banner -> ${heroFile}`);

    const meta = loadMetadata();
    meta[repo.name] = await buildMetadataEntry(repo, config, shots, heroFile, projectDir);
    saveMetadata(meta);
    info(`   metadata updated for ${repo.name}`);

    return { skipped: false, shots: shots.length + 1 };
  } finally {
    killProcessTree(proc);
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function cloneRepo(repo, scratch) {
  execSync(`git clone --quiet --depth 1 ${repo.clone_url} ${scratch}`, {
    stdio: ["ignore", "ignore", "inherit"],
    timeout: 300000,
  });
}

async function main() {
  const args = process.argv.slice(2);
  const forcedRepo = args.find((a) => a.startsWith("--repo="))?.split("=")[1] ?? null;
  const dry = args.some((a) => a === "--dry-run");

  const config = loadConfig();
  const settings = config.settings ?? {};
  const username = process.env.GITHUB_USERNAME ?? settings.username ?? "archillesdc06";
  const exclude = settings.excludeRepos ?? [];

  info(`Scanning GitHub repos for user ${username}${forcedRepo ? ` (forced: ${forcedRepo})` : ""}`);
  const repos = await listRepos(username);
  const candidates = repos.filter((r) => !exclude.includes(r.name));

  if (dry) {
    info(`DRY RUN — candidates found (${candidates.length}):`);
    for (const r of candidates) info(`   - ${r.name} [${r.language ?? "?"}] ${!r.description ? "(no desc)" : ""}`);
    return;
  }

  const scratchBase = fs.mkdtempSync(path.join(os.tmpdir(), "auto-screenshots-"));
  const meta = loadMetadata();
  let processed = 0;
  let skipped = 0;

  for (const repo of candidates) {
    if (forcedRepo && repo.name !== forcedRepo) continue;
    if (!forcedRepo) {
      if (alreadyUpToDate(repo, meta)) {
        info(`-- ${repo.name}: screenshots already up-to-date — skipping`);
        continue;
      }
      if (config?.projects?.[repo.name]?.enabled === false) {
        info(`-- ${repo.name}: disabled in config — skipping (manual fallback)`);
        skipped++;
        continue;
      }
    }
    const result = await processRepo(repo, config, forcedRepo, scratchBase);
    if (result.skipped) skipped++;
    else processed++;
  }

  fs.rmSync(scratchBase, { recursive: true, force: true });
  info(`Done. Processed: ${processed}, Skipped: ${skipped}`);
  if (processed === 0) info("No changes needed. (Workflow will not commit.)");
}

main().catch((e) => {
  console.error("[auto-screenshots] FATAL:", e);
  process.exit(1);
});