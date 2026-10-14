import { Stack } from "expo-router";
import type { ComponentProps, ReactNode } from "react";
import { Platform } from "react-native";

import type { ScreenAction } from "./types";

type StackToolbarProps = ComponentProps<typeof Stack.Toolbar>;

type ScreenToolbarProps = Pick<StackToolbarProps, "placement" | "asChild"> & {
  /** Actions rendered as `Stack.Toolbar.Button` elements with app defaults. */
  actions?: ScreenAction[];
  /**
   * Additional native toolbar children (Menu, View, Spacer, etc.)
   * rendered *after* the auto-generated action buttons.
   */
  children?: ReactNode;
};

/**
 * iOS-only toolbar that converts `ScreenAction[]` into native
 * `Stack.Toolbar.Button` elements and supports additional custom children.
 *
 * On Android this renders `null` -- use `androidHeaderActions` for the
 * Android counterpart.
 *
 * The generated buttons are real `Stack.Toolbar.Button` instances so they
 * pass expo-router's internal `isChildOfType` identity check.
 */
export function ScreenToolbar({
  actions = [],
  children,
  ...toolbarProps
}: ScreenToolbarProps) {
  if (Platform.OS !== "ios") return null;

  return (
    <Stack.Toolbar {...toolbarProps}>
      {actions.map((action) =>
        action.ios?.element ? (
          <Stack.Toolbar.View
            key={action.key}
            hidden={action.ios.hidden}
            hidesSharedBackground={action.ios.hidesSharedBackground}
            separateBackground={action.ios.separateBackground}
          >
            {action.ios.element}
          </Stack.Toolbar.View>
        ) : (
          <Stack.Toolbar.Button
            key={action.key}
            variant={action.ios?.variant ?? "prominent"}
            tintColor={action.ios?.tintColor ?? undefined}
            icon={action.ios?.icon}
            disabled={action.ios?.disabled}
            hidden={action.ios?.hidden}
            style={action.ios?.style}
            iconRenderingMode={action.ios?.iconRenderingMode}
            selected={action.ios?.selected}
            separateBackground={action.ios?.separateBackground}
            hidesSharedBackground={action.ios?.hidesSharedBackground}
            accessibilityLabel={action.ios?.accessibilityLabel}
            accessibilityHint={action.ios?.accessibilityHint}
            onPress={action.onPress}
          >
            {action.ios?.badge ? (
              <>
                <Stack.Toolbar.Label>{action.label}</Stack.Toolbar.Label>
                <Stack.Toolbar.Badge>{action.ios.badge}</Stack.Toolbar.Badge>
              </>
            ) : (
              action.label
            )}
          </Stack.Toolbar.Button>
        ),
      )}
      {children}
    </Stack.Toolbar>
  );
}
