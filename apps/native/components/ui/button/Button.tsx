import { useBrandColors, useSystemColors } from "@/theme/colors";
import { BORDER_RADIUS, SPACING } from "@/theme/dimensions";
import { Text } from "@codewithbeto/ui";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { PressableScale } from "pressto";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, type ViewStyle } from "react-native";
import {
  type ButtonProps,
  SIZE_CONFIG,
  resolveButtonColors,
} from "./button.types";

const HAPTIC_MAP = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
} as const;

export function Button({
  title,
  onPress,
  variant = "solid",
  color = "primary",
  size = "md",
  icon,
  disabled = false,
  loading = false,
  haptic = false,
  hapticStyle = "light",
  style,
}: ButtonProps) {
  const brand = useBrandColors();
  const system = useSystemColors();
  const isDisabled = disabled || loading;
  const sizeConfig = SIZE_CONFIG[size];

  const colors = useMemo(
    () => resolveButtonColors(color, variant, brand, system),
    [color, variant, brand, system],
  );

  const containerStyle = useMemo<ViewStyle[]>(
    () => [
      styles.base,
      {
        height: sizeConfig.height,
        paddingHorizontal: SPACING[sizeConfig.paddingH],
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: variant === "outline" ? 1 : 0,
        borderRadius: BORDER_RADIUS.MD,
        opacity: isDisabled ? 0.5 : 1,
      },
      style as ViewStyle,
    ],
    [sizeConfig, colors, variant, isDisabled, style],
  );

  function handlePress() {
    if (isDisabled) return;
    if (haptic) Haptics.impactAsync(HAPTIC_MAP[hapticStyle]);
    onPress();
  }

  return (
    <PressableScale
      style={containerStyle}
      onPress={handlePress}
      enabled={!isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          {icon && (
            <SymbolView
              name={icon}
              size={sizeConfig.iconSize}
              tintColor={colors.text}
            />
          )}
          {title && (
            <Text
              type={sizeConfig.textType}
              weight="600"
              style={{ color: colors.text }}
            >
              {title}
            </Text>
          )}
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.XS,
    alignSelf: "stretch",
  },
});
