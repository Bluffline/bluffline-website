import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bluffline.org',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      allowedHosts: ['.netlify.app', '.netlify.com'],
      hmr: {
        path: '/vite-hmr/'
      },
      headers: {
        'Content-Security-Policy': "frame-ancestors 'self' https://app.netlify.com https://create.netlify.com https://*.netlify.app https://*.netlify.com"
      }
    }
  }
});
