async function loadArticles() {
  const container = document.getElementById("blog-list");
  container.innerHTML = `<p>${t("loading_articles") || "Loading articles..."}</p>`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs?populate=cover`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    container.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      container.innerHTML = `<p>${t("no_articles") || "No articles found"}</p>`;
      return;
    }

    data.data.forEach((item) => {
      const a = item.attributes;
      const imageUrl = a.cover?.data?.attributes?.url || "";
      const imgSrc = imageUrl ? `${API_BASE_URL}${imageUrl}` : "images/pic01.jpg";

      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = a.title || "";

      const h3 = document.createElement("h3");
      h3.textContent = a.title || "";

      const desc = document.createElement("p");
      desc.textContent = a.shortDescription || "";

      const link = document.createElement("a");
      link.href = `article.html?slug=${encodeURIComponent(a.slug)}`;
      link.className = "button";
      link.textContent = currentLang === "ru" ? "Читать" : "Read";

      card.appendChild(img);
      card.appendChild(h3);
      card.appendChild(desc);
      card.appendChild(link);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Ошибка загрузки статей:", err);
    container.innerHTML = `<p>${t("articles_load_error") || "Failed to load articles."}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadArticles);
