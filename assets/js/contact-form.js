document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector("input[type='submit']");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = new FormData(form);

    // 🔒 Блокируем форму
    const inputs = form.querySelectorAll("input, textarea, button");
    inputs.forEach(el => el.disabled = true);

    submitBtn.value = "Sending...";
    status.textContent = "⏳ Sending message...";
    status.className = "form-status";

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
        status.textContent = "❌ Failed to send. Try again.";
        status.className = "form-status error";
      }
    } catch (error) {
      status.textContent = "❌ Network error. Please try later.";
      status.className = "form-status error";
    }

    // 🔓 Разблокируем форму
    inputs.forEach(el => el.disabled = false);
    submitBtn.value = "Send Message";

    // скрываем уведомление через 4 сек
    setTimeout(() => {
      status.textContent = "";
      status.className = "form-status";
    }, 4000);
  });
});
