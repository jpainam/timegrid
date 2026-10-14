import { SymbolView } from "expo-symbols";
import { PressableScale } from "pressto";
import { Fragment } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { SPACING } from "@/theme/dimensions";
import type { ScreenAction } from "./types";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SPACING.XS,
  },
  iconButton: {
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

/**
 * Converts `ScreenAction[]` into a `headerRight` or `headerLeft` option
 * for `Stack.Screen`. Returns `{}` on iOS so it can be spread safely.
 *
 * @example
 * ```tsx
 * <Stack.Screen options={{
 *   title: "Home",
 *   ...androidHeaderActions(actions),
 * }}>
 * ```
 */
export function androidHeaderActions(
  actions: ScreenAction[],
  side: "right" | "left" = "right",
) {
  if (Platform.OS !== "android") return {};

  const key = side === "right" ? "headerRight" : "headerLeft";

  return {
    [key]: ({ tintColor }: { tintColor?: string }) => {
      const visible = actions.filter((a) => !a.android?.hidden);

      return (
        <View style={styles.row}>
          {visible.map((action) =>
            action.android?.element ? (
              <Fragment key={action.key}>{action.android.element}</Fragment>
            ) : action.android?.render ? (
              <Fragment key={action.key}>
                {action.android.render(tintColor)}
              </Fragment>
            ) : (
              <PressableScale
                key={action.key}
                hitSlop={40}
                style={styles.iconButton}
                rippleColor={action.android?.rippleColor}
                onPress={action.onPress}
              >
                <SymbolView
                  name={{ android: action.android?.icon }}
                  size={action.android?.iconSize ?? 30}
                  tintColor={tintColor}
                />
              </PressableScale>
            ),
          )}
        </View>
      );
    },
  };
}
