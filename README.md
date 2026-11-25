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

El sistema está construido bajo un stack unificado en **TypeScript**, facilitando el tipado estático de extremo a extremo entre el cliente, el servidor y la base de datos:

| Capa | Tecnología | Descripción / Responsabilidad |
| :--- | :--- | :--- |
| **Lenguaje** | **TypeScript** | Tipado estático en toda la aplicación para modelos de datos, validaciones y lógica de negocio. |
| **Frontend** | **Next.js + React** | Renderizado de páginas públicas, enrutamiento dinámico y construcción del panel administrativo (`/syspanel`). |
| **Estilos & UI** | **Tailwind CSS + CSS** | Diseño responsivo, componentes modales, tablas interactivas, filtros avanzados y notificaciones. |
| **Backend / API** | **Node.js / Next.js API** | Endpoints REST para gestión CRUD, subida de archivos/comprobantes, autenticación y consultas. |
| **Base de Datos** | **PostgreSQL** | Motor de base de datos relacional (`colegio_db`) para almacenamiento persistente. |
| **ORM** | **Prisma** | Modelado de esquemas (`schema.prisma`), migraciones y consultas tipadas hacia PostgreSQL. |
| **Exportación / Datos**| **XLSX & PapaParse** | Generación e importación de reportes administrativos en formatos Excel (`.xlsx`) y `.csv`. |
| **Infraestructura** | **Render** | Alojamiento en la nube de los servicios web y conexión con la base de datos en producción/staging. |

---

## ✨ Funcionalidades y Módulos

### 🌐 1. Portal Público
* **Inicio (`/`):** Carrusel principal (*Hero*) dinámico, accesos rápidos y cartel informativo de matrícula.
* **Información Institucional:** Secciones dedicadas a *Nosotros*, oferta académica (nivel *Inicial*), ubicación de *Sedes* y *Boletín* informativo.
* **Multimedia y Comunidad:** Módulos dinámicos de *Galería* fotográfica, *Videos* institucionales y agenda de *Eventos*.
* **Matrícula en Línea (`/matricula`):** Formulario guiado por pasos (multi-step) para el registro de datos del estudiante y apoderado, con visualización de cuentas bancarias institucionales.
* **Pagos Institucionales (`/pagos-institucional`):** Carga de comprobantes/vouchers de pago y consulta en tiempo real del estado de verificación del trámite.
* **Contáctanos (`/contactanos`):** Formulario de consultas conectado directamente a la bandeja de entrada del panel administrativo.

### 🔐 2. Panel de Administración (`/syspanel`)
* **Autenticación y Seguridad:** Acceso restringido mediante credenciales administrativas y protección de rutas.
* **Dashboard General:** Resumen ejecutivo con indicadores rápidos de matrículas, pagos pendientes y mensajes recientes.
* **Gestión de Matrículas:** Listado completo de postulantes con búsqueda, filtros por estado/fecha y visualización detallada.
* **Revisión de Pagos y Vouchers:** Modal de inspección de comprobantes adjuntos con flujo de aprobación o rechazo y actualización de estado.
* **Bandeja de Mensajes:** Gestión de consultas recibidas desde la web con herramientas de filtrado y ordenamiento.
* **Gestor de Contenidos (CMS):** Administración CRUD de imágenes del *Hero*, *Cartel de Matrícula*, *Eventos*, *Galería* y *Videos*.
* **Herramientas de Datos:** Exportación e importación de registros en **Excel (`.xlsx`)** y **CSV (`.csv`)**, además de eliminación individual o masiva con confirmación.

---

## 📁 Estructura del Proyecto

> *Nota: La estructura exacta puede variar ligeramente según la rama activa del repositorio.*

```text
colegio-cayros/
├── prisma/
│   ├── schema.prisma        # Modelos de datos y configuración de PostgreSQL
│   └── migrations/          # Historial de migraciones de la base de datos
├── public/
│   └── images/              # Recursos estáticos, logos e imágenes institucionales
├── src/                     # (o estructura raíz app/ / pages/ + backend/)
│   ├── app/ o pages/        # Rutas públicas y rutas protegidas de /syspanel
│   │   ├── matricula/       # Flujo multi-paso de matrícula
│   │   ├── pagos-institucional/ # Registro y consulta de pagos
│   │   └── syspanel/        # Módulos del panel administrativo
│   ├── components/          # Componentes reutilizables (Modales, Tablas, Filtros, Navbar, Footer)
│   ├── lib/ o services/     # Cliente de Prisma, helpers de exportación (XLSX/CSV) y servicios API
│   └── styles/              # Estilos globales y configuración de Tailwind CSS
├── .env.example             # Plantilla de variables de entorno requeridas
├── next.config.mjs          # Configuración de Next.js
├── package.json             # Dependencias y scripts del proyecto
├── tailwind.config.ts       # Configuración de diseño y temas de Tailwind
└── tsconfig.json            # Configuración del compilador TypeScript
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
   git clone https://github.com/<usuario-o-organizacion>/<nombre-del-repositorio>.git
   cd <nombre-del-repositorio>
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example` (ver sección [Variables de Entorno](#-variables-de-entorno)).

4. **Sincronizar la base de datos con Prisma:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador:**
   * Portal público: `http://localhost:3000`
   * Panel administrativo: `http://localhost:3000/syspanel`

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables (ajusta los valores según tu entorno local o de producción):

```env
# Conexión a PostgreSQL (Prisma)
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/colegio_db?schema=public"

# Configuración de Autenticación / JWT / Sesión del Syspanel
JWT_SECRET="tu_clave_secreta_segura"
NEXTAUTH_SECRET="tu_secreto_de_sesion"
NEXTAUTH_URL="http://localhost:3000"

# Configuración de almacenamiento / subida de archivos (si aplica)
UPLOAD_DIR="./public/uploads"

# Entorno de ejecución
NODE_ENV="development"
```

---

## 🗄 Base de Datos y Prisma

Comandos útiles para administrar el esquema de **PostgreSQL** durante el desarrollo:

* **Generar el cliente de Prisma tras modificar `schema.prisma`:**
  ```bash
  npx prisma generate
  ```
* **Crear y aplicar una nueva migración:**
  ```bash
  npx prisma migrate dev --name nombre_del_cambio
  ```
* **Abrir Prisma Studio (interfaz visual para ver/editar registros):**
  ```bash
  npx prisma studio
  ```

---

## ☁️ Despliegue en Render

El proyecto está configurado para desplegarse en **Render**:

1. **Build Command:**
   ```bash
   npm install && npx prisma generate && npm run build
   ```
2. **Start Command:**
   ```bash
   npm start
   ```
3. **Variables de Entorno en Render:**
   Asegúrate de registrar `DATABASE_URL` (apuntando a la instancia PostgreSQL de Render o externa) y las claves de sesión (`JWT_SECRET` / `NEXTAUTH_SECRET`) en la pestaña **Environment** del servicio web.

---

## 📌 Notas para Revisores y Colaboradores

* **Punto de partida recomendado:** Revisar `prisma/schema.prisma` para comprender rápidamente todas las entidades del negocio (matrículas, pagos, mensajes y módulos CMS) antes de explorar las vistas.
* **Flujo crítico:** Los módulos de `/matricula`, `/pagos-institucional` y su contraparte de aprobación en `/syspanel` representan el núcleo operativo actual del colegio.
* **Planificación de mejoras:** La estructura modular de componentes y servicios permite escalar fácilmente hacia nuevos módulos académicos (intranet de notas, pensiones recurrentes, pasarela de pagos en línea o roles granulares de usuario).

---

Desarrollado inicialmente por **Luis Alessandro Moran Zurita** para el **Colegio Cayros**.