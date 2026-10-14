import "@/i18n/i18next";

import { AppSettingsContext, AppSettingsProvider } from "@/context/AppSettings";

import { getNavigationTheme, getSystemColor } from "@/theme/colors";
import { BORDER_RADIUS } from "@/theme/dimensions";

import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { PressablesConfig } from "pressto";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster } from "sonner-native";

export default function RootLayout() {
  return (
    <>
      <AppSettingsProvider>
        <GestureHandlerRootView>
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
      </AppSettingsProvider>
    </>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const { settings } = use(AppSettingsContext);
  const { t } = useTranslation("settings");

  const dark = colorScheme === "dark";
  const brandPrimary = dark
    ? settings.brandPrimaryDark
    : settings.brandPrimaryLight;

  const hasAccess = settings.isOnboarded;

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
            name="privacy-policy"
            options={{
              title: t("privacyPolicy"),
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          <Stack.Screen
            name="terms-of-service"
            options={{
              title: t("termsOfService"),
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack>
      </ThemeProvider>
      <Toaster
        style={{
          backgroundColor: getSystemColor("secondaryBackground") as string,
          borderRadius: BORDER_RADIUS.MD,
        }}
      />
      <StatusBar style={dark ? "light" : "dark"} />
    </>
  );
}
