/* =============================================================
   BLOQUE 3 - "EL REGALO MÁS GRANDE DE PAPÁ DIOS"
   - Niños y mariposas: puntos táctiles invisibles individuales.
   - Flores rosas: ZONA GRANDE donde 10 clics en cualquier parte de la zona
     activan las opciones.
   ============================================================= */

   window.Bloque3 = (function () {

    const IMG_ESCENA = 'src/imgs/nivel3/escena.png';
  
    const PREGUNTAS = [
      {
        prompt: '¿Cuántos niños hay? Toca cada niño.',
        tipo: 'puntos',
        radio: 90,
        puntos: [
          { x: 0.3083, y: 0.5838 },
          { x: 0.4483, y: 0.7430 },
          { x: 0.6894, y: 0.5789 }
        ],
        respuesta: 3,
        opciones: [2, 3, 4]
      },
      {
        prompt: '¿Cuántas flores color rosa hay? Toca las flores.',
        tipo: 'zona',
        // Ampliamos la zona para asegurar que cualquier toque cerca cuente
        zona: { x: 0.55, y: 0.50, w: 0.38, h: 0.35 },
        mostrarNumerosEnPanel: true,
        respuesta: 10,
        opciones: [9, 10, 11]
      },
      {
        prompt: '¿Cuántas mariposas hay? Toca cada mariposa.',
        tipo: 'puntos',
        radio: 90,
        puntos: [
          { x: 0.3628, y: 0.2215 },
          { x: 0.3628, y: 0.4443 },
          { x: 0.4350, y: 0.4835 },
          { x: 0.5728, y: 0.2632 },
          { x: 0.5572, y: 0.4908 }
        ],
        respuesta: 5,
        opciones: [4, 5, 6]
      }
    ];
  
    let escenaWrap = null;
    let escenaImg = null;
    let capaPuntos = null;
    let promptEl = null;
    let contadorEl = null;
    let opcionesEl = null;
    let panelNumerosEl = null;
  
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
  
    /* ---------------------------------------------------------
       Punto táctil individual (niños y mariposas)
       --------------------------------------------------------- */
    function crearPuntoTactil(punto, radioPx, usarPanel) {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'n3-punto';
      boton.style.left = (punto.x * 100) + '%';
      boton.style.top = (punto.y * 100) + '%';
      boton.style.setProperty('--radio-punto', radioPx + 'px');
  
      boton.addEventListener('click', () => {
        if (boton.classList.contains('n3-punto-tocado')) return;
        if (tocados >= PREGUNTAS[indicePregunta].respuesta) return;
        
        tocados++;
        boton.classList.add('n3-punto-tocado');
  
        if (usarPanel) {
          agregarNumeroAlPanel(tocados);
        } else {
          boton.dataset.numero = tocados;
        }
  
        if (onConteo) onConteo(tocados, PREGUNTAS[indicePregunta].respuesta);
        if (contadorEl) contadorEl.textContent = `Llevas contados: ${tocados}`;
  
        if (tocados >= PREGUNTAS[indicePregunta].respuesta) {
          mostrarOpciones();
        }
      });
  
      return boton;
    }
  
    /* ---------------------------------------------------------
       Zona grande (flores): da un toque en la zona y suma 1
       --------------------------------------------------------- */
    function crearZonaTactil(zona, usarPanel) {
      const contenedorZona = document.createElement('div');
      contenedorZona.className = 'n3-zona';
      contenedorZona.style.position = 'absolute';
      contenedorZona.style.left = (zona.x * 100) + '%';
      contenedorZona.style.top = (zona.y * 100) + '%';
      contenedorZona.style.width = (zona.w * 100) + '%';
      contenedorZona.style.height = (zona.h * 100) + '%';
      contenedorZona.style.cursor = 'pointer';
      contenedorZona.style.touchAction = 'manipulation';
  
      contenedorZona.addEventListener('click', (e) => {
        if (tocados >= PREGUNTAS[indicePregunta].respuesta) return;
  
        tocados++;
  
        if (usarPanel) {
          agregarNumeroAlPanel(tocados);
        }
  
        // Crear un pequeño destello visual en la posición exacta del clic
        mostrarMarcaVisualEnClic(e, contenedorZona);
  
        if (onConteo) onConteo(tocados, PREGUNTAS[indicePregunta].respuesta);
        if (contadorEl) contadorEl.textContent = `Llevas contados: ${tocados}`;
  
        if (tocados >= PREGUNTAS[indicePregunta].respuesta) {
          mostrarOpciones();
        }
      });
  
      return contenedorZona;
    }
  
    /* Crea una pequeña estrellita/marca sutil donde el usuario hizo clic */
    function mostrarMarcaVisualEnClic(e, contenedor) {
      const rect = contenedor.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      const marca = document.createElement('span');
      marca.className = 'n3-marca-clic';
      marca.style.left = `${x}px`;
      marca.style.top = `${y}px`;
  
      contenedor.appendChild(marca);
  
      setTimeout(() => marca.remove(), 600);
    }
  
    /* --------- Panel de números para flores --------- */
    function crearPanelNumeros() {
      eliminarPanelNumeros();
      panelNumerosEl = document.createElement('div');
      panelNumerosEl.className = 'n3-panel-numeros';
      escenaWrap.parentNode.insertBefore(panelNumerosEl, escenaWrap);
    }
  
    function eliminarPanelNumeros() {
      if (panelNumerosEl) {
        panelNumerosEl.remove();
        panelNumerosEl = null;
      }
    }
  
    function agregarNumeroAlPanel(numero) {
      if (!panelNumerosEl) return;
      const span = document.createElement('span');
      span.className = 'n3-panel-numero';
      span.textContent = numero;
      panelNumerosEl.appendChild(span);
    }
  
    /* --------- Opciones numéricas --------- */
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
  
    /* --------- Carga de preguntas --------- */
    function cargarPregunta(indice) {
      const pregunta = PREGUNTAS[indice];
      tocados = 0;
  
      promptEl.textContent = pregunta.prompt;
      contadorEl.textContent = 'Llevas contados: 0';
      opcionesEl.innerHTML = '';
      opcionesEl.classList.add('oculto');
  
      if (pregunta.mostrarNumerosEnPanel) {
        crearPanelNumeros();
      } else {
        eliminarPanelNumeros();
      }
  
      capaPuntos.innerHTML = '';
  
      if (pregunta.tipo === 'zona') {
        capaPuntos.appendChild(crearZonaTactil(pregunta.zona, !!pregunta.mostrarNumerosEnPanel));
      } else {
        pregunta.puntos.forEach((punto) => {
          capaPuntos.appendChild(
            crearPuntoTactil(punto, pregunta.radio, !!pregunta.mostrarNumerosEnPanel)
          );
        });
      }
  
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