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


