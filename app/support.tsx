import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, HelpCircle, Check, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// REPLACE with your support email
const SUPPORT_EMAIL = 'support@rainorshineapps.com';

export default function SupportScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
      if (user?.user_metadata?.full_name) setName(user.user_metadata.full_name);
    });
  }, []);

  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    const subject = encodeURIComponent(`Support Request from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    await Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
    setSending(false);
    setSent(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color="#94a3b8" />
        </TouchableOpacity>
        <HelpCircle size={20} color="#4f46e5" />
        <Text style={styles.title}>Support</Text>
      </View>

      <View style={styles.card}>
        {sent ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Check size={28} color="#059669" />
            </View>
            <Text style={styles.successTitle}>Message Sent!</Text>
            <Text style={styles.successText}>Thanks for reaching out. We'll get back to you as soon as possible.</Text>
            <TouchableOpacity style={styles.outlineButton} onPress={() => router.back()}>
              <Text style={styles.outlineButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.subtitle}>Have a question? Fill in the form below and we'll get back to you.</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.label}>Message</Text>
            <TextInput style={styles.textarea} value={message} onChangeText={setMessage} placeholder="How can we help?" multiline numberOfLines={5} textAlignVertical="top" />
            <TouchableOpacity
              style={[styles.button, (!name.trim() || !email.trim() || !message.trim()) && styles.disabled]}
              onPress={handleSubmit}
              disabled={sending || !name.trim() || !email.trim() || !message.trim()}
            >
              {sending ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Send size={16} color="#ffffff" />
                  <Text style={styles.buttonText}>Send Message</Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}
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
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', flex: 1 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 16,
    borderWidth: 1, borderColor: '#f1f5f9', padding: 24, gap: 12,
  },
  subtitle: { fontSize: 13, color: '#64748b' },
  label: { fontSize: 13, fontWeight: '500', color: '#475569' },
  input: {
    height: 44, borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 8, paddingHorizontal: 12, fontSize: 15, color: '#1e293b',
  },
  textarea: {
    height: 120, borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 15, color: '#1e293b',
  },
  button: {
    height: 44, backgroundColor: '#4f46e5',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    marginTop: 8,
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  disabled: { opacity: 0.5 },
  successContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  successIcon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  successText: { fontSize: 13, color: '#64748b', textAlign: 'center' },
  outlineButton: {
    height: 44, paddingHorizontal: 24, borderRadius: 12,
    borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  outlineButtonText: { fontSize: 15, color: '#1e293b', fontWeight: '500' },
});