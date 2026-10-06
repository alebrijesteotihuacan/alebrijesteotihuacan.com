/*
    Panel del Director Deportivo — Alebrijes Teotihuacán
    Acceso de solo lectura sobre todas las tablas del club.
*/

import { supabase } from './supabase-client.js';

// ==========================================
// PHOTO LOOKUP (mismo algoritmo que panel-admin)
// ==========================================
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

function normalizeStr(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function findPlayerImageInfo(nombre, apellido) {
    const fullName = normalizeStr(`${nombre || ''} ${apellido || ''}`);
    const firstName = normalizeStr(nombre || '');

    const sets = [
        { arr: PLAYER_IMAGES, folder: 'PlantillaAlebrijesTeotihuacanLigaTDP' },
        { arr: PLAYER_IMAGES_ALEBRIJES_SUB16, folder: 'PlantillaAlebrijesTeotihuacanSub-16_TDP' },
        { arr: PLAYER_IMAGES_SOLES_LIGATDP, folder: 'PlantillaSolesTeotihuacanLigaTDP' },
        { arr: PLAYER_IMAGES_SOLES_SUB16, folder: 'PlantillaSolesTeotihuacanSub16_TDP' }
    ];

    for (const set of sets) {
        for (const img of set.arr) {
            const parts = img.split('.')[0].split('_');
            const lastPart = parts[parts.length - 1];
            if (/^\d+$/.test(lastPart)) parts.pop();
            parts.pop();
            const imgName = normalizeStr(parts.join(' '));

            if (imgName === fullName) return { file: img, folder: set.folder };

            if (fullName && firstName.length > 2 && imgName.includes(firstName)) {
                const apellidoNorm = normalizeStr(apellido || '');
                if (apellidoNorm && imgName.includes(apellidoNorm.split(' ')[0])) {
                    return { file: img, folder: set.folder };
                }
            }
        }
    }
    return null;
}

function titleCase(s) {
    return (s || '').trim().toLowerCase().split(' ').filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function photoHTML(player, opts = {}) {
    const firstName = titleCase((player.nombre || 'Sin nombre').split(' ')[0]);
    const initials = ((player.nombre || '').charAt(0) + (player.apellido || '').charAt(0)).toUpperCase() || '?';
    const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
    const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;
    const cls = opts.size === 'sm' ? 'dir-eval-photo' : (opts.size === 'xs' ? 'dir-top-photo' : 'dir-player-photo');

    if (imgSrc) {
        return `<div class="${cls}"><img src="${imgSrc}" alt="${firstName}" onerror="this.parentElement.innerHTML='<div class=&quot;default-avatar&quot;>${initials}</div>'"></div>`;
    }
    return `<div class="${cls}"><div class="default-avatar">${initials}</div></div>`;
}

function avgClass(n) {
    if (n == null || isNaN(n)) return 'avg-none';
    if (n >= 7) return 'avg-good';
    if (n >= 5) return 'avg-mid';
    return 'avg-low';
}

function avgText(n) {
    if (n == null || isNaN(n)) return '--';
    return n.toFixed(1);
}

function fmtDate(s) {
    if (!s) return '';
    try {
        const d = new Date(s);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return ''; }
}

function fmtRelative(s) {
    if (!s) return '';
    const d = new Date(s);
    const now = new Date();
    const diffMs = now - d;
    const days = Math.floor(diffMs / 86400000);
    if (days === 0) return 'hoy';
    if (days === 1) return 'ayer';
    if (days < 7) return `hace ${days} días`;
    if (days < 30) return `hace ${Math.floor(days / 7)} sem`;
    return `hace ${Math.floor(days / 30)} meses`;
}

// ==========================================
// APP STATE
// ==========================================
const state = {
    director: null,
    professors: [],
    players: [],
    evaluations: [],
    categories: [],
    weeks: [],
    playerLatestAvg: {},
    playerEvalsCount: {},
    profEvalsThisWeek: {},
    profLatestActivity: {}
};

// ==========================================
// AUTH GATE
// ==========================================
supabase.auth.onAuthStateChange(async (_event, session) => {
    const user = session?.user || null;
    if (!user) { window.location.href = 'login.html'; return; }

    const { data: profData } = await supabase
        .from('profesores')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (!profData || profData.rol !== 'director_deportivo') {
        if (profData?.rol === 'admin') {
            window.location.href = 'panel-admin.html';
        } else if (profData?.rol === 'profesor') {
            window.location.href = 'panel-profesor.html';
        } else {
            window.location.href = 'mi-rendimiento.html';
        }
        return;
    }

    state.director = profData;
    document.getElementById('dirName').textContent = profData.nombre || 'Director';
    document.getElementById('dirAvatar').textContent = (profData.nombre || 'D').charAt(0).toUpperCase();
    document.getElementById('dirFirstName').textContent = profData.nombre || 'Director';

    await loadAll();
    renderResumen();
    setupFilters();
    setupNav();
    setupLogout();
    setupPdf();

    document.getElementById('dirLoading').style.display = 'none';
    document.getElementById('dirShell').style.display = 'grid';
});

// ==========================================
// DATA LOAD
// ==========================================
async function loadAll() {
    const [profRes, playerRes, evalRes] = await Promise.all([
        supabase.from('profesores').select('*').neq('rol', 'jugador'),
        supabase.from('jugadores').select('*'),
        supabase.from('evaluaciones').select('*')
    ]);

    state.professors = profRes.data || [];
    state.players = playerRes.data || [];
    state.evaluations = evalRes.data || [];

    state.categories = [...new Set(state.players.map(p => p.categoria).filter(Boolean))];
    state.weeks = [...new Set(state.evaluations.map(e => e.semana).filter(Boolean))].sort();

    // Latest avg per player
    state.evaluations.forEach(ev => {
        if (ev.promedio_general == null) return;
        const cur = state.playerLatestAvg[ev.jugador_id];
        const evDate = new Date(ev.fecha || ev.fecha_fin || 0).getTime();
        const curDate = cur ? new Date(cur.fecha || cur.fecha_fin || 0).getTime() : 0;
        if (!cur || evDate > curDate) state.playerLatestAvg[ev.jugador_id] = ev;
        state.playerEvalsCount[ev.jugador_id] = (state.playerEvalsCount[ev.jugador_id] || 0) + 1;
    });

    // This-week evals per professor
    const weekNow = isoWeekNumber(new Date());
    state.evaluations.forEach(ev => {
        if (!ev.evaluador_id) return;
        const eWeek = ev.semana || '';
        const curWeek = state.profEvalsThisWeek[ev.evaluador_id];
        if (eWeek && eWeek.includes(String(weekNow))) {
            state.profEvalsThisWeek[ev.evaluador_id] = (state.profEvalsThisWeek[ev.evaluador_id] || 0) + 1;
        }
        const curAct = state.profLatestActivity[ev.evaluador_id];
        const evDate = new Date(ev.fecha || ev.fecha_fin || 0).getTime();
        const curDate = curAct ? new Date(curAct).getTime() : 0;
        if (!curAct || evDate > curDate) state.profLatestActivity[ev.evaluador_id] = ev.fecha || ev.fecha_fin;
    });
}

function isoWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ==========================================
// RENDER: RESUMEN
// ==========================================
function renderResumen() {
    // Date
    const now = new Date();
    document.getElementById('currentDate').textContent =
        now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // KPIs
    document.getElementById('kpiPlayers').textContent = state.players.length;
    document.getElementById('kpiPlayersCats').textContent = state.categories.length;

    const weekNow = isoWeekNumber(new Date());
    const evalsThisWeek = state.evaluations.filter(e => (e.semana || '').includes(String(weekNow))).length;
    document.getElementById('kpiEvals').textContent = evalsThisWeek;
    document.getElementById('kpiEvalsTotal').textContent = state.evaluations.length;

    const evalsWithAvg = state.evaluations.filter(e => e.promedio_general != null);
    const avg = evalsWithAvg.length
        ? (evalsWithAvg.reduce((a, e) => a + Number(e.promedio_general), 0) / evalsWithAvg.length).toFixed(1)
        : '—';
    document.getElementById('kpiAvg').textContent = avg;
    document.getElementById('kpiAvgBase').textContent = evalsWithAvg.length;

    // Top 5 del mes (top por promedio, top 5 por latest avg)
    const ranked = state.players
        .map(p => ({
            ...p,
            latestAvg: state.playerLatestAvg[p.id]?.promedio_general ?? null
        }))
        .filter(p => p.latestAvg != null)
        .sort((a, b) => b.latestAvg - a.latestAvg)
        .slice(0, 5);

    document.getElementById('topCount').textContent = ranked.length;
    document.getElementById('topGrid').innerHTML = ranked.length
        ? ranked.map((p, i) => `
            <article class="dir-top-card">
                    <span class="dir-top-rank">#${String(i + 1).padStart(2, '0')}</span>
                    ${photoHTML(p, { size: 'xs' })}
                    <div class="dir-top-name" title="${titleCase(p.nombre)} ${titleCase(p.apellido || '')}">${titleCase((p.nombre || '').split(' ')[0])} ${titleCase((p.apellido || '').split(' ')[0])}</div>
                    <div class="dir-top-team">${p.categoria || ''} · ${p.posicion || ''}</div>
                    <span class="dir-top-avg ${avgClass(p.latestAvg)}">${avgText(p.latestAvg)}</span>
                </article>
            `).join('')
        : '<div class="dir-empty">Aún no hay evaluaciones registradas.</div>';

    // Comparativa por categoría
    const catAvgs = {};
    state.players.forEach(p => {
        const ev = state.playerLatestAvg[p.id];
        if (!ev?.promedio_general || !p.categoria) return;
        const c = p.categoria;
        if (!catAvgs[c]) catAvgs[c] = { sum: 0, n: 0 };
        catAvgs[c].sum += Number(ev.promedio_general);
        catAvgs[c].n += 1;
    });

    const catList = Object.entries(catAvgs)
        .map(([cat, v]) => ({ cat, avg: v.sum / v.n }))
        .sort((a, b) => b.avg - a.avg);

    const maxAvg = Math.max(...catList.map(c => c.avg), 10);
    document.getElementById('categoryBars').innerHTML = catList.length
        ? catList.map(c => {
            const pct = Math.min(100, (c.avg / maxAvg) * 100);
            const cls = c.avg >= 7 ? 'fill-good' : c.avg >= 5 ? 'fill-mid' : 'fill-low';
            return `
                <div class="dir-compact-row">
                    <div class="dir-compact-name">${c.cat}</div>
                    <div class="dir-compact-bar"><div class="dir-compact-bar-fill ${cls}" style="width:${pct}%"></div></div>
                    <div class="dir-compact-value">${c.avg.toFixed(1)}</div>
                </div>`;
        }).join('')
        : '<div class="dir-empty">Sin datos por categoría.</div>';

    // Alertas
    const alerts = [];

    // 1) Jugadores con promedio < 5 en su última evaluación
    state.players.forEach(p => {
        const ev = state.playerLatestAvg[p.id];
        if (ev?.promedio_general != null && Number(ev.promedio_general) < 5) {
            alerts.push({
                dot: 'dot-red',
                badge: 'Rendimiento',
                cls: 'badge-red',
                title: `${titleCase(p.nombre)} ${titleCase(p.apellido || '')}`,
                meta: `${p.categoria || ''} · Última evaluación: ${avgText(ev.promedio_general)}`
            });
        }
    });

    // 2) Inasistencias > 2 en evaluaciones recientes (último mes)
    const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
    state.evaluations.forEach(ev => {
        if (new Date(ev.fecha || 0) < monthAgo) return;
        const n = Number(ev.inasistencias || 0);
        if (n >= 3) {
            const player = state.players.find(p => p.id === ev.jugador_id);
            if (!player) return;
            alerts.push({
                dot: 'dot-yellow',
                badge: 'Asistencia',
                cls: 'badge-yellow',
                title: `${titleCase(player.nombre)} ${titleCase(player.apellido || '')}`,
                meta: `${player.categoria || ''} · ${n} inasistencias recientes`
            });
        }
    });

    // 3) Jugadores sin evaluar en los últimos 14 días
    const twoWeeks = 14 * 86400000;
    state.players.forEach(p => {
        const ev = state.playerLatestAvg[p.id];
        if (!ev) {
            alerts.push({
                dot: 'dot-blue',
                badge: 'Seguimiento',
                cls: 'badge-blue',
                title: `${titleCase(p.nombre)} ${titleCase(p.apellido || '')}`,
                meta: `${p.categoria || ''} · Sin evaluaciones registradas`
            });
            return;
        }
        const ts = new Date(ev.fecha || ev.fecha_fin || 0).getTime();
        if (Date.now() - ts > twoWeeks) {
            alerts.push({
                dot: 'dot-blue',
                badge: 'Seguimiento',
                cls: 'badge-blue',
                title: `${titleCase(p.nombre)} ${titleCase(p.apellido || '')}`,
                meta: `${p.categoria || ''} · Última evaluación ${fmtRelative(ev.fecha || ev.fecha_fin)}`
            });
        }
    });

    // Dedup + cap
    const seenAlert = new Set();
    const alertsDedup = alerts.filter(a => {
        const k = a.title + a.badge;
        if (seenAlert.has(k)) return false;
        seenAlert.add(k);
        return true;
    }).slice(0, 12);

    document.getElementById('kpiAlerts').textContent = alertsDedup.length;
    document.getElementById('alertCount').textContent = alertsDedup.length;
    document.getElementById('alertsList').innerHTML = alertsDedup.length
        ? alertsDedup.map(a => `
            <div class="dir-alert">
                <span class="dir-alert-dot ${a.dot}" aria-hidden="true"></span>
                <div class="dir-alert-body">
                    <div class="dir-alert-title">${a.title}</div>
                    <div class="dir-alert-meta">${a.meta}</div>
                </div>
                <span class="dir-alert-badge ${a.cls}">${a.badge}</span>
            </div>
        `).join('')
        : '<div class="dir-empty">Sin alertas activas. Todo en orden.</div>';

    // Actividad reciente
    const recent = [...state.evaluations]
        .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
        .slice(0, 8);

    document.getElementById('activityFeed').innerHTML = recent.length
        ? recent.map(ev => {
            const player = state.players.find(p => p.id === ev.jugador_id);
            const prof = state.professors.find(p => p.id === ev.evaluador_id);
            const pname = player ? `${titleCase(player.nombre)} ${titleCase(player.apellido || '')}` : 'Jugador';
            const pname2 = prof?.nombre || 'Profesor';
            const avg = ev.promedio_general != null ? Number(ev.promedio_general).toFixed(1) : '--';
            return `
                <div class="dir-activity-item">
                    <div class="dir-activity-bullet"></div>
                    <div class="dir-activity-body">
                        <div class="dir-activity-headline">
                            <strong>${pname2}</strong> evaluó a <strong>${pname}</strong>
                        </div>
                        <div class="dir-activity-meta">
                            <span>${fmtDate(ev.fecha || ev.fecha_fin)}</span>
                            <span>${ev.semana || ''}</span>
                            <span class="avg-pill">${avg}</span>
                        </div>
                    </div>
                </div>`;
        }).join('')
        : '<div class="dir-empty">Sin actividad reciente.</div>';

    // Nav counts
    document.getElementById('navPlayerCount').textContent = state.players.length;
    document.getElementById('navEvalCount').textContent = state.evaluations.length;
    document.getElementById('navProfCount').textContent = state.professors.filter(p => p.rol === 'profesor' || p.rol === 'admin').length;
}

// ==========================================
// RENDER: PLANTILLA
// ==========================================
function renderPlantilla() {
    const cat = document.getElementById('filterCatPlantilla').value;
    const prof = document.getElementById('filterProfPlantilla').value;
    const q = (document.getElementById('searchPlantilla').value || '').toLowerCase();

    const filtered = state.players.filter(p => {
        if (cat && p.categoria !== cat) return false;
        if (prof && p.registrado_por !== prof) return false;
        if (q) {
            const n = `${p.nombre || ''} ${p.apellido || ''}`.toLowerCase();
            if (!n.includes(q)) return false;
        }
        return true;
    });

    document.getElementById('plantillaCount').textContent = filtered.length;
    document.getElementById('plantillaGrid').innerHTML = filtered.length
        ? filtered.map(p => {
            const avg = state.playerLatestAvg[p.id]?.promedio_general ?? null;
            return `
                <article class="dir-player">
                    ${photoHTML(p)}
                    <div class="dir-player-name" title="${titleCase(p.nombre)} ${titleCase(p.apellido || '')}">${titleCase((p.nombre || '').split(' ')[0])} ${titleCase((p.apellido || '').split(' ')[0])}</div>
                    <div class="dir-player-pos">${p.posicion || '—'}</div>
                    <span class="dir-player-avg ${avgClass(avg)}">${avgText(avg)}</span>
                </article>`;
        }).join('')
        : '<div class="dir-empty">Sin jugadores con esos filtros.</div>';
}

function populatePlantillaFilters() {
    const catSel = document.getElementById('filterCatPlantilla');
    state.categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        catSel.appendChild(opt);
    });

    const profSel = document.getElementById('filterProfPlantilla');
    state.professors.filter(p => p.rol === 'profesor' || p.rol === 'admin').forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id; opt.textContent = p.nombre || p.email;
        profSel.appendChild(opt);
    });
}

// ==========================================
// RENDER: EVALUACIONES
// ==========================================
function renderEvaluaciones() {
    const cat = document.getElementById('filterCatEvals').value;
    const prof = document.getElementById('filterProfEvals').value;
    const week = document.getElementById('filterWeekEvals').value;
    const q = (document.getElementById('searchEvals').value || '').toLowerCase();

    const playerMap = {};
    state.players.forEach(p => { playerMap[p.id] = p; });

    const profNameMap = {};
    state.professors.forEach(p => { profNameMap[p.id] = p.nombre || p.email; });

    const filtered = state.evaluations
        .filter(ev => {
            const player = playerMap[ev.jugador_id];
            if (cat && player?.categoria !== cat) return false;
            if (prof && ev.evaluador_id !== prof) return false;
            if (week && ev.semana !== week) return false;
            if (q) {
                const name = `${player?.nombre || ''} ${player?.apellido || ''}`.toLowerCase();
                if (!name.includes(q)) return false;
            }
            return true;
        })
        .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));

    document.getElementById('evalsCount').textContent = filtered.length;
    document.getElementById('evalsGrid').innerHTML = filtered.length
        ? filtered.map(ev => {
            const player = playerMap[ev.jugador_id] || {};
            const profName = ev.evaluador_nombre || profNameMap[ev.evaluador_id] || '—';
            const avg = ev.promedio_general;
            const metrics = [
                ['Técnico', ev.tecnico], ['Táctico', ev.tactico], ['Físico', ev.fisico], ['Mental', ev.mental]
            ];
            const obs = ev.observaciones ? `<div class="dir-eval-obs">"${ev.observaciones}"</div>` : '';

            return `
                <article class="dir-eval-card">
                    <header class="dir-eval-header">
                        ${photoHTML(player, { size: 'sm' })}
                        <div class="dir-eval-info">
                            <h4>${titleCase((player.nombre || '').split(' ')[0])} ${titleCase((player.apellido || '').split(' ')[0])}</h4>
                            <p>${player.posicion || ''} · ${player.categoria || ''}</p>
                        </div>
                        <div class="dir-eval-avg-big ${avgClass(avg)}">${avgText(avg)}</div>
                    </header>
                    <div class="dir-eval-metrics">
                        ${metrics.map(([l, v]) => `
                            <div class="dir-eval-metric">
                                <div class="dir-eval-metric-value">${v ?? '--'}</div>
                                <div class="dir-eval-metric-label">${l}</div>
                            </div>`).join('')}
                    </div>
                    ${obs}
                    <footer class="dir-eval-foot">
                        <span class="dir-eval-prof">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            ${profName}
                        </span>
                        ${ev.semana ? `<span class="dir-eval-week">${ev.semana}</span>` : ''}
                    </footer>
                </article>`;
        }).join('')
        : '<div class="dir-empty">Sin evaluaciones con esos filtros.</div>';
}

function populateEvalFilters() {
    const catSel = document.getElementById('filterCatEvals');
    state.categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        catSel.appendChild(opt);
    });

    const profSel = document.getElementById('filterProfEvals');
    state.professors.filter(p => p.rol === 'profesor' || p.rol === 'admin').forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id; opt.textContent = p.nombre || p.email;
        profSel.appendChild(opt);
    });

    const weekSel = document.getElementById('filterWeekEvals');
    state.weeks.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w; opt.textContent = w;
        weekSel.appendChild(opt);
    });

    // PDF filter uses same categories
    const pdfCatSel = document.getElementById('pdfCatFilter');
    state.categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        pdfCatSel.appendChild(opt);
    });
}

// ==========================================
// RENDER: CUERPO TÉCNICO
// ==========================================
function renderCuerpo() {
    const techs = state.professors.filter(p => p.rol === 'profesor' || p.rol === 'admin');
    const gradColors = [
        'linear-gradient(135deg,#8b5cf6,#6d28d9)',
        'linear-gradient(135deg,#3b82f6,#1d4ed8)',
        'linear-gradient(135deg,#10b981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#ef4444,#dc2626)',
        'linear-gradient(135deg,#06b6d4,#0891b2)'
    ];

    const playerCountByProf = {};
    state.players.forEach(p => {
        if (!p.registrado_por) return;
        playerCountByProf[p.registrado_por] = (playerCountByProf[p.registrado_por] || 0) + 1;
    });

    document.getElementById('profsCount').textContent = techs.length;
    document.getElementById('profsGrid').innerHTML = techs.map((prof, i) => {
        const initial = (prof.nombre || '?').charAt(0).toUpperCase();
        const playersN = playerCountByProf[prof.id] || 0;
        const evalsWeek = state.profEvalsThisWeek[prof.id] || 0;
        const lastAct = state.profLatestActivity[prof.id];
        return `
            <article class="dir-prof-card">
                <div class="dir-prof-avatar" style="background:${gradColors[i % gradColors.length]}">${initial}</div>
                <div class="dir-prof-info">
                    <div class="dir-prof-name">${prof.nombre || 'Sin nombre'}</div>
                    <div class="dir-prof-team">${prof.equipo_restringido || 'Sin equipo restringido'}</div>
                    <div class="dir-prof-stats">
                        <span class="dir-prof-chip chip-players">${playersN} jugadores</span>
                        <span class="dir-prof-chip chip-evals">${evalsWeek} evals/sem</span>
                        ${lastAct ? `<span class="dir-prof-chip chip-active">Última: ${fmtRelative(lastAct)}</span>` : ''}
                    </div>
                </div>
            </article>`;
    }).join('');
}

// ==========================================
// FILTERS + EVENTS
// ==========================================
function setupFilters() {
    populatePlantillaFilters();
    populateEvalFilters();

    document.getElementById('filterCatPlantilla').addEventListener('change', renderPlantilla);
    document.getElementById('filterProfPlantilla').addEventListener('change', renderPlantilla);
    document.getElementById('searchPlantilla').addEventListener('input', renderPlantilla);

    document.getElementById('filterCatEvals').addEventListener('change', renderEvaluaciones);
    document.getElementById('filterProfEvals').addEventListener('change', renderEvaluaciones);
    document.getElementById('filterWeekEvals').addEventListener('change', renderEvaluaciones);
    document.getElementById('searchEvals').addEventListener('input', renderEvaluaciones);
}

function setupNav() {
    document.querySelectorAll('.dir-nav-link[data-view]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            document.querySelectorAll('.dir-nav-link').forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');

            document.querySelectorAll('.dir-view').forEach(v => v.classList.remove('active'));
            const target = document.getElementById(`view-${view}`);
            if (target) {
                target.classList.add('active');
                if (view === 'plantilla') renderPlantilla();
                if (view === 'evaluaciones') renderEvaluaciones();
                if (view === 'cuerpo') renderCuerpo();
            }
        });
    });
}

function setupLogout() {
    document.getElementById('dirLogoutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });
}

// ==========================================
// PDF REPORT
// ==========================================
function setupPdf() {
    document.getElementById('btnGeneratePDF').addEventListener('click', generatePdf);
}

function setPdfStatus(msg, type = '') {
    const el = document.getElementById('pdfStatus');
    el.textContent = msg;
    el.className = 'dir-pdf-status active' + (type ? ' ' + type : '');
}

async function loadImageBase64(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            c.getContext('2d').drawImage(img, 0, 0);
            resolve(c.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

async function generatePdf() {
    const btn = document.getElementById('btnGeneratePDF');
    btn.disabled = true;
    btn.textContent = 'Generando…';
    setPdfStatus('Cargando recursos…');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape', 'mm', 'letter');

        const logo = await loadImageBase64('../assets/03_TEOTIHUACAN_-_Fuerzas_Basicas.png');
        const selectedCat = document.getElementById('pdfCatFilter').value;

        // Filtra jugadores y evals
        const filteredPlayers = selectedCat
            ? state.players.filter(p => p.categoria === selectedCat)
            : state.players;
        const fpIds = new Set(filteredPlayers.map(p => p.id));
        const filteredEvals = state.evaluations.filter(ev => fpIds.has(ev.jugador_id));

        if (filteredPlayers.length === 0) {
            setPdfStatus('No hay datos para el filtro seleccionado.', 'error');
            btn.disabled = false;
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Generar PDF Ejecutivo';
            return;
        }

        setPdfStatus('Generando reporte…');

        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const m = 16;

        const TEAL_DARK = [8, 145, 178];
        const BLACK = [20, 20, 20];
        const WHITE = [255, 255, 255];
        const GRAY_LIGHT = [245, 247, 250];
        const GRAY_MID = [180, 190, 200];
        const GRAY_TEXT = [90, 100, 115];
        const GREEN = [16, 160, 100];
        const YELLOW_DARK = [200, 130, 0];
        const RED = [200, 50, 50];

        const catLabel = selectedCat || 'Todas las categorías';
        const nowStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

        // Header
        function addHeader(d, subtitle) {
            d.setFillColor(...TEAL_DARK);
            d.rect(0, 0, pageW, 4, 'F');
            d.setFillColor(...WHITE);
            d.rect(0, 4, pageW, 28, 'F');
            if (logo) { try { d.addImage(logo, 'PNG', m, 6, 24, 24); } catch (e) { } }
            d.setFont('helvetica', 'bold');
            d.setFontSize(15);
            d.setTextColor(...BLACK);
            d.text('CLUB ALEBRIJES DE OAXACA', pageW / 2, 15, { align: 'center' });
            d.setFontSize(8);
            d.setTextColor(...TEAL_DARK);
            d.text('DIRECCIÓN DEPORTIVA  ·  REPORTE EJECUTIVO', pageW / 2, 21, { align: 'center' });
            d.setFontSize(7.5);
            d.setTextColor(...GRAY_TEXT);
            d.setFont('helvetica', 'normal');
            d.text(subtitle, pageW / 2, 27, { align: 'center' });
            d.setDrawColor(...TEAL_DARK);
            d.setLineWidth(0.6);
            d.line(m, 32, pageW - m, 32);
        }

        function addFooter(d, pageNum, totalPages) {
            const y = pageH - 7;
            d.setDrawColor(...GRAY_MID);
            d.setLineWidth(0.3);
            d.line(m, pageH - 12, pageW - m, pageH - 12);
            d.setFontSize(6);
            d.setFont('helvetica', 'normal');
            d.setTextColor(...GRAY_TEXT);
            d.text('Club Alebrijes de Oaxaca Teotihuacán  ·  Dirección Deportiva  ·  Confidencial', m, y);
            d.setTextColor(...TEAL_DARK);
            d.setFont('helvetica', 'bold');
            d.text(`${pageNum} / ${totalPages}`, pageW - m, y, { align: 'right' });
            d.setTextColor(...GRAY_MID);
            d.setFont('helvetica', 'normal');
            d.text(nowStr, pageW / 2, y, { align: 'center' });
        }

        function sectionTitle(d, text, yPos) {
            d.setFillColor(...TEAL_DARK);
            d.rect(m, yPos, 3, 7, 'F');
            d.setFont('helvetica', 'bold');
            d.setFontSize(10);
            d.setTextColor(...BLACK);
            d.text(text, m + 6, yPos + 5.5);
            return yPos + 12;
        }

        // ============ PAGE 1: SUMMARY ============
        addHeader(doc, `Resumen Ejecutivo  ·  ${catLabel}`);

        let y = 38;

        // Stats bar
        const evalsWithAvg = filteredEvals.filter(e => e.promedio_general != null);
        const avgClub = evalsWithAvg.length
            ? (evalsWithAvg.reduce((a, e) => a + Number(e.promedio_general), 0) / evalsWithAvg.length).toFixed(1)
            : '--';
        const weekNow = isoWeekNumber(new Date());
        const evalsThisWeek = filteredEvals.filter(e => (e.semana || '').includes(String(weekNow))).length;

        doc.setFillColor(...GRAY_LIGHT);
        doc.roundedRect(m, y, pageW - m * 2, 12, 2, 2, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAY_TEXT);
        doc.text(
            `Jugadores: ${filteredPlayers.length}   ·   Evaluaciones: ${filteredEvals.length}   ·   Esta semana: ${evalsThisWeek}   ·   Promedio club: ${avgClub}   ·   Categoría: ${catLabel}`,
            pageW / 2, y + 7.5, { align: 'center' }
        );
        y += 18;

        y = sectionTitle(doc, 'TOP JUGADORES', y);

        const ranked = filteredPlayers
            .map(p => ({ p, avg: state.playerLatestAvg[p.id]?.promedio_general ?? null }))
            .filter(r => r.avg != null)
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 8);

        const topRows = ranked.map((r, i) => [
            `#${i + 1}`,
            `${titleCase((r.p.nombre || '').split(' ')[0])} ${titleCase((r.p.apellido || '').split(' ')[0])}`,
            r.p.posicion || '--',
            r.p.categoria || '--',
            Number(r.avg).toFixed(1)
        ]);

        doc.autoTable({
            startY: y,
            head: [['#', 'JUGADOR', 'POSICIÓN', 'CATEGORÍA', 'PROMEDIO']],
            body: topRows,
            margin: { left: m, right: m },
            styles: { font: 'helvetica', fontSize: 8, cellPadding: 4, textColor: BLACK, lineColor: [225, 230, 235], lineWidth: 0.2 },
            headStyles: { fillColor: TEAL_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
            alternateRowStyles: { fillColor: GRAY_LIGHT },
            bodyStyles: { fillColor: WHITE },
            columnStyles: {
                0: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
                4: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
            },
            didParseCell: function (data) {
                if (data.column.index === 4 && data.section === 'body') {
                    const v = parseFloat(data.cell.raw);
                    if (!isNaN(v)) {
                        if (v >= 7) data.cell.styles.textColor = GREEN;
                        else if (v >= 5) data.cell.styles.textColor = YELLOW_DARK;
                        else data.cell.styles.textColor = RED;
                    }
                }
            }
        });

        // Comparativa por categoría
        y = doc.lastAutoTable.finalY + 12;
        if (y > pageH - 60) { doc.addPage(); addHeader(doc, `Resumen Ejecutivo  ·  ${catLabel}`); y = 38; }

        y = sectionTitle(doc, 'COMPARATIVA POR CATEGORÍA', y);

        const catAvgs = {};
        filteredPlayers.forEach(p => {
            const ev = state.playerLatestAvg[p.id];
            if (!ev?.promedio_general || !p.categoria) return;
            if (!catAvgs[p.categoria]) catAvgs[p.categoria] = { sum: 0, n: 0 };
            catAvgs[p.categoria].sum += Number(ev.promedio_general);
            catAvgs[p.categoria].n += 1;
        });
        const catList = Object.entries(catAvgs).map(([cat, v]) => [cat, (v.sum / v.n).toFixed(1)]).sort((a, b) => Number(b[1]) - Number(a[1]));

        doc.autoTable({
            startY: y,
            head: [['CATEGORÍA', 'PROMEDIO', 'JUGADORES EVALUADOS']],
            body: catList.map(([cat, avg]) => [cat, avg, catAvgs[cat].n.toString()]),
            margin: { left: m, right: m },
            styles: { font: 'helvetica', fontSize: 8, cellPadding: 4, textColor: BLACK, lineColor: [225, 230, 235], lineWidth: 0.2 },
            headStyles: { fillColor: TEAL_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
            alternateRowStyles: { fillColor: GRAY_LIGHT },
            bodyStyles: { fillColor: WHITE },
            columnStyles: { 1: { halign: 'center', cellWidth: 30, fontStyle: 'bold' }, 2: { halign: 'center', cellWidth: 50 } },
            didParseCell: function (data) {
                if (data.column.index === 1 && data.section === 'body') {
                    const v = parseFloat(data.cell.raw);
                    if (!isNaN(v)) {
                        if (v >= 7) data.cell.styles.textColor = GREEN;
                        else if (v >= 5) data.cell.styles.textColor = YELLOW_DARK;
                        else data.cell.styles.textColor = RED;
                    }
                }
            }
        });

        // Resumen cuerpo técnico
        y = doc.lastAutoTable.finalY + 12;
        if (y > pageH - 50) { doc.addPage(); addHeader(doc, `Resumen Ejecutivo  ·  ${catLabel}`); y = 38; }

        y = sectionTitle(doc, 'ACTIVIDAD DEL CUERPO TÉCNICO', y);

        const playerCountByProf = {};
        filteredPlayers.forEach(p => {
            if (!p.registrado_por) return;
            playerCountByProf[p.registrado_por] = (playerCountByProf[p.registrado_por] || 0) + 1;
        });

        const profRows = state.professors
            .filter(p => p.rol === 'profesor' || p.rol === 'admin')
            .map(p => [
                p.nombre || '--',
                p.equipo_restringido || '--',
                (playerCountByProf[p.id] || 0).toString(),
                (state.profEvalsThisWeek[p.id] || 0).toString(),
                state.profLatestActivity[p.id] ? fmtDate(state.profLatestActivity[p.id]) : '—'
            ]);

        doc.autoTable({
            startY: y,
            head: [['PROFESOR', 'EQUIPO', 'JUGADORES', 'EVALS/SEM', 'ÚLTIMA ACTIVIDAD']],
            body: profRows,
            margin: { left: m, right: m },
            styles: { font: 'helvetica', fontSize: 7.5, cellPadding: 4, textColor: BLACK, lineColor: [225, 230, 235], lineWidth: 0.2 },
            headStyles: { fillColor: TEAL_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7 },
            alternateRowStyles: { fillColor: GRAY_LIGHT },
            bodyStyles: { fillColor: WHITE },
            columnStyles: {
                2: { halign: 'center', cellWidth: 28 },
                3: { halign: 'center', cellWidth: 28 },
                4: { cellWidth: 38 }
            }
        });

        // Footers
        const total = doc.internal.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
            doc.setPage(i);
            addFooter(doc, i, total);
        }

        const fileName = `Reporte_Direccion_${catLabel.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(fileName);
        setPdfStatus(`✅ Reporte generado: ${fileName}`, 'success');

    } catch (err) {
        console.error('PDF error:', err);
        setPdfStatus(`❌ Error: ${err.message}`, 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Generar PDF Ejecutivo';
}