import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'default' | 'dark' | 'light' | 'catppuccin-latte' | 'catppuccin-frappe' | 'catppuccin-macchiato' | 'rose-pine' | 'rose-pine-moon' | 'rose-pine-dawn';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove(
      'theme-default',
      'theme-dark',
      'theme-light',
      'theme-catppuccin-latte',
      'theme-catppuccin-frappe',
      'theme-catppuccin-macchiato',
      'theme-rose-pine',
      'theme-rose-pine-moon',
      'theme-rose-pine-dawn'
    );
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
