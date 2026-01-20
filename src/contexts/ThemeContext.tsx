import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system" | "high-contrast";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  baseTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme;
    return stored || "system";
  });

  const [baseTheme, setBaseTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("baseTheme") as "light" | "dark";
    return stored || "light";
  });

  // Track darkMode changes for high-contrast theme updates
  const [darkModeHint, setDarkModeHint] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast", "high-contrast-light", "high-contrast-dark");

    if (theme === "high-contrast") {
      // Check accessibility settings for dark mode preference
      const accessibilitySettings = localStorage.getItem('accessibility-settings');
      const isDarkMode = accessibilitySettings ? JSON.parse(accessibilitySettings).darkMode : false;
      
      // Apply high contrast with appropriate base
      if (isDarkMode) {
        root.classList.add("high-contrast-dark");
        root.classList.add("dark");
        setBaseTheme("dark");
      } else {
        root.classList.add("high-contrast-light");
        root.classList.add("light");
        setBaseTheme("light");
      }
      root.classList.add("high-contrast");
    } else if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      setBaseTheme(systemTheme);
    } else {
      root.classList.add(theme);
      setBaseTheme(theme as "light" | "dark");
    }

    localStorage.setItem("theme", theme);
    localStorage.setItem("baseTheme", baseTheme);
  }, [theme, baseTheme, darkModeHint]);

  // Listen for darkMode changes when in high-contrast mode
  useEffect(() => {
    const handleDarkModeChange = () => {
      if (theme === "high-contrast") {
        // Force re-render by toggling darkModeHint
        setDarkModeHint(prev => !prev);
      }
    };

    // Custom event from AccessibilityContext
    window.addEventListener('darkModeChanged', handleDarkModeChange);
    
    return () => {
      window.removeEventListener('darkModeChanged', handleDarkModeChange);
    };
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark", "high-contrast");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, baseTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
