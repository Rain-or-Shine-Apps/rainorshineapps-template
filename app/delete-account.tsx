import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

      // ADD YOUR DATA DELETION LOGIC HERE
      // Example: await supabase.from('your_table').delete().eq('user_id', user.id);

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
          <ArrowLeft size={16} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={styles.title}>Delete Account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.warning}>
          <AlertTriangle size={16} color="#dc2626" />
          <Text style={styles.warningText}>
            <Text style={styles.bold}>Warning:</Text> This cannot be undone. All your data will be permanently deleted.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>What will be deleted:</Text>
        {[
          'Your account and profile',
          'All your content and data',
          'Your subscription status',
        ].map(item => (
          <Text key={item} style={styles.bulletItem}>• {item}</Text>
        ))}

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
              <ActivityIndicator color="#ffffff" size="small" />
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
    borderWidth: 1, borderColor: '#f1f5f9', padding: 24, gap: 16,
  },
  warning: {
    flexDirection: 'row', gap: 8,
    backgroundColor: '#fef2f2', borderWidth: 1,
    borderColor: '#fecaca', borderRadius: 8, padding: 12,
  },
  warningText: { flex: 1, fontSize: 13, color: '#991b1b' },
  bold: { fontWeight: 'bold' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  bulletItem: { fontSize: 13, color: '#64748b', marginLeft: 8 },
  label: { fontSize: 13, fontWeight: '500', color: '#475569' },
  mono: { fontFamily: 'monospace', fontWeight: 'bold' },
  input: {
    height: 44, borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 8, paddingHorizontal: 12, fontSize: 16,
    letterSpacing: 2,
  },
  error: { fontSize: 13, color: '#dc2626' },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: {
    flex: 1, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelButtonText: { fontSize: 15, color: '#1e293b', fontWeight: '500' },
  deleteButton: {
    flex: 1, height: 44, borderRadius: 12,
    backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center',
  },
  deleteButtonText: { fontSize: 15, color: '#ffffff', fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
