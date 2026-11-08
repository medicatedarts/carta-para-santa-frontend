# Instrucciones para asistentes de código

Sitio estático de CartaParaSanta.com: HTML + CSS + JavaScript sin framework ni build, como `te-lo-dije-frontend`.

- La especificación es `docs/ESPECIFICACION.md`. El diseño aprobado está en `docs/prototipo/`. Reprodúcelo fielmente: colores, tipografías, textos y animaciones. Si algo no está claro, pregunta antes de inventar.
- Los archivos `.dc.html` del prototipo son un formato de diseño (plantillas con `{{variables}}` y una clase `Component`). No se copian tal cual: se traducen a HTML/CSS/JS normal.
- La experiencia móvil es la prioridad. Botones de al menos 44 px de alto, contraste AA, `prefers-reduced-motion` respetado.
- Nada de la carta se envía al servidor hasta que el adulto pulsa "Pagar" en `enviar.html`. Mientras tanto vive en `localStorage`.
- Los límites de validación deben coincidir con los del backend.
- Los 5 diseños de papel (`assets/papeles/`) son copia de los del backend: si cambias uno, avisa para actualizar el otro repo.
- Sin analítica que siga al usuario y sin cookies de terceros (el sitio está dirigido a niños).
