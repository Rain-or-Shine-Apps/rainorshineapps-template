import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';


// REPLACE APP_NAME with your app name
const APP_NAME = 'APP_NAME';
const SUPPORT_EMAIL = 'support@rainorshineapps.com';

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <Shield size={20} color={colors.accent} />
        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        {[
          { title: '1. Information We Collect', text: `We collect information you provide when creating an account, including your name and email address. We also collect content you create within ${APP_NAME}.` },
          { title: '2. How We Use Your Information', text: 'We use your information to provide and improve our services, send technical notices, and respond to your questions.' },
          { title: '3. Data Sharing', text: 'We do not sell your personal information. We may share it with service providers who help operate our platform, or when required by law.' },
          { title: '4. Data Security', text: 'We implement appropriate measures to protect your personal information against unauthorized access or disclosure.' },
          { title: '5. Your Rights', text: 'You can access, update, or delete your personal information at any time through your profile settings.' },
          { title: '6. Children\'s Privacy', text: 'Our service is not intended for children under 13. We do not knowingly collect information from children under 13.' },
          { title: '7. Changes to This Policy', text: 'We may update this policy from time to time. We will notify you of changes by posting the new policy on this page.' },
          { title: '8. Contact Us', text: `If you have questions about this Privacy Policy, contact us at ${SUPPORT_EMAIL}` },
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