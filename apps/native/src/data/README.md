# Offline city data

`cities.json` is generated from IANA tzdb `zone.tab` (public domain; see its
header and `scripts/generate-cities.py`). It contains the tzdb location ID,
country code, and optional geographic description for 418 locations. `country-names.json`
is generated from the build machine's `Intl.DisplayNames` implementation by
`scripts/generate-country-names.mjs` and supplies offline English fallback names.
Search uses these bundled files and never contacts a service. A small set of
additional named cities in `src/domain/cities.ts` share the correct IANA zone
with a tzdb location while retaining distinct IDs, so users can add both.

Keep the IANA IDs intact when updating the dataset so saved city selections
continue to resolve. The app checks each saved ID and timezone on load.
