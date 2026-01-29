fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    // Header
    document.getElementById("name").textContent = data.name;
    document.getElementById("intro").textContent = data.intro;
    document.getElementById("title").textContent = data.title;

    // Sections
    document.getElementById("intro-text").textContent = data.introText;
    document.getElementById("about-text").textContent = data.aboutText;

    // Contacts
    document.getElementById("giфthub-link").href = data.github;
  })
  .catch((error) => console.error("Error loading data:", error));
