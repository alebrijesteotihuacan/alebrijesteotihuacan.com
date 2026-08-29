
// Visorias — Cliente Supabase
import { supabase } from './supabase-client.js';

console.log('✅ Supabase inicializado correctamente (visorias)');

// Expose function to window object so it can be used by non-module scripts
window.guardarRegistroFirebase = async function (registro) {
    try {
        console.log('📝 Intentando guardar registro en Supabase...', registro.folio);

        // IMPORTANTE: Siempre excluimos la foto para evitar el límite 1MB de filas
        // La foto se mantiene en el PDF pero no se guarda en la base de datos
        const { foto, ...dataSinFoto } = registro;

        const dataToSave = {
            ...dataSinFoto,
            fotoGuardada: false,
            timestamp_creacion: new Date().toISOString()
        };

        const { data, error } = await supabase
            .schema('webvisorias')
            .from('registros')
            .insert(dataToSave)
            .select()
            .single();

        if (error) throw error;
        console.log('✅ Documento escrito en Supabase con ID:', data.id);
        return data.id;
    } catch (e) {
        console.error('❌ Error añadiendo documento a Supabase:', e);
        throw e;
    }
};
