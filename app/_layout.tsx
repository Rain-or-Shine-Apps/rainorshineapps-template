import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineBanner from '@/components/OfflineBanner';
import { supabase } from '@/lib/supabase';
import { useOTAUpdate } from '@/hooks/useOTAUpdate';

export default function RootLayout() {
  useOTAUpdate();

  useEffect(() => {
    const apiKey = Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY!
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY!;
    if (apiKey && (Platform.OS === 'ios' || Platform.OS === 'android')) {
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
    try {
      const { GoogleSignin } = require('@react-native-google-signin/google-signin');
      GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      });
    } catch (e) {
      console.log('Google Sign-In not available in Expo Go');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <View style={{ flex: 1 }}>
            <OfflineBanner />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="login-email" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
    </GestureHandlerRootView>
  );
}
