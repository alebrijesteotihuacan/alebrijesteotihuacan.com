// ==========================================
// CASOS DE ÉXITO - ALEBRIJES DE OAXACA
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🏆 Página de Casos de Éxito cargada');
  inicializarPagina();
});

function inicializarPagina() {
  configurarMenu();
  animarEstadisticas();
  animarTarjetas();
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
function animarEstadisticas() {
  const stats = document.querySelectorAll('.stat-box');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(20px)';
          
          requestAnimationFrame(() => {
            entry.target.style.transition = 'all 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          });
          
          animarNumero(entry.target);
        }, index * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  stats.forEach(stat => observer.observe(stat));
}

function animarNumero(elemento) {
  const numeroElement = elemento.querySelector('.numero');
  if (!numeroElement) return;
  
  const texto = numeroElement.textContent;
  const tieneSigno = texto.includes('+') || texto.includes('%');
  const numero = parseInt(texto.replace(/\D/g, ''));
  
  if (isNaN(numero)) return;
  
  const duracion = 2000;
  const pasos = 60;
  const incremento = numero / pasos;
  let actual = 0;
  
  const intervalo = setInterval(() => {
    actual += incremento;
    
    if (actual >= numero) {
      actual = numero;
      clearInterval(intervalo);
    }
    
    let textoFinal = Math.floor(actual).toString();
    
    if (tieneSigno) {
      if (texto.includes('+')) textoFinal += '+';
      if (texto.includes('%')) textoFinal += '%';
    }
    
    numeroElement.textContent = textoFinal;
  }, duracion / pasos);
}

function animarTarjetas() {
  const tarjetas = document.querySelectorAll('.caso-card');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          
          requestAnimationFrame(() => {
            entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          });
        }, index * 150);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  tarjetas.forEach(tarjeta => observer.observe(tarjeta));
}

// ==================
// INICIALIZAR ESTILOS PARA ANIMACIONES
// ==================
window.addEventListener('load', () => {
  const stats = document.querySelectorAll('.stat-box');
  stats.forEach(stat => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
  });
  
  const tarjetas = document.querySelectorAll('.caso-card');
  tarjetas.forEach(tarjeta => {
    tarjeta.style.opacity = '0';
    tarjeta.style.transform = 'translateY(30px)';
  });
});