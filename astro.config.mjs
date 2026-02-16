import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bluffline.org',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      // Netlify Visual Editor preview domains are dynamic across *.netlify.* hosts.
      // Keep this explicit allowlist rather than allowing all hosts.
      allowedHosts: ['localhost', '127.0.0.1', '.netlify.app', '.netlify.com', '.netlify.live'],
      hmr: {
        path: '/vite-hmr/'
      }
    }
  }
});
