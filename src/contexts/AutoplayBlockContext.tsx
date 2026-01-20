import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AutoplayBlockContextType {
  autoplayBlocked: boolean;
  setAutoplayBlocked: (blocked: boolean) => void;
}

const AutoplayBlockContext = createContext<AutoplayBlockContextType | undefined>(undefined);

export function AutoplayBlockProvider({ children }: { children: ReactNode }) {
  const [autoplayBlocked, setAutoplayBlockedState] = useState(() => {
    const stored = localStorage.getItem("autoplayBlocked");
    return stored === "true";
  });

  useEffect(() => {
    // Add a style to prevent autoplay on media elements
    const styleId = "autoplay-block-style";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;

    if (autoplayBlocked) {
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.textContent = `
        video[autoplay], 
        audio[autoplay] {
          display: none !important;
        }
      `;
    } else {
      if (style) {
        style.remove();
      }
    }

    // Store preference
    localStorage.setItem("autoplayBlocked", String(autoplayBlocked));
  }, [autoplayBlocked]);

  const setAutoplayBlocked = (blocked: boolean) => {
    setAutoplayBlockedState(blocked);
  };

  return (
    <AutoplayBlockContext.Provider value={{ autoplayBlocked, setAutoplayBlocked }}>
      {children}
    </AutoplayBlockContext.Provider>
  );
}

export function useAutoplayBlock() {
  const context = useContext(AutoplayBlockContext);
  if (context === undefined) {
    throw new Error("useAutoplayBlock must be used within an AutoplayBlockProvider");
  }
  return context;
}
