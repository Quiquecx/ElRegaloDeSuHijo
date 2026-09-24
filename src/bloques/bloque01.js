/* =============================================================
   BLOQUE 1 - "SOY SU HIJO Y ÉL ESTÁ CONMIGO"
   Recta numérica del 1 al 10. En cada ronda faltan algunos
   números; el niño debe tocar las fichas EN ORDEN (de menor a
   mayor). Si toca una ficha que no es la siguiente, se muestra
   un efecto de error y se dispara el callback onError.
   Las huellas avanzan hacia el regalo con cada acierto.
   ============================================================= */

   window.Bloque1 = (function () {

    const IMG = 'src/imgs/nivel1/';
    const TOTAL_NUMEROS = 10;
  
    const RONDAS = [
      { faltantes: [2, 4, 8] },
      { faltantes: [1, 5, 7, 9] },
      { faltantes: [3, 6, 10] }
    ];
  
    let linea = null;
    let bandeja = null;
    let huella = null;
    let lineaWrap = null;
  
    let rondaActual = 0;
    let faltantesRonda = [];
    let faltantesOrdenados = []; // Números faltantes ordenados de menor a mayor
    let colocadosRonda = 0;
    let siguienteNumero = null;   // El número que el usuario debe tocar ahora
  
    let onProgress = null;
    let onColocar = null;
    let onError = null;          // <-- NUEVO: se dispara al tocar una ficha incorrecta
    let onRondaCompleta = null;
    let onComplete = null;
  
    function crearSlot(numero, esFaltante) {
      const slot = document.createElement('div');
      slot.className = 'n1-slot';
      slot.dataset.numero = numero;
  
      const img = document.createElement('img');
      img.alt = `Número ${numero}`;
      img.draggable = false;
  
      if (esFaltante) {
        slot.classList.add('n1-slot-vacio');
        img.style.visibility = 'hidden';
      }
      img.src = `${IMG}${numero}.png`;
  
      slot.appendChild(img);
      return slot;
    }
  
    function barajar(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  
    function crearFicha(numero) {
      const ficha = document.createElement('button');
      ficha.type = 'button';
      ficha.className = 'n1-ficha';
      ficha.dataset.numero = numero;
  
      const img = document.createElement('img');
      img.src = `${IMG}${numero}.png`;
      img.alt = `Ficha número ${numero}`;
      img.draggable = false;
      ficha.appendChild(img);
  
      ficha.addEventListener('click', () => colocarFicha(numero, ficha));
  
      return ficha;
    }
  
    function colocarFicha(numero, fichaEl) {
      // Validación: solo aceptar si es el número esperado
      if (numero !== siguienteNumero) {
        // Efecto visual de error
        fichaEl.classList.add('n1-ficha-error');
        setTimeout(() => {
          fichaEl.classList.remove('n1-ficha-error');
        }, 500);
  
        // Disparamos el callback de error para que main.js reproduzca el sonido
        if (onError) onError();
  
        return;
      }
  
      const slot = linea.querySelector(`.n1-slot[data-numero="${numero}"]`);
      if (!slot || !slot.classList.contains('n1-slot-vacio')) return;
  
      // Colocar la ficha en su lugar
      slot.classList.remove('n1-slot-vacio');
      slot.classList.add('n1-slot-colocado');
      const img = slot.querySelector('img');
      img.style.visibility = 'visible';
  
      fichaEl.remove();
  
      colocadosRonda++;
  
      // Actualizar el siguiente número esperado
      if (colocadosRonda < faltantesOrdenados.length) {
        siguienteNumero = faltantesOrdenados[colocadosRonda];
      } else {
        siguienteNumero = null; // Ya no hay más números por colocar
      }
  
      actualizarHuella();
  
      if (onColocar) onColocar(numero);
      if (onProgress) onProgress(rondaActual, RONDAS.length, colocadosRonda, faltantesRonda.length);
  
      if (colocadosRonda >= faltantesRonda.length) {
        setTimeout(() => {
          const esUltima = rondaActual >= RONDAS.length - 1;
          if (onRondaCompleta) onRondaCompleta(rondaActual, esUltima);
          setTimeout(() => {
            if (esUltima) {
              if (onComplete) onComplete();
            } else {
              rondaActual++;
              cargarRonda(rondaActual);
            }
          }, esUltima ? 0 : 1100);
        }, 500);
      }
    }
  
    function actualizarHuella() {
      if (!huella || !lineaWrap) return;
      const progreso = faltantesRonda.length ? colocadosRonda / faltantesRonda.length : 0;
      const anchoDisponible = lineaWrap.clientWidth - huella.offsetWidth;
      huella.style.left = Math.max(0, anchoDisponible * progreso) + 'px';
    }
  
    function cargarRonda(indiceRonda) {
      const config = RONDAS[indiceRonda];
      faltantesRonda = config.faltantes;
      // Ordenamos los faltantes de menor a mayor para que el usuario los toque en orden
      faltantesOrdenados = faltantesRonda.slice().sort((a, b) => a - b);
      colocadosRonda = 0;
      siguienteNumero = faltantesOrdenados[0]; // El primer número que debe tocar
  
      linea.innerHTML = '';
      bandeja.innerHTML = '';
  
      for (let n = 1; n <= TOTAL_NUMEROS; n++) {
        const esFaltante = faltantesRonda.includes(n);
        linea.appendChild(crearSlot(n, esFaltante));
      }
  
      barajar(faltantesRonda).forEach((n) => {
        bandeja.appendChild(crearFicha(n));
      });
  
      if (huella) {
        huella.style.left = '0px';
      }
  
      if (onProgress) onProgress(indiceRonda, RONDAS.length, 0, faltantesRonda.length);
    }
  
    function iniciarActividad(callbacks) {
      linea = document.getElementById('n1-linea');
      bandeja = document.getElementById('n1-bandeja');
      huella = document.getElementById('n1-huella');
      lineaWrap = document.getElementById('n1-linea-wrap');
  
      onProgress = (callbacks && callbacks.onProgress) || null;
      onColocar = (callbacks && callbacks.onColocar) || null;
      onError = (callbacks && callbacks.onError) || null;          // <-- NUEVO
      onRondaCompleta = (callbacks && callbacks.onRondaCompleta) || null;
      onComplete = (callbacks && callbacks.onComplete) || null;
  
      rondaActual = 0;
      cargarRonda(rondaActual);
  
      if (!window.__n1ResizeListo) {
        window.addEventListener('resize', actualizarHuella);
        window.__n1ResizeListo = true;
      }
    }
  
    return {
      iniciarActividad
    };
  })();