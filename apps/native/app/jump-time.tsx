import { NativeAction } from "@/src/components/native-action";
import { useTimeGrid } from "@/src/context/timegrid";
import {
  effectiveHourFormat,
  formatDateTime,
  offsetLabel,
  resolveWallTime,
  zonedParts,
  type WallTime,
} from "@/src/domain/time";
import {
  DESTRUCTIVE_COLOR,
  useBrandColors,
  useSystemColors,
} from "@/theme/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCalendars } from "expo-localization";
import { router, Stack } from "expo-router";
import { Text } from "@codewithbeto/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, View, useWindowDimensions } from "react-native";

function initialDraft(instant: number, timeZone: string) {
  const wall = zonedParts(instant, timeZone);
  return new Date(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute);
}

export default function JumpTime() {
  const { homeCity, selectedInstantMs, preferences, jumpTo } = useTimeGrid();
  const system = useSystemColors();
  const brand = useBrandColors();
  const { width } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(width - 40);
  const { t, i18n } = useTranslation("timegrid");
  const locale = i18n.resolvedLanguage ?? "en";
  const calendars = useCalendars();
  const hourFormat = effectiveHourFormat(
    preferences.hourFormat,
    calendars[0]?.uses24hourClock ?? null,
  );
  const [draft, setDraft] = useState(() =>
    initialDraft(selectedInstantMs, homeCity?.timeZone ?? "UTC"),
  );
  const [picker, setPicker] = useState<"date" | "time" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ambiguous, setAmbiguous] = useState<number[]>([]);

  const commit = () => {
    if (!homeCity) {
      setError(t("noHome"));
      return;
    }
    const wall: WallTime = {
      year: draft.getFullYear(),
      month: draft.getMonth() + 1,
      day: draft.getDate(),
      hour: draft.getHours(),
      minute: draft.getMinutes(),
    };
    if (Number.isNaN(draft.getTime())) {
      setError(t("invalidTime"));
      return;
    }
    const matches = resolveWallTime(wall, homeCity.timeZone);
    if (!matches.length) {
      setError(t("skippedTime"));
      setAmbiguous([]);
      return;
    }
    if (matches.length > 1) {
      setError(null);
      setAmbiguous(matches);
      return;
    }
    jumpTo(matches[0]);
    router.back();
  };

  const choose = (instant: number) => {
    jumpTo(instant);
    router.back();
  };
  const onChange = (mode: "date" | "time", chosen?: Date) => {
    setPicker(null);
    if (!chosen) return;
    setError(null);
    setAmbiguous([]);
    setDraft((current) => {
      const next = new Date(current);
      if (mode === "date")
        next.setFullYear(
          chosen.getFullYear(),
          chosen.getMonth(),
          chosen.getDate(),
        );
      else next.setHours(chosen.getHours(), chosen.getMinutes(), 0, 0);
      return next;
    });
  };

  const isIos = Platform.OS === "ios";
  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(draft);
  const timeLabel = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: hourFormat === "system" ? undefined : hourFormat === "12h",
  }).format(draft);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: system.background }}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width - 40)}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 20, paddingBottom: 38, gap: 17 }}
    >
      <Stack.Screen options={{ title: t("jump") }} />
      <Text style={{ color: system.secondaryText, fontSize: 15 }}>
        {t("jumpHint")}
      </Text>
      {homeCity && (
        <Text style={{ color: brand.primary, fontSize: 15, fontWeight: "600" }}>
          {homeCity.name} · {homeCity.timeZone}
        </Text>
      )}
      {isIos ? (
        <View
          style={{
            backgroundColor: system.secondaryBackground,
            borderRadius: 16,
            padding: 14,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: 45,
            }}
          >
            <Text style={{ color: system.text, fontSize: 16 }}>
              {dateLabel}
            </Text>
            <DateTimePicker
              value={draft}
              mode="date"
              display="compact"
              onChange={(_, value) => onChange("date", value)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: 45,
            }}
          >
            <Text style={{ color: system.text, fontSize: 16 }}>
              {timeLabel}
            </Text>
            <DateTimePicker
              value={draft}
              mode="time"
              display="compact"
              onChange={(_, value) => onChange("time", value)}
            />
          </View>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <NativeAction
            label={dateLabel}
            alignment="leading"
            onPress={() => setPicker("date")}
            width={contentWidth}
            height={54}
            contentStyle={{
              backgroundColor: system.secondaryBackground,
              borderRadius: 14,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: system.text, fontSize: 16 }}>
              {dateLabel}
            </Text>
          </NativeAction>
          <NativeAction
            label={timeLabel}
            alignment="leading"
            onPress={() => setPicker("time")}
            width={contentWidth}
            height={54}
            contentStyle={{
              backgroundColor: system.secondaryBackground,
              borderRadius: 14,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: system.text, fontSize: 16 }}>
              {timeLabel}
            </Text>
          </NativeAction>
          {picker && (
            <DateTimePicker
              value={draft}
              mode={picker}
              display="default"
              onChange={(_, value) => onChange(picker, value)}
            />
          )}
        </View>
      )}
      {error && (
        <Text
          accessibilityRole="alert"
          style={{ color: DESTRUCTIVE_COLOR, fontSize: 14 }}
        >
          {error}
        </Text>
      )}
      {ambiguous.length > 0 && homeCity && (
        <View style={{ gap: 9 }}>
          <Text style={{ color: system.text, fontSize: 14 }}>
            {t("repeatedTime")}
          </Text>
          {ambiguous.map((instant) => (
            <NativeAction
              key={instant}
              label={`${formatDateTime(instant, homeCity.timeZone, hourFormat, locale)} · ${offsetLabel(instant, homeCity.timeZone)}`}
              alignment="leading"
              onPress={() => choose(instant)}
              width={contentWidth}
              height={52}
              contentStyle={{
                paddingHorizontal: 15,
                borderRadius: 12,
                backgroundColor: system.secondaryBackground,
              }}
            >
              <Text style={{ color: system.text, fontSize: 15 }}>
                {formatDateTime(instant, homeCity.timeZone, hourFormat, locale)}{" "}
                · {offsetLabel(instant, homeCity.timeZone)}
              </Text>
            </NativeAction>
          ))}
        </View>
      )}
      <NativeAction
        label={t("jumpAction")}
        onPress={commit}
        width={contentWidth}
        height={52}
        style={{ marginTop: 8 }}
        contentStyle={{ borderRadius: 14, backgroundColor: brand.primary, alignItems: "center" }}
      >
        <Text
          style={{ color: brand.onPrimary, fontSize: 16, fontWeight: "700" }}
        >
          {t("jumpAction")}
        </Text>
      </NativeAction>
    </ScrollView>
  );
}
