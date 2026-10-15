import { NativeAction } from "@/src/components/native-action";
import { useTimeGrid } from "@/src/context/timegrid";
import { countryName, flagFor, type City } from "@/src/domain/cities";
import {
  effectiveHourFormat,
  formatDate,
  formatDateTime,
  formatTime,
  HOUR_MS,
  instantAtRow,
  isRepeatedWallTime,
  localDateKey,
  offsetLabel,
  utcHour,
  zonedParts,
} from "@/src/domain/time";
import {
  useBrandColors,
  useSystemColors,
  type ResolvedBrand,
  type SystemColors,
} from "@/theme/colors";
import { Text } from "@codewithbeto/ui";
import { useCalendars } from "expo-localization";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableScale } from "pressto";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppState,
  FlatList,
  PixelRatio,
  useWindowDimensions,
  View,
  type ListRenderItem,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

const BASE_ROW_HEIGHT = 82;
const ROW_COUNT = 10001;
const CENTER = 5000;
const ROWS = Array.from({ length: ROW_COUNT }, (_, index) => index);

function HeaderCell({
  city,
  isHome,
  width,
  system,
  brand,
  homeLabel,
  locale,
}: {
  city: City;
  isHome: boolean;
  width: number;
  system: SystemColors;
  brand: ResolvedBrand;
  homeLabel: string;
  locale: string;
}) {
  return (
    <View
      style={{
        width,
        height: 91,
        paddingHorizontal: 10,
        paddingTop: 12,
        backgroundColor: system.secondaryBackground,
        borderRightWidth: 1,
        borderRightColor: system.separator,
        borderBottomWidth: isHome ? 2 : 0,
        borderBottomColor: brand.primary,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20 }}>{flagFor(city.countryCode)}</Text>
      <Text
        numberOfLines={1}
        style={{
          marginTop: 3,
          fontSize: 16,
          fontWeight: "600",
          color: system.text,
        }}
      >
        {city.name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          marginTop: 1,
          fontSize: 10,
          color: system.secondaryText,
          letterSpacing: 0.5,
        }}
      >
        {isHome ? homeLabel : countryName(city.countryCode, locale)}
      </Text>
    </View>
  );
}

function TimeCell({
  city,
  instant,
  previous,
  selected,
  isHome,
  width,
  rowHeight,
  system,
  brand,
  hourFormat,
  locale,
  onSelect,
}: {
  city: City;
  instant: number;
  previous: number;
  selected: boolean;
  isHome: boolean;
  width: number;
  rowHeight: number;
  system: SystemColors;
  brand: ResolvedBrand;
  hourFormat: "system" | "12h" | "24h";
  locale: string;
  onSelect: () => void;
}) {
  const wall = zonedParts(instant, city.timeZone);
  const newDate =
    localDateKey(instant, city.timeZone) !==
    localDateKey(previous, city.timeZone);
  const repeated = isRepeatedWallTime(instant, city.timeZone);
  const localDate = formatDate(instant, city.timeZone, locale);
  const offset = offsetLabel(instant, city.timeZone);
  const night = wall.hour < 6 || wall.hour >= 22;
  const backgroundColor =
    isHome || !night ? system.secondaryBackground : system.background;
  return (
    <NativeAction
      onPress={onSelect}
      selected={selected}
      width={width}
      height={rowHeight}
      label={`${city.name}, ${formatDateTime(instant, city.timeZone, hourFormat, locale)}${repeated ? `, ${offset}` : ""}`}
      contentStyle={{
        alignItems: "center",
        backgroundColor,
        borderRightWidth: 1,
        borderRightColor: system.separator,
        borderBottomWidth: selected ? 2 : 1,
        borderBottomColor: selected ? brand.primary : system.separator,
        borderTopWidth: selected ? 2 : 0,
        borderTopColor: brand.primary,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: selected ? "700" : "500",
          fontVariant: ["tabular-nums"],
          color: system.text,
        }}
      >
        {formatTime(instant, city.timeZone, hourFormat, locale)}
      </Text>
      {(newDate || repeated) && (
        <Text
          numberOfLines={1}
          style={{
            marginTop: 3,
            fontSize: 11,
            color: selected ? brand.primary : system.secondaryText,
          }}
        >
          {newDate ? localDate : ""}
          {newDate && repeated ? " · " : ""}
          {repeated ? offset : ""}
        </Text>
      )}
    </NativeAction>
  );
}

function ScrollingStrip({
  cities,
  first,
  count,
  columnWidth,
  offset,
  system,
  renderCell,
}: {
  cities: City[];
  first: number;
  count: number;
  columnWidth: number;
  offset: SharedValue<number>;
  system: SystemColors;
  renderCell: (city: City) => React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: -(offset.value - first * columnWidth) }],
    }),
    [first, columnWidth],
  );
  return (
    <View
      style={{
        flex: 1,
        overflow: "hidden",
        backgroundColor: system.background,
      }}
    >
      <Animated.View
        style={[
          { flexDirection: "row", width: count * columnWidth },
          animatedStyle,
        ]}
      >
        {cities.slice(first, first + count).map((city) => (
          <View key={city.id}>{renderCell(city)}</View>
        ))}
      </Animated.View>
    </View>
  );
}

function GridRow({
  index,
  anchor,
  home,
  others,
  first,
  count,
  columnWidth,
  rowHeight,
  offset,
  system,
  brand,
  selectedInstant,
  hourFormat,
  locale,
  select,
}: {
  index: number;
  anchor: number;
  home: City;
  others: City[];
  first: number;
  count: number;
  columnWidth: number;
  rowHeight: number;
  offset: SharedValue<number>;
  system: SystemColors;
  brand: ResolvedBrand;
  selectedInstant: number;
  hourFormat: "system" | "12h" | "24h";
  locale: string;
  select: (instant: number) => void;
}) {
  const instant = instantAtRow(anchor, index);
  const previous = instant - HOUR_MS;
  const selected = instant === selectedInstant;
  const onSelect = () => select(instant);
  return (
    <View style={{ height: rowHeight, flexDirection: "row" }}>
      <TimeCell
        city={home}
        instant={instant}
        previous={previous}
        selected={selected}
        isHome
        width={columnWidth}
        rowHeight={rowHeight}
        system={system}
        brand={brand}
        hourFormat={hourFormat}
        locale={locale}
        onSelect={onSelect}
      />
      <ScrollingStrip
        cities={others}
        first={first}
        count={count}
        columnWidth={columnWidth}
        offset={offset}
        system={system}
        renderCell={(city) => (
          <TimeCell
            city={city}
            instant={instant}
            previous={previous}
            selected={selected}
            isHome={false}
            width={columnWidth}
            rowHeight={rowHeight}
            system={system}
            brand={brand}
            hourFormat={hourFormat}
            locale={locale}
            onSelect={onSelect}
          />
        )}
      />
    </View>
  );
}

export function TimeGridScreen() {
  const {
    preferences,
    orderedCities,
    homeCity,
    error,
    clearError,
    selectedInstantMs,
    setSelectedInstantMs,
    jumpRequest,
    jumpTo,
  } = useTimeGrid();
  const system = useSystemColors();
  const brand = useBrandColors();
  const { t, i18n } = useTranslation("timegrid");
  const locale = i18n.resolvedLanguage ?? "en";
  const calendars = useCalendars();
  const hourFormat = effectiveHourFormat(
    preferences.hourFormat,
    calendars[0]?.uses24hourClock ?? null,
  );
  const { width } = useWindowDimensions();
  const rowHeight = Math.round(
    BASE_ROW_HEIGHT * Math.max(1, Math.min(1.8, PixelRatio.getFontScale())),
  );
  const columnWidth = Math.max(
    126,
    Math.min(
      188,
      Math.floor(width / 3.25) +
        Math.max(0, PixelRatio.getFontScale() - 1) * 38,
    ),
  );
  const rightWidth = Math.max(0, width - columnWidth);
  const home = homeCity;
  const others = useMemo(
    () => orderedCities.filter((city) => city.id !== home?.id),
    [orderedCities, home?.id],
  );
  const offset = useSharedValue(0);
  const gestureStart = useSharedValue(0);
  const maxOffset = Math.max(0, others.length * columnWidth - rightWidth);
  const [first, setFirst] = useState(0);
  const count = Math.ceil(rightWidth / columnWidth) + 4;
  const [anchor, setAnchor] = useState(
    () => utcHour(Date.now()) - CENTER * HOUR_MS,
  );
  const [visibleInstant, setVisibleInstant] = useState(() =>
    utcHour(Date.now()),
  );
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(CENTER - 3);
  const [viewportHeight, setViewportHeight] = useState(600);
  const listRef = useRef<FlatList<number>>(null);
  const lastJump = useRef<number | null>(null);
  const [clockMinute, setClockMinute] = useState(Date.now());
  const listExtraData = useMemo(
    () => [
      anchor,
      first,
      selectedInstantMs,
      hourFormat,
      system.background,
      system.secondaryBackground,
      system.text,
      system.secondaryText,
      system.separator,
      brand.primary,
      others.length,
      columnWidth,
      rowHeight,
    ],
    [
      anchor,
      first,
      selectedInstantMs,
      hourFormat,
      system.background,
      system.secondaryBackground,
      system.text,
      system.secondaryText,
      system.separator,
      brand.primary,
      others.length,
      columnWidth,
      rowHeight,
    ],
  );

  useEffect(() => {
    const timer = setInterval(() => setClockMinute(Date.now()), 60_000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setClockMinute(Date.now());
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);

  useAnimatedReaction(
    () => Math.max(0, Math.floor(offset.value / columnWidth) - 2),
    (value, previous) => {
      if (value !== previous) runOnJS(setFirst)(value);
    },
    [columnWidth],
  );

  useEffect(() => {
    if (offset.value > maxOffset) offset.value = maxOffset;
    setFirst(Math.max(0, Math.floor(offset.value / columnWidth) - 2));
  }, [maxOffset, columnWidth, offset]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-12, 12])
        .onStart(() => {
          gestureStart.value = offset.value;
        })
        .onUpdate((event) => {
          offset.value = Math.max(
            0,
            Math.min(maxOffset, gestureStart.value - event.translationX),
          );
        }),
    [gestureStart, offset, maxOffset],
  );

  useEffect(() => {
    if (!jumpRequest || lastJump.current === jumpRequest.token) return;
    lastJump.current = jumpRequest.token;
    const index = Math.round((jumpRequest.instantMs - anchor) / HOUR_MS);
    if (
      index > 10 &&
      index < ROW_COUNT - 10 &&
      instantAtRow(anchor, index) === jumpRequest.instantMs
    ) {
      listRef.current?.scrollToIndex({
        index: Math.max(0, index - 3),
        animated: false,
      });
    } else {
      setAnchor(jumpRequest.instantMs - CENTER * HOUR_MS);
    }
    setVisibleInstant(jumpRequest.instantMs);
  }, [jumpRequest, anchor]);

  const select = useCallback(
    (instant: number) => setSelectedInstantMs(instant),
    [setSelectedInstantMs],
  );
  const renderItem: ListRenderItem<number> = useCallback(
    ({ item }) =>
      home ? (
        <GridRow
          index={item}
          anchor={anchor}
          home={home}
          others={others}
          first={first}
          count={count}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
          offset={offset}
          system={system}
          brand={brand}
          selectedInstant={selectedInstantMs}
          hourFormat={hourFormat}
          locale={locale}
          select={select}
        />
      ) : null,
    [
      home,
      anchor,
      others,
      first,
      count,
      columnWidth,
      rowHeight,
      offset,
      system,
      brand,
      selectedInstantMs,
      hourFormat,
      locale,
      select,
    ],
  );

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const index = Math.max(
        0,
        Math.min(
          ROW_COUNT - 1,
          Math.floor(event.nativeEvent.contentOffset.y / rowHeight),
        ),
      );
      setFirstVisibleIndex((current) => (current === index ? current : index));
      const instant = instantAtRow(anchor, index);
      setVisibleInstant((current) => (current === instant ? current : instant));
    },
    [anchor, rowHeight],
  );

  const recenter = useCallback(() => {
    if (firstVisibleIndex < 500 || firstVisibleIndex > ROW_COUNT - 500) {
      setAnchor(
        instantAtRow(anchor, firstVisibleIndex) - (CENTER - 3) * HOUR_MS,
      );
    }
  }, [anchor, firstVisibleIndex]);

  const moveDay = (direction: number) => {
    if (!home) return;
    jumpTo(selectedInstantMs + direction * 24 * HOUR_MS);
  };

  const selectedVisible =
    selectedInstantMs >= instantAtRow(anchor, firstVisibleIndex) &&
    selectedInstantMs <
      instantAtRow(
        anchor,
        firstVisibleIndex + Math.ceil(viewportHeight / rowHeight),
      );
  const dateTitle = home
    ? formatDate(visibleInstant, home.timeZone, locale, true)
    : "";
  const isToday =
    home &&
    localDateKey(visibleInstant, home.timeZone) ===
      localDateKey(clockMinute, home.timeZone);

  return (
    <View style={{ flex: 1, backgroundColor: system.background }}>
      {error && (
        <NativeAction
          label={`${error} · ${t("dismiss")}`}
          onPress={clearError}
          alignment="leading"
          width={width}
          height={44}
          contentStyle={{
            paddingHorizontal: 10,
            backgroundColor: system.secondaryBackground,
          }}
        >
          <Text style={{ color: system.text }}>
            {error} · {t("dismiss")}
          </Text>
        </NativeAction>
      )}

      {!home ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 30,
            gap: 12,
          }}
        >
          <SymbolView
            name={{ ios: "globe", android: "public", web: "public" }}
            size={46}
            tintColor={brand.primary}
          />
          <Text
            style={{
              fontSize: 21,
              fontWeight: "700",
              color: system.text,
              textAlign: "center",
            }}
          >
            {t("emptyTitle")}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: system.secondaryText,
              textAlign: "center",
            }}
          >
            {t("emptyBody")}
          </Text>
          <NativeAction
            label={t("add")}
            onPress={() => router.push("/add-city")}
            width={104}
            height={46}
            style={{ marginTop: 10 }}
            contentStyle={{
              borderRadius: 14,
              backgroundColor: brand.primary,
              alignItems: "center",
            }}
          >
            <Text style={{ color: brand.onPrimary, fontWeight: "700" }}>
              {t("add")}
            </Text>
          </NativeAction>
        </View>
      ) : (
        <>
          <View
            style={{
              //paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <PressableScale
              onPress={() => router.push("/jump-time")}
              accessibilityRole="button"
              accessibilityLabel={t("jump")}
              style={{
                width: Math.max(140, width - 128),
                height: 48,
                flexDirection: "row",
                alignItems: "center",
                gap: 9,
              }}
            >
              <SymbolView
                name={{
                  ios: "calendar",
                  android: "calendar_today",
                  web: "calendar_today",
                }}
                size={21}
                tintColor={brand.primary}
              />
              <View style={{ flexShrink: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: system.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {dateTitle}
                </Text>
                {isToday && (
                  <Text
                    style={{
                      color: brand.primary,
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    {t("today")}
                  </Text>
                )}
              </View>
            </PressableScale>
            <NativeAction
              label={t("now")}
              onPress={() => jumpTo(utcHour(Date.now()))}
              width={88}
              height={44}
              contentStyle={{
                paddingHorizontal: 12,
                borderRadius: 13,
                backgroundColor: system.secondaryBackground,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <SymbolView
                name={{
                  ios: "arrow.clockwise",
                  android: "refresh",
                  web: "refresh",
                }}
                size={16}
                tintColor={system.text}
              />
              <Text
                style={{ color: system.text, fontSize: 14, fontWeight: "600" }}
              >
                {t("now")}
              </Text>
            </NativeAction>
          </View>

          <GestureDetector gesture={pan}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: 91,
                  flexDirection: "row",
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: system.separator,
                }}
              >
                <HeaderCell
                  city={home}
                  isHome
                  width={columnWidth}
                  system={system}
                  brand={brand}
                  homeLabel={t("home")}
                  locale={locale}
                />
                <ScrollingStrip
                  cities={others}
                  first={first}
                  count={count}
                  columnWidth={columnWidth}
                  offset={offset}
                  system={system}
                  renderCell={(city) => (
                    <HeaderCell
                      city={city}
                      isHome={false}
                      width={columnWidth}
                      system={system}
                      brand={brand}
                      homeLabel={t("home")}
                      locale={locale}
                    />
                  )}
                />
              </View>
              <FlatList
                key={`${anchor}-${rowHeight}`}
                ref={listRef}
                data={ROWS}
                renderItem={renderItem}
                keyExtractor={String}
                initialScrollIndex={CENTER - 3}
                getItemLayout={(_, index) => ({
                  length: rowHeight,
                  offset: rowHeight * index,
                  index,
                })}
                extraData={listExtraData}
                onScroll={onScroll}
                scrollEventThrottle={64}
                onMomentumScrollEnd={recenter}
                onScrollEndDrag={recenter}
                onLayout={(event) =>
                  setViewportHeight(event.nativeEvent.layout.height)
                }
                showsVerticalScrollIndicator={false}
                initialNumToRender={12}
                maxToRenderPerBatch={12}
                windowSize={7}
                contentInsetAdjustmentBehavior="never"
                removeClippedSubviews
              />
            </View>
          </GestureDetector>
        </>
      )}
    </View>
  );
}
