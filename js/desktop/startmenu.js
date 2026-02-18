// js/desktop/startmenu.js
(() => {
  function init() {
    const botonInicio = document.getElementById("botonInicio");
    const menuInicio = document.getElementById("menuInicio");
    if (!botonInicio || !menuInicio) return;

    // Este menú se muestra/oculta con la clase CSS `.abierto` (no con `hidden`).
    const open = () => {
      menuInicio.classList.add("abierto");
      menuInicio.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      menuInicio.classList.remove("abierto");
      menuInicio.setAttribute("aria-hidden", "true");
    };
    const toggle = () => {
      menuInicio.classList.contains("abierto") ? close() : open();
    };

    // Estado inicial coherente
    close();

    botonInicio.addEventListener("click", () => {
      toggle();
    });

    document.addEventListener("click", (e) => {
      const inside = menuInicio.contains(e.target) || botonInicio.contains(e.target);
      if (!inside) close();
    });

    // ESC cierra el menú (muy XP)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  window.XPStartMenu = { init };
})();
