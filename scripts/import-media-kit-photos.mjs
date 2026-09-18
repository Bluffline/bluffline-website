#!/usr/bin/env node
// Right-sizes a folder of original photos (e.g. a Google Drive download) for the
// Media Kit and writes them to public/media-kit/photos/.
//
//   npm run import:photos -- <source-dir> [options]
//
// Options:
//   --prefix <slug>        Output filename prefix (default: slug of the source folder name)
//   --credit <name>        Photographer / by-line, written to EXIF Artist (shown as "Credit")
//   --copyright <text>     EXIF Copyright (default: "© <year> Bluffline, Inc.")
//   --description <text>   Caption written to EXIF ImageDescription when the original has none
//   --date <YYYY-MM-DD>    Date written to EXIF DateTimeOriginal when the original has none
//   --max <px>             Longest edge in pixels (default: 2400)
//   --quality <1-100>      JPEG quality (default: 85)
//   --out <dir>            Output directory (default: public/media-kit/photos)
//   --start <n>            First sequence number (default: 1)
//   --append               Continue numbering after files already using this prefix
//   --force                Overwrite files that already exist (default: skip them)
//   --dry-run              Report what would be written without writing anything
//
// Originals stay wherever they live (Drive is the source of truth); only the
// web-sized JPEGs are committed. The Press page reads the embedded EXIF at build
// time, so credit, caption and date show up in the Media Kit automatically.

import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import sharp from 'sharp';
import exifReader from 'exif-reader';

const IMAGE_EXT = /\.(jpe?g|png|webp|tiff?|gif|avif)$/i;

function parseArgs(argv) {
  const opts = {
    max: 2400,
    quality: 85,
    out: 'public/media-kit/photos',
    force: false,
    dryRun: false,
  };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`Missing value for ${a}`);
      return v;
    };
    switch (a) {
      case '--prefix': opts.prefix = next(); break;
      case '--credit': opts.credit = next(); break;
      case '--copyright': opts.copyright = next(); break;
      case '--description': opts.description = next(); break;
      case '--date': opts.date = next(); break;
      case '--max': opts.max = Number(next()); break;
      case '--quality': opts.quality = Number(next()); break;
      case '--out': opts.out = next(); break;
      case '--start': opts.start = Number(next()); break;
      case '--append': opts.append = true; break;
      case '--force': opts.force = true; break;
      case '--dry-run': opts.dryRun = true; break;
      case '-h':
      case '--help': opts.help = true; break;
      default:
        if (a.startsWith('--')) throw new Error(`Unknown option ${a}`);
        positional.push(a);
    }
  }
  opts.source = positional[0];
  return opts;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function formatBytes(n) {
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function toExifDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`--date must be YYYY-MM-DD, got "${iso}"`);
  return `${m[1]}:${m[2]}:${m[3]} 12:00:00`;
}

async function readExif(file) {
  try {
    const meta = await sharp(file).metadata();
    if (!meta.exif) return {};
    const exif = exifReader(meta.exif);
    return {
      artist: exif.Image?.Artist ? String(exif.Image.Artist).trim() : '',
      description: exif.Image?.ImageDescription ? String(exif.Image.ImageDescription).trim() : '',
      copyright: exif.Image?.Copyright ? String(exif.Image.Copyright).trim() : '',
      hasDate: Boolean(exif.Photo?.DateTimeOriginal || exif.Image?.DateTime),
    };
  } catch {
    return {};
  }
}

function nextSequence(outDir, prefix) {
  if (!existsSync(outDir)) return 1;
  const re = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)\\.jpg$`);
  let max = 0;
  for (const f of readdirSync(outDir)) {
    const m = re.exec(f);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.source) {
    console.log('Usage: npm run import:photos -- <source-dir> [--prefix slug] [--credit name] [--description text] [--date YYYY-MM-DD] [--max 2400] [--quality 85] [--out dir] [--start n] [--append] [--force] [--dry-run]');
    process.exit(opts.help ? 0 : 1);
  }

  const source = resolve(opts.source);
  if (!existsSync(source) || !statSync(source).isDirectory()) {
    throw new Error(`Source folder not found: ${source}`);
  }

  const prefix = slugify(opts.prefix || basename(source));
  if (!prefix) throw new Error('Could not derive a filename prefix; pass --prefix');
  const outDir = resolve(opts.out);
  const copyright = opts.copyright ?? `© ${new Date().getFullYear()} Bluffline, Inc.`;
  const exifDate = opts.date ? toExifDate(opts.date) : undefined;

  const files = readdirSync(source)
    .filter(f => IMAGE_EXT.test(f) && !f.startsWith('.'))
    .sort(naturalCompare);
  if (files.length === 0) throw new Error(`No image files found in ${source}`);

  if (!opts.dryRun) mkdirSync(outDir, { recursive: true });

  let seq = opts.start ?? (opts.append ? nextSequence(outDir, prefix) : 1);
  const pad = Math.max(2, String(seq + files.length - 1).length);
  let totalIn = 0;
  let totalOut = 0;
  let written = 0;
  let skipped = 0;

  console.log(`${opts.dryRun ? '[dry run] ' : ''}Importing ${files.length} photo(s) from ${source}`);
  console.log(`  → ${outDir}/${prefix}-NN.jpg  (max ${opts.max}px, quality ${opts.quality})\n`);

  for (const file of files) {
    const input = join(source, file);
    const outName = `${prefix}-${String(seq).padStart(pad, '0')}.jpg`;
    const output = join(outDir, outName);
    seq += 1;

    const inSize = statSync(input).size;
    totalIn += inSize;

    if (existsSync(output) && !opts.force) {
      console.log(`  skip  ${file} → ${outName} (exists; use --force to overwrite)`);
      skipped += 1;
      continue;
    }

    const existing = await readExif(input);
    const ifd0 = {};
    if (opts.credit) ifd0.Artist = opts.credit;
    if (copyright && !existing.copyright) ifd0.Copyright = copyright;
    if (opts.description && !existing.description) ifd0.ImageDescription = opts.description;
    const ifd2 = {};
    if (exifDate && !existing.hasDate) ifd2.DateTimeOriginal = exifDate;

    let pipeline = sharp(input)
      .rotate() // bake in EXIF orientation
      .resize({ width: opts.max, height: opts.max, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: opts.quality, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .withMetadata(); // keep ICC profile + original EXIF (camera date, existing credits)
    if (Object.keys(ifd0).length || Object.keys(ifd2).length) {
      pipeline = pipeline.withExifMerge({
        ...(Object.keys(ifd0).length ? { IFD0: ifd0 } : {}),
        ...(Object.keys(ifd2).length ? { IFD2: ifd2 } : {}),
      });
    }

    if (opts.dryRun) {
      const meta = await sharp(input).metadata();
      const scale = Math.min(1, opts.max / Math.max(meta.width || 1, meta.height || 1));
      const w = Math.round((meta.width || 0) * scale);
      const h = Math.round((meta.height || 0) * scale);
      console.log(`  would write ${file} (${formatBytes(inSize)}, ${meta.width}×${meta.height}) → ${outName} (${w}×${h})`);
      continue;
    }

    const info = await pipeline.toFile(output);
    totalOut += info.size;
    written += 1;
    console.log(`  ${file} (${formatBytes(inSize)}) → ${outName} (${info.width}×${info.height}, ${formatBytes(info.size)})`);
  }

  if (!opts.dryRun) {
    console.log(`\nWrote ${written} file(s)${skipped ? `, skipped ${skipped}` : ''}: ${formatBytes(totalIn)} → ${formatBytes(totalOut)}`);
    console.log('Next: review the files, then commit public/media-kit/photos/. Captions and credits can be adjusted per file in src/data/media-kit-photos.json.');
  }
}

main().catch(err => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
