/*
    Panel del Director Deportivo — Alebrijes Teotihuacán
    Acceso de solo lectura sobre todas las tablas del club.
*/

import { supabase } from './supabase-client.js';

// ==========================================
// PHOTO LOOKUP — jugador (mismo algoritmo que panel-admin)
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

// Fotos de los miembros del Cuerpo Técnico (mismo lookup que panel-profesor.js)
const PROF_PHOTO_LOOKUP = {
    'arturo tejeda': '../assets/PlantillaAlebrijesTeotihuacanLigaTDP/Arturo_Tejeda(Dashboard).jpg',
    'cesar benitez chaparro': '../assets/PlantillaSolesTeotihuacanSub16_TDP/César_Benítez_Chaparro_DirectorTecnico.jpg',
    'ignacio morales': '../assets/PlantillaSolesTeotihuacanLigaTDP/Ignacio_Morales_Campos_DirectorTecnico.jpg',
    'derk alexandro reyes rosas': '../assets/PlantillaAlebrijesTeotihuacanSub-16_TDP/Derk_Alexandro_Reyes_Rosas_DirectorTecnico.jpg'
};

const CARGO_LOOKUP = {
    'arturo tejeda': 'Director Técnico · Liga TDP',
    'cesar benitez chaparro': 'Director Técnico · Sub-16',
    'ignacio morales': 'Director Técnico · Soles TDP',
    'derk alexandro reyes rosas': 'Director Técnico · Sub-16'
};

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

function findProfPhotoInfo(nombre) {
    const key = normalizeStr(nombre);
    return PROF_PHOTO_LOOKUP[key] || null;
}

function findProfCargo(nombre) {
    const key = normalizeStr(nombre);
    return CARGO_LOOKUP[key] || 'Cuerpo Técnico';
}

function initialsFromName(s) {
    const parts = normalizeStr(s).split(/\s+/).filter(Boolean);
    if (!parts.length) return 'DT';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function titleCase(s) {
    return (s || '').trim().toLowerCase().split(' ').filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function playerPhotoHTML(player, opts = {}) {
    const firstName = titleCase((player.nombre || 'Sin nombre').split(' ')[0]);
    const initials = ((player.nombre || '').charAt(0) + (player.apellido || '').charAt(0)).toUpperCase() || '?';
    const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
    const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;
    const cls = opts.cls || 'dir-player-photo';

    if (imgSrc) {
        return `<div class="${cls}"><img src="${imgSrc}" alt="${firstName}" onerror="this.parentElement.innerHTML='<div class=&quot;default-avatar&quot;>${initials}</div>'"></div>`;
    }
    return `<div class="${cls}"><div class="default-avatar">${initials}</div></div>`;
}

// Devuelve SOLO el contenido interior (img o avatar). Usar cuando ya
// existe un wrapper con la clase correcta (ej: dir-drawer-photo).
function playerPhotoInner(player) {
    const firstName = titleCase((player.nombre || 'Sin nombre').split(' ')[0]);
    const initials = ((player.nombre || '').charAt(0) + (player.apellido || '').charAt(0)).toUpperCase() || '?';
    const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
    const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;

    if (imgSrc) {
        return `<img src="${imgSrc}" alt="${firstName}" onerror="this.parentElement.innerHTML='<div class=&quot;default-avatar&quot;>${initials}</div>'">`;
    }
    return `<div class="default-avatar">${initials}</div>`;
}

function profPhotoHTML(prof, opts = {}) {
    const initials = initialsFromName(prof.nombre);
    const src = findProfPhotoInfo(prof.nombre);
    const cls = opts.cls || 'dir-prof-photo';

    if (src) {
        return `<div class="${cls}"><img src="${src}" alt="${escapeHtml(prof.nombre)}" onerror="this.parentElement.innerHTML='<div class=&quot;default-avatar&quot;>${initials}</div>'"></div>`;
    }
    return `<div class="${cls}"><div class="default-avatar">${initials}</div></div>`;
}

function profPhotoInner(prof) {
    const initials = initialsFromName(prof.nombre);
    const src = findProfPhotoInfo(prof.nombre);

    if (src) {
        return `<img src="${src}" alt="${escapeHtml(prof.nombre)}" onerror="this.parentElement.innerHTML='<div class=&quot;default-avatar&quot;>${initials}</div>'">`;
    }
    return `<div class="default-avatar">${initials}</div>`;
}

function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function avgClass(n) {
    if (n == null || isNaN(n)) return 'avg-none';
    if (n >= 7) return 'avg-good';
    if (n >= 5) return 'avg-mid';
    return 'avg-low';
}

function avgTone(n) {
    if (n == null || isNaN(n)) return 'tone-none';
    if (n >= 7) return 'tone-high';
    if (n >= 5) return 'tone-mid';
    return 'tone-low';
}

function avgText(n) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toFixed(1);
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
    referenceWeek: null,
    playerLatestAvg: {},
    playerEvalsCount: {},
    playerEvalsByWeek: {},
    profEvalsThisWeek: {},
    profEvalsAll: {},
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
    setupHamburger();
    setupLogout();
    setupPdf();
    setupDrawers();

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

    if (profRes.error) console.error('[director] profesores error:', profRes.error);
    if (playerRes.error) console.error('[director] jugadores error:', playerRes.error);
    if (evalRes.error) console.error('[director] evaluaciones error:', evalRes.error);

    state.professors = profRes.data || [];
    state.players = playerRes.data || [];
    state.evaluations = evalRes.data || [];

    console.info('[director] Cargado:', {
        profesores: state.professors.length,
        jugadores: state.players.length,
        evaluaciones: state.evaluations.length,
        semanas: [...new Set(state.evaluations.map(e => e.semana).filter(Boolean))],
        categorias: [...new Set(state.players.map(p => p.categoria).filter(Boolean))]
    });

    state.categories = [...new Set(state.players.map(p => p.categoria).filter(Boolean))];
    state.weeks = [...new Set(state.evaluations.map(e => e.semana).filter(Boolean))].sort();
    state.referenceWeek = getReferenceWeek();
    console.info('[director] referenceWeek =', state.referenceWeek);

    // Latest avg per player
    state.playerLatestAvg = {};
    state.playerEvalsCount = {};
    state.playerEvalsByWeek = {};
    state.evaluations.forEach(ev => {
        if (ev.promedio_general != null) {
            const cur = state.playerLatestAvg[ev.jugador_id];
            const evDate = new Date(ev.fecha || ev.fecha_fin || 0).getTime();
            const curDate = cur ? new Date(cur.fecha || cur.fecha_fin || 0).getTime() : 0;
            if (!cur || evDate > curDate) state.playerLatestAvg[ev.jugador_id] = ev;
        }
        state.playerEvalsCount[ev.jugador_id] = (state.playerEvalsCount[ev.jugador_id] || 0) + 1;
        const w = ev.semana || '';
        if (!state.playerEvalsByWeek[ev.jugador_id]) state.playerEvalsByWeek[ev.jugador_id] = {};
        if (!state.playerEvalsByWeek[ev.jugador_id][w]) state.playerEvalsByWeek[ev.jugador_id][w] = [];
        state.playerEvalsByWeek[ev.jugador_id][w].push(ev);
    });

    // Per professor stats
    state.profEvalsThisWeek = {};
    state.profEvalsAll = {};
    state.profLatestActivity = {};
    state.evaluations.forEach(ev => {
        if (!ev.evaluador_id) return;
        if (!state.profEvalsAll[ev.evaluador_id]) state.profEvalsAll[ev.evaluador_id] = [];
        state.profEvalsAll[ev.evaluador_id].push(ev);

        if (ev.semana === state.referenceWeek) {
            state.profEvalsThisWeek[ev.evaluador_id] = (state.profEvalsThisWeek[ev.evaluador_id] || 0) + 1;
        }
        const curAct = state.profLatestActivity[ev.evaluador_id];
        const evDate = new Date(ev.fecha || ev.fecha_fin || 0).getTime();
        const curDate = curAct ? new Date(curAct).getTime() : 0;
        if (!curAct || evDate > curDate) state.profLatestActivity[ev.evaluador_id] = ev.fecha || ev.fecha_fin;
    });
}

// Devuelve la última semana CON DATOS. Si la semana actual ISO no tiene
// evaluaciones, usa la última semana que sí tenga (evita panel "vacío"
// al inicio de cada semana).
function getReferenceWeek() {
    const now = isoWeekNumber(new Date());
    const currentLabel = `${new Date().getFullYear()}-W${now}`;
    const allWeeks = state.weeks || [];
    if (allWeeks.includes(currentLabel)) return currentLabel;
    return allWeeks.length ? allWeeks[allWeeks.length - 1] : currentLabel;
}

function isoWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Etiqueta legible: "2026-W40 · 28 sept – 4 oct"
function weekLabel(week) {
    if (!week || !/^W\d+$/.test(week.replace(/^\d{4}-/, ''))) return null;
    const m = week.match(/^(\d{4})-W(\d+)$/);
    if (!m) return null;
    const year = Number(m[1]);
    const num = Number(m[2]);
    // ISO week date: Jan 4 always in week 1
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const week1Mon = new Date(jan4);
    week1Mon.setDate(jan4.getDate() - (jan4Day - 1));
    const mon = new Date(week1Mon);
    mon.setDate(week1Mon.getDate() + (num - 1) * 7);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);

    const fmt = (d) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    const yr = (d) => d.getFullYear();
    const sameYear = yr(mon) === yr(sun);
    return {
        year,
        num,
        start: mon,
        end: sun,
        label: `${week}`,
        rangeLabel: `${fmt(mon)} – ${sameYear ? fmt(sun) : `${fmt(sun)} ${yr(sun)}`}`
    };
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

    const evalsRef = state.evaluations.filter(e => e.semana === state.referenceWeek).length;
    document.getElementById('kpiEvals').textContent = evalsRef;
    document.getElementById('kpiEvalsTotal').textContent = state.evaluations.length;

    const evalsWithAvg = state.evaluations.filter(e => e.promedio_general != null);
    const avg = evalsWithAvg.length
        ? (evalsWithAvg.reduce((a, e) => a + Number(e.promedio_general), 0) / evalsWithAvg.length).toFixed(1)
        : '—';
    document.getElementById('kpiAvg').textContent = avg;
    document.getElementById('kpiAvgBase').textContent = evalsWithAvg.length;

    // === Top DE LA SEMANA — uno por categoría ===
    const wkLabel = weekLabel(state.referenceWeek);
    if (wkLabel) {
        document.getElementById('topWeekBadge').textContent = `${state.referenceWeek} · ${wkLabel.rangeLabel}`;
    } else {
        document.getElementById('topWeekBadge').textContent = state.referenceWeek;
    }

    // Agrupar evaluaciones de la referenceWeek por jugador, tomar la más reciente
    const refWeekEvalsByPlayer = {};
    state.evaluations
        .filter(e => e.semana === state.referenceWeek && e.promedio_general != null)
        .forEach(ev => {
            const cur = refWeekEvalsByPlayer[ev.jugador_id];
            const ts = new Date(ev.fecha || ev.fecha_fin || 0).getTime();
            const curTs = cur ? new Date(cur.fecha || cur.fecha_fin || 0).getTime() : 0;
            if (!cur || ts > curTs) refWeekEvalsByPlayer[ev.jugador_id] = ev;
        });

    // Para cada categoría, encontrar al MEJOR jugador de esa semana
    const bestByCategory = {}; // categoria -> { player, avg }
    Object.values(refWeekEvalsByPlayer).forEach(ev => {
        const p = state.players.find(pl => pl.id === ev.jugador_id);
        if (!p || !p.categoria) return;
        const c = p.categoria;
        const avg = Number(ev.promedio_general);
        const cur = bestByCategory[c];
        if (!cur || avg > cur.avg) {
            bestByCategory[c] = { player: p, avg };
        }
    });

    // Convertir a array, ordenar por avg DESC
    const topRanked = Object.values(bestByCategory)
        .sort((a, b) => b.avg - a.avg);

    document.getElementById('topGrid').innerHTML = topRanked.length
        ? topRanked.map((r, i) => `
            <article class="dir-top-card" data-player-id="${r.player.id}" role="button" tabindex="0" aria-label="Ver historial de ${escapeHtml(r.player.nombre)}">
                <span class="dir-top-rank">#${String(i + 1).padStart(2, '0')}</span>
                ${playerPhotoHTML(r.player, { cls: 'dir-top-photo' })}
                <div class="dir-top-score ${avgTone(r.avg)}">
                    <span class="dir-top-score-num">${avgText(r.avg)}</span>
                    <span class="dir-top-score-cap">PROM</span>
                </div>
                <div class="dir-top-name">${escapeHtml(titleCase((r.player.nombre || '').split(' ')[0]))} ${escapeHtml(titleCase((r.player.apellido || '').split(' ')[0]))}</div>
                <div class="dir-top-meta">${escapeHtml(r.player.categoria || '')} · ${escapeHtml(r.player.posicion || '')}</div>
            </article>
        `).join('')
        : `<div class="dir-empty">Aún no hay evaluaciones en ${state.referenceWeek}.</div>`;

    // Comparativa por categoría (mismo cálculo, ahora en su propio slot del grid-2)
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
        .map(([cat, v]) => ({ cat, avg: v.sum / v.n, n: v.n }))
        .sort((a, b) => b.avg - a.avg);

    const maxAvg = Math.max(...catList.map(c => c.avg), 10);
    document.getElementById('categoryBars').innerHTML = catList.length
        ? catList.map((c, i) => {
            const pct = Math.min(100, (c.avg / maxAvg) * 100);
            const rank = i + 1;
            const tier = rank === 1 ? 'top-rank' : '';
            const noun = c.n === 1 ? 'jugador evaluado' : 'jugadores evaluados';
            return `
                <article class="dir-cat-row ${tier}" data-rank="${rank}" aria-label="${escapeHtml(c.cat)}: promedio ${c.avg.toFixed(1)} sobre 10, posición ${rank}">
                    <span class="dir-cat-pos" aria-hidden="true">${String(rank).padStart(2, '0')}</span>
                    <div class="dir-cat-team">
                        <span class="dir-cat-name">${escapeHtml(c.cat)}</span>
                        <span class="dir-cat-meta">${c.n} ${noun}</span>
                    </div>
                    <div class="dir-cat-stat" aria-label="Promedio ${c.avg.toFixed(1)} sobre 10">
                        <span class="dir-cat-avg avg-pill ${avgTone(c.avg)}">${c.avg.toFixed(1)}</span>
                        <span class="dir-cat-unit">/ 10</span>
                    </div>
                    <div class="dir-cat-bar" aria-hidden="true">
                        <div class="dir-cat-bar-fill" style="width:${pct}%"></div>
                    </div>
                </article>`;
        }).join('')
        : '<div class="dir-empty">Sin datos por categoría.</div>';

    // === HISTORIAL DE LOS MEJORES DE LA SEMANA ===
    // Para los top 5 de la semana, traer TODAS sus evaluaciones de las últimas 6 semanas
    const last6Weeks = state.weeks.slice(-6);
    if (last6Weeks.length && wkLabel) {
        document.getElementById('historyRange').textContent = `${last6Weeks.length} semanas`;
    } else {
        document.getElementById('historyRange').textContent = '—';
    }

    const topPlayerIds = new Set(topRanked.map(r => r.player.id));
    const historyRows = [];
    topRanked.forEach(({ player }) => {
        const evalsByWeek = state.playerEvalsByWeek[player.id] || {};
        last6Weeks.forEach(w => {
            const evs = evalsByWeek[w];
            if (!evs || !evs.length) return;
            // Última evaluación de esa semana
            const ev = evs.slice().sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))[0];
            if (ev.promedio_general == null) return;
            historyRows.push({ player, ev, week: w });
        });
    });

    // Ordenar: jugador (mismo orden que topRanked), semana desc
    const playerOrder = {};
    topRanked.forEach((r, i) => { playerOrder[r.player.id] = i; });
    historyRows.sort((a, b) => {
        if (playerOrder[a.player.id] !== playerOrder[b.player.id]) return playerOrder[a.player.id] - playerOrder[b.player.id];
        return b.week.localeCompare(a.week);
    });

    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = historyRows.length
        ? historyRows.map(r => {
            const wk = weekLabel(r.week);
            const wkRange = wk ? `${wk.label} · ${wk.rangeLabel}` : r.week;
            // Sparkline: evolución de promedios en last6Weeks
            const series = last6Weeks.map(w => {
                const e = (state.playerEvalsByWeek[r.player.id]?.[w] || []);
                return e.length ? Number(e[0].promedio_general) : null;
            });
            const spark = renderSparklineSvg(series, 60, 18, avgTone(r.ev.promedio_general));

            return `
                <tr>
                    <td class="player-name" data-label="Jugador">${escapeHtml(titleCase(r.player.nombre))} ${escapeHtml(titleCase((r.player.apellido || '').split(' ')[0]))}</td>
                    <td data-label="Semana">${escapeHtml(wkRange)}</td>
                    <td data-label="Técnico">${r.ev.tecnico ?? '—'}</td>
                    <td data-label="Táctico">${r.ev.tactico ?? '—'}</td>
                    <td data-label="Físico">${r.ev.fisico ?? '—'}</td>
                    <td data-label="Mental">${r.ev.mental ?? '—'}</td>
                    <td data-label="Promedio"><span class="dir-history-avg ${avgTone(r.ev.promedio_general)}">${avgText(r.ev.promedio_general)}</span></td>
                    <td data-label="Tendencia">${spark}</td>
                </tr>
            `;
        }).join('')
        : `<tr><td colspan="8" class="dir-empty">Sin historial reciente para los mejores de la semana.</td></tr>`;

    // === Actividad reciente ===
    const recent = [...state.evaluations]
        .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
        .slice(0, 12);

    const activityCount = document.getElementById('activityCount');
    if (activityCount) activityCount.textContent = recent.length;

    document.getElementById('activityFeed').innerHTML = recent.length
        ? recent.map(ev => {
            const player = state.players.find(p => p.id === ev.jugador_id);
            const prof = state.professors.find(p => p.id === ev.evaluador_id);
            const pname = player ? `${titleCase(player.nombre)} ${titleCase(player.apellido || '')}` : 'Jugador';
            const pname2 = prof?.nombre || 'Profesor';
            const avg = ev.promedio_general != null ? Number(ev.promedio_general).toFixed(1) : '—';
            const avgToneCls = ev.promedio_general != null
                ? (Number(ev.promedio_general) >= 7 ? 'tone-high' : Number(ev.promedio_general) >= 5 ? 'tone-mid' : 'tone-low')
                : 'tone-none';
            return `
                <div class="dir-activity-item">
                    <div class="dir-activity-bullet"></div>
                    <div class="dir-activity-body">
                        <div class="dir-activity-headline">
                            <strong>${escapeHtml(pname2)}</strong> evaluó a <strong>${escapeHtml(pname)}</strong>
                        </div>
                        <div class="dir-activity-meta">
                            <span>${escapeHtml(fmtDate(ev.fecha || ev.fecha_fin))}</span>
                            <span>${escapeHtml(ev.semana || '')}</span>
                            <span class="avg-pill ${avgToneCls}">${avg}</span>
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

// SVG sparkline inline. series: array de números o null.
function renderSparklineSvg(series, w = 60, h = 18, tone = 'tone-mid') {
    const points = series
        .map((v, i) => v == null ? null : { v: Number(v), i })
        .filter(Boolean);
    if (points.length < 2) return `<svg class="dir-sparkline" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"></svg>`;

    const min = Math.min(...points.map(p => p.v));
    const max = Math.max(...points.map(p => p.v));
    const range = max - min || 1;
    const xs = (i) => (i / (series.length - 1)) * (w - 4) + 2;
    const ys = (v) => h - 2 - ((v - min) / range) * (h - 4);

    const colorMap = {
        'tone-high': '#10b981',
        'tone-mid': '#F36A21',
        'tone-low': '#ef4444',
        'tone-none': '#94a3b8'
    };
    const color = colorMap[tone] || '#F36A21';

    const path = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${xs(p.i).toFixed(2)},${ys(p.v).toFixed(2)}`).join(' ');
    const last = points[points.length - 1];

    return `
        <svg class="dir-sparkline" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-label="Tendencia">
            <path d="${path}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
            <circle cx="${xs(last.i).toFixed(2)}" cy="${ys(last.v).toFixed(2)}" r="2" fill="${color}"/>
        </svg>
    `;
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
            const latestEv = state.playerLatestAvg[p.id];
            const evalsCount = state.playerEvalsCount[p.id] || 0;
            const lastDate = latestEv?.fecha ? fmtRelative(latestEv.fecha) : null;
            return `
                <article class="dir-player" data-player-id="${p.id}" role="button" tabindex="0" aria-label="Ver historial de ${escapeHtml(p.nombre)} ${escapeHtml(p.apellido || '')}">
                    ${playerPhotoHTML(p, { cls: 'dir-player-photo' })}
                    <div class="dir-player-avg-overlay ${avgTone(avg)}">
                        <span class="avg-num">${avgText(avg)}</span>
                    </div>
                    <div class="dir-player-name">${escapeHtml(titleCase((p.nombre || '').split(' ')[0]))} ${escapeHtml(titleCase((p.apellido || '').split(' ')[0]))}</div>
                    <div class="dir-player-pos">${escapeHtml(p.posicion || '—')}${p.numero_camiseta ? ` · #${p.numero_camiseta}` : ''}</div>
                    <div class="dir-player-meta">
                        <span class="dir-player-meta-cat">${escapeHtml(p.categoria || '—')}</span>
                        <span class="dir-player-meta-evals">
                            <strong>${evalsCount}</strong> eval${evalsCount === 1 ? '' : 's'}${lastDate ? ` · ${escapeHtml(lastDate)}` : ''}
                        </span>
                    </div>
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
            const obs = ev.observaciones ? `<div class="dir-eval-obs">"${escapeHtml(ev.observaciones)}"</div>` : '';

            return `
                <article class="dir-eval-card">
                    <header class="dir-eval-header">
                        ${playerPhotoHTML(player, { cls: 'dir-eval-photo' })}
                        <div class="dir-eval-info">
                            <h4>${escapeHtml(titleCase((player.nombre || '').split(' ')[0]))} ${escapeHtml(titleCase((player.apellido || '').split(' ')[0]))}</h4>
                            <p>${escapeHtml(player.posicion || '')} · ${escapeHtml(player.categoria || '')}</p>
                        </div>
                        <div class="dir-eval-avg-big ${avgClass(avg)}">${avgText(avg)}</div>
                    </header>
                    <div class="dir-eval-metrics">
                        ${metrics.map(([l, v]) => `
                            <div class="dir-eval-metric">
                                <div class="dir-eval-metric-value">${v ?? '—'}</div>
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
                            ${escapeHtml(profName)}
                        </span>
                        ${ev.semana ? `<span class="dir-eval-week">${escapeHtml(ev.semana)}</span>` : ''}
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
    state.weeks.slice().reverse().forEach(w => {
        const opt = document.createElement('option');
        opt.value = w; opt.textContent = w;
        weekSel.appendChild(opt);
    });

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

    const playerCountByProf = {};
    state.players.forEach(p => {
        if (!p.registrado_por) return;
        playerCountByProf[p.registrado_por] = (playerCountByProf[p.registrado_por] || 0) + 1;
    });

    document.getElementById('profsCount').textContent = techs.length;
    document.getElementById('profsGrid').innerHTML = techs.map(prof => {
        const playersN = playerCountByProf[prof.id] || 0;
        const evalsWeek = state.profEvalsThisWeek[prof.id] || 0;
        const evalsTotal = (state.profEvalsAll[prof.id] || []).length;
        const cargo = findProfCargo(prof.nombre);

        return `
            <article class="dir-prof-card" data-prof-id="${prof.id}" role="button" tabindex="0" aria-label="Ver detalle de ${escapeHtml(prof.nombre)}">
                <span class="dir-prof-role-tag">${escapeHtml(cargo.split(' · ')[1] || cargo)}</span>
                ${profPhotoHTML(prof, { cls: 'dir-prof-photo' })}
                <div class="dir-prof-stats-overlay">
                    <span class="dir-prof-chip"><strong>${playersN}</strong> jug.</span>
                    <span class="dir-prof-chip"><strong>${evalsWeek}</strong> ev/sem</span>
                </div>
                <div class="dir-prof-name">${escapeHtml(prof.nombre || 'Sin nombre')}</div>
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
            // En móvil: cerrar sidebar al cambiar de vista
            closeMobileSidebar();
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
// MOBILE SIDEBAR (hamburger)
// ==========================================

function setupHamburger() {
    const btn = document.getElementById('dirHamburger');
    const sidebar = document.getElementById('dirSidebar');
    const backdrop = document.getElementById('dirSidebarBackdrop');
    if (!btn || !sidebar || !backdrop) return;

    const open = () => {
        sidebar.classList.add('dir-sidebar-mobile-open');
        backdrop.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('dir-sidebar-open');
    };
    const close = () => {
        sidebar.classList.remove('dir-sidebar-mobile-open');
        backdrop.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('dir-sidebar-open');
    };

    btn.addEventListener('click', () => {
        if (sidebar.classList.contains('dir-sidebar-mobile-open')) close();
        else open();
    });
    backdrop.addEventListener('click', close);
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('dirSidebar');
    const backdrop = document.getElementById('dirSidebarBackdrop');
    const btn = document.getElementById('dirHamburger');
    if (sidebar) sidebar.classList.remove('dir-sidebar-mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('dir-sidebar-open');
}

// ==========================================
// DRAWERS
// ==========================================
function setupDrawers() {
    const backdrop = document.getElementById('dirDrawerBackdrop');
    backdrop.addEventListener('click', closeAllDrawers);

    // Click en cards de plantilla + top-grid (delegación en document)
    document.getElementById('plantillaGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.dir-player');
        if (card) openPlayerDrawer(card.dataset.playerId);
    });
    document.getElementById('plantillaGrid').addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('dir-player')) {
            e.preventDefault();
            openPlayerDrawer(e.target.dataset.playerId);
        }
    });
    document.getElementById('topGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.dir-top-card');
        if (card) openPlayerDrawer(card.dataset.playerId);
    });
    document.getElementById('topGrid').addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('dir-top-card')) {
            e.preventDefault();
            openPlayerDrawer(e.target.dataset.playerId);
        }
    });

    // Click en cards de cuerpo técnico
    document.getElementById('profsGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.dir-prof-card');
        if (card) openProfDrawer(card.dataset.profId);
    });
    document.getElementById('profsGrid').addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('dir-prof-card')) {
            e.preventDefault();
            openProfDrawer(e.target.dataset.profId);
        }
    });

    // Botones close
    document.getElementById('playerDrawerClose').addEventListener('click', () => {
        closeDrawer(document.getElementById('playerDrawer'));
    });
    document.getElementById('profDrawerClose').addEventListener('click', () => {
        closeDrawer(document.getElementById('profDrawer'));
    });

    // Tabs del drawer de profesor
    document.querySelectorAll('.drawer-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabKey = tab.dataset.tab;
            document.querySelectorAll('.drawer-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.tab === tabKey);
                t.setAttribute('aria-selected', t.dataset.tab === tabKey ? 'true' : 'false');
            });
            document.querySelectorAll('.drawer-tab-content').forEach(c => {
                c.classList.toggle('active', c.id === `prof-tab-${tabKey.replace('prof-', '')}`);
            });
        });
    });

    // Esc para cerrar drawers y sidebar móvil
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDrawers();
            closeMobileSidebar();
        }
    });
}

function openDrawer(el) {
    el.classList.add('active');
    el.setAttribute('aria-hidden', 'false');
    document.getElementById('dirDrawerBackdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => el.focus(), 350);
}

function closeDrawer(el) {
    if (!el) return;
    el.classList.remove('active');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.getElementById('dirDrawerBackdrop').classList.remove('active');
}

function closeAllDrawers() {
    closeDrawer(document.getElementById('playerDrawer'));
    closeDrawer(document.getElementById('profDrawer'));
}

// --- Player Drawer: historial ---
function openPlayerDrawer(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    document.getElementById('playerDrawerTitle').textContent =
        `${titleCase(player.nombre)} ${titleCase(player.apellido || '')}`;
    document.getElementById('playerDrawerSubtitle').textContent =
        `${player.posicion || '—'} · ${player.categoria || ''} · ${player.equipo || ''}`;

    // Foto (inyectar solo contenido interior; el div wrapper ya existe en HTML)
    document.getElementById('playerDrawerPhoto').innerHTML = playerPhotoInner(player);

    // Body: historial cronológico
    const evals = (state.playerEvalsByWeek[player.id] || {});
    const allWeeks = Object.keys(evals).sort().reverse();
    const wkLabel0 = weekLabel(state.referenceWeek);
    const subtitle = wkLabel0 ? `Última semana con datos: ${state.referenceWeek} (${wkLabel0.rangeLabel})` : '';

    let html = subtitle ? `<div style="font-size:0.72rem;color:var(--dir-text-muted);margin-bottom:16px;padding:8px 12px;background:var(--dir-bg);border-radius:8px;border-left:3px solid var(--dir-primary);">${subtitle}</div>` : '';

    if (!allWeeks.length) {
        html += '<div class="drawer-empty">Sin evaluaciones registradas aún.</div>';
    } else {
        allWeeks.forEach(w => {
            const wk = weekLabel(w);
            const wkTitle = wk ? `${wk.label} · <span style="font-weight:500;color:var(--dir-text-muted);">${wk.rangeLabel}</span>` : w;
            const evs = evals[w].slice().sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
            evs.forEach(ev => {
                const metrics = [
                    ['Técnico', ev.tecnico],
                    ['Táctico', ev.tactico],
                    ['Físico', ev.fisico],
                    ['Mental', ev.mental]
                ];
                const obs = ev.observaciones ? `<div class="drawer-history-obs">"${escapeHtml(ev.observaciones)}"</div>` : '';
                const meta = [
                    ev.inasistencias != null && ev.inasistencias !== '' ? `<span>${ev.inasistencias} inasistencias</span>` : '',
                    ev.minutos_jugados != null && ev.minutos_jugados !== '' ? `<span>${ev.minutos_jugados} min jugados</span>` : '',
                    ev.tipo ? `<span>${escapeHtml(ev.tipo)}</span>` : ''
                ].filter(Boolean).join('');

                html += `
                    <div class="drawer-history-item">
                        <div class="drawer-history-week">
                            <span class="drawer-history-week-label">${wkTitle}</span>
                            <span class="drawer-history-week-avg ${avgTone(ev.promedio_general)}">${avgText(ev.promedio_general)}</span>
                        </div>
                        <div class="drawer-history-metrics">
                            ${metrics.map(([l, v]) => `
                                <div class="drawer-history-metric">
                                    <div class="drawer-history-metric-value">${v ?? '—'}</div>
                                    <div class="drawer-history-metric-label">${l}</div>
                                </div>`).join('')}
                        </div>
                        ${obs}
                        ${meta ? `<div class="drawer-history-meta">${meta}</div>` : ''}
                    </div>
                `;
            });
        });
    }

    document.getElementById('playerDrawerBody').innerHTML = html;

    // Reset scroll y abre
    document.getElementById('playerDrawerBody').scrollTop = 0;
    openDrawer(document.getElementById('playerDrawer'));
}

// --- Prof Drawer: jugadores + evaluaciones + resumen ---
function openProfDrawer(profId) {
    const prof = state.professors.find(p => p.id === profId);
    if (!prof) return;

    const cargo = findProfCargo(prof.nombre);
    const equipo = prof.equipo_restringido || 'Acceso completo al club';

    document.getElementById('profDrawerTitle').textContent = prof.nombre || 'Cuerpo Técnico';
    document.getElementById('profDrawerSubtitle').textContent = prof.email || '';
    document.getElementById('profDrawerRole').textContent = cargo;

    document.getElementById('profDrawerPhoto').innerHTML = profPhotoInner(prof);

    // === Jugadores a cargo ===
    const ownPlayers = state.players.filter(p => p.registrado_por === prof.id);
    const allEvalsByPlayer = (pid) => state.profEvalsAll[prof.id]?.filter(ev => ev.jugador_id === pid) || [];

    // Jugadores evaluados (incluso si no los registró, han pasado por su evaluación)
    const evaluatedPlayerIds = new Set((state.profEvalsAll[prof.id] || []).map(ev => ev.jugador_id));
    const evaluatedPlayers = state.players.filter(p => evaluatedPlayerIds.has(p.id));

    // Combinar (registrados únicos) sin duplicar
    const seen = new Set();
    const playersList = [];
    ownPlayers.forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); playersList.push({ player: p, source: 'registrado' }); } });
    evaluatedPlayers.forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); playersList.push({ player: p, source: 'evaluado' }); } });

    document.getElementById('profTabPlayersCount').textContent = playersList.length;
    document.getElementById('profPlayersGrid').innerHTML = playersList.length
        ? playersList.map(({ player, source }) => {
            const avg = state.playerLatestAvg[player.id]?.promedio_general ?? null;
            const sourceLabel = source === 'registrado' ? 'Registró' : 'Evaluó';
            return `
                <div class="drawer-mini-card" data-player-id="${player.id}" role="button" tabindex="0" aria-label="Ver historial de ${escapeHtml(player.nombre)}">
                    ${playerPhotoHTML(player, { cls: 'drawer-mini-photo' })}
                    <div class="drawer-mini-name">${escapeHtml(titleCase((player.nombre || '').split(' ')[0]))} ${escapeHtml(titleCase((player.apellido || '').split(' ')[0]))}</div>
                    <span class="drawer-mini-avg ${avgTone(avg)}">${avgText(avg)}</span>
                    <div style="font-size:0.58rem;color:var(--dir-text-light);margin-top:3px;">${sourceLabel}</div>
                </div>`;
        }).join('')
        : '<div class="drawer-empty">Aún no tiene jugadores asignados.</div>';

    // Click en mini-card abre drawer del jugador
    document.getElementById('profPlayersGrid').querySelectorAll('.drawer-mini-card').forEach(card => {
        card.addEventListener('click', () => {
            // Cierra este drawer y abre el del jugador
            closeDrawer(document.getElementById('profDrawer'));
            setTimeout(() => openPlayerDrawer(card.dataset.playerId), 250);
        });
    });

    // === Evaluaciones realizadas ===
    const profEvals = (state.profEvalsAll[prof.id] || []).slice().sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    document.getElementById('profTabEvalsCount').textContent = profEvals.length;
    document.getElementById('profEvalsList').innerHTML = profEvals.length
        ? profEvals.slice(0, 30).map(ev => {
            const player = state.players.find(p => p.id === ev.jugador_id);
            const pname = player ? `${titleCase(player.nombre)} ${titleCase(player.apellido || '')}` : 'Jugador';
            return `
                <div class="drawer-eval-item">
                    <div class="drawer-eval-item-info">
                        <div class="drawer-eval-item-name">${escapeHtml(pname)}</div>
                        <div class="drawer-eval-item-meta">${escapeHtml(ev.semana || '')} · ${escapeHtml(fmtDate(ev.fecha || ev.fecha_fin))}</div>
                    </div>
                    <div class="drawer-eval-item-avg ${avgTone(ev.promedio_general)}">${avgText(ev.promedio_general)}</div>
                </div>`;
        }).join('') + (profEvals.length > 30 ? `<div class="drawer-empty" style="padding:8px;">Mostrando 30 de ${profEvals.length} evaluaciones.</div>` : '')
        : '<div class="drawer-empty">Sin evaluaciones realizadas.</div>';

    // === Resumen semanal ===
    document.getElementById('profSummaryTotal').textContent = profEvals.length;
    document.getElementById('profSummaryPlayers').textContent = evaluatedPlayerIds.size;
    const evalsWithAvg = profEvals.filter(e => e.promedio_general != null);
    const avgImp = evalsWithAvg.length
        ? (evalsWithAvg.reduce((a, e) => a + Number(e.promedio_general), 0) / evalsWithAvg.length).toFixed(1)
        : '—';
    document.getElementById('profSummaryAvg').textContent = avgImp;

    // Sparkline por semana
    const last6 = state.weeks.slice(-6);
    const countsByWeek = last6.map(w => profEvals.filter(e => e.semana === w).length);
    const maxCount = Math.max(...countsByWeek, 1);
    const wW = 300, wH = 100;
    const pts = countsByWeek.map((c, i) => {
        const x = last6.length > 1 ? (i / (last6.length - 1)) * (wW - 20) + 10 : wW / 2;
        const y = wH - 20 - (c / maxCount) * (wH - 30);
        return { x, y, c, w: last6[i] };
    });

    const linePath = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const circles = pts.map(p =>
        p.c > 0
            ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="#F36A21" stroke="#fff" stroke-width="1.5"/>
               <text x="${p.x.toFixed(1)}" y="${(p.y - 8).toFixed(1)}" text-anchor="middle" font-family="Montserrat" font-size="9" font-weight="700" fill="#F36A21">${p.c}</text>`
            : ''
    ).join('');
    const labels = pts.map(p =>
        `<text x="${p.x.toFixed(1)}" y="${wH - 4}" text-anchor="middle" font-family="Montserrat" font-size="9" fill="#94a3b8">${(p.w || '').replace(/^\d{4}-/, '')}</text>`
    ).join('');

    document.getElementById('profSparkline').innerHTML = `
        <line x1="10" y1="${wH - 20}" x2="${wW - 10}" y2="${wH - 20}" stroke="#e5e9f0" stroke-width="1"/>
        ${linePath ? `<path d="${linePath}" fill="none" stroke="#F36A21" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
        ${circles}
        ${labels}
    `;

    // Reset tab to players
    document.querySelectorAll('.drawer-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === 'prof-players');
        t.setAttribute('aria-selected', t.dataset.tab === 'prof-players' ? 'true' : 'false');
    });
    document.querySelectorAll('.drawer-tab-content').forEach(c => {
        c.classList.toggle('active', c.id === 'prof-tab-players');
    });

    document.querySelector('.dir-drawer#profDrawer .dir-drawer-body').scrollTop = 0;
    openDrawer(document.getElementById('profDrawer'));
}

// ==========================================
// PDF REPORT (paleta naranja)
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

        // Paleta institucional naranja
        const ORANGE_DARK = [243, 106, 33];
        const ORANGE_LIGHT = [255, 140, 66];
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
        const wkLabel = weekLabel(state.referenceWeek);
        const wkText = wkLabel ? `${state.referenceWeek} · ${wkLabel.rangeLabel}` : state.referenceWeek;

        function addHeader(d, subtitle) {
            d.setFillColor(...ORANGE_DARK);
            d.rect(0, 0, pageW, 4, 'F');
            d.setFillColor(...WHITE);
            d.rect(0, 4, pageW, 28, 'F');
            if (logo) { try { d.addImage(logo, 'PNG', m, 6, 24, 24); } catch (e) { } }
            d.setFont('helvetica', 'bold');
            d.setFontSize(15);
            d.setTextColor(...BLACK);
            d.text('CLUB ALEBRIJES DE OAXACA', pageW / 2, 15, { align: 'center' });
            d.setFontSize(8);
            d.setTextColor(...ORANGE_DARK);
            d.text('DIRECCIÓN DEPORTIVA  ·  REPORTE EJECUTIVO', pageW / 2, 21, { align: 'center' });
            d.setFontSize(7.5);
            d.setTextColor(...GRAY_TEXT);
            d.setFont('helvetica', 'normal');
            d.text(subtitle, pageW / 2, 27, { align: 'center' });
            d.setDrawColor(...ORANGE_DARK);
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
            d.setTextColor(...ORANGE_DARK);
            d.setFont('helvetica', 'bold');
            d.text(`${pageNum} / ${totalPages}`, pageW - m, y, { align: 'right' });
            d.setTextColor(...GRAY_MID);
            d.setFont('helvetica', 'normal');
            d.text(nowStr, pageW / 2, y, { align: 'center' });
        }

        function sectionTitle(d, text, yPos) {
            d.setFillColor(...ORANGE_DARK);
            d.rect(m, yPos, 3, 7, 'F');
            d.setFont('helvetica', 'bold');
            d.setFontSize(10);
            d.setTextColor(...BLACK);
            d.text(text, m + 6, yPos + 5.5);
            return yPos + 12;
        }

        // ============ PAGE 1: SUMMARY ============
        addHeader(doc, `Resumen Ejecutivo  ·  ${catLabel}  ·  ${wkText}`);

        let y = 38;

        const evalsWithAvg = filteredEvals.filter(e => e.promedio_general != null);
        const avgClub = evalsWithAvg.length
            ? (evalsWithAvg.reduce((a, e) => a + Number(e.promedio_general), 0) / evalsWithAvg.length).toFixed(1)
            : '—';
        const evalsRefWeek = filteredEvals.filter(e => e.semana === state.referenceWeek).length;

        doc.setFillColor(...GRAY_LIGHT);
        doc.roundedRect(m, y, pageW - m * 2, 12, 2, 2, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAY_TEXT);
        doc.text(
            `Jugadores: ${filteredPlayers.length}   ·   Evaluaciones: ${filteredEvals.length}   ·   Esta semana (${state.referenceWeek}): ${evalsRefWeek}   ·   Promedio club: ${avgClub}   ·   Categoría: ${catLabel}`,
            pageW / 2, y + 7.5, { align: 'center' }
        );
        y += 18;

        y = sectionTitle(doc, `MEJOR POR CATEGORÍA · ${state.referenceWeek}`, y);

        const refWeekEvalsByPlayer = {};
        filteredEvals
            .filter(e => e.semana === state.referenceWeek && e.promedio_general != null)
            .forEach(ev => {
                const cur = refWeekEvalsByPlayer[ev.jugador_id];
                const ts = new Date(ev.fecha || ev.fecha_fin || 0).getTime();
                const curTs = cur ? new Date(cur.fecha || cur.fecha_fin || 0).getTime() : 0;
                if (!cur || ts > curTs) refWeekEvalsByPlayer[ev.jugador_id] = ev;
            });

        // Mejor por categoría
        const bestByCat = {};
        Object.values(refWeekEvalsByPlayer).forEach(ev => {
            const p = filteredPlayers.find(pl => pl.id === ev.jugador_id);
            if (!p || !p.categoria) return;
            const c = p.categoria;
            const avg = Number(ev.promedio_general);
            if (!bestByCat[c] || avg > bestByCat[c].avg) bestByCat[c] = { p, avg };
        });
        const ranked = Object.values(bestByCat)
            .sort((a, b) => b.avg - a.avg);

        const topRows = ranked.map((r, i) => [
            `#${i + 1}`,
            `${titleCase((r.p.nombre || '').split(' ')[0])} ${titleCase((r.p.apellido || '').split(' ')[0])}`,
            r.p.posicion || '—',
            r.p.categoria || '—',
            Number(r.avg).toFixed(1)
        ]);

        doc.autoTable({
            startY: y,
            head: [['#', 'JUGADOR', 'POSICIÓN', 'CATEGORÍA', 'PROMEDIO']],
            body: topRows,
            margin: { left: m, right: m },
            styles: { font: 'helvetica', fontSize: 8, cellPadding: 4, textColor: BLACK, lineColor: [225, 230, 235], lineWidth: 0.2 },
            headStyles: { fillColor: ORANGE_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
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

        y = doc.lastAutoTable.finalY + 12;
        if (y > pageH - 60) { doc.addPage(); addHeader(doc, `Resumen Ejecutivo  ·  ${catLabel}  ·  ${wkText}`); y = 38; }

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
            headStyles: { fillColor: ORANGE_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
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

        y = doc.lastAutoTable.finalY + 12;
        if (y > pageH - 50) { doc.addPage(); addHeader(doc, `Resumen Ejecutivo  ·  ${catLabel}  ·  ${wkText}`); y = 38; }

        y = sectionTitle(doc, 'ACTIVIDAD DEL CUERPO TÉCNICO', y);

        const playerCountByProf = {};
        filteredPlayers.forEach(p => {
            if (!p.registrado_por) return;
            playerCountByProf[p.registrado_por] = (playerCountByProf[p.registrado_por] || 0) + 1;
        });

        const profRows = state.professors
            .filter(p => p.rol === 'profesor' || p.rol === 'admin')
            .map(p => [
                p.nombre || '—',
                p.equipo_restringido || '—',
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
            headStyles: { fillColor: ORANGE_DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 7 },
            alternateRowStyles: { fillColor: GRAY_LIGHT },
            bodyStyles: { fillColor: WHITE },
            columnStyles: {
                2: { halign: 'center', cellWidth: 28 },
                3: { halign: 'center', cellWidth: 28 },
                4: { cellWidth: 38 }
            }
        });

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