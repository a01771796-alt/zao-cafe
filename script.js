// Menú móvil reutilizable — mismo patrón usado en Bruna Metepec, Olivo, Vida Café y Sabores Metepec.
// Requiere en el HTML: un botón con id="nav-toggle" (aria-expanded="false", aria-controls="main-nav")
// y el contenedor de navegación con id="main-nav".
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  const openNav = () => {
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeNav() : openNav();
  });

  // Cerrar al hacer click en un link del menú
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  // Cerrar al hacer click fuera del header
  document.addEventListener("click", (event) => {
    const header = toggle.closest("header") || document;
    if (!header.contains(event.target)) closeNav();
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  // Mapa bajo demanda: solo crea el iframe real al hacer click
  const mapButton = document.querySelector(".location-map-load");
  if (mapButton) {
    mapButton.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = mapButton.dataset.mapSrc;
      iframe.width = "100%";
      iframe.height = "320";
      iframe.style.border = "0";
      iframe.loading = "lazy";
      iframe.title = "Ubicación de Zao Café en el mapa";
      mapButton.replaceWith(iframe);
    });
  }

  // Scroll suave manual (rAF + easing) en vez de scrollIntoView({behavior:"smooth"}):
  // el smooth-scroll nativo del navegador se puede quedar congelado a medio camino
  // en clics reales, así que animamos el scroll nosotros mismos, cuadro a cuadro.
  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const smoothScrollTo = (targetY) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (reduceMotion || Math.abs(distance) < 2) {
      window.scrollTo(0, targetY);
      return;
    }
    const duration = 600;
    let startTime = null;
    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutQuad(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Navegación por anclas
  document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const id = url.hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const headerClearance = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerClearance;
      smoothScrollTo(Math.max(targetY, 0));
      history.pushState(null, "", `#${id}`);
    });
  });
});

// Reveal sutil al hacer scroll (una sola vez por elemento) — mismo patrón que Olivo café y té
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${Math.min(i * 100, 300)}ms`;
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
});
