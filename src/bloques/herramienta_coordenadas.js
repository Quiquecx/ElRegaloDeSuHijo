/* =============================================================
   HERRAMIENTA DE DEPURACIÓN - COORDENADAS NIVEL 3
   Uso:
     1. Abrir el Nivel 3 en el navegador.
     2. Abrir la consola (F12).
     3. Escribir: HerramientaCoordenadas.activar()
     4. Hacer clic sobre la imagen para obtener coordenadas.
     5. Copiar y pegar en bloque03.js.
   ============================================================= */

   window.HerramientaCoordenadas = (function () {

    let escenaWrap = null;
    let capaPuntos = null;
    let activa = false;
  
    function activar() {
      escenaWrap = document.getElementById('n3-escena-wrap');
      capaPuntos = document.getElementById('n3-capa-puntos');
  
      if (!escenaWrap || !capaPuntos) {
        console.error('❌ No se encontró la escena del Nivel 3. ¿Ya estás en esa pantalla?');
        return;
      }
  
      if (activa) {
        console.warn('⚠️ La herramienta ya está activa.');
        return;
      }
  
      activa = true;
      capaPuntos.addEventListener('click', manejarClic);
  
      console.log('%c✅ Herramienta de coordenadas ACTIVADA', 'color: #52AE32; font-weight: bold; font-size: 14px;');
      console.log('%cHaz clic sobre la imagen. Las coordenadas aparecerán aquí.', 'color: #4054A1; font-size: 13px;');
      console.log('%cPara desactivar: HerramientaCoordenadas.desactivar()', 'color: #888; font-size: 11px;');
    }
  
    function desactivar() {
      if (capaPuntos) {
        capaPuntos.removeEventListener('click', manejarClic);
      }
      activa = false;
      console.log('%c❌ Herramienta DESACTIVADA', 'color: #D60D47; font-weight: bold;');
    }
  
    function manejarClic(evento) {
      // Ignorar clics en puntos ya existentes (n3-punto)
      if (evento.target.classList.contains('n3-punto')) return;
  
      const rect = escenaWrap.getBoundingClientRect();
      const x = evento.clientX - rect.left;
      const y = evento.clientY - rect.top;
  
      const xPorcentaje = parseFloat((x / rect.width).toFixed(4));
      const yPorcentaje = parseFloat((y / rect.height).toFixed(4));
  
      const coordenada = `{ x: ${xPorcentaje}, y: ${yPorcentaje} },`;
      console.log(`%c${coordenada}`, 'color: #4054A1; font-weight: bold; font-size: 14px; font-family: monospace;');
  
      crearPuntoVisual(xPorcentaje, yPorcentaje);
    }
  
    function crearPuntoVisual(x, y) {
      const anterior = document.getElementById('punto-temporal-debug');
      if (anterior) anterior.remove();
  
      const punto = document.createElement('div');
      punto.id = 'punto-temporal-debug';
      punto.style.position = 'absolute';
      punto.style.left = (x * 100) + '%';
      punto.style.top = (y * 100) + '%';
      punto.style.width = '22px';
      punto.style.height = '22px';
      punto.style.backgroundColor = 'rgba(214, 13, 71, 0.85)';
      punto.style.border = '3px solid white';
      punto.style.borderRadius = '50%';
      punto.style.transform = 'translate(-50%, -50%)';
      punto.style.pointerEvents = 'none';
      punto.style.zIndex = '9999';
      punto.style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
  
      capaPuntos.appendChild(punto);
  
      setTimeout(() => {
        if (punto.parentNode) punto.remove();
      }, 1800);
    }
  
    return { activar, desactivar };
  })();