# TimeGrid: World Clock — Product Specification

**Version:** 1.0  
**Status:** MVP implementation specification  
**Platforms:** iOS first; Android-compatible architecture  
**App Store name:** TimeGrid: World Clock  
**Subtitle:** Scroll & Compare Time Zones  
**Tagline:** Every city. One timeline.

## 1. Purpose

Build a fast, elegant mobile application for comparing local times in any number of cities using a **two-dimensional, synchronized, scrollable grid**.

- **Vertical movement** navigates time, including across days, months, years, and daylight-saving transitions.
- **Horizontal movement** navigates city columns.
- **Every row represents one absolute instant**, displayed in the local time and date of every visible city.
- Users should never have to perform time-zone arithmetic or open a separate conversion form.

The grid is the home screen and primary interaction—not a secondary feature.

### Primary user story

> I live in California and want to know what time it will be in Cameroon when it is 8:00 AM here. I add California and Douala, scroll to 8:00 AM in California, and immediately see the corresponding time in Cameroon. I can add Paris, Tokyo, and more cities and swipe sideways to compare them all.

## 2. Product principles

1. **One instant, many local times.** Never align unrelated local times on the same row.
2. **Scroll, don't calculate.** The default workflow requires no typing.
3. **Unlimited in product design.** Do not impose an arbitrary app-level city limit; virtualize columns for performance.
4. **Home city stays visible.** Pin the reference city's column while other cities scroll horizontally.
5. **Time is continuous.** Vertical scrolling must cross midnight and date boundaries without pagination or resetting.
6. **Timezone correctness over shortcuts.** Use IANA time zones and date-aware offsets, never fixed city offsets.
7. **Local-first.** Core features work offline, with saved cities retained between launches.
8. **Immediate comprehension.** Clearly differentiate day/night, dates, today, and the selected instant.

## 3. Target audience and jobs to be done

- People with friends and family overseas who schedule calls.
- Distributed teams coordinating meetings.
- Travelers comparing home and destination time.
- Freelancers and remote workers operating across regions.

**Primary job:** “Show me the local times in all my saved cities for any moment I scroll to.”

**Secondary jobs:** Jump to a specific date/time, find overlap in waking or working hours, copy/share a time comparison, reorder cities.

## 4. Scope

### MVP — required

- Search and add cities from a reliable offline city/timezone dataset.
- Add multiple cities; reorder and remove them.
- Choose one home/reference city, pinned on the left.
- Vertically scroll a continuous hourly timeline, backward and forward.
- Horizontally scroll non-pinned city columns independently of vertical position.
- Sticky city headers and a sticky pinned city column.
- Show city-local hour, AM/PM (or 24-hour format), and local date where needed.
- Highlight the selected row across all columns.
- Jump to **Now** and jump to a chosen date/time.
- Automatically account for timezone differences and daylight-saving transitions.
- Save cities, ordering, home city, and display preferences locally.
- Respect 12/24-hour preference, with an in-app override.
- Loading, empty, and error states; VoiceOver accessibility.
- Dark and light appearances.

### V1.1 — optional, not required for MVP

- Working-hour shading with configurable hours per city.
- Share/copy selected row as text or image.
- Favorites/presets for different groups of cities.
- Search by country or UTC offset.
- Home-screen widgets and Live Activities only if technically justified.
- Calendar-event handoff and meeting suggestions.

### Out of scope for MVP

- Accounts, authentication, cloud synchronization, backend APIs.
- Chat, social features, ads, subscriptions, or payments.
- Calendar-provider integrations.
- AI-based timezone conversion; deterministic timezone rules are more reliable.

## 5. Information architecture

Keep navigation minimal:

1. **Time Grid (home):** Main comparison view.
2. **Add City:** Search and select a city.
3. **Manage Cities:** Reorder, remove, and set home city.
4. **Settings:** Time format, appearance, optional display controls.

Prefer sheets for Add City, Manage Cities, and date/time jump so users return directly to the grid.

## 6. Main screen UI

### Layout

```text
┌──────────────────────────────────────────┐
│ TimeGrid                     [+] [•••]   │
│ Every city. One timeline.                │
├──────────────────────────────────────────┤
│ [ Today · Wed, Oct 14 ]        [ Now ]   │
├──────────────┬──────────────┬────────────┤
│ 🇺🇸 California│ 🇨🇲 Douala     │ 🇫🇷 Paris   │ ← sticky headers
│ HOME         │              │            │
├──────────────┼──────────────┼────────────┤
│ 6:00 AM      │ 2:00 PM      │ 3:00 PM    │
│ 7:00 AM      │ 3:00 PM      │ 4:00 PM    │
│▶8:00 AM      │ 4:00 PM      │ 5:00 PM    │ ← selected instant
│ 9:00 AM      │ 5:00 PM      │ 6:00 PM    │
│ 10:00 AM     │ 6:00 PM      │ 7:00 PM    │
│      ↕ vertical: move through time       │
│      ↔ horizontal: move through cities   │
└──────────────┴──────────────┴────────────┘
```

*Example values above apply when California is on PDT and Douala is on WAT. The production UI must compute all values from the actual selected date.*

### Visual hierarchy

- City name + optional flag at the top of each column; show enough context to distinguish cities with the same name.
- Pinned home city has a subtle visual distinction.
- Selected row has a consistent highlight spanning all visible columns.
- Hour labels should be large enough to read quickly; date labels should be smaller.
- Show date markers when the local date changes; do not assume every city shares the same date.
- Optionally shade nighttime (e.g., 22:00–06:00 local time) without making it inaccessible.
- Preserve readability with 3–4 visible columns on typical phones when possible; allow horizontal navigation to all others. Actual width should be responsive and accessible.

## 7. Interaction specification

### 7.1 Vertical scrolling

- Swipe up to move to later instants; swipe down to earlier instants (normal mobile scroll behavior).
- Timeline rows are separated by **one absolute elapsed hour**, not by one increment of a particular city's wall-clock hour.
- Scrolling crosses date boundaries continuously; never reset at 00:00.
- Keep a stable row height so scrolling remains predictable.
- Render a bounded window around the viewport and extend/recenter the logical range as needed to simulate unbounded navigation.
- Maintain scroll position during horizontal movement and when city columns change.
- The selected row remains selected until a user selects another row or taps Now. Scrolling alone need not change selection; display a subtle indicator if selection is offscreen.

### 7.2 Horizontal scrolling

- Swipe left/right to browse non-home city columns.
- Home city column stays pinned; all other city columns move as one synchronized horizontal viewport.
- Column headers and data cells must share exactly the same horizontal scroll offset.
- A diagonal gesture must not desynchronize rows and columns; use gesture coordination or axis locking.
- Reordering/removing a city should preserve vertical timeline position.

### 7.3 Selecting a row

- Tap any cell to select its entire row/absolute instant.
- Highlight the corresponding time in **every** city, not just the tapped cell.
- Expose the selected absolute instant to optional future copy/share actions.
- Accessibility announcement should include the selected city's local time, date, and city name.

### 7.4 Jump to Now

- Tap **Now** to bring the current absolute instant into view (nearest hourly row, with optional current-time marker).
- The UI must clearly distinguish an hourly grid row from the exact current minute.
- Return to the current day and highlight the current instant or nearest row.
- Do not reset city ordering or horizontal position unless explicitly chosen.

### 7.5 Jump to date/time

- Provide a date/time picker tied to the **home city**.
- Resolve the chosen home-city wall time into an absolute instant.
- During fall-back DST, ambiguous local times must offer an offset/occurrence choice or use an explicitly documented default with a clear indication.
- During spring-forward DST, nonexistent local times must be rejected with a clear explanation or advanced to the next valid time with explicit notice.
- Scroll to the corresponding row without changing the set of cities.

### 7.6 City management

- Add city through a searchable sheet; search by city, country, and common aliases.
- Each city entry stores a stable identifier and IANA timezone ID (e.g., `America/Los_Angeles`, `Africa/Douala`).
- Show disambiguation such as city + country/region for duplicate city names.
- Avoid accidental duplicates; permit different cities in the same timezone if users want them.
- Support drag-to-reorder; changing the home city pins the newly selected city.
- Persist all changes immediately.
- Empty state should invite users to add a first city; consider suggesting the device's current timezone without assuming precise location permission.

## 8. Timezone and calendar correctness

This section is non-negotiable.

### Data model

```ts
type City = {
  id: string;               // stable dataset identifier
  name: string;
  region?: string;
  countryCode: string;      // ISO 3166-1 alpha-2
  timeZone: string;         // IANA, e.g. Africa/Douala
};

type AppPreferences = {
  homeCityId: string | null;
  orderedCityIds: string[];
  hourFormat: 'system' | '12h' | '24h';
  theme: 'system' | 'light' | 'dark';
};

type TimelineRow = {
  instantMs: number;        // absolute UTC epoch milliseconds
};
```

### Invariant

For row `r` and city `c`, render:

`localDisplay = formatInstant(r.instantMs, c.timeZone, userPreferences)`

**Never** calculate a city time by adding a hardcoded number of hours to another city's displayed time. Use an IANA-aware formatter or timezone library and the specific instant.

### DST edge cases

- California shifts between UTC−8 and UTC−7; Cameroon remains UTC+1.
- 08:00 California therefore corresponds to 17:00 Cameroon in standard time and 16:00 in daylight time.
- On spring-forward, a city's local clock skips an hour; the timeline itself must not skip an absolute instant.
- On fall-back, a city's local clock repeats an hour; show both occurrences in separate rows and distinguish them by offset/abbreviation where needed.
- Countries can change timezone policy; rely on maintained timezone data, not assumptions.
- Some zones have half-hour or quarter-hour offsets: do not assume all local minute values are `:00` when the absolute grid is hourly.
- Support date changes, month/year rollover, leap years, and crossing the International Date Line.

### Timeline alignment

Choose a consistent global hourly anchor (e.g., UTC top-of-hour) for row generation. For each integer row index `i`:

`instantMs(i) = anchorUtcMs + i * 3_600_000`

If users jump to a non-hour-aligned home-city wall time, preserve that requested instant and either show a precise selected-time indicator or temporarily anchor rows to its minute; do not silently imply a different minute.

## 9. Technical architecture

### Recommended stack

- **Expo + React Native + TypeScript**, using current stable versions compatible with the selected Expo SDK.
- **Expo Router** for navigation.
- **React Native Reanimated + Gesture Handler** for smooth gestures, where appropriate.
- **Virtualized rendering** for rows and columns. Evaluate FlashList or an equivalent maintained library, but verify whether it supports the required bidirectional grid and sticky behavior. A coordinated set of virtualized lists or a custom windowed grid may be more appropriate.
- **AsyncStorage** for small local preferences and city IDs; a lightweight embedded database is optional if dataset/query requirements warrant it.
- **Intl.DateTimeFormat** with IANA timezone IDs where fully supported by the target runtime; otherwise use a maintained timezone library/polyfill with tested DST behavior.
- Bundle a suitable city dataset and searchable aliases locally, with licensing verified.

### Modules

```text
src/
  app/                 # Expo Router screens/sheets
  components/
    TimeGrid/
      TimeGrid.tsx
      StickyCityHeader.tsx
      PinnedHomeColumn.tsx
      TimelineRow.tsx
      CityCell.tsx
      SelectedRowIndicator.tsx
    CitySearch.tsx
    CityManager.tsx
  domain/
    time/              # instant generation, timezone formatting, DST logic
    cities/            # city types, search, ordering
  hooks/               # grid navigation and persisted preferences
  storage/             # local persistence
  data/                # licensed offline city/timezone index
  theme/               # tokens, typography, colors
  tests/
```

### Rendering/performance guidance

- **Do not render all hours or all cities.** Render only visible rows/columns plus a small overscan buffer.
- Avoid `rows × cities` full-matrix precomputation for large city sets.
- Use stable keys and memoized formatting for visible cells, keyed by instant, timezone, locale, and display preferences.
- Keep headers and cells aligned from one shared column-width definition.
- Avoid nested independently scrolling views that fight for gestures; design the horizontal/vertical gesture relationship deliberately.
- Recenter large scroll offsets before native precision/layout limits become problematic, without a visible jump.
- Verify performance on a mid-range iPhone, not only a simulator.
- Minimize state updates during each scroll frame; use UI-thread animation/scroll handling where practical.

### Offline behavior and privacy

- Time comparisons, city search, and saved cities must work without network access.
- No login, location permission, analytics SDK, or backend is required for core functionality.
- Device timezone may initialize the suggested home timezone without precise geolocation.
- If analytics are added later, disclose collection accurately and do not log personal location history by default.

## 10. Settings

MVP settings:

- Time format: System / 12-hour / 24-hour.
- Theme: System / Light / Dark.
- Set home city (also accessible from Manage Cities).

Optional later settings: day/night shading, preferred working hours, show UTC offsets, text density.

## 11. Accessibility and localization

- Support VoiceOver: announce `City, weekday, date, local time, UTC offset if ambiguous`.
- Touch targets should be at least 44 × 44 pt for controls.
- Support Dynamic Type without clipping or misaligning columns; permit larger column widths when needed.
- Do not rely only on color to distinguish selection, nighttime, or home city.
- Support reduced motion and system contrast settings.
- Use locale-aware date/time formatting, including non-English languages and 24-hour conventions.
- Keep interface copy in localization resources rather than hardcoding strings.

## 12. States and failure handling

- **First launch:** Clear explanation of vertical vs horizontal gestures; prompt to add cities.
- **No cities:** Empty-state Add City action.
- **One city:** Vertical timeline still works; prompt to add comparison cities.
- **Search no results:** Explain and allow another query.
- **Unsupported/invalid timezone record:** Do not crash; omit the invalid entry and show a recoverable error.
- **Corrupt local preferences:** Recover safely with defaults while preserving valid city selections when possible.
- **Long scroll:** Maintain stable performance and consistent date formatting.
- **App resume:** Refresh Now marker/current-date context without unexpectedly resetting a user's historical selection.

## 13. Example acceptance scenarios

1. **California → Cameroon in October:** On October 14, 2026, `08:00` in `America/Los_Angeles` displays `16:00` in `Africa/Douala` on the same date.
2. **California → Cameroon in January:** On January 14, 2027, `08:00` in `America/Los_Angeles` displays `17:00` in `Africa/Douala` on the same date.
3. **Cross-midnight:** Scrolling from 23:00 to the next absolute hour shows appropriate next-day dates in each city.
4. **DST spring transition:** `America/Los_Angeles` skips nonexistent local times without skipping UTC hourly rows.
5. **DST fall transition:** Repeated local hour appears twice at distinct absolute instants and can be distinguished.
6. **Non-integer offset:** `Asia/Kathmandu` displays correct `:45` minute values relative to UTC-hour rows.
7. **Pinned column:** With 20 cities, horizontal swiping changes visible non-home cities while the home city remains visible.
8. **Vertical continuity:** After horizontal swiping, the visible row represents the same absolute instant in every column.
9. **Persistence:** Force-close and relaunch; cities, order, home city, and preferences are restored.
10. **Offline:** With airplane mode on, city search and time comparison still function.
11. **Now:** From an arbitrary past/future position, tapping Now returns to the current instant without removing cities.
12. **Accessibility:** A VoiceOver user can identify cities, move through times, select a row, and add/remove cities.

## 14. Quality gates

- Unit tests for timezone formatting, UTC-row generation, and date boundary transitions.
- DST tests using known transition dates in multiple zones, including ambiguous and nonexistent local times.
- Component tests for selection, pinned home column, and city management.
- End-to-end tests for adding cities, two-axis scrolling, Now, and persistence.
- Manual tests with 1, 3, 10, 50, and 100+ cities to validate virtualization; no artificial product limit.
- Manual accessibility testing with VoiceOver and large text.
- No layout drift between sticky header and scrolled columns.
- No incorrect conversion across DST, date line, or fractional-offset zones.

## 15. Implementation sequence for the coding agent

**Phase 1 — Foundation**

1. Initialize Expo + TypeScript app and routing.
2. Add theme tokens, local preferences, and city dataset/search.
3. Implement pure UTC timeline generation and timezone formatting with unit tests.

**Phase 2 — Core grid**

4. Implement virtualized vertical hourly rows.
5. Implement synchronized horizontally scrollable city columns.
6. Pin home column and city headers; verify alignment.
7. Implement row selection, date markers, Now, and date/time jump.

**Phase 3 — Product completeness**

8. Add city management and persistence.
9. Add 12/24-hour formatting, dark mode, empty states, and accessibility.
10. Test DST, cross-midnight, fractional offsets, and large city sets.
11. Polish gestures, scroll performance, and onboarding.

**Do not start optional integrations or monetization until the core two-axis grid is correct and fluid.**

## 16. Design direction

- Native-feeling, minimal, and utilitarian; the data is the hero.
- Clean typography with tabular numerals to prevent jumping digits.
- Subtle grid dividers, restrained accent color, generous spacing.
- Clear sticky headers and a distinctive but understated selected row.
- No decorative analog clocks, maps, or dashboards competing with the main grid.
- Default view should make comparison possible within seconds of launch.

## 17. App Store positioning

**Name:** TimeGrid: World Clock  
**Subtitle:** Scroll & Compare Time Zones  
**Tagline:** Every city. One timeline.

**Core message:** Add cities as columns. Scroll vertically through time and horizontally across the world. Every row shows the same instant in every location, with daylight-saving changes handled automatically.

Avoid advertising features that have not shipped.

## 18. Definition of done

The MVP is complete when a new user can add California, Douala, Paris, and Tokyo; immediately compare all their local times; scroll seamlessly backward and forward through multiple days; swipe horizontally to additional cities while keeping the home city pinned; select an instant; jump back to Now; and reopen the app with their cities preserved—**with correct timezone and DST handling, offline and without an account**.

---

### Instruction to implementation LLM

Treat this file as the source of truth for product behavior. Prioritize timezone correctness, scroll synchronization, and performance over visual extras. When implementation trade-offs arise, preserve the invariant that **one row equals one absolute instant across every city**. Do not invent additional MVP features, accounts, backends, or monetization. Implement incrementally, test the pure time-domain logic before complex UI work, and verify the two-axis grid on a physical device.
