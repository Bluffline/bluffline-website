import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thebluffline.org',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  integrations: [react(), sitemap()],
});
