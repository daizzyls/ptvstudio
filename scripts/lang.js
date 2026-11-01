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
  moveLangSlider(); 
}

export function setLanguage(lang) {
  current_lang = lang;
  localStorage.setItem('lang', lang);
  apply_translation();

  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

// ----- Скользящий фон переключателя -----

// Создаёт ползунок, если его ещё нет (HTML трогать не надо)
function ensureLangSlider() {
    const container = document.querySelector('.switch-lang');
    if (!container) return null;
    let slider = container.querySelector('.lang-slider');
    if (!slider) {
        slider = document.createElement('span');
        slider.className = 'lang-slider';
        container.prepend(slider);   // вставляем первым элементом
    }
    return slider;
}

// Ставит ползунок под активную кнопку
// instant = true — без анимации (для первой отрисовки)
function moveLangSlider(instant = false) {
    const container = document.querySelector('.switch-lang');
    const slider = ensureLangSlider();
    const active = container?.querySelector('.lang-button.active');
    if (!slider || !active) return;

    if (instant) slider.style.transition = 'none';

    slider.style.width = `${active.offsetWidth}px`;
    slider.style.transform = `translateX(${active.offsetLeft}px)`;

    if (instant) {
        // возвращаем анимацию на следующем кадре
        requestAnimationFrame(() => { slider.style.transition = ''; });
    }
}

// Пересчёт при изменении размера окна и после загрузки шрифтов
window.addEventListener('resize', () => moveLangSlider(true));
window.addEventListener('load', () => moveLangSlider(true));

function initLang() {
  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  apply_translation();
  moveLangSlider(true); 
}

document.addEventListener('DOMContentLoaded', initLang);