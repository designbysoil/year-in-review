/**
 * QF Year in Review - Theme Color Configurations
 * 
 * Colors are RGB normalized (0-1 range)
 * Each theme has 3 colors: [top, middle, bottom]
 */

export const THEMES = {
  ai: {
    name: 'Artificial Intelligence',
    colors: [
      [0.102, 0.643, 0.667],  // Teal/Cyan - top
      [0.498, 0.592, 0.467],  // Sage - middle
      [0.620, 0.639, 0.486],  // Olive-sage - bottom
    ],
  },
  precisionHealth: {
    name: 'Precision Health',
    colors: [
      [0.690, 0.459, 0.494],  // Dusty rose - top
      [0.796, 0.682, 0.635],  // Warm sand - middle
      [0.545, 0.678, 0.651],  // Soft teal - bottom
    ],
  },
  progressiveEducation: {
    name: 'Progressive Education',
    colors: [
      [0.949, 0.839, 0.584],  // Warm gold - top
      [0.847, 0.718, 0.502],  // Amber - middle
      [0.365, 0.510, 0.455],  // Deep sage - bottom
    ],
  },
  socialProgress: {
    name: 'Social Progress',
    colors: [
      [0.820, 0.639, 0.494],  // Terracotta - top
      [0.718, 0.549, 0.451],  // Clay - middle
      [0.314, 0.451, 0.463],  // Steel blue - bottom
    ],
  },
  sustainability: {
    name: 'Sustainability',
    colors: [
      [0.298, 0.502, 0.431],  // Forest green - top
      [0.467, 0.576, 0.467],  // Moss - middle
      [0.627, 0.667, 0.533],  // Lichen - bottom
    ],
  },
};

export default THEMES;
