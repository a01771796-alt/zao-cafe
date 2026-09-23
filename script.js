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

  // Navegación por anclas: scroll manual porque scroll-behavior nativo
  // puede cortarse a medio camino en clics reales
  document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const id = url.hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    });
  });
});
