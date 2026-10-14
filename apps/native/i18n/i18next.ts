import { appConfig } from "@/config/app";
import { STORAGE_KEY } from "@/context/AppSettings";
import { getLocales } from "expo-localization";
import Storage from "expo-sqlite/kv-store";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";

export const resources = { en, es, fr } as const;
export const defaultNS = "common";

export const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

const { enabled, defaultLanguage, fallbackLanguage, supportedLanguages } =
  appConfig.i18n;
const supported = supportedLanguages as unknown as string[];

function detectFromDevice(): string {
  if (defaultLanguage === "device") {
    const deviceLng = getLocales()[0]?.languageCode;
    if (deviceLng && supported.includes(deviceLng)) {
      return deviceLng;
    }
    return fallbackLanguage;
  }
  return supported.includes(defaultLanguage) ? defaultLanguage : fallbackLanguage;
}

function resolveLanguage(): string {
  if (!enabled) {
    return defaultLanguage === "device" ? fallbackLanguage : defaultLanguage;
  }

  try {
    const stored = Storage.getItemSync(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.language && supported.includes(parsed.language)) {
        return parsed.language;
      }
    }
  } catch {
    /* first launch or corrupt data — continue */
  }

  return detectFromDevice();
}

/**
 * Resolves the language the app would use without a stored user preference.
 * Called when the user resets to "Device Language" in Settings.
 */
export function resolveDeviceLanguage(): string {
  return detectFromDevice();
}

// eslint-disable-next-line
i18next.use(initReactI18next).init({
  resources,
  fallbackLng: fallbackLanguage,
  defaultNS,
  supportedLngs: supported,
  lng: resolveLanguage(),
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
