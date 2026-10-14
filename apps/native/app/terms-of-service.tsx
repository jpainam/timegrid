import { LegalScreen } from "@/components/screens/LegalScreen";
import { getTermsOfServiceSections } from "@/config/legal";

export default function TermsOfServiceScreen() {
  return <LegalScreen title="Terms of Service" sections={getTermsOfServiceSections()} />;
}
