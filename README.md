# Rain or Shine Apps — Template

A production-ready Expo template for building iOS and Android apps with authentication, payments, and all required store compliance screens.

## What's Included

- ✅ Expo Router with file-based navigation
- ✅ Supabase authentication (Apple, Google, Email)
- ✅ RevenueCat in-app purchases
- ✅ NativeWind (Tailwind CSS for React Native)
- ✅ Bottom navigation
- ✅ Safe area handling
- ✅ All required screens (Privacy, Terms, Support, Accessibility, Delete Account)

## How to Use This Template

### 1. Clone and install
```bash
git clone https://github.com/AnneBigSister/rainorshineapps-template.git my-new-app
cd my-new-app
npm install
```

### 2. Replace placeholder text
Search for these strings and replace throughout:
- `APP_NAME` → your app name (e.g. `Decidr`)
- `APP_SLUG` → url-safe app name (e.g. `decidr`)
- `APP_TAGLINE` → your app tagline
- `support@rainorshineapps.com` → your support email
- `premium` → your RevenueCat entitlement ID

### 3. Update app.json
- Set `name`, `slug`, `scheme`
- Set `ios.bundleIdentifier` to `com.rainorshineapps.yourappname`
- Set `android.package` to `com.rainorshineapps.yourappname`

### 4. Set up Supabase
- Create a new Supabase project
- Enable Email, Apple and Google auth providers
- Copy `.env.example` to `.env` and fill in your keys

### 5. Set up RevenueCat
- Create a new RevenueCat project
- Add iOS and Android app configurations
- Create your products and entitlements
- Add your API key to `.env`

### 6. Set up Google Sign In
- Go to Google Cloud Console
- Create OAuth clients for iOS and Android
- Add client IDs to `.env`

### 7. Set up Apple Sign In
- Enable Sign in with Apple in your Apple Developer account
- Configure in Supabase Auth providers

### 8. Configure EAS
```bash
eas init
eas build:configure
```

### 9. Run locally
```bash
npx expo start
```

### 10. Build for stores
```bash
# iOS
eas build --platform ios
eas submit --platform ios

# Android  
eas build --platform android
eas submit --platform android
```

## Customising the Bottom Nav

Edit `src/components/BottomNav.tsx` to add/remove tabs:

```typescript
const TABS = [
  { id: 'home', label: 'Home', icon: Home, route: '/home' },
  { id: 'profile', label: 'Profile', icon: User, route: '/profile' },
  // Add more tabs here
];
```

## Adding New Screens

1. Create `app/your-screen.tsx`
2. Add to `app/_layout.tsx`:
```typescript
<Stack.Screen name="your-screen" options={{ headerShown: false }} />
```
3. Navigate with:
```typescript
router.push('/your-screen');
```

## Replacing Placeholder Features

### Pricing screen
- Update entitlement ID from `premium` to your RevenueCat entitlement
- Update feature lists in `app/pricing.tsx`

### Delete account
- Add your data deletion logic in `app/delete-account.tsx`
- Look for the comment `// ADD YOUR DATA DELETION LOGIC HERE`

### Home screen
- Replace the placeholder content in `app/home.tsx`
- Look for the comment `{/* ADD YOUR APP CONTENT HERE */}`

## Key Files

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout, RevenueCat + Google config |
| `app/index.tsx` | Auth redirect (login or home) |
| `src/lib/supabase.ts` | Supabase client |
| `src/lib/purchases.ts` | RevenueCat helpers |
| `src/components/BottomNav.tsx` | Bottom navigation |
| `.env.example` | Environment variable template |

## Environment Variables
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_REVENUECAT_API_KEY=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
## Store Compliance Checklist

### Apple
- [ ] Sign in with Apple implemented
- [ ] Privacy Policy URL in App Store Connect
- [ ] Delete Account screen accessible from Profile
- [ ] IAP via RevenueCat only (no external payment links)
- [ ] Sandbox test account created

### Google Play
- [ ] Privacy Policy URL in Play Console
- [ ] Delete Account screen accessible from Profile  
- [ ] Data safety form completed in Play Console
- [ ] IAP via Google Play Billing (RevenueCat)