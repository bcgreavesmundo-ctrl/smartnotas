import { supabase } from './supabaseClient';

// 1. Inicialización de Supabase y verificación de conexión
export const initDatabase = async () => {
  try {
    const { data, error } = await supabase.from('usuarios').select('id').limit(1);
    if (error) {
      console.error('Error al conectar con Supabase:', error.message);
      return false;
    }
    console.log('Conexión con Supabase establecida correctamente.');
    return true;
  } catch (e) {
    console.error('Excepción en conexión Supabase:', e);
    return false;
  }
};

// 2. Consulta de usuario por Email (Para Login sin arrojar TypeError por no encontrar registros)
// Obtener usuario por Email usando ilike para evitar fallos de coincidencia
export const obtenerUsuarioPorEmailBD = async (email) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.warn('Error en consulta de usuario:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error('Error en obtenerUsuarioPorEmailBD:', e);
    return null;
  }
};
// 3. Registrar un usuario (Para Coordinador)
// Registrar un usuario en Supabase
export const registrarUsuarioBD = async (usuario) => {
  try {
    const cleanEmail = usuario.email.trim().toLowerCase();
    
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: usuario.nombre,
          documento: usuario.documento,
          email: cleanEmail,
          password: usuario.password,
          rol: usuario.rol,
          carrera: usuario.carrera || null,
          semestre: usuario.semestre || null,
          estado: usuario.estado || 'Activo',
        },
      ])
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  } catch (e) {
    console.error('Error en registrarUsuarioBD:', e.message);
    throw e;
  }
};

// 4. Obtener todos los usuarios (Para Coordinador)
export const obtenerTodosUsuariosBD = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error en obtenerTodosUsuariosBD:', e.message);
    return [];
  }
};

// 5. Obtener asignaturas creadas
export const obtenerAsignaturasBD = async () => {
  try {
    const { data, error } = await supabase
      .from('asignaturas')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error en obtenerAsignaturasBD:', e.message);
    return [];
  }
};

// 6. Obtener notas de un estudiante
export const obtenerNotasEstudianteBD = async (estudianteId) => {
  try {
    const { data, error } = await supabase
      .from('calificaciones')
      .select(`
        *,
        asignaturas (
          nombre,
          codigo,
          creditos
        )
      `)
      .eq('estudiante_id', estudianteId);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error en obtenerNotasEstudianteBD:', e.message);
    return [];
  }
};

// 7. Actualizar o guardar notas (Para Profesor)
export const guardarOActualizarNotaBD = async (notaData) => {
  try {
    const { data, error } = await supabase
      .from('calificaciones')
      .upsert(
        [
          {
            estudiante_id: notaData.estudiante_id,
            asignatura_id: notaData.asignatura_id,
            nota1: parseFloat(notaData.nota1) || 0,
            nota2: parseFloat(notaData.nota2) || 0,
            nota3: parseFloat(notaData.nota3) || 0,
          },
        ],
        { onConflict: 'estudiante_id, asignatura_id' }
      )
      .select();

    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Error en guardarOActualizarNotaBD:', e.message);
    throw e;
  }
};