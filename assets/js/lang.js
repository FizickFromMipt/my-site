// assets/js/lang.js

let currentLang = "en";
let translations = {};

function t(key) {
  return translations[`${key}_${currentLang}`] || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("langToggle");

  // Смена языка
  function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      const jsonKey = `${key}_${lang}`;

      if (!translations[jsonKey]) return;

      if (
        el.tagName === "INPUT" &&
        (el.type === "submit" || el.type === "button")
      ) {
        el.value = translations[jsonKey];
      } else if (el.tagName === "A") {
        if (el.firstChild && el.firstChild.nodeType === 3) {
          el.firstChild.nodeValue = translations[jsonKey];
        } else {
          el.appendChild(document.createTextNode(translations[jsonKey]));
        }
      } else {
        el.innerHTML = translations[jsonKey];
      }
    });

    toggleBtn.textContent = lang === "en" ? "EN" : "РУ";
  }

  // Переключатель
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const currentHash = window.location.hash;
    const newLang = currentLang === "en" ? "ru" : "en";
    setLanguage(newLang);
    if (currentHash) {
      const targetEl = document.querySelector(currentHash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  // Загружаем JSON
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      translations = data;
      setLanguage(currentLang);
    })
    .catch((err) => console.error("Ошибка загрузки переводов:", err));
});
