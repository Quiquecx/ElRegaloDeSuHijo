/* =============================================================
   MAIN.JS - Controlador general del juego
   "El regalo de ser su hijo" - 3° preescolar
   Portada -> Nivel 1 (recta numérica)
            -> Nivel 2 (¿está bien o está mal?)
            -> Nivel 3 (cuenta los regalos)
   ============================================================= */

   (function () {

    /* -------------------- Rutas de audio -------------------- */
  
    const AUDIO = {
      // Efectos generales (bien/mal)
      bien: 'src/sonidos/sounds/buena.mp3',
      mal: 'src/sonidos/sounds/mala.mp3',
  
      // Narraciones
      n1Inicio: 'src/sonidos/nivel1/inicio_nivel1.mp3',
      n1Final: 'src/sonidos/nivel1/final_nivel1.mp3',
  
      n2Inicio: 'src/sonidos/nivel2/inicio_nivel2.mp3',
      n2Final: 'src/sonidos/nivel2/final_nivel2.mp3',
  
      n3Inicio: 'src/sonidos/nivel3/inicio_nivel3.mp3',
      n3Final: 'src/sonidos/nivel3/final_nivel3.mp3'
    };
  
    /* -------------------- Navegación de pantallas -------------------- */
  
    function mostrarPantalla(id) {
      document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    }
  
    /* -------------------- Confeti sencillo -------------------- */
  
    function lanzarConfeti() {
      const emojis = ['🎉', '✨', '🌟', '💛', '🎁'];
      for (let i = 0; i < 16; i++) {
        const span = document.createElement('span');
        span.className = 'confeti';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
        span.style.animationDelay = (Math.random() * 0.4) + 's';
        document.body.appendChild(span);
        setTimeout(() => span.remove(), 3200);
      }
    }
  
    /* -------------------- Estado Nivel 1 -------------------- */
  
    function iniciarNivel1() {
      const progresoEl = document.getElementById('n1-progreso');
  
      Bloque1.iniciarActividad({
        onProgress: (ronda, totalRondas) => {
          progresoEl.textContent = `Ronda ${ronda + 1}/${totalRondas}`;
        },
        onColocar: (numero) => {
          // ✅ Sonido de acierto al colocar un número correctamente
          Sonido.reproducirEfecto(AUDIO.bien);
        },
        onError: () => {
          // ❌ Sonido de error al tocar un número que no corresponde
          Sonido.reproducirEfecto(AUDIO.mal);
        },
        onRondaCompleta: () => {
          lanzarConfeti();
        },
        onComplete: () => {
          lanzarConfeti();
          Sonido.reproducirNarracion(AUDIO.n1Final);
          setTimeout(() => {
            mostrarPantalla('screen-nivel1-outro');
          }, 600);
        }
      });
    }
  
    /* -------------------- Estado Nivel 2 -------------------- */
  
    function iniciarNivel2() {
      const progresoEl = document.getElementById('n2-progreso');
  
      Bloque2.iniciarActividad({
        onProgress: (indice, total) => {
          progresoEl.textContent = `Acción ${indice + 1}/${total}`;
        },
        onRespuesta: (esCorrecta) => {
          // ✅ o ❌ según la respuesta del usuario
          if (esCorrecta) {
            Sonido.reproducirEfecto(AUDIO.bien);
          } else {
            Sonido.reproducirEfecto(AUDIO.mal);
          }
        },
        onComplete: (puntaje, total) => {
          const emojiEl = document.getElementById('n2-resultado-emoji');
          const puntajeEl = document.getElementById('n2-resultado-puntaje');
  
          emojiEl.textContent = puntaje >= total * 0.7 ? '🌟' : '🌱';
          puntajeEl.textContent = `Acertaste ${puntaje} de ${total}`;
  
          lanzarConfeti();
          Sonido.reproducirNarracion(AUDIO.n2Final);
          mostrarPantalla('screen-nivel2-resultado');
        }
      });
    }
  
    /* -------------------- Estado Nivel 3 -------------------- */
  
    function iniciarNivel3() {
      const progresoEl = document.getElementById('n3-progreso');
  
      Bloque3.iniciarActividad({
        onProgress: (indice, total) => {
          progresoEl.textContent = `Pregunta ${indice + 1}/${total}`;
        },
        onRespuesta: (esCorrecta) => {
          // ✅ o ❌ según la respuesta del usuario
          if (esCorrecta) {
            Sonido.reproducirEfecto(AUDIO.bien);
          } else {
            Sonido.reproducirEfecto(AUDIO.mal);
          }
        },
        onComplete: () => {
          lanzarConfeti();
          Sonido.reproducirNarracion(AUDIO.n3Final);
          setTimeout(() => {
            mostrarPantalla('screen-final');
            lanzarConfeti();
          }, 900);
        }
      });
    }
  
    /* -------------------- Eventos de botones -------------------- */
  
    // 👉 Ahora los audios de inicio se reproducen al entrar a las
    //    pantallas de BIENVENIDA (donde está el texto narrado).
  
    document.getElementById('btn-jugar').addEventListener('click', () => {
      Sonido.reproducirNarracion(AUDIO.n1Inicio);
      mostrarPantalla('screen-nivel1-intro');
    });
  
    document.getElementById('btn-como-jugar').addEventListener('click', () => {
      mostrarPantalla('screen-como-jugar');
    });
  
    document.getElementById('btn-volver-portada').addEventListener('click', () => {
      Sonido.detenerNarracion();
      mostrarPantalla('screen-portada');
    });
  
    document.getElementById('btn-empezar-nivel1').addEventListener('click', () => {
      Sonido.detenerNarracion(); // Detener el audio de la bienvenida al empezar
      mostrarPantalla('screen-nivel1-game');
      iniciarNivel1();
    });
  
    document.getElementById('btn-ir-nivel2').addEventListener('click', () => {
      Sonido.reproducirNarracion(AUDIO.n2Inicio);
      mostrarPantalla('screen-nivel2-intro');
    });
  
    document.getElementById('btn-empezar-nivel2').addEventListener('click', () => {
      Sonido.detenerNarracion();
      mostrarPantalla('screen-nivel2-game');
      iniciarNivel2();
    });
  
    document.getElementById('btn-ir-nivel3').addEventListener('click', () => {
      Sonido.reproducirNarracion(AUDIO.n3Inicio);
      mostrarPantalla('screen-nivel3-intro');
    });
  
    document.getElementById('btn-empezar-nivel3').addEventListener('click', () => {
      Sonido.detenerNarracion();
      mostrarPantalla('screen-nivel3-game');
      iniciarNivel3();
    });
  
    document.getElementById('btn-volver-inicio').addEventListener('click', () => {
      Sonido.detenerNarracion();
      mostrarPantalla('screen-portada');
    });
  
    /* -------------------- Inicio -------------------- */
  
    mostrarPantalla('screen-portada');
  
  })();