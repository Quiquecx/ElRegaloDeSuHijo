/* =============================================================
   BLOQUE 2 - "MI CORAZÓN APRENDE A HACER EL BIEN"
   Se muestra una acción a la vez; el niño decide si está bien o
   está mal. Tras responder, aparece un emoji de retroalimentación
   (feliz si acertó, triste si no) y se pasa a la siguiente acción.
   ============================================================= */

window.Bloque2 = (function () {

  const IMG = 'src/imgs/nivel2/';

  const ACCIONES = [
    { img: IMG + 'accion_a.png', esBuena: true },   // mamá consolando a su hija
    { img: IMG + 'accion_b.png', esBuena: false },  // quitarle el juguete a alguien
    { img: IMG + 'accion_c.png', esBuena: true },   // ayudar a una abuelita a caminar
    { img: IMG + 'accion_d.png', esBuena: false },  // pelearse jalando el cabello
    { img: IMG + 'accion_e.png', esBuena: true },   // consolar a un amigo triste
    { img: IMG + 'accion_f.png', esBuena: true },   // abrazarse con cariño
    { img: IMG + 'accion_g.png', esBuena: true },   // compartir comida
    { img: IMG + 'accion_h.png', esBuena: true },   // regar una planta
    { img: IMG + 'accion_i.png', esBuena: false },  // pisotear un juguete con enojo
    { img: IMG + 'accion_j.png', esBuena: false }   // pelearse a golpes
  ];

  const EMOJI_FELIZ = IMG + 'emoji_feliz.png';
  const EMOJI_TRISTE = IMG + 'emoji_triste.png';

  let contenedorImagen = null;
  let contenedorEmoji = null;
  let btnBien = null;
  let btnMal = null;

  let orden = [];
  let indice = 0;
  let puntaje = 0;
  let bloqueado = false;

  let onProgress = null;
  let onRespuesta = null;
  let onComplete = null;

  function barajar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function mostrarAccionActual() {
    const accion = orden[indice];
    contenedorImagen.innerHTML = '';
    const img = document.createElement('img');
    img.src = accion.img;
    img.alt = 'Acción a evaluar';
    img.draggable = false;
    contenedorImagen.appendChild(img);

    contenedorEmoji.innerHTML = '';
    contenedorEmoji.classList.add('oculto');

    bloqueado = false;
    btnBien.disabled = false;
    btnMal.disabled = false;

    if (onProgress) onProgress(indice, orden.length);
  }

  function responder(eligioBuena) {
    if (bloqueado) return;
    bloqueado = true;
    btnBien.disabled = true;
    btnMal.disabled = true;

    const accion = orden[indice];
    const esCorrecta = eligioBuena === accion.esBuena;

    if (esCorrecta) puntaje++;

    const emojiImg = document.createElement('img');
    emojiImg.src = esCorrecta ? EMOJI_FELIZ : EMOJI_TRISTE;
    emojiImg.alt = esCorrecta ? '¡Correcto!' : 'Sigue intentando';
    contenedorEmoji.innerHTML = '';
    contenedorEmoji.appendChild(emojiImg);
    contenedorEmoji.classList.remove('oculto');

    if (onRespuesta) onRespuesta(esCorrecta, puntaje);

    setTimeout(() => {
      const esUltima = indice >= orden.length - 1;
      if (esUltima) {
        if (onComplete) onComplete(puntaje, orden.length);
      } else {
        indice++;
        mostrarAccionActual();
      }
    }, 1300);
  }

  function iniciarActividad(callbacks) {
    contenedorImagen = document.getElementById('n2-imagen');
    contenedorEmoji = document.getElementById('n2-emoji');
    btnBien = document.getElementById('btn-n2-bien');
    btnMal = document.getElementById('btn-n2-mal');

    onProgress = (callbacks && callbacks.onProgress) || null;
    onRespuesta = (callbacks && callbacks.onRespuesta) || null;
    onComplete = (callbacks && callbacks.onComplete) || null;

    orden = barajar(ACCIONES);
    indice = 0;
    puntaje = 0;

    // Los botones se reutilizan entre partidas: se clonan para
    // limpiar cualquier listener previo antes de volver a usarlos.
    const nuevoBien = btnBien.cloneNode(true);
    btnBien.parentNode.replaceChild(nuevoBien, btnBien);
    btnBien = nuevoBien;

    const nuevoMal = btnMal.cloneNode(true);
    btnMal.parentNode.replaceChild(nuevoMal, btnMal);
    btnMal = nuevoMal;

    btnBien.addEventListener('click', () => responder(true));
    btnMal.addEventListener('click', () => responder(false));

    mostrarAccionActual();
  }

  return {
    iniciarActividad
  };
})();
