import { Brain, LogOut, User, Menu, Sun, Moon, Monitor, Contrast, Type, Volume2, VolumeX, ZoomIn, ZoomOut, Play, StopCircle, BookOpen, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFontSize } from '@/contexts/FontSizeContext';
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
  const { fontSize, setFontSize, increaseFontSize, decreaseFontSize } = useFontSize();
  const { isReading, isEnabled, speed, volume, toggleEnabled, setSpeed, setVolume, stop, readEntirePage, readSelectedText } = useSpeechReader();
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

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
              <Button variant='ghost' size='sm' aria-label='Abrir menú de accesibilidad' aria-haspopup='true' className='relative'>
                <Menu className='h-5 w-5' aria-hidden='true' />
                {isEnabled && <span className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background' aria-label='Lector de voz activo' />}
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-full sm:w-[400px] md:w-[480px] lg:w-[540px] overflow-y-auto'>
              <SheetHeader>
                <SheetTitle className='flex items-center gap-2'>
                  <Menu className='h-5 w-5' />
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
                      {isReading && <Button variant='outline' size='sm' onClick={stop} className='w-full' aria-label='Detener reproducción'><StopCircle className='h-4 w-4 mr-2' />Detener Lectura</Button>}
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
                    <p className='text-sm text-muted-foreground'>{getFontSizeLabel()}</p>
                  </div>
                  <div className='grid grid-cols-2 gap-2 sm:gap-3'>
                    <Button variant={fontSize === 'small' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setFontSize('small')}><Type className='h-3 w-3 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Pequeña</span></Button>
                    <Button variant={fontSize === 'normal' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setFontSize('normal')}><Type className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Normal</span></Button>
                    <Button variant={fontSize === 'large' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setFontSize('large')}><Type className='h-5 w-5 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Grande</span></Button>
                    <Button variant={fontSize === 'extra-large' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setFontSize('extra-large')}><Type className='h-6 w-6 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Extra Grande</span></Button>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='outline' onClick={decreaseFontSize} disabled={fontSize === 'small'} className='flex-1 text-xs sm:text-sm h-auto py-2 px-3' aria-label='Disminuir tamaño de fuente'><ZoomOut className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Reducir</span></Button>
                    <Button variant='outline' onClick={increaseFontSize} disabled={fontSize === 'extra-large'} className='flex-1 text-xs sm:text-sm h-auto py-2 px-3' aria-label='Aumentar tamaño de fuente'><ZoomIn className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>Ampliar</span></Button>
                  </div>
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
