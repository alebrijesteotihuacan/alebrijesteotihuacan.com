/* 
   Alebrijes de Oaxaca Teotihuacán
   Liga TDP Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {
    // Menu Navigation
    const menuButtons = document.querySelectorAll('.ligatdp-menu-btn');
    const contentSections = document.querySelectorAll('.ligatdp-content-section');

    // SVG icons for the meta section (date, venue) - must be defined before
    // any init function is called, otherwise ReferenceError (TDZ) on first use.
    const RESULT_META_ICONS = {
        calendar: `<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>`,
        location: `<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>`
    };

    // Initialize menu
    initMenuNavigation();

    // Initialize sections
    initPlantilla();
    initResultados();
    initNoticias();

    // Check URL hash on load to switch section
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const targetBtn = document.querySelector(`.ligatdp-menu-btn[data-section="${hash}"]`);
        if (targetBtn) {
            setTimeout(() => targetBtn.click(), 150);
        }
    }

    // Menu Navigation Handler
    function initMenuNavigation() {
        menuButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.getAttribute('data-section');

                // Remove active from all buttons and sections
                menuButtons.forEach(btn => btn.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));

                // Add active to clicked button and corresponding section
                button.classList.add('active');
                const section = document.getElementById(`section-${targetSection}`);
                if (section) {
                    section.classList.add('active');
                }

                // Scroll to section smoothly
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            });
        });
    }

    // Section 1: Plantilla de Jugadores
    // 4 categorías (equipos), buscador, agrupado por posición dentro de cada equipo.
    function initPlantilla() {
        const section = document.getElementById('section-plantilla');
        if (!section) return;

        // URLs de perfil de jugador (ligatdp.mx). Vacío por ahora.
        const playerProfiles = {};

        // Archivos de la plantilla actual de Liga TDP.
        // Formato: Name_Position_Number.jpg  | DT: Name_DirectorTecnico.jpg
        const FOLDER_ALEBRIJES      = 'PlantillaAlebrijesTeotihuacanLigaTDP';
        const FOLDER_SOLES          = 'PlantillaSolesTeotihuacanLigaTDP';
        const FOLDER_ALEBRIJES_SUB16 = 'PlantillaAlebrijesTeotihuacanSub-16_TDP';

        const playerFilesAlebrijes = [
            // Director Técnico
            'Rafael_Arturo_Tejeda_Arellano_DirectorTecnico.jpg',

            // Porteros
            'Roberto_Alcantar_Piña_Portero_1.jpg',
            'Joshua_Alejo_Hernández_Portero_12.jpg',
            'Miguel_Angel_Rodriguez_Luna_Portero_25.jpg',

            // Defensas
            'Luis_Jareth_Dominguez_Meza_Defensa_2.jpg',
            'Deivid_Antony_Fuentes_Acevedo_Defensa_3.jpg',
            'José_Luis_Tavares_Torres_Defensa_4.jpg',
            'Angel_Uriel_Castillo_Ramirez_Defensa_5.jpg',
            'Jose_Julian_Linares_Mendoza_Defensa_13.jpg',
            'Gerardo_Gael_Uribe_Ponce_Defensa_14.jpg',
            'Iram_Habid_Barrientos_Garcia_Defensa_15.jpg',
            'Juan_Ramírez_Bautista_Defensa_16.jpg',
            'Diego_Luna_Librado_Defensa_17.jpg',

            // Mediocampistas
            'Jesus_Miguel_Xolio_Ortiz_Medio_6.jpg',
            'Felix_Eduardo_Martinez_Contreras_Medio_7.jpg',
            'Miguel_Ángel_Sánchez_Dionisio_Medio_8.jpg',
            'Jorge_Eduardo_Santiago_Reyes_Medio_10.jpg',
            'Bayron_Mishell_Mateos_Martínez_Medio_11.jpg',
            'Demian_Marcus_Arregui_Nava_Medio_18.jpg',
            'Alejandro_Yoed_Espíritu_Hernández_Medio_19.jpg',
            'Ignacio_Hazzam_Dominguez_Cruz_Medio_21.jpg',
            'Brandon_Uziel_Moya_Marquez_Medio_22.jpg',
            'Abdiel_Monroy_Garcia_Medio_23.jpg',
            'Noé_Miguel_Estefes_Medio_24.jpg',
            'Luis_Esteban_Radilla_Moreno_Medio_26.jpg',
            'Henry_Ruben_Hernandez_Cisneros_Medio_30.jpg',
            'William_Alfredo_Turrubiates_Camacho_Medio_31.jpg',

            // Delanteros
            'Diego_Ivan_Ramirez_Gonzalez_Delantero_9.jpg',
            'Alexis_Eduardo_Cagal_Cruz_Delantero_20.jpg',
            'Cesar_Alexis_Varela_Castillo_Delantero_27.jpg',
            'Franco_Luciano_Cruz_Benitez_Delantero_28.jpg',
            'Oscar_Gabriel_Ortega_Ramos_Delantero_29.jpg',
            'Iker_Castillo_Tede_Delantero_32.jpg'
        ];

        const playerFilesSoles = [
            // Director Técnico
            'Ignacio_Morales_Campos_DirectorTecnico.jpg',

            // Porteros
            'Mauricio_Fuentes_Ramos_Portero_1.jpg',
            'Steve_Julian_Serrano_Luevanos_Portero_12.jpg',
            'Julio_Axel_Delgado_Estrada_Portero_13.jpg',
            'Cesar_Alexander_Hernandez_Zacarias_Portero_25.jpg',
            'Samuel_Alexander_Hernandez_Romero_Portero_28.jpg',

            // Defensas
            'Jaffet_Sandoval_Martinez_Defensa_2.jpg',
            'Ian_Alexander_Garcia_Martinez_Defensa_3.jpg',
            'Farid_Omar_Avendaño_Vazquez_Defensa_4.jpg',
            'Lisandro_Alain_Contreras_Dorantes_Defensa_20.jpg',
            'Julio_César_Gutiérrez_Díaz_Defensa_21.jpg',
            'Angel_David_Sanchez_Jimenez_Defensa_24.jpg',
            'Johan_Ivan_Robles_Cid_Defensa_27.jpg',
            'Jesus_Esteban_Ricardez_Zarate_Defensa_29.jpg',
            'Fabricio_Santiago_Del_Angel_Defensa_30.jpg',
            'Ricardo_Rodriguez_Montiel_Defensa_31.jpg',

            // Mediocampistas
            'Faviel_Isidro_Morales_Perez_Medio_5.jpg',
            'Kevin_Alexander_Castro_Aguilar_Medio_6.jpg',
            'Jose_Luis_Ruiz_Maldonado_Medio_7.jpg',
            'Oliver_De_Jesus_Morales_Moreno_Medio_8.jpg',
            'Cristian_Fabian_Ramirez_Martinez_Medio_10.jpg',
            'Mauricio_Luna_Sanchez_Medio_11.jpg',
            'Ellioth_Omar_Cuevas_Alcala_Medio_14.jpg',
            'Jonathan_Darío_Galindo_Guerrero_Medio_16.jpg',
            'Cristobal_Rosas_Franco_Medio_17.jpg',
            'Erick_Isaac_Lopez_Borjas_Medio_18.jpg',
            'Pablo_Aldahir_Gomez_Archundia_Medio_23.jpg',

            // Delanteros
            'Jesus_Rodrigo_Vela_Ramos_Delantero_9.jpg',
            'Leandro_Gael_Contreras_Aviles_Delantero_15.jpg',
            'Jose_Godofredo_Pedro_Fiscal_Delantero_19.jpg',
            'Carlos_Adrian_Suarez_Hernandez_Delantero_22.jpg',
            'Luis_Antonio_Sanchez_Flores_Delantero_26.jpg',
            'Gerardo_Antonio_Roman_Tellez_Delantero_32.jpg'
        ];

        const playerFilesAlebrijesSub16 = [
            // Director Técnico
            'Derk_Alexandro_Reyes_Rosas_DirectorTecnico.jpg',

            // Porteros
            'Anker_Matias_Paez_Ramirez_Portero_811.jpg',
            'Adriel_Fernando_Camacho_Ramirez_Portero_812.jpg',
            'Julio_Antonio_Alonso_Santos_Portero_813.jpg',
            'Uriel_Urieta_Robles_Portero_821.jpg',

            // Defensas
            'Marco_Eliel_Arenas_Trejo_Defensa_802.jpg',
            'Axel_Antonio_Vazquez_Estrada_Defensa_804.jpg',
            'Roberto_Adair_Perez_Arana_Defensa_805.jpg',
            'Derek_Jesus_Hernandez_Licea_Defensa_806.jpg',
            'Bruno_Arroyo_Sanchez_Defensa_814.jpg',
            'Leonardo_Briones_Duran_Defensa_817.jpg',

            // Mediocampistas
            'Diego_Miguel_Rosas_Romero_Medio_801.jpg',
            'Kevin_Damian_Alvarado_Montiel_Medio_803.jpg',
            'Juan_Carlos_Maravilla_Maldonado_Medio_808.jpg',
            'Dejan_Kaled_Ramirez_Quijano_Medio_810.jpg',
            'Emiliano_Rodriguez_Hernandez_Medio_815.jpg',
            'Javier_Lopez_Balderas_Medio_816.jpg',
            'Justin_Anderson_Aguilar_Hernandez_Medio_822.jpg',

            // Delanteros
            'Iker_Damian_Ortega_Villegas_Delantero_807.jpg',
            'Ian_Garcia_Ramos_Delantero_809.jpg',
            'Sergio_Jatniel_Hernandez_Hernandez_Delantero_818.jpg',
            'Mateo_Ezequiel_Moreno_Gil_Delantero_819.jpg',
            'Gerardo_Daniel_Morales_Vargas_Delantero_820.jpg'
        ];

        // Parser: nombre + posición + número desde el filename.
        // Recibe la carpeta para construir la ruta correcta de la imagen.
        const parsePlayerFromFilename = (filename, folder) => {
            const nameWithoutExt = filename.replace('.jpg', '');
            const parts = nameWithoutExt.split('_');
            const lastPart = parts[parts.length - 1];
            const isJerseyNumeric = /^\d+$/.test(lastPart);

            let position, jersey, nameParts;
            if (isJerseyNumeric) {
                position = parts[parts.length - 2];
                jersey = parseInt(lastPart, 10);
                nameParts = parts.slice(0, -2);
            } else {
                position = lastPart;
                jersey = null;
                nameParts = parts.slice(0, -1);
            }

            const fullName = nameParts.join(' ');

            let positionDisplay = position;
            let filterCategory = position.toLowerCase();

            if (position === 'Medio') {
                positionDisplay = 'Mediocampista';
                filterCategory = 'medios';
            } else if (position === 'Defensa') {
                positionDisplay = 'Defensa';
                filterCategory = 'defensas';
            } else if (position === 'Portero') {
                positionDisplay = 'Portero';
                filterCategory = 'porteros';
            } else if (position === 'Delantero') {
                positionDisplay = 'Delantero';
                filterCategory = 'delanteros';
            } else if (position === 'DirectorTecnico') {
                positionDisplay = 'Director Técnico';
                filterCategory = 'cuerpo-tecnico';
            }

            return {
                name: fullName,
                position: positionDisplay,
                filterCategory,
                jersey,
                image: `../assets/${folder}/${filename}`,
                profileUrl: playerProfiles[fullName] || null
            };
        };

        const alebrijesTdp      = playerFilesAlebrijes.map(f      => parsePlayerFromFilename(f, FOLDER_ALEBRIJES));
        const solesTdp          = playerFilesSoles.map(f          => parsePlayerFromFilename(f, FOLDER_SOLES));
        const alebrijesSub16    = playerFilesAlebrijesSub16.map(f => parsePlayerFromFilename(f, FOLDER_ALEBRIJES_SUB16));

        // 4 categorías. Soles Sub-16 se llena cuando se tengan los datos.
        const teams = {
            'alebrijes-tdp': {
                name: 'Alebrijes TDP',
                fullName: 'Alebrijes Teotihuacán · Liga TDP',
                accent: 'orange',
                players: alebrijesTdp
            },
            'soles-tdp': {
                name: 'Soles TDP',
                fullName: 'Soles Teotihuacán · Liga TDP',
                accent: 'purple',
                players: solesTdp
            },
            'alebrijes-sub16': {
                name: 'Alebrijes Sub-16',
                fullName: 'Alebrijes Teotihuacán · Sub-16',
                accent: 'orange',
                players: alebrijesSub16
            },
            'soles-sub16': {
                name: 'Soles Sub-16',
                fullName: 'Soles Teotihuacán · Sub-16',
                accent: 'purple',
                players: []
            }
        };

        // Orden de las posiciones con título visible y numeración editorial.
        const positionGroups = [
            { id: 'cuerpo-tecnico', title: 'Cuerpo Técnico', num: '00' },
            { id: 'porteros',       title: 'Porteros',       num: '01' },
            { id: 'defensas',       title: 'Defensas',       num: '02' },
            { id: 'medios',         title: 'Mediocampistas', num: '03' },
            { id: 'delanteros',     title: 'Delanteros',     num: '04' }
        ];

        // Sort de jugadores: por posición y luego por número de playera.
        const sortPlayers = (list) => {
            const positionOrder = {
                'Director Técnico': 0,
                'Portero': 1,
                'Defensa': 2,
                'Mediocampista': 3,
                'Delantero': 4
            };
            return [...list].sort((a, b) => {
                const oa = positionOrder[a.position] ?? 5;
                const ob = positionOrder[b.position] ?? 5;
                if (oa !== ob) return oa - ob;
                if (a.jersey !== null && b.jersey !== null) return a.jersey - b.jersey;
                return a.name.localeCompare(b.name);
            });
        };

        // ── State ──
        let currentCategory = 'alebrijes-tdp';
        let currentSearch = '';

        // ── Tabs ──
        const tabs = section.querySelectorAll('.plantilla-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const cat = tab.dataset.category;
                if (!cat || cat === currentCategory) return;
                currentCategory = cat;
                currentSearch = ''; // reset search on team switch
                const searchInput = document.getElementById('plantilla-search');
                if (searchInput) searchInput.value = '';
                const clear = section.querySelector('.plantilla-search-clear');
                if (clear) clear.hidden = true;
                updateActiveTab();
                renderContent();
            });
        });

        function updateActiveTab() {
            tabs.forEach(tab => {
                const isActive = tab.dataset.category === currentCategory;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            // Refresh counts
            Object.keys(teams).forEach(cat => {
                const tab = section.querySelector(`.plantilla-tab[data-category="${cat}"]`);
                if (!tab) return;
                const countEl = tab.querySelector('.plantilla-tab-count');
                const players = teams[cat].players;
                const playersCount = players.filter(p => p.filterCategory !== 'cuerpo-tecnico').length;
                countEl.textContent = playersCount > 0 ? playersCount : '—';
            });
        }

        // ── Search ──
        const searchInput = document.getElementById('plantilla-search');
        const searchClear = section.querySelector('.plantilla-search-clear');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.trim().toLowerCase();
                if (searchClear) searchClear.hidden = currentSearch.length === 0;
                renderContent();
            });
        }
        if (searchClear && searchInput) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                currentSearch = '';
                searchClear.hidden = true;
                searchInput.focus();
                renderContent();
            });
        }

        // ── Render ──
        const content = document.getElementById('plantilla-content');

        function renderContent() {
            if (!content) return;
            content.innerHTML = '';

            const team = teams[currentCategory];
            if (!team) return;

            if (team.players.length === 0) {
                content.appendChild(createEmptyState(team));
                return;
            }

            // Filtrar por nombre si hay búsqueda
            const filtered = currentSearch
                ? team.players.filter(p => p.name.toLowerCase().includes(currentSearch))
                : team.players;

            if (filtered.length === 0) {
                content.appendChild(createNoResultsState(currentSearch));
                return;
            }

            // Agrupar por posición
            const groups = positionGroups
                .map(g => ({ ...g, players: filtered.filter(p => p.filterCategory === g.id) }))
                .filter(g => g.players.length > 0);

            groups.forEach(group => {
                content.appendChild(createPositionGroup(group));
            });
        }

        function createPositionGroup(group) {
            const el = document.createElement('div');
            el.className = 'position-group';
            el.setAttribute('data-position', group.id);
            const countLabel = group.players.length === 1 ? 'jugador' : 'jugadores';
            el.innerHTML = `
                <div class="position-group-header">
                    <span class="position-group-num">${group.num}</span>
                    <h3 class="position-group-title">${group.title}</h3>
                    <span class="position-group-count">${group.players.length} ${countLabel}</span>
                </div>
                <div class="squad-grid"></div>
            `;
            const grid = el.querySelector('.squad-grid');
            sortPlayers(group.players).forEach(player => {
                grid.appendChild(createPlayerCard(player));
            });
            return el;
        }

        function createEmptyState(team) {
            const el = document.createElement('div');
            el.className = 'empty-state';
            el.innerHTML = `
                <div class="empty-state-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                    </svg>
                </div>
                <h3 class="empty-state-title">${team.fullName}</h3>
                <p class="empty-state-text">La plantilla de este equipo se publicará próximamente.</p>
            `;
            return el;
        }

        function createNoResultsState(query) {
            const el = document.createElement('div');
            el.className = 'empty-state';
            el.innerHTML = `
                <div class="empty-state-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="7"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <h3 class="empty-state-title">Sin resultados</h3>
                <p class="empty-state-text">No encontramos jugadores que coincidan con "<strong>${query}</strong>". Prueba con otro nombre o apellido.</p>
            `;
            return el;
        }

        function createPlayerCard(player) {
            const card = document.createElement('div');
            const isDT = player.filterCategory === 'cuerpo-tecnico';
            card.className = `player-card${isDT ? ' player-card--dt' : ''}`;
            card.setAttribute('data-category', player.filterCategory);

            if (player.profileUrl) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    window.open(player.profileUrl, '_blank', 'noopener,noreferrer');
                });
            }

            // Watermark grande detrás de la foto (solo jugadores, no DT)
            const showNumber = player.jersey !== null && !isDT;
            const watermark = showNumber
                ? `<span class="player-card-watermark" aria-hidden="true">${player.jersey}</span>`
                : '';

            card.innerHTML = `
                <div class="player-card-photo">
                    <img src="${player.image}" alt="${player.name}" loading="lazy" onerror="this.src='../assets/Alebrijes Teotihuacan.png'">
                    ${watermark}
                    <div class="player-card-overlay" aria-hidden="true"></div>
                </div>
                <div class="player-card-info">
                    <h4 class="player-card-name">${player.name}</h4>
                    <span class="player-card-pos">${player.position}</span>
                </div>
            `;
            return card;
        }

        // Inicializar
        updateActiveTab();
        renderContent();
    }

    // Section 3: Últimos Resultados - Carrusel
    function initResultados() {
        const track = document.querySelector('.results-carousel-track');
        const prevBtn = document.querySelector('.results-carousel-btn.prev');
        const nextBtn = document.querySelector('.results-carousel-btn.next');
        const dotsContainer = document.querySelector('.results-carousel-dots');
        const viewport = document.querySelector('.results-carousel-viewport');

        if (!track) return;

        // Últimos resultados (más reciente primero)
        const results = [
            {
                jornada: 'Jornada 2',
                eyebrow: 'Liga TDP · Grupo 9 · Temporada 2026–2027',
                title: 'Último resultado',
                meta: [
                    { icon: 'calendar', label: 'Fecha y hora', value: 'Viernes 11 de septiembre · 12:00 hrs' },
                    { icon: 'location', label: 'Sede',         value: 'Centro Recreativo Pascual Boing' }
                ],
                homeTeam: {
                    name: 'Alebrijes Teotihuacán',
                    tag: 'Local',
                    logo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
                    id: 12621
                },
                awayTeam: {
                    name: 'Industriales de Altamira FC',
                    tag: 'Visitante',
                    logo: '../assets/EquiposGrupo9_LigaTDP/IndustrialesDeAltamiraFC.png',
                    id: 14478
                },
                scoreValue: '0 (7) – (8) 0',
                scoreStatus: 'Finalizado',
                result: 'draw'
            },
            {
                jornada: 'Jornada 1',
                eyebrow: 'Liga TDP · Grupo 9 · Temporada 2026–2027',
                title: 'Último resultado',
                meta: [
                    { icon: 'calendar', label: 'Fecha y hora', value: 'Viernes 4 de septiembre · 11:00 hrs' },
                    { icon: 'location', label: 'Sede',         value: 'Universidad del Fútbol' }
                ],
                homeTeam: {
                    name: 'Tuzos Pachuca',
                    tag: 'Local',
                    logo: '../assets/EquiposGrupo9_LigaTDP/TuzosPachuca.png',
                    id: 11002
                },
                awayTeam: {
                    name: 'Alebrijes Teotihuacán',
                    tag: 'Visitante',
                    logo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
                    id: 12621
                },
                scoreValue: '0 – 1',
                scoreStatus: 'Final',
                result: 'win'
            }
        ];

        let resultIndex = 0;
        const resultTotal = results.length;
        let autoPlayTimer = null;
        const AUTO_PLAY_MS = 5000;

        // Render cards + dots
        results.forEach((result, index) => {
            const card = createResultCard(result);
            track.appendChild(card);

            if (dotsContainer) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'results-carousel-dot' + (index === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Ir al resultado ${index + 1}`);
                dot.addEventListener('click', () => {
                    goToResult(index);
                    restartAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
        });

        const dots = document.querySelectorAll('.results-carousel-dot');

        function updateCarousel() {
            track.style.transform = `translateX(-${resultIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === resultIndex);
            });
            if (prevBtn) prevBtn.disabled = resultIndex === 0;
            if (nextBtn) nextBtn.disabled = resultIndex === resultTotal - 1;
        }

        function goToResult(i) {
            // Wrap-around
            if (i >= resultTotal) i = 0;
            if (i < 0) i = resultTotal - 1;
            resultIndex = i;
            updateCarousel();
        }

        if (prevBtn) prevBtn.addEventListener('click', () => {
            goToResult(resultIndex - 1);
            restartAutoPlay();
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            goToResult(resultIndex + 1);
            restartAutoPlay();
        });

        // Swipe en mobile
        if (viewport) {
            let touchStartX = 0;
            viewport.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            viewport.addEventListener('touchend', e => {
                const touchEndX = e.changedTouches[0].screenX;
                const threshold = 50;
                if (touchEndX < touchStartX - threshold) goToResult(resultIndex + 1);
                if (touchEndX > touchStartX + threshold) goToResult(resultIndex - 1);
                restartAutoPlay();
            }, { passive: true });
        }

        // Auto-play
        function startAutoPlay() {
            if (autoPlayTimer) return;
            autoPlayTimer = setInterval(() => {
                goToResult(resultIndex + 1);
            }, AUTO_PLAY_MS);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        function restartAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // Pausar al hacer hover
        if (viewport) {
            viewport.addEventListener('mouseenter', stopAutoPlay);
            viewport.addEventListener('mouseleave', startAutoPlay);
        }

        // Respetar prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!prefersReducedMotion.matches) {
            startAutoPlay();
        }

        // Pausar cuando la pestaña no es visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoPlay();
            } else if (!prefersReducedMotion.matches) {
                startAutoPlay();
            }
        });

        updateCarousel();
    }

    function createResultCard(result) {
        const card = document.createElement('article');
        card.className = `result-card result-card--${result.result}`;

        const metaHtml = result.meta.map(item => `
            <div class="meta-item">
                ${RESULT_META_ICONS[item.icon] || ''}
                <div class="meta-content">
                    <span class="meta-label">${item.label}</span>
                    <span class="meta-value">${item.value}</span>
                </div>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="result-accent result-accent--${result.result}" aria-hidden="true"></div>
            <header class="result-header">
                <span class="result-eyebrow">${result.eyebrow}</span>
                <h3 class="result-title">${result.title}</h3>
                <span class="result-subtitle">${result.jornada}</span>
            </header>
            <div class="result-meta">
                ${metaHtml}
            </div>
            <div class="result-board">
                <div class="team-block team-block--home" data-team-id="${result.homeTeam.id}">
                    <div class="team-crest">
                        <img src="${result.homeTeam.logo}" alt="${result.homeTeam.name}">
                    </div>
                    <div class="team-info">
                        <span class="team-tag">${result.homeTeam.tag}</span>
                        <h4 class="team-name">${result.homeTeam.name}</h4>
                    </div>
                </div>
                <div class="result-score">
                    <span class="score-value">${result.scoreValue}</span>
                    <span class="score-status">${result.scoreStatus}</span>
                </div>
                <div class="team-block team-block--away" data-team-id="${result.awayTeam.id}">
                    <div class="team-crest">
                        <img src="${result.awayTeam.logo}" alt="${result.awayTeam.name}">
                    </div>
                    <div class="team-info">
                        <span class="team-tag">${result.awayTeam.tag}</span>
                        <h4 class="team-name">${result.awayTeam.name}</h4>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    // Section 4: Noticias TDP
    function initNoticias() {
        const newsGrid = document.getElementById('tdp-news-grid');
        if (!newsGrid) return;

        // Load news from noticias.html page
        loadTDPNews();
    }

    function loadTDPNews() {
        const newsGrid = document.getElementById('tdp-news-grid');
        if (!newsGrid) return;

        // Try to get news from the noticias page
        // Since we can't directly access another page's DOM, we'll create sample news
        // In a real implementation, you'd fetch this from an API or shared data source

        const tdpNews = [
            {
                title: 'Preparación para Debut en Liga TDP',
                subtitle: 'El equipo se alista para su debut en la Jornada 16 del Clausura 2026 ante Bombarderos de Tecámac.',
                image: '../assets/Noticias/Preparación_Para_El_Debut_En_El_Clausura_2026/611672315_26248273021441267_7472245763015193747_n.jpg',
                date: '2025-01-28',
                dateISO: '2025-01-28',
                slug: 'preparacion-debut-liga-tdp-clausura-2026'
            },
            {
                title: 'Draft CL 2026: Selección de Talentos',
                subtitle: 'Jugadores de Alebrijes Teotihuacán y Soles Teotihuacán participaron en la revisión deportiva.',
                image: '../assets/Noticias/Draft_CL_2026/600915227_880335767858850_5268943101367662221_n.jpg',
                date: '2025-01-27',
                dateISO: '2025-01-27',
                slug: 'draft-cl-2026-seleccion-talentos'
            },
            {
                title: 'Expansión Entrena en Teotihuacán',
                subtitle: 'El equipo de Liga de Expansión MX realizó una sesión de entrenamiento en nuestras instalaciones.',
                image: '../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.35 PM.jpeg',
                date: '2025-01-26',
                dateISO: '2025-01-26',
                slug: 'alebrijes-expansion-entrena-en-teotihuacan'
            },
            {
                title: 'Alexis Armando al Torneo del Sol',
                subtitle: 'Nuestro jugador de Liga TDP ha sido seleccionado para representar al Grupo 9.',
                image: '../assets/Noticias/Alexis_Seleccionado_Torneo_Sol/Alexis_Torneo_Sol.jpg',
                date: '2025-01-25',
                dateISO: '2025-01-25',
                slug: 'alexis-armando-seleccionado-torneo-del-sol'
            },
            {
                title: 'Goleada 6-1 ante Aguilas',
                subtitle: 'Victoria contundente 6-1 ante Aguilas de Teotihuacán en un partido emocionante.',
                image: '../assets/victoria-contundente-ante-aguilas-de-teotihuacan/InicioPartido.jpg',
                date: '2025-12-19',
                dateISO: '2025-12-19',
                slug: 'victoria-contundente-ante-aguilas-de-teotihuacan'
            }
        ];

        // Sort news by date (most recent first)
        tdpNews.sort((a, b) => {
            return new Date(b.dateISO) - new Date(a.dateISO);
        });

        // Clear existing content
        newsGrid.innerHTML = '';

        // Add news cards
        tdpNews.forEach((news, index) => {
            const card = createNewsCard(news);
            // Add delay for animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            newsGrid.appendChild(card);

            // Animate in
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function createNewsCard(news) {
        const card = document.createElement('article');
        card.className = 'news-card-modern';
        card.setAttribute('data-category', 'liga-tdp');
        card.addEventListener('click', () => {
            window.location.href = `noticia-detalle.html#${news.slug}`;
        });

        // Format date for display
        const formattedDate = formatNewsDate(news.date);

        card.innerHTML = `
            <div class="news-card-image">
                <img src="${news.image}" alt="${news.title}" onerror="this.src='../assets/LigaTDP.png'">
                <button class="news-card-share" aria-label="Compartir" onclick="event.stopPropagation();">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>
            <div class="news-card-content">
                <div class="news-card-meta">
                    <span class="news-card-time">${formattedDate}</span>
                    <span class="news-card-separator">|</span>
                    <span class="news-card-type" data-category-dynamic="true">noticia</span>
                </div>
                <h3 class="news-card-title">${news.title.toUpperCase()}</h3>
                <p class="news-card-subtitle">${news.subtitle || 'Mantente al día con las últimas noticias de la Liga TDP y nuestros Alebrijes.'}</p>
            </div>
        `;
        return card;
    }

    function formatNewsDate(dateString) {
        // Convert "19 Dic 2025" to relative time or keep as is
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Ahora';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `${diffDays}d`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
        return dateString;
    }

    // Scroll Animation for Cards
    const animateCards = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        const cards = document.querySelectorAll('.player-card, .tdp-news-card, .result-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };

    animateCards();
});
