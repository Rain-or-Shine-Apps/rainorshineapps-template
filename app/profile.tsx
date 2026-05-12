import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { ArrowLeft, LogOut, Crown, HelpCircle, Shield, FileText, Eye, Sparkles, User } from 'lucide-react-native';
import { hasEntitlement, logoutRevenueCat } from '@/lib/purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ENTITLEMENT_ID = 'premium'; // Replace with your entitlement ID

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [hasPremium, setHasPremium] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email ?? '');
      setIsSignedIn(true);
      const premium = await hasEntitlement(ENTITLEMENT_ID);
      setHasPremium(premium);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logoutRevenueCat();
          await supabase.auth.signOut();
          router.replace('/home');
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {isSignedIn ? (email?.[0]?.toUpperCase() || '?') : '?'}
          </Text>
        </View>
        <Text style={styles.email}>{isSignedIn ? email : 'Not signed in'}</Text>
        {hasPremium && (
          <View style={styles.premiumBadge}>
            <Sparkles size={12} color="#4f46e5" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription</Text>
        <View style={styles.subscriptionRow}>
          <Crown size={20} color={hasPremium ? '#4f46e5' : '#94a3b8'} />
          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionPlan}>
              {hasPremium ? 'Premium Plan' : 'Free Plan'}
            </Text>
            <Text style={styles.subscriptionDetail}>
              {hasPremium ? 'Full access to all features' : 'Upgrade to unlock premium features'}
            </Text>
          </View>
        </View>
        {!hasPremium && (
          <TouchableOpacity style={styles.upgradeButton} onPress={() => router.push('/pricing')}>
            <Sparkles size={16} color="#ffffff" />
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Support & Legal</Text>
        {[
          { label: 'Help & Support', icon: HelpCircle, route: '/support' },
          { label: 'Accessibility', icon: Eye, route: '/accessibility' },
          { label: 'Privacy Policy', icon: Shield, route: '/privacy-policy' },
          { label: 'Terms & Conditions', icon: FileText, route: '/terms-conditions' },
          { label: 'Delete Account', icon: User, route: '/delete-account', danger: true },
        ].map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.linkRow}
            onPress={() => router.push(item.route as any)}
          >
            <item.icon size={18} color={item.danger ? '#dc2626' : '#64748b'} />
            <Text style={[styles.linkText, item.danger && { color: '#dc2626' }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isSignedIn ? (
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={18} color="#dc2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/login')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      )}
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
  avatarSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#4f46e5',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  email: { fontSize: 14, color: '#64748b' },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#eff6ff', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 12,
  },
  premiumBadgeText: { fontSize: 12, color: '#4f46e5', fontWeight: '600' },
  card: {
    backgroundColor: '#ffffff', borderRadius: 16,
    borderWidth: 1, borderColor: '#f1f5f9', padding: 20, gap: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  subscriptionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subscriptionInfo: { flex: 1 },
  subscriptionPlan: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  subscriptionDetail: { fontSize: 12, color: '#64748b' },
  upgradeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 44, backgroundColor: '#4f46e5', borderRadius: 12,
  },
  upgradeButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  linkText: { fontSize: 14, color: '#1e293b', flex: 1 },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 16, backgroundColor: '#ffffff', borderRadius: 16,
    borderWidth: 1, borderColor: '#fecaca',
  },
  signOutText: { fontSize: 15, color: '#dc2626', fontWeight: '600' },
  signInButton: {
    height: 48, backgroundColor: '#4f46e5',
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  signInButtonText: { fontSize: 15, color: '#fff', fontWeight: '600' },
});
