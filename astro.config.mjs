import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import  react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://v6-0.pages.dev/',
  integrations: [react(), tailwind()],
  output: 'hybrid',
  adapter: cloudflare()
});
