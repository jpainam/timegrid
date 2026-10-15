import { NativeAction } from '@/src/components/native-action';
import { useTimeGrid } from '@/src/context/timegrid';
import { countryName, flagFor, type City } from '@/src/domain/cities';
import { useTranslation } from 'react-i18next';
import { useBrandColors, useSystemColors } from '@/theme/colors';
import { Text } from '@codewithbeto/ui';
import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { PanResponder, ScrollView, View, useWindowDimensions } from 'react-native';

function ManagedCity({ city, index, count }: { city: City; index: number; count: number }) {
  const { preferences, moveCity, removeCity, setHomeCity } = useTimeGrid();
  const { t, i18n } = useTranslation('timegrid');
  const locale = i18n.resolvedLanguage ?? 'en';
  const system = useSystemColors();
  const brand = useBrandColors();
  const isHome = preferences.homeCityId === city.id;
  const drag = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
    onPanResponderRelease: (_, gesture) => moveCity(city.id, index + Math.round(gesture.dy / 72)),
  }), [city.id, index, moveCity]);
  return <View style={{ minHeight: 72, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 10,
    borderBottomWidth: 1, borderBottomColor: system.separator, backgroundColor: system.secondaryBackground }}>
    <View {...drag.panHandlers} accessibilityLabel={`${t('drag')}: ${city.name}`} accessibilityRole="adjustable"
      style={{ width: 38, minHeight: 50, justifyContent: 'center', alignItems: 'center' }}>
      <SymbolView
        name={{ ios: 'line.3.horizontal', android: 'reorder', web: 'reorder' }}
        size={25}
        tintColor={system.secondaryText}
      />
    </View>
    <Text style={{ fontSize: 23 }}>{flagFor(city.countryCode)}</Text>
    <View style={{ flex: 1 }}>
      <Text style={{ color: system.text, fontSize: 16, fontWeight: '600' }}>{city.name}</Text>
      <Text numberOfLines={1} style={{ color: system.secondaryText, fontSize: 12 }}>{countryName(city.countryCode, locale)} · {city.timeZone}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <NativeAction onPress={() => setHomeCity(city.id)} label={`${t('setHome')}: ${city.name}`}
        width={44} height={44} contentStyle={{ alignItems: 'center' }}>
        <SymbolView
          name={{ ios: isHome ? 'house.fill' : 'house', android: 'home', web: 'home' }}
          size={20}
          tintColor={isHome ? brand.primary : system.secondaryText}
        />
      </NativeAction>
      <NativeAction onPress={() => moveCity(city.id, index - 1)} disabled={index === 0} label={`${t('up')}: ${city.name}`}
        width={40} height={44} contentStyle={{ alignItems: 'center' }}>
        <SymbolView
          name={{ ios: 'chevron.up', android: 'keyboard_arrow_up', web: 'keyboard_arrow_up' }}
          size={19}
          tintColor={index === 0 ? system.separator : system.secondaryText}
        />
      </NativeAction>
      <NativeAction onPress={() => moveCity(city.id, index + 1)} disabled={index === count - 1} label={`${t('down')}: ${city.name}`}
        width={40} height={44} contentStyle={{ alignItems: 'center' }}>
        <SymbolView
          name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' }}
          size={19}
          tintColor={index === count - 1 ? system.separator : system.secondaryText}
        />
      </NativeAction>
      <NativeAction onPress={() => removeCity(city.id)} label={`${t('remove')}: ${city.name}`}
        width={44} height={44} contentStyle={{ alignItems: 'center' }}>
        <SymbolView
          name={{ ios: 'trash', android: 'delete', web: 'delete' }}
          size={20}
          tintColor={system.secondaryText}
        />
      </NativeAction>
    </View>
  </View>;
}

export default function ManageCities() {
  const { orderedCities } = useTimeGrid();
  const system = useSystemColors();
  const brand = useBrandColors();
  const { width } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(width);
  const { t } = useTranslation('timegrid');
  return <View style={{ flex: 1, backgroundColor: system.background }}>
    <Stack.Screen options={{ title: t('manage') }} />
    <ScrollView contentInsetAdjustmentBehavior="automatic" onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)} contentContainerStyle={{ paddingTop: 15, paddingBottom: 30 }}>
      {orderedCities.map((city, index) => <ManagedCity key={city.id} city={city} index={index} count={orderedCities.length} />)}
      <NativeAction onPress={() => router.push('/add-city')} label={t('add')}
        alignment="leading"
        width={contentWidth} height={58} contentStyle={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 10 }}>
        <SymbolView
          name={{ ios: 'plus.circle', android: 'add_circle', web: 'add_circle' }}
          size={22}
          tintColor={brand.primary}
        />
        <Text style={{ color: brand.primary, fontSize: 16, fontWeight: '600' }}>{t('add')}</Text>
      </NativeAction>
    </ScrollView>
  </View>;
}
