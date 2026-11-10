# Cabeceras de seguridad del sitio (Render → Static Site → Settings → Headers)

Ruta `/*` para todas. Probadas con todas las páginas (incluida la vista de impresión del panel) sin bloqueos.

| Nombre | Valor |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.cartaparasanta.com; font-src 'self' https://api.cartaparasanta.com; connect-src 'self' https://api.cartaparasanta.com; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |

Si se añade un servicio externo nuevo (fuentes, imágenes, otra API), hay que añadir su dominio a la directiva que corresponda de la CSP.
