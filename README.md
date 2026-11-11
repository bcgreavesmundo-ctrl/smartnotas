# 📱 SmartNotas — Sistema de Gestión Académica Móvil

> **Proyecto Académico / MVP**  
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
* **Control de Versiones:** Git & GitHub

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

## ⚙️ Guía de Instalación y Ejecución Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local.

### 📋 Prerrequisitos
- [Node.js](https://nodejs.org/) (v18 o superior).
- **Expo CLI (Última versión):** Se recomienda utilizar siempre la versión más reciente del ecosistema Expo ejecutando los comandos con `npx` (o instalándola globalmente mediante `npm install -g expo-cli`).
- **Expo Go App (Última versión en el móvil):** Aplicación móvil **Expo Go** instalada en tu dispositivo (Android/iOS). *Por defecto, la versión que descargas directamente desde la Play Store o App Store siempre corresponde a la última versión estable requerida.*
- [Git](https://git-scm.com/) instalado en el sistema.
- Una cuenta y proyecto activo en [Supabase](https://supabase.com/).

---

### 📥 Pasos para la instalación:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/bcgreavesmundo-ctrl/smartnotas.git
   cd smartnotas
   ```

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo llamado `.env` en la raíz del proyecto y agrega las credenciales de tu proyecto de Supabase:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_publishable_key_aqui
   ```
   *(Obtén la URL y la Publishable Key en el panel de Supabase $\rightarrow$ **Project Settings** $\rightarrow$ **API Keys**).*

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start --clear
   ```

5. **Probar la aplicación:**
   Escanea el código QR generado en la terminal utilizando la aplicación **Expo Go** actualizada en tu dispositivo móvil.

---

## ✒️ Licencia & Autoría
Proyecto desarrollado como MVP para la materia Desarrollo de Aplicaciones Moviles. UNICIENCIA 