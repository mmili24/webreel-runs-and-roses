import { saveComment, getComments, saveTheme, getTheme } from './storage.js';
import { fetchRepoInfo } from './api.js';


class VideoPlayer {
  #video;
  #btnPlay;
  #progress;
  #timeDisplay;
  #volume;
  #btnFullscreen;

  constructor() {
    this.#video = document.getElementById('main-video');
    this.#btnPlay = document.getElementById('btn-play');
    this.#progress = document.getElementById('progress');
    this.#timeDisplay = document.getElementById('time-display');
    this.#volume = document.getElementById('volume');
    this.#btnFullscreen = document.getElementById('btn-fullscreen');

    this.#restoreSession();
    this.#bindEvents();
  }


  #formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  #restoreSession() {
    const savedTime = sessionStorage.getItem('videoTime');
    const savedVolume = sessionStorage.getItem('videoVolume');

    if (savedTime) this.#video.currentTime = parseFloat(savedTime);
    if (savedVolume) {
      this.#video.volume = parseFloat(savedVolume);
      this.#volume.value = savedVolume;
    }
  }

  #bindEvents() {

    this.#btnPlay.addEventListener('click', () => this.#togglePlay());


    this.#video.addEventListener('timeupdate', () => {
      const { currentTime, duration } = this.#video;
      if (!duration) return;
      this.#progress.max = duration;
      this.#progress.value = currentTime;
      this.#timeDisplay.textContent = `${this.#formatTime(currentTime)} / ${this.#formatTime(duration)}`;
      sessionStorage.setItem('videoTime', currentTime);
    });


    this.#progress.addEventListener('input', () => {
      this.#video.currentTime = this.#progress.value;
    });


    this.#volume.addEventListener('input', () => {
      this.#video.volume = this.#volume.value;
      sessionStorage.setItem('videoVolume', this.#volume.value);
    });


    this.#btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        this.#video.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });


    this.#video.addEventListener('play', () => this.#btnPlay.textContent = '⏸');
    this.#video.addEventListener('pause', () => this.#btnPlay.textContent = '▶');
  }

  #togglePlay() {
    if (this.#video.paused) {
      this.#video.play();
    } else {
      this.#video.pause();
    }
  }


  seekTo(time) {
    this.#video.currentTime = time;
    this.#video.play();
  }
}


class ChapterManager {
  #player;
  #list;

  constructor(player) {
    this.#player = player;
    this.#list = document.getElementById('chapters-list');
    this.#load();
  }

  async #load() {
    try {
      const res = await fetch('assets/video/chapters.json');
      if (!res.ok) throw new Error('No s\'han pogut carregar els capítols');
      const chapters = await res.json();
      this.#render(chapters);
    } catch (err) {
      console.error('ChapterManager:', err);
      this.#list.innerHTML = '<li>No hi ha capítols disponibles.</li>';
    }
  }

  #render(chapters) {
    this.#list.innerHTML = '';
    chapters.forEach(({ title, time }) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = `${this.#formatTime(time)} — ${title}`;
      btn.addEventListener('click', () => this.#player.seekTo(time));
      li.appendChild(btn);
      this.#list.appendChild(li);
    });
  }

  #formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}


class CommentManager {
  #form;
  #nameInput;
  #textInput;
  #errorName;
  #errorText;
  #list;

  constructor() {
    this.#form = document.getElementById('comment-form');
    this.#nameInput = document.getElementById('comment-name');
    this.#textInput = document.getElementById('comment-text');
    this.#errorName = document.getElementById('error-name');
    this.#errorText = document.getElementById('error-text');
    this.#list = document.getElementById('comments-list');

    this.#renderAll();
    this.#bindEvents();
  }

  #bindEvents() {

    this.#nameInput.addEventListener('input', () => this.#validateName());
    this.#textInput.addEventListener('input', () => this.#validateText());


    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameOk = this.#validateName();
      const textOk = this.#validateText();
      if (!nameOk || !textOk) return;

      const comment = {
        name: this.#nameInput.value.trim(),
        text: this.#textInput.value.trim(),
        date: new Date().toLocaleDateString('ca-ES')
      };

      saveComment(comment);
      this.#renderOne(comment);
      this.#form.reset();
      this.#errorName.textContent = '';
      this.#errorText.textContent = '';
    });
  }

  #validateName() {
    const val = this.#nameInput.value.trim();
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,30}$/;
    if (!regex.test(val)) {
      this.#errorName.textContent = 'El nom ha de tenir entre 2 i 30 lletres.';
      return false;
    }
    this.#errorName.textContent = '';
    return true;
  }

  #validateText() {
    const val = this.#textInput.value.trim();
    if (val.length < 5) {
      this.#errorText.textContent = 'El comentari ha de tenir almenys 5 caràcters.';
      return false;
    }
    if (val.length > 300) {
      this.#errorText.textContent = 'Màxim 300 caràcters.';
      return false;
    }
    this.#errorText.textContent = '';
    return true;
  }

  #renderOne(comment) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${comment.name}</strong><span>${comment.text}</span><small>${comment.date}</small>`;
    this.#list.prepend(li);
  }

  #renderAll() {
    const comments = getComments();
    comments.forEach(c => this.#renderOne(c));
  }
}


const player = new VideoPlayer();
const chapters = new ChapterManager(player);
const comments = new CommentManager();
fetchRepoInfo();

const btnTheme = document.getElementById('btn-theme');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  btnTheme.textContent = theme === 'dark' ? '🌙' : '☀️';
}

applyTheme(getTheme());

btnTheme.addEventListener('click', () => {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  saveTheme(next);
  applyTheme(next);
});