# Abre y edita CieloAzul

Esta carpeta contiene el proyecto completo: código fuente, todos los index.html, fotografías, panel de administración y documentación. Puedes abrirla con Visual Studio Code mediante Archivo > Abrir carpeta, o abrir el archivo CieloAzul.code-workspace. También se puede abrir como carpeta en Visual Studio.

## Dónde está cada archivo

| Quiero modificar… | Archivo o carpeta |
| --- | --- |
| Portada HTML generada | dist/index.html |
| Catálogo HTML | dist/viajes/index.html |
| Ficha HTML de un paquete | dist/viajes/nombre-del-paquete/index.html |
| Destinos y sus páginas HTML | dist/destinos/index.html y dist/destinos/nombre-del-destino/index.html |
| Nosotros, contacto y privacidad | dist/nosotros/index.html, dist/contacto/index.html y dist/privacidad/index.html |
| Página de error | dist/404.html |
| Estructura y textos permanentes de las páginas públicas | build.mjs |
| Colores, tamaños, espacios y adaptación a pantallas | src/style.css y src/polish.css |
| Tarjetas y funciones compartidas | src/shared.mjs |
| Navegación, filtros, comparación y cotización | src/app.mjs |
| Presentación de redes, categorías y carteles | src/brand.mjs |
| Viajes, fechas, precios, destinos y enlaces de redes | content.json o el panel local |
| Fotografías y carteles | src/assets/ |
| Pantalla de administración | admin/index.html |
| Estilos y comportamiento del panel | admin/admin.css y admin/admin.mjs |
| Guardado, validación y respaldos | admin-store.mjs |
| Servidor local | server.mjs |

Los HTML de dist están incluidos para que puedas verlos y editarlos. Ten presente que generar el sitio o guardar desde el panel vuelve a crear esos archivos: para conservar tus cambios, edita las plantillas de build.mjs y los archivos de src. Los estilos y scripts de dist/assets también son copias generadas de src.

## Vista previa desde Visual Studio Code

Requiere Node.js 20 o posterior disponible en el equipo. No se necesitan paquetes adicionales. Abre Terminal > Ejecutar tarea y selecciona «CieloAzul: iniciar vista previa y panel». La tarea genera el HTML y abre un servidor en el puerto 4181, separado de la vista previa anterior.

- Página: http://127.0.0.1:4181/
- Administración: http://127.0.0.1:4181/admin/

Mantén esa terminal abierta. Después de editar las plantillas o los estilos de src, ejecuta «CieloAzul: generar HTML» y recarga el navegador. Para detener el servidor utiliza Ctrl+C en su terminal. Si el puerto 4181 ya está ocupado por otra copia, detén primero esa copia.

En otra herramienta puedes usar estos comandos en la terminal, desde esta carpeta:

```sh
node build.mjs
node server.mjs
```

Con estos comandos la dirección predeterminada es http://127.0.0.1:4173/. No abras los index.html con doble clic: los filtros, módulos y rutas necesitan el servidor local. Live Server puede mostrar el sitio estático, pero no ejecuta el guardado del panel.

## Qué incluye esta entrega

Incluye los datos actuales y la administración local. No está conectada al sitio original ni publica cambios en internet. El formulario público prepara una solicitud para compartir; no envía correos desde un servidor. Para administrar una futura web pública faltan alojamiento, acceso autenticado y almacenamiento permanente.

Consulta ADMINISTRACION.md para el uso del panel y FUENTES.md para el origen de la información. Los respaldos históricos de las pruebas no se incluyen en el ZIP; el proyecto crea nuevos respaldos al guardar.
