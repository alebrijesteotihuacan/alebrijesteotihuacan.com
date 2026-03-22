/*
    Alebrijes de Oaxaca Teotihuacán
    Professor Panel Script
*/

import { initializeApp, getApps, getApp, deleteApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, addDoc, query, orderBy, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5aakkUMk77EMKPwHvjXTqzPKBvejhjEo",
    authDomain: "metricasalebrijes.firebaseapp.com",
    projectId: "metricasalebrijes",
    storageBucket: "metricasalebrijes.firebasestorage.app",
    messagingSenderId: "822819596837",
    appId: "1:822819596837:web:62f3f4139332830ee96dcc"
};

// Initialize Firebase
let app;
try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
    app = initializeApp(firebaseConfig, 'panel-prof-' + Date.now());
}
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loadingState = document.getElementById('loadingState');
const dashboardContent = document.getElementById('dashboardContent');
const profName = document.getElementById('profName');
const profEmail = document.getElementById('profEmail');
const logoutBtn = document.getElementById('logoutBtn');
const totalJugadores = document.getElementById('totalJugadores');
const totalEvaluaciones = document.getElementById('totalEvaluaciones');
const playersGrid = document.getElementById('playersGrid');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const evalModal = document.getElementById('evalModal');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const evalForm = document.getElementById('evalForm');
const playerEvalInfo = document.getElementById('playerEvalInfo');
const successToast = document.getElementById('successToast');
const toastMessage = document.getElementById('toastMessage');

// Registration DOM Elements
const btnAddPlayer = document.getElementById('btnAddPlayer');
const registerModal = document.getElementById('registerModal');
const registerModalClose = document.getElementById('registerModalClose');
const registerBtnCancel = document.getElementById('registerBtnCancel');
const registerForm = document.getElementById('registerForm');
const sessionCounter = document.getElementById('sessionCounter');
const registrationCounter = document.querySelector('.registration-counter');
const passwordPreview = document.getElementById('passwordPreview');

// Registration inputs for password generation
const regNombre = document.getElementById('regNombre');
const regApellido = document.getElementById('regApellido');
const regFechaNac = document.getElementById('regFechaNac');

// Session state
let registeredCount = 0;

// Current state
let currentProfessor = null;
let currentPlayerId = null;
let allPlayers = [];
let dashboardInitialized = false;
let currentEditEvalId = null; // ID of evaluation being edited (null = new)
let currentEditSubEvalId = null; // subcollection eval ID

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

// Check authentication
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Prevent re-initialization if already loaded
    if (dashboardInitialized && currentProfessor && currentProfessor.id === user.uid) {
        return;
    }

    // Load professor profile or use default from auth
    try {
        const profRef = doc(db, 'profesores', user.uid);
        const profSnap = await getDoc(profRef);

        if (profSnap.exists()) {
            currentProfessor = { id: user.uid, email: user.email, ...profSnap.data() };
        } else {
            // Use auth user data as fallback (no write required)
            currentProfessor = {
                id: user.uid,
                email: user.email,
                nombre: user.displayName || user.email.split('@')[0],
                rol: 'profesor'
            };
        }

        await initDashboard();
        dashboardInitialized = true;
    } catch (error) {
        console.error('Error loading professor:', error);
        // Still allow access with basic user data
        currentProfessor = {
            id: user.uid,
            email: user.email,
            nombre: user.displayName || user.email.split('@')[0],
            rol: 'profesor'
        };
        await initDashboard();
        dashboardInitialized = true;
    }
});

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

    // Load players
    await loadPlayers();

    // Load stats
    await loadStats();

    // Hide loading, show content
    loadingState.style.display = 'none';
    dashboardContent.style.display = 'block';
}

// Load players registered by current professor
async function loadPlayers(category = '') {
    try {
        // Admin sees ALL players, regular professors see only their own
        let q;
        if (currentProfessor.rol === 'admin') {
            q = query(collection(db, 'jugadores'));
        } else {
            q = query(
                collection(db, 'jugadores'),
                where('registradoPor', '==', currentProfessor.id)
            );
        }

        const snapshot = await getDocs(q);
        allPlayers = [];

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const normalizedCat = normalizeCategoria(data.categoria);
            // Apply category filter locally if needed
            if (!category || normalizedCat === category) {
                allPlayers.push({ id: docSnap.id, ...data, categoria: normalizedCat });
            }
        });

        // Fetch latest evaluation average for each player
        await Promise.all(allPlayers.map(async (player) => {
            try {
                const evalsRef = collection(db, 'evaluaciones');
                const evalsQuery = query(evalsRef, where('jugadorId', '==', player.id));
                const evalsSnap = await getDocs(evalsQuery);

                if (!evalsSnap.empty) {
                    // Sort locally to avoid Firebase index requirement issues
                    let playerEvals = [];
                    evalsSnap.forEach(d => playerEvals.push(d.data()));
                    playerEvals.sort((a, b) => {
                        const dateA = new Date(a.fechaFin || a.fecha || 0).getTime();
                        const dateB = new Date(b.fechaFin || b.fecha || 0).getTime();
                        return dateB - dateA;
                    });

                    const latestEval = playerEvals[0];
                    player.latestPromedio = latestEval.promedioGeneral || null;
                    player.latestSemana = latestEval.semana || '';
                }
            } catch (e) {
                console.warn('Could not load evals for', player.id, e);
            }
        }));

        // Sort locally by name
        allPlayers.sort((a, b) => {
            const nameA = (a.nombre || '').toLowerCase();
            const nameB = (b.nombre || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        renderPlayers(allPlayers);
        totalJugadores.textContent = allPlayers.length;
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
    }
}

// Player images list (PlantillaLigaTDP_2026)
const PLAYER_IMAGES = [
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

function normalizeStr(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

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
        'Abdiel_Monroy_García.jpeg', 'Asiel_Zaid_Montoya_Rojas.jpeg', 'Axel_Antonio_Vázquez_Estrada.jpeg', 'Bruno_Arroyo_Sánchez.jpeg',
        'Dejan_Kaled_Ramírez_Guijano.jpeg', 'Demian_Marcus_Arregui_Nava.jpeg', 'Derek_Jesús_Hernández_Licea.jpeg', 'Diego_Aaron_Alonso_Garcia.jpeg',
        'Emiliano_Rodríguez_Hernández.jpeg', 'Iram_Habid_Barrientos_García.jpeg', 'Isaí_Daniel_Gómez_García.jpeg', 'Isaías_Adrian_Alvarado_Hernández.jpeg',
        'Israel_Rivera_Hernández.jpeg', 'Jimenez_Carbajal_Johan_Eduardo.jpeg', 'Joel_Martinez_Cruz.jpeg', 'Jose_Emiliano_Sánchez_Gaspar.jpeg',
        'Josue_Alfredo_Vázquez_Valadez.jpeg', 'José_Asael_Rascon_Gurrola.jpeg', 'José_Carlos_Rivaldo_Silva_Baez.jpeg', 'José_Eduardo_Islas_Hernandez.jpeg',
        'José_Francisco_González_Ceniceros.jpeg', 'Kevin_Damian_Alvarado_Montiel.jpeg', 'Kevin_Isael_Visoso_Lázaro.jpeg', 'Leonardo_Briones_Duran.jpeg',
        'Leonardo_Madrigal_Velázquez.jpeg', 'Luis_Daniel_Martinez_Avedaño.jpeg', 'Matteo_Cardona_Miranda.jpeg', 'Mauricio_Fuentes_Ramos.jpeg',
        'Miguel_Gutierrez_Cervantes.jpeg', 'William_Alfredo_Turrubiates_Camacho.jpeg'
    ];

function findPlayerImageInfo(nombre, apellido) {
    const fullName = normalizeStr(`${nombre || ''} ${apellido || ''}`);
    const firstName = normalizeStr(nombre || '');
    
    for (const img of PLAYER_IMAGES) {
        const parts = img.split('.')[0].split('_');
        parts.pop();
        const imgName = normalizeStr(parts.join(' '));
        if (imgName === fullName) return { file: img, folder: 'PlantillaLigaTDP_2026' };
        if (fullName && imgName.includes(firstName) && firstName.length > 2) {
            const apellidoNorm = normalizeStr(apellido || '');
            if (apellidoNorm && imgName.includes(apellidoNorm.split(' ')[0])) return { file: img, folder: 'PlantillaLigaTDP_2026' };
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

        // Generate password from initials + birth year (same logic as registration)
        const passInitials = ((player.nombre || '').charAt(0) + (player.apellido || '').charAt(0)).toUpperCase();
        const birthYear = player.fechaNacimiento ? player.fechaNacimiento.split('-')[0] : '????';
        const generatedPassword = `${passInitials}${birthYear}`;
        const playerEmail = player.email || 'Sin correo';

        // Build average badge
        const avgValue = player.latestPromedio;
        let avgBadgeHTML = '';
        if (avgValue !== undefined && avgValue !== null) {
            const avgNum = parseFloat(avgValue);
            let avgColor = '#ef4444'; // red
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

        return `
            <div class="player-card" data-id="${player.id}">
                ${avatarHTML}
                <div class="player-details">
                    <div class="player-name" title="${fullName}">${shortName}</div>
                </div>
                ${avgBadgeHTML}
                <div class="player-actions">
                    <button class="cred-btn" data-player="${player.id}" title="Ver credenciales">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </button>
                    <button class="eval-btn" data-id="${player.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Evaluar
                    </button>
                    ${currentProfessor.rol === 'admin' || currentProfessor.id === player.registradoPor ? `
                    <button class="delete-btn" data-id="${player.id}" title="Eliminar jugador">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

function openCredsModal(player) {
    const credsModal = document.getElementById('credsModal');
    if(!credsModal) return;

    const shortName = getShortName(player.nombre, player.apellido);
    const initials = getInitials(player.nombre, player.apellido);
    const passInitials = ((player.nombre || '').charAt(0) + (player.apellido || '').charAt(0)).toUpperCase();
    const birthYear = player.fechaNacimiento ? player.fechaNacimiento.split('-')[0] : '????';
    const generatedPassword = `${passInitials}${birthYear}`;
    
    // UI elements
    const avatarEl = document.getElementById('credsPlayerAvatar');
    const nameEl = document.getElementById('credsPlayerName');
    const emailEl = document.getElementById('credsPlayerEmail');
    const passEl = document.getElementById('credsPlayerPass');

    nameEl.textContent = `${toTitleCase(player.nombre || '')} ${toTitleCase(player.apellido || '')}`.trim() || 'Sin nombre';
    emailEl.textContent = player.email || 'Sin correo asignado';
    passEl.textContent = generatedPassword;

    // Avatar
    const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
    const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;
    if (imgSrc) {
        avatarEl.style.background = '#e2e8f0';
        avatarEl.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
        avatarEl.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        avatarEl.innerHTML = initials;
    }

    credsModal.classList.add('active');

    const closeModalBtn = document.getElementById('credsModalClose');
    const closeHandler = () => {
        credsModal.classList.remove('active');
        closeModalBtn.removeEventListener('click', closeHandler);
    };
    closeModalBtn.addEventListener('click', closeHandler);
    
    // Click outside
    const outsideHandler = (e) => {
        if(e.target === credsModal) {
            credsModal.classList.remove('active');
            credsModal.removeEventListener('click', outsideHandler);
        }
    };
    credsModal.addEventListener('click', outsideHandler);
}

// ==========================================
// DELETE PLAYER LOGIC
// ==========================================

let playerToDelete = null;

function openDeleteModal(player) {
    const deleteModal = document.getElementById('deleteModal');
    if(!deleteModal) return;

    playerToDelete = player;
    
    // UI elements
    const nameEl = document.getElementById('deletePlayerName');
    nameEl.textContent = `${toTitleCase(player.nombre || '')} ${toTitleCase(player.apellido || '')}`.trim() || 'Sin nombre';

    // Reset overlay
    const overlay = document.getElementById('deleteLoadingOverlay');
    if (overlay) overlay.classList.remove('active');

    deleteModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Event listeners for close
    const closeModalBtn = document.getElementById('deleteModalClose');
    const cancelBtn = document.getElementById('deleteBtnCancel');
    const confirmBtn = document.getElementById('deleteBtnConfirm');

    const closeHandler = () => {
        closeDeleteModal();
    };

    closeModalBtn.addEventListener('click', closeHandler, { once: true });
    cancelBtn.addEventListener('click', closeHandler, { once: true });
    
    // Remove previous event listener and add new one
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', async () => {
        await executeDeletePlayer(newConfirmBtn);
    });

    // Click outside
    const outsideHandler = (e) => {
        if(e.target === deleteModal) {
            closeDeleteModal();
            deleteModal.removeEventListener('click', outsideHandler);
        }
    };
    deleteModal.addEventListener('click', outsideHandler);
}

function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if(deleteModal) {
        deleteModal.classList.remove('active');
    }
    document.body.style.overflow = '';
    playerToDelete = null;

    const overlay = document.getElementById('deleteLoadingOverlay');
    if (overlay) overlay.classList.remove('active');
}

async function executeDeletePlayer(confirmBtn) {
    if (!playerToDelete) return;
    
    const overlay = document.getElementById('deleteLoadingOverlay');
    if (overlay) overlay.classList.add('active');
    
    confirmBtn.disabled = true;

    try {
        // Delete from firestore
        await deleteDoc(doc(db, 'jugadores', playerToDelete.id));

        // Note: Ideally, a Cloud Function should handle deleting subcollections (evaluations)
        // and images to ensure atomicity, but for frontend-only, this deletes the main document.

        showToast('Jugador eliminado correctamente');
        closeDeleteModal();
        
        // Refresh dashboard
        await loadPlayers(document.getElementById('categoryFilter').value);
        await loadStats();

    } catch (error) {
        console.error('Error deleting player:', error);
        showToast('Error al eliminar el jugador: ' + error.message, 'error');
        if (overlay) overlay.classList.remove('active');
    } finally {
        confirmBtn.disabled = false;
    }
}

// Get initials
function getInitials(nombre, apellido) {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '';
    const last = apellido ? apellido.charAt(0).toUpperCase() : '';
    return first + last || '?';
}

// Load stats
async function loadStats() {
    try {
        let evalsQuery;
        if (currentProfessor.rol === 'admin') {
            // Admin sees all evaluations
            evalsQuery = query(collection(db, 'evaluaciones'));
        } else {
            evalsQuery = query(
                collection(db, 'evaluaciones'),
                where('evaluadorId', '==', currentProfessor.id)
            );
        }
        const evalsSnap = await getDocs(evalsQuery);
        totalEvaluaciones.textContent = evalsSnap.size;
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
    currentEditSubEvalId = null;

    const initials = getInitials(player.nombre, player.apellido);
    const fullName = `${toTitleCase(player.nombre || '')} ${toTitleCase(player.apellido || '')}`.trim() || 'Sin nombre';

    const imgInfo = findPlayerImageInfo(player.nombre, player.apellido);
    const imgSrc = imgInfo ? `../assets/${imgInfo.folder}/${encodeURIComponent(imgInfo.file)}` : null;
    
    const avatarHTML = imgSrc
        ? `<div class="avatar" style="background: transparent; padding: 0;"><img src="${imgSrc}" alt="${fullName}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" onerror="this.parentElement.style.background='var(--primary)';this.parentElement.style.padding='0';this.parentElement.innerHTML='${initials}'"></div>`
        : `<div class="avatar">${initials}</div>`;

    playerEvalInfo.innerHTML = `
        ${avatarHTML}
        <div class="info">
            <h4>${fullName}</h4>
            <p>${player.posicion || 'Sin posición'} • ${player.categoria || 'Sin categoría'}</p>
        </div>
    `;

    // Reset form
    evalForm.reset();

    // Set current week as default
    const evalSemana = document.getElementById('evalSemana');
    if (evalSemana) {
        const now = new Date();
        const year = now.getFullYear();
        const oneJan = new Date(year, 0, 1);
        const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
        evalSemana.value = `${year}-W${String(weekNumber).padStart(2, '0')}`;
    }

    evalModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Check if evaluation already exists for this week
    await checkExistingEval();
}

// Check for existing evaluation for current player + selected week
async function checkExistingEval() {
    const evalSemana = document.getElementById('evalSemana');
    const submitBtn = document.getElementById('btnSubmit');
    if (!evalSemana || !evalSemana.value || !currentPlayerId) return;

    try {
        // Query root evaluaciones collection
        const evalsQuery = query(
            collection(db, 'evaluaciones'),
            where('jugadorId', '==', currentPlayerId),
            where('semana', '==', evalSemana.value)
        );
        const evalsSnap = await getDocs(evalsQuery);

        if (!evalsSnap.empty) {
            // Existing evaluation found - populate form for editing
            const evalDoc = evalsSnap.docs[0];
            const ev = evalDoc.data();
            currentEditEvalId = evalDoc.id;

            // Find subcollection eval ID
            const subQuery = query(
                collection(db, 'jugadores', currentPlayerId, 'evaluaciones'),
                where('semana', '==', evalSemana.value)
            );
            const subSnap = await getDocs(subQuery);
            currentEditSubEvalId = subSnap.empty ? null : subSnap.docs[0].id;

            // Populate form fields
            document.getElementById('tecnico').value = ev.tecnico ?? '';
            document.getElementById('tactico').value = ev.tactico ?? '';
            document.getElementById('fisico').value = ev.fisico ?? '';
            document.getElementById('mental').value = ev.mental ?? '';
            document.getElementById('disciplinaCancha').value = ev.disciplinaCancha ?? '';
            document.getElementById('disciplinaCasaClub').value = ev.disciplinaCasaClub ?? '';
            document.getElementById('inasistencias').value = ev.inasistencias ?? '0';
            document.getElementById('rendimientoCancha').value = ev.rendimientoCancha ?? '';
            document.getElementById('minutosJugados').value = ev.minutosJugados ?? '';
            document.getElementById('observaciones').value = ev.observaciones || '';

            // Update button text to indicate editing
            submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Actualizar Evaluación';
            showToast('Evaluación existente cargada para editar', 'info');
        } else {
            currentEditEvalId = null;
            currentEditSubEvalId = null;
            // Clear form fields (keep week)
            const weekVal = evalSemana.value;
            evalForm.reset();
            evalSemana.value = weekVal;
            submitBtn.textContent = 'Guardar Evaluación';
        }
    } catch (error) {
        console.error('Error checking existing evaluation:', error);
    }
}

// Close modal
function closeModal() {
    evalModal.classList.remove('active');
    currentPlayerId = null;
    currentEditEvalId = null;
    currentEditSubEvalId = null;
    document.body.style.overflow = '';
    evalForm.reset();
    const submitBtn = document.getElementById('btnSubmit');
    if (submitBtn) submitBtn.textContent = 'Guardar Evaluación';
}

// Show toast
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    successToast.className = 'toast show';
    if (type === 'error') {
        successToast.style.background = '#ef4444';
    } else if (type === 'info') {
        successToast.style.background = '#3b82f6';
    } else {
        successToast.style.background = '#10b981';
    }
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 3000);
}

// Event Listeners
modalClose.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

evalModal.addEventListener('click', (e) => {
    if (e.target === evalModal) {
        closeModal();
    }
});

// Eval tab switching
document.querySelectorAll('.eval-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.eval-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.eval-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('active');
    });
});

// Week selector change - check for existing evaluation
const evalSemanaInput = document.getElementById('evalSemana');
if (evalSemanaInput) {
    evalSemanaInput.addEventListener('change', async () => {
        if (currentPlayerId) {
            await checkExistingEval();
        }
    });
}

// Category filter
categoryFilter.addEventListener('change', () => {
    loadPlayers(categoryFilter.value);
});

// Search input
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allPlayers.filter(player => {
            const fullName = `${player.nombre || ''} ${player.apellido || ''}`.toLowerCase();
            return fullName.includes(searchTerm);
        });
        renderPlayers(filtered);
    });
}

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
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

    try {
        const formData = new FormData(evalForm);

        // Required fields validation
        const observaciones = formData.get('observaciones');
        if (!observaciones || observaciones.trim() === '') {
            showToast('El campo de observaciones es obligatorio', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';

        // Get week value
        const semana = formData.get('semana') || '';

        // Calculate week dates
        let fechaInicio = null;
        let fechaFin = null;
        if (semana) {
            const [year, week] = semana.split('-W');
            const firstDayOfYear = new Date(year, 0, 1);
            const daysOffset = (week - 1) * 7;
            fechaInicio = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
            // Adjust to Monday
            const day = fechaInicio.getDay();
            const diff = fechaInicio.getDate() - day + (day === 0 ? -6 : 1);
            fechaInicio = new Date(fechaInicio.setDate(diff));
            fechaFin = new Date(fechaInicio.getTime() + 6 * 24 * 60 * 60 * 1000);
        }

        const tecnico = parseFloat(formData.get('tecnico'));
        const tactico = parseFloat(formData.get('tactico'));
        const fisico = parseFloat(formData.get('fisico'));
        const mental = parseFloat(formData.get('mental'));
        const disciplinaCancha = parseFloat(formData.get('disciplinaCancha'));
        const disciplinaCasaClub = parseFloat(formData.get('disciplinaCasaClub'));
        
        // Inasistencias field
        let inasistencias = parseInt(formData.get('inasistencias'), 10);
        if (isNaN(inasistencias)) inasistencias = 0;

        // New fields
        const rendimientoCanchaRaw = formData.get('rendimientoCancha') || '';
        const rendimientoCancha = rendimientoCanchaRaw === 'RP' ? 'RP' : (rendimientoCanchaRaw ? parseFloat(rendimientoCanchaRaw) : null);
        const minutosJugados = parseInt(formData.get('minutosJugados')) || 0;

        // Calculate average (original 6 metrics only, rendimientoCancha is separate)
        const promedioGeneral = ((tecnico + tactico + fisico + mental + disciplinaCancha + disciplinaCasaClub) / 6).toFixed(1);

        const evaluationData = {
            jugadorId: currentPlayerId,
            evaluadorId: currentProfessor.id,
            evaluadorNombre: currentProfessor.nombre || 'Profesor',
            fecha: serverTimestamp(),
            semana: semana,
            fechaInicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
            fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
            tecnico,
            tactico,
            fisico,
            mental,
            disciplinaCancha,
            disciplinaCasaClub,
            inasistencias,
            rendimientoCancha,
            minutosJugados,
            promedioGeneral: parseFloat(promedioGeneral),
            observaciones: formData.get('observaciones') || '',
            tipo: 'Evaluación Semanal'
        };

        if (currentEditEvalId) {
            // UPDATE existing evaluation
            await updateDoc(doc(db, 'evaluaciones', currentEditEvalId), evaluationData);
            if (currentEditSubEvalId) {
                await updateDoc(doc(db, 'jugadores', currentPlayerId, 'evaluaciones', currentEditSubEvalId), evaluationData);
            }
            closeModal();
            showToast('Evaluación actualizada correctamente');
        } else {
            // CREATE new evaluation
            await addDoc(collection(db, 'evaluaciones'), evaluationData);
            await addDoc(collection(db, 'jugadores', currentPlayerId, 'evaluaciones'), evaluationData);
            closeModal();
            showToast('Evaluación guardada correctamente');
        }

        // Reload stats
        await loadStats();

    } catch (error) {
        console.error('Error saving evaluation:', error);
        showToast('Error al guardar la evaluación', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar Evaluación';
    }
});

// ==========================================
// REGISTRATION LOGIC
// ==========================================

// Open Registration Modal
if (btnAddPlayer) {
    btnAddPlayer.addEventListener('click', () => {
        registerModal.classList.add('active');
        // Reset form if it's a fresh start (optional, maybe keep previous category)
        if (registeredCount === 0) {
            registerForm.reset();
            passwordPreview.textContent = '--';
        }
    });
}

// Close Registration Modal
function closeRegisterModal() {
    registerModal.classList.remove('active');
}

if (registerModalClose) registerModalClose.addEventListener('click', closeRegisterModal);
if (registerBtnCancel) registerBtnCancel.addEventListener('click', closeRegisterModal);

// Generate Password Preview
function updatePasswordPreview() {
    const nombre = regNombre.value.trim();
    const apellido = regApellido.value.trim();
    const fecha = regFechaNac.value;

    if (nombre && apellido && fecha) {
        const initials = (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
        const year = fecha.split('-')[0];
        const password = `${initials}${year}`;
        passwordPreview.textContent = password;
        return password;
    } else {
        passwordPreview.textContent = '--';
        return null;
    }
}

// Listen for input changes to update password
if (regNombre) regNombre.addEventListener('input', updatePasswordPreview);
if (regApellido) regApellido.addEventListener('input', updatePasswordPreview);
if (regFechaNac) regFechaNac.addEventListener('input', updatePasswordPreview);

// Handle Registration Submit
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('registerBtnSubmit');
        const originalBtnText = submitBtn.innerHTML;
        const generatedPassword = updatePasswordPreview();

        if (!generatedPassword) {
            showToast('Por favor completa los campos para generar la contraseña', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Registrando...</span>';

        // CRITICAL: Save professor's UID BEFORE creating the player user
        const professorUid = currentProfessor.id;

        try {
            const formData = new FormData(registerForm);
            const email = formData.get('email');

            // 1. Create a SECONDARY Firebase App to avoid signing out the professor
            //    createUserWithEmailAndPassword auto-signs-in as the new user,
            //    so we do it on a separate app instance
            const secondaryApp = initializeApp(firebaseConfig, 'secondary-registration-' + Date.now());
            const secondaryAuth = getAuth(secondaryApp);

            let newUserUid;
            try {
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, generatedPassword);
                newUserUid = userCredential.user.uid;

                // Sign out from secondary auth immediately
                await signOut(secondaryAuth);
            } finally {
                // Always clean up secondary app
                await deleteApp(secondaryApp);
            }

            // 2. Create Player Document in Firestore (using professor's UID, not the player's)
            const playerData = {
                uid: newUserUid,
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                email: email,
                fechaNacimiento: formData.get('fechaNacimiento'),
                categoria: formData.get('categoria'),
                posicion: formData.get('posicion'),
                numeroCamiseta: parseInt(formData.get('numeroCamiseta')) || 0,
                rol: 'jugador',
                fechaRegistro: serverTimestamp(),
                registradoPor: professorUid  // Always the professor's UID
            };

            await setDoc(doc(db, 'jugadores', newUserUid), playerData);

            // 3. Success handling
            showToast(`Jugador ${playerData.nombre} registrado exitosamente`);

            // Update session counter
            registeredCount++;
            sessionCounter.textContent = registeredCount;
            registrationCounter.style.display = 'block';

            // 4. Reset form but keep Category and Date for speed
            const lastCategory = formData.get('categoria');
            const lastDate = formData.get('fechaNacimiento');

            registerForm.reset();

            // Restore context for next entry
            document.getElementById('regCategoria').value = lastCategory;
            document.getElementById('regFechaNac').value = lastDate;
            passwordPreview.textContent = '--';

            // Focus on first field
            regNombre.focus();

            // Refresh players list in background
            loadPlayers();

        } catch (error) {
            console.error('Error registering player:', error);
            let errorMsg = 'Error al registrar jugador';
            if (error.code === 'auth/email-already-in-use') {
                errorMsg = 'El correo electrónico ya está registrado';
            }
            showToast(errorMsg, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (evalModal.classList.contains('active')) closeModal();
        if (registerModal && registerModal.classList.contains('active')) closeRegisterModal();
        const pdfModalEl = document.getElementById('pdfModal');
        if (pdfModalEl && pdfModalEl.classList.contains('active')) pdfModalEl.classList.remove('active');
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

// Set default week to current week
if (pdfWeekPicker) {
    const now = new Date();
    const year = now.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
    pdfWeekPicker.value = `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

function openPdfModal() {
    if (pdfModal) pdfModal.classList.add('active');
}

function closePdfModal() {
    if (pdfModal) pdfModal.classList.remove('active');
}

if (btnExportPDF) btnExportPDF.addEventListener('click', openPdfModal);
if (pdfModalClose) pdfModalClose.addEventListener('click', closePdfModal);
if (pdfBtnCancel) pdfBtnCancel.addEventListener('click', closePdfModal);

if (pdfBtnExport) {
    pdfBtnExport.addEventListener('click', async () => {
        const selectedWeek = pdfWeekPicker.value;
        if (!selectedWeek) {
            showToast('Selecciona una semana', 'error');
            return;
        }

        pdfBtnExport.disabled = true;
        pdfBtnExport.textContent = 'Generando...';

        try {
            await generateWeeklyPDF(selectedWeek);
            closePdfModal();
            showToast('PDF generado correctamente');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showToast('Error al generar el PDF', 'error');
        } finally {
            pdfBtnExport.disabled = false;
            pdfBtnExport.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Generar PDF`;
        }
    });
}

// Utility: load image as base64 data URL
function loadImageAsBase64(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

async function generateWeeklyPDF(weekValue) {
    // Query evaluations for this week by this professor
    const evalsQuery = query(
        collection(db, 'evaluaciones'),
        where('evaluadorId', '==', currentProfessor.id),
        where('semana', '==', weekValue)
    );

    const evalsSnap = await getDocs(evalsQuery);

    if (evalsSnap.empty) {
        showToast('No hay evaluaciones para esta semana', 'error');
        throw new Error('No evaluations found');
    }

    // Collect evaluation data
    const evaluations = [];
    evalsSnap.forEach(docSnap => {
        evaluations.push(docSnap.data());
    });

    // Get player names + details for each evaluation
    const evalRows = [];
    for (const ev of evaluations) {
        let playerName = 'Jugador';
        let playerCat = '';
        let playerPos = '';
        try {
            const playerDoc = await getDoc(doc(db, 'jugadores', ev.jugadorId));
            if (playerDoc.exists()) {
                const p = playerDoc.data();
                playerName = `${p.nombre || ''} ${p.apellido || ''}`.trim();
                playerCat = p.categoria || '';
                playerPos = p.posicion || '';
            }
        } catch (e) {
            playerName = ev.jugadorId;
        }

        evalRows.push({
            nombre: playerName,
            categoria: playerCat,
            posicion: playerPos,
            tecnico: ev.tecnico ?? '--',
            tactico: ev.tactico ?? '--',
            fisico: ev.fisico ?? '--',
            mental: ev.mental ?? '--',
            disciplinaCancha: ev.disciplinaCancha ?? '--',
            disciplinaCasaClub: ev.disciplinaCasaClub ?? '--',
            promedio: ev.promedioGeneral ?? '--',
            observaciones: ev.observaciones || ''
        });
    }

    // Sort by name
    evalRows.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Parse week for display
    const [yearStr, weekStr] = weekValue.split('-W');
    const weekNum = parseInt(weekStr);
    const weekLabel = `Semana ${weekNum}, ${yearStr}`;

    // Calculate week date range for display
    const firstDay = new Date(parseInt(yearStr), 0, 1);
    const daysOffset = (weekNum - 1) * 7;
    const weekStart = new Date(firstDay.getTime() + daysOffset * 86400000);
    const dayAdj = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() - dayAdj + (dayAdj === 0 ? -6 : 1));
    const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);
    const dateOpts = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateRange = `${weekStart.toLocaleDateString('es-MX', dateOpts)} — ${weekEnd.toLocaleDateString('es-MX', dateOpts)}`;

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
        row.disciplinaCancha,
        row.disciplinaCasaClub,
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
    const fileName = `Evaluaciones_${weekValue}_${currentProfessor.nombre || 'Profesor'}.pdf`;
    pdf.save(fileName.replace(/\s+/g, '_'));
}

