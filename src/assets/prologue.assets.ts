// Generate simple SVG placeholders encoded as data URIs
const svgSquare = (color: string, text: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="${color}"/><text x="160" y="90" font-family="monospace" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
  // Simple base64 encode for browser usage
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const PROLOGUE_ASSETS: Record<string, string> = {
  prologue_art_1: svgSquare('#2c3e50', 'Panel 1: Arriving in town'),
  prologue_art_2: svgSquare('#27ae60', 'Panel 2: The old cottage'),
  prologue_art_3: svgSquare('#8e44ad', 'Panel 3: Rustling bushes'),
  prologue_art_4: svgSquare('#7f8c8d', 'Panel 4: Muddy blob with eyes'),
};
