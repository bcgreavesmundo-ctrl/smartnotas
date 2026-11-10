# 📱 SmartNotas — Sistema de Gestión Académica Móvil

> **Proyecto Académico / MVP**  
> **Desarrollador:** [Tu Nombre Completo]  
> **Tecnologías:** React Native • Expo • Supabase (PostgreSQL)  

---

## 📄 Descripción General

**SmartNotas** es una aplicación móvil diseñada para centralizar y automatizar el control de calificaciones y la gestión académica universitaria. Permite un flujo transparente entre coordinadores, profesores y estudiantes mediante un sistema de control de acceso basado en roles (RBAC).

---

## 🚀 Tecnologías Utilizadas

* **Frontend:** React Native (Expo SDK)
* **Navegación:** React Navigation (Stack Navigator)
* **Backend como Servicio (BaaS):** Supabase
* **Base de Datos:** PostgreSQL (con Row-Level Security / RLS)
* **Control de Versiones:** Git & GitHub Desktop

---

## 👥 Módulos y Funcionalidades Principales

### 🛠️ 1. Módulo Coordinador
- **Gestión de Usuarios:** Creación y administración de perfiles (Coordinadores, Profesores y Estudiantes).
- **Gestión de Asignaturas:** Alta, edición y eliminación de materias, con asignación de carga docente y créditos académicos.

### 👨‍🏫 2. Módulo Profesor
- **Carga Académica:** Visualización de asignaturas asignadas en el período activo.
- **Gestión de Notas:** Registro y actualización por estudiante organizados en tres cortes evaluativos:
  - **Corte 1:** 30%
  - **Corte 2:** 30%
  - **Corte 3:** 40%

### 🎓 3. Módulo Estudiante
- **Dashboard Académico:** Métricas consolidadas de promedio general acumulado y total de materias inscritas.
- **Historial de Calificaciones:** Consulta detallada de rendimiento individual por asignatura y corte con indicador visual de aprobación ($\ge 3.0$).

---

## 📊 Modelo de Base de Datos (Supabase)

El sistema utiliza tres tablas relacionales optimizadas:

1. **`usuarios`**: `id`, `nombre`, `correo`, `rol` ('Coordinador' | 'Profesor' | 'Estudiante'), `carrera`.
2. **`asignaturas`**: `id`, `nombre`, `codigo`, `creditos`, `profesor_id` (FK $\rightarrow$ `usuarios.id`).
3. **`calificaciones`**: `id`, `estudiante_id` (FK $\rightarrow$ `usuarios.id`), `asignatura_id` (FK $\rightarrow$ `asignaturas.id`), `nota1`, `nota2`, `nota3`.

---

## ⚙️ Configuración e Instalación Local

### Prerrequisitos
- Node.js (v18+)
- Expo Go en dispositivo móvil o emulador Android/iOS
- Cuenta en Supabase

### Pasos para ejecutar:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/bcgreavesmundo-ctrl/smartnotas.git](https://github.com/bcgreavesmundo-ctrl/smartnotas.git)
   cd smartnotas
