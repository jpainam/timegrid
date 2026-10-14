import { appConfig } from "@/config/app";
import type { BrandColor } from "@/config/app.types";
import type {
  BorderRadiusPreset,
  BorderWidthPreset,
  SpacingPreset,
} from "@/theme/dimensions";
import {
  BORDER_RADIUS_PRESETS,
  BORDER_WIDTH_PRESETS,
  SPACING_PRESETS,
} from "@/theme/dimensions";
import Storage from "expo-sqlite/kv-store";
import React, { createContext, useCallback, useState } from "react";

function extractBrandDefault(
  color: BrandColor,
  mode: "light" | "dark",
): string {
  return typeof color === "string" ? color : color[mode];
}

/**
 * App Settings Type Definition
 * Add new settings here - they will automatically persist
 */
type AppSettings = {
  isOnboarded: boolean;
  hasSeenSupportPrompt: boolean;
  hasRequestedReview: boolean;
  onboardingAnswers: Record<string, string | string[]>;
  onboardingAnswersVersion: number;
  // Theme dimension presets
  spacing: SpacingPreset;
  borderRadius: BorderRadiusPreset;
  borderWidth: BorderWidthPreset;
  // Brand primary color overrides
  brandPrimaryLight: string;
  brandPrimaryDark: string;
  // User language override (null = use config/device default)
  language: string | null;
};

/**
 * Default settings - used on first launch
 */
const DEFAULT_SETTINGS: AppSettings = {
  isOnboarded: false,
  hasSeenSupportPrompt: false,
  hasRequestedReview: false,
  onboardingAnswers: {},
  onboardingAnswersVersion: 1,
  spacing: appConfig.theme.spacing,
  borderRadius: appConfig.theme.borderRadius,
  borderWidth: appConfig.theme.borderWidth,
  brandPrimaryLight: extractBrandDefault(
    appConfig.theme.brand.primary,
    "light",
  ),
  brandPrimaryDark: extractBrandDefault(appConfig.theme.brand.primary, "dark"),
  language: null,
};

export const STORAGE_KEY = "@app_settings";

type AppSettingsContextType = {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  updateSettingsSync: (updates: Partial<AppSettings>) => void;
  resetSettings: () => Promise<void>;
  // Individual setters for convenience
  setIsOnboarded: (value: boolean) => Promise<void>;
  setIsOnboardedSync: (value: boolean) => void;
  setIsOnboardedWithDelay: (value: boolean, delay?: number) => void;
  // Derived theme tokens — ready to use in StyleSheet/inline styles
  SPACING: (typeof SPACING_PRESETS)[SpacingPreset];
  BORDER_RADIUS: (typeof BORDER_RADIUS_PRESETS)[BorderRadiusPreset];
  BORDER_WIDTH: (typeof BORDER_WIDTH_PRESETS)[BorderWidthPreset];
  // Theme preset setters
  setSpacing: (value: SpacingPreset) => void;
  setBorderRadius: (value: BorderRadiusPreset) => void;
  setBorderWidth: (value: BorderWidthPreset) => void;
  setBrandPrimaryLight: (value: string) => void;
  setBrandPrimaryDark: (value: string) => void;
  setLanguage: (value: string | null) => void;
};

export const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => Promise.resolve(),
  updateSettingsSync: () => {},
  resetSettings: () => Promise.resolve(),
  setIsOnboarded: () => Promise.resolve(),
  setIsOnboardedSync: () => {},
  setIsOnboardedWithDelay: () => {},
  SPACING: SPACING_PRESETS[DEFAULT_SETTINGS.spacing],
  BORDER_RADIUS: BORDER_RADIUS_PRESETS[DEFAULT_SETTINGS.borderRadius],
  BORDER_WIDTH: BORDER_WIDTH_PRESETS[DEFAULT_SETTINGS.borderWidth],
  setSpacing: () => {},
  setBorderRadius: () => {},
  setBorderWidth: () => {},
  setBrandPrimaryLight: () => {},
  setBrandPrimaryDark: () => {},
  setLanguage: () => {},
});

// Load settings synchronously from storage
function loadSettingsSync(): AppSettings {
  try {
    const stored = Storage.getItemSync(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
  return DEFAULT_SETTINGS;
}

export function AppSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load settings synchronously on initialization - no loading state needed!
  const [settings, setSettings] = useState<AppSettings>(loadSettingsSync);

  // Update settings (async)
  const updateSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      try {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        await Storage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error("Failed to update settings:", error);
        throw error;
      }
    },
    [settings],
  );

  // Update settings (sync) - no await needed!
  const updateSettingsSync = useCallback(
    (updates: Partial<AppSettings>) => {
      try {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        Storage.setItemSync(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error("Failed to update settings:", error);
        throw error;
      }
    },
    [settings],
  );

  // Reset to defaults
  const resetSettings = useCallback(async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      await Storage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to reset settings:", error);
      throw error;
    }
  }, []);

  // Convenience methods for individual settings
  const setIsOnboarded = useCallback(
    async (value: boolean) => {
      await updateSettings({ isOnboarded: value });
    },
    [updateSettings],
  );

  const setIsOnboardedSync = useCallback(
    (value: boolean) => {
      updateSettingsSync({ isOnboarded: value });
    },
    [updateSettingsSync],
  );

  const setIsOnboardedWithDelay = useCallback(
    (value: boolean, delay?: number) => {
      setTimeout(() => {
        setIsOnboardedSync(value);
      }, delay ?? 2000);
    },
    [setIsOnboardedSync],
  );

  const setSpacing = useCallback(
    (value: SpacingPreset) => updateSettingsSync({ spacing: value }),
    [updateSettingsSync],
  );

  const setBorderRadius = useCallback(
    (value: BorderRadiusPreset) => updateSettingsSync({ borderRadius: value }),
    [updateSettingsSync],
  );

  const setBorderWidth = useCallback(
    (value: BorderWidthPreset) => updateSettingsSync({ borderWidth: value }),
    [updateSettingsSync],
  );

  const setBrandPrimaryLight = useCallback(
    (value: string) => updateSettingsSync({ brandPrimaryLight: value }),
    [updateSettingsSync],
  );

  const setBrandPrimaryDark = useCallback(
    (value: string) => updateSettingsSync({ brandPrimaryDark: value }),
    [updateSettingsSync],
  );

  const setLanguage = useCallback(
    (value: string | null) => updateSettingsSync({ language: value }),
    [updateSettingsSync],
  );

  const value: AppSettingsContextType = {
    settings,
    updateSettings,
    updateSettingsSync,
    resetSettings,
    setIsOnboarded,
    setIsOnboardedSync,
    setIsOnboardedWithDelay,
    SPACING: SPACING_PRESETS[settings.spacing],
    BORDER_RADIUS: BORDER_RADIUS_PRESETS[settings.borderRadius],
    BORDER_WIDTH: BORDER_WIDTH_PRESETS[settings.borderWidth],
    setSpacing,
    setBorderRadius,
    setBorderWidth,
    setBrandPrimaryLight,
    setBrandPrimaryDark,
    setLanguage,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}
