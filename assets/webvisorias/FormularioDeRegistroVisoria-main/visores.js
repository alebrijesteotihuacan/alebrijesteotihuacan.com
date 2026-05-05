// ==========================================
// VISORES - ALEBRIJES DE OAXACA
// Script para la página de visores
// ==========================================

// ==================
// INICIALIZACIÓN
// ==================
document.addEventListener('DOMContentLoaded', () => {
  console.log('👁️ Página de Visores cargada');
  inicializarPagina();
});

function inicializarPagina() {
  configurarMenu();
  agregarAnimaciones();
}

// ==================
// MENÚ LATERAL
// ==================
function configurarMenu() {
  const btnAbrirMenu = document.getElementById('btnAbrirMenu');
  const btnCerrarMenu = document.getElementById('btnCerrarMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuLateral = document.getElementById('menuLateral');
  
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

  // Cerrar menú con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuLateral && menuLateral.classList.contains('active')) {
      cerrarMenu();
    }
  });
}

function abrirMenu() {
  const menu = document.getElementById('menuLateral');
  const overlay = document.getElementById('menuOverlay');
  
  if (menu) {
    menu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }
  if (overlay) {
    overlay.classList.add('active');
  }
}

function cerrarMenu() {
  const menu = document.getElementById('menuLateral');
  const overlay = document.getElementById('menuOverlay');
  
  if (menu) {
    menu.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll del body
  }
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// ==================
// ANIMACIONES
// ==================
function agregarAnimaciones() {
  // Intersection Observer para animaciones al hacer scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Animar las tarjetas de visores
  const cards = document.querySelectorAll('.caso-card');
  cards.forEach((card, index) => {
    // Estado inicial
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    
    // Observar para animar
    observer.observe(card);
  });

  // Animar stats boxes
  const statBoxes = document.querySelectorAll('.stat-box');
  statBoxes.forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(20px)';
    box.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    observer.observe(box);
  });

  // Efecto hover suave en las tarjetas
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
}

// ==================
// EFECTOS ADICIONALES
// ==================

// Efecto parallax sutil en el hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.exito-hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Contador animado para las estadísticas
function animarContadores() {
  const numeros = document.querySelectorAll('.stat-box .numero');
  
  numeros.forEach(numero => {
    const valorFinal = numero.textContent;
    const esNumero = /^\d+/.test(valorFinal);
    
    if (esNumero) {
      const valorNumerico = parseInt(valorFinal);
      let valorActual = 0;
      const incremento = valorNumerico / 50;
      const sufijo = valorFinal.replace(/^\d+/, '');
      
      const intervalo = setInterval(() => {
        valorActual += incremento;
        if (valorActual >= valorNumerico) {
          numero.textContent = valorNumerico + sufijo;
          clearInterval(intervalo);
        } else {
          numero.textContent = Math.floor(valorActual) + sufijo;
        }
      }, 30);
    }
  });
}

// Observar cuando las stats entran en viewport para iniciar animación
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animarContadores();
    }
  });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  statsObserver.observe(statsGrid);
}

// ==================
// SMOOTH SCROLL
// ==================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================
// UTILIDADES
// ==================

// Detectar si el usuario está en mobile
function esMobile() {
  return window.innerWidth <= 768;
}

// Log de eventos para debugging (remover en producción)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Modo desarrollo activado');
  
  // Log de clicks en el menú
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      console.log('📍 Navegando a:', e.target.textContent.trim());
    });
  });
}

// ==================
// MANEJO DE ERRORES
// ==================
window.addEventListener('error', (e) => {
  console.error('❌ Error capturado:', e.message);
});

// ==================
// OPTIMIZACIÓN DE RENDIMIENTO
// ==================

// Debounce para eventos de scroll y resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimizar scroll events
const handleScroll = debounce(() => {
  // Código de scroll optimizado
}, 10);

window.addEventListener('scroll', handleScroll);

// Lazy loading de imágenes (si se agregan imágenes reales)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==================
// ACCESIBILIDAD
// ==================

// Manejo de foco para el menú lateral
const menuLateral = document.getElementById('menuLateral');
if (menuLateral) {
  const elementosFocusables = menuLateral.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  menuLateral.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const primerElemento = elementosFocusables[0];
      const ultimoElemento = elementosFocusables[elementosFocusables.length - 1];

      if (e.shiftKey && document.activeElement === primerElemento) {
        e.preventDefault();
        ultimoElemento.focus();
      } else if (!e.shiftKey && document.activeElement === ultimoElemento) {
        e.preventDefault();
        primerElemento.focus();
      }
    }
  });
}

// ==================
// EXPORTAR FUNCIONES GLOBALES
// ==================
window.abrirMenu = abrirMenu;
window.cerrarMenu = cerrarMenu;

console.log('✅ Página de Visores completamente inicializada');