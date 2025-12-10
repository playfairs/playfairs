'use client';

import { useTheme } from '../contexts/ThemeContext';
import { useEffect } from 'react';

export default function ThemeSelector() {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      setTheme('rose-pine-moon');
    }
  }, [setTheme]);

  return null;
}
