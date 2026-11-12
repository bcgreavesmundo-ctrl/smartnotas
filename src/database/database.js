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

// --- FUNCIONES CRUD PARA COORDINADOR ---

// Registrar un nuevo profesor (crea usuario con rol Profesor)
export const registrarProfesorBD = async (profesor) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        nombre: profesor.nombre,
        email: profesor.email.trim().toLowerCase(),
        password: profesor.password || '123456',
        rol: 'Profesor',
        documento: profesor.documento || '',
        estado: 'Activo'
      }])
      .select();
    if (error) throw error;
    return data ? data[0] : null;
  } catch (e) {
    console.error('Error en registrarProfesorBD:', e.message);
    throw e;
  }
};

// Obtener solo usuarios con rol Profesor
export const obtenerProfesoresBD = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', 'Profesor');
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error en obtenerProfesoresBD:', e.message);
    return [];
  }
};

// Crear una nueva Asignatura
export const crearAsignaturaBD = async (asignatura) => {
  try {
    const { data, error } = await supabase
      .from('asignaturas')
      .insert([{
        nombre: asignatura.nombre,
        codigo: asignatura.codigo,
        creditos: parseInt(asignatura.creditos) || 3,
        profesor_id: asignatura.profesor_id || null
      }])
      .select();
    if (error) throw error;
    return data ? data[0] : null;
  } catch (e) {
    console.error('Error en crearAsignaturaBD:', e.message);
    throw e;
  }
};

// Eliminar un registro genérico (usuarios o asignaturas)
export const eliminarRegistroBD = async (tabla, id) => {
  try {
    const { error } = await supabase.from(tabla).delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(`Error al eliminar de ${tabla}:`, e.message);
    throw e;
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

// 6. Obtener notas de un estudiante relacionando Asignatura y Profesor
export const obtenerNotasEstudianteBD = async (estudianteId) => {
  try {
    if (!estudianteId) return [];

    const { data, error } = await supabase
      .from('calificaciones')
      .select(`
        *,
        asignaturas (
          id,
          nombre,
          codigo,
          creditos,
          usuarios (
            nombre
          )
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

// 8. Obtener estudiantes inscritos por asignatura
export const obtenerEstudiantesPorAsignaturaBD = async (asignaturaId) => {
  try {
    const { data, error } = await supabase
      .from('calificaciones')
      .select(`
        estudiante_id,
        nota1,
        nota2,
        nota3,
        usuarios (
          nombre,
          documento,
          email
        )
      `)
      .eq('asignatura_id', asignaturaId);

    if (error) throw error;

    // Aplanar los datos para conservar la estructura que espera la interfaz
    return (data || []).map((item) => ({
      estudiante_id: item.estudiante_id,
      nota1: item.nota1,
      nota2: item.nota2,
      nota3: item.nota3,
      nombre: item.usuarios?.nombre || 'Estudiante',
      documento: item.usuarios?.documento || item.usuarios?.email || '',
    }));
  } catch (e) {
    console.error('Error en obtenerEstudiantesPorAsignaturaBD:', e.message);
    return [];
  }
};

// Obtener únicamente las asignaturas asignadas a un profesor específico
export const obtenerAsignaturasProfesorBD = async (profesorId) => {
  try {
    if (!profesorId) return [];

    const { data, error } = await supabase
      .from('asignaturas')
      .select('*')
      .eq('profesor_id', profesorId);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error en obtenerAsignaturasProfesorBD:', e.message);
    return [];
  }
};