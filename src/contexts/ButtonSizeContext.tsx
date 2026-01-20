import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ButtonSize = "small" | "normal" | "large" | "extra-large";

interface ButtonSizeContextType {
  buttonSize: ButtonSize;
  buttonSizeValue: number;
  setButtonSize: (size: ButtonSize) => void;
  setButtonSizeValue: (value: number) => void;
}

const ButtonSizeContext = createContext<ButtonSizeContextType | undefined>(undefined);

const buttonSizeMap: Record<ButtonSize, number> = {
  "small": 0.85,
  "normal": 1,
  "large": 1.15,
  "extra-large": 1.3,
};

const buttonSizeOrder: ButtonSize[] = ["small", "normal", "large", "extra-large"];

export function ButtonSizeProvider({ children }: { children: ReactNode }) {
  const [buttonSize, setButtonSizeState] = useState<ButtonSize>(() => {
    const stored = localStorage.getItem("buttonSize") as ButtonSize;
    return stored || "normal";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const scale = buttonSizeMap[buttonSize];
    
    // Set CSS custom property for button size
    root.style.setProperty("--button-size-scale", String(scale));
    
    localStorage.setItem("buttonSize", buttonSize);
  }, [buttonSize]);

  const setButtonSize = (size: ButtonSize) => {
    setButtonSizeState(size);
  };

  const setButtonSizeValue = (value: number) => {
    // Map scale value to button size category
    if (value <= 0.92) setButtonSize('small');
    else if (value <= 1.075) setButtonSize('normal');
    else if (value <= 1.225) setButtonSize('large');
    else setButtonSize('extra-large');
  };

  const buttonSizeValue = buttonSizeMap[buttonSize];

  return (
    <ButtonSizeContext.Provider value={{ buttonSize, buttonSizeValue, setButtonSize, setButtonSizeValue }}>
      {children}
    </ButtonSizeContext.Provider>
  );
}

export function useButtonSize() {
  const context = useContext(ButtonSizeContext);
  if (context === undefined) {
    throw new Error("useButtonSize must be used within a ButtonSizeProvider");
  }
  return context;
}
