/*
    Alebrijes de Oaxaca Teotihuacán
    Firebase Authentication & Player Metrics Script
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs, where } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// LOGIN PAGE FUNCTIONS
// ==========================================

// Handle login form submission
export async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'El correo electrónico no es válido.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Esta cuenta ha sido deshabilitada.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No existe una cuenta con este correo.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'La contraseña es incorrecta.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
                break;
        }

        return { success: false, error: errorMessage };
    }
}

// Handle password reset
export async function handlePasswordReset(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Se ha enviado un correo para restablecer tu contraseña.' };
    } catch (error) {
        let errorMessage = 'Error al enviar el correo de recuperación.';

        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No existe una cuenta con este correo.';
        }

        return { success: false, error: errorMessage };
    }
}

// Handle logout
export async function handleLogout() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Error al cerrar sesión.' };
    }
}

// Check authentication state
export function checkAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Get user role (jugador, profesor, or admin)
export async function getUserRole(userId) {
    try {
        // First check if user is a professor
        const profRef = doc(db, 'profesores', userId);
        const profSnap = await getDoc(profRef);

        if (profSnap.exists()) {
            const data = profSnap.data();
            // Return 'admin' if the professor has admin role
            if (data.rol === 'admin') {
                return 'admin';
            }
            return 'profesor';
        }

        // Check if user is a player
        const playerRef = doc(db, 'jugadores', userId);
        const playerSnap = await getDoc(playerRef);

        if (playerSnap.exists()) {
            return 'jugador';
        }

        return null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

// ==========================================
// PLAYER DATA FUNCTIONS
// ==========================================

// Get player profile data
export async function getPlayerProfile(userId) {
    try {
        // Try direct lookup by UID (new registrations)
        const playerRef = doc(db, 'jugadores', userId);
        const playerSnap = await getDoc(playerRef);

        if (playerSnap.exists()) {
            return { success: true, data: { id: playerSnap.id, ...playerSnap.data() } };
        }

        // Fallback: search by email (players registered before fix)
        const user = auth.currentUser;
        if (user && user.email) {
            const q = query(collection(db, 'jugadores'), where('email', '==', user.email), limit(1));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const docSnap = snapshot.docs[0];
                return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
            }
        }

        return { success: false, error: 'No se encontró el perfil del jugador.' };
    } catch (error) {
        console.error('Error fetching player profile:', error);
        return { success: false, error: 'Error al cargar el perfil.' };
    }
}

// Get player evaluations
export async function getPlayerEvaluations(userId, limitCount = 10) {
    try {
        // Resolve the correct player doc ID
        const playerId = await resolvePlayerId(userId);
        if (!playerId) return { success: false, error: 'No se encontró el jugador.' };

        const evaluationsRef = collection(db, 'evaluaciones');
        const q = query(evaluationsRef, where('jugadorId', '==', playerId));
        const querySnapshot = await getDocs(q);

        let evaluations = [];
        querySnapshot.forEach((docSnap) => {
            evaluations.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Sort descending by date (fecha or fechaFin)
        evaluations.sort((a, b) => {
            const dateA = new Date(a.fechaFin || a.fecha || 0).getTime();
            const dateB = new Date(b.fechaFin || b.fecha || 0).getTime();
            return dateB - dateA;
        });

        // Apply limit
        if (limitCount && limitCount > 0) {
            evaluations = evaluations.slice(0, limitCount);
        }

        return { success: true, data: evaluations };
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        return { success: false, error: 'Error al cargar las evaluaciones.' };
    }
}

// Get latest evaluation
export async function getLatestEvaluation(userId) {
    try {
        const result = await getPlayerEvaluations(userId, 1);
        if (result.success && result.data.length > 0) {
            return { success: true, data: result.data[0] };
        } else if (result.success) {
            return { success: false, error: 'No hay evaluaciones disponibles.' };
        } else {
            return result; // Propagate error
        }
    } catch (error) {
        console.error('Error fetching latest evaluation:', error);
        return { success: false, error: 'Error al cargar la evaluación.' };
    }
}

// Helper: resolve the correct Firestore doc ID for a player
async function resolvePlayerId(userId) {
    // Try direct lookup by UID first
    const playerRef = doc(db, 'jugadores', userId);
    const playerSnap = await getDoc(playerRef);
    if (playerSnap.exists()) return userId;

    // Fallback: search by email
    const user = auth.currentUser;
    if (user && user.email) {
        const q = query(collection(db, 'jugadores'), where('email', '==', user.email), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) return snapshot.docs[0].id;
    }

    return null;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Calculate average from metrics object
export function calculateAverage(metricsObj) {
    if (!metricsObj || typeof metricsObj !== 'object') return 0;

    const values = Object.values(metricsObj);
    if (values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + (Number(val) || 0), 0);
    return (sum / values.length).toFixed(1);
}

// Format date from Firestore timestamp
export function formatDate(timestamp) {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Format date for evaluation card
export function formatDateCard(timestamp) {
    if (!timestamp) return { day: '--', month: '---' };

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return {
        day: date.getDate().toString().padStart(2, '0'),
        month: date.toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()
    };
}

// Get score color class
export function getScoreClass(score) {
    const num = Number(score);
    if (num >= 8) return 'excellent';
    if (num >= 6) return 'good';
    if (num >= 4) return 'average';
    return 'needs-improvement';
}

// Export auth and db for direct access if needed
export { auth, db };
