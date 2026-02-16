import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bluffline.org',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      allowedHosts: ['.netlify.app', '.netlify.com'],
      hmr: {
        path: '/vite-hmr/'
      }
    }
  }
});
