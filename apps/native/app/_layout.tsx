import "@/i18n/i18next";

import { AppSettingsContext, AppSettingsProvider } from "@/context/AppSettings";
import { TimeGridProvider, useTimeGrid } from "@/src/context/timegrid";
import { getNavigationTheme } from "@/theme/colors";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { PressablesConfig } from "pressto";
import { use, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Appearance, Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <TimeGridProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <PressablesConfig
              globalHandlers={{
                onPress: () => {
                  Haptics.selectionAsync();
                },
              }}
              config={{ minScale: 0.97 }}
            >
              <RootLayoutInner />
            </PressablesConfig>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </TimeGridProvider>
    </AppSettingsProvider>
  );
}

function RootLayoutInner() {
  const { t } = useTranslation("timegrid");
  const colorScheme = useColorScheme();
  const { settings } = use(AppSettingsContext);
  const { preferences } = useTimeGrid();
  useEffect(() => {
    Appearance.setColorScheme(
      preferences.theme === "system" ? "unspecified" : preferences.theme,
    );
  }, [preferences.theme]);
  const dark =
    preferences.theme === "system"
      ? colorScheme === "dark"
      : preferences.theme === "dark";
  const brandPrimary = dark
    ? settings.brandPrimaryDark
    : settings.brandPrimaryLight;

  return (
    <>
      <ThemeProvider value={getNavigationTheme(dark, brandPrimary)}>
        <Stack>
          <Stack.Screen
            name="(home)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="add-city"
            options={{
              presentation: "formSheet",
              sheetGrabberVisible: true,
              title: t("add"),
              headerTransparent: Platform.OS === "ios",
              contentStyle:
                Platform.OS === "ios" && isLiquidGlassAvailable()
                  ? { backgroundColor: "transparent" as const }
                  : undefined,
            }}
          />
          <Stack.Screen
            name="manage-cities"
            options={{
              presentation: "formSheet",
              sheetGrabberVisible: true,
              headerTransparent: Platform.OS === "ios",
              contentStyle:
                Platform.OS === "ios" && isLiquidGlassAvailable()
                  ? { backgroundColor: "transparent" as const }
                  : undefined,
              title: t("manage"),
            }}
          />
          <Stack.Screen
            name="jump-time"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.7, 1],
              sheetGrabberVisible: true,
              title: t("jump"),
              headerTransparent: Platform.OS === "ios",
              contentStyle:
                Platform.OS === "ios" && isLiquidGlassAvailable()
                  ? { backgroundColor: "transparent" as const }
                  : undefined,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.6, 1],
              sheetGrabberVisible: true,
              title: t("settings"),
              headerTransparent: Platform.OS === "ios",
              contentStyle:
                Platform.OS === "ios" && isLiquidGlassAvailable()
                  ? { backgroundColor: "transparent" as const }
                  : undefined,
            }}
          />
        </Stack>
      </ThemeProvider>
      <StatusBar style={dark ? "light" : "dark"} />
    </>
  );
}
