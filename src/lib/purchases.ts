import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

export function configureRevenueCat() {
  Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!;
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Purchases.configure({ apiKey });
  }
}

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