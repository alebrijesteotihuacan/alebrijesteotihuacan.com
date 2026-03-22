/* 
   Alebrijes de Oaxaca Teotihuacán
   Liga TDP Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {
    // Menu Navigation
    const menuButtons = document.querySelectorAll('.ligatdp-menu-btn');
    const contentSections = document.querySelectorAll('.ligatdp-content-section');

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
    function initPlantilla() {
        const squadGrid = document.querySelector('#section-plantilla .squad-grid');
        if (!squadGrid) return;

        // Player profile URLs mapping
        const playerProfiles = {
            'Abimael Torres Nava': 'https://ligatdp.mx/cuerpoTecnico/41036',
            'Rizieri Pérez Valenzo': 'https://ligatdp.mx/jugador/174233',
            'Luis Gustavo Emeterio Hernandez': 'https://ligatdp.mx/jugador/168919',
            'Cristian Miguel Padierna Mojica': 'https://ligatdp.mx/jugador/184363',
            'Luis Alberto Olvera Perez': 'https://ligatdp.mx/jugador/175924',
            'Jorge Salazar Jiménez': 'https://ligatdp.mx/jugador/184374',
            'Juan Carlos Guerrero Peña': 'https://ligatdp.mx/jugador/180278',
            'Alexis Armando Espinosa Domínguez': 'https://ligatdp.mx/jugador/185609',
            'Diego Efraín Martínez Ríos': 'https://ligatdp.mx/jugador/184392',
            'Ignacio Jesús López Joachín': 'https://ligatdp.mx/jugador/184383',
            'Diego Alberto Váldez Sánchez': 'https://ligatdp.mx/jugador/184386',
            'Emiliano Gutiérrez Castro': 'https://ligatdp.mx/jugador/184360',
            'Iker Baizabal Hernández': 'https://ligatdp.mx/jugador/184391',
            'Baruk Martín Curiel Cornejo': 'https://ligatdp.mx/jugador/184537',
            'Noé Miguel Estefes': 'https://ligatdp.mx/jugador/184376',

            'Melvin Rafael Maximo': 'https://ligatdp.mx/jugador/185612',
            'Darío Magariño Castillejos': 'https://ligatdp.mx/jugador/184384',
            'Martín Magaña Vázquez': 'https://ligatdp.mx/jugador/184394',
            'Oscar Gabriel Ortega Ramos': 'https://ligatdp.mx/jugador/186198',
            'Cristian Alexander García Morales': 'https://ligatdp.mx/jugador/186205'
        };

        // Player images from PlantillaLigaTDP_2026 folder (including DT)
        const playerFiles = [
            'Abimael_Torres_Nava_DirectorTecnico.jpg',
            'Alan_Mauricio_Chimal_Barajas_Portero.jpg',
            'Alexander_Peralta_Selvan_Medio.jpg',
            'Alexis_Armando_Espinosa_Domínguez_Delantero.jpg',
            'Alexis_Eduardo_Cagal_Cruz_Delantero.jpg',
            'Baruk_Martín_Curiel_Cornejo_Medio.jpg',
            'Carlos_Alberto_Espinosa_Valentín_Defensa.jpg',
            'Cristian_Alexander_García_Morales_Medio.jpg',
            'Cristian_Miguel_Padierna_Mojica_Defensa.jpg',
            'Darío_Magariño_Castillejos_Defensa.jpg',
            'David_Eduardo_Delgadillo_Hernández_Medio.jpg',
            'Diego_Alberto_Váldez_Sánchez_Defensa.jpg',
            'Diego_Efraín_Martínez_Ríos_Portero.jpg',
            'Emiliano_Gutiérrez_Castro_Defensa.jpg',
            'Gabriel_Villagran_Toledo_Defensa.jpg',
            'Horus_Axel_Minor_Ortíz_Medio.jpg',
            'Ignacio_Jesús_López_Joachín_Defensa.jpg',
            'Iker_Baizabal_Hernández_Defensa.jpg',
            'Jireh_Ismael_Alvarado_Sánchez_Medio.jpg',
            'Jocsan_Adrián_Sánchez_Ballona_Medio.jpg',
            'Jorge_Salazar_Jiménez_Medio.jpg',
            'Jose_Luis_Tavares_Torres_Defensa.jpg',
            'Joshua_Alejo_Hernández_Portero.jpg',
            'Juan_Carlos_Guerrero_Peña_Medio.jpg',
            'Juan_José_Salazar_Sánchez_Medio.jpg',
            'Julio_Cezar_Gutierrez_Diaz_Medio.jpg',
            'Luis_Alberto_Olvera_Perez_Medio.jpg',
            'Luis_Alfonso_Martínez_Lupercio_Medio.jpg',
            'Luis_Gustavo_Emeterio_Hernandez_Defensa.jpg',
            'Martín_Magaña_Vázquez_Defensa.jpg',
            'Mauro_Exsael_Paredes_Sánchez_Medio.jpg',
            'Melvin_Rafael_Maximo_Delantero.jpg',
            'Noé_Miguel_Estefes_Medio.jpg',
            'Oliver_De_La_Torre_Pérez_Medio.jpg',
            'Orbi_Ríos_Rodríguez_Delantero.jpg',
            'Oscar_Gabriel_Ortega_Ramos_Medio.jpg',
            'Rizieri_Pérez_Valenzo_Defensa.jpg',
            'Rodrigo_Samuel_Camacho_Rodriguez_Defensa.jpg',
            'Santiago_Mael_Ortíz_Olivera_Medio.jpg'
        ];

        // Parse player data from filename
        const players = playerFiles.map(filename => {
            const nameWithoutExt = filename.replace('.jpg', '');
            const parts = nameWithoutExt.split('_');

            // Last part is the position
            const position = parts[parts.length - 1];

            // All other parts are the name
            const nameParts = parts.slice(0, -1);
            const fullName = nameParts.join(' ');

            // Map position names
            let positionDisplay = position;
            let filterCategory = position.toLowerCase();

            if (position === 'Medio') {
                positionDisplay = 'Medio';
                filterCategory = 'medios';
            } else if (position === 'Defensa') {
                filterCategory = 'defensas';
            } else if (position === 'Portero') {
                filterCategory = 'porteros';
            } else if (position === 'Delantero') {
                filterCategory = 'delanteros';
            } else if (position === 'DirectorTecnico') {
                positionDisplay = 'Director Técnico';
                filterCategory = 'cuerpo-tecnico';
            }

            return {
                name: fullName,
                position: positionDisplay,
                filterCategory: filterCategory,
                image: `../assets/PlantillaLigaTDP_2026/${filename}`,
                profileUrl: playerProfiles[fullName] || null
            };
        });

        // Store players globally for filtering
        window.allPlayers = players;

        // Initialize filter buttons
        initFilters();

        // Render all players initially
        renderPlayers(players);
    }

    function initFilters() {
        const filterSelect = document.getElementById('squad-filter');

        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                const filter = e.target.value;
                filterPlayers(filter);
            });
        }
    }

    function filterPlayers(filter) {
        const squadGrid = document.querySelector('#section-plantilla .squad-grid');
        if (!squadGrid || !window.allPlayers) return;

        let filteredPlayers;

        // Get DT separately
        const dt = window.allPlayers.find(player => player.filterCategory === 'cuerpo-tecnico');

        if (filter === 'all') {
            // Show all players with DT first
            filteredPlayers = window.allPlayers.filter(player =>
                player.filterCategory !== 'cuerpo-tecnico'
            );
            // Add DT at the beginning
            if (dt) {
                filteredPlayers = [dt, ...filteredPlayers];
            }
        } else if (filter === 'cuerpo-tecnico') {
            // Only show DT
            filteredPlayers = dt ? [dt] : [];
        } else {
            // Show only filtered players (no DT)
            filteredPlayers = window.allPlayers.filter(player =>
                player.filterCategory === filter
            );
        }

        renderPlayers(filteredPlayers);
    }

    function renderPlayers(players) {
        const squadGrid = document.querySelector('#section-plantilla .squad-grid');
        if (!squadGrid) return;

        // Clear grid
        squadGrid.innerHTML = '';

        // Sort players by position
        const positionOrder = {
            'Director Técnico': 0,
            'Portero': 1,
            'Defensa': 2,
            'Mediocampista': 3,
            'Delantero': 4
        };

        const sortedPlayers = [...players].sort((a, b) => {
            const orderA = positionOrder[a.position] || 5;
            const orderB = positionOrder[b.position] || 5;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
        });

        // Add players to grid
        sortedPlayers.forEach(player => {
            const playerCard = createPlayerCard(player);
            squadGrid.appendChild(playerCard);
        });
    }

    function createPlayerCard(player) {
        const card = document.createElement('div');
        const isDT = player.filterCategory === 'cuerpo-tecnico';
        card.className = `player-card ${isDT ? 'coach-card' : ''}`;
        card.setAttribute('data-category', player.filterCategory);

        // Add click handler if player has a profile URL
        if (player.profileUrl) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.open(player.profileUrl, '_blank', 'noopener,noreferrer');
            });
        }

        card.innerHTML = `
            <div class="player-img">
                <img src="${player.image}" alt="${player.name}" onerror="this.src='../assets/Alebrijes Teotihuacan.png'">
            </div>
            <div class="player-info">
                <h3>${player.name}</h3>
                <p class="player-pos">${player.position}</p>
            </div>
        `;
        return card;
    }

    // Section 3: Últimos Resultados - Carrusel
    function initResultados() {
        const carouselTrack = document.querySelector('.results-carousel-track');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const indicators = document.querySelector('.carousel-indicators');

        if (!carouselTrack) return;

        // Últimos 3 resultados reales
        const results = [
            {
                jornada: 'Jornada 26',
                date: '21 MAR 2026',
                homeTeam: 'CEFOR 3030',
                homeScore: 0,
                awayTeam: 'Alebrijes Teotihuacán',
                awayScore: 1,
                result: 'win',
                location: 'Visita',
                homeLogo: '../assets/EquiposGrupo9_LigaTDP/CEFOR3030.png',
                awayLogo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png'
            },
            {
                jornada: 'Jornada 25',
                date: '13 MAR 2026',
                homeTeam: 'Alebrijes Teotihuacán',
                homeScore: '2 (4)',
                awayTeam: 'UFD Pachuca',
                awayScore: '(5) 2',
                result: 'loss',
                location: 'Casa',
                homeLogo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
                awayLogo: '../assets/EquiposGrupo9_LigaTDP/UFD.png'
            },
            {
                jornada: 'Jornada 24',
                date: '7 MAR 2026',
                homeTeam: 'Halcones Negros F.C.',
                homeScore: 6,
                awayTeam: 'Alebrijes',
                awayScore: 1,
                result: 'loss',
                location: 'Visita',
                homeLogo: '../assets/EquiposGrupo9_LigaTDP/HalconesNegros.png',
                awayLogo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png'
            }
        ];

        let currentIndex = 0;

        // Create result cards
        results.forEach((result, index) => {
            const card = createResultCard(result);
            carouselTrack.appendChild(card);

            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(indicator);
        });

        // Navigation handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + results.length) % results.length;
                goToSlide(currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % results.length;
                goToSlide(currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            carouselTrack.style.transform = `translateX(-${index * 100}%)`;

            // Update indicators
            document.querySelectorAll('.carousel-indicator').forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
        }

        // Auto-play carousel cada 5 segundos
        let autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % results.length;
            goToSlide(currentIndex);
        }, 5000);

        // Pausar auto-play al hacer hover
        const carouselWrapper = document.querySelector('.results-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            carouselWrapper.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % results.length;
                    goToSlide(currentIndex);
                }, 5000);
            });
        }
    }

    function createResultCard(result) {
        const card = document.createElement('div');
        card.className = `result-card ${result.result}`;

        const isHome = result.location === 'Casa';
        const homeTeamName = isHome ? result.homeTeam : result.awayTeam;
        const awayTeamName = isHome ? result.awayTeam : result.homeTeam;
        const homeScore = isHome ? result.homeScore : result.awayScore;
        const awayScore = isHome ? result.awayScore : result.homeScore;
        const homeIsWinner = result.result === 'win';
        const awayIsWinner = result.result === 'loss';

        // Intercambiar logos también cuando es partido de visita
        const homeLogo = isHome
            ? (result.homeLogo || '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png')
            : (result.awayLogo || '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png');
        const awayLogo = isHome
            ? (result.awayLogo || '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png')
            : (result.homeLogo || '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png');

        card.innerHTML = `
            <div class="result-header">
                <span class="result-jornada">${result.jornada}</span>
                <span class="result-date">${result.date}</span>
            </div>
            <div class="result-teams">
                <div class="team-res home">
                    <div class="team-logo-score">
                        <img src="${homeLogo}" alt="${homeTeamName}" class="team-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="placeholder-crest" style="display:none;"></div>
                        <span class="score ${homeIsWinner ? 'winner' : ''}">${homeScore}</span>
                    </div>
                    <span class="team-name">${homeTeamName}</span>
                </div>
                <div class="vs-res">VS</div>
                <div class="team-res away">
                    <div class="team-logo-score">
                        <img src="${awayLogo}" alt="${awayTeamName}" class="team-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="placeholder-crest" style="display:none;"></div>
                        <span class="score ${awayIsWinner ? 'winner' : ''}">${awayScore}</span>
                    </div>
                    <span class="team-name">${awayTeamName}</span>
                </div>
            </div>
            <div class="result-footer">
                <span class="result-status ${result.result}">${result.result === 'win' ? 'Victoria' : result.result === 'draw' ? 'Empate' : 'Derrota'}</span>
                <span class="result-location">${result.location === 'Casa' ? 'En Casa' : 'De Visita'}</span>
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
