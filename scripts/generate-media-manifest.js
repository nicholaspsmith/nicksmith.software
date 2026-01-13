#!/usr/bin/env node

/**
 * Generates manifest files for music and video files in public folders.
 * Run this script before build to update the media lists.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

/**
 * Extract artist and title from filename
 * Expected format: "Artist - Title.ext" or just "Title.ext"
 */
function parseFilename(filename) {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  const parts = nameWithoutExt.split(' - ');

  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim(),
    };
  }

  return {
    artist: 'Unknown Artist',
    title: nameWithoutExt.trim(),
  };
}

/**
 * Scan directory for files with given extensions
 */
function scanDirectory(dir, extensions) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir);
  return files
    .filter(file => extensions.some(ext => file.toLowerCase().endsWith(ext)))
    .sort((a, b) => a.localeCompare(b));
}

// Scan music files
const musicDir = path.join(rootDir, 'public/music');
const musicFiles = scanDirectory(musicDir, ['.mp3', '.m4a', '.wav', '.ogg']);
const musicManifest = musicFiles.map((filename, index) => {
  const { artist, title } = parseFilename(filename);
  return {
    id: `music-${index + 1}`,
    filename,
    title,
    artist,
    src: `/music/${filename}`,
  };
});

// Scan video files
const videoDir = path.join(rootDir, 'public/videos');
const videoFiles = scanDirectory(videoDir, ['.mp4', '.webm', '.mov', '.m4v']);
const videoManifest = videoFiles.map((filename, index) => {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  return {
    id: `video-${index + 1}`,
    filename,
    title: nameWithoutExt,
    src: `/videos/${filename}`,
  };
});

// Write manifests
const outputDir = path.join(rootDir, 'src/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'music-manifest.json'),
  JSON.stringify(musicManifest, null, 2)
);
console.log(`Generated music manifest: ${musicManifest.length} tracks`);

fs.writeFileSync(
  path.join(outputDir, 'video-manifest.json'),
  JSON.stringify(videoManifest, null, 2)
);
console.log(`Generated video manifest: ${videoManifest.length} videos`);
