import { appConfig } from "@/config/app";

// ---------------------------------------------------------------------------
// Spacing presets
// ---------------------------------------------------------------------------
export const SPACING_PRESETS = {
  compact: { NONE: 0, XXS: 1, XS: 2, SM: 4, MD: 8, LG: 16, XL: 24, XXL: 32 },
  default: { NONE: 0, XXS: 1, XS: 4, SM: 8, MD: 16, LG: 32, XL: 48, XXL: 64 },
  spacious: {
    NONE: 0,
    XXS: 2,
    XS: 6,
    SM: 12,
    MD: 24,
    LG: 48,
    XL: 64,
    XXL: 96,
  },
} as const;

// ---------------------------------------------------------------------------
// Border-radius presets
// ---------------------------------------------------------------------------
export const BORDER_RADIUS_PRESETS = {
  none: { NONE: 0, SM: 0, MD: 0, LG: 0, FULL: 0 },
  small: { NONE: 0, SM: 4, MD: 8, LG: 12, FULL: 9999 },
  medium: { NONE: 0, SM: 8, MD: 16, LG: 24, FULL: 9999 },
  large: { NONE: 0, SM: 12, MD: 24, LG: 32, FULL: 9999 },
} as const;

// ---------------------------------------------------------------------------
// Border-width presets
// ---------------------------------------------------------------------------
export const BORDER_WIDTH_PRESETS = {
  none: { NONE: 0, THIN: 0, MEDIUM: 0, THICK: 0 },
  thin: { NONE: 0, THIN: 1, MEDIUM: 2, THICK: 3 },
  medium: { NONE: 0, THIN: 2, MEDIUM: 3, THICK: 4 },
  thick: { NONE: 0, THIN: 3, MEDIUM: 4, THICK: 5 },
} as const;

// ---------------------------------------------------------------------------
// Preset name types
// ---------------------------------------------------------------------------
export type SpacingPreset = keyof typeof SPACING_PRESETS;
export type BorderRadiusPreset = keyof typeof BORDER_RADIUS_PRESETS;
export type BorderWidthPreset = keyof typeof BORDER_WIDTH_PRESETS;

// ---------------------------------------------------------------------------
// Static tokens resolved from appConfig defaults.
// Use these ONLY in non-component code (stylesheets, constants, helpers).
// Inside components, prefer the context values from AppSettingsContext
// so user runtime overrides are respected.
// ---------------------------------------------------------------------------
export const SPACING = SPACING_PRESETS[appConfig.theme.spacing];
export const BORDER_RADIUS = BORDER_RADIUS_PRESETS[appConfig.theme.borderRadius];
export const BORDER_WIDTH = BORDER_WIDTH_PRESETS[appConfig.theme.borderWidth];
