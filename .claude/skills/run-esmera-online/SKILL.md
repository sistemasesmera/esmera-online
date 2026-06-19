---
name: run-esmera-online
description: Build, run, and drive the Esmera Online Astro site. Use when asked to start the dev server, build it, screenshot its UI (home, course pages, chat widget, mobile menu, lead form), or verify a change actually renders.
---

This is a static Astro + Tailwind marketing site (no backend). Start the
dev server, then drive it with the Playwright driver at
`.claude/skills/run-esmera-online/driver.mjs` — there is no `chromium-cli`
in this environment, so the driver is a plain Node+Playwright script, not
a one-liner CLI.

All paths below are relative to the repo root (this skill's directory is
`.claude/skills/run-esmera-online/`).

## Prerequisites

This environment is Windows + Git Bash, not Linux — there is no
`apt-get` step. Node.js and npm are already available
(`package.json` requires Node >=22.12.0). `sharp` (used for image
optimization) ships transitively via Astro's own dependencies, already
present in `node_modules` once you've run `npm install`.

```bash
npm install
```

Playwright is **intentionally not a committed dependency** of this repo
(kept out of `package.json`/`package-lock.json` on purpose). Install it
fresh each session with `--no-save`, and let it install Chromium (the
browser binary caches at `~/AppData/Local/ms-playwright` and persists
across installs, so this is fast after the first time):

```bash
npm install -D playwright --no-save
npx playwright install chromium
```

When you're done driving the app, remove it again so `package.json`
stays clean (harmless to skip since `node_modules/` is gitignored
either way, but matches repo convention):

```bash
npm uninstall playwright
```

## Build

```bash
npm run build
```

Output goes to `dist/`. A clean run looks like `11 page(s) built` and
ends with `[build] Complete!`.

## Run (agent path)

1. **Kill anything already on the dev ports first** — Astro silently
   falls back to 4322/4323 if 4321 is taken by a leftover process from a
   previous session, and the driver assumes 4321:

   ```bash
   for p in $(netstat -ano | grep -E ":432[0-9]" | grep LISTENING | awk '{print $5}' | sort -u); do taskkill //F //PID "$p"; done
   ```

2. **Start the dev server in the background and wait for it**:

   ```bash
   npm run dev > /tmp/astro-dev.log 2>&1 &
   timeout 30 bash -c 'until curl -sf http://localhost:4321 >/dev/null; do sleep 1; done'
   grep Local /tmp/astro-dev.log   # confirm it actually bound to 4321, not 4322+
   ```

3. **Drive it** with the driver script:

   ```bash
   node .claude/skills/run-esmera-online/driver.mjs nav . /tmp/shots/home.png
   ```

   **Routes must NOT start with `/`** — see Gotchas. Use `.` or `""` for
   the home page, `cursos` for `/cursos`, `cursos/ia-aplicada-empresas`
   for a course detail page, etc.

| command | what it does |
|---|---|
| `nav <route> <out.png> [w] [h]` | Navigate to a route, full-page screenshot. Default viewport 1280×900. |
| `chat <out.png>` | Open the chat widget, pick "Inteligencia Artificial", then "Quiero que me contacten", screenshot the result. |
| `mobile-menu <out.png>` | Open the mobile hamburger menu at a 420×800 viewport, screenshot it. |
| `lead-form <route> <out.png>` | Navigate to a route, fill the lead form (name/email/phone) without submitting, screenshot it. |

The driver prints `CONSOLE_ERRORS: [...]` on every run — expect `[]`.
Anything else is a real bug in the app, not noise (see Gotchas for the
two categories of noise already eliminated).

Screenshots → wherever you point `<out.png>` (absolute paths recommended,
e.g. `/tmp/shots/...`).

Stop the server when done:

```bash
for p in $(netstat -ano | grep -E ":432[0-9]" | grep LISTENING | awk '{print $5}' | sort -u); do taskkill //F //PID "$p"; done
```

## Run (human path)

```bash
npm run dev   # → http://localhost:4321, Ctrl-C to stop
```

## Test

No test suite. Use `npx astro check` for type/template errors:

```bash
npx astro check
```

A clean run ends with `0 errors` (the `'z' is deprecated` hints from
`src/content.config.ts` are expected noise from Zod's re-export in
`astro:content` — not a real problem).

---

## Gotchas

- **Git Bash mangles leading-slash arguments.** Passing `/cursos` as a
  shell argument on this Windows+Git-Bash setup silently becomes
  `C:/Program Files/Git/cursos` before Node ever sees it (MSYS path
  conversion). Chromium then loads a local directory listing instead of
  the site, throwing unrelated errors (`addRow is not defined`,
  `onHasParentDirectory is not defined` — that's Chromium's own
  directory-listing page JS). The driver's `routeUrl()` strips a leading
  slash defensively, but **always pass routes without one** (`cursos`,
  not `/cursos`) to avoid the mangling in the first place.
- **`[data-reveal]` sections stay invisible in screenshots unless you
  emulate reduced motion.** Sections fade/slide in via
  `src/lib/reveal.ts`'s `IntersectionObserver` and start at `opacity:0`.
  A full-page screenshot taken without manually scrolling through the
  page first comes back mostly blank below the fold — the observer
  never fired for off-screen sections. Fix (already in the driver):
  `page.emulateMedia({ reducedMotion: "reduce" })` before `goto()`; the
  site's own reveal script already shows everything immediately under
  that media query.
- **The Astro dev toolbar 504s reliably in this headless setup**,
  throwing console errors unrelated to the app
  (`astro/runtime/client/dev-toolbar/entrypoint.js` → "Outdated
  Optimize Dep"). Fixed at the source: `devToolbar: { enabled: false }`
  in `astro.config.mjs`. If that ever gets reverted, expect this noise
  back and don't mistake it for a real bug.
- **Stale dev server processes silently steal the port.** `npm run dev`
  spawns a child `astro`/`vite` process that outlives `taskkill` on the
  parent `npm` PID. After killing, re-check
  `netstat -ano | grep LISTENING` for 4321/4322/4323 and kill those PIDs
  too, or the next `npm run dev` binds to 4322 and every driver call
  silently talks to a different (possibly stale/half-restarted) server.

## Troubleshooting

- **`page.goto: net::ERR_FILE_NOT_FOUND at c:/Program Files/Git/...`**:
  you passed a route starting with `/`. Drop the leading slash.
- **Driver hangs or `curl` never succeeds on port 4321**: something
  else is already bound to it. Run the port-cleanup command in step 1
  of Run (agent path) before starting.
- **`CONSOLE_ERRORS` contains `addRow is not defined` /
  `onHasParentDirectory is not defined` / `start is not defined`**:
  Chromium loaded a local directory listing, not the site — almost
  always the leading-slash route-mangling issue above.
