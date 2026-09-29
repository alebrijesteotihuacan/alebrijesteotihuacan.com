/*
    jugador-semana.js
    ------------------------------------------------------------------------
    "Mejores Jugadores de la Semana" — vista pública del home.
    ------------------------------------------------------------------------
    Lee de public.featured_players_v (vista anon-readable). Para cada
    categoría muestra al jugador con mayor promedio_general en la última
    semana con evaluaciones.

    Card horizontal compact: foto cuadrada + (eyebrow categoria) + nombre
    + score a la derecha. Sin watermarks, sin specs grid, sin descripción.
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
    'Alebrijes TDP':      'linear-gradient(90deg, #F36A21 0%, #C7490E 100%)',
    'Soles TDP':          'linear-gradient(90deg, #FF8C42 0%, #E85D26 100%)',
    'Liga Premier':       'linear-gradient(90deg, #10b981 0%, #047857 100%)',
    'Liga de Expansión':  'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
    'Sub-18':             'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
    'Sub-16':             'linear-gradient(90deg, #0ea5e9 0%, #0369a1 100%)',
    'Sub-14':             'linear-gradient(90deg, #f59e0b 0%, #b45309 100%)',
};
const FALLBACK_COLOR = 'linear-gradient(90deg, #F36A21 0%, #C7490E 100%)';
const CATEGORY_INK = {
    'Alebrijes TDP':      '#F36A21',
    'Soles TDP':          '#FF8C42',
    'Liga Premier':       '#10b981',
    'Liga de Expansión':  '#3b82f6',
    'Sub-18':             '#8b5cf6',
    'Sub-16':             '#0ea5e9',
    'Sub-14':             '#f59e0b',
};
const FALLBACK_INK = '#F36A21';

// ── Resolver la categoría display ────────────────────────────────────────
function categoryFromPlayer(player) {
    const directCat = (player.categoria || '').trim();
    if (directCat && CATEGORIES_ORDER.includes(directCat)) {
        return { key: directCat, sub: '', label: directCat };
    }
    const eq = (player.equipo || '').trim();
    if (!eq) return { key: directCat || 'Otros', sub: '', label: directCat || 'Otros' };
    if (eq === 'Alebrijes TDP') return { key: 'Alebrijes TDP', sub: '', label: 'Alebrijes TDP' };

    const solesMatch = eq.match(/^Soles TDP(?:\s+(Sub-\d+))?$/i);
    if (solesMatch) return { key: 'Soles TDP', sub: solesMatch[1] || '', label: 'Soles TDP' };

    const subMatch = eq.match(/^(Sub-\d+)$/);
    if (subMatch) return { key: subMatch[1], sub: '', label: subMatch[1] };

    if (/Ligas?\s+de\s+Expansi(o|ó)n/i.test(eq)) return { key: 'Liga de Expansión', sub: '', label: 'Liga de Expansión' };
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
const PLAYER_IMAGES_SOLES_SUB16 = [
    'Iker_Alejandro_Lopez_Maldonado_Portero_801.jpg',
    'Maximiliano_Ordoñez_Mejia_Defensa_802.jpg',
    'Axel_Francisco_Ramos_Defensa_803.jpg',
    'Alejandro_Valentin_Muñoz_Alarcon_Defensa_804.jpg',
    'Jose_Rodrigo_Lopez_Gonzalez_Defensa_805.jpg',
    'Nicolas_Oliva_Perez_Defensa_806.jpg',
    'David_Salvador_Tellez_Medio_807.jpg',
    'Alan_David_Lopez_Coronel_Medio_808.jpg',
    'Andre_Gomez_Valverde_Delantero_809.jpg',
    'Angel_Gabriel_Lopez_Ventura_Medio_810.jpg',
    'Santiago_Villatoro_Garcia_Medio_811.jpg',
    'Pedro_Fabian_Flores_Madrigal_Defensa_812.jpg',
    'Ricardo_Emanuel_Oran_Garcia_Defensa_813.jpg',
    'Arturo_Harem_Enriquez_Cano_Delantero_814.jpg',
    'Iker_Garcia_Ramos_Defensa_815.jpg',
    'Helios_Arias_Martinez_Medio_816.jpg',
    'Ivan_Alonso_Moreno_Lopez_Medio_817.jpg',
    'Gael_Antonio_Villegas_Garcia_Defensa_818.jpg',
    'Victor_Javier_Bautista_Avendaño_Medio_819.jpg',
    'Santiago_Emanuel_Gomez_Tamayo_Medio_820.jpg',
    'Axel_Rene_Hernandez_Dominguez_Delantero_821.jpg',
    'Leonardo_Madrigal_Velazquez_Defensa_822.jpg',
    'Javier_Guadalupe_Mijangos_Cruz_Medio_823.jpg',
    'Braulio_Mijares_Ruiz_Portero_824.jpg',
    'Diego_Aaron_Alonso_Garcia_Portero_825.jpg',
    'Eduardo_Barros_Armas_Portero_826.jpg',
    'Mauricio_Mendoza_Montoya_Portero_827.jpg',
    'Carlos_Ruben_Gamez_Lazcano_Portero_829.jpg'
];

const PLAYER_IMAGES_SOLES_LIGATDP = [
    'Mauricio_Fuentes_Ramos_Portero_1.jpg',
    'Jaffet_Sandoval_Martinez_Defensa_2.jpg',
    'Ian_Alexander_Garcia_Martinez_Defensa_3.jpg',
    'Farid_Omar_Avendaño_Vazquez_Defensa_4.jpg',
    'Faviel_Isidro_Morales_Perez_Medio_5.jpg',
    'Kevin_Alexander_Castro_Aguilar_Medio_6.jpg',
    'Jose_Luis_Ruiz_Maldonado_Medio_7.jpg',
    'Oliver_De_Jesus_Morales_Moreno_Medio_8.jpg',
    'Jesus_Rodrigo_Vela_Ramos_Delantero_9.jpg',
    'Cristian_Fabian_Ramirez_Martinez_Medio_10.jpg',
    'Mauricio_Luna_Sanchez_Medio_11.jpg',
    'Steve_Julian_Serrano_Luevanos_Portero_12.jpg',
    'Julio_Axel_Delgado_Estrada_Portero_13.jpg',
    'Ellioth_Omar_Cuevas_Alcala_Medio_14.jpg',
    'Leandro_Gael_Contreras_Aviles_Delantero_15.jpg',
    'Jonathan_Darío_Galindo_Guerrero_Medio_16.jpg',
    'Cristobal_Rosas_Franco_Medio_17.jpg',
    'Erick_Isaac_Lopez_Borjas_Medio_18.jpg',
    'Jose_Godofredo_Pedro_Fiscal_Delantero_19.jpg',
    'Lisandro_Alain_Contreras_Dorantes_Defensa_20.jpg',
    'Julio_César_Gutiérrez_Díaz_Defensa_21.jpg',
    'Carlos_Adrian_Suarez_Hernandez_Delantero_22.jpg',
    'Pablo_Aldahir_Gomez_Archundia_Medio_23.jpg',
    'Angel_David_Sanchez_Jimenez_Defensa_24.jpg',
    'Cesar_Alexander_Hernandez_Zacarias_Portero_25.jpg',
    'Luis_Antonio_Sanchez_Flores_Delantero_26.jpg',
    'Johan_Ivan_Robles_Cid_Defensa_27.jpg',
    'Samuel_Alexander_Hernandez_Romero_Portero_28.jpg',
    'Jesus_Esteban_Ricardez_Zarate_Defensa_29.jpg',
    'Fabricio_Santiago_Del_Angel_Defensa_30.jpg',
    'Ricardo_Rodriguez_Montiel_Defensa_31.jpg',
    'Gerardo_Antonio_Roman_Tellez_Delantero_32.jpg'
];

const PLAYER_IMAGES_ALEBRIJES_SUB16 = [
    'Diego_Miguel_Rosas_Romero_Medio_801.jpg',
    'Marco_Eliel_Arenas_Trejo_Defensa_802.jpg',
    'Kevin_Damian_Alvarado_Montiel_Medio_803.jpg',
    'Axel_Antonio_Vazquez_Estrada_Defensa_804.jpg',
    'Roberto_Adair_Perez_Arana_Defensa_805.jpg',
    'Derek_Jesus_Hernandez_Licea_Defensa_806.jpg',
    'Iker_Damian_Ortega_Villegas_Delantero_807.jpg',
    'Juan_Carlos_Maravilla_Maldonado_Medio_808.jpg',
    'Ian_Garcia_Ramos_Delantero_809.jpg',
    'Dejan_Kaled_Ramirez_Quijano_Medio_810.jpg',
    'Anker_Matias_Paez_Ramirez_Portero_811.jpg',
    'Adriel_Fernando_Camacho_Ramirez_Portero_812.jpg',
    'Julio_Antonio_Alonso_Santos_Portero_813.jpg',
    'Bruno_Arroyo_Sanchez_Defensa_814.jpg',
    'Emiliano_Rodriguez_Hernandez_Medio_815.jpg',
    'Javier_Lopez_Balderas_Medio_816.jpg',
    'Leonardo_Briones_Duran_Defensa_817.jpg',
    'Sergio_Jatniel_Hernandez_Hernandez_Delantero_818.jpg',
    'Mateo_Ezequiel_Moreno_Gil_Delantero_819.jpg',
    'Gerardo_Daniel_Morales_Vargas_Delantero_820.jpg',
    'Uriel_Urieta_Robles_Portero_821.jpg',
    'Justin_Anderson_Aguilar_Hernandez_Medio_822.jpg'
];

function findPlayerImage(nombre, apellido) {
    const fullName = normalizeStr(`${nombre || ''} ${apellido || ''}`);
    const firstName = normalizeStr(nombre || '');
    const firstApellido = normalizeStr((apellido || '').split(' ')[0] || '');

    function search(list, folder) {
        for (const img of list) {
            const parts = img.split('.')[0].split('_');
            const lastPart = parts[parts.length - 1];
            if (/^\d+$/.test(lastPart)) parts.pop();
            parts.pop();
            const imgName = normalizeStr(parts.join(' '));
            if (imgName === fullName) return `assets/${folder}/${img}`;
            if (firstName.length > 2 && imgName.includes(firstName) && firstApellido && imgName.includes(firstApellido)) {
                return `assets/${folder}/${img}`;
            }
        }
        return null;
    }
    return (
        search(PLAYER_IMAGES, 'PlantillaAlebrijesTeotihuacanLigaTDP') ||
        search(PLAYER_IMAGES_ALEBRIJES_SUB16, 'PlantillaAlebrijesTeotihuacanSub-16_TDP') ||
        search(PLAYER_IMAGES_SOLES_LIGATDP, 'PlantillaSolesTeotihuacanLigaTDP') ||
        search(PLAYER_IMAGES_SOLES_SUB16, 'PlantillaSolesTeotihuacanSub16_TDP')
    );
}

function getWeekSunday(isoWeek) {
    if (!isoWeek) return null;
    const [year, w] = isoWeek.split('-W').map(Number);
    const jan4 = new Date(year, 0, 4);
    const day = jan4.getDay() || 7;
    const monday = new Date(jan4.getTime() - (day - 1) * 86400000 + (w - 1) * 7 * 86400000);
    return new Date(monday.getTime() + 6 * 86400000);
}
function getWeekMonday(isoWeek) {
    const sunday = getWeekSunday(isoWeek);
    if (!sunday) return null;
    return new Date(sunday.getTime() - 6 * 86400000);
}
function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatWeekShort(isoWeek) {
    if (!isoWeek || !isoWeek.includes('-W')) return '';
    const parts = isoWeek.split('-W');
    return `S${parts[1]}/${parts[0].slice(-2)}`;
}
function formatWeekRangeCompact(isoWeek) {
    if (!isoWeek) return '';
    const monday = getWeekMonday(isoWeek);
    const sunday = getWeekSunday(isoWeek);
    if (!monday || !sunday) return '';
    const fmt = (d) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    return `${fmt(monday)} — ${fmt(sunday)}`;
}

// ── Card markup: vertical photo-dominant, categoria como chip sutil ────
function renderCard({ cat, winner }) {
    const accent = CATEGORY_COLORS[cat.key] || FALLBACK_COLOR;
    const ink = CATEGORY_INK[cat.key] || FALLBACK_INK;

    if (!winner) {
        return `
            <article class="featured-player-card fpc-empty" style="--slot-accent:${accent}; --slot-ink:${ink};">
                <div class="fpc-photo">
                    <div class="fpc-initials">--</div>
                </div>
                <span class="fpc-chip">${escapeHtml(cat.label)}${cat.sub ? `<span class="fpc-chip-sub"> · ${escapeHtml(cat.sub)}</span>` : ''}</span>
                <div class="fpc-score fpc-tone-na">
                    <span class="fpc-num">--</span><span class="fpc-cap">/10</span>
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
        <article class="featured-player-card" style="--slot-accent:${accent}; --slot-ink:${ink};">
            <div class="fpc-photo">
                ${photoHTML}
                ${initialsHTML}
                <span class="fpc-chip">${escapeHtml(cat.label)}${cat.sub ? `<span class="fpc-chip-sub"> · ${escapeHtml(cat.sub)}</span>` : ''}</span>
                <div class="fpc-score ${tone}">
                    <span class="fpc-num">${escapeHtml(scoreStr)}</span><span class="fpc-cap">/10</span>
                </div>
            </div>
            <div class="fpc-name">${escapeHtml(fullName)}</div>
        </article>
    `;
}

// ── Main loader ────────────────────────────────────────────────────────
async function loadJugadoresSemana() {
    const container = document.getElementById('featuredPlayersGrid');
    const weekLabel = document.getElementById('featuredWeekLabel');
    if (!container) return;

    container.innerHTML = `
        <div class="featured-loading">
            <div class="featured-spinner"></div>
            <p>Identificando a los jugadores destacados...</p>
        </div>`;

    try {
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

        const weeks = [...new Set(rows.map(r => r.semana).filter(s => s && s.includes('-W')))].sort();
        const latestWeek = weeks[weeks.length - 1];
        if (!latestWeek) {
            container.innerHTML = '<p class="featured-empty">Aun no hay evaluaciones registradas.</p>';
            if (weekLabel) weekLabel.textContent = '';
            return;
        }
        const sunday = getWeekSunday(latestWeek);
        if (weekLabel) {
            weekLabel.textContent = `Semana del ${formatDate(sunday)}`;
        }

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
            const cat = categoryFromPlayer({ categoria: row.categoria, equipo: row.equipo });
            const candidate = {
                jugador_id: row.jugador_id,
                promedio_general: row.promedio_general,
                rendimiento_cancha: row.rendimiento_cancha,
                minutos_jugados: row.minutos_jugados,
                player: row,
            };
            const cur = winnersByKey[cat.key];
            if (!cur || beats(cur, candidate)) winnersByKey[cat.key] = candidate;
        }

        const winnerKeys = Object.keys(winnersByKey);
        const orderedKeys = [];
        for (const k of CATEGORIES_ORDER) if (winnerKeys.includes(k)) orderedKeys.push(k);
        for (const k of winnerKeys.sort()) if (!CATEGORIES_ORDER.includes(k)) orderedKeys.push(k);

        const cards = orderedKeys.map(key => {
            const w = winnersByKey[key];
            const cat = categoryFromPlayer({
                categoria: w?.player?.categoria,
                equipo: w?.player?.equipo,
            });
            return renderCard({
                cat,
                winner: w ? { player: w.player, score: w.promedio_general } : null,
            });
        });

        container.innerHTML = cards.join('');
    } catch (err) {
        console.error('Error loading jugadores destacados:', err);
        container.innerHTML = '<p class="featured-empty">No se pudieron cargar los jugadores destacados en este momento.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadJugadoresSemana);
