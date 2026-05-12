import "../global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform, View } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineBanner from '@/components/OfflineBanner';
import { supabase } from '@/lib/supabase';

export default function RootLayout() {
  useEffect(() => {
    const apiKey = Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY!
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY!;
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        Purchases.configure({ apiKey });
        supabase.auth.getSession().then(({ data }) => {
          if (data.session?.user?.id) {
            Purchases.logIn(data.session.user.id).catch(() => {});
          }
        });
      } catch (e) {
        console.log('RevenueCat not available in Expo Go');
      }
    }
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View style={{ flex: 1 }}>
          <OfflineBanner />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="login-email" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="pricing" options={{ headerShown: false }} />
            <Stack.Screen name="support" options={{ headerShown: false }} />
            <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
            <Stack.Screen name="terms-conditions" options={{ headerShown: false }} />
            <Stack.Screen name="accessibility" options={{ headerShown: false }} />
            <Stack.Screen name="delete-account" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
