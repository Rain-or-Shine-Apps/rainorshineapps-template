import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { router } from 'expo-router';
import { ArrowLeft, Check, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

export default function PricingScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [package_, setPackage] = useState<PurchasesPackage | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPurchaseInfo();
  }, []);

  const loadPurchaseInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const customerInfo = await Purchases.getCustomerInfo();
        // Replace 'premium' with your entitlement ID
        setHasPremium(typeof customerInfo.entitlements.active['premium'] !== 'undefined');
      }
      const offerings = await Purchases.getOfferings();
      if ((offerings.current?.availablePackages.length ?? 0) > 0) {
        setPackage(offerings.current!.availablePackages[0]);
      }
    } catch (error) {
      console.error('Error loading purchase info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPurchaseInfo();
    setRefreshing(false);
  };

  const handlePurchase = async () => {
    if (!package_) {
      Alert.alert('Not available', 'Product not available. Please try again later.');
      return;
    }
    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(package_);
      if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
        setHasPremium(true);
        Alert.alert(
          'Welcome to Premium!',
          'Sign in to unlock your purchase across devices.',
          [
            { text: 'Sign in now', onPress: () => router.push('/login') },
            { text: 'Later', style: 'cancel' },
          ]
        );
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Purchase failed', error.message);
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4f46e5" />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.title}>Pricing</Text>
      </View>

      <View style={styles.cards}>
        {/* Free Plan */}
        <View style={[styles.card, !hasPremium && styles.cardActive]}>
          <Text style={styles.planName}>Free</Text>
          <Text style={styles.price}>£0</Text>
          <View style={styles.features}>
            {[
              'Feature one',
              'Feature two',
              'Feature three',
            ].map(f => (
              <View key={f} style={styles.feature}>
                <Check size={14} color={colors.accent} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          {!hasPremium && (
            <View style={styles.currentPlan}>
              <Text style={styles.currentPlanText}>Current Plan</Text>
            </View>
          )}
        </View>

        {/* Premium Plan */}
        <View style={[styles.card, hasPremium && styles.cardActive]}>
          {hasPremium && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          )}
          <Text style={styles.planName}>Premium</Text>
          <Text style={styles.price}>
            {package_?.product.priceString ?? '£X.XX'}
            <Text style={styles.priceNote}> one-time</Text>
          </Text>
          <View style={styles.features}>
            {[
              'Everything in Free',
              'Premium feature one',
              'Premium feature two',
              'Priority support',
            ].map(f => (
              <View key={f} style={styles.feature}>
                <Check size={14} color={colors.accent} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          {hasPremium ? (
            <View style={styles.currentPlan}>
              <Text style={styles.currentPlanText}>Current Plan</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <View style={styles.buttonContent}>
                  <Sparkles size={16} color={colors.surface} />
                  <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={handleRestore} style={styles.restore}>
        <Text style={styles.restoreText}>Restore purchases</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')} style={styles.signInLink}>
        <Text style={styles.signInLinkText}>Already have an account? Sign in →</Text>
      </TouchableOpacity>

      <Text style={styles.legal}>
        Payment charged at confirmation. One-time purchase — no subscription.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backButton: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  cards: { gap: 16 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: colors.inputBorder, gap: 12,
  },
  cardActive: { borderColor: colors.accent, borderWidth: 2 },
  activeBadge: {
    position: 'absolute', top: -12, alignSelf: 'center',
    backgroundColor: colors.accent, paddingHorizontal: 12,
    paddingVertical: 4, borderRadius: 12,
  },
  activeBadgeText: { color: colors.surface, fontSize: 12, fontWeight: '600' },
  planName: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
  price: { fontSize: 32, fontWeight: 'bold', color: colors.textPrimary },
  priceNote: { fontSize: 16, fontWeight: 'normal', color: colors.textSecondary },
  features: { gap: 8, marginBottom: 8 },
  feature: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  featureText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  currentPlan: {
    backgroundColor: colors.infoBg, borderRadius: 8,
    padding: 10, alignItems: 'center',
  },
  currentPlanText: { color: colors.accent, fontWeight: '600', fontSize: 14 },
  upgradeButton: {
    backgroundColor: colors.accent, borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  upgradeButtonText: { color: colors.surface, fontWeight: '600', fontSize: 16 },
  restore: { alignItems: 'center', marginTop: 4 },
  restoreText: { color: colors.textMuted, fontSize: 14, textDecorationLine: 'underline' },
  signInLink: { alignItems: 'center', marginTop: 4 },
  signInLinkText: { color: colors.accent, fontSize: 14, textDecorationLine: 'underline' },
  legal: {
    fontSize: 11, color: colors.textMuted,
    textAlign: 'center', lineHeight: 16, marginTop: 4,
  },
});
