// src/hooks/use-i18n.ts (COMPLETO Y CORREGIDO)

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { translations, Language } from '@/lib/i18n';

export function useI18n() {
  const { settings } = useAccessibility();
  const lang: Language = settings.language;
  
  const t = translations[lang] || translations.es; 
  
  // Exportamos TODAS las categorías de tu diccionario
  return {
    t: t, 
    lang, 
    common: t.common, 
    header: t.header, 
    hero: t.hero,      
    features: t.features, 
    login: t.login,    
    dashboard: t.dashboard, // <--- EXPORTADO PARA SOLUCIONAR EL ERROR
    forWho: t.forWho,      
  };
}