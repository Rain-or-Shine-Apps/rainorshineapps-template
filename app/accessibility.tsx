import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Eye, Type, Moon } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccessibilityScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}
          accessibilityLabel="Go back" accessibilityRole="button">
          <ArrowLeft size={16} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={styles.title}>Accessibility</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Moon size={18} color="#4f46e5" />
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
          <Type size={18} color="#4f46e5" />
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
          <Eye size={18} color="#4f46e5" />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backButton: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  card: {
    backgroundColor: '#ffffff', borderRadius: 16,
    borderWidth: 1, borderColor: '#f1f5f9', padding: 20, gap: 12,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  infoText: { fontSize: 13, color: '#64748b', lineHeight: 20 },
  instructionBox: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 12, gap: 4 },
  instructionTitle: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  instructionText: { fontSize: 12, color: '#64748b' },
});