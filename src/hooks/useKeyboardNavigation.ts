import { useEffect, useRef } from 'react';

export function useKeyboardNavigation() {
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableSelectors = [
        'a',
        'button',
        'input',
        '[tabindex]:not([tabindex="-1"])',
        'select',
        'textarea',
      ].join(',');

      // Get all focusable elements
      const focusableElements = Array.from(
        document.querySelectorAll(focusableSelectors)
      ).filter((el) => {
        const element = el as HTMLElement;
        return element.offsetParent !== null; // Only visible elements
      }) as HTMLElement[];

      focusableElementsRef.current = focusableElements;
      const currentFocused = document.activeElement as HTMLElement;
      const currentIndex = focusableElements.indexOf(currentFocused);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1].focus();
          } else if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            focusableElements[currentIndex - 1].focus();
          } else if (focusableElements.length > 0) {
            focusableElements[focusableElements.length - 1].focus();
          }
          break;

        case ' ':
          if (
            currentFocused &&
            (currentFocused.tagName === 'BUTTON' ||
              currentFocused.tagName === 'A' ||
              currentFocused.getAttribute('role') === 'button')
          ) {
            e.preventDefault();
            currentFocused.click();
          }
          break;

        case 'Enter':
          if (
            currentFocused &&
            (currentFocused.tagName === 'BUTTON' ||
              currentFocused.getAttribute('role') === 'button')
          ) {
            // Enter already works for buttons by default
            currentFocused.click();
          }
          break;

        case 'Tab':
          // Let the browser handle Tab naturally
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
