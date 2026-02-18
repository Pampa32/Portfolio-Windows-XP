// js/desktop/icons.js
// Comportamiento "Windows real": un click selecciona, doble click abre.
// En dispositivos táctiles (pointer coarse), mantenemos el click normal para no fastidiar.

(() => {
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const isTouch = () => window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  function clearSelected() {
    qsa(".enlaceIcons.icon-selected").forEach(a => a.classList.remove("icon-selected"));
  }

  function openFrom(el) {
    const id = el.getAttribute("data-open") || el.getAttribute("data-toggle");
    if (!id) return;
    if (window.XPWindows && window.XPWindows.toggle) {
      // data-toggle mantiene el comportamiento clásico (toggle)
      if (el.hasAttribute("data-toggle")) window.XPWindows.toggle(id);
      else window.XPWindows.open(id);
    }
  }

  function init() {
    // Solo escritorio: iconos principales
    const icons = qsa("a.enlaceIcons[data-toggle], a.enlaceIcons[data-open]");
    if (!icons.length) return;

    // En táctil dejamos el click normal (ya lo maneja windows.js por data-*)
    if (isTouch()) return;

    icons.forEach(a => {
      // click = seleccionar
      a.addEventListener("click", (e) => {
        e.preventDefault();
        clearSelected();
        a.classList.add("icon-selected");
        a.focus({ preventScroll: true });
      });

      // doble click = abrir
      a.addEventListener("dblclick", (e) => {
        e.preventDefault();
        clearSelected();
        openFrom(a);
      });

      // Enter abre si está seleccionado/focus
      a.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          openFrom(a);
        }
      });
    });

    // click fuera: deseleccionar
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a.enlaceIcons")) return;
      clearSelected();
    });
  }

  window.XPDesktopIcons = { init };
})();
