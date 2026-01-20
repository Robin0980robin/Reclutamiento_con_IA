import { Brain, LogOut, User, Menu, Sun, Moon, Monitor, Contrast, Type, Volume2, VolumeX, ZoomIn, ZoomOut, Play, StopCircle, BookOpen, FileText, Target, Users, Mail, Bell, AlertCircle, CircleSlash } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFontSize } from '@/contexts/FontSizeContext';
import { useButtonSize } from '@/contexts/ButtonSizeContext';
import { useLetterSpacing } from '@/contexts/LetterSpacingContext';
import { useAutoplayBlock } from '@/contexts/AutoplayBlockContext';
import { useSpeechReader } from '@/contexts/SpeechReaderContext';
import { useI18n } from '@/hooks/use-i18n';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import LanguageToggle from './LanguageToggle';
import { cn } from '@/lib/utils';
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

// Clave para guardar la preferencia de visibilidad en localStorage
const NAVIGATION_VISIBILITY_KEY = 'navigation-visible';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, baseTheme } = useTheme();
  const { fontSize, fontSizeValue, setFontSize, setFontSizeValue, increaseFontSize, decreaseFontSize } = useFontSize();
  const { buttonSize, buttonSizeValue, setButtonSize, setButtonSizeValue } = useButtonSize();
  const { letterSpacing, setLetterSpacing } = useLetterSpacing();
  const { autoplayBlocked, setAutoplayBlocked } = useAutoplayBlock();
  const { isReading, isEnabled, isPaused, speed, volume, toggleEnabled, setSpeed, setVolume, stop, pause, resume, readEntirePage, readSelectedText } = useSpeechReader();
  const { header, common } = useI18n();
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [visualAlertsEnabled, setVisualAlertsEnabled] = useState(false);

  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return header.lightMode;
      case 'dark': return header.darkMode;
      case 'high-contrast': return `${header.highContrast} (${baseTheme === 'dark' ? header.altDark : header.altLight})`;
      default: return header.defaultMode;
    }
  };

  const getFontSizeLabel = () => {
    switch (fontSize) {
      case 'small': return `${header.small} (14px)`;
      case 'normal': return `${header.normal} (16px)`;
      case 'large': return `${header.large} (18px)`;
      case 'extra-large': return `${header.extraLarge} (20px)`;
      default: return `${header.normal} (16px)`;
    }
  };

  return (
    <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md' role='banner'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        
        <div className="flex items-center gap-4">
          
          {/* Logo */}
          <Link to='/' 
              className='flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md' 
              aria-label={`${common.appName} - ${common.backToHome}`} 
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground' aria-hidden='true'>
              <Brain className='h-6 w-6' />
            </div>
            <span className='text-xl font-bold'>{common.appName}</span>
          </Link>

          {/* BOTÓN 1: MENU DE NAVEGACIÓN (TRES RAYITAS) - POSICIÓN CORREGIDA */}
          <Button 
            variant='ghost' 
            size='sm' 
            onClick={toggleMenuVisibility}
            className="hidden md:inline-flex"
            aria-label={isMenuVisible ? 'Ocultar menú de navegación' : 'Mostrar menú de navegación'}
          >
            <Menu className='h-5 w-5' /> 
          </Button>
        </div>

        {/* NAVEGACIÓN PRINCIPAL: MENÚ EXPANDIBLE (Ajustado el layout) */}
        {/* Se usa flex-shrink-0 y mx-4 para limitar el ancho y evitar solapamiento, y justify-start para pegarlo al botón */}
        {isMenuVisible && (
          <NavigationMenu className='hidden md:flex flex-shrink-0 justify-start mx-4'> 
            <NavigationMenuList>
              
              {/* ITEM 1: CARACTERÍSTICAS (Alt + C) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to='/caracteristicas' className='flex items-center gap-1.5' title={`Atajo: Alt + C`}>
                    <Target className='h-4 w-4 text-primary/70' />
                    {header.features}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {/* ITEM 2: DESPLEGABLE DE INFORMACIÓN (Alt + P) */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className='flex items-center gap-1.5' title={`Atajo: Alt + P`}>
                  <Users className='h-4 w-4 text-primary/70' />
                  {header.forWho}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          to="/"
                        >
                          <Brain className="h-6 w-6 text-primary mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {common.appName}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Transformamos la búsqueda de talento con IA para conectar el mejor match.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/para-quien#reclutador" title="Para Reclutadores">
                      Encuentra candidatos preseleccionados en minutos.
                    </ListItem>
                    <ListItem href="/para-quien#candidato" title="Para Candidatos">
                      Descubre ofertas que realmente coinciden con tu CV.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* ITEM 3: CONTACTO (Alt + O) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to='/contacto' className='flex items-center gap-1.5' title={`Atajo: Alt + O`}>
                    <Mail className='h-4 w-4 text-primary/70' />
                    {header.contact}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
        
        {/* Lado Derecho (Language, Accessibility, Auth) - Mantenido a la derecha con ml-auto */}
        <div className='flex items-center gap-3 ml-auto'>
          
          <LanguageToggle /> 
          
          {/* BOTÓN 2: MENU DE ACCESIBILIDAD (SETTINGS / AJUSTES) */}
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
                  {header.customizeExperience}
                </SheetDescription>
              </SheetHeader>
              <div className='space-y-6 py-6'>
                {/* LECTOR DE VOZ */}
                <div className='space-y-4'>
                  {/* ... (Contenido de Lector de Voz) ... */}
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label className='text-base flex items-center gap-2'>
                        {isEnabled ? <Volume2 className='h-4 w-4' /> : <VolumeX className='h-4 w-4' />}
                        {header.voiceReader}
                      </Label>
                      <p className='text-sm text-muted-foreground'>{header.keyboardShortcuts}</p>
                    </div>
                    <Switch checked={isEnabled} onCheckedChange={toggleEnabled} aria-label={`Activar o desactivar ${header.voiceReader}`} />
                  </div>
                  {isEnabled && (
                    <div className='space-y-3 pl-6 border-l-2 border-muted'>
                      {/* ... (Botones y atajos) ... */}
                      <div className='grid grid-cols-2 gap-2'>
                        <Button variant='outline' size='sm' onClick={readEntirePage} className='text-xs h-auto py-2' aria-label={`${header.readPage} (Alt+R)`}>
                          <BookOpen className='h-4 w-4 mr-1' />
                          <span className='truncate'>{header.readPage}</span>
                        </Button>
                        <Button variant='outline' size='sm' onClick={readSelectedText} className='text-xs h-auto py-2' aria-label={`${header.readSelection} (Alt+S)`}>
                          <FileText className='h-4 w-4 mr-1' />
                          <span className='truncate'>{header.readSelection}</span>
                        </Button>
                      </div>
                      <div className='bg-muted/50 p-3 rounded-md space-y-1 text-xs'>
                        <p className='font-semibold mb-2'>Atajos de Teclado:</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + R</kbd> {header.readPage}</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + S</kbd> {header.readSelection}</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + X</kbd> {header.stopReading}</p>
                        <p><kbd className='px-1.5 py-0.5 bg-background border rounded text-xs'>Alt + T</kbd> Activar/Desactivar</p>
                      </div>
                      {/* ... (Sliders y Botón Detener) ... */}
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='speech-speed' className='text-sm'>{header.speed}: {speed.toFixed(1)}x</Label>
                          {isReading && <span className='flex items-center gap-1 text-xs text-green-600'><Play className='h-3 w-3' />Reproduciendo</span>}
                        </div>
                        <Slider id='speech-speed' min={0.5} max={2} step={0.1} value={[speed]} onValueChange={([value]) => setSpeed(value)} className='w-full' aria-label={`Ajustar ${header.speed} del lector de voz`} />
                        <div className='flex justify-between text-xs text-muted-foreground'><span>{header.slow}</span><span>{header.fast}</span></div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='speech-volume' className='text-sm'>{header.volume}: {Math.round(volume * 100)}%</Label>
                        <Slider id='speech-volume' min={0} max={1} step={0.1} value={[volume]} onValueChange={([value]) => setVolume(value)} className='w-full' aria-label={`Ajustar ${header.volume} del lector de voz`} />
                        <div className='flex justify-between text-xs text-muted-foreground'><span>{header.silence}</span><span>{header.high}</span></div>
                      </div>
                      {isReading && <Button variant='outline' size='sm' onClick={stop} className='w-full' aria-label='Detener reproducción'><StopCircle className='h-4 w-4 mr-2' />Detener Lectura</Button>}
                    </div>
                  )}
                </div>
                <Separator />
                
                {/* TEMA VISUAL */}
                <div className='space-y-4'>
                  <div className='space-y-0.5'>
                    <Label className='text-base flex items-center gap-2'><Sun className='h-4 w-4' />{header.visualTheme}</Label>
                    <p className='text-sm text-muted-foreground'>{getThemeLabel()}</p>
                  </div>
                  <div className='grid grid-cols-2 gap-2 sm:gap-3'>
                    <Button variant={theme === 'system' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('system')}><Monitor className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>{header.system}</span></Button>
                    <Button variant={theme === 'light' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('light')}><Sun className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>{header.light}</span></Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('dark')}><Moon className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>{header.dark}</span></Button>
                    <Button variant={theme === 'high-contrast' ? 'default' : 'outline'} className='justify-start text-xs sm:text-sm h-auto py-2 px-3' onClick={() => setTheme('high-contrast')}><Contrast className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' /><span className='truncate'>{header.highContrast}</span></Button>
                  </div>
                </div>
                <Separator />
                
                {/* TAMAÑO DE FUENTE */}
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
          
          {/* BOTONES DE AUTENTICACIÓN */}
          <div className="flex items-center gap-3">
            
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {common.myAccount}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{common.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {common.profile}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {common.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {common.login}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  {common.register}
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

// --- UTILITY COMPONENT (Para NavigationMenu) ---
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = "ListItem";