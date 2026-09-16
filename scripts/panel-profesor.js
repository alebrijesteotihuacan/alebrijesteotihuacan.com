/*
    Alebrijes de Oaxaca Teotihuacán
    Professor Panel Script (Supabase)
*/

import { supabase } from './supabase-client.js';

// ==========================================
// DOM ELEMENTS
// ==========================================
const loadingState = document.getElementById('loadingState');
const dashboardContent = document.getElementById('dashboardContent');
const profName = document.getElementById('profName');
const profEmail = document.getElementById('profEmail');
const logoutBtn = document.getElementById('logoutBtn');
const totalJugadores = document.getElementById('totalJugadores');
const totalEvaluaciones = document.getElementById('totalEvaluaciones');
const playersCountBadge = document.getElementById('playersCount');
const playersGrid = document.getElementById('playersGrid');
const searchInput = document.getElementById('searchInput');
const evalModal = document.getElementById('evalModal');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const evalForm = document.getElementById('evalForm');
const playerEvalInfo = document.getElementById('playerEvalInfo');
const successToast = document.getElementById('successToast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// Registration DOM Elements
const btnAddPlayer = document.getElementById('btnAddPlayer');
const registerModal = document.getElementById('registerModal');
const registerModalClose = document.getElementById('registerModalClose');
const registerBtnCancel = document.getElementById('registerBtnCancel');
const registerForm = document.getElementById('registerForm');
const sessionCounter = document.getElementById('sessionCounter');
const registrationCounter = document.getElementById('registrationCounterBox');

// Registration inputs
const regNombre = document.getElementById('regNombre');
const regApellido = document.getElementById('regApellido');
const regFechaNac = document.getElementById('regFechaNac');
const regPassword = document.getElementById('regPassword');
const regPasswordConfirm = document.getElementById('regPasswordConfirm');
const regPasswordToggle = document.getElementById('regPasswordToggle');
const regPasswordGenerator = document.getElementById('regPasswordGenerator');
const regEmail = document.getElementById('regEmail');

// Mobile nav
const mobileBtnSidebar = document.getElementById('mobileBtnSidebar');
const mobileBtnAddPlayer = document.getElementById('mobileBtnAddPlayer');
const mobileBtnPDF = document.getElementById('mobileBtnPDF');
const mobileBtnLogout = document.getElementById('mobileBtnLogout');
const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');

// Sidebar year cap for date input
const todayISO = new Date().toISOString().split('T')[0];
if (regFechaNac) regFechaNac.max = todayISO;

// ==========================================
// STATE
// ==========================================
let registeredCount = 0;
let currentProfessor = null;
let currentPlayerId = null;
let allPlayers = [];
let dashboardInitialized = false;
let currentEditEvalId = null;
let activeWeekFilter = '';
let evalFormSnapshot = null; // Snapshot of last loaded evaluation (for dirty check)
let playerToDelete = null;

// Map old category names in Firebase → new display names
const CATEGORY_ALIAS = {
    'Sub-13': 'Sub-14',
    'Sub-15': 'Sub-16',
    'Sub-17': 'Sub-18',
    'Sub-20': 'Sub-21',
};

function normalizeCategoria(cat) {
    return CATEGORY_ALIAS[cat] || cat;
}

// ==========================================
// ISO WEEK 8601 HELPERS
// ==========================================

function getCurrentIsoWeek() {
    const now = new Date();
    const target = new Date(now.valueOf());
    const dayNr = (now.getDay() + 6) % 7; // Mon = 0
    target.setDate(target.getDate() - dayNr + 3); // Thursday of current week
    const firstThursday = new Date(target.valueOf());
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const week = 1 + Math.ceil((firstThursday - target) / 604800000);
    const year = now.getFullYear();
    return `${year}-W${String(week).padStart(2, '0')}`;
}

function isoWeekDateRange(weekStr) {
    if (!weekStr || !/^\d{4}-W\d{2}$/.test(weekStr)) return '';
    const [yearStr, wPart] = weekStr.split('-W');
    const year = parseInt(yearStr, 10);
    const week = parseInt(wPart, 10);
    const jan4 = new Date(year, 0, 4);
    const jan4Weekday = (jan4.getDay() + 6) % 7;
    const weekStart = new Date(jan4);
    weekStart.setDate(jan4.getDate() - jan4Weekday + (week - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const fmt = (d) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    return `${fmt(weekStart)} – ${fmt(weekEnd)}, ${year}`;
}

function getWeekDateRange(semana) {
    if (!semana || !/^\d{4}-W\d{2}$/.test(semana)) return { fechaInicio: null, fechaFin: null };
    const [yearStr, wPart] = semana.split('-W');
    const year = parseInt(yearStr, 10);
    const week = parseInt(wPart, 10);
    const jan4 = new Date(year, 0, 4);
    const jan4Weekday = (jan4.getDay() + 6) % 7;
    const fechaInicio = new Date(jan4);
    fechaInicio.setDate(jan4.getDate() - jan4Weekday + (week - 1) * 7);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);
    return { fechaInicio, fechaFin };
}

// ==========================================
// MODAL HELPER (ARIA + focus trap)
// ==========================================

const openModal = (modalEl) => {
    if (!modalEl) return;
    const prev = document.activeElement;
    modalEl.dataset.prevFocusId = prev && prev.id ? prev.id : '';

    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = Array.from(modalEl.querySelectorAll(
        'input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not(.modal-close), a[href]'
    ));
    setTimeout(() => {
        if (focusable.length > 0) focusable[0].focus();
    }, 60);

    const trap = (e) => {
        if (e.key !== 'Tab' || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };
    modalEl._focusTrap = trap;
    modalEl.addEventListener('keydown', trap);
};

const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    if (modalEl._focusTrap) {
        modalEl.removeEventListener('keydown', modalEl._focusTrap);
        modalEl._focusTrap = null;
    }
    const prevId = modalEl.dataset.prevFocusId;
    if (prevId) {
        const el = document.getElementById(prevId);
        if (el && typeof el.focus === 'function') el.focus();
    }
    if (!document.querySelector('.modal-overlay.active')) {
        document.body.style.overflow = '';
    }
};

const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
};

// ==========================================
// TOAST HELPER
// ==========================================

const TOAST_SVG = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error:   '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info:    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
};

function showToast(message, type = 'success') {
    if (!successToast || !toastMessage) return;
    toastMessage.textContent = message;
    successToast.className = `toast show toast-${type}`;
    if (toastIcon) toastIcon.innerHTML = TOAST_SVG[type] || TOAST_SVG.success;
    if (successToast._toastTimer) clearTimeout(successToast._toastTimer);
    successToast._toastTimer = setTimeout(() => {
        successToast.classList.remove('show');
    }, 3200);
}

// ==========================================
// PASSWORD HELPERS
// ==========================================

function passwordStrength(pwd) {
    if (!pwd) return { score: 0, label: '—' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score >= 4) return { score: 4, label: 'Fuerte' };
    if (score === 3) return { score: 3, label: 'Buena' };
    if (score === 2) return { score: 2, label: 'Media' };
    return { score: 1, label: 'Débil' };
}

function generateSecurePassword(length = 14) {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const digits = '23456789';
    const special = '!@#$%&*?+-';
    let pwd = '';
    pwd += upper[Math.floor(Math.random() * upper.length)];
    pwd += lower[Math.floor(Math.random() * lower.length)];
    pwd += digits[Math.floor(Math.random() * digits.length)];
    pwd += special[Math.floor(Math.random() * special.length)];
    const all = upper + lower + digits + special;
    while (pwd.length < length) {
        pwd += all[Math.floor(Math.random() * all.length)];
    }
    return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

function updatePasswordStrength() {
    const wrap = document.getElementById('passwordStrength');
    if (!wrap || !regPassword) return;
    const val = regPassword.value;
    if (!val) {
        wrap.hidden = true;
        return;
    }
    wrap.hidden = false;
    const { score, label } = passwordStrength(val);
    const segments = wrap.querySelectorAll('.password-strength-segment');
    const labelEl = wrap.querySelector('.password-strength-label');
    segments.forEach((seg, i) => {
        seg.classList.toggle('active', i < score);
        seg.classList.remove('weak', 'medium', 'strong');
        if (i < score) {
            if (score <= 1) seg.classList.add('weak');
            else if (score <= 3) seg.classList.add('medium');
            else seg.classList.add('strong');
        }
    });
    if (labelEl) {
        labelEl.textContent = label;
        labelEl.classList.remove('weak', 'medium', 'strong');
        if (score <= 1) labelEl.classList.add('weak');
        else if (score <= 3) labelEl.classList.add('medium');
        else labelEl.classList.add('strong');
    }
}

// ==========================================
// FIELD VALIDATION HELPERS
// ==========================================

function setFieldError(fieldId, hasError) {
    const el = fieldId ? document.getElementById(fieldId) : null;
    const field = el ? el.closest('.register-field') : null;
    if (!field) return;
    field.classList.toggle('has-error', !!hasError);
}

function clearAllFieldErrors() {
    document.querySelectorAll('.register-field.has-error').forEach(f => f.classList.remove('has-error'));
}

function validateRegistrationForm() {
    clearAllFieldErrors();
    let ok = true;
    if (!regNombre.value.trim()) { setFieldError('regNombre', true); ok = false; }
    if (!regApellido.value.trim()) { setFieldError('regApellido', true); ok = false; }
    const emailVal = regEmail.value.trim().toLowerCase();
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setFieldError('regEmail', true); ok = false;
    }
    if (!regPassword.value || regPassword.value.length < 8) {
        setFieldError('regPassword', true); ok = false;
    }
    if (regPassword.value !== regPasswordConfirm.value) {
        setFieldError('regPasswordConfirm', true); ok = false;
    }
    if (!regFechaNac.value || regFechaNac.value > todayISO) {
        setFieldError('regFechaNac', true); ok = false;
    }
    if (!document.getElementById('regPosicion').value) {
        setFieldError('regPosicion', true); ok = false;
    }
    return ok;
}

// ==========================================
// DEBOUNCE
// ==========================================

function debounce(fn, wait = 150) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

// ==========================================
// STRING HELPERS
// ==========================================

function toTitleCase(str) {
    if (!str) return '';
    return str.trim().toLowerCase()
        .split(' ')
        .filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function getShortName(nombre, apellido) {
    const first = toTitleCase((nombre || '').split(' ')[0]);
    const last = toTitleCase((apellido || '').split(' ')[0]);
    return `${first} ${last}`.trim() || 'Sin nombre';
}

function getInitials(nombre, apellido) {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '';
    const last = apellido ? apellido.charAt(0).toUpperCase() : '';
    return first + last || '?';
}

function normalizeStr(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function formatWeekLabel(weekStr) {
    if (!weekStr) return weekStr;
    const [year, wPart] = weekStr.split('-W');
    if (!wPart) return weekStr;
    return `Semana ${wPart}, ${year}`;
}

// Check authentication
//
// Use getSession() for the initial load (waits for the session to be restored
// from localStorage), then subscribe to onAuthStateChange ONLY for future
// sign-out events. Using onAuthStateChange as the initial-check mechanism is
// racy: Supabase may fire INITIAL_SESSION with a null session before the
// persisted session is restored, causing a redirect loop with login.html.
async function loadProfessorForUser(user) {
    if (!user) return;
    if (dashboardInitialized && currentProfessor && currentProfessor.id === user.id) return;

    try {
        const { data: profData } = await supabase
            .from('profesores')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (profData) {
            currentProfessor = { id: user.id, email: user.email, ...profData };
        } else {
            currentProfessor = {
                id: user.id,
                email: user.email,
                nombre: (user.user_metadata?.displayName) || user.email.split('@')[0],
                rol: 'profesor'
            };
        }

        await initDashboard();
        dashboardInitialized = true;
    } catch (error) {
        console.error('Error loading professor:', error);
        currentProfessor = {
            id: user.id,
            email: user.email,
            nombre: (user.user_metadata?.displayName) || user.email.split('@')[0],
            rol: 'profesor'
        };
        await initDashboard();
        dashboardInitialized = true;
    }
}

(async function initAuth() {
    // 1. Get the current session synchronously from localStorage
    let session = null;
    try {
        const { data } = await supabase.auth.getSession();
        session = data?.session || null;
    } catch (err) {
        console.error('Error getting session:', err);
    }

    if (!session?.user) {
        // No session: redirect to login (and DON'T subscribe — would re-trigger redirect)
        window.location.href = 'login.html';
        return;
    }

    // 2. Session found — load professor and initialize dashboard
    await loadProfessorForUser(session.user);

    // 3. Subscribe to FUTURE auth state changes (only sign-out)
    supabase.auth.onAuthStateChange((event, sess) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            window.location.href = 'login.html';
            return;
        }
        // Handle sign-in / token refresh silently — session is still valid
        if (event === 'SIGNED_IN' && sess?.user && sess.user.id !== currentProfessor?.id) {
            // User switched accounts in another tab — reload to pick up new identity
            window.location.reload();
        }
    });
})();

// Initialize dashboard
async function initDashboard() {
    profName.textContent = currentProfessor.nombre || 'Profesor';
    if (profEmail) profEmail.textContent = currentProfessor.email || '';

    // Show admin badge if applicable
    if (currentProfessor.rol === 'admin') {
        const nameEl = document.getElementById('profName');
        if (nameEl && !nameEl.querySelector('.admin-badge')) {
            nameEl.insertAdjacentHTML('afterend', '<span class="admin-badge" style="display:inline-block;background:#f36a21;color:#fff;font-size:0.65rem;padding:2px 8px;border-radius:4px;font-weight:700;letter-spacing:0.5px;margin-top:4px;">ADMIN</span>');
        }
    }

    // Load players + stats in parallel (independent queries)
    await Promise.all([loadPlayers(), loadStats()]);

    // Hide loading, show content
    loadingState.style.display = 'none';
    dashboardContent.style.display = 'block';
}

// Load players registered by current professor (+ players from allowed categories)
async function loadPlayers(category = '') {
    if (isLoadingPlayers) return;
    isLoadingPlayers = true;
    try {
        // Admin sees ALL players, regular professors see only their own + allowed categories
        let ownPlayers = [];
        let extraPlayers = [];

        if (currentProfessor.rol === 'admin') {
            const { data: rows } = await supabase.from('jugadores').select('*');
            (rows || []).forEach(row => {
                const normalizedCat = normalizeCategoria(row.categoria);
                if (!category || normalizedCat === category) {
                    ownPlayers.push({ id: row.id, ...row, categoria: normalizedCat });
                }
            });
        } else {
            // 1. Own players (registered by this professor)
            const { data: ownRows } = await supabase
                .from('jugadores')
                .select('*')
                .eq('registrado_por', currentProfessor.id);
            (ownRows || []).forEach(row => {
                const normalizedCat = normalizeCategoria(row.categoria);
                if (!category || normalizedCat === category) {
                    ownPlayers.push({ id: row.id, ...row, categoria: normalizedCat, esPropio: true });
                }
            });

            // 2. Players from permitted extra categories (categoriasPermitidas)
            const allowedCats = currentProfessor.categorias_permitidas || [];
            if (allowedCats.length > 0) {
                const ownIds = new Set(ownPlayers.map(p => p.id));
                for (const cat of allowedCats) {
                    // Check both original and alias names for the category
                    const catNormalized = normalizeCategoria(cat);
                    // Fetch all players - we'll filter locally to handle aliases
                    const { data: catRows } = await supabase.from('jugadores').select('*');
                    (catRows || []).forEach(row => {
                        if (ownIds.has(row.id)) return; // already in ownPlayers
                        const normalizedCat = normalizeCategoria(row.categoria);
                        if (normalizedCat === catNormalized) {
                            if (!category || normalizedCat === category) {
                                extraPlayers.push({ id: row.id, ...row, categoria: normalizedCat, esPropio: false });
                                ownIds.add(row.id); // avoid duplicates across categories
                            }
                        }
                    });
                }
            }
        }

        allPlayers = [...ownPlayers, ...extraPlayers];

        // Single batch query for all latest evaluations (avoids N+1)
        if (allPlayers.length > 0) {
            const { data: allEvals, error: evalsErr } = await supabase
                .from('evaluaciones')
                .select('jugador_id, fecha_fin, promedio_general, semana')
                .in('jugador_id', allPlayers.map(p => p.id));

            if (evalsErr) {
                console.warn('Could not load evals:', evalsErr);
            } else if (allEvals && allEvals.length > 0) {
                // Group by jugador_id and find the latest
                const latestByPlayer = {};
                for (const ev of allEvals) {
                    const pid = ev.jugador_id;
                    if (!pid) continue;
                    const current = latestByPlayer[pid];
                    const evDate = new Date(ev.fecha_fin || ev.semana || 0).getTime();
                    if (!current || evDate > current.date) {
                        latestByPlayer[pid] = { ev, date: evDate };
                    }
                }
                for (const player of allPlayers) {
                    const latest = latestByPlayer[player.id];
                    if (latest) {
                        player.latestPromedio = latest.ev.promedio_general || null;
                        player.latestSemana = latest.ev.semana || '';
                    }
                }
            }
        }

        // Sort locally by name
        allPlayers.sort((a, b) => {
            const nameA = (a.nombre || '').toLowerCase();
            const nameB = (b.nombre || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // If there's an active week filter, load week-specific evaluations
        if (activeWeekFilter) {
            await loadWeekEvaluations(activeWeekFilter);
        }

        renderPlayers(allPlayers);
        totalJugadores.textContent = allPlayers.length;
        if (playersCountBadge) playersCountBadge.textContent = allPlayers.length;
    } catch (error) {
        console.error('Error loading players:', error);
        playersGrid.innerHTML = `
            <div class="no-players">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>Error al cargar jugadores</h3>
                <p>Error: ${error.message}</p>
                <button class="retry-btn" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    } finally {
        isLoadingPlayers = false;
    }
}


// Player images list (PlantillaAlebrijesTeotihuacanLigaTDP)
// Formato: Name_Position_Number.jpg (DT sin número)
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
        'Adbeel_Jehiel_Ramirez_Juarez.jpg', 'Alexander_Villanueva_Huerta.jpg', 'Alfonso_Isaac_Jimenez_Calero.jpg', 'Angel_Gabriel_Barboza_Muñiz.jpg',
        'Angel_Uriel_Castillo_Ramirez.jpg', 'Armando_Perez_Campos.jpg', 'Byron_Mishell_Mateos_Martinez.jpg', 'Carlos_Enrique_Landa_Landa.jpg',
        'Cesar_Yovanni_Gomez_Anzastiga.jpg', 'Christopher_Armani_Camacho_Ibarguen.jpg', 'Cristian_Aldair_Marin_Ramirez.jpg', 'Diego_Ivan_Ramirez_Gonzalez.jpg',
        'Edgar_Emanuel_Flores_Veliz.jpg', 'Elian_Fabian_Naranjo.jpg', 'Emilio_Andres_Cornelio_Lopez.jpg', 'Erick_Klebeer_Alanis_Guerrero.jpg',
        'Felix_Eduardo_Martinez_Contreras.jpg', 'Franklin_Misael_Hernandez_Pablo.jpg', 'Hector_Gabriel_Castillo_Elizondo.jpg', 'Ibrahim_Rafael_Lopez_Zaragoza.jpg',
        'Ignacio_Hazzam_Dominguez_Cruz.jpg', 'Irving_Daniel_Lopez_Luna.jpg', 'Jesus_Manuel_Nuñez_Gutierrez.jpg', 'Jesus_Manuel_Tarango_Maldonado.jpg',
        'Jesus_Miguel_Xolio_Ortiz.jpg', 'Jesus_Rodrigo_Vela_Ramos.jpg', 'Jorge_Eduardo_Santiago_Reyes.jpg', 'Josaphat_Tapia_Vazquez.jpg',
        'Jose_Enmanuel_Sanchez_Gonzalez.jpg', 'Juan_Carlos_Gonzalez_Ceniceros.jpg', 'Juan_Enrique_Rojas_Vargas.jpg', 'Juan_Uziel_Zarate_Navarrete.jpg',
        'Kevin_Abel_Leon_Sanchez.jpg', 'Luciano_Ortiz_Melendez.jpg', 'Luis_Jareth_Dominguez_Meza.jpg', 'Miguel_David_Duran_Leon.jpg',
        'Ricardo_Gael_Cruz_Santos.jpg', 'Richard_Aguilar_Perez.jpg', 'Roberto_Alcantar_Piña.jpg', 'Sebastian_Segundo_Becerril.jpg'
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

function findPlayerImageInfo(nombre, apellido) {
    const fullName = normalizeStr(`${nombre || ''} ${apellido || ''}`);
    const firstName = normalizeStr(nombre || '');

    for (const img of PLAYER_IMAGES) {
        const parts = img.split('.')[0].split('_');
        // Pop jersey number (si existe) y luego la posición
        const lastPart = parts[parts.length - 1];
        if (/^\d+$/.test(lastPart)) parts.pop();
        parts.pop();
        const imgName = normalizeStr(parts.join(' '));
        if (imgName === fullName) return { file: img, folder: 'PlantillaAlebrijesTeotihuacanLigaTDP' };
        if (fullName && imgName.includes(firstName) && firstName.length > 2) {
            const apellidoNorm = normalizeStr(apellido || '');
            if (apellidoNorm && imgName.includes(apellidoNorm.split(' ')[0])) return { file: img, folder: 'PlantillaAlebrijesTeotihuacanLigaTDP' };
        }
    }
    
    for (const img of PLAYER_IMAGES_SOLES) {
        const imgName = normalizeStr(img.split('.')[0].split('_').join(' '));
        if (imgName === fullName) return { file: img, folder: 'JugadoresSoles' };
        if (fullName && imgName.includes(firstName) && firstName.length > 2) {
            const apellidoNorm = normalizeStr(apellido || '');
            if (apellidoNorm && imgName.includes(apellidoNorm.split(' ')[0])) return { file: img, folder: 'JugadoresSoles' };
        }
    }

    for (const img of PLAYER_IMAGES_FUERZAS) {
        const imgName = normalizeStr(img.split('.')[0].split('_').join(' '));
        if (imgName === fullName) return { file: img, folder: 'JugadoresFuerzasBasicas' };
        if (fullName && imgName.includes(firstName) && firstName.length > 2) {
            const apellidoNorm = normalizeStr(apellido || '');
            if (apellidoNorm && imgName.includes(apellidoNorm.split(' ')[0])) return { file: img, folder: 'JugadoresFuerzasBasicas' };
        }
    }
    return null;
}

// Render players
function renderPlayers(players) {
    if (players.length === 0) {
        playersGrid.innerHTML = `
            <div class="no-players">
                <div class="no-players-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <h3>No hay jugadores registrados</h3>
            </div>
        `;
        return;
    }

    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    ];

    playersGrid.innerHTML = players.map((player, index) => {
        const initials = getInitials(player.nombre, player.apellido);
        const shortName = getShortName(player.nombre, player.apellido);
        const fullName = `${toTitleCase(player.nombre || '')} ${toTitleCase(player.apellido || '')}`.trim() || 'Sin nombre';
        const gradient = gradients[index % gradients.length];

        // Player photo
        const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
        const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;
        const avatarHTML = imgSrc
            ? `<div class="player-avatar player-avatar-photo"><img src="${imgSrc}" alt="${shortName}" onerror="this.parentElement.style.background='${gradient}';this.parentElement.innerHTML='${initials}'"></div>`
            : `<div class="player-avatar" style="background: ${gradient}">${initials}</div>`;

        // Build average/week badge
        let avgBadgeHTML = '';
        if (activeWeekFilter) {
            // Show score for the selected week
            const weekEval = player.weekEval;
            if (weekEval !== undefined && weekEval !== null) {
                const avgNum = parseFloat(weekEval);
                let avgColor = '#ef4444';
                let avgBg = '#fee2e2';
                if (avgNum >= 7) { avgColor = '#10b981'; avgBg = '#d1fae5'; }
                else if (avgNum >= 5) { avgColor = '#f59e0b'; avgBg = '#fef3c7'; }
                avgBadgeHTML = `
                    <div class="player-week-badge" style="background: ${avgBg}; color: ${avgColor};" title="Promedio semana ${activeWeekFilter}">
                        <span class="player-avg-value">${avgNum.toFixed(1)}</span>
                        <span class="player-avg-label">Sem.</span>
                    </div>
                `;
            } else {
                avgBadgeHTML = `
                    <div class="player-week-badge player-avg-empty" title="Sin evaluación en semana ${activeWeekFilter}">
                        <span class="player-avg-value">--</span>
                        <span class="player-avg-label">Sem.</span>
                    </div>
                `;
            }
        } else {
            // Show latest overall average
            const avgValue = player.latestPromedio;
            if (avgValue !== undefined && avgValue !== null) {
                const avgNum = parseFloat(avgValue);
                let avgColor = '#ef4444';
                let avgBg = '#fee2e2';
                if (avgNum >= 7) { avgColor = '#10b981'; avgBg = '#d1fae5'; }
                else if (avgNum >= 5) { avgColor = '#f59e0b'; avgBg = '#fef3c7'; }
                avgBadgeHTML = `
                    <div class="player-avg" style="background: ${avgBg}; color: ${avgColor};">
                        <span class="player-avg-value">${avgNum.toFixed(1)}</span>
                        <span class="player-avg-label">Prom.</span>
                    </div>
                `;
            } else {
                avgBadgeHTML = `
                    <div class="player-avg player-avg-empty">
                        <span class="player-avg-value">--</span>
                        <span class="player-avg-label">Prom.</span>
                    </div>
                `;
            }
        }

        return `
            <div class="player-card" data-id="${player.id}">
                ${avatarHTML}
                <div class="player-details">
                    <div class="player-name" title="${fullName}">${shortName}</div>
                </div>
                ${avgBadgeHTML}
                <div class="player-actions">
                    <button class="cred-btn" data-player="${player.id}" title="Ver credenciales" aria-label="Ver credenciales de ${shortName}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </button>
                    <button class="eval-btn" data-id="${player.id}" aria-label="Evaluar a ${shortName}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span class="eval-btn-label-full">Evaluar</span>
                        <span class="eval-btn-label-short">Evaluar</span>
                    </button>
                    ${currentProfessor.rol === 'admin' || currentProfessor.id === player.registrado_por ? `
                    <button class="delete-btn" data-id="${player.id}" title="Eliminar jugador" aria-label="Eliminar a ${shortName}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (playersCountBadge) playersCountBadge.textContent = players.length;

    // Banner de semana activa
    if (activeWeekFilter) {
        const banner = document.createElement('div');
        banner.className = 'week-filter-banner';
        banner.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Mostrando calificaciones de la semana: <strong>${formatWeekLabel(activeWeekFilter)}</strong>
        `;
        playersGrid.insertBefore(banner, playersGrid.firstChild);
    }

    // Add event listeners to eval buttons
    document.querySelectorAll('.eval-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEvalModal(btn.dataset.id);
        });
    });

    // Add event listeners to credential buttons
    document.querySelectorAll('.cred-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const playerId = btn.dataset.player;
            const player = players.find(p => p.id === playerId);
            if(player) {
                openCredsModal(player);
            }
        });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const playerId = btn.dataset.id;
            const player = players.find(p => p.id === playerId);
            if(player) {
                openDeleteModal(player);
            }
        });
    });
}

let credsRevealed = false;

function openCredsModal(player) {
    const credsModal = document.getElementById('credsModal');
    if (!credsModal) return;

    const initials = getInitials(player.nombre, player.apellido);

    const avatarEl = document.getElementById('credsPlayerAvatar');
    const nameEl = document.getElementById('credsPlayerName');
    const emailEl = document.getElementById('credsPlayerEmail');
    const passEl = document.getElementById('credsPlayerPass');

    nameEl.textContent = `${toTitleCase(player.nombre || '')} ${toTitleCase(player.apellido || '')}`.trim() || 'Sin nombre';
    emailEl.textContent = player.email || 'Sin correo asignado';

    credsRevealed = false;
    const storedPass = player.password || '';
    renderCredsPassword(passEl, storedPass, credsRevealed);

    // Avatar
    const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
    const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;
    if (imgSrc) {
        avatarEl.style.background = '#e2e8f0';
        avatarEl.innerHTML = `<img src="${imgSrc}" alt="" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
        avatarEl.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        avatarEl.innerHTML = initials;
    }

    // Wire up the reveal button
    const revealBtn = document.getElementById('credsRevealPass');
    if (revealBtn) {
        const newReveal = revealBtn.cloneNode(true);
        revealBtn.parentNode.replaceChild(newReveal, revealBtn);
        newReveal.addEventListener('click', () => {
            credsRevealed = !credsRevealed;
            renderCredsPassword(passEl, storedPass, credsRevealed);
            newReveal.setAttribute('aria-label', credsRevealed ? 'Ocultar contraseña' : 'Mostrar contraseña');
        });
    }

    // Wire up the copy button
    const copyBtn = document.getElementById('credsCopyPass');
    if (copyBtn) {
        const newCopy = copyBtn.cloneNode(true);
        copyBtn.parentNode.replaceChild(newCopy, copyBtn);
        newCopy.addEventListener('click', async () => {
            if (!storedPass) {
                showToast('No hay contraseña almacenada para este jugador', 'info');
                return;
            }
            try {
                await navigator.clipboard.writeText(storedPass);
                showToast('Contraseña copiada al portapapeles', 'success');
            } catch (err) {
                const range = document.createRange();
                range.selectNode(passEl);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                showToast('Selecciona el texto y cópialo manualmente', 'info');
            }
        });
    }

    openModal(credsModal);
}

function renderCredsPassword(el, pass, revealed) {
    if (!pass) {
        el.textContent = 'No almacenada';
        el.classList.add('masked');
        return;
    }
    if (revealed) {
        el.textContent = pass;
        el.classList.remove('masked');
    } else {
        el.textContent = '••••••••••••';
        el.classList.add('masked');
    }
}

// ==========================================
// DELETE PLAYER LOGIC
// ==========================================

let deleteRequestInFlight = false;

function openDeleteModal(player) {
    const deleteModal = document.getElementById('deleteModal');
    if (!deleteModal) return;

    playerToDelete = player;

    const fullName = `${toTitleCase(player.nombre || '')} ${toTitleCase(player.apellido || '')}`.trim() || 'Sin nombre';
    document.getElementById('deletePlayerName').textContent = fullName;
    document.getElementById('deleteConfirmTarget').textContent = fullName;

    // Reset confirm input + button
    const input = document.getElementById('deleteConfirmInput');
    if (input) input.value = '';
    const wrapper = document.getElementById('deleteConfirmWrapper');
    if (wrapper) wrapper.classList.remove('has-match');
    const confirmBtn = document.getElementById('deleteBtnConfirm');
    if (confirmBtn) confirmBtn.disabled = true;

    // Reset overlay
    const overlay = document.getElementById('deleteLoadingOverlay');
    if (overlay) overlay.classList.remove('active');

    deleteRequestInFlight = false;

    openModal(deleteModal);

    // Wire up typed-confirm input
    if (input) {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        newInput.addEventListener('input', () => {
            const typed = (newInput.value || '').trim().toLowerCase();
            const target = fullName.toLowerCase();
            const matches = typed === target;
            const wrapper = document.getElementById('deleteConfirmWrapper');
            if (wrapper) wrapper.classList.toggle('has-match', matches);
            if (confirmBtn) confirmBtn.disabled = !matches;
        });
    }

    // Focus the input after the modal opens
    setTimeout(() => {
        const focusedInput = document.getElementById('deleteConfirmInput');
        if (focusedInput) focusedInput.focus();
    }, 100);
}

function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) closeModal(deleteModal);
    playerToDelete = null;
    const overlay = document.getElementById('deleteLoadingOverlay');
    if (overlay) overlay.classList.remove('active');
    const input = document.getElementById('deleteConfirmInput');
    if (input) input.value = '';
    const wrapper = document.getElementById('deleteConfirmWrapper');
    if (wrapper) wrapper.classList.remove('has-match');
    const confirmBtn = document.getElementById('deleteBtnConfirm');
    if (confirmBtn) confirmBtn.disabled = true;
}

async function executeDeletePlayer() {
    if (!playerToDelete || deleteRequestInFlight) return;
    deleteRequestInFlight = true;

    const overlay = document.getElementById('deleteLoadingOverlay');
    if (overlay) overlay.classList.add('active');
    const confirmBtn = document.getElementById('deleteBtnConfirm');
    if (confirmBtn) confirmBtn.disabled = true;

    try {
        await supabase.from('jugadores').delete().eq('id', playerToDelete.id);
        await supabase.from('evaluaciones').delete().eq('jugador_id', playerToDelete.id);

        showToast('Jugador eliminado correctamente', 'success');
        closeDeleteModal();
        await loadPlayers();
        await loadStats();
    } catch (error) {
        console.error('Error deleting player:', error);
        showToast('Error al eliminar el jugador: ' + (error.message || 'desconocido'), 'error');
        if (overlay) overlay.classList.remove('active');
        if (confirmBtn) confirmBtn.disabled = false;
        deleteRequestInFlight = false;
    }
}

// Wire up delete modal buttons (one-time)
const _deleteBtnConfirmEl = document.getElementById('deleteBtnConfirm');
if (_deleteBtnConfirmEl) {
    _deleteBtnConfirmEl.addEventListener('click', executeDeletePlayer);
}
const _deleteBtnCancelEl = document.getElementById('deleteBtnCancel');
if (_deleteBtnCancelEl) {
    _deleteBtnCancelEl.addEventListener('click', () => {
        if (!deleteRequestInFlight) closeDeleteModal();
    });
}
const _deleteModalCloseEl = document.getElementById('deleteModalClose');
if (_deleteModalCloseEl) {
    _deleteModalCloseEl.addEventListener('click', () => {
        if (!deleteRequestInFlight) closeDeleteModal();
    });
}

// Load stats
async function loadStats() {
    try {
        let count = 0;
        if (currentProfessor.rol === 'admin') {
            // Admin sees all evaluations
            const { count: c } = await supabase
                .from('evaluaciones')
                .select('id', { count: 'exact', head: true });
            count = c || 0;
        } else {
            const { count: c } = await supabase
                .from('evaluaciones')
                .select('id', { count: 'exact', head: true })
                .eq('evaluador_id', currentProfessor.id);
            count = c || 0;
        }
        totalEvaluaciones.textContent = count;
    } catch (error) {
        console.error('Error loading stats:', error);
        totalEvaluaciones.textContent = '0';
    }
}

// Open evaluation modal
async function openEvalModal(playerId) {
    const player = allPlayers.find(p => p.id === playerId);
    if (!player) return;

    currentPlayerId = playerId;
    currentEditEvalId = null;

    const initials = getInitials(player.nombre, player.apellido);
    const fullName = `${toTitleCase(player.nombre || '')} ${toTitleCase(player.apellido || '')}`.trim() || 'Sin nombre';

    const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
    const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;

    const avatarHTML = imgSrc
        ? `<img src="${imgSrc}" alt="${fullName}" onerror="this.parentElement.innerHTML='${initials}';this.parentElement.style.background='linear-gradient(135deg,#F36A21 0%,#FF8C42 100%)';">`
        : `${initials}`;

    playerEvalInfo.innerHTML = `
        <div class="avatar">${avatarHTML}</div>
        <div class="info">
            <h4>${fullName}</h4>
            <p>${player.posicion || 'Sin posición'} · ${player.categoria || 'Sin categoría'}</p>
        </div>
    `;

    // Reset form
    evalForm.reset();

    // Set current week as default (ISO 8601)
    const evalSemana = document.getElementById('evalSemana');
    if (evalSemana) {
        evalSemana.value = getCurrentIsoWeek();
    }

    openModal(evalModal);

    // Check if evaluation already exists for this week
    await checkExistingEval();
}

// Check for existing evaluation for current player + selected week
async function checkExistingEval() {
    const evalSemana = document.getElementById('evalSemana');
    const submitBtn = document.getElementById('btnSubmit');
    const weekRangeEl = document.getElementById('evalWeekRange');
    if (!evalSemana || !evalSemana.value || !currentPlayerId) return;

    // Update visible date range for the selected week
    if (weekRangeEl) {
        weekRangeEl.textContent = isoWeekDateRange(evalSemana.value) || '—';
    }

    try {
        const { data: evalsRows } = await supabase
            .from('evaluaciones')
            .select('*')
            .eq('jugador_id', currentPlayerId)
            .eq('semana', evalSemana.value)
            .limit(1);

        if (evalsRows && evalsRows.length > 0) {
            const ev = evalsRows[0];
            currentEditEvalId = ev.id;

            document.getElementById('tecnico').value = ev.tecnico ?? '';
            document.getElementById('tactico').value = ev.tactico ?? '';
            document.getElementById('fisico').value = ev.fisico ?? '';
            document.getElementById('mental').value = ev.mental ?? '';
            document.getElementById('disciplinaCancha').value = ev.disciplina_cancha ?? '';
            document.getElementById('disciplinaCasaClub').value = ev.disciplina_casa_club ?? '';
            document.getElementById('inasistencias').value = ev.inasistencias ?? '0';
            document.getElementById('rendimientoCancha').value = ev.rendimiento_cancha ?? '';
            document.getElementById('minutosJugados').value = ev.minutos_jugados ?? '';
            document.getElementById('observaciones').value = ev.observaciones || '';

            if (submitBtn) {
                submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Actualizar Evaluación';
            }
            showToast('Evaluación existente cargada para editar', 'info');
        } else {
            currentEditEvalId = null;
            const weekVal = evalSemana.value;
            evalForm.reset();
            evalSemana.value = weekVal;
            if (submitBtn) {
                submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar Evaluación';
            }
        }
        updateEvalCharCounter();
        captureEvalSnapshot();
    } catch (error) {
        console.error('Error checking existing evaluation:', error);
    }
}

function captureEvalSnapshot() {
    const fields = ['tecnico','tactico','fisico','mental','disciplinaCancha','disciplinaCasaClub','inasistencias','rendimientoCancha','minutosJugados','observaciones'];
    evalFormSnapshot = {};
    fields.forEach(id => {
        const el = document.getElementById(id);
        evalFormSnapshot[id] = el ? el.value : '';
    });
}

function isEvalFormDirty() {
    if (!evalFormSnapshot) return false;
    const fields = ['tecnico','tactico','fisico','mental','disciplinaCancha','disciplinaCasaClub','inasistencias','rendimientoCancha','minutosJugados','observaciones'];
    return fields.some(id => {
        const el = document.getElementById(id);
        return el && el.value !== evalFormSnapshot[id];
    });
}

function updateEvalCharCounter() {
    const obs = document.getElementById('observaciones');
    const counter = document.getElementById('obsCharCounter');
    if (!obs || !counter) return;
    const len = (obs.value || '').length;
    counter.textContent = `${len} / 500`;
    counter.classList.toggle('warn', len >= 450);
}

function closeEvalModalLocal() {
    closeModal(evalModal);
    currentPlayerId = null;
    currentEditEvalId = null;
    if (evalForm) evalForm.reset();
    const submitBtn = document.getElementById('btnSubmit');
    if (submitBtn) {
        submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar Evaluación';
    }
    evalFormSnapshot = null;
}

// Event Listeners — eval modal
if (modalClose) modalClose.addEventListener('click', closeEvalModalLocal);
if (btnCancel) btnCancel.addEventListener('click', closeEvalModalLocal);

if (evalModal) {
    evalModal.addEventListener('click', (e) => {
        if (e.target === evalModal) closeEvalModalLocal();
    });
}

// Eval tab switching
document.querySelectorAll('.eval-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.eval-tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.eval-tab-content').forEach(c => {
            c.classList.remove('active');
            c.setAttribute('hidden', '');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const target = document.getElementById(tab.dataset.tab);
        if (target) {
            target.classList.add('active');
            target.removeAttribute('hidden');
        }
    });
});

// Week selector change — confirm before overwriting dirty form
const evalSemanaInput = document.getElementById('evalSemana');
if (evalSemanaInput) {
    evalSemanaInput.addEventListener('change', async () => {
        if (!currentPlayerId) return;
        if (isEvalFormDirty()) {
            const proceed = confirm(
                'Tienes datos sin guardar en esta evaluación.\n\n' +
                'Cambiar de semana reemplazará los valores actuales.\n\n' +
                '¿Continuar de todas formas?'
            );
            if (!proceed) {
                // Revert: keep old snapshot value
                return;
            }
        }
        await checkExistingEval();
    });
}

// Observations char counter
const obsInput = document.getElementById('observaciones');
if (obsInput) {
    obsInput.addEventListener('input', updateEvalCharCounter);
}

// Search input — debounced
if (searchInput) {
    const onSearch = debounce((value) => {
        const searchTerm = value.toLowerCase();
        const filtered = allPlayers.filter(player => {
            const fullName = `${player.nombre || ''} ${player.apellido || ''}`.toLowerCase();
            return fullName.includes(searchTerm);
        });
        renderPlayers(filtered);
    }, 180);

    searchInput.addEventListener('input', (e) => {
        onSearch(e.target.value);
    });
}

// ---- Week Filter logic ----
const weekFilterInput = document.getElementById('weekFilter');
const weekFilterClear = document.getElementById('weekFilterClear');
const weekFilterWrapper = document.getElementById('weekFilterWrapper');

if (weekFilterInput) {
    weekFilterInput.addEventListener('change', async () => {
        activeWeekFilter = weekFilterInput.value || '';
        updateWeekFilterUI();
        // Reload evaluations for the new week (players already loaded)
        if (activeWeekFilter) {
            await loadWeekEvaluations(activeWeekFilter);
        } else {
            // Clear week evals from players
            allPlayers.forEach(p => { delete p.weekEval; });
        }
        renderPlayers(allPlayers);
    });
}

if (weekFilterClear) {
    weekFilterClear.addEventListener('click', async () => {
        weekFilterInput.value = '';
        activeWeekFilter = '';
        updateWeekFilterUI();
        allPlayers.forEach(p => { delete p.weekEval; });
        renderPlayers(allPlayers);
    });
}

function updateWeekFilterUI() {
    if (!weekFilterWrapper || !weekFilterClear) return;
    if (activeWeekFilter) {
        weekFilterWrapper.classList.add('has-value');
        weekFilterClear.style.display = 'flex';
    } else {
        weekFilterWrapper.classList.remove('has-value');
        weekFilterClear.style.display = 'none';
    }
}

// Load and attach week evaluations to allPlayers
async function loadWeekEvaluations(semana) {
    try {
        const { data: rows } = await supabase
            .from('evaluaciones')
            .select('*')
            .eq('semana', semana);

        // Build map: jugadorId -> promedioGeneral
        const weekMap = {};
        (rows || []).forEach(row => {
            if (row.jugador_id && row.promedio_general !== undefined) {
                weekMap[row.jugador_id] = row.promedio_general;
            }
        });

        // Attach to players
        allPlayers.forEach(p => {
            p.weekEval = weekMap[p.id] !== undefined ? weekMap[p.id] : null;
        });
    } catch (err) {
        console.warn('Error loading week evaluations:', err);
    }
}

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
});

// Submit evaluation
evalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentPlayerId) return;

    const submitBtn = document.getElementById('btnSubmit');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    try {
        const formData = new FormData(evalForm);

        // Required fields validation
        const observaciones = (formData.get('observaciones') || '').toString().trim();
        if (!observaciones) {
            showToast('El campo de observaciones es obligatorio', 'error');
            document.getElementById('observaciones').focus();
            return;
        }

        // Validate numeric ranges
        const numericFields = [
            ['tecnico', 1, 10],
            ['tactico', 1, 10],
            ['fisico', 1, 10],
            ['mental', 1, 10],
            ['disciplinaCancha', 1, 10],
            ['disciplinaCasaClub', 1, 10],
            ['inasistencias', 0, 10],
            ['minutosJugados', 0, 120]
        ];
        for (const [field, min, max] of numericFields) {
            const raw = formData.get(field);
            const v = raw === null || raw === '' ? NaN : parseFloat(raw);
            if (Number.isFinite(v) && (v < min || v > max)) {
                showToast(`El campo "${field}" debe estar entre ${min} y ${max}`, 'error');
                document.getElementById(field).focus();
                return;
            }
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-inline"></span> Guardando...';
        }

        const semana = formData.get('semana') || '';
        const { fechaInicio, fechaFin } = getWeekDateRange(semana);

        // Parse with NaN guards
        const parseField = (id) => {
            const v = parseFloat(formData.get(id));
            return Number.isFinite(v) ? v : null;
        };
        const tecnico = parseField('tecnico');
        const tactico = parseField('tactico');
        const fisico = parseField('fisico');
        const mental = parseField('mental');
        const disciplinaCancha = parseField('disciplinaCancha');
        const disciplinaCasaClub = parseField('disciplinaCasaClub');

        let inasistencias = parseInt(formData.get('inasistencias'), 10);
        if (!Number.isFinite(inasistencias)) inasistencias = 0;

        const rendimientoCanchaRaw = formData.get('rendimientoCancha') || '';
        const rendimientoCancha = rendimientoCanchaRaw === 'RP' ? 'RP' : (rendimientoCanchaRaw ? parseFloat(rendimientoCanchaRaw) : null);
        const minutosJugados = parseInt(formData.get('minutosJugados'), 10);
        const minutosFinal = Number.isFinite(minutosJugados) ? minutosJugados : 0;

        // Average (only if all 6 metrics present)
        const validMetrics = [tecnico, tactico, fisico, mental, disciplinaCancha, disciplinaCasaClub].every(v => Number.isFinite(v));
        const promedioGeneral = validMetrics
            ? ((tecnico + tactico + fisico + mental + disciplinaCancha + disciplinaCasaClub) / 6).toFixed(1)
            : null;

        const evaluationData = {
            jugador_id: currentPlayerId,
            evaluador_id: currentProfessor.id,
            evaluador_nombre: currentProfessor.nombre || 'Profesor',
            fecha: new Date().toISOString(),
            semana: semana,
            fecha_inicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
            fecha_fin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
            tecnico,
            tactico,
            fisico,
            mental,
            disciplina_cancha: disciplinaCancha,
            disciplina_casa_club: disciplinaCasaClub,
            inasistencias,
            rendimiento_cancha: rendimientoCancha,
            minutos_jugados: minutosFinal,
            promedio_general: promedioGeneral !== null ? parseFloat(promedioGeneral) : null,
            observaciones: observaciones,
            tipo: 'Evaluación Semanal'
        };

        if (currentEditEvalId) {
            await supabase.from('evaluaciones').update(evaluationData).eq('id', currentEditEvalId);
            closeEvalModalLocal();
            showToast('Evaluación actualizada correctamente', 'success');
        } else {
            await supabase.from('evaluaciones').insert(evaluationData);
            closeEvalModalLocal();
            showToast('Evaluación guardada correctamente', 'success');
        }

        await loadStats();
        await loadPlayers();

    } catch (error) {
        console.error('Error saving evaluation:', error);
        showToast('Error al guardar la evaluación', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    }
});

// ==========================================
// REGISTRATION LOGIC
// ==========================================

// Open Registration Modal
if (btnAddPlayer) {
    btnAddPlayer.addEventListener('click', () => {
        if (registeredCount === 0) {
            registerForm.reset();
            clearAllFieldErrors();
            const wrap = document.getElementById('passwordStrength');
            if (wrap) wrap.hidden = true;
        }
        openModal(registerModal);
    });
}

// Close Registration Modal
function closeRegisterModal() {
    closeModal(registerModal);
}

if (registerModalClose) registerModalClose.addEventListener('click', closeRegisterModal);
if (registerBtnCancel) registerBtnCancel.addEventListener('click', closeRegisterModal);

// Click outside registration modal closes it
if (registerModal) {
    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal) closeRegisterModal();
    });
}

// Password toggle show/hide
if (regPasswordToggle && regPassword) {
    regPasswordToggle.addEventListener('click', () => {
        const isPassword = regPassword.type === 'password';
        regPassword.type = isPassword ? 'text' : 'password';
        regPasswordToggle.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
}

// Password strength on input
if (regPassword) {
    regPassword.addEventListener('input', updatePasswordStrength);
}

// Password generator
if (regPasswordGenerator) {
    regPasswordGenerator.addEventListener('click', () => {
        const newPwd = generateSecurePassword(14);
        regPassword.value = newPwd;
        if (regPasswordConfirm) regPasswordConfirm.value = newPwd;
        updatePasswordStrength();
        showToast('Contraseña segura generada', 'info');
    });
}

// Handle Registration Submit
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateRegistrationForm()) {
            showToast('Revisa los campos marcados en rojo', 'error');
            return;
        }

        const submitBtn = document.getElementById('registerBtnSubmit');
        const originalBtnHTML = submitBtn.innerHTML;

        const formData = new FormData(registerForm);
        const email = (formData.get('email') || '').toString().trim().toLowerCase();
        const password = (formData.get('password') || '').toString();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-inline"></span> Registrando...';

        try {
            // 1. Save the current (profesor's) session so we can restore it after
            //    signUp, which auto-logs in as the new jugador.
            const { data: sessionData } = await supabase.auth.getSession();
            const oldSession = sessionData?.session;

            // 2. Create the auth account for the jugador
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { rol: 'jugador' } }
            });
            if (signUpError) throw signUpError;
            const newUserUid = signUpData.user?.id;
            if (!newUserUid) throw new Error('No se pudo obtener el ID del nuevo jugador.');

            // 3. CRITICAL: Restore the profesor's session. signUp auto-logs in as
            //    the new user, so the next supabase queries would run as the new
            //    jugador unless we setSession back to the original session. If
            //    this fails, abort — otherwise we'd silently corrupt the
            //    profesor's view.
            if (oldSession?.access_token && oldSession?.refresh_token) {
                const { error: setSessionErr } = await supabase.auth.setSession({
                    access_token: oldSession.access_token,
                    refresh_token: oldSession.refresh_token
                });
                if (setSessionErr) {
                    console.error('No se pudo restaurar la sesión del profesor:', setSessionErr);
                    // Bail out: log out and redirect so we never run queries as the new jugador
                    await supabase.auth.signOut();
                    showToast('Tu sesión se cerró por seguridad. Inicia sesión de nuevo.', 'error');
                    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
                    return;
                }
            } else {
                // No previous session — we cannot continue safely
                await supabase.auth.signOut();
                showToast('Tu sesión expiró. Inicia sesión de nuevo.', 'error');
                setTimeout(() => { window.location.href = 'login.html'; }, 1500);
                return;
            }

            // 4. Insert the jugador row using the auth user's UUID as id.
            //    We're now running as the profesor again.
            const playerData = {
                id: newUserUid,
                nombre: (formData.get('nombre') || '').toString().trim(),
                apellido: (formData.get('apellido') || '').toString().trim(),
                email: email,
                password: password,
                fecha_nacimiento: formData.get('fechaNacimiento') || null,
                equipo: currentProfessor.equipo_restringido || null,
                posicion: formData.get('posicion'),
                numero_camiseta: (() => {
                    const v = parseInt(formData.get('numeroCamiseta'), 10);
                    return Number.isFinite(v) ? v : null;
                })(),
                registrado_por: currentProfessor.id,
                fecha_registro: new Date().toISOString(),
                rol: 'jugador'
            };

            const { error: insertErr } = await supabase.from('jugadores').insert(playerData);
            if (insertErr) throw insertErr;

            showToast(`${playerData.nombre} registrado correctamente`, 'success');

            registeredCount++;
            if (sessionCounter) sessionCounter.textContent = registeredCount;
            if (registrationCounter) registrationCounter.hidden = false;

            const lastDate = formData.get('fechaNacimiento');
            registerForm.reset();
            if (lastDate) document.getElementById('regFechaNac').value = lastDate;
            clearAllFieldErrors();
            updatePasswordStrength();

            regNombre.focus();
            await loadPlayers();
        } catch (error) {
            console.error('Error registering player:', error);
            let errorMsg = 'Error al registrar jugador';
            const msg = (error.message || '').toLowerCase();
            if (error.code === 'user_already_exists' || msg.includes('already') || msg.includes('registered')) {
                errorMsg = 'Ya existe una cuenta con ese correo';
            } else if (msg.includes('invalid') || msg.includes('email')) {
                errorMsg = 'El correo no es válido o el dominio no está permitido';
            } else if (msg.includes('rate limit') || msg.includes('too many')) {
                errorMsg = 'Demasiados intentos. Espera unos minutos.';
            } else if (msg.includes('password') && (msg.includes('short') || msg.includes('length'))) {
                errorMsg = 'La contraseña debe tener al menos 8 caracteres';
            } else if (error.message) {
                errorMsg = `Error: ${error.message}`;
            }
            showToast(errorMsg, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

// ==========================================
// GLOBAL EVENT LISTENERS
// ==========================================

// Keyboard navigation — Esc closes any open modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Handle delete confirm modal specially because it might require typed confirmation
        const deleteModalEl = document.getElementById('deleteModal');
        if (deleteModalEl && deleteModalEl.classList.contains('active')) {
            if (!deleteRequestInFlight) closeDeleteModal();
            return;
        }
        closeAllModals();
    }
});

// ==========================================
// PDF EXPORT LOGIC
// ==========================================

const btnExportPDF = document.getElementById('btnExportPDF');
const pdfModal = document.getElementById('pdfModal');
const pdfModalClose = document.getElementById('pdfModalClose');
const pdfBtnCancel = document.getElementById('pdfBtnCancel');
const pdfBtnExport = document.getElementById('pdfBtnExport');
const pdfWeekPicker = document.getElementById('pdfWeekPicker');

// Set default week to current ISO week
if (pdfWeekPicker) {
    pdfWeekPicker.value = getCurrentIsoWeek();
}

function openPdfModal() {
    if (pdfModal) openModal(pdfModal);
}

function closePdfModal() {
    if (pdfModal) closeModal(pdfModal);
}

if (btnExportPDF) btnExportPDF.addEventListener('click', openPdfModal);
if (pdfModalClose) pdfModalClose.addEventListener('click', closePdfModal);
if (pdfBtnCancel) pdfBtnCancel.addEventListener('click', closePdfModal);

if (pdfModal) {
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) closePdfModal();
    });
}

if (pdfBtnExport) {
    pdfBtnExport.addEventListener('click', async () => {
        const selectedWeek = pdfWeekPicker.value;
        if (!selectedWeek) {
            showToast('Selecciona una semana', 'error');
            return;
        }

        pdfBtnExport.disabled = true;
        const origHTML = pdfBtnExport.innerHTML;
        pdfBtnExport.innerHTML = '<span class="spinner-inline"></span> Generando...';

        try {
            await generateWeeklyPDF(selectedWeek);
            closePdfModal();
            showToast('PDF generado correctamente', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showToast('Error al generar el PDF', 'error');
        } finally {
            pdfBtnExport.disabled = false;
            pdfBtnExport.innerHTML = origHTML;
        }
    });
}

// Utility: load image as base64 data URL with timeout
function loadImageAsBase64(url, timeoutMs = 5000) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        let done = false;
        const finish = (val) => { if (!done) { done = true; resolve(val); } };
        const timer = setTimeout(() => finish(null), timeoutMs);
        img.onload = () => {
            clearTimeout(timer);
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                finish(canvas.toDataURL('image/png'));
            } catch (e) {
                finish(null);
            }
        };
        img.onerror = () => { clearTimeout(timer); finish(null); };
        img.src = url;
    });
}

async function generateWeeklyPDF(weekValue) {
    const { data: evalsRows, error: evalsErr } = await supabase
        .from('evaluaciones')
        .select('*')
        .eq('evaluador_id', currentProfessor.id)
        .eq('semana', weekValue);

    if (evalsErr) throw evalsErr;

    if (!evalsRows || evalsRows.length === 0) {
        showToast('No hay evaluaciones para esta semana', 'error');
        throw new Error('No evaluations found');
    }

    // Batch-fetch all player names/details in ONE query instead of N+1
    const jugadorIds = [...new Set(evalsRows.map(ev => ev.jugador_id).filter(Boolean))];
    const playersMap = {};
    if (jugadorIds.length > 0) {
        const { data: playerRows } = await supabase
            .from('jugadores')
            .select('id, nombre, apellido, categoria, posicion')
            .in('id', jugadorIds);
        (playerRows || []).forEach(p => { playersMap[p.id] = p; });
    }

    const evalRows = evalsRows.map(ev => {
        const player = playersMap[ev.jugador_id];
        const playerName = player
            ? `${player.nombre || ''} ${player.apellido || ''}`.trim()
            : (ev.jugador_id || 'Jugador');
        return {
            nombre: playerName,
            categoria: player ? (player.categoria || '') : '',
            posicion: player ? (player.posicion || '') : '',
            tecnico: ev.tecnico ?? '--',
            tactico: ev.tactico ?? '--',
            fisico: ev.fisico ?? '--',
            mental: ev.mental ?? '--',
            disciplinaCancha: ev.disciplina_cancha ?? '--',
            disciplinaCasaClub: ev.disciplina_casa_club ?? '--',
            promedio: ev.promedio_general ?? '--',
            observaciones: ev.observaciones || ''
        };
    });

    // Sort by name
    evalRows.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Parse week for display
    const [yearStr, weekStr] = weekValue.split('-W');
    const weekNum = parseInt(weekStr);
    const weekLabel = `Semana ${weekNum}, ${yearStr}`;

    // Calculate week date range for display (ISO 8601)
    const { fechaInicio, fechaFin } = getWeekDateRange(weekValue);
    const dateOpts = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateRange = fechaInicio && fechaFin
        ? `${fechaInicio.toLocaleDateString('es-MX', dateOpts)} — ${fechaFin.toLocaleDateString('es-MX', dateOpts)}`
        : '';

    // Load logos
    const [logoTeoti, logoAlebrijes] = await Promise.all([
        loadImageAsBase64('../assets/03_TEOTIHUACAN_-_Fuerzas_Basicas.png'),
        loadImageAsBase64('../assets/Alebrijes Teotihuacan.png')
    ]);

    // Generate PDF with jsPDF
    if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast('Error: Librería PDF no cargada. Si usas bloqueador de anuncios, desactívalo.', 'error');
        console.error('jsPDF library not found on window object.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    // ---- HEADER ----
    // Top accent line
    pdf.setFillColor(243, 106, 33);
    pdf.rect(0, 0, pageW, 3, 'F');

    // Header background
    pdf.setFillColor(30, 41, 59); // slate-800
    pdf.rect(0, 3, pageW, 32, 'F');

    // Logos
    if (logoTeoti) {
        pdf.addImage(logoTeoti, 'PNG', 10, 5, 26, 26);
    }
    if (logoAlebrijes) {
        pdf.addImage(logoAlebrijes, 'PNG', pageW - 36, 5, 26, 26);
    }

    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(15);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ALEBRIJES DE OAXACA TEOTIHUACÁN', pageW / 2, 14, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Sistema de Evaluación Deportiva', pageW / 2, 20, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setTextColor(243, 166, 110);
    pdf.text(`REPORTE SEMANAL DE EVALUACIONES`, pageW / 2, 27, { align: 'center' });

    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(8);
    pdf.text(dateRange, pageW / 2, 32, { align: 'center' });

    // ---- INFO BAR ----
    pdf.setFillColor(245, 246, 250);
    pdf.rect(0, 35, pageW, 14, 'F');
    pdf.setDrawColor(229, 231, 235);
    pdf.line(0, 49, pageW, 49);

    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 65, 85);
    pdf.text(`Evaluador:`, 14, 41);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${currentProfessor.nombre || currentProfessor.email}`, 36, 41);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Semana:`, 14, 46);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${weekLabel}`, 30, 46);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Jugadores Evaluados:`, pageW / 2, 41);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${evalRows.length}`, pageW / 2 + 38, 41);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Fecha de Generación:`, pageW / 2, 46);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageW / 2 + 38, 46);

    // ---- TABLE ----
    const tableHeaders = [
        ['Jugador', 'Cat.', 'Pos.', 'Téc', 'Tác', 'Fís', 'Men', 'D.Cancha', 'D.Casa', 'Prom.', 'Observaciones']
    ];

    const tableBody = evalRows.map(row => [
        row.nombre,
        row.categoria,
        row.posicion,
        row.tecnico,
        row.tactico,
        row.fisico,
        row.mental,
        row.disciplina_cancha,
        row.disciplina_casa_club,
        row.promedio,
        row.observaciones
    ]);

    pdf.autoTable({
        head: tableHeaders,
        body: tableBody,
        startY: 52,
        theme: 'grid',
        styles: {
            fontSize: 7.5,
            cellPadding: 3,
            font: 'helvetica',
            overflow: 'linebreak',
            lineColor: [229, 231, 235],
            lineWidth: 0.3,
            textColor: [51, 65, 85]
        },
        headStyles: {
            fillColor: [243, 106, 33],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7.5,
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [250, 250, 252]
        },
        columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold' },
            1: { cellWidth: 18, halign: 'center', fontSize: 7 },
            2: { cellWidth: 18, halign: 'center', fontSize: 7 },
            3: { cellWidth: 12, halign: 'center' },
            4: { cellWidth: 12, halign: 'center' },
            5: { cellWidth: 12, halign: 'center' },
            6: { cellWidth: 12, halign: 'center' },
            7: { cellWidth: 18, halign: 'center' },
            8: { cellWidth: 18, halign: 'center' },
            9: { cellWidth: 14, halign: 'center', fontStyle: 'bold', textColor: [243, 106, 33] },
            10: { cellWidth: 'auto', fontSize: 7 }
        },
        margin: { left: 10, right: 10 },
        didDrawPage: function (data) {
            // Footer on every page
            const footY = pageH - 10;
            pdf.setFillColor(30, 41, 59);
            pdf.rect(0, pageH - 12, pageW, 12, 'F');

            pdf.setFontSize(7);
            pdf.setTextColor(200, 200, 200);
            pdf.text('Alebrijes de Oaxaca Teotihuacán • Fuerzas Básicas • Sistema de Evaluación Deportiva', 14, footY);

            const currentPage = pdf.internal.getCurrentPageInfo().pageNumber;
            const totalPages = pdf.internal.getNumberOfPages();
            pdf.text(`Página ${currentPage} de ${totalPages}`, pageW - 14, footY, { align: 'right' });

            // Orange top accent on continuation pages
            if (currentPage > 1) {
                pdf.setFillColor(243, 106, 33);
                pdf.rect(0, 0, pageW, 2, 'F');
            }
        }
    });

    // Download
    const rawName = `Evaluaciones_${weekValue}_${currentProfessor.nombre || 'Profesor'}.pdf`;
    const fileName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
    pdf.save(fileName);
}

// ==========================================
// MOBILE SIDEBAR & BOTTOM NAV
// ==========================================

function openSidebar() {
    if (!sidebar || !sidebarBackdrop) return;
    sidebar.classList.add('is-open');
    sidebarBackdrop.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    if (!sidebar || !sidebarBackdrop) return;
    sidebar.classList.remove('is-open');
    sidebarBackdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
}

if (mobileBtnSidebar) mobileBtnSidebar.addEventListener('click', openSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

if (mobileBtnAddPlayer) {
    mobileBtnAddPlayer.addEventListener('click', () => {
        closeSidebar();
        if (btnAddPlayer) btnAddPlayer.click();
    });
}

if (mobileBtnPDF) {
    mobileBtnPDF.addEventListener('click', () => {
        closeSidebar();
        if (btnExportPDF) btnExportPDF.click();
    });
}

if (mobileBtnLogout) {
    mobileBtnLogout.addEventListener('click', async () => {
        closeSidebar();
        if (logoutBtn) logoutBtn.click();
    });
}

// ==========================================
// LOGOUT (kept as a function in case called from elsewhere)
// ==========================================

async function handleLogout() {
    try {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

