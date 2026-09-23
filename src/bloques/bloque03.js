/* =============================================================
   BLOQUE 3 - "EL REGALO MÁS GRANDE DE PAPÁ DIOS"
   El niño toca cada elemento de la escena (niños, flores rosas,
   mariposas); junto a cada uno aparece el número de conteo en
   orden. Después elige de una pequeña tabla el número que
   corresponde al total. Tres preguntas en la misma escena.
   ============================================================= */

window.Bloque3 = (function () {

  const IMG_ESCENA = 'src/imgs/nivel3/escena.png';

  // Coordenadas (% del ancho/alto de la imagen) obtenidas midiendo
  // la escena real, para que los puntos táctiles caigan justo
  // sobre cada niño, flor o mariposa.
  const PREGUNTAS = [
    {
      prompt: '¿Cuántos niños hay? Toca cada niño.',
      puntos: [
        { x: 0.16, y: 0.55 },
        { x: 0.40, y: 0.655 },
        { x: 0.80, y: 0.54 }
      ],
      respuesta: 3,
      opciones: [2, 3, 4]
    },
    {
      prompt: '¿Cuántas flores color rosa hay? Toca cada flor rosa.',
      puntos: [
        { x: 0.6153, y: 0.5699 },
        { x: 0.6367, y: 0.5983 },
        { x: 0.6486, y: 0.5440 },
        { x: 0.6727, y: 0.5929 },
        { x: 0.6913, y: 0.5343 },
        { x: 0.7065, y: 0.5957 },
        { x: 0.7204, y: 0.5610 },
        { x: 0.7358, y: 0.6059 },
        { x: 0.7588, y: 0.5544 },
        { x: 0.7648, y: 0.5960 }
      ],
      respuesta: 10,
      opciones: [9, 10, 11]
    },
    {
      prompt: '¿Cuántas mariposas hay? Toca cada mariposa.',
      puntos: [
        { x: 0.6228, y: 0.2289 },
        { x: 0.2683, y: 0.4250 },
        { x: 0.2585, y: 0.1624 },
        { x: 0.2945, y: 0.2158 }
      ],
      respuesta: 4,
      opciones: [3, 4, 5]
    }
  ];

  let escenaWrap = null;
  let escenaImg = null;
  let capaPuntos = null;
  let promptEl = null;
  let contadorEl = null;
  let opcionesEl = null;

  let indicePregunta = 0;
  let tocados = 0;

  let onProgress = null;
  let onConteo = null;
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

  function crearPuntoTactil(punto, numeroOrden) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'n3-punto';
    boton.style.left = (punto.x * 100) + '%';
    boton.style.top = (punto.y * 100) + '%';

    boton.addEventListener('click', () => {
      if (boton.classList.contains('n3-punto-tocado')) return;
      tocados++;
      boton.classList.add('n3-punto-tocado');
      boton.textContent = tocados;

      if (onConteo) onConteo(tocados, PREGUNTAS[indicePregunta].puntos.length);
      if (contadorEl) {
        contadorEl.textContent = `Llevas contados: ${tocados}`;
      }

      if (tocados >= PREGUNTAS[indicePregunta].puntos.length) {
        mostrarOpciones();
      }
    });

    return boton;
  }

  function mostrarOpciones() {
    const pregunta = PREGUNTAS[indicePregunta];
    opcionesEl.innerHTML = '';
    opcionesEl.classList.remove('oculto');

    barajar(pregunta.opciones).forEach((num) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'n3-opcion-numero';
      boton.textContent = num;
      boton.addEventListener('click', () => elegirRespuesta(num, boton));
      opcionesEl.appendChild(boton);
    });
  }

  function elegirRespuesta(num, botonEl) {
    const pregunta = PREGUNTAS[indicePregunta];
    const esCorrecta = num === pregunta.respuesta;

    if (esCorrecta) {
      botonEl.classList.add('n3-opcion-correcta');
      opcionesEl.querySelectorAll('.n3-opcion-numero').forEach((b) => { b.disabled = true; });

      if (onRespuesta) onRespuesta(true);

      setTimeout(() => {
        const esUltima = indicePregunta >= PREGUNTAS.length - 1;
        if (esUltima) {
          if (onComplete) onComplete();
        } else {
          indicePregunta++;
          cargarPregunta(indicePregunta);
        }
      }, 1100);
    } else {
      botonEl.classList.add('n3-opcion-incorrecta');
      setTimeout(() => botonEl.classList.remove('n3-opcion-incorrecta'), 500);
      if (onRespuesta) onRespuesta(false);
    }
  }

  function cargarPregunta(indice) {
    const pregunta = PREGUNTAS[indice];
    tocados = 0;

    promptEl.textContent = pregunta.prompt;
    contadorEl.textContent = 'Llevas contados: 0';
    opcionesEl.innerHTML = '';
    opcionesEl.classList.add('oculto');

    capaPuntos.innerHTML = '';
    pregunta.puntos.forEach((punto) => {
      capaPuntos.appendChild(crearPuntoTactil(punto));
    });

    if (onProgress) onProgress(indice, PREGUNTAS.length);
  }

  function iniciarActividad(callbacks) {
    escenaWrap = document.getElementById('n3-escena-wrap');
    escenaImg = document.getElementById('n3-escena-img');
    capaPuntos = document.getElementById('n3-capa-puntos');
    promptEl = document.getElementById('n3-prompt');
    contadorEl = document.getElementById('n3-contador');
    opcionesEl = document.getElementById('n3-opciones');

    onProgress = (callbacks && callbacks.onProgress) || null;
    onConteo = (callbacks && callbacks.onConteo) || null;
    onRespuesta = (callbacks && callbacks.onRespuesta) || null;
    onComplete = (callbacks && callbacks.onComplete) || null;

    escenaImg.src = IMG_ESCENA;

    indicePregunta = 0;
    cargarPregunta(indicePregunta);
  }

  return {
    iniciarActividad
  };
})();
