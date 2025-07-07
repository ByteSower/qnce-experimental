// Image assets for EchoGarden narratives
// Using public folder paths for static assets

export const EchoGardenAssets = {
  seedlingAwakening: '/assets/echogarden/EG-Thumbnail.png',
  sproutEmergence: '/assets/echogarden/EG-image2.png',
  buddingInsight: '/assets/echogarden/EG-image3.png',
  // Add more images here as needed - all should be in /public/assets/echogarden/
} as const;

export type EchoGardenAssetKey = keyof typeof EchoGardenAssets;
