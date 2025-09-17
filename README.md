# 📚 Módulo de Registro de Calificaciones

Este proyecto permite gestionar **períodos, cursos y calificaciones de estudiantes** de forma sencilla.  
Incluye un backend desarrollado en **NestJS** con conexión a **Supabase** como base de datos, y un frontend desarrollado en **React** que facilita la captura y consulta de notas.

---

## 🚀 Funciones principales

- Gestión de períodos académicos y cursos asociadas.  
- Registro de calificaciones por estudiante y por corte.  
- Validación de rangos de notas (0.0 – 5.0).  
- Cálculo automático de definitivas.  
- Botón de guardado habilitado/deshabilitado según contexto.

Link de prueba del proyecto: https://youtu.be/9gMISGpAwaA

Este proyecto está compuesto por dos partes principales:

- **Backend**: API construida con **NestJS** y **Prisma** para la gestión de cursos, estudiantes y calificaciones.
- **Frontend**: Aplicación en **React** que consume la API y muestra la información al usuario.
- **Base de datos**: Prisma y supabase.

---

## 📦 Requisitos previos

Antes de iniciar, asegúrate de tener instalado en tu máquina:

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (u otra base de datos compatible con Prisma)

---

## Diagrama ER

<img width="990" height="400" alt="image" src="https://github.com/user-attachments/assets/93c4070b-1d1f-4122-a00f-112ccf167d6f" />


## ⚙️ Instrucciones

1. Inicia el Backend:
   ```bash
   cd back
   npm install
   npm start dev

2. Inicia el Frontend:
   ```bash
   cd frontend
   cd registro-de-calificaciones
   npm install
   npm run dev

3. Abre el link que muestra en consola
