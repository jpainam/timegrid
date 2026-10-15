import { NativeAction } from "@/src/components/native-action";
import { useTimeGrid } from "@/src/context/timegrid";
import {
  countryName,
  flagFor,
  searchCities,
  type City,
} from "@/src/domain/cities";
import { useBrandColors, useSystemColors } from "@/theme/colors";
import { Text } from "@codewithbeto/ui";
import { router, Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddCity() {
  const system = useSystemColors();
  const brand = useBrandColors();
  const { t, i18n } = useTranslation("timegrid");
  const locale = i18n.resolvedLanguage ?? "en";
  const { preferences, addCity } = useTimeGrid();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCities(query, locale), [query, locale]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [listWidth, setListWidth] = useState(width);

  const renderItem = ({ item }: { item: City }) => {
    const added = preferences.orderedCityIds.includes(item.id);
    return (
      <NativeAction
        onPress={() => {
          if (!added) {
            addCity(item.id);
            router.back();
          }
        }}
        disabled={added}
        label={`${item.name}, ${countryName(item.countryCode, locale)}, ${item.timeZone}${added ? `, ${t("alreadyAdded")}` : ""}`}
        alignment="leading"
        width={listWidth}
        height={68}
        contentStyle={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 19,
          gap: 13,
          borderBottomWidth: 1,
          borderBottomColor: system.separator,
        }}
      >
        <Text style={{ fontSize: 24 }}>{flagFor(item.countryCode)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: system.text, fontSize: 16, fontWeight: "600" }}>
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{ color: system.secondaryText, fontSize: 12 }}
          >
            {[item.region, countryName(item.countryCode, locale)]
              .filter(Boolean)
              .join(" · ")}{" "}
            · {item.timeZone}
          </Text>
        </View>
        {added ? (
          <Text style={{ color: system.secondaryText, fontSize: 12 }}>
            {t("alreadyAdded")}
          </Text>
        ) : (
          <SymbolView
            name={{
              ios: "plus.circle",
              android: "add_circle",
              web: "add_circle",
            }}
            size={24}
            tintColor={brand.primary}
          />
        )}
      </NativeAction>
    );
  };

  return (
    <Stack.Screen options={{ title: t("add") }}>
      <Stack.SearchBar
        placeholder={t("search")}
        hideWhenScrolling={false}
        onChangeText={(event) => setQuery(event.nativeEvent.text)}
        onCancelButtonPress={() => setQuery("")}
      />

      <FlatList
        data={results}
        onLayout={(event) => setListWidth(event.nativeEvent.layout.width)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListEmptyComponent={
          <View style={{ padding: 26 }}>
            <Text style={{ color: system.secondaryText, textAlign: "center" }}>
              {t("noResults")}
            </Text>
          </View>
        }
      />
    </Stack.Screen>
  );
}
