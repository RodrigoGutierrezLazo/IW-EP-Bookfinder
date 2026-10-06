# Práctica Calificada EP: Ingeniería de Software

## Ejercicio Integrador 2 — BookFinder: Explorador de libros para estudiantes

### 👥 Integrantes del Equipo

1. **Rodrigo Gutiérrez Lazo**
2. **Luis Vila Meza**
3. **Grecia Vila Navarro**

---

### 🔗 Repositorio del Proyecto

* **Ruta del Repositorio en GitHub:**  
  [https://github.com/RodrigoGutierrezLazo/IW-EP-Bookfinder](https://github.com/RodrigoGutierrezLazo/IW-EP-Bookfinder)

---

### 📌 Resumen del Proyecto

BookFinder es una aplicación web interactiva que permite a los estudiantes localizar, explorar y consultar información detallada de millones de libros en tiempo real mediante el consumo de la API pública de **Open Library**, además de organizar y gestionar una lista de lectura personalizada persistida en el navegador.

---

### 📁 Estructura de Archivos del Proyecto

```text
IW-EP-Bookfinder/
│
├── index.html          # Estructura semántica HTML5 y vistas de la aplicación
├── css/
│   └── estilos.css     # Sistema de diseño, CSS Grid/Flexbox, temas y diseño responsivo
├── js/
│   ├── app.js          # Lógica interactiva del cliente, eventos DOM y gestión de estados
│   └── libros.js       # Módulo de consumo asíncrono a la API de Open Library (Fetch)
├── README.md           # Documentación y guía técnica
└── ENTREGA_EP.md       # Ficha formal de entrega institucional
```

---

### 🚀 Tecnologías y Conceptos Clave Aplicados

* **HTML5:** Estructura semántica (`<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<article>`, `<dialog>`, `<form>`).
* **CSS3:** Sistema de tokens/variables CSS, diseño adaptativo (responsive design con media queries), animaciones de carga esqueleto (*skeleton shimmer*).
* **JavaScript (Vanilla JS):** Modularización, programación basada en eventos y lógica de negocio.
* **Manipulación del DOM:** Generación dinámica de tarjetas, actualización reactiva de contadores, renderizado modal (`<dialog>`).
* **Callbacks:** Manejadores de eventos en formularios, entradas de texto y clics delegados.
* **Promesas y Fetch API:** Consultas asíncronas con sintaxis moderna `async`/`await` a los endpoints `search.json` y `works/{id}.json`.
* **Manejo de Estados de UI:**
  1. *Inicial / Bienvenida:* Ilustración y guía de exploración.
  2. *Cargando:* Esqueletos animados (*shimmer*).
  3. *Resultados:* Tarjetas dinámicas con metadatos y portadas.
  4. *Vacío:* Mensaje cuando la búsqueda no produce resultados.
  5. *Error:* Notificación clara ante fallas de conectividad o de la API.
* **Almacenamiento Local:** Persistencia de la lista de lectura en `localStorage`.

---

### ⚙️ Instrucciones de Ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/RodrigoGutierrezLazo/IW-EP-Bookfinder.git
   ```
2. Abrir el archivo `index.html` en cualquier navegador web moderno con conexión a internet.
