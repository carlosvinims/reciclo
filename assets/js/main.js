/* Reciclo — interações leves, sem dependências adicionais. */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-principal");

  // Menu mobile acessível: atualiza estado e fecha após escolher uma seção.
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.focus();
      }
    });
  }

  // Alternância dos dois fluxos de operação.
  const flowTabs = document.querySelectorAll("[data-flow]");
  const flowPanels = {
    reciclavel: document.querySelector("#flow-reciclavel"),
    controlado: document.querySelector("#flow-controlado")
  };

  flowTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.flow;
      flowTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });

      Object.entries(flowPanels).forEach(([key, panel]) => {
        if (!panel) return;
        const active = key === selected;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const tabs = Array.from(flowTabs);
      const index = tabs.indexOf(tab);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  // Entrada suave dos blocos, respeitando a preferência por movimento reduzido.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(
    ".stat-card, .problem-panel, .pillar-card, .flow-step, .feature-card, .audience-item, .team-card"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealItems.forEach((item) => item.classList.add("reveal"));
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  // Botão de retorno ao topo.
  const backToTop = document.querySelector(".back-to-top");
  const updateBackToTop = () => {
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // Ano automático no rodapé.
  const year = document.querySelector("#ano-atual");
  if (year) year.textContent = String(new Date().getFullYear());

  // Placeholder de e-mail: evita deixar um mailto incompleto passar despercebido.
  const emailLink = document.querySelector("[data-email-link]");
  const emailNote = document.querySelector("[data-email-note]");
  if (emailLink && emailNote && emailLink.getAttribute("href").includes("SEU_EMAIL_AQUI")) {
    emailLink.addEventListener("click", (event) => {
      event.preventDefault();
      emailNote.classList.add("contact-placeholder-alert");
      emailNote.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
  }
});
