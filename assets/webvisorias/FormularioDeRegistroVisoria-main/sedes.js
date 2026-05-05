// ==========================================
// SEDES EN LA REPÚBLICA - ALEBRIJES DE OAXACA
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('📍 Página de Sedes cargada');
  inicializarPagina();
});

function inicializarPagina() {
  configurarMenu();
  configurarMapaInteractivo();
  animarMapa();
  animarLeyenda();
}

// ==================
// MENÚ LATERAL
// ==================
function configurarMenu() {
  const btnAbrirMenu = document.getElementById('btnAbrirMenu');
  const btnCerrarMenu = document.getElementById('btnCerrarMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuLateral = document.getElementById('menuLateral');

  // Función helper para abrir
  const abrir = (e) => {
    if (e) e.preventDefault();
    if (menuLateral) menuLateral.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
  };

  // Función helper para cerrar
  const cerrar = (e) => {
    if (e) e.preventDefault();
    if (menuLateral) menuLateral.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
  };

  if (btnAbrirMenu) btnAbrirMenu.addEventListener('click', abrir);
  if (btnCerrarMenu) btnCerrarMenu.addEventListener('click', cerrar);
  if (menuOverlay) menuOverlay.addEventListener('click', cerrar);
}

// ==================
// MAPA INTERACTIVO
// ==================
function configurarMapaInteractivo() {
  const estados = document.querySelectorAll('.estado');
  const tooltip = document.getElementById('tooltip');

  if (!tooltip) return;

  // Referencias a los elementos dentro del tooltip
  const tooltipEstado = document.getElementById('tooltip-estado');
  const tooltipVisorias = document.getElementById('tooltip-visorias');

  estados.forEach(estado => {
    // 1. Hover (MouseEnter)
    estado.addEventListener('mouseenter', (e) => {
      const estadoNombre = estado.dataset.estado;
      const visorias = estado.dataset.visorias;
      const tieneVisoria = estado.classList.contains('con-visoria');

      // Mostrar el tooltip
      tooltip.classList.add('active');

      if (tieneVisoria) {
        // Estado con visoría
        tooltip.classList.remove('proximamente');
        if (tooltipEstado) tooltipEstado.textContent = estadoNombre;

        if (tooltipVisorias) {
          tooltipVisorias.textContent = `${visorias} visorías realizadas`;
          tooltipVisorias.classList.remove('proximamente');
        }
      } else {
        // Estado sin visoría (Próximamente)
        tooltip.classList.add('proximamente');
        if (tooltipEstado) tooltipEstado.textContent = estadoNombre;

        if (tooltipVisorias) {
          tooltipVisorias.textContent = 'Próximamente';
          tooltipVisorias.classList.add('proximamente');
        }
      }
    });

    // 2. Movimiento (MouseMove)
    estado.addEventListener('mousemove', (e) => {
      if (tooltip.classList.contains('active')) {
        // Posicionar el tooltip cerca del cursor
        const x = e.clientX;
        const y = e.clientY;

        // Ajuste para que no quede debajo del cursor
        tooltip.style.left = (x + 15) + 'px';
        tooltip.style.top = (y + 15) + 'px';
      }
    });

    // 3. Salir (MouseLeave)
    estado.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });

    // 4. Click - PREVENIR CUALQUIER ACCIÓN
    // El usuario solicitó explícitamente: "no debe de moverse ni pasar nada"
    estado.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // No hacemos nada más (ni transform, ni escala)
    });
  });
}

// ==================
// ANIMACIÓN DEL MAPA (Entrance)
// ==================
function animarMapa() {
  const mapa = document.querySelector('.mapa-svg');
  if (!mapa) return;

  const observerOptions = { threshold: 0.3 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Seleccionamos los estados con visoría para animar su opacidad/color
        const estadosConVisoria = document.querySelectorAll('.estado.con-visoria');

        // Inicialmente asegúrate de que tengan opacidad para animar
        estadosConVisoria.forEach(est => est.style.opacity = '0');

        estadosConVisoria.forEach((estado, index) => {
          setTimeout(() => {
            estado.style.transition = 'opacity 0.5s ease';
            estado.style.opacity = '1';
          }, index * 50);
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(mapa);
}

// ==================
// ANIMACIÓN LEYENDA (Entrance)
// ==================
function animarLeyenda() {
  const leyenda = document.querySelector('.leyenda');
  if (!leyenda) return;

  const observerOptions = { threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.leyenda-item');

        // Estado inicial para animar
        items.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
        });

        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, index * 200);
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(leyenda);
}