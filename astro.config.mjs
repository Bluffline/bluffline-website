import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bluffline.org',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      // Keep this list explicit so Visual Editor preview hosts work without
      // opening dev server access to arbitrary domains.
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.netlify.app',
        '.netlify.com',
        '.netlify.live'
      ],
      hmr: {
        path: '/vite-hmr/'
      }
    }
  }
});
