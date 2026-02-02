#!/usr/bin/env node
/**
 * Generate a static map image for the index page using Mapbox Static Images API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmx1ZmZsaW5lIiwiYSI6ImNtbDU4cWx6cDAxODAzZXBzYXU0ZjVsODkifQ.EQ96tyAGq1SRs0PTaXgcag';
const STYLE = 'mapbox/light-v11';

// Load GeoJSON data
const scenicHighwayPath = path.join(__dirname, '../src/data/scenic-highway.json');
const planningCorridorPath = path.join(__dirname, '../src/data/planning-corridor.json');

const scenicHighway = JSON.parse(fs.readFileSync(scenicHighwayPath, 'utf-8'));
const planningCorridor = JSON.parse(fs.readFileSync(planningCorridorPath, 'utf-8'));

// Simplify coordinates (take every nth point to stay within URL limits)
function simplifyCoords(coords, nth = 3) {
  return coords.filter((_, i) => i % nth === 0 || i === coords.length - 1);
}

// Encode polyline for Mapbox Static API
// Format: lng,lat (note: Mapbox uses lng,lat order)
function encodePolyline(coords) {
  return coords.map(([lng, lat]) => `${lng.toFixed(4)},${lat.toFixed(4)}`).join(',');
}

// Get scenic highway coordinates
const highwayCoords = scenicHighway.features[0].geometry.coordinates;
const simplifiedHighway = simplifyCoords(highwayCoords, 4);

// Get planning corridor coordinates
const corridorCoords = planningCorridor.features[0].geometry.coordinates[0];
const simplifiedCorridor = simplifyCoords(corridorCoords, 5);

// Calculate bounding box with padding
function getBounds(coordsList) {
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  for (const coords of coordsList) {
    for (const [lng, lat] of coords) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }

  // Add padding (about 5%)
  const lngPad = (maxLng - minLng) * 0.05;
  const latPad = (maxLat - minLat) * 0.05;

  return {
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
    minLat: minLat - latPad,
    maxLat: maxLat + latPad
  };
}

const bounds = getBounds([simplifiedHighway, simplifiedCorridor]);

// Build overlay paths
// Planning corridor: semi-transparent green fill with darker stroke
// path-{strokeWidth}+{strokeColor}-{fillOpacity}+{fillColor}(polyline)
const corridorPath = `path-2+41521F-0.15+41521F(${encodePolyline(simplifiedCorridor)})`;

// Scenic highway: solid green line
const highwayPath = `path-4+41521F(${encodePolyline(simplifiedHighway)})`;

// Image dimensions (4:3 aspect ratio for index page)
const width = 800;
const height = 600;

// Build the URL with bounding box (auto-fit)
const bbox = `[${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}]`;

// Construct URL
const overlays = [corridorPath, highwayPath].join(',');
const url = `https://api.mapbox.com/styles/v1/${STYLE}/static/${overlays}/auto/${width}x${height}@2x?padding=20&access_token=${MAPBOX_TOKEN}`;

console.log('Generated URL length:', url.length);
console.log('\nFetching static map image...\n');

// Fetch and save the image
async function downloadImage() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, '../public/images/corridor-map-static.png');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, Buffer.from(buffer));
    console.log(`Static map saved to: ${outputPath}`);
    console.log(`Image size: ${Math.round(buffer.byteLength / 1024)}KB`);
  } catch (error) {
    console.error('Failed to download image:', error.message);
    process.exit(1);
  }
}

downloadImage();
