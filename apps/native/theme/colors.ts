import { appConfig } from "@/config/app";
import type { BrandColor } from "@/config/app.types";
import { AppSettingsContext } from "@/context/AppSettings";
import { Color } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from "expo-router/react-navigation";
import { use } from "react";
import { type ColorValue, Platform, useColorScheme } from "react-native";

type SystemColorKey = keyof typeof appConfig.theme.system;
export type SystemColors = { [K in SystemColorKey]: string };

function getNativeDefault(key: SystemColorKey): ColorValue {
  const defaults: Record<SystemColorKey, ColorValue> = Platform.select({
    ios: {
      background: Color.ios.systemBackground,
      secondaryBackground: Color.ios.secondarySystemBackground,
      text: Color.ios.label,
      secondaryText: Color.ios.secondaryLabel,
      separator: Color.ios.separator,
      link: Color.ios.link,
    },
    android: {
      background: Color.android.dynamic.surfaceContainerHighest,
      secondaryBackground: Color.android.dynamic.surfaceContainer,
      text: Color.android.dynamic.onSurface,
      secondaryText: Color.android.dynamic.onSurfaceVariant,
      separator: Color.android.dynamic.outlineVariant,
      link: Color.android.dynamic.primary,
    },
    default: {
      background: "#FFFFFF",
      secondaryBackground: "#F2F2F7",
      text: "#000000",
      secondaryText: "#666666",
      separator: "#E0E0E0",
      link: "#007AFF",
    },
  })!;
  return defaults[key];
}

export function getSystemColor(key: SystemColorKey): ColorValue {
  const value = appConfig.theme.system[key];
  return value === "native" ? getNativeDefault(key) : value;
}

/**
 * Resolves all system colors. Accepts colorScheme so React Compiler
 * sees the dependency and recomputes when the theme changes.
 */
function resolveSystemColors(
  _colorScheme: string | null | undefined,
): SystemColors {
  return {
    background: getSystemColor("background") as string,
    secondaryBackground: getSystemColor("secondaryBackground") as string,
    text: getSystemColor("text") as string,
    secondaryText: getSystemColor("secondaryText") as string,
    separator: getSystemColor("separator") as string,
    link: getSystemColor("link") as string,
  };
}

/**
 * Returns all system colors, reactive to dark/light theme changes.
 * Safe with React Compiler — just destructure and use.
 */
export function useSystemColors(): SystemColors {
  const colorScheme = useColorScheme();
  return resolveSystemColors(colorScheme);
}

/**
 * The "LIVE" badge and dot. A fixed red rather than a platform color: it
 * sits on artwork scrims and inside pills, where it must read the same in
 * both modes on both platforms.
 */
export const LIVE_COLOR = "#FF3B30";

/** Hearts are always the platform's red, following the social "like" convention. */
export const HEART_COLOR = Platform.select({
  ios: Color.ios.systemRed,
  android: Color.android.dynamic.error,
  default: "#FF3B30",
}) as unknown as string;

/** Actions that can't be undone, e.g. Delete in a menu. */
export const DESTRUCTIVE_COLOR = HEART_COLOR;

// ---------------------------------------------------------------------------
// Brand colors — support plain hex or { light, dark } per-mode values.
// On Android, dynamic Material You colors can replace the hardcoded hex
// when `appConfig.theme.brand.useAndroidDynamic` is true (the default).
// ---------------------------------------------------------------------------

export const isAndroidDynamic =
  Platform.OS === "android" &&
  (appConfig.theme.brand.useAndroidDynamic as boolean | undefined) !== false;

export type ResolvedBrand = {
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
};

/**
 * Accepts colorScheme so React Compiler sees the dependency
 * and recomputes when the theme changes (same pattern as resolveSystemColors).
 */
function getAndroidDynamicBrand(
  _colorScheme: string | null | undefined,
): ResolvedBrand {
  return {
    primary: Color.android.dynamic.primary as unknown as string,
    onPrimary: Color.android.dynamic.onPrimary as unknown as string,
    accent: Color.android.dynamic.secondary as unknown as string,
    onAccent: Color.android.dynamic.onSecondary as unknown as string,
  };
}

export function resolveBrandColor(value: BrandColor, dark: boolean): string {
  return typeof value === "string" ? value : dark ? value.dark : value.light;
}

export function getBrandColors(dark: boolean): ResolvedBrand {
  if (isAndroidDynamic) return getAndroidDynamicBrand(dark ? "dark" : "light");
  const b = appConfig.theme.brand;
  return {
    primary: resolveBrandColor(b.primary, dark),
    onPrimary: resolveBrandColor(b.onPrimary, dark),
    accent: resolveBrandColor(b.accent, dark),
    onAccent: resolveBrandColor(b.onAccent, dark),
  };
}

/**
 * Returns brand colors resolved for the current color scheme,
 * using persisted brand-primary overrides from AppSettings.
 * When Android dynamic colors are active, returns Material You tokens instead.
 */
export function useBrandColors(): ResolvedBrand {
  const colorScheme = useColorScheme();
  const { settings } = use(AppSettingsContext);
  const dark = colorScheme === "dark";

  if (isAndroidDynamic) return getAndroidDynamicBrand(colorScheme);

  const b = appConfig.theme.brand;
  return {
    primary: dark ? settings.brandPrimaryDark : settings.brandPrimaryLight,
    onPrimary: resolveBrandColor(b.onPrimary, dark),
    accent: resolveBrandColor(b.accent, dark),
    onAccent: resolveBrandColor(b.onAccent, dark),
  };
}

/**
 * Static brand values resolved to light mode.
 * Prefer `useBrandColors()` in components for dark mode support.
 */
export const brand = getBrandColors(false);

export function getNavigationTheme(
  dark: boolean,
  primaryOverride?: string,
): Theme {
  const base = dark ? DarkTheme : DefaultTheme;
  const brandColors = getBrandColors(dark);
  const primary = primaryOverride ?? brandColors.primary;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary,
      background: getSystemColor("background") as string,
      card: getSystemColor("secondaryBackground") as string,
      text: getSystemColor("text") as string,
      border: getSystemColor("separator") as string,
      notification: primary,
    },
  };
}

// ---------------------------------------------------------------------------
// Icon tints — the colored fills behind the white glyphs in `FormRow`,
// `IconTile` and category icons.
// ---------------------------------------------------------------------------

export type IconTint =
  | "blue"
  | "brown"
  | "gray"
  | "green"
  | "indigo"
  | "mint"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "teal"
  | "yellow";

/**
 * iOS gets the live system palette, so the fills follow dark mode and the
 * contrast settings. Everywhere else `Color.ios.*` resolves to `null` — which
 * silently drops the tile and leaves a white glyph on a white card — so fall
 * back to the matching hex values.
 */
export const TINT = Platform.select({
  ios: {
    blue: Color.ios.systemBlue,
    brown: Color.ios.systemBrown,
    gray: Color.ios.systemGray,
    green: Color.ios.systemGreen,
    indigo: Color.ios.systemIndigo,
    mint: Color.ios.systemMint,
    orange: Color.ios.systemOrange,
    pink: Color.ios.systemPink,
    purple: Color.ios.systemPurple,
    red: Color.ios.systemRed,
    teal: Color.ios.systemTeal,
    yellow: Color.ios.systemYellow,
  },
  default: {
    blue: "#007AFF",
    brown: "#A2845E",
    gray: "#8E8E93",
    green: "#34C759",
    indigo: "#5856D6",
    mint: "#00C7BE",
    orange: "#FF9500",
    pink: "#FF2D55",
    purple: "#AF52DE",
    red: "#FF3B30",
    teal: "#30B0C7",
    yellow: "#E6B400",
  },
}) as Record<IconTint, ColorValue>;
