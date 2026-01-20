import React, { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import KeyboardNavigationManager from './KeyboardNavigationManager';

/**
 * Componente que muestra widgets visuales cuando ciertas funciones de accesibilidad están activas
 */
const AccessibilityWidgets = () => {
  const { settings } = useAccessibility();
  const [lastCommand, setLastCommand] = useState<string>('');
  const [showCommandFeedback, setShowCommandFeedback] = useState(false);

  // Efecto para manejar el video-intérprete
  useEffect(() => {
    if (settings.videoInterpreterEnabled) {
      console.log('Video-intérprete activado');
    }
  }, [settings.videoInterpreterEnabled]);

  // Efecto para manejar el control por voz
  useEffect(() => {
    if (!settings.voiceControlEnabled) return;

    console.log('Control por voz activado');
    
    // Verificar compatibilidad con Web Speech API
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error('Web Speech API no soportada en este navegador');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log('🎤 Comando de voz:', transcript);
      
      // Mostrar feedback visual
      setLastCommand(transcript);
      setShowCommandFeedback(true);
      setTimeout(() => setShowCommandFeedback(false), 3000);
      
      // Función para buscar y hacer clic en botones por texto
      const clickButtonByText = (textToFind: string): boolean => {
        const buttons = Array.from(document.querySelectorAll('button, a[role="button"], [role="button"]'));
        const button = buttons.find(btn => 
          btn.textContent?.toLowerCase().includes(textToFind.toLowerCase())
        );
        if (button) {
          (button as HTMLElement).click();
          return true;
        }
        return false;
      };

      // Función para navegar (usando window.location para no depender de Router)
      const navigateTo = (path: string) => {
        window.location.href = path;
      };

      // COMANDOS DE NAVEGACIÓN
      if (transcript.includes('inicio') || transcript.includes('página principal') || transcript.includes('pagina principal')) {
        navigateTo('/');
      } 
      else if (transcript.includes('características') || transcript.includes('caracteristicas')) {
        navigateTo('/caracteristicas');
      } 
      else if (transcript.includes('para quién') || transcript.includes('para quien')) {
        navigateTo('/para-quien');
      }
      else if (transcript.includes('contacto')) {
        navigateTo('/contacto');
      }
      
      // COMANDOS DE AUTENTICACIÓN
      else if (transcript.includes('iniciar sesión') || transcript.includes('iniciar sesion') || transcript.includes('login')) {
        navigateTo('/login');
      }
      else if (transcript.includes('registrarse') || transcript.includes('registro') || transcript.includes('crear cuenta')) {
        navigateTo('/register');
      }
      else if (transcript.includes('perfil') || transcript.includes('mi cuenta')) {
        navigateTo('/profile');
      }
      else if (transcript.includes('cerrar sesión') || transcript.includes('cerrar sesion') || transcript.includes('salir')) {
        clickButtonByText('cerrar sesión') || clickButtonByText('logout');
      }
      
      // COMANDOS PARA BOTONES PRINCIPALES DE LA PÁGINA
      else if (transcript.includes('empezar') || transcript.includes('comenzar') || transcript.includes('empezar ahora')) {
        clickButtonByText('empezar') || clickButtonByText('comenzar') || clickButtonByText('empezar ahora');
      }
      else if (transcript.includes('más información') || transcript.includes('mas informacion') || transcript.includes('saber más')) {
        clickButtonByText('más información') || clickButtonByText('saber más') || clickButtonByText('aprender');
      }
      else if (transcript.includes('explorar') || transcript.includes('descubrir')) {
        clickButtonByText('explorar') || clickButtonByText('descubrir');
      }
      
      // COMANDOS DE ACCESIBILIDAD
      else if (transcript.includes('menú accesibilidad') || transcript.includes('menu accesibilidad') || 
               transcript.includes('abrir accesibilidad') || transcript.includes('opciones accesibilidad') ||
               transcript.includes('accesibilidad')) {
        const accessibilityButton = document.querySelector('button[aria-label*="accesibilidad"]') as HTMLElement;
        if (accessibilityButton) {
          accessibilityButton.click();
        }
      }
      else if (transcript.includes('cerrar menú') || transcript.includes('cerrar menu') || transcript.includes('cerrar')) {
        const closeButtons = document.querySelectorAll('[aria-label*="cerrar"], [aria-label*="Close"]');
        if (closeButtons.length > 0) {
          (closeButtons[0] as HTMLElement).click();
        }
      }
      
      // COMANDOS DE IDIOMA
      else if (transcript.includes('cambiar idioma') || transcript.includes('español') || transcript.includes('inglés') || transcript.includes('ingles')) {
        const languageButton = document.querySelector('button[aria-label*="idioma"], button[aria-label*="language"]') as HTMLElement;
        if (languageButton) {
          languageButton.click();
        }
      }
      
      // COMANDOS GENÉRICOS PARA CUALQUIER BOTÓN
      else if (transcript.includes('hacer clic') || transcript.includes('presionar') || transcript.includes('pulsar')) {
        // Extraer el texto después del comando
        const commandParts = transcript.split(/hacer clic|presionar|pulsar/);
        if (commandParts.length > 1) {
          const buttonText = commandParts[1].trim();
          clickButtonByText(buttonText);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error);
      if (event.error === 'no-speech') {
        console.log('No se detectó voz, reiniciando...');
        recognition.start();
      }
    };

    recognition.onend = () => {
      if (settings.voiceControlEnabled) {
        console.log('Reconocimiento terminado, reiniciando...');
        recognition.start();
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error al iniciar reconocimiento de voz:', error);
    }

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error al detener reconocimiento:', error);
      }
    };
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
        <>
          <div id="voice-control-indicator" className="fixed top-20 right-5 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-lg text-sm font-semibold flex flex-col gap-2 z-[9999] shadow-xl max-w-[320px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              🎤 Control por Voz Activo
            </div>
            
            <div className="text-xs opacity-90 space-y-1 border-t border-white/20 pt-2 max-h-[400px] overflow-y-auto">
              <p className="font-bold">Comandos disponibles:</p>
              <div className="space-y-0.5">
                <p className="text-white/80">📍 Navegación:</p>
                <p className="pl-2">• "Inicio"</p>
                <p className="pl-2">• "Características"</p>
                <p className="pl-2">• "Contacto"</p>
                
                <p className="text-white/80 mt-2">👤 Cuenta:</p>
                <p className="pl-2">• "Iniciar sesión"</p>
                <p className="pl-2">• "Registrarse"</p>
                <p className="pl-2">• "Perfil"</p>
                
                <p className="text-white/80 mt-2">♿ Accesibilidad:</p>
                <p className="pl-2">• "Menú accesibilidad"</p>
                <p className="pl-2">• "Cerrar menú"</p>
                
                <p className="text-white/80 mt-2">🔘 Botones:</p>
                <p className="pl-2">• "Empezar ahora"</p>
                <p className="pl-2">• "Más información"</p>
                <p className="pl-2">• Di el texto del botón</p>
              </div>
            </div>
          </div>
          
          {/* Feedback del último comando */}
          {showCommandFeedback && lastCommand && (
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full text-sm font-semibold z-[10000] shadow-lg">
              ✓ "{lastCommand}"
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AccessibilityWidgets;
