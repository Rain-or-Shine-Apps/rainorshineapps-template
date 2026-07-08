import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';

export default function DeleteAccountScreen() {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    setDeleting(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // If you have tables that don't cascade-delete on auth.users(id), delete those
      // rows here first, client-side, the same way as any other table:
      // await supabase.from('your_table').delete().eq('user_id', user.id);

      // Deletes the auth user server-side (via a service-role Edge Function) — the client
      // can't delete its own auth account directly. See supabase/functions/delete-account.
      const { error: fnError } = await supabase.functions.invoke('delete-account');
      if (fnError) throw fnError;

      await supabase.auth.signOut();
      router.replace('/login');
    } catch (err) {
      setError('Failed to delete account. Please contact support.');
      setDeleting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.title}>Delete Account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.warning}>
          <AlertTriangle size={16} color={colors.danger} />
          <Text style={styles.warningText}>
            <Text style={styles.bold}>Warning:</Text> This cannot be undone. All your data will be permanently deleted.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>What will be deleted:</Text>
        {[
          'Your account and sign-in',
          'All your content and data',
        ].map(item => (
          <Text key={item} style={styles.bulletItem}>• {item}</Text>
        ))}
        <Text style={styles.note}>
          This doesn't cancel an active subscription — manage or cancel that separately via the App Store or Google Play.
        </Text>

        <Text style={styles.label}>
          Type <Text style={styles.mono}>DELETE</Text> to confirm
        </Text>
        <TextInput
          style={styles.input}
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder="DELETE"
          placeholderTextColor="#94a3b8"
          autoCapitalize="characters"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={deleting}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, (confirmText !== 'DELETE' || deleting) && styles.disabled]}
            onPress={handleDelete}
            disabled={confirmText !== 'DELETE' || deleting}
          >
            {deleting ? (
              <ActivityIndicator color={colors.surface} size="small" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            )}
          </TouchableOpacity>
        </View>
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
    borderWidth: 1, borderColor: colors.border, padding: 24, gap: 16,
  },
  warning: {
    flexDirection: 'row', gap: 8,
    backgroundColor: colors.dangerBg, borderWidth: 1,
    borderColor: colors.dangerBorder, borderRadius: 8, padding: 12,
  },
  warningText: { flex: 1, fontSize: 13, color: colors.danger },
  bold: { fontWeight: 'bold' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  bulletItem: { fontSize: 13, color: colors.textSecondary, marginLeft: 8 },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 17 },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  mono: { fontFamily: 'monospace', fontWeight: 'bold' },
  input: {
    height: 44, borderWidth: 1, borderColor: colors.inputBorder,
    borderRadius: 8, paddingHorizontal: 12, fontSize: 16,
    letterSpacing: 2,
  },
  error: { fontSize: 13, color: colors.danger },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: {
    flex: 1, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: colors.inputBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelButtonText: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  deleteButton: {
    flex: 1, height: 44, borderRadius: 12,
    backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center',
  },
  deleteButtonText: { fontSize: 15, color: colors.surface, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
