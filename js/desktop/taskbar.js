// js/desktop/taskbar.js
// Marca en la barra de tareas qué ventanas están abiertas y cuál está al frente.
// No “reinventa” tu CSS: solo añade clases (task-open / task-front) sobre los botones/divs del footer.

(() => {
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  function getTaskButtonsForWindow(id) {
    // En tu barra de tareas, los “botones” son divs con data-toggle.
    return qsa(`#barraTareas [data-toggle="${CSS.escape(id)}"], #barraTareas [data-open="${CSS.escape(id)}"]`);
  }

  function setState(id, { open, front }) {
    const btns = getTaskButtonsForWindow(id);
    btns.forEach(btn => {
      btn.classList.toggle("task-open", !!open);
      btn.classList.toggle("task-front", !!front);
    });
  }

  function clearFrontAll() {
    qsa("#barraTareas .task-front").forEach(el => el.classList.remove("task-front"));
  }

  function isWindowVisible(id) {
    const el = document.getElementById(id);
    return !!(el && el.classList.contains("ventana") && el.hidden === false);
  }

  function syncAll() {
    qsa(".ventana[id]").forEach(w => {
      setState(w.id, { open: !w.hidden, front: w.classList.contains("ventana-activa") });
    });
  }

  function init() {
    // Estado inicial
    syncAll();

    document.addEventListener("xp:window-open", (e) => {
      const id = e.detail?.id;
      if (!id) return;
      setState(id, { open: true, front: true });
      clearFrontAll();
      setState(id, { open: true, front: true });
    });

    document.addEventListener("xp:window-close", (e) => {
      const id = e.detail?.id;
      if (!id) return;
      setState(id, { open: false, front: false });
    });

    document.addEventListener("xp:window-minimize", (e) => {
      const id = e.detail?.id;
      if (!id) return;
      // minimizada: sigue “abierta” pero no al frente
      setState(id, { open: true, front: false });
      clearFrontAll();
    });

    document.addEventListener("xp:window-focus", (e) => {
      const id = e.detail?.id;
      clearFrontAll();
      if (!id) return;
      // Si está visible, marcamos front
      setState(id, { open: isWindowVisible(id), front: true });
    });

    // Si el usuario hace click en un botón de la barra que ya estaba abierto,
    // tu data-toggle lo ocultará; sincronizamos después del click.
    qsa("#barraTareas [data-toggle], #barraTareas [data-open]").forEach(btn => {
      btn.addEventListener("click", () => setTimeout(syncAll, 0));
    });
  }

  window.XPTaskbar = { init, syncAll };
})();
