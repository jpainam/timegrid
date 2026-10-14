import type { AppConfig } from "./app.types";

/**
 * Derives a URL-safe slug from a display name.
 * "My Cool App" → "my-cool-app"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const APP_NAME = "TimeGrid";

export const appConfig = {
  // Identity — only `name` and `bundleId` need to be set manually.
  // `slug` is derived from `name`.
  name: APP_NAME,
  slug: toSlug(APP_NAME),
  bundleId: "llabs.timegrid.app",
  description: "Scroll and compare time zones on one timeline.",
  contactEmail: "contact@logestalabs.com",

  // Theme
  theme: {
    // Developer customizes these — hex values, dead simple
    brand: {
      primary: { light: "#165E9C", dark: "#AED5FF" },
      onPrimary: { light: "#FFFFFF", dark: "#102033" },
      accent: { light: "#165E9C", dark: "#AED5FF" },
      onAccent: { light: "#FFFFFF", dark: "#102033" },
      useAndroidDynamic: true,
    },
    // Native by default, optional hex override
    system: {
      background: "native",
      secondaryBackground: "native",
      text: "native",
      secondaryText: "native",
      separator: "native",
      link: "native",
    },

    // Pick a preset — the entire app adapts
    spacing: "default",
    borderRadius: "large",
    borderWidth: "none",
  },

  i18n: {
    enabled: true,
    defaultLanguage: "device",
    fallbackLanguage: "en",
    supportedLanguages: ["en", "es", "fr"],
  },

  prayer: {
    maxConcurrentCommitments: 5,
  },

} as const satisfies AppConfig;
