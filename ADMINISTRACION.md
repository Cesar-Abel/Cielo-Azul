# Cómo administrar CieloAzul

El panel está disponible en `http://127.0.0.1:4173/admin/` mientras la vista previa esté encendida. Funciona únicamente en esta computadora y actualiza la propuesta local; no modifica el sitio original de internet.

## Cambiar o crear un viaje

1. Abre **Mis viajes** y selecciona un paquete. También puedes usar **Crear un viaje** o **Duplicar** como punto de partida.
2. Edita hotel, destino, fechas, transporte, precio y servicios. Deja en blanco cualquier dato que todavía no esté confirmado.
3. Puedes subir una fotografía del paquete y un cartel en JPG, PNG o WebP de hasta 5 MB. Toda foto necesita una descripción útil para personas que usan lectores de pantalla.
4. Si cambias un dato asociado a un cartel, el panel desmarca automáticamente su revisión. Comprueba que el texto de la imagen y la transcripción coinciden antes de volver a aprobarlo.
5. Pulsa **Guardar y actualizar**. El catálogo, la ficha del viaje, los filtros y el mensaje de cotización se regeneran desde el mismo registro.

Para retirar un viaje sin perderlo, desmarca **Visible en el catálogo**. Las fechas se ordenan automáticamente en la página pública.

## Destinos, contacto y redes

En **Destinos** puedes cambiar nombre, textos y fotografía. Para la fotografía principal de un destino usa JPG. En **Contacto y redes** puedes editar teléfono, WhatsApp, correo, dirección y los enlaces de Facebook, Instagram, TikTok y YouTube.

Los enlaces de redes deben comenzar con `https://`. El teléfono y WhatsApp necesitan el código de país; WhatsApp se escribe solamente con números.

## Respaldos

Antes de cada guardado se crea una versión anterior en la carpeta `backups`. Desde **Respaldos** puedes restaurarla o descargar los datos como JSON. El JSON no contiene las fotografías, así que para una copia completa conserva también la carpeta `src/assets`.

## Límites de esta versión

El panel es local y no tiene cuentas de usuario. Para usarlo en un sitio público hace falta alojamiento con autenticación y almacenamiento permanente para datos e imágenes. Esa conexión no se presenta como operativa en esta entrega.
