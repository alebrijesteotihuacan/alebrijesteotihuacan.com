/**
 * IAFE Dashboard - Authentication Module
 * Instituto Azteca de Formación Empresarial
 * ==========================================
 * Módulo de autenticación real con Firebase
 */

// Auth state management
let currentUser = null;
let currentUserType = null; // 'estudiante' or 'docente'
let currentUserData = null;

/**
 * Initialize authentication and check current state
 */
async function initAuth() {
    // Ensure Firebase is initialized
    if (typeof initializeFirebaseApp === 'function') {
        await initializeFirebaseApp();
    }

    return new Promise((resolve) => {
        if (typeof auth !== 'undefined' && auth) {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    currentUser = user;
                    // Get user data from Firestore
                    currentUserData = await getUserById(user.uid);
                    if (currentUserData) {
                        currentUserType = currentUserData.tipo;
                        // Store in session
                        sessionStorage.setItem('iafe_user', JSON.stringify({
                            uid: user.uid,
                            email: user.email,
                            ...currentUserData
                        }));
                    }
                    resolve(user);
                } else {
                    currentUser = null;
                    currentUserData = null;
                    currentUserType = null;
                    sessionStorage.removeItem('iafe_user');
                    resolve(null);
                }
            });
        } else {
            // Fallback to session storage
            const stored = sessionStorage.getItem('iafe_user');
            if (stored) {
                currentUserData = JSON.parse(stored);
                currentUserType = currentUserData.tipo;
                resolve(currentUserData);
            } else {
                resolve(null);
            }
        }
    });
}

/**
 * Check authentication state and return current user
 */
function checkAuthState() {
    // Get current user from session storage
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
 * @param {string} email 
 * @param {string} password 
 * @param {string} expectedType - 'estudiante' or 'docente'
 * @returns {Promise<object>}
 */
async function loginUser(email, password, expectedType = null) {
    // Ensure Firebase is initialized
    if (typeof initializeFirebaseApp === 'function') {
        await initializeFirebaseApp();
    }

    if (!auth) {
        throw new Error('Firebase no está disponible. Por favor recarga la página.');
    }

    try {
        // Sign in with Firebase Auth
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userData = await getUserById(user.uid);

        if (!userData) {
            await auth.signOut();
            throw new Error('Usuario no encontrado en el sistema. Contacta al administrador.');
        }

        // Verify user type if expected
        if (expectedType && userData.tipo !== expectedType) {
            await auth.signOut();
            throw new Error(`Esta página es solo para ${expectedType === 'docente' ? 'docentes' : 'estudiantes'}. Por favor usa el acceso correcto.`);
        }

        // Check if user is active
        if (userData.activo === false) {
            await auth.signOut();
            throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
        }

        // Store user in session
        currentUser = user;
        currentUserData = { uid: user.uid, email: user.email, ...userData };
        currentUserType = userData.tipo;

        sessionStorage.setItem('iafe_user', JSON.stringify(currentUserData));

        console.info('✅ Login exitoso:', userData.nombre, userData.apellidos);
        return currentUserData;
    } catch (error) {
        console.error('Error en login:', error);

        // Translate Firebase error messages
        let message = error.message;
        if (error.code === 'auth/user-not-found') {
            message = 'No existe una cuenta con este correo electrónico.';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Contraseña incorrecta.';
        } else if (error.code === 'auth/invalid-email') {
            message = 'El correo electrónico no es válido.';
        } else if (error.code === 'auth/too-many-requests') {
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
        if (auth) {
            await auth.signOut();
        }
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
 * @param {object} studentData 
 * @returns {Promise<object>}
 */
async function registerStudent(studentData) {
    // Ensure Firebase is initialized
    if (typeof initializeFirebaseApp === 'function') {
        await initializeFirebaseApp();
    }

    if (!auth || !db) {
        throw new Error('Firebase no está disponible.');
    }

    // Validate CURP format (basic)
    if (studentData.curp && !/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(studentData.curp)) {
        throw new Error('Formato de CURP inválido');
    }

    // Save current user to restore after creating student
    const currentAuthUser = auth.currentUser;

    try {
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(
            studentData.email,
            studentData.password
        );

        const userId = userCredential.user.uid;

        // Create document in Firestore
        const userData = {
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
            fechaRegistro: firebase.firestore.FieldValue.serverTimestamp(),
            creadoPor: currentAuthUser ? currentAuthUser.uid : null
        };

        await db.collection('usuarios').doc(userId).set(userData);

        // Sign out the newly created user
        await auth.signOut();

        // Re-authenticate the teacher if they were logged in
        if (currentAuthUser) {
            // The teacher needs to log in again - we'll handle this in the UI
            // For now, restore from session
            const storedUser = sessionStorage.getItem('iafe_user');
            if (storedUser) {
                currentUserData = JSON.parse(storedUser);
            }
        }

        console.info('✅ Estudiante registrado:', userId);
        return { id: userId, ...userData };
    } catch (error) {
        console.error('Error al registrar estudiante:', error);

        // Translate Firebase error messages
        let message = error.message;
        if (error.code === 'auth/email-already-in-use') {
            message = 'Ya existe una cuenta con este correo electrónico.';
        } else if (error.code === 'auth/weak-password') {
            message = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (error.code === 'auth/invalid-email') {
            message = 'El correo electrónico no es válido.';
        }

        throw new Error(message);
    }
}

/**
 * Create initial teacher account (admin function)
 * This should be called only once to create the first teacher
 */
async function createInitialTeacher(teacherData) {
    if (!auth || !db) {
        throw new Error('Firebase no está disponible.');
    }

    try {
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(
            teacherData.email,
            teacherData.password
        );

        const userId = userCredential.user.uid;

        // Create document in Firestore
        const userData = {
            nombre: teacherData.nombre,
            apellidos: teacherData.apellidos,
            email: teacherData.email,
            tipo: 'docente',
            activo: true,
            fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('usuarios').doc(userId).set(userData);

        console.info('✅ Docente creado:', userId);
        return { id: userId, ...userData };
    } catch (error) {
        console.error('Error al crear docente:', error);
        throw error;
    }
}

/**
 * Protect dashboard page - redirect if not authenticated
 * @param {string} requiredType - 'estudiante', 'docente', or null for any
 */
function protectRoute(requiredType = null) {
    const user = checkAuthState();

    if (!user) {
        // Redirect to appropriate login page
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
        // Redirect to correct dashboard
        if (userType === 'estudiante') {
            window.location.href = 'estudiante.html';
        } else if (userType === 'docente') {
            window.location.href = 'docente.html';
        }
        return false;
    }

    return true;
}

/**
 * Get current user data
 * @returns {object|null}
 */
function getCurrentUser() {
    if (!currentUserData) {
        checkAuthState();
    }
    return currentUserData;
}

/**
 * Get user initials for avatar
 * @param {object} user 
 * @returns {string}
 */
function getUserInitials(user) {
    if (!user) return '?';
    const nombre = user.nombre || '';
    const apellidos = user.apellidos || '';
    return (nombre.charAt(0) + apellidos.charAt(0)).toUpperCase();
}

/**
 * Get user full name
 * @param {object} user 
 * @returns {string}
 */
function getUserFullName(user) {
    if (!user) return 'Usuario';
    return `${user.nombre || ''} ${user.apellidos || ''}`.trim() || 'Usuario';
}

/**
 * Format date for display
 * @param {string|Date|object} dateInput 
 * @returns {string}
 */
function formatDate(dateInput) {
    let date;

    if (!dateInput) return '-';

    // Handle Firestore Timestamp
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

/**
 * Format relative date
 * @param {string|Date|object} dateInput 
 * @returns {string}
 */
function formatRelativeDate(dateInput) {
    let date;

    if (!dateInput) return '-';

    // Handle Firestore Timestamp
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

/**
 * Generate a random password
 * @param {number} length 
 * @returns {string}
 */
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
