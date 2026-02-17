# Netlify Visual Editor + Astro + Git CMS audit (Bluffline)

## What this resolves

This branch resolves the conflict-prone Visual Editor changes into one consistent implementation:

- Astro/Stackbit dev server binds to an externally reachable host.
- Vite host checks allow known Netlify preview hostnames.
- Netlify runtime uses Node 18 (matching Stackbit config).

## Current expected configuration

1. `stackbit.config.ts`
   - `ssgName: "astro"`
   - `devCommand: "node_modules/.bin/astro dev --port {PORT} --host {HOSTNAME}"`

2. `package.json`
   - `dev` and `start` scripts use `astro dev --host 0.0.0.0`

3. `astro.config.mjs`
   - `vite.server.allowedHosts` explicitly includes:
     - `localhost`
     - `127.0.0.1`
     - `.netlify.app`
     - `.netlify.com`
     - `.netlify.live`

4. `netlify.toml`
   - `[build.environment] NODE_VERSION = "18"`

## Evidence from hosted preview logs

Your provided Netlify Visual Editor logs showed two key clues:

- Astro was launched via `npm run dev` and printed `Network use --host to expose`.
  - This means the runtime path that actually started Astro did not include `--host`.
- The runtime selected Node `v22.22.0`.
  - This drifted from the Stackbit config intent (`nodeVersion: "18"`).

These are now handled by forcing host binding in npm scripts and pinning Node version in `netlify.toml`.

## Validation checklist

- `npm run build` passes.
- `npm run dev` prints a Network URL (host exposed), not `use --host to expose`.
- Visual Editor can fetch `/` with a Netlify preview hostname without Vite host-block 403.
