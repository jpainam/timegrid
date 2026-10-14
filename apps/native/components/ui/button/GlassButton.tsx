import { useBrandColors } from "@/theme/colors";
import { Host } from "@expo/ui";
import { Label, Button as SwiftUIButton } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  disabled as disabledModifier,
  font,
  foregroundStyle,
  frame,
  padding,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Dimensions, View, type ViewStyle } from "react-native";
import type { GlassButtonProps } from "./button.types";

const { width } = Dimensions.get("window");

export function GlassButton({
  title = "",
  onPress,
  disabled = false,
  loading = false,
  color = "primary",
  style,
}: GlassButtonProps) {
  const brand = useBrandColors();
  const isDisabled = disabled || loading;

  const tintColor =
    color === "accent"
      ? brand.accent
      : color === "neutral"
        ? brand.primary
        : brand.primary;
  const textColor = color === "accent" ? brand.onAccent : brand.onPrimary;

  return (
    <View style={[style as ViewStyle]}>
      <Host
        style={{
          height: 56,
          width: width,
          alignSelf: "center",
        }}
      >
        <SwiftUIButton
          modifiers={[
            buttonStyle(
              isLiquidGlassAvailable() ? "glassProminent" : "borderedProminent",
            ),
            tint(tintColor),
            controlSize("large"),
            disabledModifier(isDisabled),
            padding(),
          ]}
          onPress={() => {
            if (isDisabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
          }}
        >
          <Label
            title={loading ? "Loading..." : title}
            modifiers={[
              foregroundStyle(textColor),
              font({ weight: "bold" }),
              frame({ maxWidth: width }),
            ]}
          />
        </SwiftUIButton>
      </Host>
    </View>
  );
}
