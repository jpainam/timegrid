import type { Stack } from "expo-router";
import { AndroidSymbol } from "expo-symbols";
import type { PressableScale } from "pressto";
import type { ComponentProps, ReactNode } from "react";

type ToolbarButtonProps = ComponentProps<typeof Stack.Toolbar.Button>;
type ToolbarViewProps = ComponentProps<typeof Stack.Toolbar.View>;

/**
 * Describes a single header/toolbar action that renders natively on both platforms.
 *
 * - iOS: rendered as a `Stack.Toolbar.Button` inside `Stack.Toolbar`
 * - Android: rendered as a `PressableScale` + `SymbolView` inside `headerRight`/`headerLeft`
 *
 * To render a fully custom element instead of the default button, provide
 * `ios.element` and/or `android.element`. When `element` is set on a
 * platform, the default rendering for that platform is skipped entirely.
 */
export type ScreenAction = {
  key: string;
  label: string;
  onPress: () => void;

  /**
   * iOS-specific overrides applied to the generated `Stack.Toolbar.Button`.
   * All props come directly from expo-router's `StackToolbarButtonProps`.
   *
   * Set `element` to replace the entire `Stack.Toolbar.Button` with a
   * custom view rendered inside `Stack.Toolbar.View`. When `element` is set,
   * only `hidden`, `hidesSharedBackground`, and `separateBackground` are
   * forwarded — the remaining button props are ignored.
   */
  ios?: Partial<
    Pick<
      ToolbarButtonProps,
      | "variant"
      | "tintColor"
      | "icon"
      | "disabled"
      | "hidden"
      | "style"
      | "iconRenderingMode"
      | "selected"
      | "separateBackground"
      | "hidesSharedBackground"
      | "accessibilityLabel"
      | "accessibilityHint"
    >
  > & {
    element?: ToolbarViewProps["children"];
    /** A count shown on the button, e.g. how many filters are on. */
    badge?: string;
  };

  /**
   * Android-specific configuration for the `headerRight`/`headerLeft` icon.
   * Provide `render` to replace the default `PressableScale` + `SymbolView` entirely.
   * Alternatively, set `element` for a static custom view (no `tintColor` callback).
   */
  android?: {
    icon?: AndroidSymbol;
    iconSize?: number;
    hidden?: boolean;
    rippleColor?: ComponentProps<typeof PressableScale>["rippleColor"];
    render?: (tintColor?: string) => ReactNode;
    element?: ReactNode;
  };
};
