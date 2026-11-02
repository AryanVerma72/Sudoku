/**
 * Web Vibration API helper for Android tactile feedback.
 */

export const triggerHaptic = (type: 'light' | 'tap' | 'error' | 'win' | 'hint') => {
  if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        window.navigator.vibrate(8);
        break;
      case 'tap':
        window.navigator.vibrate(14);
        break;
      case 'hint':
        window.navigator.vibrate([15, 30, 15]);
        break;
      case 'error':
        window.navigator.vibrate([40, 40, 40]);
        break;
      case 'win':
        window.navigator.vibrate([40, 50, 40, 50, 80]);
        break;
    }
  } catch {
    // Ignore unsupported browser environments
  }
};
