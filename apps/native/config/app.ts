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

const APP_NAME = "WorldPray";

export const appConfig = {
  // Identity — only `name` and `bundleId` need to be set manually.
  // `slug` is derived from `name`.
  name: APP_NAME,
  slug: toSlug(APP_NAME),
  bundleId: "llabs.timegrid.app",
  description: "World Clock",
  contactEmail: "contact@logestalabs.com",

  // Theme
  theme: {
    // Developer customizes these — hex values, dead simple
    brand: {
      primary: { light: "#3444A0", dark: "#A3B1F7" }, // Twilight blue
      onPrimary: { light: "#FFFFFF", dark: "#10163A" },
      accent: { light: "#C9800F", dark: "#F2B544" }, // Candlelight gold
      onAccent: { light: "#2B1A00", dark: "#2B1A00" },
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

  // Prayer domain rules — see PRODUCT.md § 10, § 12, § 27
  prayer: {
    maxConcurrentCommitments: 5,
    reminderLeadMinutes: 15,
  },

  // Support the Mission — PRODUCT.md § 4
  support: {
    enabled: true,
    backgroundImage: "",
  },

  // Monetization — optional contributions only, never a gate on prayer.
  monetization: {
    // Test store key — create a project at revenuecat.com and paste your test key here.
    // Same key for iOS and Android. See docs/REVENUECAT.md for setup instructions.
    revenueCatApiKeyTestStore: {
      ios: "test_rfgBkAEDCaKHhKUBNDBsapClBux",
      android: "test_rfgBkAEDCaKHhKUBNDBsapClBux",
    },
    // Production keys — required for App Store / Play Store builds.
    revenueCatApiKey: {
      ios: "appl_LfAysaBZTUZYcfIjOpQkSpFXUiN",
      android: "goog_XABuzQaTFsTGJdGtjAIazgBbgPn",
    },
    entitlements: ["worldpray_pro"],
  },

  // Feature Flags
  features: {
    support: true,
  },

  // Onboarding — PRODUCT.md § 5
  onboarding: {
    enabled: true,
  },

  // Internationalization — see docs/I18N.md
  i18n: {
    enabled: true,
    defaultLanguage: "device",
    fallbackLanguage: "en",
    supportedLanguages: ["en", "es", "fr"],
  },

  // Links
  links: {
    // Shared by "Share This App" until the app has a store URL.
    website: "https://worldpray.app",
    privacyPolicy: "https://worldpray.app/privacy",
    termsOfService: "https://worldpray.app/terms",
    support: "mailto:hello@worldpray.app",
  },
} as const satisfies AppConfig;
