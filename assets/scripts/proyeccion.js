// Proyección Page JavaScript
// Manejo de filtros y carga de jugadores de proyección

// Datos de jugadores de proyección
const jugadoresProyeccion = {
    'liga-expansion': [],
    'premiere': [],
    'tdp': []
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
    inicializarFiltros();
    cargarJugadores();
});

// Función para inicializar los filtros
function inicializarFiltros() {
    const filtros = document.querySelectorAll('.filtro-menu-btn');

    filtros.forEach(filtro => {
        filtro.addEventListener('click', function () {
            // Remover clase active de todos los filtros
            filtros.forEach(f => f.classList.remove('active'));

            // Agregar clase active al filtro clickeado
            this.classList.add('active');

            // Obtener la categoría seleccionada
            const categoria = this.getAttribute('data-categoria');

            // Filtrar jugadores
            filtrarJugadores(categoria);
        });
    });
}

// Función para filtrar jugadores
function filtrarJugadores(categoria) {
    const categorias = document.querySelectorAll('.categoria-jugadores');
    const noJugadores = document.getElementById('no-jugadores');

    if (categoria === 'todas') {
        // Mostrar todas las categorías
        categorias.forEach(cat => {
            cat.classList.remove('hidden');
            cat.style.display = 'block';
        });
        noJugadores.style.display = 'none';
    } else {
        // Ocultar todas las categorías
        categorias.forEach(cat => {
            cat.classList.add('hidden');
            cat.style.display = 'none';
        });

        // Mostrar solo la categoría seleccionada
        const categoriaSeleccionada = document.querySelector(`.categoria-jugadores[data-categoria="${categoria}"]`);
        if (categoriaSeleccionada) {
            categoriaSeleccionada.classList.remove('hidden');
            categoriaSeleccionada.style.display = 'block';

            // Verificar si hay jugadores en esta categoría
            const grid = categoriaSeleccionada.querySelector('.jugadores-grid');
            if (grid && grid.children.length === 0) {
                noJugadores.style.display = 'block';
            } else {
                noJugadores.style.display = 'none';
            }
        } else {
            // Si no se encuentra la categoría, mostrar mensaje
            noJugadores.style.display = 'block';
        }
    }

    // Scroll suave hacia la sección de jugadores
    setTimeout(() => {
        const proyeccionSection = document.querySelector('.proyeccion-section');
        if (proyeccionSection) {
            proyeccionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// Función para cargar jugadores en el grid
function cargarJugadores() {
    // Cargar jugadores de Liga Expansión
    cargarJugadoresCategoria('liga-expansion', jugadoresProyeccion['liga-expansion']);

    // Cargar jugadores de Liga Premier
    cargarJugadoresCategoria('premiere', jugadoresProyeccion['premiere']);

    // Cargar jugadores de Liga TDP
    cargarJugadoresCategoria('tdp', jugadoresProyeccion['tdp']);
}

// Función para cargar jugadores de una categoría específica
function cargarJugadoresCategoria(categoria, jugadores) {
    const gridId = `jugadores-${categoria === 'liga-expansion' ? 'expansion' : categoria}`;
    const grid = document.getElementById(gridId);

    if (!grid) return;

    // Limpiar el grid
    grid.innerHTML = '';

    if (jugadores.length === 0) {
        // No hay jugadores en esta categoría
        return;
    }

    // Crear cards para cada jugador
    jugadores.forEach(jugador => {
        const card = crearCardJugador(jugador);
        grid.appendChild(card);
    });
}

// Función para crear el card de un jugador
function crearCardJugador(jugador) {
    const card = document.createElement('div');
    card.className = 'jugador-proyeccion-card';

    // Determinar el nombre de la categoría para el badge
    let categoriaNombre = '';
    let categoriaClass = '';
    switch (jugador.categoria) {
        case 'expansion':
            categoriaNombre = 'Liga Expansión';
            categoriaClass = 'expansion';
            break;
        case 'premiere':
            categoriaNombre = 'Liga Premier';
            categoriaClass = 'premiere';
            break;
        case 'tdp':
            categoriaNombre = 'Liga TDP';
            categoriaClass = 'tdp';
            break;
    }

    // Imagen del jugador con fallback
    const imagenSrc = jugador.imagen || '../assets/Alebrijes Teotihuacan.png';
    const equipoLogoSrc = jugador.equipoLogo || '../assets/Alebrijes Teotihuacan.png';

    card.innerHTML = `
        <div class="jugador-proyeccion-image">
            <img src="${imagenSrc}" alt="${jugador.nombre}" 
                 onerror="this.src='../assets/Alebrijes Teotihuacan.png';">
            <div class="jugador-proyeccion-badge">${categoriaNombre}</div>
        </div>
        <div class="jugador-proyeccion-info">
            <h3 class="jugador-proyeccion-nombre">${jugador.nombre}</h3>
            <p class="jugador-proyeccion-posicion">${jugador.posicion}</p>
            <div class="jugador-proyeccion-equipo">
                <img src="${equipoLogoSrc}" alt="${jugador.equipo}" 
                     class="jugador-proyeccion-equipo-logo"
                     onerror="this.src='../assets/Alebrijes Teotihuacan.png';">
                <span class="jugador-proyeccion-equipo-nombre">${jugador.equipo}</span>
            </div>
            <span class="jugador-proyeccion-categoria ${categoriaClass}">${categoriaNombre}</span>
        </div>
    `;

    return card;
}

// Función para agregar un nuevo jugador (útil para futuras actualizaciones)
function agregarJugador(categoria, jugador) {
    if (jugadoresProyeccion[categoria]) {
        jugadoresProyeccion[categoria].push(jugador);
        cargarJugadoresCategoria(categoria, jugadoresProyeccion[categoria]);
    }
}

// Exportar funciones si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        agregarJugador,
        jugadoresProyeccion
    };
}

