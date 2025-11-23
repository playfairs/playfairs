'use client';

import { useTheme } from '../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';

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

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<number | null>(null);

  const currentTheme = themeOptions.find(t => t.value === theme) || themeOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleMouseLeave() {
      leaveTimerRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    }

    function handleMouseEnter() {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      dropdown.addEventListener('mouseleave', handleMouseLeave);
      dropdown.addEventListener('mouseenter', handleMouseEnter);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        dropdown.removeEventListener('mouseleave', handleMouseLeave);
        dropdown.removeEventListener('mouseenter', handleMouseEnter);
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      };
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-gray-800/50 text-white shadow-lg' 
            : 'bg-gray-900/30 text-gray-200 hover:bg-gray-800/40 hover:text-white'
        } backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span 
          className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300" 
          style={{ 
            backgroundColor: currentTheme.color,
            boxShadow: `0 0 12px ${currentTheme.color}${isOpen ? 'cc' : '80'}`,
            transform: isOpen ? 'scale(1.1)' : 'scale(1)'
          }} 
        />
        <span className="font-medium">{currentTheme.label}</span>
        <svg 
          className={`w-3.5 h-3.5 transition-all duration-300 shrink-0 ${
            isOpen ? 'rotate-180 text-gray-300' : 'text-gray-400'
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] transition-opacity duration-300" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="absolute left-1/2 -translate-x-1/2 z-50 mt-2 w-56 origin-top overflow-hidden rounded-xl bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-800/70 transform transition-all duration-200 scale-95 opacity-0 animate-[fadeIn_0.15s_ease-out_0.1s_forwards]"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="py-1.5" role="menu" aria-orientation="vertical">
              {themeOptions.map((option) => {
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value as any);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                    } group`}
                    role="menuitem"
                  >
                    <span 
                      className="relative w-2.5 h-2.5 rounded-full shrink-0 mr-3 transition-all duration-300 group-hover:scale-110" 
                      style={{ 
                        backgroundColor: option.color,
                        boxShadow: `0 0 ${isActive ? '12px' : '8px'} ${option.color}${isActive ? 'cc' : '40'}`,
                        opacity: isActive ? 1 : 0.8
                      }}
                    >
                      {isActive && (
                        <span 
                          className="absolute inset-0 rounded-full bg-current opacity-20"
                          style={{ animation: 'pulse 2s infinite' }}
                        />
                      )}
                    </span>
                    <span className="font-medium">{option.label}</span>
                    {isActive && (
                      <svg 
                        className="w-3.5 h-3.5 ml-auto text-current" 
                        fill="none" 
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-5px) scale(0.98); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 0.2; }
                  50% { transform: scale(1.8); opacity: 0; }
                  100% { transform: scale(1); opacity: 0; }
                }
              `
            }} />
          </div>
        </>
      )}
    </div>
  );
}
