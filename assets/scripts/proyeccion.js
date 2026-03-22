// Proyección Page JavaScript
// Manejo de filtros y carga de jugadores de proyección

// Datos de jugadores de proyección
const jugadoresProyeccion = {
    'liga-expansion': [
        {
            nombre: 'Emiliano Espinoza Sánchez',
            posicion: 'Jugador',
            equipo: 'Atlante FC',
            equipoLogo: '../assets/LigaExpansiónMX.png',
            imagen: '../assets/JugadoresProyección/Emiliano_Espinoza_Sánchez_AtlanteFC.jpg',
            categoria: 'expansion'
        }
    ],
    'premiere': [
        {
            nombre: 'Alejandro Itzcoatl Alcala Pineda',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga Premier',
            equipoLogo: '../assets/LigaPremiereMX.png',
            imagen: '../assets/JugadoresProyección/Alejandro_Itzcoatl_Alcala_Pineda_LigaPremier.jpg',
            categoria: 'premiere'
        },
        {
            nombre: 'César Alfonso May Castañeda',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga Premier',
            equipoLogo: '../assets/LigaPremiereMX.png',
            imagen: '../assets/JugadoresProyección/César_Alfonso_May_Castañeda_LigaPremier.jpg',
            categoria: 'premiere'
        },
        {
            nombre: 'Diego Sahid Martínez Barragán',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga Premier',
            equipoLogo: '../assets/LigaPremiereMX.png',
            imagen: '../assets/JugadoresProyección/Diego_Sahid_Martínez_Barragán_LigaPremier.jpg',
            categoria: 'premiere'
        },
        {
            nombre: 'Hermes Hernández Grageda',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga Premier',
            equipoLogo: '../assets/LigaPremiereMX.png',
            imagen: '../assets/JugadoresProyección/Hermes_Hernández_Grageda_LigaPremier.jpg',
            categoria: 'premiere'
        },
        {
            nombre: 'Jamin Isaac Reyes Reyes',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga Premier',
            equipoLogo: '../assets/LigaPremiereMX.png',
            imagen: '../assets/JugadoresProyección/Jamin_Isaac_Reyes_Reyes_LigaPremier.jpg',
            categoria: 'premiere'
        },
        {
            nombre: 'Jose Daniel Aguilar Sanchez',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga Premier',
            equipoLogo: '../assets/LigaPremiereMX.png',
            imagen: '../assets/JugadoresProyección/Jose_Daniel_Aguilar_Sanchez_LigaPremier.jpg',
            categoria: 'premiere'
        },
        {
            nombre: 'Josue Muñoz Miranda',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga Premier',
            equipoLogo: '../assets/LigaPremiereMX.png',
            imagen: '../assets/JugadoresProyección/Josue_Muñoz_Miranda_LigaPremier.jpg',
            categoria: 'premiere'
        }
    ],
    'tdp': [
        {
            nombre: 'Alan Faryd Alvarado Cruz',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/Alan_Faryd_Alvarado_Cruz_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'Alexis Palacios Camacho',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/Alexis_Palacios_Camacho_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'César Octavio Tinoco Santos',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/César_Octavio_Tinoco_Santos_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'Daniel Alejandro Toache Juárez',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/Daniel_Alejandro_Toache_Juárez_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'David Guadalupe Romo León',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/David_Guadalupe_Romo_León_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'Diego Armando Miranda Roman',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/Diego_Armando_Miranda_Roman_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'Francisco Jesús Paz Ortiz',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/Francisco_Jesús_Paz_Ortiz_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'Gabriel Alberto Garfias Banda',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/Gabriel_Alberto_Garfias_Banda_LigaTDP.jpg',
            categoria: 'tdp'
        },
        {
            nombre: 'José Luis Nares Orozco',
            posicion: 'Jugador',
            equipo: 'Equipo de Liga TDP',
            equipoLogo: '../assets/LigaTDP.png',
            imagen: '../assets/JugadoresProyección/José_Luis_Nares_Orozco_LigaTDP.jpg',
            categoria: 'tdp'
        }
    ]
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

