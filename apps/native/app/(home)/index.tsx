import { TimeGridScreen } from "@/src/components/time-grid";
import { useSystemColors } from "@/theme/colors";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const system = useSystemColors();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: system.background,
      }}
    >
      <TimeGridScreen />
    </View>
  );
}
