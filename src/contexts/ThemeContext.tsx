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

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast", "high-contrast-light", "high-contrast-dark");

    if (theme === "high-contrast") {
      // Apply high contrast based on the base theme
      root.classList.add(baseTheme === "dark" ? "high-contrast-dark" : "high-contrast-light");
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
  }, [theme, baseTheme]);

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
