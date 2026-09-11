#!/usr/bin/env node
// Checks every page against the surface rules in README > Design System:
//   1. Adjacent sections must not both be near-white, and must not share the same tint.
//   2. Card components must sit on a tinted section (--mist / --cream), never near-white.
// Exits non-zero when a violation is found.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TOKENS = [
  ['--mist', 'mist'],
  ['--cream', 'cream'],
  ['--warm-white', 'warm-white'],
  ['--navy', 'navy'],
  ['--forest', 'forest'],
  ['white', 'white'],
];
const NEAR_WHITE = new Set(['warm-white', 'white', 'inherit']);
const TINTS = new Set(['mist', 'cream']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.astro')) out.push(p);
  }
  return out.sort();
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function backgroundFor(classes, style) {
  for (const cls of classes) {
    if (cls === 'section') continue;
    const rule = style.match(new RegExp(`(?<![\\w-])\\.${escapeRegExp(cls)}\\s*\\{([^}]*)\\}`));
    if (!rule) continue;
    const bg = rule[1].match(/background(?:-color)?:\s*([^;]+);/);
    if (!bg) continue;
    const token = TOKENS.find(([needle]) => bg[1].includes(needle));
    return token ? token[1] : 'other';
  }
  return 'inherit';
}

const violations = [];

for (const path of walk('src/pages')) {
  const src = readFileSync(path, 'utf8');
  const style = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  const body = src.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
  const tags = [...body.matchAll(/<section\s+class(?::list)?=\{?\[?"?([^"\]}>]*)"?[^>]*>/g)];

  let prev = null;
  tags.forEach((tag, i) => {
    const classes = tag[1].replace(/'/g, '').replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    const name = classes.filter(c => c !== 'section').pop() ?? '?';
    const chunk = body.slice(tag.index + tag[0].length, i + 1 < tags.length ? tags[i + 1].index : undefined);
    let bg = backgroundFor(classes, style);
    if (bg === 'inherit') {
      // full-bleed sections often paint their first wrapper instead of the <section>
      const firstChild = chunk.match(/class="([^"]*)"/);
      if (firstChild) bg = backgroundFor(firstChild[1].split(/\s+/), style);
    }
    const cards = new Set([...chunk.matchAll(/<([A-Z]\w*Card\w*)\b/g)].map(m => m[1]));
    for (const m of chunk.matchAll(/class="([^"]*)"/g)) {
      for (const c of m[1].split(/\s+/)) {
        if (/card/.test(c) && !/-(grid|list|content|arrow)$/.test(c)) cards.add(`.${c}`);
      }
    }

    if (prev) {
      if (NEAR_WHITE.has(prev.bg) && NEAR_WHITE.has(bg)) {
        violations.push(`${path}: .${prev.name} (${prev.bg}) and .${name} (${bg}) are adjacent near-whites`);
      } else if (TINTS.has(prev.bg) && prev.bg === bg) {
        violations.push(`${path}: .${prev.name} and .${name} are adjacent sections with the same tint (${bg})`);
      }
    }
    if (cards.size && NEAR_WHITE.has(bg)) {
      violations.push(`${path}: .${name} (${bg}) holds cards on a near-white surface: ${[...cards].join(', ')}`);
    }
    prev = { name, bg };
  });
}

if (violations.length) {
  console.error(`Surface audit: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
console.log('Surface audit: no violations');
