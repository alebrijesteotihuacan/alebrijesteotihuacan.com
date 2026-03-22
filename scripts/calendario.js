/* Calendario JS */

// Mapeo de nombres de equipos a sus logos
const teamLogos = {
    'Alebrijes Teotihuacán': '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
    'Bombarderos de Tecámac FC': '../assets/EquiposGrupo9_LigaTDP/BombarderosDeTecamacFC.png',
    'Bombarderos de Tecamac FC': '../assets/EquiposGrupo9_LigaTDP/BombarderosDeTecamacFC.png',
    'Pachuca': '../assets/EquiposGrupo9_LigaTDP/Pachuca.png',
    'Club Hidalguense': '../assets/EquiposGrupo9_LigaTDP/ClubHidalguense.png',
    'Héroes de Zaci Hidalgo': '../assets/EquiposGrupo9_LigaTDP/HeroesDeZaciFC.png',
    'Milenarios de Oaxaca': '../assets/EquiposGrupo9_LigaTDP/MilenariosOaxaca.png',
    'Sk Sport Street Soccer FC': '../assets/EquiposGrupo9_LigaTDP/SKStreetSoccer.png',
    'Lonsdaleíta FC': '../assets/EquiposGrupo9_LigaTDP/LonsdaleitaFC.png',
    'ATLÉTICO TOLTECAS F.C.': '../assets/EquiposGrupo9_LigaTDP/AtleticoToltecas.png',
    'Halcones Negros F.C.': '../assets/EquiposGrupo9_LigaTDP/HalconesNegros.png',
    'Tuzos Pachuca': '../assets/EquiposGrupo9_LigaTDP/UFD.png',
    'CEFOR 3030': '../assets/EquiposGrupo9_LigaTDP/CEFOR3030.png',
    'Club Deportivo Muxes': '../assets/EquiposGrupo9_LigaTDP/ClubMuxes.png',
    'Club Deportivo Matamoros': '../assets/EquiposGrupo9_LigaTDP/ClubDeportivoMatamoros.png',
    'Águilas de Teotihuacán': '../assets/EquiposGrupo9_LigaTDP/AguilasTeotihuacan.png',
    'Atlético Huejutla': '../assets/EquiposGrupo9_LigaTDP/AtleticoHuejutla.png'
};

// Función para obtener el logo de un equipo
function getTeamLogo(teamName) {
    return teamLogos[teamName] || null;
}

// Función para agregar logos a las celdas de equipos
function addTeamLogos() {
    const teamCells = document.querySelectorAll('.team-cell');
    
    teamCells.forEach(cell => {
        const teamName = cell.textContent.trim();
        const logoPath = getTeamLogo(teamName);
        
        if (logoPath && !cell.querySelector('img')) {
            const img = document.createElement('img');
            img.src = logoPath;
            img.alt = teamName;
            img.className = 'team-logo-calendar';
            img.onerror = function() {
                this.style.display = 'none';
            };
            
            // Insertar la imagen al inicio de la celda
            cell.insertBefore(img, cell.firstChild);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const jornadaFilter = document.getElementById('jornada-filter');
    const equipoFilter = document.getElementById('equipo-filter');
    const fechaFilter = document.getElementById('fecha-filter');
    const searchFilter = document.getElementById('search-filter');
    const matchesTbody = document.getElementById('matches-tbody');
    const matchRows = document.querySelectorAll('.match-row');
    const noResultsMessage = document.getElementById('no-results-message');
    
    // Fecha actual: 20 de diciembre de 2024
    const today = new Date('2024-12-20');
    today.setHours(0, 0, 0, 0);
    
    // Clasificar partidos como pasados o próximos
    function classifyMatches() {
        matchRows.forEach(row => {
            const fechaStr = row.getAttribute('data-fecha');
            if (!fechaStr) return;
            
            const matchDate = new Date(fechaStr);
            matchDate.setHours(0, 0, 0, 0);
            
            // Remover clases previas (excepto si ya tiene la clase 'past' desde HTML)
            if (!row.classList.contains('past')) {
                row.classList.remove('upcoming');
            }
            
            // Si ya tiene clase 'past' desde HTML (torneo Apertura), mantenerla
            if (row.classList.contains('past')) {
                return;
            }
            
            // Si tiene resultado (no es "-"), es pasado
            const scoreCell = row.querySelector('.score-cell');
            const hasResult = scoreCell && scoreCell.textContent.trim() !== '-' && !scoreCell.textContent.trim().includes('VS');
            
            if (hasResult || matchDate < today) {
                row.classList.add('past');
                row.classList.remove('upcoming');
            } else {
                row.classList.add('upcoming');
                row.classList.remove('past');
            }
        });
    }
    
    // Función de filtrado
    function filterMatches() {
        const jornadaValue = jornadaFilter.value;
        const equipoValue = equipoFilter.value;
        const fechaValue = fechaFilter.value;
        const searchValue = searchFilter.value.toLowerCase().trim();
        
        let visibleCount = 0;
        
        matchRows.forEach(row => {
            let show = true;
            
            // Filtro por jornada
            if (jornadaValue !== 'all') {
                const jornada = row.getAttribute('data-jornada');
                if (jornada !== jornadaValue) {
                    show = false;
                }
            }
            
            // Filtro por equipo (local/visitante)
            if (show && equipoValue !== 'all') {
                const equipo = row.getAttribute('data-equipo');
                if (equipo !== equipoValue) {
                    show = false;
                }
            }
            
            // Filtro por fecha
            if (show && fechaValue) {
                const matchFecha = row.getAttribute('data-fecha');
                if (matchFecha !== fechaValue) {
                    show = false;
                }
            }
            
            // Filtro por búsqueda
            if (show && searchValue) {
                const searchData = row.getAttribute('data-search').toLowerCase();
                if (!searchData.includes(searchValue)) {
                    show = false;
                }
            }
            
            // Mostrar/ocultar fila
            if (show) {
                row.classList.remove('hidden');
                visibleCount++;
            } else {
                row.classList.add('hidden');
            }
        });
        
        // Mostrar/ocultar mensaje de no resultados
        if (visibleCount === 0) {
            noResultsMessage.style.display = 'block';
            document.querySelector('.calendar-table').style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            document.querySelector('.calendar-table').style.display = 'table';
        }
        
        // Agregar logos a las filas visibles
        setTimeout(() => {
            addTeamLogos();
        }, 100);
    }
    
    // Event listeners para filtros
    jornadaFilter.addEventListener('change', filterMatches);
    equipoFilter.addEventListener('change', filterMatches);
    fechaFilter.addEventListener('input', filterMatches);
    searchFilter.addEventListener('input', filterMatches);
    
    // Limpiar filtro de fecha
    fechaFilter.addEventListener('change', function() {
        if (!this.value) {
            filterMatches();
        }
    });
    
    // Clasificar partidos al cargar
    classifyMatches();
    
    // Aplicar filtros iniciales
    filterMatches();
    
    // Agregar logos de equipos
    addTeamLogos();
    
    console.log('Calendario cargado - Partidos clasificados');
});
