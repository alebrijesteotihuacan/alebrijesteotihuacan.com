/*
    jugador-semana.js
    Loads the best player per category (highest promedio_general)
    from the last evaluation week and renders the featured players section.
    Migrated to Supabase
*/

import { supabase } from './supabase-client.js';

// ── Categories to display ────────────────────────────────────
const CATEGORIAS = ['Alebrijes TDP', 'Soles TDP', 'Sub-18', 'Sub-16', 'Sub-14'];

const CATEGORY_ALIAS = {
    'Sub-13': 'Sub-14',
    'Sub-15': 'Sub-16',
    'Sub-17': 'Sub-18',
    'Sub-20': 'Sub-21',
};

function normalizeCategoria(cat) {
    return CATEGORY_ALIAS[cat] || cat;
}

const CATEGORY_COLORS = {
    'Alebrijes TDP': 'linear-gradient(135deg, #E85D26, #c94d1e)',
    'Soles TDP':     'linear-gradient(135deg, #f59e0b, #d97706)',
    'Sub-18':        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'Sub-16':        'linear-gradient(135deg, #10b981, #059669)',
    'Sub-14':        'linear-gradient(135deg, #8b5cf6, #6d28d9)',
};

function toTitleCase(str) {
    if (!str) return '';
    return str.trim().toLowerCase()
        .split(' ')
        .filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function findPlayerImage(nombre, apellido) {
    return null;
}

function getWeekSunday(isoWeek) {
    if (!isoWeek) return null;
    const [year, w] = isoWeek.split('-W').map(Number);
    const jan4 = new Date(year, 0, 4);
    const day = jan4.getDay() || 7;
    const monday = new Date(jan4.getTime() - (day - 1) * 86400000 + (w - 1) * 7 * 86400000);
    const sunday = new Date(monday.getTime() + 6 * 86400000);
    return sunday;
}

function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function loadJugadoresSemana() {
    const container = document.getElementById('featuredPlayersGrid');
    const weekLabel = document.getElementById('featuredWeekLabel');
    if (!container) return;

    container.innerHTML = `<div class="featured-loading">
        <div class="featured-spinner"></div>
        <p>Cargando jugadores destacados...</p>
    </div>`;

    try {
        // 1. Load all players
        const { data: players, error: playersError } = await supabase
            .from('jugadores')
            .select('*');

        if (playersError) throw playersError;

        const playerMap = {};
        (players || []).forEach(p => { playerMap[p.id] = p; });

        // 2. Load all evaluations
        const { data: evals, error: evalsError } = await supabase
            .from('evaluaciones')
            .select('*');

        if (evalsError) throw evalsError;

        if (!evals || evals.length === 0) {
            container.innerHTML = '<p class="featured-empty">No hay evaluaciones registradas aún.</p>';
            return;
        }

        // 3. Find the most recent evaluation week
        const allWeeks = [...new Set(evals.map(e => e.semana).filter(s => s && s.includes('-W')))].sort();
        const latestWeek = allWeeks[allWeeks.length - 1];

        console.log('[JS] Total evals:', evals.length, '| Semanas:', allWeeks, '| Semana activa:', latestWeek);

        const sunday = getWeekSunday(latestWeek);
        if (weekLabel && sunday) {
            weekLabel.textContent = `Semana del ${formatDate(sunday)}`;
        }

        // 4. Filter to evaluations from that week only
        const evalsThisWeek = evals.filter(e => e.semana === latestWeek);
        console.log('[JS] Evals esta semana:', evalsThisWeek.length);

        const evalsByPlayer = {};
        for (const ev of evalsThisWeek) {
            const pid = ev.jugador_id;
            if (!pid) continue;
            if (!evalsByPlayer[pid]) evalsByPlayer[pid] = [];
            evalsByPlayer[pid].push(ev);
        }

        const playerStats = {};
        for (const [pid, evList] of Object.entries(evalsByPlayer)) {
            const numAvg = key => {
                const vals = evList.map(e => parseFloat(e[key])).filter(n => isFinite(n));
                return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
            };
            const numSum = key => evList.map(e => parseFloat(e[key]) || 0).reduce((a, b) => a + b, 0);

            const pg = numAvg('promedio_general');
            if (pg === null) continue;

            playerStats[pid] = {
                pid,
                promedioGeneral: pg,
                rendimientoCancha: numAvg('rendimiento_cancha'),
                minutosJugados: numSum('minutos_jugados'),
            };
        }

        function beats(a, b) {
            if (b.promedioGeneral > a.promedioGeneral) return true;
            if (b.promedioGeneral < a.promedioGeneral) return false;
            const ra = a.rendimientoCancha ?? -1;
            const rb = b.rendimientoCancha ?? -1;
            if (rb > ra) return true;
            if (rb < ra) return false;
            return b.minutosJugados > a.minutosJugados;
        }

        const winners = {};
        for (const [pid, stats] of Object.entries(playerStats)) {
            const player = playerMap[pid];
            if (!player) continue;
            const cat = normalizeCategoria(player.categoria);
            if (!CATEGORIAS.includes(cat)) continue;

            if (!winners[cat] || beats(winners[cat].stats, stats)) {
                winners[cat] = { player, stats, score: stats.promedioGeneral };
            }
        }

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

document.addEventListener('DOMContentLoaded', loadJugadoresSemana);
