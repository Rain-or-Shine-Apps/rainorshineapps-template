import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Eye, Type, Moon, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';

export default function AccessibilityScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}
          accessibilityLabel="Go back" accessibilityRole="button">
          <ArrowLeft size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.title}>Accessibility</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Moon size={18} color={colors.accent} />
          <Text style={styles.cardTitle}>Dark Mode</Text>
        </View>
        <Text style={styles.infoText}>This app follows your device's system appearance setting.</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>iPhone / iPad</Text>
          <Text style={styles.instructionText}>Settings → Display & Brightness → Light / Dark</Text>
        </View>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Android</Text>
          <Text style={styles.instructionText}>Settings → Display → Dark Theme</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Type size={18} color={colors.accent} />
          <Text style={styles.cardTitle}>Text Size</Text>
        </View>
        <Text style={styles.infoText}>This app automatically respects your device's text size settings.</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>iPhone / iPad</Text>
          <Text style={styles.instructionText}>Settings → Display & Brightness → Text Size</Text>
        </View>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Android</Text>
          <Text style={styles.instructionText}>Settings → Display → Font Size</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Eye size={18} color={colors.accent} />
          <Text style={styles.cardTitle}>Screen Reader</Text>
        </View>
        <Text style={styles.infoText}>This app is built to work with your device's built-in screen reader.</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>iPhone / iPad — VoiceOver</Text>
          <Text style={styles.instructionText}>Settings → Accessibility → VoiceOver</Text>
        </View>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Android — TalkBack</Text>
          <Text style={styles.instructionText}>Settings → Accessibility → TalkBack</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Mail size={18} color={colors.accent} />
          <Text style={styles.cardTitle}>Contact Us</Text>
        </View>
        <Text style={styles.infoText}>If you experience any accessibility issues, please get in touch and we'll do our best to help.</Text>
        <TouchableOpacity onPress={() => router.push('/support')}>
          <Text style={styles.link}>Go to Support →</Text>
        </TouchableOpacity>
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
  title: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 20, gap: 12,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  instructionBox: { backgroundColor: colors.background, borderRadius: 8, padding: 12, gap: 4 },
  instructionTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  instructionText: { fontSize: 12, color: colors.textSecondary },
  link: { fontSize: 13, color: colors.accent, textDecorationLine: 'underline' },
});
