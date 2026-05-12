import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// Replace with your entitlement ID from RevenueCat
const ENTITLEMENT_ID = 'premium';

export function configureRevenueCat() {
  Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  const apiKey = Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY!
    : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY!;
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Purchases.configure({ apiKey });
  }
}

export async function checkPremium(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error) {
    console.error('Error checking premium:', error);
    return false;
  }
}

export async function purchasePremium(): Promise<boolean> {
  try {
    const offerings = await Purchases.getOfferings();
    const package_ = offerings.current?.availablePackages[0];
    if (!package_) return false;
    const { customerInfo } = await Purchases.purchasePackage(package_);
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error: any) {
    if (!error.userCancelled) console.error('Purchase failed:', error);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return false;
  }
}

// Keep for backwards compatibility / checking arbitrary entitlements
export async function hasEntitlement(entitlementId: string): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[entitlementId] !== 'undefined';
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return false;
  }
}

export async function getOfferings() {
  try {
    return await Purchases.getOfferings();
  } catch (error) {
    console.error('Error getting offerings:', error);
    return null;
  }
}

export async function loginRevenueCat(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch (e) {
    console.log('RevenueCat logIn not available:', e);
  }
}

export async function logoutRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (e) {
    console.log('RevenueCat logOut not available:', e);
  }
}
