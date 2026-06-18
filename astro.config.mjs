// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: update to the real production domain before deploying
  site: 'https://esmeraonline.com',

  // The dev toolbar's client entrypoint reliably 504s on first load in
  // headless/automated sessions (see .claude/skills/run-esmera-online),
  // which then throws spurious console errors. It's a dev-only debug
  // overlay with no effect on `astro build` output, so disabling it is safe.
  devToolbar: { enabled: false },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});