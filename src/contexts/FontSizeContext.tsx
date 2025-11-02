import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type FontSize = "small" | "normal" | "large" | "extra-large";

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const fontSizeMap: Record<FontSize, number> = {
  "small": 14,
  "normal": 16,
  "large": 18,
  "extra-large": 20,
};

const fontSizeOrder: FontSize[] = ["small", "normal", "large", "extra-large"];

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const stored = localStorage.getItem("fontSize") as FontSize;
    return stored || "normal";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const sizeInPx = fontSizeMap[fontSize];
    
    // Set CSS custom property for font size
    root.style.setProperty("--base-font-size", `${sizeInPx}px`);
    
    // Add class to body for additional styling if needed
    fontSizeOrder.forEach(size => {
      root.classList.remove(`font-size-${size}`);
    });
    root.classList.add(`font-size-${fontSize}`);
    
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const increaseFontSize = () => {
    const currentIndex = fontSizeOrder.indexOf(fontSize);
    if (currentIndex < fontSizeOrder.length - 1) {
      setFontSize(fontSizeOrder[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizeOrder.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizeOrder[currentIndex - 1]);
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
}
