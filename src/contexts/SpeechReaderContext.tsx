import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SpeechReaderContextType {
  isReading: boolean;
  isEnabled: boolean;
  isPaused: boolean;
  speed: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
  toggleEnabled: () => void;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  readEntirePage: () => void;
  readSelectedText: () => void;
  availableVoices: SpeechSynthesisVoice[];
}

const SpeechReaderContext = createContext<SpeechReaderContextType | undefined>(undefined);

export function SpeechReaderProvider({ children }: { children: ReactNode }) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem("speechReaderEnabled");
    return stored === "true";
  });
  const [speed, setSpeedState] = useState(() => {
    const stored = localStorage.getItem("speechSpeed");
    return stored ? parseFloat(stored) : 1.0;
  });
  const [volume, setVolumeState] = useState(() => {
    const stored = localStorage.getItem("speechVolume");
    return stored ? parseFloat(stored) : 1.0;
  });
  const [voice, setVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Set default Spanish voice if available
      const storedVoiceName = localStorage.getItem("speechVoice");
      if (storedVoiceName) {
        const savedVoice = voices.find(v => v.name === storedVoiceName);
        if (savedVoice) {
          setVoiceState(savedVoice);
          return;
        }
      }
      
      const spanishVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
      if (spanishVoice) {
        setVoiceState(spanishVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Handle reading state
  useEffect(() => {
    const checkReading = setInterval(() => {
      setIsReading(window.speechSynthesis.speaking);
    }, 100);

    return () => clearInterval(checkReading);
  }, []);

  const toggleEnabled = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem("speechReaderEnabled", String(newValue));
    if (!newValue) {
      stop();
    }
  };

  const setSpeed = (newSpeed: number) => {
    setSpeedState(newSpeed);
    localStorage.setItem("speechSpeed", String(newSpeed));
    // Apply speed in real time to current utterance
    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.resume();
    }, 100);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem("speechVolume", String(newVolume));
    // Stop and resume with new volume
    const wasSpeaking = window.speechSynthesis.speaking;
    if (wasSpeaking) {
      window.speechSynthesis.cancel();
      // Volume changes take effect on next utterance
    }
  };

  const setVoice = (newVoice: SpeechSynthesisVoice | null) => {
    setVoiceState(newVoice);
    if (newVoice) {
      localStorage.setItem("speechVoice", newVoice.name);
    }
  };

  const speak = (text: string) => {
    if (!isEnabled || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.volume = volume;
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const readEntirePage = () => {
    if (!isEnabled) return;

    // Get all text content from the page
    const mainContent = document.querySelector('main') || document.body;
    const textElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, a, button, label');
    
    let pageText = '';
    textElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 0) {
        pageText += text + '. ';
      }
    });

    if (pageText) {
      speak(pageText);
    }
  };

  const readSelectedText = () => {
    if (!isEnabled) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      speak(selectedText);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'r':
            e.preventDefault();
            readEntirePage();
            break;
          case 's':
            e.preventDefault();
            readSelectedText();
            break;
          case 'x':
            e.preventDefault();
            stop();
            break;
          case 't':
            e.preventDefault();
            toggleEnabled();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnabled, speed, volume, voice]);

  return (
    <SpeechReaderContext.Provider 
      value={{ 
        isReading, 
        isEnabled, 
        isPaused,
        speed, 
        volume, 
        voice,
        toggleEnabled, 
        setSpeed, 
        setVolume, 
        setVoice,
        speak, 
        stop, 
        pause, 
        resume,
        readEntirePage,
        readSelectedText,
        availableVoices
      }}
    >
      {children}
    </SpeechReaderContext.Provider>
  );
}

export function useSpeechReader() {
  const context = useContext(SpeechReaderContext);
  if (context === undefined) {
    throw new Error("useSpeechReader must be used within a SpeechReaderProvider");
  }
  return context;
}
