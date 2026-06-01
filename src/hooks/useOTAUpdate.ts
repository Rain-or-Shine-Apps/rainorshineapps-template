import * as Updates from 'expo-updates';
import { useEffect } from 'react';

export function useOTAUpdate() {
  useEffect(() => {
    if (!__DEV__) {
      checkAndApplyUpdate();
    }
  }, []);
}

async function checkAndApplyUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (_e) {
    // Silently ignore — app continues with the currently cached bundle
  }
}
