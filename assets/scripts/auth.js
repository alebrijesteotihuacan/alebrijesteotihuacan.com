/*
    Alebrijes de Oaxaca Teotihuacán
    Supabase Authentication & Player Metrics Script
*/

import { supabase } from './supabase-client.js';

// ==========================================
// LOGIN PAGE FUNCTIONS
// ==========================================

// Handle login form submission
export async function handleLogin(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';

        switch (error.message) {
            case 'Invalid login credentials':
                errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
                break;
            case 'Email not confirmed':
                errorMessage = 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
                break;
            case 'Too many requests':
                errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
                break;
        }

        if (error.message && error.message.toLowerCase().includes('email')) {
            errorMessage = 'El correo electrónico no es válido.';
        }

        return { success: false, error: errorMessage };
    }
}

// Handle password reset
export async function handlePasswordReset(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/pages/reset-password.html'
        });
        if (error) throw error;
        return { success: true, message: 'Se ha enviado un correo para restablecer tu contraseña.' };
    } catch (error) {
        let errorMessage = 'Error al enviar el correo de recuperación.';

        if (error.message && error.message.includes('not found')) {
            errorMessage = 'No existe una cuenta con este correo.';
        }

        return { success: false, error: errorMessage };
    }
}

// Handle logout
export async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Error al cerrar sesión.' };
    }
}

// Check authentication state
export function checkAuthState(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
    });
}

// Get current user
export function getCurrentUser() {
    return supabase.auth.getUser().then(({ data }) => data.user);
}

// Get user role (jugador, profesor, or admin)
export async function getUserRole(userId) {
    try {
        const { data: profData, error: profError } = await supabase
            .from('profesores')
            .select('rol')
            .eq('id', userId)
            .maybeSingle();

        if (profData) {
            if (profData.rol === 'admin') {
                return 'admin';
            }
            return 'profesor';
        }

        const { data: playerData, error: playerError } = await supabase
            .from('jugadores')
            .select('id')
            .eq('id', userId)
            .maybeSingle();

        if (playerData) {
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
        const { data, error } = await supabase
            .from('jugadores')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (data) {
            return { success: true, data: { id: data.id, ...data } };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
            const { data: byEmail, error: byEmailError } = await supabase
                .from('jugadores')
                .select('*')
                .eq('email', user.email)
                .limit(1)
                .maybeSingle();

            if (byEmail) {
                return { success: true, data: { id: byEmail.id, ...byEmail } };
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
        const playerId = await resolvePlayerId(userId);
        if (!playerId) return { success: false, error: 'No se encontró el jugador.' };

        const { data, error } = await supabase
            .from('evaluaciones')
            .select('*')
            .eq('jugadorId', playerId);

        if (error) throw error;

        let evaluations = (data || []).map(row => ({ id: row.id, ...row }));

        evaluations.sort((a, b) => {
            const dateA = new Date(b.fechaFin || b.fecha || 0).getTime();
            const dateB = new Date(a.fechaFin || a.fecha || 0).getTime();
            return dateA - dateB;
        });

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
            return result;
        }
    } catch (error) {
        console.error('Error fetching latest evaluation:', error);
        return { success: false, error: 'Error al cargar la evaluación.' };
    }
}

// Helper: resolve the correct jugadores row ID for a player
async function resolvePlayerId(userId) {
    const { data: direct } = await supabase
        .from('jugadores')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

    if (direct) return userId;

    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
        const { data: byEmail } = await supabase
            .from('jugadores')
            .select('id')
            .eq('email', user.email)
            .limit(1)
            .maybeSingle();

        if (byEmail) return byEmail.id;
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

// Format date from ISO string or Date
export function formatDate(timestamp) {
    if (!timestamp) return '';

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Format date for evaluation card
export function formatDateCard(timestamp) {
    if (!timestamp) return { day: '--', month: '---' };

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
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

// Export supabase for direct access if needed
export { supabase };
