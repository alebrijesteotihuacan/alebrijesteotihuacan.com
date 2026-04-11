/**
 * IAFE Dashboard - Firebase Configuration
 * Instituto Azteca de Formación Empresarial
 * ==========================================
 * Configuración real de Firebase para sistema escolar
 */

// Configuración de Firebase (Credenciales reales)
const firebaseConfig = {
    apiKey: "AIzaSyDIPkpCrWwR5y90v2vrDS7bEf1uGFJ25Y0",
    authDomain: "sistemainstitutoazteca.firebaseapp.com",
    projectId: "sistemainstitutoazteca",
    storageBucket: "sistemainstitutoazteca.firebasestorage.app",
    messagingSenderId: "725086607986",
    appId: "1:725086607986:web:9d4b940b70bd1da02900eb"
};

// Variables globales para Firebase
let app = null;
let auth = null;
let db = null;
let firebaseConfigured = false;

// Función para inicializar Firebase (se llama después de cargar los scripts de Firebase)
async function initializeFirebaseApp() {
    if (firebaseConfigured) return true;

    try {
        // Verificar que Firebase está cargado
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK no está cargado');
            return false;
        }

        // Inicializar app si no existe
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.apps[0];
        }

        // Obtener servicios
        auth = firebase.auth();
        db = firebase.firestore();

        // Configurar persistencia offline para Firestore
        try {
            await db.enablePersistence({ synchronizeTabs: true });
        } catch (err) {
            if (err.code === 'failed-precondition') {
                console.warn('Firestore persistence failed: Multiple tabs open');
            } else if (err.code === 'unimplemented') {
                console.warn('Firestore persistence not supported by browser');
            }
        }

        firebaseConfigured = true;
        console.info('✅ Firebase inicializado correctamente');

        // Exportar a window
        window.app = app;
        window.auth = auth;
        window.db = db;
        window.firebaseConfigured = true;

        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error);
        return false;
    }
}

// ==========================================
// FUNCIONES DE BASE DE DATOS
// ==========================================

/**
 * Obtener usuario por ID
 */
async function getUserById(userId) {
    if (!db) return null;
    try {
        const doc = await db.collection('usuarios').doc(userId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

/**
 * Obtener usuario por email
 */
async function getUserByEmail(email) {
    if (!db) return null;
    try {
        const snapshot = await db.collection('usuarios')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        return null;
    }
}

/**
 * Obtener todos los estudiantes
 */
async function getAllStudents() {
    if (!db) return [];
    try {
        const snapshot = await db.collection('usuarios')
            .where('tipo', '==', 'estudiante')
            .orderBy('fechaRegistro', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        return [];
    }
}

/**
 * Crear nuevo estudiante
 */
async function createStudent(studentData) {
    if (!auth || !db) throw new Error('Firebase no está inicializado');

    try {
        // Crear usuario en Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(
            studentData.email,
            studentData.password
        );

        const userId = userCredential.user.uid;

        // Crear documento en Firestore
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
            fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('usuarios').doc(userId).set(userData);

        console.info('✅ Estudiante creado:', userId);
        return { id: userId, ...userData };
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        throw error;
    }
}

/**
 * Actualizar estudiante
 */
async function updateStudent(studentId, data) {
    if (!db) throw new Error('Firebase no está inicializado');

    try {
        await db.collection('usuarios').doc(studentId).update(data);
        console.info('✅ Estudiante actualizado:', studentId);
        return true;
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        throw error;
    }
}

/**
 * Eliminar estudiante
 */
async function deleteStudent(studentId) {
    if (!db) throw new Error('Firebase no está inicializado');

    try {
        // Marcar como inactivo en lugar de eliminar
        await db.collection('usuarios').doc(studentId).update({ activo: false });
        console.info('✅ Estudiante desactivado:', studentId);
        return true;
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        throw error;
    }
}

// ==========================================
// FUNCIONES DE GRUPOS
// ==========================================

/**
 * Obtener todos los grupos
 */
async function getAllGroups() {
    if (!db) return [];
    try {
        const snapshot = await db.collection('grupos')
            .orderBy('nombre')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener grupos:', error);
        return [];
    }
}

/**
 * Crear nuevo grupo
 */
async function createGroup(groupData) {
    if (!db) throw new Error('Firebase no está inicializado');

    try {
        const data = {
            nombre: groupData.nombre,
            nivelAcademico: groupData.nivelAcademico,
            docenteId: groupData.docenteId || null,
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('grupos').add(data);
        console.info('✅ Grupo creado:', docRef.id);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Error al crear grupo:', error);
        throw error;
    }
}

/**
 * Contar alumnos en un grupo
 */
async function countStudentsInGroup(grupoId) {
    if (!db) return 0;
    try {
        const snapshot = await db.collection('usuarios')
            .where('tipo', '==', 'estudiante')
            .where('grupoId', '==', grupoId)
            .where('activo', '==', true)
            .get();

        return snapshot.size;
    } catch (error) {
        console.error('Error al contar estudiantes:', error);
        return 0;
    }
}

// ==========================================
// FUNCIONES DE TAREAS
// ==========================================

/**
 * Obtener todas las tareas
 */
async function getAllTasks() {
    if (!db) return [];
    try {
        const snapshot = await db.collection('tareas')
            .orderBy('fechaLimite', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return [];
    }
}

/**
 * Obtener tareas por grupo
 */
async function getTasksByGroup(grupoId) {
    if (!db) return [];
    try {
        const snapshot = await db.collection('tareas')
            .where('grupoId', '==', grupoId)
            .orderBy('fechaLimite', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener tareas por grupo:', error);
        return [];
    }
}

/**
 * Crear nueva tarea
 */
async function createTask(taskData) {
    if (!db) throw new Error('Firebase no está inicializado');

    try {
        const data = {
            titulo: taskData.titulo,
            descripcion: taskData.descripcion || '',
            grupoId: taskData.grupoId,
            docenteId: taskData.docenteId,
            fechaLimite: taskData.fechaLimite,
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('tareas').add(data);
        console.info('✅ Tarea creada:', docRef.id);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Error al crear tarea:', error);
        throw error;
    }
}

// ==========================================
// FUNCIONES DE CALIFICACIONES
// ==========================================

/**
 * Obtener calificaciones de un estudiante
 */
async function getStudentGrades(studentId) {
    if (!db) return null;
    try {
        const snapshot = await db.collection('calificaciones')
            .where('estudianteId', '==', studentId)
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener calificaciones:', error);
        return [];
    }
}

/**
 * Guardar/actualizar calificación
 */
async function saveGrade(gradeData) {
    if (!db) throw new Error('Firebase no está inicializado');

    try {
        if (gradeData.id) {
            // Actualizar existente
            await db.collection('calificaciones').doc(gradeData.id).update(gradeData);
            return { ...gradeData };
        } else {
            // Crear nueva
            const docRef = await db.collection('calificaciones').add(gradeData);
            return { id: docRef.id, ...gradeData };
        }
    } catch (error) {
        console.error('Error al guardar calificación:', error);
        throw error;
    }
}

// ==========================================
// FUNCIONES DE MENSAJES (CHAT)
// ==========================================

/**
 * Obtener mensajes de un grupo
 */
async function getGroupMessages(grupoId, limit = 50) {
    if (!db) return [];
    try {
        const snapshot = await db.collection('mensajes')
            .where('grupoId', '==', grupoId)
            .where('esPrivado', '==', false)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        return [];
    }
}

/**
 * Enviar mensaje
 */
async function sendMessage(messageData) {
    if (!db) throw new Error('Firebase no está inicializado');

    try {
        const data = {
            grupoId: messageData.grupoId,
            usuarioId: messageData.usuarioId,
            nombreUsuario: messageData.nombreUsuario,
            texto: messageData.texto,
            esPrivado: messageData.esPrivado || false,
            destinatarioId: messageData.destinatarioId || null,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('mensajes').add(data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        throw error;
    }
}

/**
 * Escuchar mensajes en tiempo real
 */
function subscribeToMessages(grupoId, callback) {
    if (!db) return () => { };

    return db.collection('mensajes')
        .where('grupoId', '==', grupoId)
        .where('esPrivado', '==', false)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .onSnapshot(snapshot => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
            callback(messages);
        }, error => {
            console.error('Error en suscripción de mensajes:', error);
        });
}

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

window.initializeFirebaseApp = initializeFirebaseApp;
window.firebaseConfig = firebaseConfig;

// Funciones de usuarios
window.getUserById = getUserById;
window.getUserByEmail = getUserByEmail;
window.getAllStudents = getAllStudents;
window.createStudent = createStudent;
window.updateStudent = updateStudent;
window.deleteStudent = deleteStudent;

// Funciones de grupos
window.getAllGroups = getAllGroups;
window.createGroup = createGroup;
window.countStudentsInGroup = countStudentsInGroup;

// Funciones de tareas
window.getAllTasks = getAllTasks;
window.getTasksByGroup = getTasksByGroup;
window.createTask = createTask;

// Funciones de calificaciones
window.getStudentGrades = getStudentGrades;
window.saveGrade = saveGrade;

// Funciones de mensajes
window.getGroupMessages = getGroupMessages;
window.sendMessage = sendMessage;
window.subscribeToMessages = subscribeToMessages;
