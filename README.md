# BookFinder — Explorador de libros

Aplicación estática para buscar libros en Open Library, consultar su ficha y mantener una lista de lectura en el navegador.

## 👥 Integrantes

- **Rodrigo Gutiérrez Lazo**
- **Luis Vila Meza**
- **Grecia Vila Navarro**

## Ejecutar

Abre `index.html` en un navegador con conexión a Internet. La búsqueda y las fichas consultan Open Library; la lista se guarda con `localStorage` en el dispositivo actual.

## Evidencias

1. Busca un tema, por ejemplo `astronomía`, o pulsa una sugerencia. El formulario también muestra un mensaje si se envía vacío.
2. Revisa las tarjetas: muestran título, autor, año y portada cuando está disponible; el contador indica los resultados encontrados.
3. Pulsa la portada o **Ver ficha** para abrir el detalle, incluidos editorial, temas y descripción cuando la API la ofrece.
4. Pulsa **Guardar**. El libro aparece en la lista lateral y el contador se actualiza.
5. Pulsa el icono de papelera junto al libro para quitarlo. La lista se conserva al recargar la página.
6. Busca una frase poco común para ver el estado sin coincidencias. Si falla la petición o la respuesta no tiene el formato esperado, aparece un mensaje de error y se registra el detalle técnico en la consola.

## Conceptos técnicos

- **Fetch y Promesas:** `js/libros.js` consulta `search.json` y las fichas de obras. `async`/`await` procesa las Promesas y los errores HTTP o de datos.
- **Callbacks:** los controladores pasados a `addEventListener` en `js/app.js` responden al envío del formulario, la escritura, las sugerencias y los botones de cada libro.
- **Manipulación del DOM:** `js/app.js` crea tarjetas y elementos de la lista, actualiza contadores y estados, y muestra la ficha en un elemento `<dialog>`.
- **Estados:** la interfaz comienza en bienvenida y cambia a carga, resultados, vacío o error según el resultado de la búsqueda.
- **Datos:** `js/libros.js` normaliza identificador, título, autores, año, portada y editorial; la ficha amplía esos datos con la descripción de la obra.