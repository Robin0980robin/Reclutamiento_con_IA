import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface LetterSpacingContextType {
  letterSpacing: number;
  setLetterSpacing: (spacing: number) => void;
}

const LetterSpacingContext = createContext<LetterSpacingContextType | undefined>(undefined);

export function LetterSpacingProvider({ children }: { children: ReactNode }) {
  const [letterSpacing, setLetterSpacingState] = useState(() => {
    const stored = localStorage.getItem("letterSpacing");
    return stored ? parseFloat(stored) : 0;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Set CSS custom property for letter spacing
    root.style.setProperty("--letter-spacing", `${letterSpacing}px`);
    
    localStorage.setItem("letterSpacing", String(letterSpacing));
  }, [letterSpacing]);

  const setLetterSpacing = (spacing: number) => {
    setLetterSpacingState(spacing);
  };

  return (
    <LetterSpacingContext.Provider value={{ letterSpacing, setLetterSpacing }}>
      {children}
    </LetterSpacingContext.Provider>
  );
}

export function useLetterSpacing() {
  const context = useContext(LetterSpacingContext);
  if (context === undefined) {
    throw new Error("useLetterSpacing must be used within a LetterSpacingProvider");
  }
  return context;
}
