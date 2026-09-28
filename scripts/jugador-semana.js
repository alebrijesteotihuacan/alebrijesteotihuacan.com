/*
    jugador-semana.js
    ------------------------------------------------------------------------
    "Mejores Jugadores de la Semana" — vista pública del home.
    ------------------------------------------------------------------------
    Lee de public.featured_players_v (vista anon-readable). Para cada
    categoría (key) muestra al jugador con mayor promedio_general en la
    última semana con evaluaciones. La categoría se infiere desde
    categoria o, si está vacía, desde equipo.

    Card minimal: FOTO vertical + SCORE grande + NOMBRE. Nada más.
*/

import { supabase } from './supabase-client.js';

// ── Categorías canónicas (orden de aparición) ────────────────────────────
const CATEGORIES_ORDER = [
    'Alebrijes TDP',
    'Soles TDP',
    'Liga de Expansión',
    'Liga Premier',
    'Sub-18',
    'Sub-16',
    'Sub-14',
];

const CATEGORY_COLORS = {
    'Alebrijes TDP':      'linear-gradient(135deg, #F36A21 0%, #C7490E 100%)',
    'Soles TDP':          'linear-gradient(135deg, #FF8C42 0%, #E85D26 100%)',
    'Liga Premier':       'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    'Liga de Expansión':  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    'Sub-18':             'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    'Sub-16':             'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    'Sub-14':             'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
};
const FALLBACK_COLOR = 'linear-gradient(135deg, #F36A21 0%, #C7490E 100%)';

// ── Resolver la categoría display ────────────────────────────────────────
function categoryFromPlayer(player) {
    const directCat = (player.categoria || '').trim();
    if (directCat && CATEGORIES_ORDER.includes(directCat)) {
        return { key: directCat, sub: '', label: directCat };
    }

    const eq = (player.equipo || '').trim();
    if (!eq) {
        return { key: directCat || 'Otros', sub: '', label: directCat || 'Otros' };
    }
    if (eq === 'Alebrijes TDP') return { key: 'Alebrijes TDP', sub: '', label: 'Alebrijes TDP' };

    const solesMatch = eq.match(/^Soles TDP(?:\s+(Sub-\d+))?$/i);
    if (solesMatch) {
        const sub = solesMatch[1] || '';
        return { key: 'Soles TDP', sub, label: 'Soles TDP' };
    }
    const subMatch = eq.match(/^(Sub-\d+)$/);
    if (subMatch) return { key: subMatch[1], sub: '', label: subMatch[1] };

    const expansion = /Ligas?\s+de\s+Expansi(o|ó)n/i;
    if (expansion.test(eq)) return { key: 'Liga de Expansión', sub: '', label: 'Liga de Expansión' };
    if (/Liga\s+Premier/i.test(eq)) return { key: 'Liga Premier', sub: '', label: 'Liga Premier' };

    return { key: eq || 'Otros', sub: '', label: eq || 'Otros' };
}

// ── Helpers ──────────────────────────────────────────────────────────────
function normalizeStr(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function toTitleCase(str) {
    if (!str) return '';
    return str.trim().toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}
function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function escapeAttr(s) { return escapeHtml(s); }

// Tonos del score (alto / medio / bajo)
function scoreClass(score) {
    const n = Number(score);
    if (!Number.isFinite(n)) return 'fpc-tone-low';
    if (n >= 8)   return 'fpc-tone-high';
    if (n >= 6.5) return 'fpc-tone-mid';
    return 'fpc-tone-low';
}

// ── Image helpers (mismo set que panel-profesor) ──────────────────────────
const PLAYER_IMAGES = [
    'Rafael_Arturo_Tejeda_Arellano_DirectorTecnico.jpg',
    'Roberto_Alcantar_Piña_Portero_1.jpg',
    'Joshua_Alejo_Hernández_Portero_12.jpg',
    'Miguel_Angel_Rodriguez_Luna_Portero_25.jpg',
    'Luis_Jareth_Dominguez_Meza_Defensa_2.jpg',
    'Deivid_Antony_Fuentes_Acevedo_Defensa_3.jpg',
    'José_Luis_Tavares_Torres_Defensa_4.jpg',
    'Angel_Uriel_Castillo_Ramirez_Defensa_5.jpg',
    'Jose_Julian_Linares_Mendoza_Defensa_13.jpg',
    'Gerardo_Gael_Uribe_Ponce_Defensa_14.jpg',
    'Iram_Habid_Barrientos_Garcia_Defensa_15.jpg',
    'Juan_Ramírez_Bautista_Defensa_16.jpg',
    'Diego_Luna_Librado_Defensa_17.jpg',
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
    'Diego_Ivan_Ramirez_Gonzalez_Delantero_9.jpg',
    'Alexis_Eduardo_Cagal_Cruz_Delantero_20.jpg',
    'Cesar_Alexis_Varela_Castillo_Delantero_27.jpg',
    'Franco_Luciano_Cruz_Benitez_Delantero_28.jpg',
    'Oscar_Gabriel_Ortega_Ramos_Delantero_29.jpg',
    'Iker_Castillo_Tede_Delantero_32.jpg'
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
    'Abdiel_Monroy_García.jpeg', 'Aldo_Emmanuel_Cortes_Santiago.jpeg', 'Alejandro_Aguilar_Reyes.jpeg',
    'Alexander_Martínez_Domínguez.jpeg', 'Angel_David_Mendez_Hernandez.jpeg', 'Asiel_Zaid_Montoya_Rojas.jpeg',
    'Axel_Antonio_Vázquez_Estrada.jpeg', 'Brandon_Uziel_Moya_Marquez.jpeg', 'Bruno_Arroyo_Sánchez.jpeg',
    'Cesar_Alexis_Varela_Castillo.jpeg', 'David_Salvador_Téllez.jpeg', 'Dejan_Kaled_Ramírez_Guijano.jpeg',
    'Demian_Marcus_Arregui_Nava.jpeg', 'Derek_Jesús_Hernández_Licea.jpeg', 'Diego_Aaron_Alonso_Garcia.jpeg',
    'Diego_Joel_Miros_García.jpeg', 'Dylan_Quijano_Xolo.jpeg', 'Emiliano_Rodríguez_Hernández.jpeg',
    'Iker_Damián_Ortega_Villegas.jpeg', 'Iram_Habid_Barrientos_García.jpeg', 'Irving_Nuñez_Fuentes.jpeg',
    'Isaí_Daniel_Gómez_García.jpeg', 'Isaías_Adrian_Alvarado_Hernández.jpeg', 'Israel_Rivera_Hernández.jpeg',
    'Jimenez_Carbajal_Johan_Eduardo.jpeg', 'Joel_Martinez_Cruz.jpeg', 'Johan_Miguel_Patricio_Casales.jpeg',
    'Jose_Emiliano_Sánchez_Gaspar.jpeg', 'Joshua_Dominguez_Acosta.jpeg', 'Josue_Alfredo_Vázquez_Valadez.jpeg',
    'José_Asael_Rascon_Gurrola.jpeg', 'José_Carlos_Rivaldo_Silva_Baez.jpeg', 'José_Eduardo_Islas_Hernandez.jpeg',
    'José_Francisco_González_Ceniceros.jpeg', 'Juan_Carlos_Maravilla_Maldonado.jpeg', 'Kevin_Damian_Alvarado_Montiel.jpeg',
    'Kevin_Isael_Visoso_Lázaro.jpeg', 'Leonardo_Briones_Duran.jpeg', 'Leonardo_Madrigal_Velázquez.jpeg',
    'Luis_Daniel_Martinez_Avedaño.jpeg', 'Luis_David_Olvera_Huerta.jpeg', 'Luis_Yael_Rodriguez_Muñoz.jpeg',
    'Matteo_Cardona_Miranda.jpeg', 'Matteo_González_Rodríguez.jpeg', 'Mauricio_Fuentes_Ramos.jpeg',
    'Mauricio_Mendoza_Montoya.jpeg', 'Miguel_Gutierrez_Cervantes.jpeg', 'Nicolas_Oliva_Pérez.jpeg',
    'Ricardo_Rodriguez_Montiel.jpeg', 'Uriel_Urieta_Robles.jpeg', 'Victor_Javier_Bautista_Avendaño.jpeg',
    'William_Alfredo_Turrubiates_Camacho.jpeg', 'Ángel_David_Sanchez_Jimenez.jpeg'
];

function findPlayerImage(nombre, apellido) {
    const fullName = normalizeStr(`${nombre || ''} ${apellido || ''}`);
    const firstName = normalizeStr(nombre || '');
    const firstApellido = normalizeStr((apellido || '').split(' ')[0] || '');

    function search(list, folder) {
        for (const img of list) {
            const imgName = normalizeStr(img.split('.')[0].split('_').join(' '));
            if (imgName === fullName) return `assets/${folder}/${img}`;
            if (firstName.length > 2 && imgName.includes(firstName) && firstApellido && imgName.includes(firstApellido)) {
                return `assets/${folder}/${img}`;
            }
        }
        return null;
    }

    return (
        search(PLAYER_IMAGES, 'PlantillaAlebrijesTeotihuacanLigaTDP') ||
        search(PLAYER_IMAGES_SOLES, 'JugadoresSoles') ||
        search(PLAYER_IMAGES_FUERZAS, 'JugadoresFuerzasBasicas')
    );
}

// ── Week helper ─────────────────────────────────────────────────────────
function getWeekSunday(isoWeek) {
    if (!isoWeek) return null;
    const [year, w] = isoWeek.split('-W').map(Number);
    const jan4 = new Date(year, 0, 4);
    const day = jan4.getDay() || 7;
    const monday = new Date(jan4.getTime() - (day - 1) * 86400000 + (w - 1) * 7 * 86400000);
    return new Date(monday.getTime() + 6 * 86400000);
}
function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Card markup: solo foto + nombre + score ─────────────────────────────
function renderCard({ winner }) {
    if (!winner) {
        return `
            <article class="featured-player-card fpc-empty">
                <div class="fpc-photo">
                    <div class="fpc-initials">--</div>
                </div>
                <div class="fpc-corner">
                    <span class="fpc-score fpc-tone-na">--<i>/10</i></span>
                </div>
                <div class="fpc-name">Sin evaluacion esta semana</div>
            </article>
        `;
    }

    const { player, score } = winner;
    const nombre = toTitleCase(player.nombre || '');
    const apellido = toTitleCase(player.apellido || '');
    const fullName = `${nombre} ${apellido}`.trim() || 'Jugador';

    const initials = ((nombre.charAt(0) || '') + (apellido.charAt(0) || '')).toUpperCase() || '?';
    const imgSrc = findPlayerImage(nombre, apellido);
    const scoreStr = Number.isFinite(Number(score)) ? Number(score).toFixed(1) : '--';
    const tone = scoreClass(score);

    const photoHTML = imgSrc
        ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(fullName)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling && (this.nextElementSibling.style.display='flex');">`
        : '';
    const initialsHTML = `<div class="fpc-initials" ${imgSrc ? 'style="display:none;"' : ''}>${escapeHtml(initials)}</div>`;

    return `
        <article class="featured-player-card">
            <div class="fpc-photo">
                ${photoHTML}
                ${initialsHTML}
            </div>
            <div class="fpc-corner">
                <span class="fpc-score ${tone}">${escapeHtml(scoreStr)}<i>/10</i></span>
            </div>
            <div class="fpc-name">${escapeHtml(fullName)}</div>
        </article>
    `;
}

// ── Main loader ────────────────────────────────────────────────────────
async function loadJugadoresSemana() {
    const container = document.getElementById('featuredPlayersGrid');
    const weekLabel = document.getElementById('featuredWeekLabel');
    const sectionDesc = document.getElementById('featuredSectionDesc');
    if (!container) return;

    container.innerHTML = `
        <div class="featured-loading">
            <div class="featured-spinner"></div>
            <p>Identificando a los jugadores destacados...</p>
        </div>`;

    try {
        // Una sola query anon-readable
        const { data: rows, error } = await supabase
            .from('featured_players_v')
            .select('jugador_id, nombre, apellido, posicion, dorsal, equipo, categoria, evaluacion_id, semana, promedio_general, rendimiento_cancha, minutos_jugados, fecha_eval');

        if (error) {
            console.error('Supabase error:', error);
            container.innerHTML = '<p class="featured-empty">No se pudieron cargar los jugadores destacados.</p>';
            return;
        }
        if (!rows || rows.length === 0) {
            container.innerHTML = '<p class="featured-empty">Aun no hay jugadores registrados en el sistema.</p>';
            if (weekLabel) weekLabel.textContent = '';
            return;
        }

        // 1. Encontrar la semana más reciente con evaluaciones
        const weeks = [...new Set(rows.map(r => r.semana).filter(s => s && s.includes('-W')))].sort();
        const latestWeek = weeks[weeks.length - 1];
        if (!latestWeek) {
            container.innerHTML = '<p class="featured-empty">Aun no hay evaluaciones registradas.</p>';
            if (weekLabel) weekLabel.textContent = '';
            return;
        }
        const sunday = getWeekSunday(latestWeek);
        if (weekLabel) weekLabel.textContent = `Semana del ${formatDate(sunday)}`;
        if (sectionDesc) sectionDesc.style.display = '';

        // 2. Mejor jugador por categoría en esa semana
        function beats(a, b) {
            if (!a) return true;
            if (!b) return false;
            const ap = Number(a.promedio_general), bp = Number(b.promedio_general);
            if (bp !== ap) return bp > ap;
            const ar = Number(a.rendimiento_cancha) || -1;
            const br = Number(b.rendimiento_cancha) || -1;
            if (br !== ar) return br > ar;
            const am = Number(a.minutos_jugados) || 0;
            const bm = Number(b.minutos_jugados) || 0;
            if (bm !== am) return bm > am;
            return String(a.jugador_id) < String(b.jugador_id);
        }

        const winnersByKey = {};
        for (const row of rows) {
            if (row.semana !== latestWeek) continue;
            const pg = Number(row.promedio_general);
            if (!Number.isFinite(pg)) continue;
            const cat = categoryFromPlayer({
                categoria: row.categoria,
                equipo: row.equipo,
            });
            const candidate = {
                jugador_id: row.jugador_id,
                promedio_general: row.promedio_general,
                rendimiento_cancha: row.rendimiento_cancha,
                minutos_jugados: row.minutos_jugados,
                player: row,
            };
            const cur = winnersByKey[cat.key];
            if (!cur || beats(cur, candidate)) {
                winnersByKey[cat.key] = candidate;
            }
        }

        // 3. Orden de aparición (canónico + alfabético para dinámicas)
        const winnerKeys = Object.keys(winnersByKey);
        const orderedKeys = [];
        for (const k of CATEGORIES_ORDER) {
            if (winnerKeys.includes(k)) orderedKeys.push(k);
        }
        for (const k of winnerKeys.sort()) {
            if (!CATEGORIES_ORDER.includes(k)) orderedKeys.push(k);
        }

        // 4. Render mínimo
        const cards = orderedKeys.map(key => {
            const w = winnersByKey[key];
            const color = CATEGORY_COLORS[key] || FALLBACK_COLOR;
            const card = renderCard({ winner: w ? { player: w.player, score: w.promedio_general } : null });
            // inyectar color de categoría como CSS var en el wrapper
            return `<div class="fpc-slot" style="--slot-color:${color}">${card}</div>`;
        });

        container.innerHTML = cards.join('');
    } catch (err) {
        console.error('Error loading jugadores destacados:', err);
        container.innerHTML = '<p class="featured-empty">No se pudieron cargar los jugadores destacados en este momento.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadJugadoresSemana);
