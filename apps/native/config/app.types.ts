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

  i18n: {
    enabled: boolean;
    defaultLanguage: "device" | (string & {});
    fallbackLanguage: string;
    supportedLanguages: readonly string[];
  };

  prayer: {
    maxConcurrentCommitments: number;
  };

};
