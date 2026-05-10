(() => {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const header = document.querySelector("[data-header]");
  const form = document.querySelector("[data-demo-form]");
  const status = document.querySelector("[data-form-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const closeMenu = () => {
    if (!menuButton || !nav) {
      return;
    }

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
      nav.classList.toggle("is-open", !isOpen);
      body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  if (header) {
    const updateHeaderState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  const revealTargets = document.querySelectorAll([
    ".hero",
    ".section-heading",
    ".service-card",
    ".benefits-grid article",
    ".step",
    ".testimonial",
    ".zones-inner",
    ".trust-photo",
    ".check-grid div",
    ".contact-item",
    ".contact-form",
    ".site-footer"
  ].join(","));

  if (revealTargets.length) {
    revealTargets.forEach((element, index) => {
      element.classList.add("reveal-item");

      const delay = index % 4;
      if (delay > 0) {
        element.classList.add(`reveal-delay-${delay}`);
      }
    });

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
      });

      revealTargets.forEach((element) => revealObserver.observe(element));
    }
  }

  if (form && status) {
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));

    const setError = (field, message) => {
      const row = field.closest(".form-row");
      const error = form.querySelector(`[data-error-for="${field.id}"]`);

      if (row) {
        row.classList.toggle("has-error", Boolean(message));
      }

      if (error) {
        error.textContent = message;
      }

      field.setAttribute("aria-invalid", String(Boolean(message)));
    };

    const validateField = (field) => {
      const value = field.value.trim();
      let message = "";

      if (field.required && !value) {
        message = "Este campo es obligatorio.";
      } else if (field.id === "message" && value.length > 0 && value.length < 12) {
        message = "Añade un poco más de detalle.";
      }

      setError(field, message);
      return !message;
    };

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const validationResults = fields.map((field) => validateField(field));
      const isValid = validationResults.every(Boolean);

      if (!isValid) {
        status.textContent = "Revisa los campos marcados antes de continuar.";
        const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      form.reset();
      fields.forEach((field) => setError(field, ""));
      status.textContent = "Solicitud simulada correctamente. En una web real, este formulario se conectaría a un sistema seguro.";
    });
  }
})();
