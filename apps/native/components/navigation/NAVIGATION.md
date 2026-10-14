# Navigation Building Blocks

Reusable primitives for configuring stack screen headers and toolbars across
both iOS and Android.

## Why this abstraction exists

Every screen with header actions requires three things:

1. **`Stack.Header`** with platform-aware blur, transparency, and shadow
2. **`Stack.Toolbar`** for iOS (native toolbar buttons)
3. **`headerRight`/`headerLeft`** for Android (PressableScale + SymbolView)

Without abstraction this is ~40 lines of platform-specific boilerplate per
screen. These building blocks let you define actions once and render them
correctly on both platforms.

### expo-router constraint

`Stack.Toolbar` internally uses `isChildOfType` to identity-check its
children -- only `Stack.Toolbar.Button`, `.Menu`, `.View`, and `.Spacer`
pass this check. **Wrapping those components breaks toolbar rendering.**

That's why `ScreenToolbar` wraps `Stack.Toolbar` itself (which uses context
and is safe to wrap) and generates real `Stack.Toolbar.Button` elements
from the actions array.

## Quick start

```tsx
import {
  androidHeaderActions,
  ScreenHeader,
  ScreenToolbar,
  type ScreenAction,
} from "@/components/navigation";
import { Stack } from "expo-router";

export default function MyScreen() {
  const actions: ScreenAction[] = [
    {
      key: "save",
      label: "Save",
      onPress: () => console.log("Save"),
      ios: { variant: "done" },
      android: { icon: "check" },
    },
  ];

  return (
    <Stack.Screen
      options={{
        title: "My Screen",
        headerLargeTitle: true,
        ...androidHeaderActions(actions),
      }}
    >
      <ScreenHeader />
      <ScreenToolbar actions={actions} placement="right" />
      <MyScreenContent />
    </Stack.Screen>
  );
}
```

## API reference

### `ScreenAction`

Describes a single action for both platforms:

| Field | Required | Description |
| --- | --- | --- |
| `key` | yes | Unique key for React list rendering |
| `label` | yes | Button text (iOS toolbar) |
| `onPress` | yes | Callback |
| `ios` | no | Override any `Stack.Toolbar.Button` prop (`variant`, `tintColor`, `icon`, etc.) |
| `android` | no | `icon` name, `iconSize`, or a custom `render` function |

### `ScreenHeader`

Drop-in replacement for `Stack.Header` with platform defaults. Accepts all
`Stack.Header` props -- anything you pass overrides the defaults.

```tsx
// Use defaults
<ScreenHeader />

// Override blur effect
<ScreenHeader blurEffect="regular" />

// Hide the header
<ScreenHeader hidden />
```

### `ScreenToolbar`

Wraps `Stack.Toolbar` for iOS. Returns `null` on Android.

```tsx
// From actions array
<ScreenToolbar actions={actions} placement="right" />

// Actions + custom toolbar items
<ScreenToolbar actions={actions} placement="right">
  <Stack.Toolbar.Menu icon="ellipsis.circle">
    <Stack.Toolbar.MenuAction onPress={handleSettings}>
      Settings
    </Stack.Toolbar.MenuAction>
  </Stack.Toolbar.Menu>
</ScreenToolbar>
```

### `androidHeaderActions`

Converts `ScreenAction[]` into a `headerRight` or `headerLeft` option.
Returns `{}` on iOS so it is safe to spread unconditionally.

```tsx
<Stack.Screen
  options={{
    ...androidHeaderActions(actions),          // right (default)
    ...androidHeaderActions(leftActions, "left"), // left
  }}
>
```

### `useToolbarDefaults`

Hook for manual toolbar composition. Returns factory functions that apply
brand colors and variant defaults. Use this when you need full control over
the toolbar layout but still want consistent defaults.

```tsx
const toolbar = useToolbarDefaults();

<Stack.Toolbar placement="right">
  <Stack.Toolbar.Button
    {...toolbar.button({ variant: "done" })}
    onPress={save}
  >
    Save
  </Stack.Toolbar.Button>
  <Stack.Toolbar.Menu {...toolbar.menu()} icon="ellipsis.circle">
    <Stack.Toolbar.MenuAction onPress={handleAction}>
      Action
    </Stack.Toolbar.MenuAction>
  </Stack.Toolbar.Menu>
</Stack.Toolbar>
```

## Custom Android rendering

Replace the default `PressableScale` + `SymbolView` with any component:

```tsx
const actions: ScreenAction[] = [
  {
    key: "profile",
    label: "Profile",
    onPress: () => router.push("/profile"),
    android: {
      render: (tintColor) => <Avatar size={28} />,
    },
  },
];
```

## Extending for new toolbar item types

To add defaults for a new toolbar item (e.g. `Stack.Toolbar.View`), add a
factory to `useToolbarDefaults`:

```ts
// In useToolbarDefaults.ts
view: (overrides?: Partial<ToolbarViewProps>): Partial<ToolbarViewProps> => ({
  separateBackground: true,
  ...overrides,
}),
```

No changes to existing code are needed.
