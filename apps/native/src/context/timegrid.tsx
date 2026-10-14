import { cityById, defaultCityIds, type City } from '@/src/domain/cities';
import { isValidTimeZone, type HourFormat } from '@/src/domain/time';
import Storage from 'expo-sqlite/kv-store';
import { createContext, use, useCallback, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type ThemeChoice = 'system' | 'light' | 'dark';
export type Preferences = {
  homeCityId: string | null;
  orderedCityIds: string[];
  hourFormat: HourFormat;
  theme: ThemeChoice;
};

const KEY = '@timegrid/preferences/v1';
const defaults: Preferences = {
  homeCityId: 'America/Los_Angeles',
  orderedCityIds: defaultCityIds,
  hourFormat: 'system',
  theme: 'system',
};

function sanitize(value: unknown): Preferences {
  if (!value || typeof value !== 'object') return defaults;
  const record = value as Partial<Preferences>;
  const orderedCityIds = Array.isArray(record.orderedCityIds)
    ? [...new Set(record.orderedCityIds.filter((id): id is string =>
        typeof id === 'string' && cityById.has(id) && isValidTimeZone(cityById.get(id)!.timeZone)))]
    : defaults.orderedCityIds;
  const homeCityId = orderedCityIds.includes(record.homeCityId ?? '')
    ? record.homeCityId! : orderedCityIds[0] ?? null;
  return {
    homeCityId,
    orderedCityIds,
    hourFormat: ['system', '12h', '24h'].includes(record.hourFormat ?? '') ? record.hourFormat! : defaults.hourFormat,
    theme: ['system', 'light', 'dark'].includes(record.theme ?? '') ? record.theme! : defaults.theme,
  };
}

function load(): Preferences {
  try {
    const value = Storage.getItemSync(KEY);
    return value ? sanitize(JSON.parse(value)) : defaults;
  } catch {
    return defaults;
  }
}

type TimeGridContextValue = {
  preferences: Preferences;
  orderedCities: City[];
  homeCity: City | null;
  error: string | null;
  clearError: () => void;
  addCity: (id: string) => void;
  removeCity: (id: string) => void;
  moveCity: (id: string, toIndex: number) => void;
  setHomeCity: (id: string) => void;
  setHourFormat: (format: HourFormat) => void;
  setTheme: (theme: ThemeChoice) => void;
  selectedInstantMs: number;
  setSelectedInstantMs: (instant: number) => void;
  jumpRequest: { instantMs: number; token: number } | null;
  jumpTo: (instant: number) => void;
};

const TimeGridContext = createContext<TimeGridContextValue | null>(null);

export function TimeGridProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('timegrid');
  const [preferences, setPreferences] = useState<Preferences>(load);
  const preferencesRef = useRef(preferences);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstantMs, setSelectedInstantMs] = useState(() => Math.floor(Date.now() / 3_600_000) * 3_600_000);
  const [jumpRequest, setJumpRequest] = useState<{ instantMs: number; token: number } | null>(null);

  const commit = useCallback((change: (current: Preferences) => Preferences) => {
    const next = sanitize(change(preferencesRef.current));
    try {
      Storage.setItemSync(KEY, JSON.stringify(next));
      preferencesRef.current = next;
      setPreferences(next);
      setError(null);
    } catch {
      setError(t('saveError'));
    }
  }, [t]);

  const addCity = useCallback((id: string) => {
    const city = cityById.get(id);
    if (!city || !isValidTimeZone(city.timeZone)) {
      setError(t('invalidTimezone'));
      return;
    }
    commit((current) => {
    if (current.orderedCityIds.includes(id)) return current;
    return {
      ...current,
      orderedCityIds: [...current.orderedCityIds, id],
      homeCityId: current.homeCityId ?? id,
    };
    });
  }, [commit, t]);

  const removeCity = useCallback((id: string) => commit((current) => {
    const orderedCityIds = current.orderedCityIds.filter((item) => item !== id);
    return { ...current, orderedCityIds, homeCityId: current.homeCityId === id ? orderedCityIds[0] ?? null : current.homeCityId };
  }), [commit]);

  const moveCity = useCallback((id: string, toIndex: number) => commit((current) => {
    const orderedCityIds = [...current.orderedCityIds];
    const from = orderedCityIds.indexOf(id);
    if (from < 0) return current;
    orderedCityIds.splice(from, 1);
    orderedCityIds.splice(Math.max(0, Math.min(toIndex, orderedCityIds.length)), 0, id);
    return { ...current, orderedCityIds };
  }), [commit]);

  const setHomeCity = useCallback((id: string) => commit((current) =>
    current.orderedCityIds.includes(id) ? { ...current, homeCityId: id } : current), [commit]);
  const setHourFormat = useCallback((hourFormat: HourFormat) => commit((current) => ({ ...current, hourFormat })), [commit]);
  const setTheme = useCallback((theme: ThemeChoice) => commit((current) => ({ ...current, theme })), [commit]);
  const jumpTo = useCallback((instantMs: number) => {
    setSelectedInstantMs(instantMs);
    setJumpRequest({ instantMs, token: Date.now() + Math.random() });
  }, []);

  const orderedCities = preferences.orderedCityIds.map((id) => cityById.get(id)).filter((city): city is City => !!city);
  const homeCity = cityById.get(preferences.homeCityId ?? '') ?? null;
  return <TimeGridContext value={{ preferences, orderedCities, homeCity, error, clearError: () => setError(null),
    addCity, removeCity, moveCity, setHomeCity, setHourFormat, setTheme,
    selectedInstantMs, setSelectedInstantMs, jumpRequest, jumpTo }}>{children}</TimeGridContext>;
}

export function useTimeGrid() {
  const context = use(TimeGridContext);
  if (!context) throw new Error('TimeGridProvider is missing');
  return context;
}
