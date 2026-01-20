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
  
  // New features
  videoInterpreterEnabled: boolean; // Video-intérprete de lengua de señas
  linkHighlightEnabled: boolean; // Resaltado de enlaces
  voiceControlEnabled: boolean; // Control por voz
  keyboardNavigationEnabled: boolean; // Navegación con flechas del teclado
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
  videoInterpreterEnabled: false,
  linkHighlightEnabled: false,
  voiceControlEnabled: false,
  keyboardNavigationEnabled: false,
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
    
    // IMPORTANT: Don't override theme classes - those are managed by ThemeContext
    // We only add high-contrast as a class for CSS targeting, but actual theme
    // (high-contrast-light/dark) is managed by ThemeContext
    
    // Add high-contrast class for CSS hooks (in addition to ThemeContext management)
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Dark mode is managed by ThemeContext via setTheme()
    // We just keep the setting in sync for reference
    
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
    
    // Link highlight
    root.classList.toggle('highlight-links', settings.linkHighlightEnabled);
    
    // Video interpreter
    root.classList.toggle('video-interpreter', settings.videoInterpreterEnabled);
    
    // Voice control
    root.classList.toggle('voice-control', settings.voiceControlEnabled);
    
    // Keyboard navigation
    root.classList.toggle('keyboard-navigation', settings.keyboardNavigationEnabled);
    
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
