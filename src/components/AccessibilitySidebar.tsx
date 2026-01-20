import React, { useState, useEffect } from 'react';
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Eye,
  Type,
  ZoomIn,
  ZoomOut,
  Link as LinkIcon,
  Keyboard,
  Mic,
  Moon,
  Sun,
  Contrast,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  FileText,
  Highlighter,
  Square
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTheme } from '@/contexts/ThemeContext';
import { useFontSize } from '@/contexts/FontSizeContext';
import { useSpeechReader } from '@/contexts/SpeechReaderContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { cn } from '@/lib/utils';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}

const AccessibilitySidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuditoryOpen, setIsAuditoryOpen] = useState(true);
  const [isVisualOpen, setIsVisualOpen] = useState(true);
  const [isMotorOpen, setIsMotorOpen] = useState(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize, increaseFontSize, decreaseFontSize } = useFontSize();
  const { isEnabled, toggleEnabled, isReading, readEntirePage, readSelectedText, stop } = useSpeechReader();
  const { settings, updateSetting } = useAccessibility();

  // Convertir fontSize a valor numérico para el slider (14-20px)
  const fontSizeToPixels = (size: string): number => {
    switch (size) {
      case 'small': return 14;
      case 'normal': return 16;
      case 'large': return 18;
      case 'extra-large': return 20;
      default: return 16;
    }
  };

  const pixelsToFontSize = (pixels: number): 'small' | 'normal' | 'large' | 'extra-large' => {
    if (pixels <= 14) return 'small';
    if (pixels <= 16) return 'normal';
    if (pixels <= 18) return 'large';
    return 'extra-large';
  };

  const [textSizeValue, setTextSizeValue] = useState(fontSizeToPixels(fontSize));
  const [letterSpacingValue, setLetterSpacingValue] = useState(settings.letterSpacingLevel);

  // Actualizar cuando cambie el fontSize desde fuera
  useEffect(() => {
    setTextSizeValue(fontSizeToPixels(fontSize));
  }, [fontSize]);

  // Actualizar cuando cambie el letterSpacing desde fuera
  useEffect(() => {
    setLetterSpacingValue(settings.letterSpacingLevel);
  }, [settings.letterSpacingLevel]);

  // Manejar cambio de tamaño de texto
  const handleTextSizeChange = (value: number[]) => {
    const newSize = value[0];
    setTextSizeValue(newSize);
    const newFontSize = pixelsToFontSize(newSize);
    setFontSize(newFontSize);
  };

  // Manejar cambio de separación de letras
  const handleLetterSpacingChange = (value: number[]) => {
    const newSpacing = value[0];
    setLetterSpacingValue(newSpacing);
    updateSetting('letterSpacingLevel', newSpacing);
  };

  // Atajos de teclado predefinidos
  const keyboardShortcuts: KeyboardShortcut[] = [
    { key: 'Alt + A', description: 'Abrir menú de accesibilidad', action: () => setIsOpen(!isOpen) },
    { key: 'Alt + R', description: 'Activar/Desactivar lector de voz', action: toggleEnabled },
    { key: 'Alt + +', description: 'Aumentar tamaño de texto', action: increaseFontSize },
    { key: 'Alt + -', description: 'Disminuir tamaño de texto', action: decreaseFontSize },
    { key: 'Alt + C', description: 'Ir a Características', action: () => window.location.href = '/caracteristicas' },
    { key: 'Alt + P', description: 'Ir a Para Quién', action: () => window.location.href = '/para-quien' },
    { key: 'Alt + O', description: 'Ir a Contacto', action: () => window.location.href = '/contacto' },
  ];

  // Toggle alto contraste
  const toggleHighContrast = (enabled: boolean) => {
    updateSetting('highContrast', enabled);
    if (enabled) {
      // Activar alto contraste
      setTheme('high-contrast');
      // Si darkMode está activo, mantenerlo
      if (settings.darkMode) {
        updateSetting('darkMode', true);
      }
    } else {
      // Desactivar alto contraste, volver al tema base
      if (settings.darkMode) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  };

  // Toggle modo oscuro
  const toggleDarkMode = (enabled: boolean) => {
    updateSetting('darkMode', enabled);
    
    // Disparar evento para sincronización con ThemeContext
    window.dispatchEvent(new Event('darkModeChanged'));
    
    if (settings.highContrast) {
      // Si alto contraste está activo, forzar recarga del tema
      // ThemeContext detectará el cambio en darkMode via el evento
      setTheme('high-contrast');
    } else {
      // No hay alto contraste, cambiar entre dark y light normalmente
      setTheme(enabled ? 'dark' : 'light');
    }
  };

  // Toggle resaltado de enlaces
  const toggleLinkHighlight = (enabled: boolean) => {
    updateSetting('linkHighlightEnabled', enabled);
  };

  // Control por voz
  const toggleVoiceControl = (enabled: boolean) => {
    updateSetting('voiceControlEnabled', enabled);
  };

  // Toggle video-intérprete
  const toggleVideoInterpreter = (enabled: boolean) => {
    updateSetting('videoInterpreterEnabled', enabled);
  };

  // Toggle navegación por teclado
  const toggleKeyboardNavigation = (enabled: boolean) => {
    updateSetting('keyboardNavigationEnabled', enabled);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          aria-label="Abrir menú de accesibilidad"
          className="relative hover:bg-accent"
        >
          <Accessibility className="h-5 w-5" aria-hidden="true" />
          {(isEnabled || settings.videoInterpreterEnabled || settings.voiceControlEnabled || settings.keyboardNavigationEnabled) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-[400px] md:w-[480px] lg:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Accessibility className="h-6 w-6" />
            Menú de Accesibilidad
          </SheetTitle>
          <SheetDescription>
            Personaliza tu experiencia para una navegación más cómoda y accesible
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          
          {/* ============= CATEGORÍA: AUDITIVA ============= */}
          <Collapsible open={isAuditoryOpen} onOpenChange={setIsAuditoryOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Auditiva
                </span>
                {isAuditoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Video-intérprete */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Video-intérprete de Lengua de Señas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Muestra un avatar que traduce el contenido a lengua de señas
                    </p>
                  </div>
                  <Switch 
                    checked={settings.videoInterpreterEnabled} 
                    onCheckedChange={toggleVideoInterpreter}
                    aria-label="Activar video-intérprete"
                  />
                </div>
                {settings.videoInterpreterEnabled && (
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p className="text-muted-foreground">
                      ✓ Avatar de lengua de señas activado
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* ============= CATEGORÍA: VISUAL ============= */}
          <Collapsible open={isVisualOpen} onOpenChange={setIsVisualOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Visual
                </span>
                {isVisualOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              
              {/* Alto Contraste / Modo Oscuro */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <Label className="text-base flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Tema Visual
                </Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Alto Contraste</Label>
                    <p className="text-xs text-muted-foreground">
                      Maximiza la diferencia de colores
                    </p>
                  </div>
                  <Switch 
                    checked={settings.highContrast} 
                    onCheckedChange={toggleHighContrast}
                    aria-label="Activar alto contraste"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      Modo Oscuro
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Reduce el brillo de la pantalla
                    </p>
                  </div>
                  <Switch 
                    checked={settings.darkMode} 
                    onCheckedChange={toggleDarkMode}
                    aria-label="Activar modo oscuro"
                  />
                </div>
              </div>

              {/* Tamaño de Texto */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <Label className="text-base flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Tamaño de Texto
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {textSizeValue}px
                  </span>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[textSizeValue]}
                    onValueChange={handleTextSizeChange}
                    min={14}
                    max={20}
                    step={1}
                    className="w-full"
                    aria-label="Ajustar tamaño de texto"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Pequeño (14px)</span>
                    <span>Grande (20px)</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Usa Alt + (+/-) para ajustar rápidamente
                </p>
              </div>

              {/* Separación entre Letras */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <Label className="text-base flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Separación entre Letras
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    Nivel {letterSpacingValue}
                  </span>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[letterSpacingValue]}
                    onValueChange={handleLetterSpacingChange}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                    aria-label="Ajustar separación entre letras"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Compacto</span>
                    <span>Amplio</span>
                  </div>
                </div>
                <div className="p-2 bg-muted rounded text-center" style={{ letterSpacing: `${(letterSpacingValue - 3) * 0.05}em` }}>
                  <p className="text-sm">Ejemplo de texto con esta separación</p>
                </div>
              </div>

              {/* Lectura por Voz */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      Lector de Pantalla (TTS)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lee el contenido en voz alta
                    </p>
                  </div>
                  <Switch 
                    checked={isEnabled} 
                    onCheckedChange={toggleEnabled}
                    aria-label="Activar lector de voz"
                  />
                </div>
                {isEnabled && (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-1">
                        {isReading ? '🔊 Leyendo...' : '⏸️ En espera'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isReading ? 'Presiona Alt + R para detener' : 'Presiona Alt + R para leer la página'}
                      </p>
                    </div>
                    
                    {/* Botones de control */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={isReading ? "destructive" : "default"}
                        size="sm"
                        onClick={isReading ? stop : readEntirePage}
                        className="w-full"
                      >
                        {isReading ? (
                          <>
                            <Square className="h-4 w-4 mr-2" />
                            Detener
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Leer Página
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={readSelectedText}
                        className="w-full"
                        disabled={isReading}
                      >
                        <Highlighter className="h-4 w-4 mr-2" />
                        Leer Selección
                      </Button>
                    </div>

                    {/* Atajos de teclado */}
                    <div className="p-2 bg-muted/50 rounded text-xs space-y-1">
                      <p className="font-semibold mb-1">Atajos de teclado:</p>
                      <p>• <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Alt + R</kbd> Leer/Detener página</p>
                      <p>• <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Alt + S</kbd> Leer texto seleccionado</p>
                      <p>• <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Alt + X</kbd> Detener lectura</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Resaltado de Enlaces */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Resaltado de Enlaces
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Destaca todos los enlaces y elementos enfocables
                    </p>
                  </div>
                  <Switch 
                    checked={settings.linkHighlightEnabled} 
                    onCheckedChange={toggleLinkHighlight}
                    aria-label="Activar resaltado de enlaces"
                  />
                </div>
                {settings.linkHighlightEnabled && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      ✓ Enlaces resaltados con bordes de alto contraste
                    </p>
                  </div>
                )}
              </div>

            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* ============= CATEGORÍA: MOTRIZ ============= */}
          <Collapsible open={isMotorOpen} onOpenChange={setIsMotorOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Motriz
                </span>
                {isMotorOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              
              {/* Control por Voz */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Control por Voz
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Navega usando comandos de voz
                    </p>
                  </div>
                  <Switch 
                    checked={settings.voiceControlEnabled} 
                    onCheckedChange={toggleVoiceControl}
                    aria-label="Activar control por voz"
                  />
                </div>
                {settings.voiceControlEnabled && (
                  <div className="space-y-2 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">🎤 Escuchando...</p>
                    <p className="text-xs text-muted-foreground">
                      Di "Inicio", "Características", "Contacto" para navegar
                    </p>
                  </div>
                )}
              </div>

              {/* Navegación por Flechas del Teclado */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      Navegación con Flechas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Navega sin mouse usando las flechas del teclado
                    </p>
                  </div>
                  <Switch 
                    checked={settings.keyboardNavigationEnabled} 
                    onCheckedChange={toggleKeyboardNavigation}
                    aria-label="Activar navegación con flechas"
                  />
                </div>
                {settings.keyboardNavigationEnabled && (
                  <div className="space-y-2 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">⌨️ Navegación Activa</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• ↑↓ o ←→ para moverte entre elementos</p>
                      <p>• Home: Ir al primer elemento</p>
                      <p>• End: Ir al último elemento</p>
                      <p>• Enter/Space: Activar elemento</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Atajos de Teclado */}
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <Label className="text-base flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Atajos de Teclado
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsShortcutsOpen(!isShortcutsOpen)}
                  >
                    {isShortcutsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                
                {isShortcutsOpen && (
                  <div className="space-y-2">
                    {keyboardShortcuts.map((shortcut, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                      >
                        <span className="text-muted-foreground">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Los atajos están preconfigurados y activos
                </p>
              </div>

            </CollapsibleContent>
          </Collapsible>

          {/* Botón de Restablecer */}
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                updateSetting('videoInterpreterEnabled', false);
                updateSetting('highContrast', false);
                updateSetting('linkHighlightEnabled', false);
                updateSetting('voiceControlEnabled', false);
                updateSetting('keyboardNavigationEnabled', false);
                updateSetting('darkMode', false);
                setTheme('light');
              }}
            >
              Restablecer Configuración
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccessibilitySidebar;
