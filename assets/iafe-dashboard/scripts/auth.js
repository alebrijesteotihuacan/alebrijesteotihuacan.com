/**
 * IAFE Dashboard - Authentication Module (Supabase)
 * Instituto Azteca de Formación Empresarial
 * ==========================================
 * Módulo de autenticación con Supabase.
 */

import { supabase } from './supabase-client.js';

// Auth state management
let currentUser = null;
let currentUserType = null; // 'estudiante' or 'docente'
let currentUserData = null;

/**
 * Initialize authentication and check current state
 */
async function initAuth() {
    // Ensure Supabase is initialized
    if (typeof initializeFirebaseApp === 'function') {
        await initializeFirebaseApp();
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        currentUser = session.user;
        currentUserData = await getUserById(currentUser.id);
        if (currentUserData) {
            currentUserType = currentUserData.tipo;
            sessionStorage.setItem('iafe_user', JSON.stringify({
                uid: currentUser.id,
                email: currentUser.email,
                ...currentUserData
            }));
        }
        return currentUser;
    }

    // No active session
    const stored = sessionStorage.getItem('iafe_user');
    if (stored) {
        currentUserData = JSON.parse(stored);
        currentUserType = currentUserData.tipo;
        return currentUserData;
    }
    return null;
}

/**
 * Check authentication state and return current user
 */
function checkAuthState() {
    const storedUser = sessionStorage.getItem('iafe_user');
    if (storedUser) {
        currentUserData = JSON.parse(storedUser);
        currentUserType = currentUserData.tipo || currentUserData.userType;
        return currentUserData;
    }
    return null;
}

/**
 * Login user with email and password
 */
async function loginUser(email, password, expectedType = null) {
    if (typeof initializeFirebaseApp === 'function') {
        await initializeFirebaseApp();
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const user = data.user;

        const userData = await getUserById(user.id);

        if (!userData) {
            await supabase.auth.signOut();
            throw new Error('Usuario no encontrado en el sistema. Contacta al administrador.');
        }

        if (expectedType && userData.tipo !== expectedType) {
            await supabase.auth.signOut();
            throw new Error(`Esta página es solo para ${expectedType === 'docente' ? 'docentes' : 'estudiantes'}. Por favor usa el acceso correcto.`);
        }

        if (userData.activo === false) {
            await supabase.auth.signOut();
            throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
        }

        currentUser = user;
        currentUserData = { uid: user.id, email: user.email, ...userData };
        currentUserType = userData.tipo;

        sessionStorage.setItem('iafe_user', JSON.stringify(currentUserData));

        console.info('✅ Login exitoso:', userData.nombre, userData.apellidos);
        return currentUserData;
    } catch (error) {
        console.error('Error en login:', error);

        let message = error.message;
        if (error.message === 'Invalid login credentials') {
            message = 'Correo o contraseña incorrectos.';
        } else if (error.message === 'Email not confirmed') {
            message = 'Debes confirmar tu correo electrónico.';
        } else if (error.message === 'Too many requests') {
            message = 'Demasiados intentos fallidos. Intenta más tarde.';
        }

        throw new Error(message);
    }
}

/**
 * Logout user
 */
async function logoutUser() {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error('Error en logout:', error);
    }

    currentUser = null;
    currentUserData = null;
    currentUserType = null;
    sessionStorage.removeItem('iafe_user');
}

/**
 * Register new student (called by teacher from dashboard)
 */
async function registerStudent(studentData) {
    if (typeof initializeFirebaseApp === 'function') {
        await initializeFirebaseApp();
    }

    if (studentData.curp && !/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(studentData.curp)) {
        throw new Error('Formato de CURP inválido');
    }

    const currentAuthUser = currentUser;

    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: studentData.email,
            password: studentData.password
        });
        if (signUpError) throw signUpError;
        const userId = signUpData.user?.id;
        if (!userId) throw new Error('No se obtuvo el ID del nuevo estudiante');

        const userRow = {
            id: userId,
            nombre: studentData.nombre,
            apellidos: studentData.apellidos,
            email: studentData.email,
            curp: studentData.curp || '',
            telefono: studentData.telefono || '',
            tipo: 'estudiante',
            nivelAcademico: studentData.nivelAcademico || '',
            grupoId: studentData.grupoId || null,
            pagoVerificado: false,
            activo: true,
            fechaRegistro: new Date().toISOString(),
            creadoPor: currentAuthUser ? currentAuthUser.id : null
        };

        const { error: insertErr } = await supabase
            .schema('iafe')
            .from('usuarios')
            .insert(userRow);
        if (insertErr) throw insertErr;

        // Sign out the newly created user (interino: el docente debe volver a iniciar sesión)
        await supabase.auth.signOut();

        if (currentAuthUser) {
            const storedUser = sessionStorage.getItem('iafe_user');
            if (storedUser) {
                currentUserData = JSON.parse(storedUser);
            }
        }

        console.info('✅ Estudiante registrado:', userId);
        return { id: userId, ...userRow };
    } catch (error) {
        console.error('Error al registrar estudiante:', error);

        let message = error.message;
        if (error.message?.toLowerCase().includes('already') || error.message?.toLowerCase().includes('registered')) {
            message = 'Ya existe una cuenta con este correo electrónico.';
        } else if (error.message?.toLowerCase().includes('password')) {
            message = 'La contraseña debe tener al menos 6 caracteres.';
        }

        throw new Error(message);
    }
}

/**
 * Create initial teacher account (admin function)
 */
async function createInitialTeacher(teacherData) {
    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: teacherData.email,
            password: teacherData.password
        });
        if (signUpError) throw signUpError;
        const userId = signUpData.user?.id;
        if (!userId) throw new Error('No se obtuvo el ID del nuevo docente');

        const userRow = {
            id: userId,
            nombre: teacherData.nombre,
            apellidos: teacherData.apellidos,
            email: teacherData.email,
            tipo: 'docente',
            activo: true,
            fechaRegistro: new Date().toISOString()
        };

        const { error: insertErr } = await supabase
            .schema('iafe')
            .from('usuarios')
            .insert(userRow);
        if (insertErr) throw insertErr;

        console.info('✅ Docente creado:', userId);
        return { id: userId, ...userRow };
    } catch (error) {
        console.error('Error al crear docente:', error);
        throw error;
    }
}

/**
 * Protect dashboard page - redirect if not authenticated
 */
function protectRoute(requiredType = null) {
    const user = checkAuthState();

    if (!user) {
        if (requiredType === 'docente') {
            window.location.href = '../login-docente.html';
        } else if (requiredType === 'estudiante') {
            window.location.href = '../login-estudiante.html';
        } else {
            window.location.href = '../login-docente.html';
        }
        return false;
    }

    const userType = user.tipo || user.userType;

    if (requiredType && userType !== requiredType) {
        if (userType === 'estudiante') {
            window.location.href = 'estudiante.html';
        } else if (userType === 'docente') {
            window.location.href = 'docente.html';
        }
        return false;
    }

    return true;
}

function getCurrentUser() {
    if (!currentUserData) {
        checkAuthState();
    }
    return currentUserData;
}

function getUserInitials(user) {
    if (!user) return '?';
    const nombre = user.nombre || '';
    const apellidos = user.apellidos || '';
    return (nombre.charAt(0) + apellidos.charAt(0)).toUpperCase();
}

function getUserFullName(user) {
    if (!user) return 'Usuario';
    return `${user.nombre || ''} ${user.apellidos || ''}`.trim() || 'Usuario';
}

function formatDate(dateInput) {
    let date;
    if (!dateInput) return '-';

    if (dateInput && typeof dateInput.toDate === 'function') {
        date = dateInput.toDate();
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatRelativeDate(dateInput) {
    let date;
    if (!dateInput) return '-';

    if (dateInput && typeof dateInput.toDate === 'function') {
        date = dateInput.toDate();
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return '-';

    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays <= 7) return `En ${diffDays} días`;
    return formatDate(date);
}

function generatePassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Export functions
window.initAuth = initAuth;
window.checkAuthState = checkAuthState;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.registerStudent = registerStudent;
window.createInitialTeacher = createInitialTeacher;
window.protectRoute = protectRoute;
window.getCurrentUser = getCurrentUser;
window.getUserInitials = getUserInitials;
window.getUserFullName = getUserFullName;
window.formatDate = formatDate;
window.formatRelativeDate = formatRelativeDate;
window.generatePassword = generatePassword;
