// js/desktop/fullscreen.js
// Botón de pantalla completa (y opcional doble click en "escritorio").
// Expone window.XPFullscreen.

(() => {
  const root = document.documentElement;

  function entrar() {
    const req = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
    if (req) req.call(root);
  }

  function salir() {
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (exit) exit.call(document);
  }

  function toggle() {
    if (!document.fullscreenElement) entrar();
    else salir();
  }

  function init() {
    const btn = document.getElementById('btnFull');
    if (btn) {
      btn.addEventListener('click', toggle);
    }

    // Si existe un wrapper con id="escritorio", doble click alterna fullscreen.
    const desk = document.getElementById('escritorio');
    if (desk) {
      desk.addEventListener('dblclick', toggle);
    }
  }

  window.XPFullscreen = { init, toggle, entrar, salir };
})();
