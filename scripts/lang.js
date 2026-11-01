import { translations } from "./translation";

let current_lang = localStorage.getItem('lang') || 'ru';

export function trans(key) {
  const key = key.split('.');
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
  document.querySelector('data-i18n').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n'))
  });

  document.documentElement.lang = current_lang;

  document.querySelector('.lang-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === current_lang);
  });
}

export function setLanguage(lang) {
  current_lang = lang;
  localStorage.setItem('lang', lang);
  apply_translation();

  window.dispatchEvent(new CustomEvent('lang change', { detail: lang }));
}

function initLang() {
  document.querySelector('.lang-button').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  apply_translation();
}

document.addEventListener('DOMContentLoaded', initLang);