import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';

export default function IndexScreen() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        router.replace('/home');
      }
      setChecking(false);
    });
  }, []);

  return <LoadingScreen message="Starting up..." />;
}