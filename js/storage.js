const STORAGE_KEY = 'webreel_comments';

/**
 * Guarda un comentari al localStorage
 * @param {Object} comment - { name, text, date }
 */
export function saveComment(comment) {
  const comments = getComments();
  comments.push(comment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

/**
 * Recupera tots els comentaris del localStorage
 * @returns {Array} llista de comentaris
 */
export function getComments() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error llegint localStorage:', err);
    return [];
  }
}