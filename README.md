# CartaParaSanta.com — Sitio

Sitio estático (HTML + CSS + JavaScript sin framework, igual que `te-lo-dije-frontend`) donde un niño o niña escribe su carta a Santa y un adulto la envía. La respuesta de Santa llega impresa por correo postal.

- Especificación: [`docs/ESPECIFICACION.md`](docs/ESPECIFICACION.md)
- Prototipo visual aprobado: [`docs/prototipo/`](docs/prototipo/) y el lienzo de diseño en Claude
- Backend: `carta-para-santa-backend` (API en `https://api.cartaparasanta.com`)
- Plan de lanzamiento: https://claude.ai/artifact/2n5macLYHsB344UeenFmp4

## Páginas

| Archivo | Qué es |
| --- | --- |
| `index.html` | Landing |
| `carta.html` | Generador (4 pasos: Diseño, Escribir, Revisar, Enviar) |
| `enviar.html` | Compra para el adulto: dirección, consentimiento, pago |
| `gracias.html` | Confirmación animada ("¡Tu carta llegó al Polo Norte!") |
| `privacidad.html`, `terminos.html`, `reembolsos.html` | Páginas legales (se adaptan de Yo Te Lo Dije) |
| `admin.html` | Panel privado (pide el `ADMIN_TOKEN`, no se enlaza desde el sitio) |
| `assets/papeles/` | Fondos JPG de los papeles (versión web de `papeles/fondos/` del backend) y `layout.json` con la caja de texto de cada uno |
| `assets/logo-taller.png` | Logo "El Taller del Polo Norte" |
| `assets/fonts/` | woff2 de Fraunces, Nunito, Patrick Hand y Pinyon Script |
| `js/config.js` | `BACKEND_URL` y constantes compartidas |
| `js/papel.js` | Dibuja la carta sobre su papel con la misma maqueta que imprime el backend (`printTemplate.js`), así la vista previa es igual a lo que llega por correo |

## Correr en local

Cualquier servidor estático:

```bash
npx serve -l 5500 .
```

En `js/config.js`, `BACKEND_URL` apunta a `http://localhost:4000` en desarrollo y a `https://api.cartaparasanta.com` en producción.

## Desplegar en Render

1. **Static Site** desde este repo (sin build; carpeta de publicación: `.`).
2. Dominio: `www.cartaparasanta.com`; la raíz `cartaparasanta.com` redirige a `www` (igual que en Yo Te Lo Dije).
3. En el backend, `FRONTEND_URL=https://www.cartaparasanta.com` y ese origen en `CORS_ORIGINS`.

## Antes de lanzar

- [ ] Reemplazar todos los marcadores `[PRECIO]`, `[FECHA LÍMITE]`, `[X–Y] días`, `[correo]`, `[Nombre legal…]`. El precio y las fechas se leen de `GET /api/config`.
- [ ] Páginas legales revisadas (COPPA) y enlazadas desde el footer y desde la compra.
- [ ] Probar el generador completo en iPhone y Android.

## Cambiar un papel

1. En el backend, reemplaza `papeles/fondos/papel-<id>.jpg` (ver `docs/plantilla-fondos/`) y, si moviste la caja de texto, `papeles/layout.json`.
2. Copia aquí `layout.json` a `assets/papeles/` y genera las versiones web del fondo: `papel-<id>.jpg` a 1275 × 1650 px y `papel-<id>-mini.jpg` a 450 × 582 px (JPG calidad 80).
3. Si cambias el cálculo de letra o renglones en `printTemplate.js`, haz el mismo cambio en `js/papel.js`.
