import sharp from 'sharp';
import exifReader from 'exif-reader';
import fs from 'node:fs';
import path from 'node:path';

export interface MediaMetadata {
  title: string;
  description: string;
  credit: string;
  copyright: string;
  date: string;
  dimensions: string;
  format: string;
  size: string;
  width: number;
  height: number;
  src: string;
  type: 'image' | 'video' | 'audio';
  videoType?: string;
  audioType?: string;
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format filename to title case (fallback when no metadata)
 */
function formatFilenameAsTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize words
}

/**
 * Get format string from file extension
 */
function getFormatFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toUpperCase() || '';
  if (ext === 'JPG') return 'JPEG';
  return ext;
}

/**
 * Parse IPTC buffer to extract metadata
 * IPTC-IIM format: https://www.iptc.org/std/IIM/4.2/specification/IIMV4.2.pdf
 */
function parseIptc(buffer: Buffer): {
  title?: string;
  description?: string;
  credit?: string;
  copyright?: string;
  date?: string;
} {
  const result: {
    title?: string;
    description?: string;
    credit?: string;
    copyright?: string;
    date?: string;
  } = {};

  try {
    let offset = 0;
    while (offset < buffer.length) {
      // IPTC marker
      if (buffer[offset] !== 0x1c) {
        offset++;
        continue;
      }

      const record = buffer[offset + 1];
      const dataset = buffer[offset + 2];
      const length = buffer.readUInt16BE(offset + 3);
      const value = buffer.slice(offset + 5, offset + 5 + length).toString('utf8');

      // Record 2 contains application-specific data
      if (record === 2) {
        switch (dataset) {
          case 5: // Object Name (Title)
            result.title = value;
            break;
          case 55: // Date Created
            if (value.length === 8) {
              result.date = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
            }
            break;
          case 80: // By-line (Photographer/Creator)
            result.credit = value;
            break;
          case 116: // Copyright Notice
            result.copyright = value;
            break;
          case 120: // Caption/Abstract
            result.description = value;
            break;
        }
      }

      offset += 5 + length;
    }
  } catch {
    // Ignore parsing errors
  }

  return result;
}

/**
 * Extract metadata from an image file
 */
export async function extractImageMetadata(
  filePath: string,
  publicUrl: string
): Promise<MediaMetadata> {
  const filename = path.basename(filePath);
  const stats = fs.statSync(filePath);

  // Default metadata from filename
  let metadata: MediaMetadata = {
    title: formatFilenameAsTitle(filename),
    description: '',
    credit: '',
    copyright: '',
    date: '',
    dimensions: '',
    format: getFormatFromExtension(filename),
    size: formatFileSize(stats.size),
    width: 0,
    height: 0,
    src: publicUrl,
    type: 'image',
  };

  try {
    const image = sharp(filePath);
    const sharpMeta = await image.metadata();

    // Update dimensions
    if (sharpMeta.width && sharpMeta.height) {
      metadata.width = sharpMeta.width;
      metadata.height = sharpMeta.height;
      metadata.dimensions = `${sharpMeta.width} × ${sharpMeta.height}`;
    }

    // Update format
    if (sharpMeta.format) {
      metadata.format = sharpMeta.format.toUpperCase();
      if (metadata.format === 'JPEG') metadata.format = 'JPEG';
    }

    // Parse EXIF metadata
    if (sharpMeta.exif) {
      try {
        const exif = exifReader(sharpMeta.exif);

        // Get title from various EXIF fields
        if (exif.Image?.ImageDescription) {
          metadata.description = String(exif.Image.ImageDescription);
        }

        // Get date from EXIF
        if (exif.Photo?.DateTimeOriginal) {
          const date = exif.Photo.DateTimeOriginal;
          if (date instanceof Date) {
            metadata.date = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          }
        } else if (exif.Image?.DateTime) {
          const date = exif.Image.DateTime;
          if (date instanceof Date) {
            metadata.date = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          }
        }

        // Get copyright from EXIF
        if (exif.Image?.Copyright) {
          metadata.copyright = String(exif.Image.Copyright);
        }

        // Get artist/credit from EXIF
        if (exif.Image?.Artist) {
          metadata.credit = String(exif.Image.Artist);
        }
      } catch {
        // EXIF parsing failed, continue with defaults
      }
    }

    // Parse IPTC metadata (more common for press photos)
    if (sharpMeta.iptc) {
      const iptc = parseIptc(sharpMeta.iptc);

      // IPTC takes precedence over EXIF for these fields
      if (iptc.title) metadata.title = iptc.title;
      if (iptc.description) metadata.description = iptc.description;
      if (iptc.credit) metadata.credit = iptc.credit;
      if (iptc.copyright) metadata.copyright = iptc.copyright;
      if (iptc.date) {
        // Format IPTC date
        const d = new Date(iptc.date);
        if (!isNaN(d.getTime())) {
          metadata.date = d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      }
    }
  } catch {
    // Sharp processing failed, return defaults
  }

  return metadata;
}

/**
 * Extract metadata from a video file
 * Note: Video metadata extraction is limited without ffprobe
 */
export async function extractVideoMetadata(
  filePath: string,
  publicUrl: string
): Promise<MediaMetadata> {
  const filename = path.basename(filePath);
  const stats = fs.statSync(filePath);
  const ext = filename.split('.').pop()?.toLowerCase();

  return {
    title: formatFilenameAsTitle(filename),
    description: '',
    credit: '',
    copyright: '',
    date: '',
    dimensions: '',
    format: getFormatFromExtension(filename),
    size: formatFileSize(stats.size),
    width: 0,
    height: 0,
    src: publicUrl,
    type: 'video',
    videoType: ext === 'webm' ? 'video/webm' : ext === 'mov' ? 'video/quicktime' : 'video/mp4',
  };
}

/**
 * Extract metadata from an audio file
 * Note: Audio metadata extraction is limited without specialized libraries
 */
export async function extractAudioMetadata(
  filePath: string,
  publicUrl: string
): Promise<MediaMetadata> {
  const filename = path.basename(filePath);
  const stats = fs.statSync(filePath);
  const ext = filename.split('.').pop()?.toLowerCase();

  // Map extensions to MIME types
  const audioTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac',
  };

  return {
    title: formatFilenameAsTitle(filename),
    description: '',
    credit: '',
    copyright: '',
    date: '',
    dimensions: '',
    format: getFormatFromExtension(filename),
    size: formatFileSize(stats.size),
    width: 0,
    height: 0,
    src: publicUrl,
    type: 'audio',
    audioType: audioTypes[ext || ''] || 'audio/mpeg',
  };
}

/**
 * Get all media assets from a directory with their metadata
 */
export async function getMediaAssetsFromDirectory(
  directory: string,
  publicBasePath: string,
  type: 'image' | 'video' | 'audio' = 'image'
): Promise<MediaMetadata[]> {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory);
  const mediaFiles = files.filter((f: string) => {
    if (type === 'image') {
      return /\.(png|jpg|jpeg|svg|webp)$/i.test(f);
    }
    if (type === 'video') {
      return /\.(mp4|webm|mov)$/i.test(f);
    }
    return /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(f);
  });

  const assets = await Promise.all(
    mediaFiles.map(async (filename: string) => {
      const filePath = path.join(directory, filename);
      const publicUrl = `${publicBasePath}/${filename}`;

      if (type === 'video') {
        return extractVideoMetadata(filePath, publicUrl);
      }
      if (type === 'audio') {
        return extractAudioMetadata(filePath, publicUrl);
      }
      return extractImageMetadata(filePath, publicUrl);
    })
  );

  return assets;
}
