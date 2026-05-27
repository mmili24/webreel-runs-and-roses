# Runs & Roses 🌹 — WebReel

Lloc web de presentació del joc de plataformes **Runs & Roses**, desenvolupat com a pràctica transversal del CFGS DAW a l'Institut MVM.

## Descripció

Runs & Roses és un joc de plataformes 2D de temàtica Sant Jordi fet amb Phaser 3, Vite i Bun. El WebReel presenta el projecte mitjançant un reproductor de vídeo custom, una timeline de capítols i informació del repositori en temps real.

## Tecnologies

- HTML5 semàntic
- CSS3 (custom properties, flexbox, responsive, animacions)
- JavaScript vanilla (mòduls, OOP, classes privades)
- GitHub API (fetch/async-await)
- localStorage i sessionStorage

## Instruccions d'arrencada

1. Clona el repositori:

```bash
git clone https://github.com/mmili24/webreel-runs-and-roses.git
cd webreel-runs-and-roses
```

2. Obre amb Live Server (VSCode) o qualsevol servidor local.
3. Obre `index.html` al navegador.

## Estructura del projecte

- index.html
- about.html
- README.md
- css/
  - styles.css
- js/
  - main.js
  - api.js
  - storage.js
- assets/
  - video/
    - chapters.json
  - img/
    - poster.png

## Llicències

| Recurs | Autor | Llicència |
|--------|-------|-----------|
| Codi propi | Marija | MIT |
| Vídeo | Marija | CC BY 4.0 |
| GitHub API | GitHub | Termes d'ús de GitHub |

## Demo

🔗 [Demo en viu](https://mmili24.github.io/webreel-runs-and-roses/)
🎮 [Juga a Runs & Roses](https://sant-jordi-one.vercel.app/)

## Funcionalitats extra

- ✅ Mode fosc/clar amb persistència a localStorage
- ✅ Publicat a GitHub Pages

## Accessibilitat i usabilitat

- WCAG 2.1 AA
- Navegació per teclat 
- `aria-label` als controls del reproductor
- Contrast adequat (fons fosc / text clar)
- Animació CSS temàtica (plataformes i roses animades)
