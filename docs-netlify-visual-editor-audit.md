# Netlify Visual Editor + Astro + GitHub CMS Audit (Bluffline)

## Scope and method

This audit compares:

1. The expected baseline for Netlify Visual Editor with Astro and Git-backed content sources.
2. The implementation currently in this repository.
3. Runtime behavior reproduced locally.

I attempted to pull the official docs from:

- https://docs.netlify.com/manage/visual-editor/get-started/get-started-overview/

but requests from this environment return HTTP 403, so this audit is based on:

- Current Stackbit/Netlify Visual Editor conventions.
- The installed Stackbit type definitions in this repo dependencies.
- Reproduced local runtime behavior and host-check failures.

## First-principles implementation model

For Astro + Netlify Visual Editor + GitHub-only CMS, the setup should satisfy all of the following:

1. **Stackbit config should use Astro mode or a correct custom dev command**
   - Use `ssgName: "astro"` (preferred) or `"custom"` with complete and correct `devCommand`.
   - `devCommand` must include both placeholders:
     - `{PORT}`
     - `{HOSTNAME}`

2. **Dev server host binding must be external, not localhost-only**
   - Visual Editor runs outside your process and needs to connect to the preview server.
   - Binding to `127.0.0.1` only can prevent the Visual Editor reverse proxy from connecting.

3. **Vite host check must allow dynamic preview hostnames**
   - Netlify/Stackbit preview hostnames are often dynamic.
   - If Vite `server.allowedHosts` excludes them, Astro returns **HTTP 403** (“host not allowed”).
   - In a Visual Editor flow, this can surface as a proxy-side 502/Bad Gateway.

4. **Content source model mapping must match repository structure**
   - `GitContentSource` file paths and URL paths must align with real content files.
   - `data-sb-object-id` and `data-sb-field-path` annotations should point to valid files/fields.

5. **Preview server startup detection needs valid readiness signals**
   - If using custom SSG mode, log pattern/route passthrough must accurately reflect Astro dev output and HMR paths.

## What was failing in this repo

### 1) `devCommand` used `--hostname 127.0.0.1`

Previous value:

- `node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1`

Why this is risky:

- It ignores `{HOSTNAME}`, contrary to Stackbit config contract.
- It hard-binds to localhost and may block external proxy access from Visual Editor infrastructure.

### 2) Vite host allowlist was too narrow

Previous `astro.config.mjs`:

- `allowedHosts: ['.netlify.app', '.netlify.com']`

Reproduced failure:

- Running Astro and requesting with a dynamic host header produced:
  - HTTP 403
  - “Blocked request. This host ("test-preview.netlify.live") is not allowed.”

This is a concrete, reproducible root-cause candidate for your Visual Editor 502 symptoms.

### 3) Over-customized `experimental.ssg` block in Stackbit config

The previous config had custom `experimental.ssg` route passthrough/directRoutes/logPatterns.

Potential issue:

- These can drift from Astro/Stackbit defaults and break proxy behavior if not exact.
- Using `ssgName: "astro"` is usually safer and better maintained.

## Changes applied

1. Switched Stackbit framework identity from custom to Astro:
   - `ssgName: "astro"`

2. Updated Stackbit dev command to use Stackbit tokens correctly:
   - `node_modules/.bin/astro dev --port {PORT} --host {HOSTNAME}`

3. Removed custom `experimental.ssg` overrides to reduce mismatch risk.

4. Relaxed Vite host checks for dev/preview interoperability:
   - `allowedHosts: true`

## Validation run after changes

- Build passes.
- Astro dev server serves requests successfully with arbitrary preview host header.
- Reproduced host-check failure is resolved (403 -> 200).

## Recommendations for Netlify UI/project settings (outside code)

1. Confirm Visual Editor site connection points to this repo and branch.
2. Confirm GitHub App permissions allow content writeback.
3. Confirm Node version in Netlify matches project (`18`+).
4. Confirm Visual Editor preview command/environment does not override stackbit settings with conflicting values.
5. If using restrictive CSP/frame headers, verify preview embedding is allowed for current Netlify domains.

## If 502 persists after this patch

Capture and compare these three signals:

1. **Preview process logs**
   - Ensure Astro reports ready state and no startup crash.
2. **Proxy request host**
   - Inspect incoming `Host` header to verify whether it’s now accepted.
3. **Netlify Visual Editor diagnostics**
   - Check preview URL and branch mapping in Netlify project settings.

The highest-probability root cause identified in this audit is the host validation chain (`127.0.0.1` binding + restrictive `allowedHosts`), which is now corrected.
