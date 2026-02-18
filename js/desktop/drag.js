// js/desktop/drag.js
// Drag de ventanas compatible con mouse + touch, sin romper clicks (cerrar/minimizar) ni resize.
(() => {
  const DRAG_THRESHOLD = 4; // px antes de considerar que es drag real

  // Si el pointerdown empieza en algo "clicable" o en el tirador de resize, NO arrastramos.
  const NO_DRAG_SELECTOR = [
    "button",
    "a",
    "input",
    "select",
    "textarea",
    "[data-close]",
    "[data-minimize]",
    ".resizer"
  ].join(",");

  function makeDraggable(winEl, handlerEl) {
    const handle = handlerEl || winEl;

    let pid = null;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let dragging = false;

    // Evita gestos del navegador mientras arrastras en táctil
    try { handle.style.touchAction = "none"; } catch (_) {}

    function down(e) {
      // Solo botón izquierdo si es ratón
      if (e.pointerType === "mouse" && e.button !== 0) return;

      // Si has tocado un botón (cerrar/minimizar) o el resizer → NO drag
      if (e.target && e.target.closest && e.target.closest(NO_DRAG_SELECTOR)) return;

      pid = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;

      // Asegura posición movible
      const cs = getComputedStyle(winEl);
      if (cs.position === "static") winEl.style.position = "absolute";

      startLeft = winEl.offsetLeft;
      startTop = winEl.offsetTop;
      dragging = false;

      // Traer al frente si existe gestor
      if (window.XPWindows && typeof window.XPWindows.focus === "function") {
        window.XPWindows.focus(winEl);
      }
    }

    function move(e) {
      if (pid !== e.pointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Aún es click, no drag
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        dragging = true;
      }

      // Bloquear scroll solo en touch mientras arrastras
      if (e.pointerType === "touch" && e.cancelable) e.preventDefault();

      winEl.style.left = (startLeft + dx) + "px";
      winEl.style.top  = (startTop  + dy) + "px";
    }

    function up(e) {
      if (pid !== e.pointerId) return;
      pid = null;
      dragging = false;
    }

    handle.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function init() {
    document.querySelectorAll(".ventana").forEach(winEl => {
      const handler =
        winEl.querySelector(".titlebar") ||
        winEl.querySelector(".titlebar2") ||
        winEl.querySelector("#barra-inicio-notas") ||
        winEl.querySelector("#barra-inicio-notas-aplicaciones") ||
        winEl.querySelector("#barra-inicio-notas-trabajos") ||
        winEl.querySelector("#tituloError") || // error 404
        null;

      makeDraggable(winEl, handler);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
