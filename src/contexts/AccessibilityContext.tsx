import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';
type ColorBlindnessMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface AccessibilitySettings {
  // Visual
  textSizeLevel: number; // 1-6
  lineSpacingLevel: number; // 1-4
  highContrast: boolean;
  darkMode: boolean;
  
  // Cognitive
  dyslexiaMode: boolean;
  letterSpacingLevel: number; // 1-5
  readingMode: boolean; // focus mode
  
  // Visual impairment
  colorBlindnessMode: ColorBlindnessMode;
  zoomLevel: number; // 100-200
  
  // Interaction
  animationsEnabled: boolean;
  focusIndicatorEnhanced: boolean;
  
  // Language
  language: Language;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  announceToScreenReader: (message: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  textSizeLevel: 3,
  lineSpacingLevel: 2,
  highContrast: false,
  darkMode: false,
  dyslexiaMode: false,
  letterSpacingLevel: 3,
  readingMode: false,
  colorBlindnessMode: 'none',
  zoomLevel: 100,
  animationsEnabled: true,
  focusIndicatorEnhanced: false,
  language: 'es',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply all settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Contrast and theme
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('dark', settings.darkMode);
    
    // Text size (1-6 levels)
    root.setAttribute('data-text-size', String(settings.textSizeLevel));
    
    // Line spacing (1-4 levels)
    root.setAttribute('data-line-spacing', String(settings.lineSpacingLevel));
    
    // Dyslexia mode
    root.classList.toggle('dyslexia-mode', settings.dyslexiaMode);
    root.setAttribute('data-letter-spacing', String(settings.letterSpacingLevel));
    
    // Reading/focus mode
    root.classList.toggle('reading-mode', settings.readingMode);
    
    // Color blindness filters
    root.setAttribute('data-colorblind', settings.colorBlindnessMode);
    
    // Zoom
    root.style.fontSize = `${settings.zoomLevel}%`;
    
    // Animations
    root.classList.toggle('reduce-motion', !settings.animationsEnabled);
    
    // Focus indicators
    root.classList.toggle('enhanced-focus', settings.focusIndicatorEnhanced);
    
    // Language
    root.setAttribute('lang', settings.language);
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    const message = settings.language === 'es' 
      ? 'Configuración de accesibilidad restablecida a valores predeterminados'
      : 'Accessibility settings reset to defaults';
    announceToScreenReader(message);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.getElementById('a11y-announcer');
    if (announcement) {
      announcement.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcement.textContent = '';
      }, 1000);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSetting, resetSettings, announceToScreenReader }}
    >
      {children}
      {/* Screen reader announcer - WCAG 4.1.3 */}
      <div
        id="a11y-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
