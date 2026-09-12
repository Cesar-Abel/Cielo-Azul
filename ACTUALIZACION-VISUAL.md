# Actualización visual — 12 de septiembre de 2026

Se atendió la solicitud de recuperar la esencia de CieloAzul y ampliar el diseño visual de la primera propuesta.

## Cambios

- Portada azul profundo con acentos turquesa, fotografía enmarcada, mejor jerarquía y el lema original «Tu pasaporte a la felicidad».
- Nuevos tratamientos de tarjetas, precios, bordes, sombras y efectos sutiles; se respeta movimiento reducido.
- Accesos a seis experiencias: todo incluido terrestre, aéreo, tours, internacionales, cruceros y bodas/XV años/luna de miel. Las categorías sin catálogo validado llevan a una consulta con el tema preparado, sin inventar oferta.
- Fotografías ilustrativas para las categorías y cuatro carteles recuperados del sitio original: Oceano Palace, Grand Decameron, Krystal Vallarta y el tour a Tampico con Río Vista Inn.
- Carteles íntegros ampliables, enlaces a detalles y transcripción de su información. En las tarjetas de catálogo se puede desplegar «Qué incluye».
- Apartado propio de redes y accesos en el pie de todas las páginas: Facebook, Instagram, TikTok y YouTube. Son los enlaces que publica el sitio original, no un feed conectado ni publicaciones inventadas.

## Evidencia que amplía la primera revisión

Los carteles de Oceano Palace de marzo de 2027 y Grand Decameron de mayo de 2027 especifican precio por adulto y ocupación doble, acompañado de otro adulto. Esos campos ya se reflejan en sus tarjetas, detalle, comparación y mensaje de cotización. También se incorporó el desayuno a la llegada que muestran esos carteles y el de Krystal.

El cartel de Tampico muestra desde $2,199 por persona; el catálogo textual muestra $2,300. Se presentan la diferencia y la transcripción del cartel para consulta, sin resolverla arbitrariamente ni incorporarla como una tarifa confirmada. El año no está visible en el cartel: la fecha 2026 procede del título del catálogo y se solicita confirmación.

Fuentes de carteles y redes: `src/brand.mjs`. Los cuatro archivos se guardan en `src/assets/cartel-*.jpg`. La foto ilustrativa internacional fue tomada del apartado Nosotros original: https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop . Se conserva en AVIF y se sirve localmente. Los derechos de los materiales siguen pendientes de confirmación antes de publicar.

## Verificaciones de esta actualización

- Generación y sintaxis del JavaScript correctas. Seis comprobaciones automatizadas sin fallos, incluidas las rutas de las nuevas categorías, redes y carteles.
- Los cuatro carteles cargan en navegador; se inspeccionaron sus contenidos visualmente. La ficha de Oceano Palace muestra imagen completa, transcripción y tarifa por adulto en doble.
- El acceso aéreo devuelve dos resultados. La consulta de bodas/XV años/luna de miel prepara ese tema en el formulario.
- Se inspeccionaron escritorio y móvil: sin desbordamiento horizontal en las mediciones de 1440 y 390 píxeles; también se verificó disposición a una columna en un ancho observado de 384 píxeles.
- La validación de enlaces externos se limita a su correspondencia con los publicados por la agencia; no se inició sesión ni se enviaron mensajes.

Esta revisión amplía y corrige la documentación de la primera entrega. Se mantienen los pendientes de integración del formulario, migración completa del catálogo y auditoría integral de accesibilidad. No se ha publicado ni modificado el sitio original.
