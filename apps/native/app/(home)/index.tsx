import {
  androidHeaderActions,
  ScreenAction,
  ScreenHeader,
  ScreenToolbar,
} from "@/components/navigation";
import { appConfig } from "@/config/app";
import { TimeGridScreen } from "@/src/components/time-grid";
import { useBrandColors } from "@/theme/colors";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Index() {
  const brand = useBrandColors();
  const { t } = useTranslation("timegrid");

  const actions: ScreenAction[] = [
    {
      key: "manage",
      label: t("manage"),
      onPress: () => {
        router.push("/manage-cities");
      },
      ios: {
        icon: "line.3.horizontal",
        variant: "plain",
        tintColor: brand.primary,
      },
      android: {
        icon: "menu",
      },
    },
    {
      key: "settings",
      label: t("settings"),
      onPress: () => {
        router.push("/settings");
      },
      ios: {
        icon: "gear",
        variant: "plain",
      },
      android: {
        icon: "settings",
      },
    },
    {
      key: "add",
      label: t("add"),
      onPress: () => {
        router.push("/add-city");
      },
      ios: {
        icon: "plus",
        variant: "plain",
      },
    },
  ];
  return (
    <Stack.Screen
      options={{
        title: appConfig.name,
        //headerLargeTitleEnabled: true,
        ...androidHeaderActions(actions),
      }}
    >
      <ScreenHeader />
      <ScreenToolbar actions={actions} placement="right" />
      <TimeGridScreen />
    </Stack.Screen>
  );
}
