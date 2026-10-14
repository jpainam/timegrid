import { Text } from "@codewithbeto/ui";
import { ScrollView, StyleSheet, View } from "react-native";

import { appConfig } from "@/config/app";
import type { LegalSection } from "@/config/legal";
import { useSystemColors } from "@/theme/colors";
import { SPACING } from "@/theme/dimensions";

type Props = {
  title: string;
  sections: LegalSection[];
};

export function LegalScreen({ title, sections }: Props) {
  const { text, secondaryText, link } = useSystemColors();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        <Text type="2xl" weight="700" style={[styles.title, { color: text }]}>
          {title}
        </Text>
        <Text type="xs" style={[styles.lastUpdated, { color: secondaryText }]}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text type="lg" weight="700" style={{ color: text, marginBottom: SPACING.SM }}>
              {section.title}
            </Text>

            {section.paragraphs.map((p) => (
              <Text key={p} type="sm" style={[styles.paragraph, { color: secondaryText }]}>
                {p}
              </Text>
            ))}

            {section.bullets?.map((b) => (
              <Text key={b} type="sm" style={[styles.bullet, { color: secondaryText }]}>
                {`\u2022  ${b}`}
              </Text>
            ))}

            {section.subsections?.map((sub) => (
              <View key={sub.title} style={{ marginTop: SPACING.SM }}>
                <Text type="default" weight="600" style={{ color: text, marginBottom: SPACING.XS }}>
                  {sub.title}
                </Text>
                {sub.bullets.map((b) => (
                  <Text key={b} type="sm" style={[styles.bullet, { color: secondaryText }]}>
                    {`\u2022  ${b}`}
                  </Text>
                ))}
              </View>
            ))}

            {section === sections[sections.length - 1] && (
              <Text type="sm" style={{ color: link, marginTop: SPACING.XS }}>
                Email: {appConfig.contactEmail}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: SPACING.XXL,
  },
  content: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: SPACING.XS,
  },
  lastUpdated: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: SPACING.XL,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  paragraph: {
    lineHeight: 22,
    marginBottom: SPACING.XS,
  },
  bullet: {
    lineHeight: 22,
    marginBottom: SPACING.XXS,
    marginLeft: SPACING.MD,
  },
});
