> Actualización: consulta [ACTUALIZACION-VISUAL.md](ACTUALIZACION-VISUAL.md) para los cambios del 12 de septiembre de 2026, las redes y los carteles recuperados. Esa revisión amplía los datos pendientes descritos aquí.

# CieloAzul — propuesta funcional independiente

Vista previa: http://127.0.0.1:4173/ (mientras el servidor local esté encendido). Panel de administración: http://127.0.0.1:4173/admin/.

No se ha modificado ni publicado nada en el sitio original. No había código ni una copia de la auditoría anterior en la carpeta de trabajo. La propuesta parte de los requisitos entregados y de una revisión del sitio público el 11 de septiembre de 2026.

## Ejecutar

Requiere Node.js 20 o posterior. No requiere instalar paquetes ni credenciales.

Desde esta carpeta:

```sh
npm run build
npm start
```

Abre http://127.0.0.1:4173/. Para las comprobaciones automatizadas: `npm test`.
El servidor escucha exclusivamente en el equipo local. No abras los archivos HTML con doble clic: las rutas y los módulos requieren HTTP.

## Código

- `content.json`: fuente única editable de agencia, destinos, redes y paquetes; datos pendientes representados por `null`.
- `admin/`: panel local para gestionar el contenido, subir fotos y restaurar respaldos. Consulta [ADMINISTRACION.md](ADMINISTRACION.md).
- `src/data.mjs`: carga la fuente única para generar el sitio.
- `src/shared.mjs`: filtros, fechas, precios, tarjetas y texto de cotización compartidos.
- `src/app.mjs`: menú, búsqueda, comparación y preparación de solicitudes.
- `src/style.css`: diseño adaptable, estados de foco y movimiento reducido.
- `src/assets/`: cuatro fotografías del sitio original, entre 57 y 71 KB cada una.
- `build.mjs`: genera 20 páginas HTML, una página 404, catálogo JSON, metadatos, sitemap y robots.
- `server.mjs`: servidor local para probar la entrega.
- `tests/catalog.test.mjs`: pruebas de datos, filtros, cotizaciones, rutas, metadatos y contraste.
- `dist/`: sitio generado. Todos los recursos visuales principales se sirven localmente.

## Qué permite hacer

Buscar por destino, mes de salida, tipo y presupuesto máximo; ordenar por salida o precio; limpiar filtros; identificar búsquedas sin resultados y reintentar errores de carga. Comparar de dos a tres paquetes con teclado o controles táctiles. Consultar fichas propias con datos de viaje, incluidos, exclusiones, itinerario y condiciones, marcando lo que falta confirmar. Preparar la solicitud con el paquete y los viajeros, revisarla, abrir WhatsApp o correo y descargar una copia de texto.

La selección contiene **10 paquetes y 4 destinos**, extraídos del catálogo público; no es una migración de toda la oferta. El tipo de viaje solo ofrece las categorías presentes en esta selección (todo incluido terrestre y aéreo).

## Dependencias y límites reales

El formulario **no envía solicitudes a un servidor**. Prepara el mensaje localmente; WhatsApp o el cliente de correo requieren que la persona confirme el envío. Descargar el texto funciona como alternativa local. No hay pagos, reservas, correo transaccional, base de datos ni sincronización con el sistema original.

Para recepción directa será necesario conectar un servicio, configurar credenciales fuera del código y establecer validación de servidor, protección contra abuso, tratamiento y retención de datos y aviso de privacidad aprobado por la agencia. Esa integración no se presenta como operativa.

Precios publicados de referencia: no se ha supuesto que sean por persona. La agencia debe confirmar base de cobro, ocupación, impuestos, tarifa final, disponibilidad, horarios, itinerarios, exclusiones y políticas. Razón social, registro turístico y testimonios no se afirman sin evidencia verificable. Las fotografías son del destino, no del hotel.

## SEO y publicación posterior

La prueba usa `noindex,nofollow`, robots con `Disallow: /` y cabecera HTTP `X-Robots-Tag`; no debe indexarse. Los canónicos y Open Graph utilizan el origen local. El sitemap incluye las 20 rutas. Los datos estructurados describen la agencia con sus datos públicos y las páginas de detalle; no se generan ofertas ni valoraciones no verificadas.

Para una futura publicación autorizada, definir `SITE_ORIGIN` con el dominio final y `SITE_INDEXABLE=true` al generar el sitio. Esto cambia el HTML y robots. `server.mjs` es exclusivamente un servidor de prueba y conserva la cabecera noindex: el hosting de producción deberá servir `dist` con su propia configuración. Se deben confirmar los datos comerciales, autorización de uso de las fotografías, el dominio canónico y la política de privacidad antes de indexar. Esta entrega no realiza esa publicación.

Consulta [VERIFICACION.md](VERIFICACION.md) y [FUENTES.md](FUENTES.md) para evidencias y pendientes.
