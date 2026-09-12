> Actualización: consulta [ACTUALIZACION-VISUAL.md](ACTUALIZACION-VISUAL.md) para los cambios del 12 de septiembre de 2026, las redes y los carteles recuperados. Esa revisión amplía los datos pendientes descritos aquí.

# Verificación — 11 de septiembre de 2026

## Resultado

Se completaron cinco pruebas automatizadas, sin fallos, y comprobaciones de interacción en navegador. Se persigue WCAG 2.2 AA; esta revisión no equivale a una certificación de conformidad integral.

## Comprobado en navegador

- Escritorio 1440 × 1000, tablet 768 × 1024 y celular 390 × 844; adicionalmente reflujo a 320 × 800. Se observaron las imágenes y la disposición de las tarjetas.
- Ancho de documento menor o igual al viewport en las vistas verificadas; ninguna barra flotante tapa contenido.
- Filtro Mazatlán + máximo $7,500 devuelve Oceano Palace de marzo 2027. Añadir septiembre 2026 deja cero coincidencias y muestra ayuda; limpiar restaura los resultados.
- Selección de dos paquetes abre comparación con fechas, precio, transporte, incluidos y pendientes. Al seleccionar tres se deshabilita la cuarta casilla. Escape cierra el diálogo y devuelve el foco al botón Comparar.
- Menú móvil: nombre accesible, `aria-expanded` coherente, apertura y cierre; Escape devuelve foco al botón. Se usó su enlace Contacto.
- Navegación de ficha de viaje y formulario; cotización de Riu Dunamar conserva hotel, destino, fechas, transporte y precio.
- Envío vacío del formulario muestra errores de nombre y correo. Dos menores con una sola edad produce un error comprensible. Dos edades válidas permiten generar el mensaje.
- Se revisaron los `href` de WhatsApp y correo: número/correo público y texto completo codificado. **No se enviaron mensajes ni se probaron cuentas externas.**
- Se provocó temporalmente un catálogo JSON inválido: el error conserva el HTML previo y permite reintentar después de restaurar los datos.
- Tecla Tab alcanza «Saltar al contenido» con contorno visible.
- Texto ampliado al 200 % mediante una copia temporal del mismo HTML con raíz de 32 px: portada, contacto y detalle a 320 px. Se detectó y corrigió desbordamiento; las tres vistas quedaron sin desplazamiento horizontal. Las copias temporales se eliminaron.

## Comprobado automáticamente

`npm test` ejecuta:

1. Filtros combinados, presupuesto inclusivo, tipos, orden cronológico y orden por precio.
2. Identificadores únicos, destinos válidos, fechas/duración consistentes y campos pendientes nulos.
3. Cotizaciones generadas desde los mismos registros que las fichas y tarjetas.
4. Veintiún HTML (20 rutas + 404), un h1 por página, títulos únicos, metadatos y canónicos presentes, JSON-LD válido y referencias locales existentes.
5. Contraste mínimo 4.5:1 en los pares principales de texto, enlaces, botones y errores.

También se comprobó sintaxis del JavaScript y respuesta HTTP 200 de la portada. Imágenes locales entre 57 y 71 KB, dimensiones reservadas, carga diferida fuera de la imagen principal y sin fuentes ni bibliotecas remotas. El catálogo y las fichas se entregan en HTML; la búsqueda y comparación requieren JavaScript.

## Implementado y pendiente de revisión más amplia

Semántica de navegación y formularios, etiquetas y errores asociados, resumen de errores con foco, estados vivos de resultados, controles de al menos 44–46 px salvo casillas con etiqueta táctil amplia, reducción de movimiento y contenido equivalente mediante CSS adaptable.

Pendiente: auditoría completa con lector de pantalla, axe/Lighthouse, contrastes sobre cada zona fotográfica y pruebas en dispositivos físicos Safari/iOS y Android. No se midieron Core Web Vitals de campo ni se garantiza una puntuación de rendimiento. Se inspeccionaron las rutas y recursos locales, pero no la disponibilidad de aplicaciones externas de correo, llamadas, mapas o WhatsApp. La descarga de texto está implementada; no se realizó un envío real ni una recepción por servidor.

## Antes de producción

Validar e incorporar el catálogo completo; confirmar importes y base de cobro, ocupación, impuestos, fechas conflictivas, disponibilidad, condiciones, itinerarios y exclusiones. Validar identidad legal y registro turístico. Confirmar derechos sobre fotografías. Si se desea recepción web directa, conectar y probar su servicio y aprobar aviso de privacidad. Configurar dominio definitivo, hosting, canónicos e indexación. No hay publicación incluida en esta entrega.
