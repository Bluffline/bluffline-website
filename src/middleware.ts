import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://app.netlify.com https://create.netlify.com https://*.netlify.app https://*.netlify.com"
  );
  return response;
});
