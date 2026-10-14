import { NativeAction } from "@/src/components/native-action";
import { useTimeGrid } from "@/src/context/timegrid";
import {
  countryName,
  flagFor,
  searchCities,
  type City,
} from "@/src/domain/cities";
import { useTranslation } from 'react-i18next';
import { useBrandColors, useSystemColors } from "@/theme/colors";
import { Text } from "@codewithbeto/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, TextInput, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddCity() {
  const system = useSystemColors();
  const brand = useBrandColors();
  const { t, i18n } = useTranslation('timegrid');
  const locale = i18n.resolvedLanguage ?? 'en';
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
        label={`${item.name}, ${countryName(item.countryCode, locale)}, ${item.timeZone}${added ? `, ${t('alreadyAdded')}` : ""}`}
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
          <Text
            style={{ color: system.text, fontSize: 16, fontWeight: "600" }}
          >
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
            {t('alreadyAdded')}
          </Text>
        ) : (
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={brand.primary}
          />
        )}
      </NativeAction>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: system.background }}>
      <Stack.Screen options={{ title: t('add') }} />
      <View
        style={{
          margin: 16,
          minHeight: 48,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 13,
          gap: 9,
          borderRadius: 13,
          backgroundColor: system.secondaryBackground,
        }}
      >
        <Ionicons name="search-outline" size={20} color={system.secondaryText} />
        <TextInput
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder={t('search')}
          placeholderTextColor={system.secondaryText}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ flex: 1, color: system.text, fontSize: 16, minHeight: 46 }}
        />
        {!!query && (
          <NativeAction
            onPress={() => setQuery("")}
            label={t('dismiss')}
            width={44}
            height={44}
            contentStyle={{ alignItems: "center" }}
          >
            <Ionicons name="close-circle" size={20} color={system.secondaryText} />
          </NativeAction>
        )}
      </View>
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
              {t('noResults')}
            </Text>
          </View>
        }
      />
    </View>
  );
}
