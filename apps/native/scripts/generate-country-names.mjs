// Build-time labels for runtimes that do not implement Intl.DisplayNames.
import { readFileSync, writeFileSync } from 'node:fs';

const url = new URL('../src/data/cities.json', import.meta.url);
const output = new URL('../src/data/country-names.json', import.meta.url);
const cities = JSON.parse(readFileSync(url, 'utf8'));
const display = new Intl.DisplayNames(['en'], { type: 'region' });
const codes = [...new Set(cities.map((city) => city.countryCode))].sort();
const countries = Object.fromEntries(codes.map((code) => [code, display.of(code) ?? code]));
writeFileSync(output, `${JSON.stringify(countries, null, 2)}\n`);
console.log(`Wrote ${codes.length} country names`);
