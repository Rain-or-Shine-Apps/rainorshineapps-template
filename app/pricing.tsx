import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { router } from 'expo-router';
import { ArrowLeft, Check, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PricingScreen() {
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [package_, setPackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    loadPurchaseInfo();
  }, []);
  const insets = useSafeAreaInsets();
  const loadPurchaseInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      // Replace 'premium' with your entitlement ID
      setHasPremium(typeof customerInfo.entitlements.active['premium'] !== 'undefined');
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

  const handlePurchase = async () => {
    if (!package_) {
      Alert.alert('Error', 'Product not available. Please try again later.');
      return;
    }
    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(package_);
      if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
        setHasPremium(true);
        Alert.alert('Success!', 'You now have premium access.');
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Purchase failed', error.message);
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
        setHasPremium(true);
        Alert.alert('Restored!', 'Your purchase has been restored.');
      } else {
        Alert.alert('Nothing to restore', 'No previous purchases found.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
     <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color="#94a3b8" />
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
                <Check size={14} color="#4f46e5" />
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
                <Check size={14} color="#4f46e5" />
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
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Sparkles size={16} color="#ffffff" />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backButton: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  cards: { gap: 16 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: '#e2e8f0', gap: 12,
  },
  cardActive: { borderColor: '#4f46e5', borderWidth: 2 },
  activeBadge: {
    position: 'absolute', top: -12, alignSelf: 'center',
    backgroundColor: '#4f46e5', paddingHorizontal: 12,
    paddingVertical: 4, borderRadius: 12,
  },
  activeBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  planName: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  price: { fontSize: 32, fontWeight: 'bold', color: '#1e293b' },
  priceNote: { fontSize: 16, fontWeight: 'normal', color: '#64748b' },
  features: { gap: 8, marginBottom: 8 },
  feature: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  featureText: { fontSize: 14, color: '#64748b', flex: 1 },
  currentPlan: {
    backgroundColor: '#eff6ff', borderRadius: 8,
    padding: 10, alignItems: 'center',
  },
  currentPlanText: { color: '#4f46e5', fontWeight: '600', fontSize: 14 },
  upgradeButton: {
    backgroundColor: '#4f46e5', borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  upgradeButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  restore: { alignItems: 'center', marginTop: 8 },
  restoreText: { color: '#64748b', fontSize: 14 },
});