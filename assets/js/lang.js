// assets/js/lang.js

let currentLang = "en";
let translations = {};

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("langToggle");

  // Смена языка
  function setLanguage(lang) {
    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      const jsonKey = `${key}_${lang}`;

      if (!translations[jsonKey]) return;

      if (
        el.tagName === "INPUT" &&
        (el.type === "submit" || el.type === "button")
      ) {
        // кнопки формы
        el.value = translations[jsonKey];
      } else if (el.tagName === "A") {
        if (el.firstChild && el.firstChild.nodeType === 3) {
          el.firstChild.nodeValue = translations[jsonKey];
        } else {
          el.appendChild(document.createTextNode(translations[jsonKey]));
        }
      } else {
        // остальные элементы
        el.innerHTML = translations[jsonKey];
      }
    });

    toggleBtn.textContent = lang === "en" ? "EN" : "РУ";
    currentLang = lang;
  }

  // Переключатель
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // 1. Сохраняем текущий якорь (hash) страницы
    const currentHash = window.location.hash;
    const newLang = currentLang === "en" ? "ru" : "en";
    setLanguage(newLang);
    // 4. Возвращаем якорь, чтобы остаться на той же вкладке
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
      setLanguage(currentLang); // текст подставляется сразу после загрузки JSON
            // Показываем кнопку только если мы на стартовой странице
      if (toggleBtn) {
        const hash = window.location.hash || "#";
        if (hash !== "#") {
          toggleBtn.style.display = "none";
        } else {
          toggleBtn.style.display = "inline-block";
        }
      }
    })
    .catch((err) => console.error("Ошибка загрузки переводов:", err));
});
