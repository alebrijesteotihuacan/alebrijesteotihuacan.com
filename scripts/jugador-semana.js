/*
    jugador-semana.js
    ------------------------------------------------------------------------
    "Mejores Jugadores de la Semana"
    ------------------------------------------------------------------------
    Carga para cada categoría (key) al jugador con mayor promedio_general en
    la última semana con evaluaciones registradas. La categoría se resuelve
    desde jugadores.categoria y, si está vacía, se deriva de jugadores.equipo.

    Diseño: card institucional con foto vertical, score-badge prominente y
    grid de criterios. Estética dark-bg institucional coherente con el sitio.
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

// Colores por key (algunos derivados comparten gradiente similar)
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

// ── Resolver la categoría display de un jugador ─────────────────────────
// Devuelve { key, sub, label }
//   key     = identificador del grupo (se usa para agrupar)
//   sub     = subetiqueta (e.g. "Sub-16" si el equipo es "Soles TDP Sub-16")
//   label   = etiqueta a mostrar en el chip grande
function categoryFromPlayer(player) {
    // 1. categoria directa tiene prioridad si está en la lista canónica
    const directCat = (player.categoria || '').trim();
    if (directCat && CATEGORIES_ORDER.includes(directCat)) {
        return { key: directCat, sub: '', label: directCat };
    }

    // 2. derivar desde equipo
    const eq = (player.equipo || '').trim();
    if (!eq) {
        return { key: directCat || 'Otros', sub: '', label: directCat || 'Otros' };
    }

    if (eq === 'Alebrijes TDP') {
        return { key: 'Alebrijes TDP', sub: '', label: 'Alebrijes TDP' };
    }

    const solesMatch = eq.match(/^Soles TDP(?:\s+(Sub-\d+))?$/i);
    if (solesMatch) {
        const sub = solesMatch[1] || '';
        return { key: 'Soles TDP', sub, label: 'Soles TDP' };
    }

    const subMatch = eq.match(/^(Sub-\d+)$/);
    if (subMatch) {
        return { key: subMatch[1], sub: '', label: subMatch[1] };
    }

    const expansion = /Ligas?\s+de\s+Expansi(o|ó)n/i;
    if (expansion.test(eq)) {
        return { key: 'Liga de Expansión', sub: '', label: 'Liga de Expansión' };
    }
    if (/Liga\s+Premier/i.test(eq)) {
        return { key: 'Liga Premier', sub: '', label: 'Liga Premier' };
    }

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

// Score tono (alto / medio / bajo)
function scoreClass(score) {
    const n = Number(score);
    if (!Number.isFinite(n)) return 'fpc-score-low';
    if (n >= 8) return 'fpc-score-high';
    if (n >= 6.5) return 'fpc-score-mid';
    return 'fpc-score-low';
}

function scoreClassNumeric(score) {
    const n = Number(score);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, (n / 10) * 100));
}

// ── Image helpers (panel-profesor style) ────────────────────────────────
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

// ── Render helpers ──────────────────────────────────────────────────────
function renderScoreCircle(score) {
    const s = Number(score);
    const pct = scoreClassNumeric(s);
    const r = 28;
    const c = 2 * Math.PI * r;
    const dashOffset = c * (1 - pct / 100);
    return `
        <div class="fpc-score-circle ${scoreClass(s)}">
            <svg class="fpc-score-ring" viewBox="0 0 64 64" aria-hidden="true">
                <circle class="fpc-score-ring-track" cx="32" cy="32" r="${r}" />
                <circle class="fpc-score-ring-fill" cx="32" cy="32" r="${r}"
                    style="stroke-dasharray: ${c.toFixed(2)}; stroke-dashoffset: ${dashOffset.toFixed(2)};" />
            </svg>
            <div class="fpc-score-num">
                <span class="fpc-score-value">${Number.isFinite(s) ? s.toFixed(1) : '--'}</span>
                <span class="fpc-score-cap">/ 10</span>
            </div>
        </div>
    `;
}

function renderSpecs(ev) {
    const rc = ev.rendimiento_cancha;
    const isRP = (typeof rc === 'string' && rc.toUpperCase() === 'RP') || rc === 'RP';
    const rcDisplay = rc === undefined || rc === null
        ? '—'
        : (isRP ? 'RP' : Number(rc).toFixed(1));

    const min = Number(ev.minutos_jugados);
    const minutosDisplay = Number.isFinite(min) && min > 0 ? `${min}'` : '—';

    const semana = ev.semana || '—';

    return [
        { label: 'Rend. Cancha', value: rcDisplay },
        { label: 'Minutos', value: minutosDisplay },
        { label: 'Semana', value: semana },
    ];
}

function renderCard({ key, sub, label, color, winner }) {
    const catLabel = escapeHtml(label);
    const subLabel = sub ? `<span class="fpc-sub">${escapeHtml(sub)}</span>` : '';

    if (!winner) {
        return `
            <article class="featured-player-card" style="--card-gradient:${color}">
                <div class="fpc-strip">
                    <span class="fpc-cat">${catLabel}</span>
                    ${subLabel}
                </div>
                <div class="fpc-photo-wrap fpc-photo-empty">
                    <div class="fpc-jersey-watermark">--</div>
                    <div class="fpc-score-circle fpc-score-na fpc-score-empty-state">
                        <svg class="fpc-score-ring" viewBox="0 0 64 64" aria-hidden="true">
                            <circle class="fpc-score-ring-track" cx="32" cy="32" r="28" />
                        </svg>
                        <div class="fpc-score-num">
                            <span class="fpc-score-value">--</span>
                            <span class="fpc-score-cap">N/D</span>
                        </div>
                    </div>
                </div>
                <div class="fpc-body">
                    <h3 class="fpc-name">Sin evaluacion esta semana</h3>
                    <p class="fpc-pos">Aun no hay registros para esta categoria</p>
                    <div class="fpc-divider"></div>
                    <p class="fpc-no-data-text">Volveremos a publicar al jugador destacado cuando el cuerpo tecnico registre una nueva evaluacion.</p>
                </div>
                <div class="fpc-footer-bar"></div>
            </article>
        `;
    }

    const { player, stats, ev } = winner;
    const nombre = toTitleCase(player.nombre || '');
    const apellido = toTitleCase(player.apellido || '');
    const fullName = `${nombre} ${apellido}`.trim() || 'Jugador';
    const dorsal = player.numero_camiseta;
    const dorsalText = dorsal !== null && dorsal !== undefined && dorsal !== '' ? `#${dorsal}` : '';

    const initials = ((nombre.charAt(0) || '') + (apellido.charAt(0) || '')).toUpperCase() || '?';
    const imgSrc = findPlayerImage(nombre, apellido);

    const posicion = player.posicion || 'Sin posicion definida';
    const equipoShow = player.equipo && player.equipo !== label
        ? player.equipo
        : '';

    const specs = renderSpecs(ev);
    const specsHTML = specs.map(s => `
        <div class="fpc-spec">
            <span class="fpc-spec-label">${escapeHtml(s.label)}</span>
            <span class="fpc-spec-value">${escapeHtml(String(s.value))}</span>
        </div>
    `).join('');

    const photoHTML = imgSrc
        ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(fullName)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling && (this.nextElementSibling.style.display='flex');">`
        : '';
    const initialsHTML = `<div class="fpc-initials" ${imgSrc ? 'style="display:none;"' : ''}>${escapeHtml(initials)}</div>`;

    const evaluador = ev.evaluador_nombre ? `Evaluo: ${escapeHtml(ev.evaluador_nombre)}` : 'Evaluo: Cuerpo Tecnico';

    return `
        <article class="featured-player-card" style="--card-gradient:${color}">
            <div class="fpc-strip">
                <span class="fpc-cat">${catLabel}</span>
                ${subLabel}
            </div>
            <div class="fpc-photo-wrap">
                ${photoHTML}
                ${initialsHTML}
                <div class="fpc-jersey-watermark" aria-hidden="true">${escapeHtml(dorsalText || initials)}</div>
                ${renderScoreCircle(stats.promedioGeneral)}
            </div>
            <div class="fpc-body">
                <h3 class="fpc-name">${escapeHtml(fullName)}</h3>
                <p class="fpc-pos">${escapeHtml(posicion)}${equipoShow ? ` · ${escapeHtml(equipoShow)}` : ''}</p>
                <div class="fpc-divider"></div>
                <div class="fpc-specs">
                    ${specsHTML}
                </div>
                <div class="fpc-evaluador">${evaluador}</div>
            </div>
            <div class="fpc-footer-bar"></div>
        </article>
    `;
}

function escapeHtml(s) {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function escapeAttr(s) {
    return escapeHtml(s);
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
        // 1. Players + evaluations
        const [{ data: playersRows }, { data: evalsRows }] = await Promise.all([
            supabase.from('jugadores').select('*'),
            supabase.from('evaluaciones').select('*'),
        ]);
        const players = (playersRows || []).map(r => ({ id: r.id, ...r }));
        const evals = (evalsRows || []).map(r => ({ id: r.id, ...r }));

        // 2. Latest week with at least one eval
        const weeks = [...new Set(evals.map(e => e.semana).filter(s => s && s.includes('-W')))].sort();
        const latestWeek = weeks[weeks.length - 1];
        if (!latestWeek) {
            container.innerHTML = '<p class="featured-empty">Aun no hay evaluaciones registradas en el sistema.</p>';
            if (weekLabel) weekLabel.textContent = '';
            return;
        }

        const sunday = getWeekSunday(latestWeek);
        if (weekLabel) weekLabel.textContent = `Semana del ${formatDate(sunday)}`;
        if (sectionDesc) sectionDesc.style.display = '';

        // 3. Aggregate latest-week stats per jugador
        const evalsByPlayer = {};
        for (const ev of evals) {
            if (ev.semana !== latestWeek) continue;
            if (!ev.jugador_id) continue;
            if (!evalsByPlayer[ev.jugador_id]) evalsByPlayer[ev.jugador_id] = [];
            evalsByPlayer[ev.jugador_id].push(ev);
        }

        const playerStats = {};
        for (const [pid, list] of Object.entries(evalsByPlayer)) {
            const numAvg = key => {
                const vals = list.map(e => parseFloat(e[key])).filter(n => Number.isFinite(n));
                return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
            };
            const numSum = key => list.map(e => parseFloat(e[key]) || 0).reduce((a, b) => a + b, 0);

            const pg = numAvg('promedio_general');
            if (pg === null) continue;

            playerStats[pid] = {
                pid,
                promedioGeneral: pg,
                rendimientoCancha: numAvg('rendimiento_cancha'),
                minutosJugados: numSum('minutos_jugados'),
            };
        }

        // 4. Best per category
        function beats(a, b) {
            if (!a) return true;
            if (!b) return false;
            if (b.promedioGeneral !== a.promedioGeneral) return b.promedioGeneral > a.promedioGeneral;
            const ra = a.rendimientoCancha ?? -1;
            const rb = b.rendimientoCancha ?? -1;
            if (rb !== ra) return rb > ra;
            if (b.minutosJugados !== a.minutosJugados) return b.minutosJugados > a.minutosJugados;
            return a.pid < b.pid; // tiebreak determinista
        }

        // Agrupa por key
        const playerById = Object.fromEntries(players.map(p => [p.id, p]));
        const latestEvalByPlayer = {};
        for (const ev of evals) {
            if (ev.semana !== latestWeek) continue;
            if (!ev.jugador_id) continue;
            const cur = latestEvalByPlayer[ev.jugador_id];
            const evDate = new Date(ev.fecha || 0).getTime();
            if (!cur || evDate > new Date(cur.fecha || 0).getTime()) {
                latestEvalByPlayer[ev.jugador_id] = ev;
            }
        }

        const winnersByKey = {};
        for (const [pid, stats] of Object.entries(playerStats)) {
            const player = playerById[pid];
            if (!player) continue;
            const cat = categoryFromPlayer(player);
            const cur = winnersByKey[cat.key];
            if (!cur || beats(cur.stats, stats)) {
                winnersByKey[cat.key] = {
                    player,
                    stats,
                    category: cat,
                    ev: latestEvalByPlayer[pid],
                };
            }
        }

        // 5. Compose visible categories.
        // Solo se muestran categorías con ganador — la UI ya no muestra
        // tarjetas vacías. El orden viene del CATEGORIES_ORDER canónico,
        // seguido de cualquier categoría dinámica nueva (alfabética).
        const winnerKeys = Object.keys(winnersByKey);
        const orderedKeys = [];
        for (const k of CATEGORIES_ORDER) {
            if (winnerKeys.includes(k)) orderedKeys.push(k);
        }
        for (const k of winnerKeys.sort()) {
            if (!CATEGORIES_ORDER.includes(k)) orderedKeys.push(k);
        }

        // 6. Render
        const cards = orderedKeys.map(key => {
            const w = winnersByKey[key];
            const cat = w ? w.category : { key, sub: '', label: key };
            const color = CATEGORY_COLORS[key] || FALLBACK_COLOR;
            return renderCard({
                key,
                label: cat.label,
                sub: cat.sub,
                color,
                winner: w ? { player: w.player, stats: w.stats, ev: w.ev } : null,
            });
        });

        container.innerHTML = cards.join('');

    } catch (err) {
        console.error('Error loading jugadores destacados:', err);
        container.innerHTML = '<p class="featured-empty">No se pudieron cargar los jugadores destacados en este momento.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadJugadoresSemana);
