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

        // Player profile URLs (LigaTDP.mx). Vacío por ahora - llenar cuando se tengan los IDs.
        const playerProfiles = {};

        // Player images from PlantillaAlebrijesTeotihuacanLigaTDP folder.
        // Formato: Nombre_Nombre_Position_Number.jpg (DT sin número).
        // Orden: DT primero, luego Porteros, Defensas, Mediocampistas, Delanteros
        //        (ordenados por número de playera).
        const playerFiles = [
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

        // Parse player data from filename.
        // Formato nuevo: Name_Position_Number  (DT: Name_DirectorTecnico)
        const players = playerFiles.map(filename => {
            const nameWithoutExt = filename.replace('.jpg', '');
            const parts = nameWithoutExt.split('_');

            const lastPart = parts[parts.length - 1];
            const isJerseyNumeric = /^\d+$/.test(lastPart);

            let position, jersey, nameParts;
            if (isJerseyNumeric) {
                // Name_Position_Number
                position = parts[parts.length - 2];
                jersey = parseInt(lastPart, 10);
                nameParts = parts.slice(0, -2);
            } else {
                // Name_DirectorTecnico (sin número)
                position = lastPart;
                jersey = null;
                nameParts = parts.slice(0, -1);
            }

            const fullName = nameParts.join(' ');

            // Map position names
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
                filterCategory: filterCategory,
                jersey: jersey,
                image: `../assets/PlantillaAlebrijesTeotihuacanLigaTDP/${filename}`,
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

        // Sort players by position, then by jersey number (DT al inicio sin número)
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
            // Dentro de la misma posición: por número de playera
            if (a.jersey !== null && b.jersey !== null) {
                return a.jersey - b.jersey;
            }
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

        // Jersey number badge (solo jugadores, no DT)
        const jerseyBadge = (player.jersey !== null && !isDT)
            ? `<span class="player-number" aria-label="Número de playera ${player.jersey}">${player.jersey}</span>`
            : '';

        card.innerHTML = `
            <div class="player-img">
                <img src="${player.image}" alt="${player.name}" onerror="this.src='../assets/Alebrijes Teotihuacan.png'">
                ${jerseyBadge}
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
                jornada: 'Jornada 30',
                date: '17 ABR 2026',
                homeTeam: 'Alebrijes Teotihuacán',
                homeScore: 2,
                awayTeam: 'Atlético Huejutla',
                awayScore: 3,
                result: 'loss',
                location: 'Casa',
                homeLogo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
                awayLogo: '../assets/EquiposGrupo9_LigaTDP/AtleticoHuejutla.png'
            },
            {
                jornada: 'Jornada 29',
                date: '11 ABR 2026',
                homeTeam: 'Águilas de Teotihuacán',
                homeScore: 1,
                awayTeam: 'Alebrijes Teotihuacán',
                awayScore: 0,
                result: 'loss',
                location: 'Visita',
                homeLogo: '../assets/EquiposGrupo9_LigaTDP/AguilasTeotihuacan.png',
                awayLogo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png'
            },
            {
                jornada: 'Jornada 28',
                date: '3 ABR 2026',
                homeTeam: 'Alebrijes Teotihuacán',
                homeScore: '1 (4)',
                awayTeam: 'Club Deportivo Matamoros',
                awayScore: '(3) 1',
                result: 'win',
                location: 'Casa',
                homeLogo: '../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
                awayLogo: '../assets/EquiposGrupo9_LigaTDP/ClubDeportivoMatamoros.png'
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
