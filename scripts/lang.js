import { translations } from "./translation.js";

let current_lang = localStorage.getItem('lang') || 'ru';

export function trans(key) {
  let keys = key.split('.');
  let value = translations[current_lang];
  for (let k of keys) {
    value = value?.[k];
  }
  return value || key;
}

export function getLocalize(obj) {
  if (typeof (obj) === "string") {
    return obj;
  }
  return obj[current_lang] || obj.ru || '';
}


export function apply_translation(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = trans(el.getAttribute('data-i18n'))
  });

  document.documentElement.lang = current_lang;

  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === current_lang);
  });
}

export function setLanguage(lang) {
  current_lang = lang;
  localStorage.setItem('lang', lang);
  apply_translation();

  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

function initLang() {
  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  apply_translation();
}

document.addEventListener('DOMContentLoaded', initLang);