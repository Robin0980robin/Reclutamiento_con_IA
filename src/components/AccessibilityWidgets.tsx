import React, { useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import KeyboardNavigationManager from './KeyboardNavigationManager';

/**
 * Componente que muestra widgets visuales cuando ciertas funciones de accesibilidad están activas
 */
const AccessibilityWidgets = () => {
  const { settings } = useAccessibility();

  // Efecto para manejar el video-intérprete
  useEffect(() => {
    if (settings.videoInterpreterEnabled) {
      // Aquí se podría integrar un servicio real de video-intérprete
      console.log('Video-intérprete activado');
    }
  }, [settings.videoInterpreterEnabled]);

  // Efecto para manejar el control por voz
  useEffect(() => {
    if (settings.voiceControlEnabled) {
      // Aquí se podría integrar Web Speech API o un servicio de reconocimiento de voz
      console.log('Control por voz activado');
      
      // Ejemplo básico de reconocimiento de voz (solo navegadores compatibles)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
          console.log('Comando de voz:', transcript);
          
          // Comandos básicos de navegación
          if (transcript.includes('inicio')) {
            window.location.href = '/';
          } else if (transcript.includes('características')) {
            window.location.href = '/caracteristicas';
          } else if (transcript.includes('contacto')) {
            window.location.href = '/contacto';
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Error en reconocimiento de voz:', event.error);
        };

        recognition.start();

        return () => {
          recognition.stop();
        };
      }
    }
  }, [settings.voiceControlEnabled]);

  return (
    <>
      {/* Gestor de Navegación por Teclado */}
      <KeyboardNavigationManager />
      
      {/* Widget del Video-intérprete */}
      {settings.videoInterpreterEnabled && (
        <div id="video-interpreter-widget" className="fixed bottom-5 right-5 w-[300px] h-[200px] bg-card border-2 border-border rounded-xl shadow-lg z-[9999] flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-2">
            <div className="text-4xl">👤</div>
            <p className="text-sm font-semibold">Video-intérprete</p>
            <p className="text-xs text-muted-foreground">
              Función activada
            </p>
            <p className="text-xs text-muted-foreground">
              (Integración pendiente)
            </p>
          </div>
        </div>
      )}

      {/* Indicador de Control por Voz */}
      {settings.voiceControlEnabled && (
        <div id="voice-control-indicator" className="fixed top-5 right-5 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 z-[9999] shadow-lg animate-pulse">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive-foreground"></span>
          </span>
          🎤 Escuchando...
        </div>
      )}
    </>
  );
};

export default AccessibilityWidgets;
