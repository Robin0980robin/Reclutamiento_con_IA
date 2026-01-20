# 🎯 Navegación por Teclado sin Mouse

## Descripción

Funcionalidad de accesibilidad que permite a usuarios con **discapacidades motrices** o **sin acceso a un mouse** navegar completamente por la aplicación usando únicamente el teclado.

## ✨ Características

### Navegación con Flechas
- **↑ (Arriba)** o **← (Izquierda)**: Navegar al elemento anterior
- **↓ (Abajo)** o **→ (Derecha)**: Navegar al siguiente elemento
- **Home**: Saltar al primer elemento enfocable de la página
- **End**: Saltar al último elemento enfocable de la página
- **Enter** o **Space**: Activar el elemento seleccionado (click)
- **Tab**: Navegación estándar del navegador (también funciona)

### Elementos Navegables

El sistema detecta automáticamente todos los elementos interactivos:
- 🔗 Enlaces (`<a>`)
- 🔘 Botones (`<button>`)
- 📝 Campos de entrada (`<input>`, `<textarea>`, `<select>`)
- 🎯 Elementos con `tabindex`
- 🎭 Elementos con roles ARIA (`role="button"`, `role="link"`)

### Mejoras Visuales

Cuando la navegación por teclado está **activa**:

1. **Indicador flotante**: Widget en la esquina inferior izquierda mostrando:
   ```
   ⌨️ Navegación por Teclado
   Usa las flechas ↑↓←→
   ```

2. **Resaltado mejorado**: El elemento enfocado tiene:
   - Borde azul brillante de 4px
   - Sombra luminosa alrededor
   - Transición suave al cambiar de foco

3. **Scroll automático**: El elemento enfocado se centra automáticamente en la pantalla

## 🚀 Cómo Activar

### Opción 1: Desde el Menú de Accesibilidad
1. Click en el icono ♿ en la barra superior
2. Expandir la categoría "**Motriz**"
3. Activar el switch "**Navegación con Flechas**"

### Opción 2: Atajo de Teclado (próximamente)
```
Alt + N → Activar/Desactivar navegación por flechas
```

## 💡 Casos de Uso

### Usuarios Beneficiados
- ✅ Personas con discapacidades motrices
- ✅ Usuarios de tecnologías asistivas (joystick, sip-and-puff)
- ✅ Personas sin mouse disponible
- ✅ Usuarios que prefieren navegación por teclado
- ✅ Usuarios con lesiones temporales en manos/brazos
- ✅ Navegación más rápida para usuarios avanzados

### Escenarios de Uso
1. **Formularios largos**: Navegar rápidamente entre campos
2. **Listas de ofertas**: Revisar vacantes sin mouse
3. **Dashboards**: Explorar tarjetas y elementos
4. **Menús**: Navegar por opciones del navbar
5. **Modales y diálogos**: Interactuar sin mouse

## 🏗️ Implementación Técnica

### Arquitectura

```
┌─────────────────────────────────────┐
│  AccessibilitySidebar.tsx           │
│  (Switch para activar/desactivar)   │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  AccessibilityContext.tsx            │
│  (Estado global)                     │
│  keyboardNavigationEnabled: boolean  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  KeyboardNavigationManager.tsx       │
│  (Componente React)                  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  use-keyboard-navigation.ts          │
│  (Hook personalizado)                │
│  - Detecta elementos focusables      │
│  - Maneja eventos de teclado         │
│  - Controla el foco y scroll         │
└─────────────────────────────────────┘
```

### Hook `use-keyboard-navigation`

```typescript
export const useKeyboardNavigation = (enabled: boolean) => {
  // Obtiene todos los elementos focusables visibles
  const getFocusableElements = () => { ... }
  
  // Enfoca un elemento y hace scroll a él
  const focusElement = (element: HTMLElement) => { ... }
  
  // Maneja las teclas presionadas
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        // Siguiente elemento
      case 'ArrowUp':
      case 'ArrowLeft':
        // Elemento anterior
      case 'Home':
        // Primer elemento
      case 'End':
        // Último elemento
    }
  }
}
```

### Filtrado de Elementos

Solo se consideran elementos que:
- ✅ Tienen un selector válido (`a[href]`, `button`, etc.)
- ✅ Están visibles (`display !== 'none'`, `visibility !== 'hidden'`)
- ✅ Tienen un `offsetParent` (están en el DOM renderizado)
- ✅ No están deshabilitados (`disabled={false}`)

### CSS Aplicado

```css
.keyboard-navigation *:focus {
  outline: 3px solid hsl(var(--primary)) !important;
  outline-offset: 3px !important;
  box-shadow: 0 0 0 6px hsl(var(--primary) / 0.2) !important;
}

.keyboard-navigation *:focus-visible {
  outline: 4px solid hsl(var(--accent)) !important;
  outline-offset: 4px !important;
  box-shadow: 0 0 0 8px hsl(var(--accent) / 0.3),
              0 0 20px hsl(var(--accent) / 0.4) !important;
}
```

## 📊 Cumplimiento WCAG

Esta funcionalidad cumple con:

- ✅ **WCAG 2.1.1** (Nivel A): Funcionalidad del teclado
- ✅ **WCAG 2.4.3** (Nivel A): Orden del foco
- ✅ **WCAG 2.4.7** (Nivel AA): Foco visible
- ✅ **WCAG 3.2.1** (Nivel A): Al recibir el foco

## 🎨 Personalización

### Configuración del Hook

```typescript
// En tu componente
const { getFocusableElements, focusElement } = useKeyboardNavigation(enabled);

// Obtener elementos focusables manualmente
const elements = getFocusableElements();

// Enfocar un elemento específico
focusElement(elements[5]);
```

### Estilos Personalizados

Puedes modificar los estilos en `index.css`:

```css
/* Cambiar color del borde */
.keyboard-navigation *:focus {
  outline-color: red !important;
}

/* Cambiar tamaño del borde */
.keyboard-navigation *:focus {
  outline-width: 5px !important;
}
```

## 🐛 Problemas Conocidos

### Elementos Dinámicos
- Los elementos añadidos dinámicamente (AJAX) son detectados automáticamente
- No requiere reiniciar la navegación

### Elementos Ocultos
- Los elementos con `display: none` son ignorados automáticamente
- Los elementos en modales cerrados no son navegables

### Scroll
- El scroll automático puede no funcionar perfectamente en todos los navegadores
- Safari tiene limitaciones con `scrollIntoView({ behavior: 'smooth' })`

## 🔄 Interacción con Otras Funcionalidades

### Compatible con:
- ✅ Lector de voz (TTS)
- ✅ Resaltado de enlaces
- ✅ Alto contraste
- ✅ Tamaño de texto aumentado
- ✅ Control por voz

### Combinaciones Recomendadas:
1. **Navegación por teclado + Resaltado de enlaces**: Máxima visibilidad
2. **Navegación por teclado + Lector de voz**: Experiencia completa sin mouse
3. **Navegación por teclado + Alto contraste**: Para usuarios con baja visión

## 📖 Guía de Uso para Usuarios

### Primeros Pasos
1. Abre el menú de accesibilidad (icono ♿)
2. Ve a la sección "Motriz"
3. Activa "Navegación con Flechas"
4. Verás un indicador en la esquina inferior izquierda

### Navegación Básica
1. Usa **↓** o **→** para moverte hacia adelante
2. Usa **↑** o **←** para moverte hacia atrás
3. Presiona **Enter** para hacer click en el elemento
4. Presiona **Esc** para cerrar modales o volver atrás

### Trucos y Consejos
- 💡 Usa **Home** para ir rápidamente al inicio
- 💡 Usa **End** para ir al final de la página
- 💡 Combina con **Tab** para navegación híbrida
- 💡 El scroll automático te ayuda a no perderte

## 🧪 Testing

### Pruebas Manuales
1. Activar la navegación por teclado
2. Probar todas las teclas (↑↓←→, Home, End)
3. Verificar que el foco sea visible
4. Comprobar el scroll automático
5. Probar en diferentes páginas (home, login, dashboard)

### Pruebas con Usuarios
- Usuarios con discapacidades motrices
- Usuarios de tecnologías asistivas
- Usuarios sin mouse

## 📞 Soporte

Si encuentras problemas:
1. Verifica que la función esté activada (indicador visible)
2. Recarga la página
3. Desactiva y vuelve a activar
4. Revisa la consola del navegador (F12)

---

**Desarrollado por**: Derek  
**Fecha**: Enero 2026  
**Versión**: 1.0  
**Licencia**: MIT
