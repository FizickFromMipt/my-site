document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "✅ Message sent successfully!";
        status.className = "form-status success";
        form.reset();
      } else {
        status.textContent = "❌ Oops! Something went wrong.";
        status.className = "form-status error";
      }
    } catch (error) {
      status.textContent = "❌ Network error. Try again.";
      status.className = "form-status error";
    }

    // скрываем сообщение через 4 секунды
    setTimeout(() => {
      status.textContent = "";
      status.className = "form-status";
    }, 4000);
  });
});
