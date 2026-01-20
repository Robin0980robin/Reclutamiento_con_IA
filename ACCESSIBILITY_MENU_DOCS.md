# Menú de Accesibilidad - Documentación

## 📋 Descripción General

Se ha implementado un **Menú de Accesibilidad lateral completo** en la aplicación, diseñado siguiendo las pautas WCAG (Web Content Accessibility Guidelines) para mejorar la experiencia de usuarios con diferentes necesidades de accesibilidad.

## 🎯 Ubicación

El botón de accesibilidad se encuentra en la **barra de navegación superior (Navbar)**, del lado derecho, junto al selector de idioma y los botones de autenticación.

- **Icono**: Universal de accesibilidad (♿ persona en silla de ruedas)
- **Indicador visual**: Un punto verde aparece cuando alguna función está activa
- **Posición**: Parte derecha del header, antes de los botones de login/registro

## 🎨 Características Implementadas

### 📢 Categoría: AUDITIVA

#### Video-intérprete de Lengua de Señas
- **Función**: Activa un avatar que traduce el contenido a lengua de señas
- **Estado**: Infraestructura lista para integración
- **Indicador visual**: Widget flotante en la esquina inferior derecha cuando está activo
- **Cómo usar**: Toggle switch en el menú

### 👁️ Categoría: VISUAL

#### 1. Alto Contraste / Modo Oscuro
- **Alto Contraste**: Maximiza la diferencia de colores para mayor legibilidad
- **Modo Oscuro**: Reduce el brillo de la pantalla
- **Atajos**: Switches independientes para cada opción
- **Persistencia**: Las preferencias se guardan en localStorage

#### 2. Tamaño de Texto
- **Rango**: 14px (pequeño) hasta 20px (extra grande)
- **Control**: 
  - **Barra deslizante interactiva** con ajuste continuo
  - Muestra el valor en píxeles en tiempo real
- **Atajos de teclado**: 
  - `Alt + +` para aumentar
  - `Alt + -` para disminuir
- **Indicador visual**: Muestra "Xpx" al lado del título

#### 3. Separación entre Letras (Letter-spacing)
- **Rango**: Nivel 1 (compacto) hasta Nivel 5 (amplio)
- **Control**: 
  - **Barra deslizante interactiva** con 5 niveles
  - Vista previa en tiempo real con texto de ejemplo
- **Valores**:
  - Nivel 1: -0.05em (compacto)
  - Nivel 2: -0.025em (ligeramente compacto)
  - Nivel 3: normal (estándar)
  - Nivel 4: 0.05em (amplio)
  - Nivel 5: 0.1em (muy amplio)
- **Beneficio**: Mejora la legibilidad para usuarios con dislexia o baja visión

#### 4. Lectura por Voz (TTS - Text-to-Speech)
- **Función**: Lee el contenido en voz alta
- **Estado**: Integrado con el contexto SpeechReader existente
- **Controles visuales**:
  - **Botón "Leer Página"**: Lee todo el contenido visible de la página
  - **Botón "Leer Selección"**: Lee únicamente el texto que hayas seleccionado/subrayado
  - **Botón "Detener"**: Aparece cuando está leyendo para detener la lectura
- **Indicador**: Muestra "🔊 Leyendo..." cuando está activo o "⏸️ En espera" cuando está pausado
- **Atajos de teclado**: 
  - `Alt + R`: **Toggle** - Si está leyendo lo detiene, si no está leyendo comienza a leer la página
  - `Alt + S`: Leer texto seleccionado/subrayado
  - `Alt + X`: Detener lectura en cualquier momento
- **Mejoras**:
  - Alt + R ahora funciona como interruptor (toggle on/off)
  - Feedback visual cuando no hay texto seleccionado
  - Botones grandes y claros para cada acción

- **Beneficio**: Mejora la legibilidad para usuarios con dislexia o baja visión

#### 5. Resaltado de Enlaces
- **Función**: Destaca todos los enlaces y elementos enfocables
- **Efecto visual**: Borde de alto contraste y fondo semi-transparente
- **Comportamiento**: Resalta automáticamente todos los elementos interactivos
- **Estilos CSS**: Aplicados globalmente mediante la clase `.highlight-links`

### ⌨️ Categoría: MOTRIZ

#### 1. Navegación con Flechas del Teclado
- **Función**: Permite navegar por toda la aplicación sin mouse usando las flechas
- **Controles**:
  - `↑` o `←`: Navegar al elemento anterior
  - `↓` o `→`: Navegar al siguiente elemento
  - `Home`: Ir al primer elemento enfocable
  - `End`: Ir al último elemento enfocable
  - `Enter` o `Space`: Activar el elemento seleccionado
- **Indicador visual**: Widget flotante en la esquina inferior izquierda con "⌨️ Navegación por Teclado"
- **Scroll automático**: El elemento enfocado se centra automáticamente en la pantalla
- **Resaltado mejorado**: Borde azul brillante con sombra para el elemento activo

#### 2. Atajos de Teclado Personalizados
- **Visualización**: Lista desplegable completa de todos los atajos disponibles
- **Atajos predefinidos**:
  - `Alt + A`: Abrir menú de accesibilidad
  - `Alt + R`: Activar/Desactivar lector de voz
  - `Alt + +`: Aumentar tamaño de texto
  - `Alt + -`: Disminuir tamaño de texto
  - `Alt + C`: Ir a Características
  - `Alt + P`: Ir a Para Quién
  - `Alt + O`: Ir a Contacto

#### 3. Control por Voz
- **Función**: Navegación mediante comandos de voz
- **Estado**: Infraestructura implementada con Web Speech API
- **Comandos básicos**:
  - "Inicio" → Navega a la página principal
  - "Características" → Navega a características
  - "Contacto" → Navega a contacto
- **Indicador visual**: Banner rojo pulsante en la parte superior derecha mostrando "🎤 Escuchando..."
- **Compatibilidad**: Navegadores con soporte para Web Speech API (Chrome, Edge)

## 🏗️ Arquitectura Técnica

### Componentes Creados

1. **AccessibilitySidebar.tsx**
   - Componente principal del menú lateral
   - Usa shadcn/ui Sheet para el panel deslizante
   - Organizado con Collapsible para categorías expandibles
   - Integrado con todos los contextos de accesibilidad

2. **AccessibilityWidgets.tsx**
   - Maneja los widgets visuales (video-intérprete, indicador de voz, navegación por teclado)
   - Implementa la lógica del Web Speech API
   - Se renderiza globalmente en App.tsx

3. **KeyboardNavigationManager.tsx**
   - Gestiona la navegación por teclado con flechas
   - Muestra el indicador visual cuando está activo
   - Integrado con el hook use-keyboard-navigation

4. **use-keyboard-navigation.ts** (Hook)
   - Hook personalizado para navegación por flechas
   - Encuentra y gestiona elementos focusables
   - Implementa scroll automático al elemento enfocado

### Contextos Actualizados

**AccessibilityContext.tsx** - Nuevas propiedades:
```typescript
interface AccessibilitySettings {
  // ... propiedades existentes
  videoInterpreterEnabled: boolean;
  linkHighlightEnabled: boolean;
  voiceControlEnabled: boolean;
  keyboardNavigationEnabled: boolean;
}
```

### Estilos CSS (index.css)

Se agregaron estilos específicos para:
- `.highlight-links`: Resaltado de enlaces y elementos enfocables
- `.enhanced-focus`: Indicadores de foco mejorados
- `.keyboard-navigation`: Mejoras visuales para navegación por teclado
- `#video-interpreter-widget`: Widget del video-intérprete
- `#voice-control-indicator`: Indicador de control por voz activo
- `#keyboard-navigation-indicator`: Indicador de navegación por teclado

## 🔧 Integración

### En Header.tsx
```tsx
import AccessibilitySidebar from './AccessibilitySidebar';

// En el render:
<LanguageToggle />
<AccessibilitySidebar />  // Reemplaza el menú anterior
<AuthButtons />
```

### En App.tsx
```tsx
import AccessibilityWidgets from '@/components/AccessibilityWidgets';

// Dentro del TooltipProvider:
<AccessibilityWidgets />
```

## 📱 Comportamiento Responsive

- **Móvil**: El sidebar se adapta al ancho completo
- **Tablet**: Ancho de 400-480px
- **Desktop**: Ancho máximo de 540px
- **Scroll**: Scrollable cuando el contenido excede la altura de la pantalla

## 💾 Persistencia de Datos

Todas las preferencias se guardan en `localStorage` con la clave:
```
accessibility-settings
```

Las configuraciones persisten entre sesiones del navegador.

## 🎨 Diseño UX/UI

### Principios de Diseño
- **Claridad**: Etiquetas descriptivas con iconos universales
- **Feedback visual**: Indicadores de estado activo/inactivo
- **Organización**: Categorías colapsables por tipo de discapacidad
- **Accesibilidad**: Todos los controles son navegables por teclado
- **Consistencia**: Usa el sistema de diseño shadcn/ui existente

### Animaciones
- Transiciones suaves al abrir/cerrar el panel
- Animación pulse para el indicador de control por voz
- Expansión/colapso suave de categorías

## 🚀 Funcionalidades Futuras

### Próximas Implementaciones
1. **Video-intérprete**: Integrar servicio real de traducción a lengua de señas
2. **Control por voz avanzado**: Más comandos y navegación completa
3. **Personalización de atajos**: Permitir al usuario reasignar teclas manualmente
4. **Modos de daltonismo**: Filtros para diferentes tipos de daltonismo
5. **Modo de lectura**: Simplificar diseño para enfoque en contenido
6. **Navegación por voz**: Combinar control por voz con navegación por teclado

## 📊 Cumplimiento WCAG

El menú implementa las siguientes pautas:
- ✅ **WCAG 2.1 AA**: Contraste de color adecuado
- ✅ **Navegación por teclado**: Todos los elementos son accesibles
- ✅ **ARIA labels**: Etiquetas descriptivas para lectores de pantalla
- ✅ **Focus visible**: Indicadores claros de foco
- ✅ **Responsive**: Funciona en todos los tamaños de pantalla

## 🐛 Notas de Desarrollo

### Compatibilidad del Control por Voz
- Requiere navegador compatible con Web Speech API
- Funciona mejor en Chrome y Edge
- Firefox tiene soporte limitado
- Safari requiere permisos adicionales

### Pruebas Recomendadas
1. Probar con lector de pantalla (NVDA, JAWS)
2. Navegación completa por teclado
3. Verificar en diferentes resoluciones
4. Probar el contraste en modo alto contraste
5. Validar los atajos de teclado

## 📖 Cómo Usar para el Usuario Final

1. **Abrir el menú**: Click en el icono ♿ en la barra superior
2. **Expandir categorías**: Click en las secciones colapsables
3. **Activar funciones**: Usar los switches toggle
4. **Ajustar configuraciones**: Usar los controles +/- o sliders
5. **Ver atajos**: Expandir la sección de atajos de teclado
6. **Restablecer**: Botón al final del menú para valores por defecto

---

**Autor**: Derek  
**Fecha**: Enero 2026  
**Proyecto**: Sistema de Reclutamiento con IA  
**Tecnologías**: React, TypeScript, Tailwind CSS, shadcn/ui
