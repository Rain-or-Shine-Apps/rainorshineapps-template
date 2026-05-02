# New Screen Command

When the user runs /new-screen [ScreenName], do the following:

1. Create a new file app/[screen-name].tsx following the project's existing patterns
2. Add the screen to app/_layout.tsx
3. Use the same StyleSheet patterns as existing screens
4. Include safe area insets (useSafeAreaInsets)
5. Include a back button if it's a detail screen
6. Use lucide-react-native for icons
7. Follow the same colour scheme (#4f46e5 for primary, #f8fafc for background)

The screen should:
- Import from the correct paths (@/lib/supabase, @/lib/purchases etc)
- Have proper TypeScript types
- Have accessibilityLabel on interactive elements
- Have a loading state if it fetches data