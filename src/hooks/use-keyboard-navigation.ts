import { useEffect, useCallback } from 'react';

/**
 * Hook personalizado para navegación por teclado con flechas
 * Permite navegar entre elementos focusables sin mouse
 */
export const useKeyboardNavigation = (enabled: boolean = true) => {
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
    ].join(', ');

    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    
    // Filtrar elementos que realmente son visibles y focusables
    return elements.filter(element => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetParent !== null
      );
    });
  }, []);

  const focusElement = useCallback((element: HTMLElement) => {
    element.focus();
    // Scroll suave al elemento enfocado
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'center'
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = focusableElements.indexOf(currentElement);

    let targetIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        // Mover al siguiente elemento
        targetIndex = currentIndex >= 0 
          ? (currentIndex + 1) % focusableElements.length 
          : 0;
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        // Mover al elemento anterior
        targetIndex = currentIndex > 0 
          ? currentIndex - 1 
          : focusableElements.length - 1;
        break;

      case 'Home':
        // Ir al primer elemento
        event.preventDefault();
        targetIndex = 0;
        break;

      case 'End':
        // Ir al último elemento
        event.preventDefault();
        targetIndex = focusableElements.length - 1;
        break;

      default:
        return;
    }

    if (targetIndex >= 0 && targetIndex < focusableElements.length) {
      focusElement(focusableElements[targetIndex]);
    }
  }, [enabled, getFocusableElements, focusElement]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  return {
    getFocusableElements,
    focusElement,
  };
};
