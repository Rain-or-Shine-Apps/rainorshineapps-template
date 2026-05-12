import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginRevenueCat } from '@/lib/purchases';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });
      if (error) throw error;
      if (data.user) {
        await loginRevenueCat(data.user.id);
      }
      router.replace('/home');
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Sign in failed', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error('No ID token received');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) throw error;
      if (data.user) {
        await loginRevenueCat(data.user.id);
      }
      router.replace('/home');
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign in failed', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>APP_NAME</Text>
        <Text style={styles.subtitle}>APP_TAGLINE</Text>
      </View>

      <View style={styles.buttons}>
        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : (
          <>
            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={12}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}
            <GoogleSigninButton
              style={styles.googleButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={handleGoogleSignIn}
            />
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => router.push('/login-email')}
            >
              <Text style={styles.emailButtonText}>Continue with Email</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.footer}>
        By continuing you agree to our{' '}
        <Text style={styles.footerLink} onPress={() => router.push('/terms-conditions')}>Terms</Text>
        {' '}&{' '}
        <Text style={styles.footerLink} onPress={() => router.push('/privacy-policy')}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 48,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  backArrow: { fontSize: 18, color: '#1e293b' },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e293b',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 12,
    textAlign: 'center',
  },
  buttons: { gap: 12 },
  appleButton: { width: '100%', height: 52 },
  googleButton: { width: '100%', height: 52 },
  emailButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  footer: { textAlign: 'center', fontSize: 12, color: '#94a3b8', lineHeight: 18 },
  footerLink: { color: '#64748b', textDecorationLine: 'underline' },
});
