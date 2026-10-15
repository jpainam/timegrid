import { NativeAction } from "@/src/components/native-action";
import { useTimeGrid, type ThemeChoice } from "@/src/context/timegrid";
import type { HourFormat } from "@/src/domain/time";
import { useBrandColors, useSystemColors } from "@/theme/colors";
import { Text } from "@codewithbeto/ui";
import { router, Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions } from "react-native";

function Choice<T extends string>({
  label,
  value,
  selected,
  onPress,
  width,
}: {
  label: string;
  value: T;
  selected: boolean;
  onPress: (value: T) => void;
  width: number;
}) {
  const system = useSystemColors();
  const brand = useBrandColors();
  return (
    <NativeAction
      label={label}
      onPress={() => onPress(value)}
      selected={selected}
      alignment="leading"
      width={width}
      height={52}
      contentStyle={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: system.separator,
        backgroundColor: system.secondaryBackground,
      }}
    >
      <Text style={{ color: system.text, fontSize: 16 }}>{label}</Text>
      {selected && (
        <SymbolView
          name={{ ios: "checkmark", android: "check", web: "check" }}
          size={22}
          tintColor={brand.primary}
        />
      )}
    </NativeAction>
  );
}

export default function Settings() {
  const { preferences, setHourFormat, setTheme } = useTimeGrid();
  const { t } = useTranslation("timegrid");
  const system = useSystemColors();
  const { width } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(width);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "transparent" }}
      contentInsetAdjustmentBehavior="automatic"
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      contentContainerStyle={{ paddingTop: 18, paddingBottom: 30 }}
    >
      <Stack.Screen options={{ title: t("settings") }} />
      <Text
        style={{
          color: system.secondaryText,
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.8,
          paddingHorizontal: 18,
          paddingBottom: 8,
        }}
      >
        {t("hourFormat").toUpperCase()}
      </Text>
      {(
        [
          ["system", t("system")],
          ["12h", t("twelve")],
          ["24h", t("twentyFour")],
        ] as const
      ).map(([value, label]) => (
        <Choice<HourFormat>
          key={value}
          value={value}
          label={label}
          selected={preferences.hourFormat === value}
          onPress={setHourFormat}
          width={contentWidth}
        />
      ))}
      <Text
        style={{
          color: system.secondaryText,
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.8,
          paddingHorizontal: 18,
          paddingTop: 26,
          paddingBottom: 8,
        }}
      >
        {t("theme").toUpperCase()}
      </Text>
      {(
        [
          ["system", t("system")],
          ["light", t("light")],
          ["dark", t("dark")],
        ] as const
      ).map(([value, label]) => (
        <Choice<ThemeChoice>
          key={value}
          value={value}
          label={label}
          selected={preferences.theme === value}
          onPress={setTheme}
          width={contentWidth}
        />
      ))}
      <NativeAction
        label={t("manage")}
        onPress={() => router.push("/manage-cities")}
        alignment="leading"
        width={contentWidth}
        height={56}
        style={{ marginTop: 24 }}
        contentStyle={{
          paddingHorizontal: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: system.secondaryBackground,
        }}
      >
        <Text style={{ color: system.text, fontSize: 16 }}>{t("manage")}</Text>
        <SymbolView
          name={{
            ios: "chevron.right",
            android: "chevron_right",
            web: "chevron_right",
          }}
          size={18}
          tintColor={system.secondaryText}
        />
      </NativeAction>
    </ScrollView>
  );
}
