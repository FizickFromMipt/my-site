async function loadProjects() {
  const container = document.getElementById("projects-list");
  container.innerHTML = `<p>${t("loading_projects") || "Loading projects..."}</p>`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/projects?populate=cover`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    container.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      container.innerHTML = `<p>${t("no_projects") || "No projects found"}</p>`;
      return;
    }

    data.data.forEach((item) => {
      const imgUrl = item.cover?.url || "";
      const imgSrc = imgUrl ? `${API_BASE_URL}${imgUrl}` : "images/pic02.jpg";

      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = item.title || "";

      const h3 = document.createElement("h3");
      h3.textContent = item.title || "";

      const desc = document.createElement("p");
      desc.textContent = item.shortDescription || "";

      const link = document.createElement("a");
      const identifier = item.slug || item.documentId;
      link.href = `project.html?slug=${encodeURIComponent(identifier)}`;
      link.className = "button";
      link.textContent = currentLang === "ru" ? "Подробнее" : "Details";

      card.appendChild(img);
      card.appendChild(h3);
      card.appendChild(desc);
      card.appendChild(link);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Ошибка загрузки проектов:", err);
    container.innerHTML = `<p>${t("projects_load_error") || "Failed to load projects."}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
