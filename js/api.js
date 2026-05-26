const REPO = 'mmili24/sant-jordi';

/**
 * Obté informació del repositori via GitHub API
 * i la mostra al DOM
 */
export async function fetchRepoInfo() {
  const container = document.getElementById('repo-info');

  try {
    container.textContent = 'Carregant...';

    const res = await fetch(`https://api.github.com/repos/${REPO}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json();

    const labels = [
      '📁 Repositori',
      '📝 Descripció',
      '⭐ Stars',
      '🍴 Forks',
      '🔤 Llenguatge',
      '📅 Últim update'
    ];

    const values = [
      data.full_name,
      data.description ?? 'Sense descripció',
      String(data.stargazers_count),
      String(data.forks_count),
      data.language ?? 'No especificat',
      new Date(data.updated_at).toLocaleDateString('ca-ES')
    ];

    const fragment = document.createDocumentFragment();

    labels.forEach((label, i) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      p.appendChild(strong);

      if (i === 0) {
        const a = document.createElement('a');
        a.href = data.html_url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = values[i];
        p.appendChild(a);
      } else {
        p.appendChild(document.createTextNode(values[i]));
      }

      fragment.appendChild(p);
    });

    container.textContent = '';
    container.appendChild(fragment);

  } catch (err) {
    console.error('fetchRepoInfo:', err);
    container.textContent = 'No s\'ha pogut carregar la informació del repositori.';
  }
}