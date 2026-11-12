/**
 * Netlify Function: cms-auth
 * Routed via netlify.toml to /api/auth and /api/auth/callback
 *
 * Minimal GitHub OAuth proxy for Sveltia CMS (/admin). It speaks the same
 * popup protocol as Decap/Netlify CMS, so the CMS config only needs:
 *   backend.base_url: <site origin>, backend.auth_endpoint: api/auth
 *
 * Environment variables (Netlify dashboard > Site configuration > Environment variables):
 *   GITHUB_CLIENT_ID      OAuth app client ID
 *   GITHUB_CLIENT_SECRET  OAuth app client secret (never commit this)
 *   CMS_ALLOWED_ORIGINS   optional, comma-separated extra origins allowed to
 *                         receive the token (e.g. a Netlify deploy preview URL)
 *
 * GitHub OAuth app callback URL: https://thebluffline.org/api/auth/callback
 *
 * Access is still enforced by GitHub: a signed-in user can only commit if
 * their GitHub account has write access to the repository.
 */

import { randomBytes } from 'node:crypto';

const SITE_ORIGIN = 'https://thebluffline.org';
const SCOPE = 'repo,user';
const STATE_COOKIE = 'cms_oauth_state';

function allowedOrigins() {
  const extra = (process.env.CMS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [SITE_ORIGIN, 'http://localhost:4321', ...extra];
}

function parseCookie(header, name) {
  const match = (header || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function callbackUrl(event) {
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  return `https://${host}/api/auth/callback`;
}

/** HTML page that hands the result back to the CMS window that opened it. */
function resultPage(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const origins = JSON.stringify(allowedOrigins());
  const html = `<!doctype html><html><body><script>
(function () {
  var message = ${JSON.stringify(message)};
  var allowed = ${origins};
  function receive(e) {
    if (allowed.indexOf(e.origin) === -1) return;
    window.opener.postMessage(message, e.origin);
    window.removeEventListener('message', receive, false);
    window.close();
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script><p>Signing in&hellip;</p></body></html>`;
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': `${STATE_COOKIE}=; Max-Age=0; Path=/api/auth; Secure; HttpOnly; SameSite=Lax`,
    },
    body: html,
  };
}

function errorPage(message) {
  return resultPage('error', { message });
}

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return errorPage('CMS login is not configured (missing GitHub OAuth credentials).');
  }

  const isCallback = event.path.replace(/\/$/, '').endsWith('/callback');

  // Step 1: send the editor to GitHub.
  if (!isCallback) {
    const state = randomBytes(16).toString('hex');
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl(event),
      scope: SCOPE,
      state,
    });
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params}`,
        'Set-Cookie': `${STATE_COOKIE}=${state}; Max-Age=600; Path=/api/auth; Secure; HttpOnly; SameSite=Lax`,
        'Cache-Control': 'no-store',
      },
      body: '',
    };
  }

  // Step 2: GitHub sent the editor back with a code. Verify state, then swap it for a token.
  const { code, state, error_description: ghError } = event.queryStringParameters || {};
  if (ghError) return errorPage(ghError);

  const expected = parseCookie(event.headers.cookie, STATE_COOKIE);
  if (!code || !state || !expected || state !== expected) {
    return errorPage('Login failed: the sign-in session expired or did not match. Please try again.');
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl(event),
      }),
    });
    const data = await res.json();
    if (!data.access_token) {
      return errorPage(data.error_description || 'GitHub did not return an access token.');
    }
    return resultPage('success', { token: data.access_token, provider: 'github' });
  } catch (err) {
    console.error('cms-auth token exchange failed', err);
    return errorPage('Could not reach GitHub. Please try again.');
  }
};
