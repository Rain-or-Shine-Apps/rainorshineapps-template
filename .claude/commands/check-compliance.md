# Check Compliance Command

When the user runs /check-compliance, check the following and report status:

## Apple App Store
- [ ] Sign in with Apple in app/login.tsx
- [ ] Delete Account screen exists at app/delete-account.tsx
- [ ] Privacy Policy screen exists at app/privacy-policy.tsx
- [ ] Terms & Conditions screen exists at app/terms-conditions.tsx
- [ ] Accessibility screen exists at app/accessibility.tsx
- [ ] ITSAppUsesNonExemptEncryption is false in app.json
- [ ] privacyManifests configured in app.json
- [ ] bundleIdentifier follows com.rainorshineapps.appname pattern
- [ ] No external payment links (Stripe URLs etc)
- [ ] RevenueCat configured in _layout.tsx

## Google Play Store
- [ ] Delete Account screen exists
- [ ] Privacy Policy screen exists
- [ ] android.package follows com.rainorshineapps.appname pattern
- [ ] versionCode is set in app.json
- [ ] No external payment links

## General
- [ ] .env.example exists with all required variables
- [ ] .env is in .gitignore
- [ ] SafeAreaProvider wraps the app in _layout.tsx
- [ ] ErrorBoundary wraps the app in _layout.tsx
- [ ] OfflineBanner is included in _layout.tsx

Report each item as ✅ or ❌ with a brief note on how to fix any failures.