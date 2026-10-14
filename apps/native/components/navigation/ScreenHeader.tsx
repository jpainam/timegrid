import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

type StackHeaderProps = ComponentProps<typeof Stack.Header>;

/**
 * Platform-aware `Stack.Header` with sensible defaults.
 *
 * - iOS: transparent large-title background, blur effect (falls back to
 *   `systemMaterial` on pre-Liquid-Glass devices)
 * - Android: no blur (unsupported), transparent shadow
 *
 * Every prop is overridable -- pass any `Stack.Header` prop and it will
 * take precedence over the defaults.
 */
export function ScreenHeader(props: StackHeaderProps) {
  return (
    <Stack.Header
      largeStyle={{
        backgroundColor: Platform.select({ ios: "transparent" }),
      }}
      style={{ shadowColor: "transparent" }}
      blurEffect={Platform.select({
        ios: isLiquidGlassAvailable() ? undefined : "systemMaterial",
        android: undefined,
      })}
      {...props}
    />
  );
}
