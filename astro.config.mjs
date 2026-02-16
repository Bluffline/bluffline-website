import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bluffline.org',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      // Netlify Visual Editor preview domains are dynamic; keep known hosts and
      // allow all hosts in dev to prevent Vite host-check 403 responses.
      allowedHosts: true,
      hmr: {
        path: '/vite-hmr/'
      }
    }
  }
});
