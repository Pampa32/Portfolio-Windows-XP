// js/main.js
// Bootstrap del escritorio XP: reloj, ventanas, drag, menú inicio.
(() => {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(() => {
    if (window.XPWindows) window.XPWindows.init();
    if (window.XPDrag) window.XPDrag.init();
    if (window.XPClock) window.XPClock.init();
    if (window.XPStartMenu) window.XPStartMenu.init();
    if (window.XPFullscreen) window.XPFullscreen.init();
    if (window.XPTaskbar) window.XPTaskbar.init();
    if (window.XPDesktopIcons) window.XPDesktopIcons.init();
    if (window.XPNotas) window.XPNotas.init();
    if (window.XPMSN) window.XPMSN.init();
  });
})();
