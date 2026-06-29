# KUSKA DESIGN SYSTEM v1.0
## "Glassmorphism Andino" — Diseño único, nunca genérico

### FILOSOFÍA
Inspiración visual: Stripe (precisión) + Apple (espacio) + Linear (micro-interacciones)
con alma 100% andina peruana. Nada genérico. Nada de templates.

### PROHIBICIONES ESTRICTAS DE DISEÑO
- NO: 3 cards iguales en fila como sección de servicios
- NO: gradientes azul/morado de IA genérica
- NO: hero con texto centrado + botón + imagen stock
- NO: footer gris con links en columnas genéricas
- NO: sombras box-shadow genéricas (0 2px 4px rgba(0,0,0,0.1))
- NO: border-radius 4px en botones
- NO: tipografía Arial, Roboto, sans-serif genérica
- NO: colores fuera de la paleta Kuska
- NO: secciones rectangulares repetitivas sin personalidad
- NO: íconos de emoji como íconos principales de UI
- NO: cursor personalizado (usar cursor DEFAULT del sistema)
- NO: spinners blancos genéricos (usar skeleton loaders)

### PALETA DE COLORES
```
--kuska-brown:      #3D1C02  /* navbar, footer, sidebars */
--kuska-red:        #C84B2F  /* CTAs principales, energía */
--kuska-teal:       #2E7A6E  /* éxito, naturaleza, confianza */
--kuska-gold:       #D4920A  /* premium, Kusi, highlights */
--kuska-cream:      #F5F0E8  /* FONDO PRINCIPAL de toda la app */
--kuska-cream-dark: #EDE8DE  /* hover states */
--kuska-white:      #FFFFFF  /* cards, panels, inputs */
--kuska-text:       #1A0A00  /* texto principal */
--kuska-text-mid:   #6B4C35  /* subtextos */
--kuska-border:     rgba(61,28,2,0.12)
```
**REGLA ABSOLUTA:** fondo público SIEMPRE cream `#F5F0E8`. Nunca negro.

### TIPOGRAFÍA
- **Display:** Playfair Display — H1, H2, H3, títulos, quotes
- **Body:** Inter — párrafos, UI, labels, inputs
- **Friendly:** Nunito — Kusi, badges, precios, mensajes

Escala: H1 72/42px · H2 48/32px · H3 32/24px · Body 18px (lh 1.6) · Small 14px · Badge 12px

### LIQUID GLASS SYSTEM
```css
.liquid-glass {
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(61,28,2,0.08),
              inset 0 1px 0 rgba(255,255,255,0.6),
              inset 0 -1px 0 rgba(61,28,2,0.06);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.liquid-glass-dark {
  background: rgba(61,28,2,0.82);
  backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(212,146,10,0.25);
  border-radius: 24px;
}
.liquid-glass-gold {
  background: rgba(212,146,10,0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212,146,10,0.35);
  border-radius: 20px;
}
```

### ESPACIADO (escala 8px estricta)
Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
Padding cards 32/20px · Gap grid 24/16px.
Radius: botones 12px · cards 20px · modales 28px · pills 999px.

### MICRO-INTERACCIONES OBLIGATORIAS
- **Botones:** hover `translateY(-2px)` + gold glow; active `scale(0.98)`; ripple al click.
- **Cards:** hover `translateY(-6px)` + 3D tilt con posición del mouse.
- **Inputs:** focus border gold + ring; float label; shake en error; check verde si válido.
- **Links navbar:** underline que crece desde el centro + color gold.

### PATRONES ANDINOS ÚNICOS
- **Dividers:** rombos escalonados incas en gold opacity 25%, height 48px, con shimmer.
- **Textura dashboards:** SVG tejido andino, opacity 3%, brown, 32×32px.
- **Badges:** Región (teal) · Técnica (gold) · Nuevo (red) · Premium (gradient gold) · Verificado (teal solido).

### KUSI (mascota)
Componente `<Kusi />` con 7 animaciones: float, wave, bounce, celebrate, think, idle, sleep.
Aparece en navbar (xs/idle), hero (xl/float), loading (lg/bounce), dashboards (lg/wave),
estados vacíos (md/think), éxito (lg/celebrate), errores (md/think), footer (sm/sleep).
**No aparece en:** /admin, checkout final, tablas de datos.
