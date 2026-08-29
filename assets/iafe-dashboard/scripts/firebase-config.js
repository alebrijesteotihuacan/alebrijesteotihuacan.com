/**
 * IAFE Dashboard - Supabase Configuration
 * Instituto Azteca de Formación Empresarial
 * ==========================================
 * Cliente Supabase para sistema escolar.
 */

// Cliente Supabase (cargado como módulo ES)
import { supabase } from './supabase-client.js';

// Estado de configuración
let supabaseReady = false;

// Inicialización (compatible con la API anterior basada en Firebase)
async function initializeFirebaseApp() {
    if (supabaseReady) return true;
    try {
        if (typeof supabase === 'undefined') {
            console.error('Supabase SDK no está cargado');
            return false;
        }
        supabaseReady = true;
        console.info('✅ Supabase inicializado correctamente (IAFE)');

        window.supabase = supabase;
        window.supabaseConfigured = true;
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Supabase:', error);
        return false;
    }
}

// ==========================================
// FUNCIONES DE BASE DE DATOS
// ==========================================

async function getUserById(userId) {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (error) throw error;
        return data ? { id: data.id, ...data } : null;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

async function getUserByEmail(email) {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .limit(1)
            .maybeSingle();
        if (error) throw error;
        return data ? { id: data.id, ...data } : null;
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        return null;
    }
}

async function getAllStudents() {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('usuarios')
            .select('*')
            .eq('tipo', 'estudiante')
            .order('fechaRegistro', { ascending: false });
        if (error) throw error;
        return (data || []).map(row => ({ id: row.id, ...row }));
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        return [];
    }
}

async function createStudent(studentData) {
    try {
        // Crear usuario en Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: studentData.email,
            password: studentData.password
        });
        if (signUpError) throw signUpError;
        const userId = signUpData.user?.id;
        if (!userId) throw new Error('No se obtuvo el ID del nuevo estudiante');

        // Crear fila en iafe.usuarios
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
            fechaRegistro: new Date().toISOString()
        };

        const { error: insertErr } = await supabase
            .schema('iafe')
            .from('usuarios')
            .insert(userRow);
        if (insertErr) throw insertErr;

        console.info('✅ Estudiante creado:', userId);
        return { id: userId, ...userRow };
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        throw error;
    }
}

async function updateStudent(studentId, data) {
    try {
        const { error } = await supabase
            .schema('iafe')
            .from('usuarios')
            .update(data)
            .eq('id', studentId);
        if (error) throw error;
        console.info('✅ Estudiante actualizado:', studentId);
        return true;
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        throw error;
    }
}

async function deleteStudent(studentId) {
    try {
        const { error } = await supabase
            .schema('iafe')
            .from('usuarios')
            .update({ activo: false })
            .eq('id', studentId);
        if (error) throw error;
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

async function getAllGroups() {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('grupos')
            .select('*')
            .order('nombre', { ascending: true });
        if (error) throw error;
        return (data || []).map(row => ({ id: row.id, ...row }));
    } catch (error) {
        console.error('Error al obtener grupos:', error);
        return [];
    }
}

async function createGroup(groupData) {
    try {
        const row = {
            nombre: groupData.nombre,
            nivelAcademico: groupData.nivelAcademico,
            docenteId: groupData.docenteId || null,
            fechaCreacion: new Date().toISOString()
        };
        const { data, error } = await supabase
            .schema('iafe')
            .from('grupos')
            .insert(row)
            .select()
            .single();
        if (error) throw error;
        console.info('✅ Grupo creado:', data.id);
        return { id: data.id, ...row };
    } catch (error) {
        console.error('Error al crear grupo:', error);
        throw error;
    }
}

async function countStudentsInGroup(grupoId) {
    try {
        const { count, error } = await supabase
            .schema('iafe')
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('tipo', 'estudiante')
            .eq('grupoId', grupoId)
            .eq('activo', true);
        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Error al contar estudiantes:', error);
        return 0;
    }
}

// ==========================================
// FUNCIONES DE TAREAS
// ==========================================

async function getAllTasks() {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('tareas')
            .select('*')
            .order('fechaLimite', { ascending: false });
        if (error) throw error;
        return (data || []).map(row => ({ id: row.id, ...row }));
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return [];
    }
}

async function getTasksByGroup(grupoId) {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('tareas')
            .select('*')
            .eq('grupoId', grupoId)
            .order('fechaLimite', { ascending: false });
        if (error) throw error;
        return (data || []).map(row => ({ id: row.id, ...row }));
    } catch (error) {
        console.error('Error al obtener tareas por grupo:', error);
        return [];
    }
}

async function createTask(taskData) {
    try {
        const row = {
            titulo: taskData.titulo,
            descripcion: taskData.descripcion || '',
            grupoId: taskData.grupoId,
            docenteId: taskData.docenteId,
            fechaLimite: taskData.fechaLimite,
            fechaCreacion: new Date().toISOString()
        };
        const { data, error } = await supabase
            .schema('iafe')
            .from('tareas')
            .insert(row)
            .select()
            .single();
        if (error) throw error;
        console.info('✅ Tarea creada:', data.id);
        return { id: data.id, ...row };
    } catch (error) {
        console.error('Error al crear tarea:', error);
        throw error;
    }
}

// ==========================================
// FUNCIONES DE CALIFICACIONES
// ==========================================

async function getStudentGrades(studentId) {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('calificaciones')
            .select('*')
            .eq('estudianteId', studentId);
        if (error) throw error;
        return (data || []).map(row => ({ id: row.id, ...row }));
    } catch (error) {
        console.error('Error al obtener calificaciones:', error);
        return [];
    }
}

async function saveGrade(gradeData) {
    try {
        if (gradeData.id) {
            const { id, ...rest } = gradeData;
            const { error } = await supabase
                .schema('iafe')
                .from('calificaciones')
                .update(rest)
                .eq('id', id);
            if (error) throw error;
            return { ...gradeData };
        } else {
            const { data, error } = await supabase
                .schema('iafe')
                .from('calificaciones')
                .insert(gradeData)
                .select()
                .single();
            if (error) throw error;
            return { id: data.id, ...data };
        }
    } catch (error) {
        console.error('Error al guardar calificación:', error);
        throw error;
    }
}

// ==========================================
// FUNCIONES DE MENSAJES (CHAT)
// ==========================================

async function getGroupMessages(grupoId, limit = 50) {
    try {
        const { data, error } = await supabase
            .schema('iafe')
            .from('mensajes')
            .select('*')
            .eq('grupoId', grupoId)
            .eq('esPrivado', false)
            .order('timestamp', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return (data || []).map(row => ({ id: row.id, ...row })).reverse();
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        return [];
    }
}

async function sendMessage(messageData) {
    try {
        const row = {
            grupoId: messageData.grupoId,
            usuarioId: messageData.usuarioId,
            nombreUsuario: messageData.nombreUsuario,
            texto: messageData.texto,
            esPrivado: messageData.esPrivado || false,
            destinatarioId: messageData.destinatarioId || null,
            timestamp: new Date().toISOString()
        };
        const { data, error } = await supabase
            .schema('iafe')
            .from('mensajes')
            .insert(row)
            .select()
            .single();
        if (error) throw error;
        return { id: data.id, ...row };
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        throw error;
    }
}

function subscribeToMessages(grupoId, callback) {
    // Suscripción en tiempo real vía Supabase Realtime
    const channel = supabase
        .channel(`iafe-mensajes-${grupoId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'iafe',
            table: 'mensajes',
            filter: `grupoId=eq.${grupoId}`
        }, payload => {
            const msg = { id: payload.new.id, ...payload.new };
            callback([msg]);
        })
        .subscribe();
    return () => supabase.removeChannel(channel);
}

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

window.initializeFirebaseApp = initializeFirebaseApp;

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
