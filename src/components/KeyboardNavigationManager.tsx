import React, { useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';

/**
 * Componente que habilita la navegación por teclado cuando está activado
 */
const KeyboardNavigationManager = () => {
  const { settings } = useAccessibility();
  
  // Activar el hook de navegación por teclado
  useKeyboardNavigation(settings.keyboardNavigationEnabled);

  // Mostrar indicador visual cuando está activo
  useEffect(() => {
    if (settings.keyboardNavigationEnabled) {
      console.log('✅ Navegación por teclado activada');
      console.log('📌 Usa las flechas ↑↓←→ para navegar');
      console.log('📌 Usa Home/End para ir al inicio/fin');
    }
  }, [settings.keyboardNavigationEnabled]);

  return (
    <>
      {settings.keyboardNavigationEnabled && (
        <div 
          id="keyboard-navigation-indicator" 
          className="fixed bottom-5 left-5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 z-[9999] shadow-lg"
          role="status"
          aria-live="polite"
        >
          <span className="text-lg">⌨️</span>
          <div className="flex flex-col">
            <span className="font-semibold">Navegación por Teclado</span>
            <span className="text-xs opacity-90">Usa las flechas ↑↓←→</span>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardNavigationManager;
