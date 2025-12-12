import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

import '../themes/rose-pine/rose-pine.css';
import '../themes/rose-pine/rose-pine-moon.css';
import '../themes/rose-pine/rose-pine-dawn.css';

export default function ThemeLoader() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.remove(
      'theme-rose-pine',
      'theme-rose-pine-moon',
      'theme-rose-pine-dawn'
    );

    if (theme.startsWith('rose-pine')) {
      document.documentElement.classList.add(`theme-${theme}`);
      console.log(`Applied theme: ${theme}`);
    }

    const themeColor = getThemeColor(theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  }, [theme]);

  function getThemeColor(theme: string): string {
    switch (theme) {
      case 'rose-pine-moon':
        return '#232136';
      case 'rose-pine-dawn':
        return '#faf4ed';
      case 'rose-pine':
      default:
        return '#191724';
    }
  }

  return null;
}
