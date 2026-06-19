// Driver for the Esmera Online Astro site. Requires the dev server already
// running at BASE_URL (see SKILL.md) and `playwright` installed (also in
// SKILL.md — it is intentionally NOT a committed dependency of this repo).
//
// Usage:
//   node driver.mjs nav <route> <out.png> [width] [height]
//   node driver.mjs chat <out.png>
//   node driver.mjs mobile-menu <out.png>
//   node driver.mjs lead-form <route> <out.png>
//
// IMPORTANT (Git Bash / MSYS on Windows): pass <route> WITHOUT a leading
// slash (e.g. "cursos", not "/cursos"; "." or "" for the home page). Git
// Bash silently rewrites bare leading-slash arguments into a Windows path
// (e.g. "/cursos" becomes "C:/Program Files/Git/cursos"), which then
// navigates Chromium to a local directory listing instead of the site —
// producing confusing, unrelated console errors ("addRow is not defined",
// etc. — that's Chromium's own directory-listing page, not this app).
//
// Screenshots are written relative to the current working directory.
// Prints CONSOLE_ERRORS as JSON on exit — expect "[]" on every page; any
// non-empty result is a real bug in the app, not noise.

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4321";
const [, , command, ...args] = process.argv;

const errors = [];

function watchErrors(page) {
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
}

async function newPage(browser, viewport) {
  const page = await browser.newPage({ viewport });
  // Sections use [data-reveal] (see src/lib/reveal.ts) and stay
  // opacity:0 until scrolled into view. The site already shows everything
  // immediately under prefers-reduced-motion, so emulate it here — otherwise
  // a full-page screenshot taken without manually scrolling first comes
  // back mostly blank below the fold.
  await page.emulateMedia({ reducedMotion: "reduce" });
  return page;
}

function routeUrl(route) {
  const clean = (route ?? "").replace(/^\/+/, "");
  return new URL(clean, BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/").toString();
}

async function main() {
  const browser = await chromium.launch();

  if (command === "nav") {
    const [route, out, width = "1280", height = "900"] = args;
    const page = await newPage(browser, { width: Number(width), height: Number(height) });
    watchErrors(page);
    await page.goto(routeUrl(route), { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: out, fullPage: true });
  } else if (command === "chat") {
    const [out] = args;
    const page = await newPage(browser, { width: 1280, height: 900 });
    watchErrors(page);
    await page.goto(routeUrl(""), { waitUntil: "networkidle" });
    await page.click("#chat-toggle");
    await page.waitForTimeout(300);
    await page.click("button:has-text('Inteligencia Artificial')");
    await page.waitForTimeout(200);
    await page.click("button:has-text('Quiero que me contacten')");
    await page.waitForTimeout(200);
    await page.screenshot({ path: out });
  } else if (command === "mobile-menu") {
    const [out] = args;
    const page = await newPage(browser, { width: 420, height: 800 });
    watchErrors(page);
    await page.goto(routeUrl(""), { waitUntil: "networkidle" });
    await page.click("#mobile-menu-button");
    await page.waitForTimeout(400);
    await page.screenshot({ path: out });
  } else if (command === "lead-form") {
    const [route, out] = args;
    const page = await newPage(browser, { width: 1280, height: 900 });
    watchErrors(page);
    await page.goto(routeUrl(route), { waitUntil: "networkidle" });
    await page.fill("#lead-name", "Driver Test");
    await page.fill("#lead-email", "driver@example.com");
    await page.fill("#lead-phone", "600111222");
    await page.screenshot({ path: out });
  } else {
    console.error("Unknown command. Use: nav | chat | mobile-menu | lead-form");
    process.exitCode = 1;
  }

  console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
  await browser.close();
}

main();
