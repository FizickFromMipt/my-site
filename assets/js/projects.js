let cachedProjects = null;

async function loadProjects() {
  const container = document.getElementById("projects-list");
  container.innerHTML = `<p>${t("loading_projects") || "Loading projects..."}</p>`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/projects?populate=cover`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    cachedProjects = data.data || [];
    renderProjects();
  } catch (err) {
    console.error("Ошибка загрузки проектов:", err);
    container.innerHTML = `<p>${t("projects_load_error") || "Failed to load projects."}</p>`;
  }
}

function renderProjects() {
  const container = document.getElementById("projects-list");
  container.innerHTML = "";

  if (!cachedProjects || cachedProjects.length === 0) {
    container.innerHTML = `<p>${t("no_projects") || "No projects found"}</p>`;
    return;
  }

  cachedProjects.forEach((item) => {
    const imgUrl = item.cover?.url || "";
    const imgSrc = imgUrl
      ? (imgUrl.startsWith("http") ? imgUrl : `${API_BASE_URL}${imgUrl}`)
      : "images/pic02.jpg";

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = item.title || "";
    card.appendChild(img);

    const h3 = document.createElement("h3");
    h3.textContent = item.title || "";
    card.appendChild(h3);

    const desc = document.createElement("p");
    desc.textContent = item.shortDescription || "";
    card.appendChild(desc);

    const link = document.createElement("a");
    const identifier = item.slug || item.documentId;
    link.href = `project.html?slug=${encodeURIComponent(identifier)}`;
    link.className = "button";
    link.textContent = currentLang === "ru" ? "Подробнее" : "Details";
    card.appendChild(link);

    container.appendChild(card);
  });
}

onLanguageChange(() => {
  if (cachedProjects) renderProjects();
});

document.addEventListener("DOMContentLoaded", loadProjects);
