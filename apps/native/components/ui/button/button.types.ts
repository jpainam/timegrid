import { isAndroidDynamic } from "@/theme/colors";
import type { SymbolViewProps } from "expo-symbols";
import { Color } from "expo-router";
import type { ViewStyle } from "react-native";

export type ButtonVariant = "solid" | "outline" | "soft" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonColor = "primary" | "accent" | "neutral";

export type ButtonIcon = SymbolViewProps["name"];

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: ButtonIcon;
  disabled?: boolean;
  loading?: boolean;
  haptic?: boolean;
  hapticStyle?: "light" | "medium" | "heavy";
  style?: ViewStyle;
}

export type GlassButtonProps = Pick<
  ButtonProps,
  "title" | "onPress" | "disabled" | "loading" | "color" | "style"
>;

export interface ResolvedButtonColors {
  bg: string;
  border: string;
  text: string;
}

interface BrandTokens {
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
}

interface SystemTokens {
  text: string;
  background: string;
  secondaryBackground: string;
  separator: string;
}

export function resolveButtonColors(
  color: ButtonColor,
  variant: ButtonVariant,
  brand: BrandTokens,
  system: SystemTokens,
): ResolvedButtonColors {
  const base =
    color === "primary"
      ? { fill: brand.primary, onFill: brand.onPrimary }
      : color === "accent"
        ? { fill: brand.accent, onFill: brand.onAccent }
        : { fill: system.text, onFill: system.background };

  switch (variant) {
    case "solid":
      return { bg: base.fill, border: base.fill, text: base.onFill };
    case "outline":
      return { bg: "transparent", border: base.fill, text: base.fill };
    case "soft": {
      if (isAndroidDynamic) {
        const soft =
          color === "primary"
            ? {
                bg: Color.android.dynamic.primaryContainer as unknown as string,
                text: Color.android.dynamic.onPrimaryContainer as unknown as string,
              }
            : color === "accent"
              ? {
                  bg: Color.android.dynamic.secondaryContainer as unknown as string,
                  text: Color.android.dynamic.onSecondaryContainer as unknown as string,
                }
              : { bg: system.secondaryBackground, text: system.text };
        return { bg: soft.bg, border: "transparent", text: soft.text };
      }
      return { bg: `${base.fill}18`, border: "transparent", text: base.fill };
    }
    case "ghost":
      return { bg: "transparent", border: "transparent", text: base.fill };
  }
}

export const SIZE_CONFIG = {
  sm: { height: 36, textType: "sm", iconSize: 16, paddingH: "SM" },
  md: { height: 48, textType: "default", iconSize: 20, paddingH: "MD" },
  lg: { height: 50, textType: "lg", iconSize: 22, paddingH: "LG" },
} as const;
