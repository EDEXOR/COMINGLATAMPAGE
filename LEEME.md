# Sitio de COMING · cominglatam.com

Sitio estático (HTML + CSS + un JS pequeño, sin dependencias). Se publica tal cual en Cloudflare Pages (carpeta raíz = esta carpeta, sin comando de build).

- **Datos pendientes:** se cambian en un solo lugar, `CONFIG` en `sitio-src/build.py` (WhatsApp, correo, correo de bajas, endpoints de formularios, NIT, dirección, IVA). Luego: `python3 sitio-src/build.py`.
  Mientras un valor empiece con `[`, se ve resaltado en amarillo y el formulario NO envía nada.
- **Legales:** `/privacidad/` y `/terminos/` son BORRADORES para revisión de abogado (tienen `noindex`).
- `/activar/?demo=slug` y `/baja/?id=...&demo=slug` son las páginas a las que apuntan los correos y las demos (`noindex`).
- Fuentes Raleway y Quicksand (OFL) incrustadas en `assets/fonts` (subconjunto latino, woff2). Quicksand sustituye a Cocogoose.
- Las capturas de `assets/img/demo-*` son demos con **datos ficticios** y van rotuladas así.
