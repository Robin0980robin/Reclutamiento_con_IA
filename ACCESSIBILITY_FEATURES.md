# Características de Accesibilidad ♿

## Menú de Accesibilidad en el Header (Hamburguesa)

Se ha implementado un menú completo de accesibilidad consolidado en un icono de hamburguesa en el Header de la aplicación.

### Indicador Visual
- Punto verde en el icono hamburguesa cuando el lector de voz está activo

---

## 1. Lector de Voz 🔊

### Funcionalidad Principal

El lector de voz permite escuchar el contenido de la página usando síntesis de voz del navegador.

#### Modos de Lectura

**Leer Página Completa** 📖
- Lee todo el contenido visible de la página actual
- Captura: títulos, párrafos, enlaces, botones, listas
- Botón: "Leer Página"

**Leer Texto Seleccionado** 📄
- Lee únicamente el texto que hayas seleccionado/resaltado
- Útil para leer secciones específicas
- Botón: "Leer Selección"

#### Atajos de Teclado ⌨️

| Atajo | Función |
|-------|---------|
| `Alt + R` | Leer toda la página |
| `Alt + S` | Leer texto seleccionado |
| `Alt + X` | Detener lectura |
| `Alt + T` | Activar/Desactivar lector de voz |

#### Controles Disponibles

**Velocidad de Lectura** ⚡
- Rango: 0.5x a 2.0x
- Control deslizante (slider)
- Muestra velocidad actual en tiempo real

**Volumen** 🔊
- Rango: 0% a 100%
- Control deslizante (slider)
- Muestra porcentaje actual

**Estado de Reproducción** ▶️
- Indicador visual "Reproduciendo" cuando está activo
- Botón "Detener Lectura" (solo visible durante reproducción)

**Persistencia**
- Las preferencias se guardan automáticamente en localStorage
- Se restauran al volver a cargar la página
- Voz en español seleccionada por defecto

---

## 2. Control de Temas 🎨

### Icono: Accesibilidad (♿)

#### Modos de Tema Disponibles

**Por Defecto (Sistema)** 🖥️
- Detecta automáticamente las preferencias del sistema operativo
- Se adapta si el usuario cambia el tema de su sistema
- Icono: Monitor

**Modo Claro** ☀️
- Tema con fondo blanco y textos oscuros
- Ideal para ambientes bien iluminados
- Icono: Sol

**Modo Oscuro** 🌙
- Tema con fondo oscuro y textos claros
- Reduce la fatiga visual en ambientes con poca luz
- Icono: Luna

**Alto Contraste** ⚫⚪
- Se adapta automáticamente al tema base (claro u oscuro)
- Mantiene los colores de la paleta pero con mayor contraste
- **Alto Contraste Claro**: Colores azules/verdes con contraste mejorado
- **Alto Contraste Oscuro**: Colores del tema oscuro con mayor saturación
- Características adicionales:
  - Texto más legible (font-weight: 500)
  - Estados de enfoque más visibles (2px outline)
  - Sombras elegantes para dar profundidad
- Icono: Contraste

#### Cómo Funciona el Alto Contraste

El modo de alto contraste es **inteligente**:
- En **modo claro** → **alto contraste claro**
- En **modo oscuro** → **alto contraste oscuro**
- En **modo sistema** → basado en preferencia del sistema

Los colores principales se **mantienen** pero mejorados:
- ✨ Mayor saturación de colores
- ✨ Mejor contraste fondo/texto
- ✨ Tipografía más definida
- ✨ Sombras para profundidad

---

## 3. Control de Tamaño de Fuente 🔤

#### Tamaños Disponibles

1. **Pequeña** - 14px (87.5%)
2. **Normal** - 16px (100%) - Por defecto
3. **Grande** - 18px (112.5%)
4. **Extra Grande** - 20px (125%)

#### Características Principales

✨ **Completamente Responsive**
- Todos los elementos escalan proporcionalmente
- Breakpoints se ajustan automáticamente
- Funciona en móvil, tablet y desktop

✨ **Botones Rápidos**
- 🔍 **Reducir**: Disminuye el tamaño (deshabilitado en "Pequeña")
- 🔎 **Ampliar**: Aumenta el tamaño (deshabilitado en "Extra Grande")

✨ **Escala Inteligente**
- Títulos (h1-h6) se ajustan automáticamente
- Textos, botones, enlaces mantienen proporcionalidad
- Elementos de UI se adaptan al nuevo tamaño
- Fórmula responsive: `calc(var(--base-font-size) * multiplicador)`

✨ **Ejemplos de Escala**
```
Tamaño Normal (16px):
- h1: 36px (móvil) → 40px (tablet) → 48px (desktop)
- h2: 30px (móvil) → 32px (tablet) → 36px (desktop)
- h3: 24px (móvil) → 28px (tablet) → 30px (desktop)

Tamaño Grande (18px):
- h1: 40.5px (móvil) → 45px (tablet) → 54px (desktop)
- h2: 33.75px (móvil) → 36px (tablet) → 40.5px (desktop)
- h3: 27px (móvil) → 31.5px (tablet) → 33.75px (desktop)
```

#### Cómo Usar

1. Haz clic en el icono de Tipografía (**T**) en el Header
2. Aparecerá un menú con:
   - 4 tamaños preestablecidos (con iconos de vista previa)
   - Botones "Reducir" y "Ampliar" para ajuste rápido
3. Selecciona el tamaño deseado
4. **Toda la página se ajusta instantáneamente**
5. Una marca (✓) indica el tamaño actual

---

## Persistencia de Preferencias 💾

Todas las preferencias se guardan en `localStorage`:
- ✅ Tema seleccionado
- ✅ Tema base (para alto contraste)
- ✅ Tamaño de fuente
- ✅ Se mantienen después de cerrar el navegador

---

## Accesibilidad WCAG 2.1 ♿

### Cumplimiento de Estándares

✅ **Nivel AA/AAA**
- Contraste de colores adecuado
- Tamaños de fuente ajustables
- Navegación por teclado completa
- Etiquetas ARIA en todos los controles

✅ **Características**
- Anuncios de pantalla lectora
- Estados de enfoque visibles
- Indicadores visuales claros
- Botones con descripciones completas

✅ **Beneficios para Usuarios**
- Personas con baja visión
- Personas con daltonismo
- Personas con sensibilidad a la luz
- Usuarios de lectores de pantalla
- Navegación por teclado

---

## Diseño Responsive 📱💻

### Adaptación Automática

El sistema es **100% responsive**:
- ✅ Móviles (< 768px)
- ✅ Tablets (768px - 1024px)
- ✅ Desktop (> 1024px)

### Elementos que Escalan

- Todos los textos (p, span, a, button)
- Títulos (h1-h6) con breakpoints
- Botones e inputs
- Espaciados proporcionales
- Íconos y elementos UI

---

## Archivos del Sistema

### Contextos
- `src/contexts/ThemeContext.tsx` - Gestión de temas
- `src/contexts/FontSizeContext.tsx` - Gestión de tamaño de fuente

### Componentes
- `src/components/Header.tsx` - Menús de accesibilidad

### Configuración
- `src/App.tsx` - Providers integrados
- `src/index.css` - Estilos responsive y temas

---

## Tecnologías Utilizadas

- **React Context API** - Estado global
- **CSS Custom Properties** - Variables CSS
- **Tailwind CSS** - Estilos utility-first
- **localStorage** - Persistencia de datos
- **Lucide React** - Iconos
- **shadcn/ui** - Componentes UI

---

## Resumen Visual

```
Header
├── 🏠 Logo (TalentMatch)
├── 📍 Navegación (Características, Para quién, Contacto)
└── 🎛️ Controles de Accesibilidad
    ├── ♿ Control de Temas
    │   ├── 🖥️ Sistema (Por defecto)
    │   ├── ☀️ Claro
    │   ├── 🌙 Oscuro
    │   └── ⚫⚪ Alto Contraste (adaptativo)
    ├── 🔤 Control de Fuente
    │   ├── 📏 Pequeña (14px)
    │   ├── 📏 Normal (16px)
    │   ├── 📏 Grande (18px)
    │   ├── 📏 Extra Grande (20px)
    │   └── 🔍 Botones Reducir/Ampliar
    └── 👤 Cuenta de Usuario
```

---

¡Sistema de accesibilidad completo implementado! 🎉
