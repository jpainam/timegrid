import { Button, Host, RNHostView } from "@expo/ui";
import { semantics } from "@expo/ui/jetpack-compose/modifiers";
import { accessibilityLabel, frame } from "@expo/ui/swift-ui/modifiers";
import type { ReactNode } from "react";
import { Platform, View, type ViewStyle } from "react-native";

type NativeActionProps = {
  label: string;
  onPress: () => void;
  width: number;
  height: number;
  children: ReactNode;
  disabled?: boolean;
  selected?: boolean;
  alignment?: "leading" | "center" | "trailing";
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

/** A native SwiftUI/Compose button with React Native content inside it. */
export function NativeAction({
  label,
  onPress,
  width,
  height,
  children,
  disabled = false,
  selected,
  alignment = "center",
  style,
  contentStyle,
}: NativeActionProps) {
  return (
    <Host style={{ width, height, ...style }} accessibilityState={{ disabled, selected }}>
      <Button
        variant="text"
        onPress={onPress}
        disabled={disabled}
        style={{ width, height }}
        modifiers={Platform.OS === "ios"
          ? [frame({ width, height, alignment }), accessibilityLabel(label)]
          : Platform.OS === "android"
            ? [semantics({ contentDescription: label })]
            : undefined}
      >
        <RNHostView>
          <View
            pointerEvents="none"
            style={{ width, height, justifyContent: "center", ...contentStyle }}
          >
            {children}
          </View>
        </RNHostView>
      </Button>
    </Host>
  );
}
