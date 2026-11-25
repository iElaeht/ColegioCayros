# 🏫 Sistema Web Institucional y Panel Administrativo — Colegio Cayros

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

Plataforma web institucional y sistema de gestión administrativa (`syspanel`) desarrollado para el **Colegio Cayros** (`colegiocayros.edu.pe`). El proyecto centraliza la presencia digital de la institución, la captación y seguimiento de matrículas en línea, la validación de pagos institucionales mediante comprobantes y la administración dinámica de contenidos multimedia.

---

## 📋 Tabla de Contenidos

1. [Objetivo del Proyecto](#-objetivo-del-proyecto)
2. [Stack Tecnológico y Arquitectura](#-stack-tecnológico-y-arquitectura)
3. [Funcionalidades y Módulos](#-funcionalidades-y-módulos)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Requisitos Previos](#-requisitos-previos)
6. [Instalación y Configuración Local](#-instalación-y-configuración-local)
7. [Variables de Entorno](#-variables-de-entorno)
8. [Base de Datos y Prisma](#-base-de-datos-y-prisma)
9. [Despliegue en Render](#-despliegue-en-render)
10. [Notas para Revisores y Colaboradores](#-notas-para-revisores-y-colaboradores)

---

## 🎯 Objetivo del Proyecto

Digitalizar y optimizar los procesos operativos y de comunicación del **Colegio Cayros** mediante una aplicación web integral dividida en dos entornos principales:
* **Portal Público Institucional:** Espacio informativo y transaccional orientado a padres de familia y postulantes para conocer la propuesta educativa, iniciar procesos de matrícula y registrar/consultar pagos.
* **Panel Administrativo (`/syspanel`):** Herramienta interna protegida para que el personal administrativo valide comprobantes de pago, gestione solicitudes de matrícula, atienda mensajes de contacto, administre el contenido visual del portal y exporte reportes.

---

## 🛠 Stack Tecnológico y Arquitectura

El sistema está construido bajo un stack unificado en **TypeScript**, separando el servidor API (`backend`) de la aplicación cliente (`frontend`):

| Capa | Tecnología | Descripción / Responsabilidad |
| :--- | :--- | :--- |
| **Lenguaje** | **TypeScript** | Tipado estático de extremo a extremo entre cliente, servidor y base de datos. |
| **Frontend** | **Next.js + React** | Renderizado de páginas públicas, enrutamiento dinámico y construcción del panel administrativo (`/syspanel`). |
| **Estilos & UI** | **Tailwind CSS + CSS** | Diseño responsivo, componentes modales, tablas interactivas, filtros avanzados y notificaciones. |
| **Backend / API** | **Node.js + Express** | API REST modular para gestión CRUD, subida y limpieza atómica de archivos (`multer`) y autenticación administrativa. |
| **Base de Datos** | **PostgreSQL** | Motor de base de datos relacional (`colegiocayros`) para almacenamiento persistente. |
| **ORM** | **Prisma** | Modelado de esquemas (`schema.prisma`), migraciones, semillas (`seed.ts`) y consultas tipadas hacia PostgreSQL. |
| **Exportación / Datos**| **XLSX & PapaParse** | Generación e importación de reportes administrativos en formatos Excel (`.xlsx`) y `.csv`. |
| **Infraestructura** | **Render** | Alojamiento en la nube de los servicios web y conexión con la base de datos en producción/staging. |

---

## ✨ Funcionalidades y Módulos

### 🌐 1. Portal Público
* **Inicio (`/`):** Carrusel principal (*Hero*) dinámico, accesos rápidos y cartel informativo de matrícula.
* **Información Institucional:** Secciones dedicadas a *Nosotros*, oferta académica (nivel *Inicial*), ubicación de *Sedes* y *Boletín* informativo.
* **Multimedia y Comunidad:** Módulos dinámicos de *Galería* fotográfica, *Videos* institucionales y agenda de *Eventos*.
* **Matrícula en Línea (`/matricula`):** Formulario guiado por pasos (multi-step) para el registro de datos del estudiante y apoderado, con generación automática de código y clave de pago.
* **Pagos Institucionales (`/pagos-institucional`):** Carga de comprobantes/vouchers de pago y consulta en tiempo real del estado de verificación del trámite.
* **Contáctanos (`/contactanos`):** Formulario de consultas conectado directamente a la bandeja de entrada del panel administrativo.

### 🔐 2. Panel de Administración (`/syspanel`)
* **Autenticación y Seguridad:** Acceso restringido mediante usuario y contraseña administrativa (validados con `bcrypt`) y usuario inicial configurable por variables de entorno.
* **Dashboard General:** Resumen ejecutivo con indicadores rápidos de matrículas, pagos pendientes y mensajes recientes.
* **Gestión de Matrículas:** Listado completo de postulantes con búsqueda, filtros por estado/fecha y visualización detallada.
* **Revisión de Pagos y Vouchers:** Modal de inspección de comprobantes adjuntos con flujo de aprobación o rechazo (ventana de 48h para reintento) y actualización de estado.
* **Bandeja de Mensajes:** Gestión de consultas recibidas desde la web con herramientas de filtrado, ordenamiento y eliminación masiva.
* **Gestor de Contenidos (CMS):** Administración CRUD de imágenes del *Hero*, *Cartel de Matrícula*, *Eventos*, *Galería* y *Videos*, con sincronización y limpieza de archivos huérfanos en disco.
* **Herramientas de Datos:** Exportación e importación de registros en **Excel (`.xlsx`)** y **CSV (`.csv`)**, además de eliminación individual o masiva con confirmación.

---

## 📁 Estructura del Proyecto

```text
ColegioCayros/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Historial de migraciones de PostgreSQL
│   │   ├── seeders/             # Semillas iniciales (usuario.seeder.ts)
│   │   ├── schema.prisma        # Modelos de datos y configuración de Prisma
│   │   └── seed.ts              # Script principal de siembra (admin por defecto)
│   ├── routes/                  # Endpoints REST (auth, eventos, galeria, hero, matricula, pagos, videos, mensajes)
│   ├── uploads/                 # Almacenamiento local de imágenes, videos y comprobantes
│   ├── .env                     # Variables de entorno del servidor API
│   ├── db.ts                    # Instancia del cliente Prisma
│   └── package.json             # Dependencias y scripts del backend
├── frontend/
│   ├── public/                  # Recursos estáticos, logos e imágenes institucionales
│   ├── src/
│   │   ├── app/                 # Rutas públicas y vistas protegidas de /syspanel
│   │   ├── components/          # Componentes reutilizables (Modales, Tablas, Filtros, Navbar, Footer)
│   │   └── lib/                 # Servicios API, utilidades de exportación (XLSX/CSV) y helpers
│   ├── .env.local               # Variables de entorno del cliente Next.js
│   └── package.json             # Dependencias y scripts del frontend
└── README.md
```

---

## 💻 Requisitos Previos

Antes de ejecutar el proyecto en un entorno local, asegúrate de contar con:
* **Node.js** `v18.17` o superior (recomendado `v20 LTS`).
* **npm**, **yarn** o **pnpm**.
* **PostgreSQL** `v14` o superior ejecutándose localmente o una instancia remota accesible.
* **Git** instalado.

---

## 🚀 Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/<usuario-o-organizacion>/ColegioCayros.git
   cd ColegioCayros
   ```

2. **Configurar e iniciar el Backend:**
   ```bash
   cd backend
   npm install
   ```
   Crea el archivo `backend/.env` (ver sección [Variables de Entorno](#-variables-de-entorno)), luego genera el cliente de Prisma, ejecuta las migraciones, siembra el administrador inicial y levanta el servidor:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```
   El servidor API quedará disponible en `http://localhost:4000`.

3. **Configurar e iniciar el Frontend (en otra terminal):**
   ```bash
   cd frontend
   npm install
   ```
   Crea el archivo `frontend/.env.local` apuntando a la URL del backend y levanta Next.js:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   * Portal público: `http://localhost:3000`
   * Panel administrativo: `http://localhost:3000/syspanel`

---

## 🔑 Variables de Entorno

El proyecto utiliza archivos de entorno separados para el servidor API (`backend`) y la aplicación web (`frontend`).

### 1. Backend (`backend/.env`)

```env
# Conexión a PostgreSQL (Prisma)
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/colegiocayros?schema=public"

# Puerto del servidor Express
PORT=4000

# Credenciales del administrador por defecto (usadas en prisma/seed.ts)
DEFAULT_ADMIN_USER="Admin"
DEFAULT_ADMIN_PASS="Admin"
```

### 2. Frontend (`frontend/.env.local` o `frontend/.env`)

```env
# URL base del backend API
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> **Nota de seguridad:** No subas tus archivos `.env` con credenciales reales o de producción al repositorio. Usa siempre contraseñas robustas en entornos públicos o desplegados.

---

## 🗄 Base de Datos y Prisma

Todos los comandos de Prisma se ejecutan dentro de la carpeta `backend/`:

* **Generar el cliente de Prisma tras modificar `schema.prisma`:**
  ```bash
  npx prisma generate
  ```
* **Crear y aplicar una nueva migración:**
  ```bash
  npx prisma migrate dev --name nombre_del_cambio
  ```
* **Ejecutar el seed manualmente (crear/actualizar el usuario administrador por defecto):**
  ```bash
  npx prisma db seed
  ```
* **Reiniciar la base de datos desde cero (borra datos, reaplica migraciones y ejecuta `seed.ts`):**
  ```bash
  npx prisma migrate reset --force
  ```
* **Abrir Prisma Studio (interfaz visual para inspeccionar registros):**
  ```bash
  npx prisma studio
  ```

---

## ☁️ Despliegue en Render

Al estar dividido en dos aplicaciones (`backend` y `frontend`), en **Render** se despliegan como dos servicios independientes:

### 1. Servicio Backend (Web Service)
* **Root Directory:** `backend`
* **Build Command:**
  ```bash
  npm install && npx prisma generate && npx prisma migrate deploy
  ```
* **Start Command:**
  ```bash
  npm start
  ```
* **Environment Variables:** `DATABASE_URL`, `PORT`, `DEFAULT_ADMIN_USER`, `DEFAULT_ADMIN_PASS`.

### 2. Servicio Frontend (Web Service)
* **Root Directory:** `frontend`
* **Build Command:**
  ```bash
  npm install && npm run build
  ```
* **Start Command:**
  ```bash
  npm start
  ```
* **Environment Variables:** `NEXT_PUBLIC_API_URL` (apuntando a la URL pública del servicio backend en Render).

---

## 📌 Notas para Revisores y Colaboradores

* **Punto de partida recomendado:** Revisar `backend/prisma/schema.prisma` para comprender rápidamente todas las entidades del negocio (matrículas, pagos, mensajes y módulos CMS) antes de explorar las vistas y rutas.
* **Flujo crítico:** Los módulos de `/matricula`, `/pagos-institucional` y su contraparte de aprobación en `/syspanel` representan el núcleo operativo actual del colegio.
* **Gestión de archivos:** Las rutas multimedia (`eventos`, `galeria`, `hero`, `videos`, `matriculaGaleria`) y de pagos eliminan automáticamente los archivos físicos en `backend/uploads/` al actualizar o borrar registros, y disponen de endpoints `/cleanup-orphans` para mantenimiento.

---

Desarrollado inicialmente por **Luis Alessandro Morán Zurita** para el **Colegio Cayros**.