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
| `assets/papeles/` | CSS + SVG de los 5 diseños de papel (copia de la carpeta del backend) |
| `assets/fonts/` | woff2 de Fraunces, Nunito, Patrick Hand y Pinyon Script |
| `js/config.js` | `BACKEND_URL` y constantes compartidas |
| `js/papel.js` | Dibuja el papel de carta (vista previa, miniaturas, resumen) |

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
