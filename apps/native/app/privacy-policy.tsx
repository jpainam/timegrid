import { LegalScreen } from "@/components/screens/LegalScreen";
import { getPrivacyPolicySections } from "@/config/legal";

export default function PrivacyPolicyScreen() {
  return <LegalScreen title="Privacy Policy" sections={getPrivacyPolicySections()} />;
}
