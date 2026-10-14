import rawCities from '@/src/data/cities.json';
import countryNames from '@/src/data/country-names.json';

export type City = {
  id: string;
  name: string;
  region: string | null;
  countryCode: string;
  timeZone: string;
  description: string | null;
};

const nameOverrides: Record<string, string> = {
  'America/Los_Angeles': 'California',
};

const aliases: Record<string, string> = {
  'America/Los_Angeles': 'los angeles la california pacific time',
  'Africa/Douala': 'cameroon yaounde',
  'America/New_York': 'nyc eastern time',
  'Europe/London': 'uk england britain',
  'Asia/Kolkata': 'india delhi mumbai calcutta',
  'Asia/Tokyo': 'japan',
};

// Additional places may share one IANA zone. Their stable IDs are distinct
// from the zone ID so a user can keep both cities in the grid.
const additionalCities: City[] = [
  { id: 'city:us:los-angeles', name: 'Los Angeles', region: 'California', countryCode: 'US', timeZone: 'America/Los_Angeles', description: null },
  { id: 'city:us:san-francisco', name: 'San Francisco', region: 'California', countryCode: 'US', timeZone: 'America/Los_Angeles', description: null },
  { id: 'city:us:seattle', name: 'Seattle', region: 'Washington', countryCode: 'US', timeZone: 'America/Los_Angeles', description: null },
  { id: 'city:us:boston', name: 'Boston', region: 'Massachusetts', countryCode: 'US', timeZone: 'America/New_York', description: null },
  { id: 'city:cm:yaounde', name: 'Yaoundé', region: null, countryCode: 'CM', timeZone: 'Africa/Douala', description: null },
  { id: 'city:fr:lyon', name: 'Lyon', region: null, countryCode: 'FR', timeZone: 'Europe/Paris', description: null },
  { id: 'city:jp:osaka', name: 'Osaka', region: null, countryCode: 'JP', timeZone: 'Asia/Tokyo', description: null },
];

export const cities: City[] = [...(rawCities as City[]).map((city) => ({
  ...city,
  name: nameOverrides[city.id] ?? city.name,
})), ...additionalCities];

export const cityById = new Map(cities.map((city) => [city.id, city]));

export const defaultCityIds = [
  'America/Los_Angeles',
  'Africa/Douala',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
];

const countryCache = new Map<string, string>();
const regionFormatters = new Map<string, Intl.DisplayNames>();

function normalized(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function countryName(code: string, locale?: string) {
  const language = locale ?? 'en';
  const key = `${language}|${code}`;
  const cached = countryCache.get(key);
  if (cached) return cached;
  try {
    let formatter = regionFormatters.get(language);
    if (!formatter) {
      formatter = new Intl.DisplayNames([language], { type: 'region' });
      regionFormatters.set(language, formatter);
    }
    const result = formatter.of(code);
    const name = result && result !== code ? result : (countryNames as Record<string, string>)[code] ?? code;
    countryCache.set(key, name);
    return name;
  } catch {
    const name = (countryNames as Record<string, string>)[code] ?? code;
    countryCache.set(key, name);
    return name;
  }
}

export function flagFor(code: string) {
  if (!/^[A-Z]{2}$/.test(code)) return '🌐';
  return String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0)));
}

export function searchCities(query: string, locale?: string): City[] {
  const term = normalized(query.trim());
  if (!term) {
    const defaults = defaultCityIds.map((id) => cityById.get(id)).filter((city): city is City => !!city);
    const rest = cities.filter((city) => !defaultCityIds.includes(city.id));
    return [...defaults, ...rest];
  }
  return cities.filter((city) => normalized([
    city.name,
    city.region ?? '',
    countryName(city.countryCode, locale),
    city.countryCode,
    city.description ?? '',
    city.timeZone.replace(/[_/]/g, ' '),
    aliases[city.id] ?? '',
  ].join(' ')).includes(term));
}
