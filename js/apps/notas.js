// js/apps/notas.js
// Inicialización mínima para las ventanas tipo Notas (README.txt).
// Mantiene el contenido 100% igual; solo gestiona pequeños detalles de UX.

(() => {
  const NOTE_IDS = [
    "seccion-notas",
    "seccion-notas-aplicaciones",
    "seccion-notas-trabajos",
  ];

  function scrollTop(id) {
    const win = document.getElementById(id);
    if (!win) return;
    // si hay un contenedor con overflow, lo subimos
    const scroller = win.querySelector("[data-scroll], .scroll, .contenido, #caja-seccion-notas, #caja-seccion-notas-aplicaciones, #caja-seccion-notas-trabajos");
    if (scroller && typeof scroller.scrollTop === "number") scroller.scrollTop = 0;
  }

  function init() {
    document.addEventListener("xp:window-open", (e) => {
      const id = e.detail?.id;
      if (NOTE_IDS.includes(id)) scrollTop(id);
    });
  }

  window.XPNotas = { init };
})();
