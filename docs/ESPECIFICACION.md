# Especificación del sitio — CartaParaSanta.com

Documento de referencia para construir el sitio a partir del prototipo aprobado (`docs/prototipo/`). Stack: HTML + CSS + JavaScript sin framework, como `te-lo-dije-frontend`.

- Lanzamiento: **jueves 19 de noviembre de 2026**.
- API: ver `carta-para-santa-backend/docs/ESPECIFICACION.md`. Aquí solo se resume lo que el sitio necesita.

---

## 1. Identidad visual

| Token | Valor | Uso |
| --- | --- | --- |
| Verde pino | `#0F3324` | Encabezado, portada, footer, bloques oscuros |
| Rojo | `#B3261E` (hover `#9C2019`, sombra del botón `#6E1611`) | Botón principal, acentos |
| Verde | `#1F6B47` | Íconos, confirmaciones |
| Dorado | `#C9A24A` / claro `#E2C27A` | Acentos sobre verde, etiquetas |
| Crema | `#FBF7EF` | Fondo general |
| Borde suave | `#EADFC8` | Tarjetas |
| Texto | `#1F2A24`, secundario `#4B5550`, terciario `#5A645F` | |

Tipografías (Google Fonts, licencia OFL; auto-alojadas en `assets/fonts/` como en Yo Te Lo Dije):

- **Fraunces** 500/700: títulos.
- **Nunito** 400/600/700/800: interfaz y texto.
- **Patrick Hand**: letra del niño en las cartas.
- **Pinyon Script**: firma de Santa y saludos cursivos.

Reglas: sin emoji; íconos SVG de trazo; botones redondeados (`border-radius: 999px`), mínimo 44 px de alto; contraste AA. La cara de Santa no aparece nunca.

## 2. Landing (`index.html`)

Prototipo: `docs/prototipo/Main.dc.html`.

1. **Encabezado** verde con logo (sobre + "CartaParaSanta.com") y navegación: Cómo funciona, Diseños, Precio y envío, Para padres, botón "Escribir mi carta".
2. **Portada**: fondo verde con puntitos de nieve que **caen** (dos capas de `radial-gradient` animando `background-position`, 18 s, lineal, infinito). Título "¡Escríbele tu carta a Santa!", texto, botón "¡Escribe tu carta a Santa!" → `carta.html`.
   - A la derecha, el **sobre flotante** (sello perforado verde, matasellos del Polo Norte, lacre rojo con estrella, "Para: tu nombre aquí"), animado con `translateY` y una leve rotación, 6 s.
   - Debajo del sobre, la nota: "*Imagen ilustrativa. La carta de Santa llega en un sobre blanco estándar con ventana, no en un sobre decorado."
   - El borde inferior de la portada es una **ola de nieve** color crema (SVG con `preserveAspectRatio="none"`).
3. **Cómo funciona**: 4 tarjetas numeradas.
4. **Una respuesta de verdad, en tu buzón**: bloque rojo con lista de lo que incluye y la ilustración de la carta de Santa + sobre blanco con ventanas.
5. **Diseños**: las 5 miniaturas de papel (§4) con nombre y descripción, y el botón "Empezar mi carta".
6. **Precio y envío**: precio, fecha límite y días de entrega leídos de `GET /api/config`.
7. **Preguntas de los padres**: `<details>` nativos, incluida "¿El sobre viene decorado?".
8. **Footer**: contacto, privacidad, términos, nombre legal y dirección.

Si `mailboxOpen` es falso, el botón principal cambia a "El buzón del Polo Norte cerró por este año" y se desactiva.

Todas las animaciones se detienen con `@media (prefers-reduced-motion: reduce)`.

## 3. Generador (`carta.html`)

Prototipo: `docs/prototipo/Generator.dc.html` (es interactivo; la lógica de la clase `Component` es la referencia).

Diseño: encabezado verde con los 4 pasos como botones; a la izquierda el panel del paso; a la derecha la **vista previa en vivo** (en móvil queda debajo).

**Estado** (se guarda en `localStorage` con la clave `cps_borrador` en cada cambio y se recupera al volver):

```js
{ step: 1, design: 'clasica', childName: '', childAge: '', greeting: 'Querido Santa:',
  message: '', gifts: [], giftDraft: '', farewell: 'Con mucho cariño,', signature: '' }
```

En producción los campos empiezan **vacíos** (el prototipo trae datos de ejemplo).

**Pasos**

1. **Diseño**: "Elige tu carta". Rejilla de las 5 miniaturas; la seleccionada lleva borde rojo de 3 px. Botón "Escribir mi carta".
2. **Escribir**: nombre (opcional), edad (opcional), saludo, mensaje (textarea), ideas de frases como chips que se añaden al final del mensaje, lista de regalos (añadir con botón o Enter, quitar con ✕), despedida y firma. Botón "Ver mi carta".
3. **Revisar**: "¿Quedó perfecta?" Resumen de diseño, número de palabras y número de regalos, cada uno con "Editar". Botón "Está lista".
4. **Enviar**: "¡Tu carta está lista!", nota para el adulto y botón "Continuar al envío" → `enviar.html`.

Ideas de frases: "Este año me porté muy bien." · "Ayudé mucho en casa." · "Aprendí algo nuevo en la escuela." · "¿Cómo están los renos?" · "Te dejaré galletas y leche."

Línea automática de presentación en la carta: "Me llamo {nombre} y tengo {edad} años." (o solo la parte que exista).

**Límites** (iguales en el backend, mostrar contador cuando falten 20 caracteres):

| Campo | Máximo |
| --- | --- |
| Nombre | 30 |
| Edad | 1–17 |
| Saludo | 40 |
| Mensaje | 700 |
| Regalos | 12, de 60 caracteres cada uno |
| Despedida | 40 |
| Firma | 30 |

## 4. Los 5 papeles de carta

Prototipo: `docs/prototipo/LetterArt.dc.html`. Es un solo componente con el parámetro `design`. Se usa en la vista previa del generador, en las miniaturas del paso 1, en la landing y en el resumen de compra (en ese último el prototipo aún tiene el estilo anterior: usar este componente).

| id | Nombre | Fondo / marco | Papel | Decoración |
| --- | --- | --- | --- | --- |
| `clasica` | Correo aéreo clásico | Rayas diagonales rojo `#C8302B`, crema, verde `#2F8A4A` | Crema con textura, líneas `#E9B98A` | 2 sellos perforados (estrella, regalo), matasellos de ondas; saludo en Pinyon Script rojo; pie "¡Feliz Navidad!" |
| `taller` | Taller de los duendes | Tablas de madera | Pergamino `#F5E8CD` con sombra | Guirnalda de pino con luces y bayas, estrellas doradas colgando, regalo con lazo, carrete de cordel, etiqueta "hecho con cariño de duende" |
| `estrellas` | Noche de estrellas | Azul marino `#1B3A57` con estrellas blancas y doradas | Blanco, líneas `#C7DCE0` | Calcomanías: pingüinos, adorno, muñeco de jengibre, guantes, bastón, media, taza, árbol de galleta, muñeco de nieve, regalo |
| `polonorte` | Cielo del Polo Norte | Celeste `#AEDDEC` | Blanco con forma ondulada, líneas `#B9E1EE` | Adornos colgantes, copos, nieve abajo, poste "POLO NORTE", "Taller de Santa · Polo Norte" |
| `juguetes` | Juguetes en acuarela | Crema `#FBF8F2` | Transparente, líneas `#E2E2E8` | Juguetes con efecto acuarela (filtro SVG `feTurbulence` + `feDisplacementMap`): regalo, robot, bola, tambor, payasito, caballito, osito, cascanueces; saludo centrado en Nunito |

Comportamiento común:

- Texto en Patrick Hand 21 px con `line-height: 32px`, alineado sobre las líneas del papel (`repeating-linear-gradient` cada 32 px).
- El papel **crece con el contenido**; las decoraciones se posicionan respecto a los bordes, no a una altura fija.
- Modo miniatura: solo el saludo y las líneas, dibujado a 360 × 480 y escalado con `transform: scale()`.
- La carpeta `assets/papeles/` (un CSS por diseño + SVG) es copia de `papeles/` del backend, que la usa para imprimir. Lo que se ve en pantalla debe ser lo que se imprime.

Implementación sugerida: `js/papel.js` con `renderPapel(contenedor, design, contenido, { mini })` que arma el HTML del papel.

> **Implementado (9 nov 2026):** para que la vista previa sea idéntica a la impresión, `js/papel.js` usa los mismos fondos JPG que imprime Lob (`assets/papeles/`, versión web de `papeles/fondos/` del backend), la misma caja de texto (`layout.json`) y el mismo cálculo de letra y renglones que `printTemplate.js`. La hoja es de tamaño carta fijo (la letra se ajusta al contenido) en lugar de un papel que crece.

## 5. Compra (`enviar.html`)

Prototipo: `docs/prototipo/Checkout.dc.html`.

- Lee el borrador de `localStorage`; si no hay, redirige a `carta.html`.
- Campos: nombre y correo del adulto; nombre en el sobre; dirección línea 1 y 2; ciudad o pueblo; estado o territorio (Puerto Rico primero, luego los estados); código postal.
- Casilla obligatoria: "Soy mayor de edad y padre, madre o tutor del niño o niña (o tengo su permiso). Acepto los Términos de servicio y la Política de privacidad."
- Resumen: miniatura del papel escogido, nombre, diseño, número de regalos, "Incluye: respuesta de Santa, copia impresa de la carta original" y el total desde `GET /api/config`.
- Botón "Pagar {total} y enviar al Polo Norte" → `POST /api/checkout` → `window.location = checkoutUrl`.
- Errores del backend: mostrar `error` arriba del botón. Con `code: 'content_policy'`, ofrecer volver al generador.
- Si vuelve con `?cancelado=1`: "No se completó el pago. Tu carta sigue guardada."

Cuerpo de `POST /api/checkout`:

```json
{ "letter": { "design", "greeting", "childName", "childAge", "message", "gifts", "farewell", "signature" },
  "buyer": { "name", "email" },
  "shipTo": { "name", "line1", "line2", "city", "state", "zip", "country": "US" },
  "consent": { "isParentOrAuthorized": true, "acceptedTerms": true, "acceptedPrivacy": true } }
```

## 6. Confirmación (`gracias.html`)

Prototipo: `docs/prototipo/Confirm.dc.html` (pantalla de móvil 390 × 844; en escritorio se centra en una columna).

- Lee `?order=<id>` y llama a `GET /api/order/:id` para mostrar el número `PN-…` y el estado.
- Texto: "¡Ho, ho, ho! ¡Tu carta llegó al Polo Norte!", "Los duendes ya están preparando todo…", "¡Sigue soñando en grande!".
- Pasos: "Pedido recibido y pagado" (marca verde), "Los duendes preparan la respuesta" (círculo dorado que late), "Sale del Polo Norte por correo".
- Animaciones: el sobre entra volando (1.4 s) y luego flota; la ruta punteada avanza; las estrellas titilan; los textos aparecen escalonados; la nieve cae.
- Nunca dice que la carta ya salió si el estado no es `mailed` o posterior.
- Borra `cps_borrador` de `localStorage` al cargar con un `order` válido.

## 7. Panel (`admin.html`)

- Pide el token una vez y lo guarda en `sessionStorage`; lo manda en `x-admin-token`.
- Pestañas por estado con contador: Revisión, Errores, Pagadas, En Lob, Enviadas, Todas.
- Detalle: carta, dirección, vista previa de impresión (`/api/admin/orders/:id/preview` en un `iframe`), enlace al PDF de Lob.
- Acciones: aprobar, corregir dirección, reenviar, reembolsar.
- Ajustes: precio, buzón abierto o cerrado, fechas.
- Totales por día.
- `<meta name="robots" content="noindex">`.

## 8. Privacidad (sitio dirigido a niños)

- Sin Google Analytics ni píxeles. Si se mide algo, usar analítica sin cookies y sin datos personales.
- Ningún campo de la carta se envía antes de la compra.
- Las páginas legales salen de las de Yo Te Lo Dije, adaptadas: COPPA, qué se guarda del niño, con quién se comparte (Stripe, Lob, proveedor de correo), retención y cómo pedir el borrado.

## 9. Pruebas

- [ ] Generador completo en iPhone Safari y Android Chrome.
- [ ] Recargar a mitad del generador: el borrador se recupera.
- [ ] Los 5 papeles con texto al máximo: nada se sale ni se encima.
- [ ] Teclado: todo se puede usar con Tab y Enter.
- [ ] `prefers-reduced-motion`: nada se anima.
- [ ] Buzón cerrado: la landing y el generador lo indican y no dejan pagar.
