import { getAssetUrl } from './assetResolver.logic';

export function getBackgroundSrc(filename: string): string {
  if (!filename) return '';
  if (filename.includes('/')) return getAssetUrl(filename);
  return getAssetUrl(`backgrounds/${filename}`);
}

