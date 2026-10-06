const OpenLibrary = (() => {
  const SEARCH_URL = "https://openlibrary.org/search.json";

  function normalizeBook(record) {
    const key = typeof record.key === "string" ? record.key : "";
    const workId = key.startsWith("/works/") ? key.slice("/works/".length) : key;
    const coverId = Number.isInteger(record.cover_i) ? record.cover_i : null;

    return {
      id: workId || `${record.title || "libro"}-${(record.author_name || []).join("-")}`,
      title: record.title || "Título desconocido",
      authors: Array.isArray(record.author_name) ? record.author_name.slice(0, 4) : [],
      year: Number.isInteger(record.first_publish_year) ? record.first_publish_year : null,
      coverId,
      coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "",
      publishers: Array.isArray(record.publisher) ? record.publisher.slice(0, 4) : [],
      editionCount: Number.isInteger(record.edition_count) ? record.edition_count : null,
      subjects: Array.isArray(record.subject) ? record.subject.slice(0, 8) : [],
      languages: Array.isArray(record.language) ? record.language.slice(0, 4) : []
    };
  }

  async function searchBooks(term) {
    const params = new URLSearchParams({
      q: term,
      fields: "key,title,author_name,first_publish_year,cover_i,publisher,edition_count,subject,language",
      limit: "24"
    });
    const response = await fetch(`${SEARCH_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Open Library respondió con el estado ${response.status}.`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.docs)) {
      throw new Error("La respuesta de Open Library no tiene el formato esperado.");
    }

    return {
      total: Number.isInteger(data.numFound) ? data.numFound : data.docs.length,
      books: data.docs.map(normalizeBook).filter((book) => book.id)
    };
  }

  async function getDescription(workId) {
    const response = await fetch(`https://openlibrary.org/works/${encodeURIComponent(workId)}.json`);
    if (!response.ok) return "";
    const work = await response.json();
    const description = work.description;
    if (typeof description === "string") return description;
    if (description && typeof description.value === "string") return description.value;
    return "";
  }

  return { searchBooks, getDescription };
})();