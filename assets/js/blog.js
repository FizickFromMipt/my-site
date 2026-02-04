async function loadArticles() {
  const res = await fetch('http://localhost:1337/api/blogs?populate=cover');
  const data = await res.json();

  const container = document.getElementById('blog-list');
  container.innerHTML = '';

  data.data.forEach(item => {
    const a = item.attributes;
    const imageUrl = a.cover?.data ? a.cover.data.attributes.url : 'images/pic01.jpg';

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="http://localhost:1337${imageUrl}" alt="${a.title}">
      <h3>${a.title}</h3>
      <p>${a.shortDescription}</p>
      <a href="article.html?slug=${a.slug}" class="button">Читать</a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadArticles);
