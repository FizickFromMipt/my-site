async function loadProjects() {
  const container = document.getElementById("projects-list");
  container.innerHTML = "<p>Загрузка проектов...</p>";

  try {
    const API_HOST = '';
    const res = await fetch(`${API_HOST}/api/projects`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log("Projects data:", data);

    container.innerHTML = ""; // очистка загрузки

    if (!data.data || data.data.length === 0) {
      container.innerHTML = "<p>Проекты не найдены</p>";
      return;
    }

    data.data.forEach((item) => {
      const p = item.attributes;
      const imgUrl = p.cover?.data?.attributes?.url || "images/pic02.jpg";

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="http://localhost:1337${imgUrl}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.shortDescription || ""}</p>
        <a href="project.html?slug=${p.slug}" class="button">Подробнее</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Ошибка загрузки проектов:", err);
    container.innerHTML =
      "<p>Не удалось загрузить проекты. Проверьте Strapi и CORS.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
