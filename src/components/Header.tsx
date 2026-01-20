import { Brain, LogOut, User, Menu } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/hooks/use-i18n';
import LanguageToggle from './LanguageToggle';
import AccessibilitySidebar from './AccessibilitySidebar';
import { cn } from '@/lib/utils';
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

const NAVIGATION_VISIBILITY_KEY = 'navigation-visible';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuVisible, setIsMenuVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(NAVIGATION_VISIBILITY_KEY);
      return savedState !== null ? JSON.parse(savedState) : true;
    }
    return true;
  });
  
  const { common, header } = useI18n();

  useEffect(() => {
    localStorage.setItem(NAVIGATION_VISIBILITY_KEY, JSON.stringify(isMenuVisible));
  }, [isMenuVisible]);

  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
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

          {/* Botón de navegación */}
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

        {/* Navegación principal */}
        {isMenuVisible && (
          <NavigationMenu className='hidden md:flex flex-shrink-0 justify-start mx-4'> 
            <NavigationMenuList>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to='/caracteristicas' className='flex items-center gap-1.5'>
                    {header.features}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>
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

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to='/contacto'>
                    {header.contact}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
        
        {/* Lado derecho */}
        <div className='flex items-center gap-3 ml-auto'>
          
          <LanguageToggle /> 
          
          {/* Menú de accesibilidad */}
          <AccessibilitySidebar />
          
          {/* Autenticación */}
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
