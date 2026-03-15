// assets/js/lang.js

let currentLang = "en";
let translations = {};
const langChangeCallbacks = [];

function t(key) {
  return translations[`${key}_${currentLang}`] || "";
}

function onLanguageChange(callback) {
  langChangeCallbacks.push(callback);
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("langToggle");
  if (!toggleBtn) return;

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

    langChangeCallbacks.forEach((cb) => cb(lang));
  }

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLang = currentLang === "en" ? "ru" : "en";
    setLanguage(newLang);
  });

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      translations = data;
      setLanguage(currentLang);
    })
    .catch((err) => console.error("Ошибка загрузки переводов:", err));
});
