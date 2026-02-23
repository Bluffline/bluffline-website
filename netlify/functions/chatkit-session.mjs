/**
 * Netlify Function: chatkit-session
 * Routed via netlify.toml to /api/chatkit/session
 *
 * Creates an OpenAI ChatKit session for the current visitor.
 * Reads or generates a UUID stored in the bluffline_user_id cookie so that
 * conversation history persists across visits without requiring authentication.
 */

const COOKIE_NAME = 'bluffline_user_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Parse a single named cookie from a Cookie header string.
 * @param {string} cookieHeader
 * @param {string} name
 * @returns {string|null}
 */
function parseCookie(cookieHeader, name) {
  const pattern = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`);
  const match = cookieHeader.match(pattern);
  return match ? decodeURIComponent(match[1]) : null;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const workflowId = process.env.OPENAI_WORKFLOW_ID;

  if (!apiKey || !workflowId) {
    console.error('[chatkit-session] Missing OPENAI_API_KEY or OPENAI_WORKFLOW_ID');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server misconfiguration' }),
    };
  }

  // Read or mint a persistent user identifier
  const cookieHeader = event.headers.cookie || '';
  const existingUserId = parseCookie(cookieHeader, COOKIE_NAME);
  const userId = existingUserId || crypto.randomUUID();

  // Call the OpenAI ChatKit Sessions API
  let session;
  try {
    const res = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        user: userId,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[chatkit-session] OpenAI error ${res.status}:`, text);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to create ChatKit session' }),
      };
    }

    session = await res.json();
  } catch (err) {
    console.error('[chatkit-session] Fetch failed:', err);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Network error' }),
    };
  }

  const responseHeaders = { 'Content-Type': 'application/json' };

  // Set cookie only when we just minted a new user ID
  if (!existingUserId) {
    responseHeaders['Set-Cookie'] =
      `${COOKIE_NAME}=${userId}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure; HttpOnly`;
  }

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({ client_secret: session.client_secret }),
  };
};
