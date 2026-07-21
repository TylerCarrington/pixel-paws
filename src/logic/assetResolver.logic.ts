/**
 * Asset Resolver Utility
 * Uses Vite's import.meta.glob to load all project assets eagerly at compile time,
 * guaranteeing working asset URLs in both Development mode and Production (GitHub Pages).
 */

const globImages = import.meta.glob([
  '../assets/**/*.{png,jpeg,jpg,webp,svg,gif}',
  '../styles/**/*.{png,jpeg,jpg,webp,svg,gif}',
  '../scenes/**/*.{png,jpeg,jpg,webp,svg,gif}'
], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

/**
 * Returns true if the path points to an image file or external image URL.
 */
export function isImageAsset(path: any): boolean {
  if (!path) return false;
  if (typeof path === 'object' && path !== null) return true;
  if (typeof path !== 'string') return false;
  if (path.startsWith('http:') || path.startsWith('https:') || path.startsWith('data:') || path.startsWith('blob:')) {
    return true;
  }
  return /\.(png|jpeg|jpg|webp|svg|gif)$/i.test(path);
}

/**
 * Given any path (e.g. './src/assets/images/items/apple-slice.png',
 * '/src/assets/images/items/bird-seed.png', 'items/carrot.png',
 * or filename 'apple-slice.png'), returns the Vite-resolved asset URL.
 * If path is an emoji or http URL, returns it as-is.
 */
export function getAssetUrl(path: any): string {
  if (!path) return '';

  // Handle ES module imports or objects with .default
  if (typeof path === 'object' && path !== null) {
    if (typeof path.default === 'string') return path.default;
    return String(path);
  }

  if (typeof path !== 'string') return String(path);

  // External URLs, data URIs, blob URIs
  if (path.startsWith('http:') || path.startsWith('https:') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  // If path is a single emoji or string without image extension, return as is
  if (!/\.(png|jpeg|jpg|webp|svg|gif)$/i.test(path)) {
    return path;
  }

  // Normalize path for matching
  // Strips leading './', '/', 'src/'
  const cleanPath = path
    .replace(/^\.?\//, '')
    .replace(/^src\//, '')
    .replace(/^assets\/images\//, '')
    .replace(/^assets\//, '');

  // Exact match on suffix or substring
  const matchKey = Object.keys(globImages).find(key => {
    return key.endsWith(cleanPath) || key.includes(cleanPath);
  });

  if (matchKey && globImages[matchKey]) {
    return globImages[matchKey];
  }

  // Fallback filename match
  const filename = path.split('/').pop();
  if (filename) {
    const filenameMatch = Object.keys(globImages).find(key => key.endsWith(filename));
    if (filenameMatch && globImages[filenameMatch]) {
      return globImages[filenameMatch];
    }
  }

  return path;
}

