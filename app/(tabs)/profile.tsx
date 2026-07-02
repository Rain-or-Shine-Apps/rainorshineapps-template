import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { router, useFocusEffect } from 'expo-router';
import { LogOut, Crown, HelpCircle, Shield, FileText, Eye, Sparkles, User } from 'lucide-react-native';
import { hasEntitlement, logoutRevenueCat } from '@/lib/purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';

const ENTITLEMENT_ID = 'premium'; // Replace with your entitlement ID

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [hasPremium, setHasPremium] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const loadUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email ?? '');
      setIsSignedIn(true);
      const premium = await hasEntitlement(ENTITLEMENT_ID);
      setHasPremium(premium);
    }
  }, []);

  // Refetch on focus — premium status can change after returning from Pricing
  useFocusEffect(useCallback(() => { loadUser(); }, [loadUser]));

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4f46e5" />}
    >
      <View style={styles.header}>
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
            <Sparkles size={12} color={colors.accent} />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription</Text>
        <View style={styles.subscriptionRow}>
          <Crown size={20} color={hasPremium ? colors.accent : colors.textMuted} />
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
            <Sparkles size={16} color={colors.surface} />
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
            <item.icon size={18} color={item.danger ? colors.danger : colors.textSecondary} />
            <Text style={[styles.linkText, item.danger && { color: colors.danger }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isSignedIn ? (
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={18} color={colors.danger} />
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  avatarSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: colors.surface },
  email: { fontSize: 14, color: colors.textSecondary },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.infoBg, paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 12,
  },
  premiumBadgeText: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 20, gap: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  subscriptionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subscriptionInfo: { flex: 1 },
  subscriptionPlan: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  subscriptionDetail: { fontSize: 12, color: colors.textSecondary },
  upgradeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 44, backgroundColor: colors.accent, borderRadius: 12,
  },
  upgradeButtonText: { color: colors.surface, fontSize: 15, fontWeight: '600' },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  linkText: { fontSize: 14, color: colors.textPrimary, flex: 1 },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 16, backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.dangerBorder,
  },
  signOutText: { fontSize: 15, color: colors.danger, fontWeight: '600' },
  signInButton: {
    height: 48, backgroundColor: colors.accent,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  signInButtonText: { fontSize: 15, color: colors.surface, fontWeight: '600' },
});
