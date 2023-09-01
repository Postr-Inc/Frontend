import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify/functions";
import  react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://6c4128dc.v6-0.pages.dev/',
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: cloudflare()
});