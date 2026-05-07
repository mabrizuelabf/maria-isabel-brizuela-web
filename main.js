(() => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // Smooth scroll (respects reduced motion via CSS override)
  document.documentElement.style.scrollBehavior = "smooth";

  // Elevate header on scroll
  const header = document.querySelector("[data-elevate-on-scroll]");
  const setElevated = () => {
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 6);
  };
  setElevated();
  window.addEventListener("scroll", setElevated, { passive: true });

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const closeNav = () => {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  };

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const next = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(next));
      links.classList.toggle("is-open", next);
    });

    links.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) closeNav();
    });

    document.addEventListener("click", (e) => {
      if (!links.classList.contains("is-open")) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      const withinNav = t.closest(".nav");
      if (!withinNav) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Copy message from form (demo-friendly)
  const copyBtn = document.querySelector("[data-copy-message]");
  if (copyBtn instanceof HTMLButtonElement) {
    copyBtn.addEventListener("click", async () => {
      const name = document.querySelector("input[name='nombre']");
      const motivo = document.querySelector("input[name='motivo']");
      const msg = document.querySelector("textarea[name='mensaje']");

      const text = [
        "Hola María Isabel,",
        "",
        `Mi nombre es: ${(name && "value" in name && name.value.trim()) || "—"}`,
        `Motivo de consulta: ${(motivo && "value" in motivo && motivo.value.trim()) || "—"}`,
        "",
        (msg && "value" in msg && msg.value.trim()) || "Me gustaría agendar una evaluación. ¿Tienes disponibilidad?",
      ].join("\n");

      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copiado";
        copyBtn.disabled = true;
        window.setTimeout(() => {
          copyBtn.textContent = "Copiar mensaje";
          copyBtn.disabled = false;
        }, 1300);
      } catch {
        // Fallback: select textarea if clipboard unavailable
        if (msg instanceof HTMLTextAreaElement) {
          msg.value = text;
          msg.focus();
          msg.select();
        }
      }
    });
  }
})();

