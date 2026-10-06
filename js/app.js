(() => {
  const STORAGE_KEY = "bookfinder-reading-list-v1";
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#search-input");
  const error = document.querySelector("#search-error");
  const resultsGrid = document.querySelector("#results-grid");
  const resultsHeading = document.querySelector("#results-heading");
  const resultsKicker = document.querySelector("#results-kicker");
  const resultCount = document.querySelector("#result-count");
  const readingPanel = document.querySelector("#reading-panel");
  const readingList = document.querySelector("#reading-list");
  const readingEmpty = document.querySelector("#reading-empty");
  const shelfCount = document.querySelector("#shelf-count");
  const headerCount = document.querySelector("#header-count");
  const dialog = document.querySelector("#book-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const toast = document.querySelector("#toast");
  let currentBooks = [];
  let savedBooks = readSavedBooks();
  let searchVersion = 0;
  let toastTimer;

  function readSavedBooks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter((book) => book && typeof book.id === "string") : [];
    } catch {
      return [];
    }
  }

  function persistSavedBooks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBooks));
    } catch {
      showToast("No se pudo guardar en este dispositivo.");
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function authorLabel(book) {
    return book.authors?.length ? book.authors.join(", ") : "Autor no disponible";
  }

  function bookCover(book, className = "") {
    if (book.coverUrl) {
      return `<img class="${className}" src="${escapeHTML(book.coverUrl)}" alt="Portada de ${escapeHTML(book.title)}" loading="lazy">`;
    }
    return `<span class="cover-placeholder ${className}" aria-label="Sin portada disponible"><span>BOOKFINDER / OPEN LIBRARY</span><span>${escapeHTML(book.title)}</span></span>`;
  }

  function renderBookCard(book, index) {
    const isSaved = savedBooks.some((savedBook) => savedBook.id === book.id);
    const year = book.year || "Año desconocido";
    return `<article class="book-card" style="animation-delay:${Math.min(index * 45, 270)}ms">
      <button class="cover-button" type="button" data-action="details" data-id="${escapeHTML(book.id)}" aria-label="Ver ficha de ${escapeHTML(book.title)}">
        ${bookCover(book)}${book.year ? `<span class="cover-badge">${book.year}</span>` : ""}
      </button>
      <div class="book-meta">
        <h3 class="book-title">${escapeHTML(book.title)}</h3>
        <p class="book-author">${escapeHTML(authorLabel(book))}</p>
        <div class="book-submeta"><span>${escapeHTML(year)}</span>${book.editionCount ? `<span class="meta-dot"></span><span>${book.editionCount} ediciones</span>` : ""}</div>
        <div class="book-actions">
          <button class="details-button" type="button" data-action="details" data-id="${escapeHTML(book.id)}">Ver ficha <span aria-hidden="true">↗</span></button>
          <button class="save-button${isSaved ? " is-saved" : ""}" type="button" data-action="save" data-id="${escapeHTML(book.id)}" aria-pressed="${isSaved}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14v16l-7-4.5-7 4.5v-16Z"/></svg>${isSaved ? "Guardado" : "Guardar"}
          </button>
        </div>
      </div>
    </article>`;
  }

  function renderResults(books) {
    resultsGrid.innerHTML = books.map(renderBookCard).join("");
  }

  function renderReadingList() {
    const hasBooks = savedBooks.length > 0;
    readingPanel.classList.toggle("has-books", hasBooks);
    readingEmpty.hidden = hasBooks;
    shelfCount.textContent = String(savedBooks.length);
    headerCount.textContent = String(savedBooks.length);
    readingList.innerHTML = savedBooks.map((book) => `<article class="reading-item">
      <div class="reading-cover">${book.coverUrl ? `<img src="${escapeHTML(book.coverUrl)}" alt="" loading="lazy">` : `<div class="reading-cover-fallback" aria-hidden="true"></div>`}</div>
      <div><h3 class="reading-item-title">${escapeHTML(book.title)}</h3><p class="reading-item-author">${escapeHTML(book.authors?.join(", ") || "Autor no disponible")}</p></div>
      <button class="remove-button" type="button" data-action="remove" data-id="${escapeHTML(book.id)}" aria-label="Quitar ${escapeHTML(book.title)} de la lista">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"/></svg>
      </button>
    </article>`).join("");
  }

  function renderLoading() {
    resultsGrid.innerHTML = Array.from({ length: 6 }, () => `<div class="loading-card" aria-hidden="true"><div class="skeleton-cover"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>`).join("");
    resultCount.textContent = "Buscando...";
    resultsHeading.textContent = "Buscando en la biblioteca";
    resultsKicker.textContent = "UN MOMENTO";
  }

  function renderMessage(title, message, isError = false) {
    resultsGrid.innerHTML = `<div class="state-message${isError ? " is-error" : ""}"><span class="state-mark" aria-hidden="true">${isError ? "!" : "↗"}</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(message)}</p></div>`;
  }

  async function search(term) {
    const version = ++searchVersion;
    resultsKicker.textContent = "BIBLIOTECA ABIERTA";
    renderLoading();
    try {
      const result = await OpenLibrary.searchBooks(term);
      if (version !== searchVersion) return;
      currentBooks = result.books;
      if (result.books.length === 0) {
        resultsHeading.textContent = "Ningún libro esta vez";
        resultCount.textContent = "0 resultados";
        renderMessage("No encontramos coincidencias", "Prueba con otras palabras o con un tema más general.");
        return;
      }
      resultsHeading.textContent = `Resultados para “${term}”`;
      resultCount.textContent = `${result.total.toLocaleString("es-ES")} resultados`;
      renderResults(currentBooks);
    } catch (searchError) {
      if (version !== searchVersion) return;
      resultsHeading.textContent = "No pudimos conectar";
      resultCount.textContent = "";
      renderMessage("La búsqueda no está disponible", "Comprueba tu conexión e inténtalo de nuevo. Open Library podría estar temporalmente fuera de servicio.", true);
      console.error("Error al buscar libros:", searchError);
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
  }

  function updateCurrentCards() {
    resultsGrid.querySelectorAll('[data-action="save"]').forEach((button) => {
      const isSaved = savedBooks.some((book) => book.id === button.dataset.id);
      button.classList.toggle("is-saved", isSaved);
      button.setAttribute("aria-pressed", String(isSaved));
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14v16l-7-4.5-7 4.5v-16Z"/></svg>${isSaved ? "Guardado" : "Guardar"}`;
    });
  }

  function toggleSavedBook(book) {
    const existingIndex = savedBooks.findIndex((savedBook) => savedBook.id === book.id);
    if (existingIndex >= 0) {
      savedBooks.splice(existingIndex, 1);
      showToast("Libro quitado de tu lista.");
    } else {
      savedBooks.unshift(book);
      showToast("Libro guardado en tu lista.");
    }
    persistSavedBooks();
    renderReadingList();
    updateCurrentCards();
    if (dialog.open) renderDialog(book);
  }

  function renderDialog(book, description = "") {
    const isSaved = savedBooks.some((savedBook) => savedBook.id === book.id);
    const cover = book.coverUrl
      ? `<img class="dialog-cover" src="${escapeHTML(book.coverUrl)}" alt="Portada de ${escapeHTML(book.title)}">`
      : `<div class="dialog-cover-fallback"><span>BOOKFINDER</span><strong>${escapeHTML(book.title)}</strong></div>`;
    const facts = [
      ["Publicación", book.year || "No disponible"],
      ["Editorial", book.publishers?.join(", ") || "No disponible"],
      ["Ediciones", book.editionCount || "No disponible"],
      ["Temas", book.subjects?.slice(0, 3).join(", ") || "No disponibles"]
    ];
    dialogContent.innerHTML = `${cover}<div class="dialog-copy"><p class="eyebrow">FICHA DEL LIBRO</p><h2 id="dialog-title">${escapeHTML(book.title)}</h2><p class="dialog-author">${escapeHTML(authorLabel(book))}</p><dl class="dialog-facts">${facts.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}</dl>${description ? `<p class="dialog-description">${escapeHTML(description)}</p>` : ""}<button class="dialog-save" type="button" data-action="save" data-id="${escapeHTML(book.id)}">${isSaved ? "Quitar de mi lista" : "Añadir a mi lista"}</button></div>`;
  }

  async function openBookDetails(book) {
    renderDialog(book);
    dialog.showModal();
    try {
      const description = await OpenLibrary.getDescription(book.id);
      if (dialog.open && dialogContent.querySelector("#dialog-title")?.textContent === book.title && description) {
        renderDialog(book, description);
      }
    } catch (detailError) {
      console.error("No se pudo cargar la descripción del libro:", detailError);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = input.value.trim();
    if (!term) {
      error.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    error.hidden = true;
    input.removeAttribute("aria-invalid");
    search(term);
  });

  input.addEventListener("input", () => {
    if (input.value.trim()) {
      error.hidden = true;
      input.removeAttribute("aria-invalid");
    }
  });

  document.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.query;
      form.requestSubmit();
    });
  });

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const { action, id } = actionButton.dataset;
    if (action === "remove") {
      savedBooks = savedBooks.filter((book) => book.id !== id);
      persistSavedBooks();
      renderReadingList();
      updateCurrentCards();
      showToast("Libro quitado de tu lista.");
      return;
    }
    const book = [...currentBooks, ...savedBooks].find((item) => item.id === id);
    if (!book) return;
    if (action === "save") toggleSavedBook(book);
    if (action === "details") openBookDetails(book);
  });

  document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.querySelector("#shelf-jump").addEventListener("click", () => {
    readingPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    readingPanel.focus({ preventScroll: true });
  });

  renderReadingList();
})();