/**
 * Offline PWA audit — load once online (activate SW), then reload offline
 * and report failed requests / missing UI assets.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.PWA_URL || "http://localhost:4173";
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const failed = [];
const succeeded = [];

function classify(url) {
  if (url.includes("workflow.boomitra.com")) return "api";
  if (url.includes("fonts.googleapis") || url.includes("fonts.gstatic"))
    return "cdn-font";
  if (/\.(woff2?|ttf|otf)(\?|$)/i.test(url) || url.includes("/assets/") && url.includes("inter") || url.includes("figtree"))
    return "font";
  if (/\.(png|jpe?g|svg|webp|gif)(\?|$)/i.test(url)) return "image";
  if (/\.(js)(\?|$)/i.test(url)) return "script";
  if (/\.(css)(\?|$)/i.test(url)) return "style";
  if (url.includes("manifest")) return "manifest";
  if (url.endsWith("/sw.js") || url.includes("workbox")) return "service-worker";
  if (url === BASE || url === BASE + "/" || url.includes("index.html") || url.includes("offline.html"))
    return "document";
  return "other";
}

async function waitForSW(page, timeout = 15000) {
  await page.waitForFunction(
    async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.some((r) => r.active);
    },
    { timeout }
  );
}

async function collectFromPage(page, label) {
  const results = { label, failed: [], ok: [], consoleErrors: [] };

  page.removeAllListeners("requestfailed");
  page.removeAllListeners("response");
  page.removeAllListeners("console");

  page.on("requestfailed", (req) => {
    results.failed.push({
      url: req.url(),
      type: classify(req.url()),
      error: req.failure()?.errorText || "failed",
      resourceType: req.resourceType(),
    });
  });

  page.on("response", (res) => {
    const url = res.url();
    if (!url.startsWith("http")) return;
    results.ok.push({
      url,
      type: classify(url),
      status: res.status(),
      fromServiceWorker: res.fromServiceWorker(),
    });
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") results.consoleErrors.push(msg.text());
  });

  return results;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const client = await page.createCDPSession();

  // --- Pass 1: online visit to install SW + fill precache ---
  const online = await collectFromPage(page, "online-first-visit");
  await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 60000 });
  await waitForSW(page);
  // Give workbox a moment to finish precaching
  await new Promise((r) => setTimeout(r, 2000));

  const swInfo = await page.evaluate(async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    const caches = await window.caches.keys();
    let precacheCount = 0;
    for (const key of caches) {
      const c = await window.caches.open(key);
      precacheCount += (await c.keys()).length;
    }
    return {
      registrations: regs.map((r) => ({
        scope: r.scope,
        active: r.active?.scriptURL || null,
      })),
      cacheNames: caches,
      cachedRequestCount: precacheCount,
    };
  });

  // Snapshot asset URLs from DOM
  const domAssets = await page.evaluate(() => {
    const imgs = [...document.images].map((i) => ({
      src: i.currentSrc || i.src,
      complete: i.complete,
      naturalWidth: i.naturalWidth,
    }));
    const fonts = [...document.fonts].map((f) => ({
      family: f.family,
      status: f.status,
      weight: f.weight,
      style: f.style,
    }));
    return {
      title: document.title,
      rootHasContent: (document.getElementById("root")?.childElementCount || 0) > 0,
      imgs,
      fonts,
      online: navigator.onLine,
    };
  });

  // --- Pass 2: go offline and reload ---
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  });

  const offline = await collectFromPage(page, "offline-reload");
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));

  const offlineDom = await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images].map((i) => ({
      src: i.currentSrc || i.src,
      complete: i.complete,
      naturalWidth: i.naturalWidth,
      ok: i.complete && i.naturalWidth > 0,
    }));
    const fonts = [...document.fonts].map((f) => ({
      family: f.family,
      status: f.status,
      weight: f.weight,
      style: f.style,
    }));

    // Probe key routes / assets
    const probes = [
      "/",
      "/index.html",
      "/manifest.webmanifest",
      "/offline.html",
      "/icons/pwa-192x192.png",
      "/icons/pwa-512x512.png",
    ];
    const probeResults = [];
    for (const path of probes) {
      try {
        const res = await fetch(path);
        probeResults.push({ path, status: res.status, ok: res.ok });
      } catch (e) {
        probeResults.push({ path, status: 0, ok: false, error: String(e) });
      }
    }

    // API POST should fail offline (expected)
    let api = { ok: false, error: null };
    try {
      await fetch(
        "https://workflow.boomitra.com/webhook/709e9400-0911-4a55-b195-d0f5503d9b21",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        }
      );
      api = { ok: true, error: null };
    } catch (e) {
      api = { ok: false, error: e instanceof Error ? e.message : String(e) };
    }

    // Google Fonts CDN should NOT be required
    let googleFonts = { attempted: false, ok: false };
    try {
      const res = await fetch(
        "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"
      );
      googleFonts = { attempted: true, ok: res.ok };
    } catch (e) {
      googleFonts = {
        attempted: true,
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      };
    }

    return {
      title: document.title,
      rootHasContent: (document.getElementById("root")?.childElementCount || 0) > 0,
      bodyTextSample: (document.body?.innerText || "").slice(0, 200),
      imgs,
      fonts,
      online: navigator.onLine,
      probes: probeResults,
      api,
      googleFonts,
      hasConnectedOrOfflineBadge: /Connected|Offline Mode/.test(
        document.body?.innerText || ""
      ),
    };
  });

  // Deep route offline (SPA fallback)
  await page.goto(BASE + "/any-deep-route", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 1000));
  const deepRoute = await page.evaluate(() => ({
    rootHasContent: (document.getElementById("root")?.childElementCount || 0) > 0,
    title: document.title,
    href: location.href,
  }));

  await browser.close();

  const report = {
    base: BASE,
    serviceWorker: swInfo,
    onlineFirstVisit: {
      failedRequests: online.failed,
      failedCount: online.failed.length,
    },
    offlineReload: {
      failedRequests: offline.failed,
      failedCount: offline.failed.length,
      consoleErrors: offline.consoleErrors,
    },
    onlineDom: domAssets,
    offlineDom,
    deepRouteOffline: deepRoute,
  };

  // Checklist scoring
  const checklist = [];
  const pass = (id, ok, detail) => checklist.push({ id, ok, detail });

  pass("sw-registered", swInfo.registrations.some((r) => r.active), swInfo);
  pass("precache-populated", swInfo.cachedRequestCount > 0, `${swInfo.cachedRequestCount} cached requests`);
  pass("offline-app-shell", offlineDom.rootHasContent, offlineDom.bodyTextSample);
  pass(
    "offline-images",
    offlineDom.imgs.length > 0 && offlineDom.imgs.every((i) => i.ok),
    offlineDom.imgs.map((i) => ({ src: i.src.split("/").pop(), ok: i.ok }))
  );
  pass(
    "offline-fonts-loaded",
    offlineDom.fonts.some((f) => /inter/i.test(f.family) && f.status === "loaded") &&
      offlineDom.fonts.some((f) => /figtree/i.test(f.family) && f.status === "loaded"),
    offlineDom.fonts.filter((f) => /inter|figtree/i.test(f.family))
  );
  pass(
    "no-google-fonts-in-bundle",
    offlineDom.googleFonts && offlineDom.googleFonts.ok === false,
    "App does not depend on Google Fonts CDN (probe fails offline as expected)"
  );
  pass(
    "routes-fallback",
    offlineDom.probes.filter((p) => ["/", "/index.html", "/manifest.webmanifest", "/offline.html"].includes(p.path)).every((p) => p.ok),
    offlineDom.probes
  );
  pass("icons-cached", offlineDom.probes.filter((p) => p.path.startsWith("/icons/")).every((p) => p.ok), offlineDom.probes.filter((p) => p.path.startsWith("/icons/")));
  pass("api-fails-offline-expected", !offlineDom.api.ok, offlineDom.api);
  pass("deep-route-offline", deepRoute.rootHasContent, deepRoute);
  pass("offline-indicator", offlineDom.hasConnectedOrOfflineBadge, "badge text present");
  pass(
    "no-unexpected-offline-failures",
    offline.failed.filter((f) => f.type !== "api" && f.type !== "cdn-font").length === 0,
    offline.failed
  );

  report.checklist = checklist;
  report.summary = {
    passed: checklist.filter((c) => c.ok).length,
    failed: checklist.filter((c) => !c.ok).length,
    items: checklist.map((c) => `${c.ok ? "PASS" : "FAIL"} ${c.id}`),
  };

  console.log(JSON.stringify(report, null, 2));
  if (report.summary.failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
