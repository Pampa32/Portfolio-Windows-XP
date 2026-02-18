// js/calculadora.js
// App "Calculadora".
// Antes este archivo estaba mezclado con ventanas, fullscreen, etc.
// Ahora se encarga SOLO de la calculadora.

(() => {
  // Si la calculadora no existe en el DOM (por cambios futuros), salimos sin romper nada.
  const pantalla = document.querySelector('.pantalla');
  const btnReset = document.querySelector("[data-accion='reset']");
  const btnBorrar = document.querySelector("[data-accion='borrar']");
  const btnIgual = document.querySelector("[data-accion='igual']");
  const btnsTexto = document.querySelectorAll('[data-texto]');

  if (!pantalla || !btnReset || !btnBorrar || !btnIgual || !btnsTexto.length) return;

  let expresion = '';

  function pintar() {
    pantalla.textContent = expresion || '0';
  }

  function append(txt) {
    expresion += String(txt);
    pintar();
  }

  function reset() {
    expresion = '';
    pintar();
  }

  function borrar() {
    expresion = expresion.slice(0, -1);
    pintar();
  }

  function igual() {
    try {
      // Nota: eval es suficiente aquí (input controlado por botones/teclado),
      // y se mantiene para no romper tu lógica actual.
      const resultado = eval(expresion); // eslint-disable-line no-eval
      pantalla.textContent = String(resultado).substring(0, 12);
    } catch {
      pantalla.textContent = 'ERROR';
    }
    expresion = '';
  }

  // Click botones
  btnsTexto.forEach(btn => {
    btn.addEventListener('click', () => append(btn.dataset.texto || ''));
  });
  btnReset.addEventListener('click', reset);
  btnBorrar.addEventListener('click', borrar);
  btnIgual.addEventListener('click', igual);

  // Atajos teclado (si Mousetrap está cargado)
  if (window.Mousetrap) {
    const calcWin = () => document.getElementById('calculadora');
    const isCalcActive = () => {
      const w = calcWin();
      return !!(w && !w.hidden && w.classList.contains('ventana-activa'));
    };

    // Teclas de los botones normales
    btnsTexto.forEach(btn => {
      const caracter = btn.dataset.texto;
      if (!caracter) return;
      window.Mousetrap.bind(caracter, (e) => {
        if (!isCalcActive()) return;
        // evitamos que escriba en inputs si algún día metes uno
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        append(caracter);
      });
    });

    window.Mousetrap.bind('enter', (e) => {
      if (!isCalcActive()) return;
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      igual();
    });
    window.Mousetrap.bind('escape', (e) => {
      if (!isCalcActive()) return;
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      reset();
    });
    window.Mousetrap.bind('backspace', (e) => {
      if (!isCalcActive()) return;
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      borrar();
    });
  }

  // Estado inicial
  pintar();
})();
