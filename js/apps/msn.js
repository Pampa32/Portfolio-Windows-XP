// js/apps/msn.js
// UX mínima para la ventana de "Contacto" estilo Messenger.
// Objetivo: cuando se abre, dejar el chat scrolleado al final (como un chat de verdad).

(() => {
  const MSN_ID = "contenedor-msn";

  function scrollChatToBottom() {
    const win = document.getElementById(MSN_ID);
    if (!win) return;
    const chatBoxes = win.querySelectorAll("#caja-chat-invitado-texto, #caja-chat-texto, .chat-texto");
    chatBoxes.forEach(box => {
      try { box.scrollTop = box.scrollHeight; } catch (_) {}
    });
  }

  function init() {
    document.addEventListener("xp:window-open", (e) => {
      const id = e.detail?.id;
      if (id === MSN_ID) scrollChatToBottom();
    });
    document.addEventListener("xp:window-focus", (e) => {
      const id = e.detail?.id;
      if (id === MSN_ID) scrollChatToBottom();
    });
  }

  window.XPMSN = { init };
})();
