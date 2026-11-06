document.addEventListener("DOMContentLoaded", () => {
  const menu = document.createElement("div");
  menu.className = "accessibility-widget";

  menu.innerHTML = `
    <button
      type="button"
      class="accessibility-toggle"
      aria-expanded="false"
      aria-controls="accessibility-panel">
      ♿ Tilgængelighed
    </button>

    <div id="accessibility-panel" class="accessibility-panel" hidden>
      <h2>Tilgængelighed</h2>
      <p>Tilpas hjemmesiden til dine behov.</p>
      <button type="button" id="read-page">Læs siden højt</button>
      <button type="button" id="larger-text">Større tekst</button>
      <button type="button" id="high-contrast">Høj kontrast</button>
    </div>
  `;

  document.body.appendChild(menu);

  const toggle = menu.querySelector(".accessibility-toggle");
  const panel = menu.querySelector(".accessibility-panel");

  toggle.addEventListener("click", () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  // Gør teksten større eller normal igen
  const textButton = menu.querySelector("#larger-text");

  function updateTextButton() {
    const isLarge = document.body.classList.contains("large-text");
    textButton.textContent = isLarge ? "Normal tekststørrelse" : "Større tekst";
    textButton.setAttribute("aria-pressed", String(isLarge));
  }

  textButton.addEventListener("click", () => {
    document.body.classList.toggle("large-text");
    updateTextButton();
  });

  updateTextButton();

  
    // Slå høj kontrast til og fra
  const contrastButton = menu.querySelector("#high-contrast");

  contrastButton.addEventListener("click", () => {
    const isActive = document.body.classList.toggle("high-contrast");

    contrastButton.setAttribute("aria-pressed", String(isActive));
    contrastButton.textContent = isActive
      ? "Slå høj kontrast fra"
      : "Høj kontrast";
  });

  contrastButton.setAttribute("aria-pressed", "false");
  
  // Læs sidens hovedindhold højt
  const readButton = menu.querySelector("#read-page");
  const speech = window.speechSynthesis;
  let isReading = false;

  if (!speech || !window.SpeechSynthesisUtterance) {
    readButton.disabled = true;
    readButton.textContent = "Oplæsning understøttes ikke";
  } else {
    readButton.addEventListener("click", () => {
      if (isReading) {
        speech.cancel();
        isReading = false;
        readButton.textContent = "Læs siden højt";
        readButton.setAttribute("aria-pressed", "false");
        return;
      }

      const content = document.querySelector("main");
      if (!content) return;

      const text = content.innerText.trim();
      if (!text) return;

      speech.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "da-DK";
      utterance.rate = 0.9;

      utterance.onend = utterance.onerror = () => {
        isReading = false;
        readButton.textContent = "Læs siden højt";
        readButton.setAttribute("aria-pressed", "false");
      };

      isReading = true;
      readButton.textContent = "Stop oplæsning";
      readButton.setAttribute("aria-pressed", "true");
      speech.speak(utterance);
    });
  }

  window.addEventListener("pagehide", () => {
    if (speech) speech.cancel();
  });


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
});