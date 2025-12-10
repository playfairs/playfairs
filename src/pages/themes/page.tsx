'use client';

import { useTheme } from '../../contexts/ThemeContext';
import { useEffect, useState } from 'react';

const themeOptions = [
  { value: 'default', label: 'Default', color: '#10b981' },
  { value: 'dark', label: 'Dark', color: '#3b82f6' },
  { value: 'light', label: 'Light', color: '#ffffff' },
  { value: 'catppuccin-latte', label: 'Catppuccin Latte', color: '#1e66f5' },
  { value: 'catppuccin-frappe', label: 'Catppuccin Frappé', color: '#8caaee' },
  { value: 'catppuccin-macchiato', label: 'Catppuccin Macchiato', color: '#8aadf4' },
  { value: 'rose-pine', label: 'Rosé Pine', color: '#c4a7e7' },
  { value: 'rose-pine-moon', label: 'Rosé Pine Moon', color: '#c4a7e7' },
  { value: 'rose-pine-dawn', label: 'Rosé Pine Dawn', color: '#907aa9' },
] as const;

export default function ThemesPage() {
  const { theme, setTheme } = useTheme();
  const handleThemeChange = (newTheme: typeof themeOptions[number]['value']) => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-br from-bg to-bg-alt">
      <div className="w-full max-w-2xl bg-card-bg rounded-xl shadow-2xl overflow-hidden border border-border">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-text">Theme Selector</h1>
          <p className="text-center text-text-muted mb-8">
            Hi, you found a hidden page, I removed the theme dropdown since I didn't like it, but you can still change the theme here :)
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`flex items-center p-4 rounded-lg transition-all duration-200 border ${
                  theme === option.value
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50 bg-card-bg hover:bg-bg-alt'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full mr-3 shrink-0"
                  style={{ 
                    backgroundColor: option.color,
                    boxShadow: `0 0 8px ${option.color}80`
                  }}
                />
                <span className="font-medium text-text">{option.label}</span>
                {theme === option.value && (
                  <svg 
                    className="w-5 h-5 ml-auto text-green-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-center text-text-muted">
              Click any theme to apply it instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
