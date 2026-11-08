# Prototipo visual aprobado

Exportado del lienzo de diseño de CartaParaSanta.com el 7 de noviembre de 2026. Es la referencia visual: colores, tamaños, textos y animaciones.

| Archivo | Pantalla |
| --- | --- |
| `Main.dc.html` | Landing |
| `Generator.dc.html` | Generador (interactivo: la clase `Component` tiene la lógica de pasos, regalos e ideas) |
| `Checkout.dc.html` | Compra del adulto |
| `Confirm.dc.html` | Confirmación animada (móvil) |
| `LetterArt.dc.html` | Los 5 papeles de carta (parámetro `design`) |
| `SantaLetter.dc.html` | Carta impresa de respuesta de Santa (referencia para el backend) |

Cómo leerlos: son HTML con un formato de componentes de diseño. `{{nombre}}` es un valor calculado en `renderVals()`; `<sc-for>` repite, `<sc-if>` muestra condicionalmente y `<dc-import name="LetterArt">` inserta el componente de papel. Para el sitio real se traducen a HTML, CSS y JavaScript normales; no se cargan tal cual.

Los datos de ejemplo (Sofía, 7 años, bicicleta roja…) son solo para el prototipo. En el sitio real los campos empiezan vacíos.
