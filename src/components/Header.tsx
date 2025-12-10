import { Brain, LogOut, User, Menu, Sun, Moon, Monitor, Contrast, Type, Volume2, VolumeX, ZoomIn, ZoomOut, Play, StopCircle, BookOpen, FileText, Accessibility, Bell, AlertCircle, ArrowLeftRight, Square, CircleSlash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFontSize } from '@/contexts/FontSizeContext';
import { useButtonSize } from '@/contexts/ButtonSizeContext';
import { useLetterSpacing } from '@/contexts/LetterSpacingContext';
import { useAutoplayBlock } from '@/contexts/AutoplayBlockContext';
import { useSpeechReader } from '@/contexts/SpeechReaderContext';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, baseTheme } = useTheme();
  const { fontSize, fontSizeValue, setFontSize, setFontSizeValue, increaseFontSize, decreaseFontSize } = useFontSize();
  const { buttonSize, buttonSizeValue, setButtonSize, setButtonSizeValue } = useButtonSize();
  const { letterSpacing, setLetterSpacing } = useLetterSpacing();
  const { autoplayBlocked, setAutoplayBlocked } = useAutoplayBlock();
  const { isReading, isEnabled, isPaused, speed, volume, toggleEnabled, setSpeed, setVolume, stop, pause, resume, readEntirePage, readSelectedText } = useSpeechReader();
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [visualAlertsEnabled, setVisualAlertsEnabled] = useState(false);

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Modo Claro';
      case 'dark': return 'Modo Oscuro';
      case 'high-contrast': return `Alto Contraste (${baseTheme === 'dark' ? 'Oscuro' : 'Claro'})`;
      default: return 'Por Defecto';
    }
  };

  const getFontSizeLabel = () => {
    switch (fontSize) {
      case 'small': return 'Pequeña (14px)';
      case 'normal': return 'Normal (16px)';
      case 'large': return 'Grande (18px)';
      case 'extra-large': return 'Extra Grande (20px)';
      default: return 'Normal (16px)';
    }
  };

  return (
    <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md' role='banner'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link to='/' className='flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md' aria-label='TalentMatch - Ir al inicio'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground' aria-hidden='true'>
            <Brain className='h-6 w-6' />
          </div>
          <span className='text-xl font-bold'>TalentMatch</span>
        </Link>

        <nav className='hidden items-center gap-6 md:flex' role='navigation' aria-label='Navegación principal'>
          <Link to='/caracteristicas' className='text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1' aria-label='Ir a la página de características'>
            Características
          </Link>
          <Link to='/para-quien' className='text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1' aria-label='Ir a la página para quién'>
            Para quién
          </Link>
          <Link to='/contacto' className='text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1' aria-label='Ir a la página de contacto'>
            Contacto
          </Link>
        </nav>

        <div className='flex items-center gap-3'>
          <Sheet open={isAccessibilityOpen} onOpenChange={setIsAccessibilityOpen}>
            <SheetTrigger asChild>
              <Button variant='default' size='sm' aria-label='Abrir menú de accesibilidad' aria-haspopup='true' className='relative bg-blue-600 hover:bg-blue-700 text-white'>
                <Accessibility className='h-5 w-5' aria-hidden='true' />
                {isEnabled && <span className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background' aria-label='Lector de voz activo' />}
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-full sm:w-[400px] md:w-[480px] lg:w-[540px] overflow-y-auto'>
              <SheetHeader>
                <SheetTitle className='flex items-center gap-2'>
                  <Accessibility className='h-5 w-5' />
                  Opciones de Accesibilidad
                </SheetTitle>
                <SheetDescription>
                  Personaliza la experiencia visual y auditiva de la aplicación
                </SheetDescription>
              </SheetHeader>
              <div className='space-y-6 py-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label className='text-base flex items-center gap-2'>
                        {isEnabled ? <Volume2 className='h-4 w-4' /> : <VolumeX className='h-4 w-4' />}
                        Lector de Voz
                      </Label>
                      <p className='text-sm text-muted-foreground'>Usa atajos de teclado para controlar el lector</p>
                    </div>
                    <Switch checked={isEnabled} onCheckedChange={toggleEnabled} aria-label='Activar o desactivar lector de voz' />
                  </div>
                  {isEnabled && (
                    <div className='space-y-3 pl-6 border-l-2 border-muted'>
                      <div className='grid grid-cols-2 gap-2'>
                        <Button variant='outline' size='sm' onClick={readEntirePage} className='text-xs h-auto py-2' aria-label='Leer toda la página (Alt+R)'>
                          <BookOpen className='h-4 w-4 mr-1' />
                          <span className='truncate'>Leer Página</span>
                        </Button>
                        <Button variant='outline' size='sm' onClick={readSelectedText} className='text-xs h-auto py-2' aria-label='Leer texto seleccionado (Alt+S)'>
                          <FileText className='h-4 w-4 mr-1' />
                          <span className='truncate'>Leer Selección</span>
                        </Button>
                      </div>
                      <div className='bg-muted/50 p-3 rounded-md space-y-1 text-xs'>
                        <p className='font-semibold mb-2'>Atajos de Teclado:</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + R</kbd> Leer toda la página</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + S</kbd> Leer texto seleccionado</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + X</kbd> Detener lectura</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + T</kbd> Activar/Desactivar</p>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='speech-speed' className='text-sm'>Velocidad: {speed.toFixed(1)}x</Label>
                          {isReading && <span className='flex items-center gap-1 text-xs text-green-600'><Play className='h-3 w-3' />Reproduciendo</span>}
                        </div>
                        <Slider id='speech-speed' min={0.5} max={2} step={0.1} value={[speed]} onValueChange={([value]) => setSpeed(value)} className='w-full' aria-label='Ajustar velocidad del lector de voz' />
                        <div className='flex justify-between text-xs text-muted-foreground'><span>Lento</span><span>Rápido</span></div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='speech-volume' className='text-sm'>Volumen: {Math.round(volume * 100)}%</Label>
                        <Slider id='speech-volume' min={0} max={1} step={0.1} value={[volume]} onValueChange={([value]) => setVolume(value)} className='w-full' aria-label='Ajustar volumen del lector de voz' />
                        <div className='flex justify-between text-xs text-muted-foreground'><span>Silencio</span><span>Alto</span></div>
                      </div>
                      {isReading && (
                        <Button variant='outline' onClick={isPaused ? resume : pause} className='w-full text-xs sm:text-sm h-auto py-2 px-3' aria-label={isPaused ? 'Continuar audio' : 'Pausar audio'}>
                          <Play className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
                          <span className='truncate'>{isPaused ? 'Continuar' : 'Pausar'}</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <Separator />
                <div className='space-y-4'>
                  <div className='space-y-0.5'>
                    <Label className='text-base flex items-center gap-2'><Sun className='h-4 w-4' />Tema Visual</Label>
                    <p className='text-sm text-muted-foreground'>{getThemeLabel()}</p>
                  </div>
                  <div className='grid grid-cols-2 gap-2 sm:gap-3'>
                    <Button variant={theme === 'system' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('system')}><Monitor className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Sistema</span></Button>
                    <Button variant={theme === 'light' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('light')}><Sun className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Claro</span></Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('dark')}><Moon className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Oscuro</span></Button>
                    <Button variant={theme === 'high-contrast' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('high-contrast')}><Contrast className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Alto Contraste</span></Button>
                  </div>
                </div>
                <Separator />
                <div className='space-y-4'>
                  <div className='space-y-0.5'>
                    <Label className='text-base flex items-center gap-2'><Type className='h-4 w-4' />Tamaño de Fuente</Label>
                    <p className='text-sm text-muted-foreground'>{fontSizeValue}px</p>
                  </div>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='font-size' className='text-sm'>Tamaño: {fontSizeValue}px</Label>
                      </div>
                      <Slider 
                        id='font-size' 
                        min={14} 
                        max={20} 
                        step={1} 
                        value={[fontSizeValue]} 
                        onValueChange={([value]) => setFontSizeValue(value)} 
                        className='w-full' 
                        aria-label='Ajustar tamaño de fuente' 
                      />
                      <div className='flex justify-between text-xs text-muted-foreground'><span>Pequeño (14px)</span><span>Grande (20px)</span></div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className='space-y-4'>
                  <div className='space-y-0.5'>
                    <Label className='text-base flex items-center gap-2'><ArrowLeftRight className='h-4 w-4' />Espaciado de Letras</Label>
                    <p className='text-sm text-muted-foreground'>{letterSpacing}px</p>
                  </div>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='letter-spacing' className='text-sm'>Espaciado: {letterSpacing}px</Label>
                      </div>
                      <Slider 
                        id='letter-spacing' 
                        min={-1} 
                        max={3} 
                        step={0.5} 
                        value={[letterSpacing]} 
                        onValueChange={([value]) => setLetterSpacing(value)} 
                        className='w-full' 
                        aria-label='Ajustar espaciado de letras' 
                      />
                      <div className='flex justify-between text-xs text-muted-foreground'><span>Unidas (-1px)</span><span>Separadas (3px)</span></div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className='space-y-4'>
                  <div className='space-y-0.5'>
                    <Label className='text-base flex items-center gap-2'><Square className='h-4 w-4' />Tamaño de Botones</Label>
                    <p className='text-sm text-muted-foreground'>{(buttonSizeValue * 100).toFixed(0)}%</p>
                  </div>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='button-size' className='text-sm'>Escala: {(buttonSizeValue * 100).toFixed(0)}%</Label>
                      </div>
                      <Slider 
                        id='button-size' 
                        min={0.85} 
                        max={1.3} 
                        step={0.05} 
                        value={[buttonSizeValue]} 
                        onValueChange={([value]) => setButtonSizeValue(value)} 
                        className='w-full' 
                        aria-label='Ajustar tamaño de botones' 
                      />
                      <div className='flex justify-between text-xs text-muted-foreground'><span>Pequeños (85%)</span><span>Grandes (130%)</span></div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label className='text-base flex items-center gap-2'>
                        <Bell className='h-4 w-4' />
                        Alertas Visuales
                      </Label>
                      <p className='text-sm text-muted-foreground'>Mostrar alertas visuales en lugar de sonidos</p>
                    </div>
                    <Switch checked={visualAlertsEnabled} onCheckedChange={setVisualAlertsEnabled} aria-label='Activar o desactivar alertas visuales' />
                  </div>
                  {visualAlertsEnabled && (
                    <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-md space-y-2'>
                      <div className='flex items-start gap-2'>
                        <AlertCircle className='h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
                        <p className='text-xs text-blue-900 dark:text-blue-100'>Las alertas visuales se mostrarán como notificaciones en la pantalla en lugar de reproducir sonidos de alerta.</p>
                      </div>
                    </div>
                  )}
                </div>
                <Separator />
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label className='text-base flex items-center gap-2'>
                        <CircleSlash className='h-4 w-4' />
                        Bloquear Autoplay
                      </Label>
                      <p className='text-sm text-muted-foreground'>Prevenir reproducción automática de videos y audios</p>
                    </div>
                    <Switch checked={autoplayBlocked} onCheckedChange={setAutoplayBlocked} aria-label='Activar o desactivar bloqueo de autoplay' />
                  </div>
                  {autoplayBlocked && (
                    <div className='bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 rounded-md space-y-2'>
                      <div className='flex items-start gap-2'>
                        <AlertCircle className='h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0' />
                        <p className='text-xs text-green-900 dark:text-green-100'>La reproducción automática de videos y audios está bloqueada. Tendrás que hacer clic para reproducir.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-3">
            
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Mi cuenta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Ver perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
