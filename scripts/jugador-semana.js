/*
    jugador-semana.js
    Loads the best player per category (highest promedioGeneral)
    from the last evaluation week and renders the featured players section.
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ── Firebase Config ──────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyD5aakkUMk77EMKPwHvjXTqzPKBvejhjEo",
    authDomain: "metricasalebrijes.firebaseapp.com",
    projectId: "metricasalebrijes",
    storageBucket: "metricasalebrijes.firebasestorage.app",
    messagingSenderId: "822819596837",
    appId: "1:822819596837:web:62f3f4139332830ee96dcc"
};

let app;
try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
    app = initializeApp(firebaseConfig, 'jugador-semana-' + Date.now());
}
const db = getFirestore(app);


// ── Categories to display ────────────────────────────────────
const CATEGORIAS = ['Alebrijes TDP', 'Soles TDP', 'Sub-18', 'Sub-16', 'Sub-14'];

// Map old category names stored in Firebase → new display names
const CATEGORY_ALIAS = {
    'Sub-13': 'Sub-14',
    'Sub-15': 'Sub-16',
    'Sub-17': 'Sub-18',
    'Sub-20': 'Sub-21',
};

function normalizeCategoria(cat) {
    return CATEGORY_ALIAS[cat] || cat;
}

// ── Category accent colors ───────────────────────────────────
const CATEGORY_COLORS = {
    'Alebrijes TDP': 'linear-gradient(135deg, #E85D26, #c94d1e)',
    'Soles TDP':     'linear-gradient(135deg, #f59e0b, #d97706)',
    'Sub-18':        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'Sub-16':        'linear-gradient(135deg, #10b981, #059669)',
    'Sub-14':        'linear-gradient(135deg, #8b5cf6, #6d28d9)',
};

// ── Image helpers (same logic as panel-profesor.js) ──────────
const PLAYER_IMAGES = [
    'Abimael_Torres_Nava_DirectorTecnico.jpg','Alan_Mauricio_Chimal_Barajas_Portero.jpg',
    'Alexander_Peralta_Selvan_Medio.jpg','Alexis_Armando_Espinosa_Domínguez_Delantero.jpg',
    'Alexis_Eduardo_Cagal_Cruz_Delantero.jpg','Baruk_Martín_Curiel_Cornejo_Medio.jpg',
    'Carlos_Alberto_Espinosa_Valentín_Defensa.jpg','Cristian_Alexander_García_Morales_Medio.jpg',
    'Cristian_Miguel_Padierna_Mojica_Defensa.jpg','Darío_Magariño_Castillejos_Defensa.jpg',
    'David_Eduardo_Delgadillo_Hernández_Medio.jpg','Diego_Alberto_Váldez_Sánchez_Defensa.jpg',
    'Diego_Efraín_Martínez_Ríos_Portero.jpg','Emiliano_Gutiérrez_Castro_Defensa.jpg',
    'Gabriel_Villagran_Toledo_Defensa.jpg','Horus_Axel_Minor_Ortíz_Medio.jpg',
    'Ignacio_Jesús_López_Joachín_Defensa.jpg','Iker_Baizabal_Hernández_Defensa.jpg',
    'Jireh_Ismael_Alvarado_Sánchez_Medio.jpg','Jocsan_Adrián_Sánchez_Ballona_Medio.jpg',
    'Jorge_Salazar_Jiménez_Medio.jpg','Jose_Luis_Tavares_Torres_Defensa.jpg',
    'Joshua_Alejo_Hernández_Portero.jpg','Juan_Carlos_Guerrero_Peña_Medio.jpg',
    'Juan_José_Salazar_Sánchez_Medio.jpg','Julio_Cezar_Gutierrez_Diaz_Medio.jpg',
    'Luis_Alberto_Olvera_Perez_Medio.jpg','Luis_Alfonso_Martínez_Lupercio_Medio.jpg',
    'Luis_Gustavo_Emeterio_Hernandez_Defensa.jpg','Martín_Magaña_Vázquez_Defensa.jpg',
    'Mauro_Exsael_Paredes_Sánchez_Medio.jpg','Melvin_Rafael_Maximo_Delantero.jpg',
    'Noé_Miguel_Estefes_Medio.jpg','Oliver_De_La_Torre_Pérez_Medio.jpg',
    'Orbi_Ríos_Rodríguez_Delantero.jpg','Oscar_Gabriel_Ortega_Ramos_Medio.jpg',
    'Rizieri_Pérez_Valenzo_Defensa.jpg','Rodrigo_Samuel_Camacho_Rodriguez_Defensa.jpg',
    'Santiago_Mael_Ortíz_Olivera_Medio.jpg'
];

const PLAYER_IMAGES_SOLES = [
    'Adbeel_Jehiel_Ramirez_Juarez.jpg','Alexander_Villanueva_Huerta.jpg',
    'Alfonso_Isaac_Jimenez_Calero.jpg','Angel_Gabriel_Barboza_Muñiz.jpg',
    'Angel_Uriel_Castillo_Ramirez.jpg','Armando_Perez_Campos.jpg',
    'Byron_Mishell_Mateos_Martinez.jpg','Carlos_Enrique_Landa_Landa.jpg',
    'Cesar_Yovanni_Gomez_Anzastiga.jpg','Christopher_Armani_Camacho_Ibarguen.jpg',
    'Cristian_Aldair_Marin_Ramirez.jpg','Diego_Ivan_Ramirez_Gonzalez.jpg',
    'Edgar_Emanuel_Flores_Veliz.jpg','Elian_Fabian_Naranjo.jpg',
    'Emilio_Andres_Cornelio_Lopez.jpg','Erick_Klebeer_Alanis_Guerrero.jpg',
    'Felix_Eduardo_Martinez_Contreras.jpg','Franklin_Misael_Hernandez_Pablo.jpg',
    'Hector_Gabriel_Castillo_Elizondo.jpg','Ibrahim_Rafael_Lopez_Zaragoza.jpg',
    'Ignacio_Hazzam_Dominguez_Cruz.jpg','Irving_Daniel_Lopez_Luna.jpg',
    'Jesus_Manuel_Nuñez_Gutierrez.jpg','Jesus_Manuel_Tarango_Maldonado.jpg',
    'Jesus_Miguel_Xolio_Ortiz.jpg','Jesus_Rodrigo_Vela_Ramos.jpg',
    'Jorge_Eduardo_Santiago_Reyes.jpg','Josaphat_Tapia_Vazquez.jpg',
    'Jose_Enmanuel_Sanchez_Gonzalez.jpg','Juan_Carlos_Gonzalez_Ceniceros.jpg',
    'Juan_Enrique_Rojas_Vargas.jpg','Juan_Uziel_Zarate_Navarrete.jpg',
    'Kevin_Abel_Leon_Sanchez.jpg','Luciano_Ortiz_Melendez.jpg',
    'Luis_Jareth_Dominguez_Meza.jpg','Miguel_David_Duran_Leon.jpg',
    'Ricardo_Gael_Cruz_Santos.jpg','Richard_Aguilar_Perez.jpg',
    'Roberto_Alcantar_Piña.jpg','Sebastian_Segundo_Becerril.jpg'
];

const PLAYER_IMAGES_FUERZAS = [
    'Abdiel_Monroy_García.jpeg','Asiel_Zaid_Montoya_Rojas.jpeg',
    'Axel_Antonio_Vázquez_Estrada.jpeg','Bruno_Arroyo_Sánchez.jpeg',
    'Dejan_Kaled_Ramírez_Guijano.jpeg','Demian_Marcus_Arregui_Nava.jpeg',
    'Derek_Jesús_Hernández_Licea.jpeg','Diego_Aaron_Alonso_Garcia.jpeg',
    'Emiliano_Rodríguez_Hernández.jpeg','Iram_Habid_Barrientos_García.jpeg',
    'Isaí_Daniel_Gómez_García.jpeg','Isaías_Adrian_Alvarado_Hernández.jpeg',
    'Israel_Rivera_Hernández.jpeg','Jimenez_Carbajal_Johan_Eduardo.jpeg',
    'Joel_Martinez_Cruz.jpeg','Jose_Emiliano_Sánchez_Gaspar.jpeg',
    'Josue_Alfredo_Vázquez_Valadez.jpeg','José_Asael_Rascon_Gurrola.jpeg',
    'José_Carlos_Rivaldo_Silva_Baez.jpeg','José_Eduardo_Islas_Hernandez.jpeg',
    'José_Francisco_González_Ceniceros.jpeg','Kevin_Damian_Alvarado_Montiel.jpeg',
    'Kevin_Isael_Visoso_Lázaro.jpeg','Leonardo_Briones_Duran.jpeg',
    'Leonardo_Madrigal_Velázquez.jpeg','Luis_Daniel_Martinez_Avedaño.jpeg',
    'Matteo_Cardona_Miranda.jpeg','Mauricio_Fuentes_Ramos.jpeg',
    'Miguel_Gutierrez_Cervantes.jpeg','William_Alfredo_Turrubiates_Camacho.jpeg'
];

function normalizeStr(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function toTitleCase(str) {
    if (!str) return '';
    return str.trim().toLowerCase()
        .split(' ')
        .filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function findPlayerImage(nombre, apellido) {
    const fullName = normalizeStr(`${nombre || ''} ${apellido || ''}`);
    const firstName = normalizeStr(nombre || '');

    for (const img of PLAYER_IMAGES) {
        const parts = img.split('.')[0].split('_');
        parts.pop();
        const imgName = normalizeStr(parts.join(' '));
        if (imgName === fullName) return `assets/PlantillaLigaTDP_2026/${img}`;
        if (fullName && imgName.includes(firstName) && firstName.length > 2) {
            const ap = normalizeStr(apellido || '');
            if (ap && imgName.includes(ap.split(' ')[0])) return `assets/PlantillaLigaTDP_2026/${img}`;
        }
    }
    for (const img of PLAYER_IMAGES_SOLES) {
        const imgName = normalizeStr(img.split('.')[0].split('_').join(' '));
        if (imgName === fullName) return `assets/JugadoresSoles/${img}`;
        if (fullName && imgName.includes(firstName) && firstName.length > 2) {
            const ap = normalizeStr(apellido || '');
            if (ap && imgName.includes(ap.split(' ')[0])) return `assets/JugadoresSoles/${img}`;
        }
    }
    for (const img of PLAYER_IMAGES_FUERZAS) {
        const imgName = normalizeStr(img.split('.')[0].split('_').join(' '));
        if (imgName === fullName) return `assets/JugadoresFuerzasBasicas/${img}`;
        if (fullName && imgName.includes(firstName) && firstName.length > 2) {
            const ap = normalizeStr(apellido || '');
            if (ap && imgName.includes(ap.split(' ')[0])) return `assets/JugadoresFuerzasBasicas/${img}`;
        }
    }
    return null;
}

// ── Week helper ──────────────────────────────────────────────
function getWeekSunday(isoWeek) {
    // isoWeek: "2026-W12"
    if (!isoWeek) return null;
    const [year, w] = isoWeek.split('-W').map(Number);
    // Jan 4 is always in week 1
    const jan4 = new Date(year, 0, 4);
    const day = jan4.getDay() || 7; // Mon=1..Sun=7
    const monday = new Date(jan4.getTime() - (day - 1) * 86400000 + (w - 1) * 7 * 86400000);
    const sunday = new Date(monday.getTime() + 6 * 86400000);
    return sunday;
}

function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Main loader ──────────────────────────────────────────────
async function loadJugadoresSemana() {
    const container = document.getElementById('featuredPlayersGrid');
    const weekLabel = document.getElementById('featuredWeekLabel');
    if (!container) return;

    // Skeleton loading state
    container.innerHTML = `<div class="featured-loading">
        <div class="featured-spinner"></div>
        <p>Cargando jugadores destacados...</p>
    </div>`;

    try {
        // 1. Load all players map
        const playersSnap = await getDocs(collection(db, 'jugadores'));
        const playerMap = {};
        playersSnap.forEach(d => { playerMap[d.id] = { id: d.id, ...d.data() }; });

        // 2. Load all evaluaciones
        const evalsSnap = await getDocs(collection(db, 'evaluaciones'));
        const evals = [];
        evalsSnap.forEach(d => { evals.push({ id: d.id, ...d.data() }); });

        if (evals.length === 0) {
            container.innerHTML = '<p class="featured-empty">No hay evaluaciones registradas aún.</p>';
            return;
        }

        // 3. Find the single most recent evaluation week across ALL evals
        const allWeeks = [...new Set(evals.map(e => e.semana).filter(s => s && s.includes('-W')))].sort();
        const latestWeek = allWeeks[allWeeks.length - 1];

        console.log('[JS] Total evals:', evals.length, '| Semanas:', allWeeks, '| Semana activa:', latestWeek);

        // Show week end date
        const sunday = getWeekSunday(latestWeek);
        if (weekLabel && sunday) {
            weekLabel.textContent = `Semana del ${formatDate(sunday)}`;
        }

        // 4. Filter to evaluations from that week only
        const evalsThisWeek = evals.filter(e => e.semana === latestWeek);
        console.log('[JS] Evals esta semana:', evalsThisWeek.length);

        // Group evals by player (a player may have multiple evals in one week)
        const evalsByPlayer = {};
        for (const ev of evalsThisWeek) {
            const pid = ev.jugadorId;
            if (!pid) continue;
            if (!evalsByPlayer[pid]) evalsByPlayer[pid] = [];
            evalsByPlayer[pid].push(ev);
        }

        // Compute aggregate stats for each player this week
        const playerStats = {};
        for (const [pid, evList] of Object.entries(evalsByPlayer)) {
            const numAvg = key => {
                const vals = evList.map(e => parseFloat(e[key])).filter(n => isFinite(n));
                return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
            };
            const numSum = key => evList.map(e => parseFloat(e[key]) || 0).reduce((a, b) => a + b, 0);

            const pg = numAvg('promedioGeneral');
            if (pg === null) continue; // skip players with no valid promedio

            playerStats[pid] = {
                pid,
                promedioGeneral:   pg,
                rendimientoCancha: numAvg('rendimientoCancha'), // null if all 'RP'
                minutosJugados:    numSum('minutosJugados'),
            };
        }

        // Helper: returns true if b is strictly better than a
        function beats(a, b) {
            if (b.promedioGeneral > a.promedioGeneral) return true;
            if (b.promedioGeneral < a.promedioGeneral) return false;
            // Tiebreak 1: rendimientoCancha (null → -1)
            const ra = a.rendimientoCancha ?? -1;
            const rb = b.rendimientoCancha ?? -1;
            if (rb > ra) return true;
            if (rb < ra) return false;
            // Tiebreak 2: minutosJugados
            return b.minutosJugados > a.minutosJugados;
        }

        // For each category, find the best player this week
        const winners = {};
        for (const [pid, stats] of Object.entries(playerStats)) {
            const player = playerMap[pid];
            if (!player) continue;
            const cat = normalizeCategoria(player.categoria);
            if (!CATEGORIAS.includes(cat)) continue;

            console.log(`[JS] ${cat} | ${player.nombre} ${player.apellido} | prom:${stats.promedioGeneral.toFixed(2)} | rc:${stats.rendimientoCancha} | min:${stats.minutosJugados}`);

            if (!winners[cat] || beats(winners[cat].stats, stats)) {
                winners[cat] = { player, stats, score: stats.promedioGeneral };
            }
        }

        console.log('[JS] Ganadores:', Object.fromEntries(
            Object.entries(winners).map(([k, v]) => [k, `${v.player?.nombre} ${v.player?.apellido} (${v.score?.toFixed(2)})`])
        ));

        // 5. Render
        const cards = CATEGORIAS.map(cat => {
            const w = winners[cat];
            const color = CATEGORY_COLORS[cat] || 'linear-gradient(135deg,#666,#333)';

            if (!w) {
                return `
                <div class="featured-player-card" style="--card-gradient:${color}">
                    <div class="fpc-badge">${cat}</div>
                    <div class="fpc-photo-wrap fpc-no-photo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div class="fpc-body">
                        <p class="fpc-no-data">Sin evaluaciones esta semana</p>
                    </div>
                </div>`;
            }

            const { player, stats, score } = w;
            const nombre = toTitleCase(player.nombre || '');
            const apellido = toTitleCase(player.apellido || '');
            const fullName = `${nombre} ${apellido}`.trim();
            const imgSrc = findPlayerImage(nombre, apellido);
            const initials = ((nombre.charAt(0) || '') + (apellido.charAt(0) || '')).toUpperCase() || '?';
            const posicion = player.posicion || 'Sin posición';
            const scoreStr = score.toFixed(1);
            let scoreClass = 'fpc-score-low';
            if (score >= 7) scoreClass = 'fpc-score-high';
            else if (score >= 5) scoreClass = 'fpc-score-mid';

            const photoHTML = imgSrc
                ? `<img src="${imgSrc}" alt="${fullName}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                : '';
            const fallback = `<div class="fpc-initials" ${imgSrc ? 'style="display:none"' : ''}>${initials}</div>`;

            return `
            <div class="featured-player-card" style="--card-gradient:${color}">
                <div class="fpc-badge">${cat}</div>
                <div class="fpc-photo-wrap">
                    ${photoHTML}
                    ${fallback}
                    <div class="fpc-score-badge ${scoreClass}">${scoreStr}</div>
                </div>
                <div class="fpc-body">
                    <h3 class="fpc-name">${fullName}</h3>
                    <p class="fpc-pos">${posicion}</p>
                    <div class="fpc-avg-row">
                        <span class="fpc-avg-label">Promedio Semanal</span>
                        <span class="fpc-avg-val ${scoreClass}">${scoreStr}</span>
                    </div>
                </div>
                <div class="fpc-footer-bar"></div>
            </div>`;
        });

        container.innerHTML = cards.join('');

    } catch (err) {
        console.error('Error loading jugadores destacados:', err);
        container.innerHTML = '<p class="featured-empty">No se pudieron cargar los jugadores destacados.</p>';
    }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', loadJugadoresSemana);
