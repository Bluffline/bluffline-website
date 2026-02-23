import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://bluffline.org',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  integrations: [react()],
});
