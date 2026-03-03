// ==========================================
// ¿QUÉ ES UNA VISORIA? - ALEBRIJES DE OAXACA
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('❓ Página ¿Qué es una Visoria? cargada');
  inicializarPagina();
});

function inicializarPagina() {
  configurarMenu();
  animarTarjetas();
  animarPasos();

  // Fallback: asegurar que todo sea visible después de 3 segundos
  setTimeout(asegurarVisibilidad, 3000);
}

// Fallback para asegurar que todos los elementos sean visibles
function asegurarVisibilidad() {
  const elementos = document.querySelectorAll('.info-card, .proceso-step, .info-list-item');
  elementos.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

// ==================
// MENÚ LATERAL
// ==================
function configurarMenu() {
  const btnAbrirMenu = document.getElementById('btnAbrirMenu');
  const btnCerrarMenu = document.getElementById('btnCerrarMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  if (btnAbrirMenu) {
    btnAbrirMenu.addEventListener('click', (e) => {
      e.preventDefault();
      abrirMenu();
    });
  }

  if (btnCerrarMenu) {
    btnCerrarMenu.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarMenu();
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarMenu();
    });
  }
}

function abrirMenu() {
  const menu = document.getElementById('menuLateral');
  const overlay = document.getElementById('menuOverlay');

  if (menu) menu.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function cerrarMenu() {
  const menu = document.getElementById('menuLateral');
  const overlay = document.getElementById('menuOverlay');

  if (menu) menu.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

// ==================
// ANIMACIONES
// ==================
function animarTarjetas() {
  const tarjetas = document.querySelectorAll('.info-card');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  tarjetas.forEach(tarjeta => {
    tarjeta.style.opacity = '0';
    tarjeta.style.transform = 'translateY(30px)';
    tarjeta.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(tarjeta);
  });
}

function animarPasos() {
  const pasos = document.querySelectorAll('.proceso-step');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transition = 'all 0.5s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';

          // Animar el número del paso con un efecto especial
          const numeroStep = entry.target.querySelector('.step-numero');
          if (numeroStep) {
            setTimeout(() => {
              numeroStep.style.transform = 'scale(1.2)';
              setTimeout(() => {
                numeroStep.style.transform = 'scale(1)';
              }, 200);
            }, 300);
          }
        }, index * 150);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  pasos.forEach(paso => {
    paso.style.opacity = '0';
    paso.style.transform = 'translateX(-30px)';
    paso.style.transition = 'all 0.5s ease';
    observer.observe(paso);
  });
}

// ==================
// ANIMACIÓN DE ITEMS DE LISTA
// ==================
function animarListaItems() {
  const items = document.querySelectorAll('.info-list-item');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transition = 'all 0.4s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 80);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.4s ease';
    observer.observe(item);
  });
}

// ==================
// EFECTO HOVER EN NÚMEROS DE PASOS
// ==================
function configurarEfectosHover() {
  const stepNumeros = document.querySelectorAll('.step-numero');

  stepNumeros.forEach(numero => {
    numero.addEventListener('mouseenter', () => {
      numero.style.transform = 'scale(1.15) rotate(5deg)';
    });

    numero.addEventListener('mouseleave', () => {
      numero.style.transform = 'scale(1) rotate(0deg)';
    });
  });
}

// ==================
// INICIALIZAR ESTILOS PARA ANIMACIONES
// ==================
window.addEventListener('load', () => {
  // Agregar transición a los números de pasos
  const stepNumeros = document.querySelectorAll('.step-numero');
  stepNumeros.forEach(numero => {
    numero.style.transition = 'transform 0.3s ease';
  });

  // Iniciar animación de items después de un delay
  setTimeout(() => {
    animarListaItems();
    configurarEfectosHover();
  }, 500);
});