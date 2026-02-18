// js/desktop/windows.js
// Motor sencillo de ventanas estilo XP: abrir/cerrar/focus + ESC para cerrar la activa.
// No requiere módulos; expone window.XPWindows.

(() => {
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const byId = (id) => document.getElementById(id);

  let z = 100;
  let activeId = null;

  function emit(type, detail) {
    document.dispatchEvent(new CustomEvent(type, { detail }));
  }

  function getWindows() {
    return qsa(".ventana");
  }

  function focus(winEl) {
    if (!winEl) return;
    // subir al frente
    z += 1;
    winEl.style.zIndex = String(z);

    // marcar activa
    getWindows().forEach(w => w.classList.remove("ventana-activa"));
    winEl.classList.add("ventana-activa");
    activeId = winEl.id || null;
    emit("xp:window-focus", { id: activeId });
  }

  function open(id) {
    const winEl = byId(id);
    if (!winEl) return;
    winEl.hidden = false;
    focus(winEl);
    emit("xp:window-open", { id });
  }

  function close(id) {
    const winEl = byId(id);
    if (!winEl) return;
    winEl.hidden = true;
    winEl.classList.remove("ventana-activa");
    if (activeId === id) activeId = null;
    emit("xp:window-close", { id });
  }

  function minimize(id) {
    // En XP, minimizar = ocultar pero mantener “tarea” abierta.
    const winEl = byId(id);
    if (!winEl) return;
    winEl.hidden = true;
    winEl.classList.remove("ventana-activa");
    if (activeId === id) activeId = null;
    emit("xp:window-minimize", { id });
  }

  function toggle(id) {
    const winEl = byId(id);
    if (!winEl) return;
    if (winEl.hidden) open(id);
    else close(id);
  }

  function getTopVisible() {
    const visibles = getWindows().filter(w => !w.hidden);
    if (!visibles.length) return null;
    // escoger por z-index (si no existe, 0)
    let top = visibles[0];
    let topZ = parseInt(top.style.zIndex || "0", 10) || 0;
    for (const w of visibles.slice(1)) {
      const wz = parseInt(w.style.zIndex || "0", 10) || 0;
      if (wz >= topZ) { top = w; topZ = wz; }
    }
    return top;
  }

  function closeActiveOrTop() {
    if (activeId) {
      close(activeId);
      return;
    }
    const top = getTopVisible();
    if (top) close(top.id);
  }

  function init() {
    // click para focus
    getWindows().forEach(w => {
      w.addEventListener("mousedown", () => focus(w));
      // si venían sin zIndex inicial, asignamos uno
      if (!w.style.zIndex) {
        z += 1;
        w.style.zIndex = String(z);
      }
    });

    // soporte opcional: data-open / data-toggle / data-close
    qsa("[data-open]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-open");
        if (id) open(id);
      });
    });

    qsa("[data-toggle]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-toggle");
        if (id) toggle(id);
      });
    });
    qsa("[data-minimize]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-minimize");
        if (id) minimize(id);
      });
    });

    qsa("[data-close]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-close");
        if (id) close(id);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeActiveOrTop();
    });
  }

  // API pública
  window.XPWindows = { init, open, close, minimize, toggle, focus, getTopVisible };
})();
