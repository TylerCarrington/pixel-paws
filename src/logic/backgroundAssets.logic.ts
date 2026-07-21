export const backgroundImages = import.meta.glob('../assets/images/backgrounds/*.+(png|jpeg|jpg)', { eager: true, as: 'url' }) as Record<string, string>;

export function getBackgroundSrc(filename: string): string {
  const path = `../assets/images/backgrounds/${filename}`;
  const match = Object.keys(backgroundImages).find(key => key.endsWith(path.replace('..', '')));
  return match ? backgroundImages[match] : `./src/assets/images/backgrounds/${filename}`;
}
