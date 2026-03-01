async function loadProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    document.getElementById("title").textContent = "Project not found";
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=cover`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      document.getElementById("title").textContent = "Project not found";
      return;
    }

    const project = data.data[0].attributes;

    document.getElementById("title").textContent = project.title || "";

    const coverEl = document.getElementById("cover");
    if (project.cover?.data?.attributes?.url) {
      coverEl.src = `${API_BASE_URL}${project.cover.data.attributes.url}`;
      coverEl.alt = project.title || "";
    } else {
      coverEl.style.display = "none";
    }

    document.getElementById("content").innerHTML = project.content || "";
  } catch (err) {
    console.error("Ошибка загрузки проекта:", err);
    document.getElementById("title").textContent = "Failed to load project";
  }
}

document.addEventListener("DOMContentLoaded", loadProjectDetail);
