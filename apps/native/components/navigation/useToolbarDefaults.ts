import type { ComponentProps } from "react";
import type { Stack } from "expo-router";
import { useBrandColors } from "@/theme/colors";

type ToolbarButtonProps = ComponentProps<typeof Stack.Toolbar.Button>;
type ToolbarMenuProps = ComponentProps<typeof Stack.Toolbar.Menu>;

/**
 * Returns factory functions that produce props with app-level defaults
 * for each toolbar item type.
 *
 * Use this when composing toolbars manually (bypassing `ScreenToolbar`)
 * so you still get consistent brand colors and variant defaults without
 * repeating them on every item.
 *
 * Extendable -- add new factories (menu, label, view, …) as needed.
 *
 * @example
 * ```tsx
 * const toolbar = useToolbarDefaults();
 *
 * <Stack.Toolbar placement="right">
 *   <Stack.Toolbar.Button {...toolbar.button({ variant: "done" })} onPress={save}>
 *     Save
 *   </Stack.Toolbar.Button>
 * </Stack.Toolbar>
 * ```
 */
export function useToolbarDefaults() {
  const { primary } = useBrandColors();

  return {
    button: (
      overrides?: Partial<ToolbarButtonProps>,
    ): Partial<ToolbarButtonProps> => ({
      variant: "prominent",
      tintColor: primary,
      ...overrides,
    }),

    menu: (
      overrides?: Partial<ToolbarMenuProps>,
    ): Partial<ToolbarMenuProps> => ({
      tintColor: primary,
      ...overrides,
    }),
  };
}
