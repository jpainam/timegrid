type HexColor = `#${string}`;
export type BrandColor = HexColor | { light: HexColor; dark: HexColor };

export type AppConfig = {
  name: string;
  slug: string;
  bundleId: string;
  description: string;
  contactEmail: string;

  theme: {
    brand: {
      primary: BrandColor;
      onPrimary: BrandColor;
      accent: BrandColor;
      onAccent: BrandColor;
      /** Use Material You dynamic colors for brand tokens on Android (default: true) */
      useAndroidDynamic?: boolean;
    };
    system: Record<
      | "background"
      | "secondaryBackground"
      | "text"
      | "secondaryText"
      | "separator"
      | "link",
      "native" | HexColor
    >;
    spacing: "compact" | "default" | "spacious";
    borderRadius: "none" | "small" | "medium" | "large";
    borderWidth: "none" | "thin" | "medium" | "thick";
  };

  /**
   * Product rules for the prayer domain.
   * @see PRODUCT.md § 10, § 12, § 27
   */
  prayer: {
    /**
     * Maximum number of prayer sessions a member may commit to at the same
     * time. Enforced against overlapping *occurrences*, not total
     * subscriptions (PRODUCT.md § 27).
     */
    maxConcurrentCommitments: number;
    /** Minutes before a session at which the "prayer approaching" reminder fires. */
    reminderLeadMinutes: number;
  };

  /**
   * "Support the Mission" (PRODUCT.md § 4). Contributing is always optional —
   * prayer functionality must never be gated behind a purchase.
   */
  support: {
    enabled: boolean;
    /** Background image displayed behind the support screen. */
    backgroundImage: string;
  };

  monetization: {
    revenueCatApiKeyTestStore: { ios: string; android: string };
    revenueCatApiKey: { ios: string; android: string };
    /** Entitlements that mark a member as a supporter. */
    entitlements: readonly string[];
  };

  features: {
    /** Enables the RevenueCat integration and the Support the Mission screen. */
    support: boolean;
  };

  onboarding: {
    enabled: boolean;
  };

  i18n: {
    enabled: boolean;
    defaultLanguage: "device" | (string & {});
    fallbackLanguage: string;
    supportedLanguages: readonly string[];
  };

  links: {
    website: string;
    privacyPolicy: string;
    termsOfService: string;
    support: string;
  };
};
