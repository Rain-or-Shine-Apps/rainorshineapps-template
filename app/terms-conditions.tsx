import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';


const APP_NAME = 'APP_NAME';
const SUPPORT_EMAIL = 'support@rainorshineapps.com';

export default function TermsConditionsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <FileText size={20} color={colors.accent} />
        <Text style={styles.title}>Terms & Conditions</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        {[
          { title: '1. Acceptance of Terms', text: `By using ${APP_NAME}, you agree to these terms. If you do not agree, please do not use our service.` },
          { title: '2. Use of Service', text: `${APP_NAME} is provided for lawful purposes only. You agree not to misuse the service.` },
          { title: '3. User Accounts', text: 'You are responsible for maintaining the security of your account and all activities that occur under it.' },
          { title: '4. User Content', text: `You retain rights to content you create in ${APP_NAME}. By making content public, you grant us a license to display it through the platform.` },
          { title: '5. Payments', text: 'Any purchases are final unless otherwise required by law. Restore purchases using the restore button on the pricing screen.' },
          { title: '6. Disclaimer', text: `${APP_NAME} is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.` },
          { title: '7. Limitation of Liability', text: `To the maximum extent permitted by law, ${APP_NAME} shall not be liable for indirect or consequential damages.` },
          { title: '8. Changes to Terms', text: 'We may update these terms at any time. Continued use of the service constitutes acceptance of new terms.' },
          { title: '9. Contact', text: `Questions? Contact us at ${SUPPORT_EMAIL}` },
        ].map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionText}>{section.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backButton: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, flex: 1 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 24, gap: 20,
  },
  lastUpdated: { fontSize: 12, color: colors.textMuted },
  section: { gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  sectionText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
});