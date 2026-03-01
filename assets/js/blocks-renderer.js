// Converts Strapi v5 blocks JSON to HTML
function renderBlocks(blocks) {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks.map(renderBlock).join("");
}

function renderBlock(block) {
  switch (block.type) {
    case "paragraph":
      return `<p>${renderChildren(block.children)}</p>`;
    case "heading": {
      const level = block.level || 2;
      return `<h${level}>${renderChildren(block.children)}</h${level}>`;
    }
    case "list": {
      const tag = block.format === "ordered" ? "ol" : "ul";
      const items = block.children
        .map((item) => `<li>${renderChildren(item.children)}</li>`)
        .join("");
      return `<${tag}>${items}</${tag}>`;
    }
    case "quote":
      return `<blockquote>${renderChildren(block.children)}</blockquote>`;
    case "code":
      return `<pre><code>${renderChildren(block.children)}</code></pre>`;
    case "image": {
      const url = block.image?.url || "";
      const alt = block.image?.alternativeText || "";
      return `<img src="${url}" alt="${escapeAttr(alt)}" />`;
    }
    default:
      if (block.children) {
        return `<p>${renderChildren(block.children)}</p>`;
      }
      return "";
  }
}

function renderChildren(children) {
  if (!children || !Array.isArray(children)) return "";

  return children.map((child) => {
    if (child.type === "text") {
      let text = escapeHtml(child.text || "");
      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;
      if (child.strikethrough) text = `<s>${text}</s>`;
      if (child.code) text = `<code>${text}</code>`;
      return text;
    }
    if (child.type === "link") {
      const href = escapeAttr(child.url || "");
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${renderChildren(child.children)}</a>`;
    }
    if (child.children) {
      return renderChildren(child.children);
    }
    return "";
  }).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
