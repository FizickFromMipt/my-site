const HABR_API = "https://habr.com/kek/v2/articles/?user=Alex_Pvk&fl=ru&hl=ru";
const DZEN_URL = "https://dzen.ru/alex_prog";

let cachedArticles = null;

async function loadArticles() {
  const container = document.getElementById("blog-list");
  container.innerHTML = `<p>${t("loading_articles") || "Loading articles..."}</p>`;

  try {
    const res = await fetch(HABR_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const ids = data.publicationIds || [];
    const refs = data.publicationRefs || {};

    cachedArticles = ids.map((id) => refs[id]).filter(Boolean);
    renderArticles();
  } catch (err) {
    console.error("Ошибка загрузки статей:", err);
    container.innerHTML = `<p>${t("articles_load_error") || "Failed to load articles."}</p>`;
    appendDzenLink(container);
  }
}

function renderArticles() {
  const container = document.getElementById("blog-list");
  container.innerHTML = "";

  if (!cachedArticles || cachedArticles.length === 0) {
    container.innerHTML = `<p>${t("no_articles") || "No articles found"}</p>`;
    appendDzenLink(container);
    return;
  }

  cachedArticles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "card";

    const imgUrl = article.leadData?.imageUrl;
    if (imgUrl) {
      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = stripHtml(article.titleHtml || "");
      img.loading = "lazy";
      card.appendChild(img);
    }

    const badge = document.createElement("span");
    badge.className = "card-badge";
    badge.textContent = "Habr";
    card.appendChild(badge);

    const h3 = document.createElement("h3");
    h3.textContent = stripHtml(article.titleHtml || "");
    card.appendChild(h3);

    const leadText = stripHtml(article.leadData?.textHtml || "");
    if (leadText) {
      const desc = document.createElement("p");
      desc.textContent = leadText.length > 150 ? leadText.slice(0, 150) + "…" : leadText;
      card.appendChild(desc);
    }

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const date = article.timePublished
      ? new Date(article.timePublished).toLocaleDateString(
          currentLang === "ru" ? "ru-RU" : "en-US",
          { year: "numeric", month: "short", day: "numeric" }
        )
      : "";
    const views = article.statistics?.readingCount || 0;
    meta.textContent = date + (views ? ` · ${formatViews(views)}` : "");
    card.appendChild(meta);

    const link = document.createElement("a");
    link.href = `https://habr.com/ru/articles/${article.id}/`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "button";
    link.textContent = currentLang === "ru" ? "Читать на Habr" : "Read on Habr";
    card.appendChild(link);

    container.appendChild(card);
  });

  appendDzenLink(container);
}

function appendDzenLink(container) {
  const dzen = document.createElement("div");
  dzen.className = "blog-external-link";
  dzen.innerHTML = `
    <a href="${DZEN_URL}" target="_blank" rel="noopener noreferrer" class="button">
      ${currentLang === "ru" ? "Читать на Яндекс Дзен" : "Read on Yandex Dzen"}
    </a>
  `;
  container.appendChild(dzen);
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || "";
}

function formatViews(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

onLanguageChange(() => {
  if (cachedArticles) renderArticles();
});

document.addEventListener("DOMContentLoaded", loadArticles);
