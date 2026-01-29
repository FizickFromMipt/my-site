// assets/js/lang.js

let currentLang = "en";
let translations = {};

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("langToggle");

  // Смена языка
  function setLanguage(lang) {
    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      const jsonKey = `${key}_${lang}`;
      if (translations[jsonKey]) {
        // для ссылок mailto
        if (el.tagName === "A" && el.href.includes("mailto")) {
          el.href = `mailto:${translations[jsonKey]}`;
        }
        el.innerHTML = translations[jsonKey];
      }
    });
    toggleBtn.textContent = lang.toUpperCase();
    currentLang = lang;
  }

  // Переключатель
  toggleBtn.addEventListener("click", () => {
    const newLang = currentLang === "en" ? "ru" : "en";
    setLanguage(newLang);
  });

  // Загружаем JSON
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      translations = data;
      setLanguage(currentLang); // текст подставляется сразу после загрузки JSON
    })
    .catch(err => console.error("Ошибка загрузки переводов:", err));
});
