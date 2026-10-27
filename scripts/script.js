// Переменная для хранения текущего языка
let currentLang = localStorage.getItem('lang') || 'ru';

function t(key) {
    // Разбиваем ключ по точкам: "meta.year" → ["meta", "year"]
    const keys = key.split('.');
    
    // Начинаем с объекта переводов для текущего языка
    let value = translations[currentLang];
    
    // Проходим по всем частям ключа
    for (const k of keys) {
        value = value?.[k];  // Безопасный доступ к свойству
    }
    
    // Если перевод не найден — возвращаем сам ключ (чтобы было видно ошибку)
    return value || key;
}

function getLocalized(obj) {
    // Если это просто строка — возвращаем как есть
    if (typeof obj === 'string') return obj;
    
    // Получаем текущий язык из памяти браузера (по умолчанию русский)
    const lang = localStorage.getItem('lang') || 'ru';
    
    // Возвращаем перевод для текущего языка, или русский, или пустую строку
    return obj[lang] || obj.ru || '';
}

function isHeading(text) {
    // Заголовок — это короткий текст (меньше 80 символов)
    // И он НЕ заканчивается на точку, восклицательный или вопросительный знак
  return text.length < 30;/*&& !/[.!?…]$/.test(text.trim())*/ 
}

function detectLanguage(text) {
    // Проверяем, есть ли в тексте японские символы
    // \u3040-\u309F — хирагана, \u30A0-\u30FF — катакана, \u4E00-\u9FAF — кандзи
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
        return 'jp-text';
    }
    
    // Проверяем, есть ли в тексте русские буквы (кириллица)
    // \u0400-\u04FF — диапазон кириллицы в Unicode
    if (/[\u0400-\u04FF]/.test(text)) {
        return 'ru-text';
    }
    
    // Если ничего не нашли — считаем, что это английский
    return 'en-text';
}

function create_anime_card(anime) {
  let anime_card = document.createElement('div')
  anime_card.className = "anime-card"; 

  let title = getLocalized(anime.title);
  let description = getLocalized(anime.description);
  let slogan = getLocalized(anime.slogan);
  let dateOfPubl = getLocalized(anime.dateOfPubl);
  let episodes = getLocalized(anime.episodes);

  const titleLang = detectLanguage(title);
  const titleType = isHeading(title) ? 'heading' : 'text';
  const titleClass = `${titleLang}-${titleType}`;
  
  const descLang = detectLanguage(description);
  const descClass = `${descLang}-text`;

  anime_card.innerHTML = `
      <div class="wanted-card-inner">
          <div class="wanted-header">
              <span class="wanted-text-ru">РАЗЫСКИВАЕТСЯ</span>
              <span class="wanted-text-en">WANTED</span>
          </div>
          
          <div class="wanted-image-frame">
              <img src="${anime.poster}" alt="${title}" class="wanted-poster-img">
          </div>
          
          <div class="wanted-info">
              <h2 class="anime-title ${titleClass}">
                  <a href="wanted.html?id=${anime.id}">${title}</a>
              </h2>
              
              <div class="wanted-meta">
                  <p><strong>${t('meta.year')}</strong> ${dateOfPubl}</p>
                  <p><strong>${t('meta.episodes')}</strong> ${episodes}</p>
              </div>
              
              <div class="wanted-divider"></div>
              
              <p class="anime-description ${descClass}">${description}</p>
          </div>
          
          <div class="wanted-footer-stamp">
              PTV STUDIO DEPT.
          </div>
      </div>
  `;
  return anime_card;
}

function renderAnimeCards() {
    const container = document.getElementById('anime_container');
    container.innerHTML = '';  
    
    animeData.forEach(anime => {
        const card = create_anime_card(anime);  
        container.appendChild(card);          
    });
}

// Ждём, пока страница полностью загрузится
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем рендер карточек
    renderAnimeCards();
});