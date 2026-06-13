// @ts-check
import { defineConfig } from 'astro/config';

// pythonjs.org root marketing site (Astro, static).
// /devtools/* is proxied to the devtools zone via vercel.json rewrites — see docs/multi-zone-setup.md.
export default defineConfig({
  site: 'https://pythonjs.org',
  output: 'static',
});
