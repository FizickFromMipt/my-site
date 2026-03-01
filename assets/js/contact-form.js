document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector("input[type='submit']");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = new FormData(form);

    const inputs = form.querySelectorAll("input, textarea, button");
    inputs.forEach(el => el.disabled = true);

    submitBtn.value = t("sending") || "Sending...";
    status.textContent = t("sending") || "Sending...";
    status.className = "form-status";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = t("send_success") || "Message sent successfully!";
        status.className = "form-status success";
        form.reset();
      } else {
        status.textContent = t("send_fail") || "Failed to send. Try again.";
        status.className = "form-status error";
      }
    } catch (error) {
      status.textContent = t("send_network_error") || "Network error. Please try later.";
      status.className = "form-status error";
    }

    inputs.forEach(el => el.disabled = false);
    submitBtn.value = t("sendButton") || "Send Message";

    setTimeout(() => {
      status.textContent = "";
      status.className = "form-status";
    }, 4000);
  });
});
