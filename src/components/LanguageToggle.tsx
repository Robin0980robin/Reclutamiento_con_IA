// src/components/LanguageToggle.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageToggle = () => {
  const { settings, updateSetting } = useAccessibility();
  const currentLang = settings.language;

  const handleLanguageChange = (newLang: 'es' | 'en') => {
    // Usar el método updateSetting de AccessibilityContext para cambiar y guardar la preferencia
    updateSetting('language', newLang); 
  };
  
  const getLangLabel = (lang: string) => {
    switch(lang) {
      case 'es': return 'Español';
      case 'en': return 'English';
      default: return 'Idioma';
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`Idioma actual: ${getLangLabel(currentLang)}`}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Seleccionar Idioma</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('es')} 
          className="cursor-pointer flex justify-between items-center"
        >
          <span>Español</span>
          {currentLang === 'es' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')} 
          className="cursor-pointer flex justify-between items-center"
        >
          <span>English</span>
          {currentLang === 'en' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;