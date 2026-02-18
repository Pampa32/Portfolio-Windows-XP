// js/desktop/clock.js
(() => {
  function pad(n) { return n <= 9 ? ("0" + n) : String(n); }

  function tick() {
    const now = new Date();
    const horas = pad(now.getHours());
    const minutos = pad(now.getMinutes());
    const reloj = document.getElementById("reloj");
    if (reloj) reloj.textContent = `${horas}:${minutos}`;
  }

  function init() {
    tick();
    setInterval(tick, 1000);
  }

  window.XPClock = { init };
})();
