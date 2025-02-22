# Liteflix

Liteflix es una aplicación web moderna desarrollada con Next.js, diseñada para gestionar y mostrar contenido multimedia de forma ágil y escalable. La plataforma integra diversas APIs y servicios, como Airtable, Cloudinary y TMDB, para ofrecer una experiencia rica y dinámica tanto en la visualización de contenido como en la gestión de listas personales.

- [Ver Demo en Vercel](https://v0-netfix-app-clone.vercel.app/)

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [API](#api)
- [Estructura de Airtable](#Estructura-de-Airtable)
- [Desarrollo y Ejecución](#desarrollo-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Características

- **Desarrollo con Next.js:** Aprovecha el renderizado híbrido y la optimización SEO.
- **Interfaz Moderna y Reactiva:** Construida en React, brinda una experiencia de usuario fluida e interactiva.
- **Estilos Personalizados:** Utiliza Tailwind CSS junto con plugins como tailwindcss-animate y tailwindcss-textshadow.
- **Animaciones Suaves:** Integración con Framer Motion para transiciones y animaciones dinámicas.
- **Carga y Selección de Archivos:** Manejo optimizado de archivos con react-dropzone y selección avanzada con react-select.
- **Integración con Airtable y Cloudinary:**  
  - **Airtable:** Se utiliza para almacenar y gestionar datos de películas, incluyendo una lista de favoritos.
  - **Cloudinary:** Se emplea para el hosteo y entrega de imágenes, tanto para películas como para el contenido de la lista de favoritos.
- **Consumo de la API de TMDB:**  
  - Muestra una imagen destacada y las películas populares, enriqueciendo la experiencia de usuario con contenido actualizado.
- **Lista de Favoritos:** Permite a los usuarios crear y gestionar una lista de películas favoritas, con registros almacenados en Airtable y las imágenes asociadas en Cloudinary.

## Tecnologías Utilizadas

- **Framework y Librerías:**  
  - [Next.js](https://nextjs.org/)  
  - [React](https://reactjs.org/)  
  - [Framer Motion](https://www.framer.com/motion/)  
  - [lucide-react](https://github.com/lucide-icons/lucide-react)  

- **Estilos y Diseño:**  
  - [Tailwind CSS](https://tailwindcss.com/)  
  - [tailwindcss-animate](https://github.com/benface/tailwindcss-animate)  
  - [tailwindcss-textshadow](https://github.com/MarioRicalde/tailwindcss-textshadow)

- **Utilidades y Componentes:**  
  - [react-dropzone](https://react-dropzone.js.org/)  
  - [react-select](https://react-select.com/)

- **Servicios y APIs:**  
  - [Airtable](https://airtable.com/) para la gestión de datos de películas y favoritos.  
  - [Cloudinary](https://cloudinary.com/) para el almacenamiento y hosteo de imágenes.  
  - [TMDB API](https://www.themoviedb.org/documentation/api) para obtener imágenes destacadas y las películas populares.

- **Herramientas de Desarrollo:**  
  - [TypeScript](https://www.typescriptlang.org/)  
  - [Prettier](https://prettier.io/) y [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)  
  - [Autoprefixer](https://github.com/postcss/autoprefixer)

## Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v14 o superior)
- [Git](https://git-scm.com/)

### Pasos para la Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/liteflix.git
   ```

2. **Navega al directorio del proyecto:**

   ```bash
   cd liteflix
   ```

3. **Instala las dependencias:**

   ```bash
   npm install
   ```

## Configuración de Variables de Entorno

Antes de ejecutar la aplicación, es fundamental configurar las siguientes variables de entorno, ya que son necesarias para la integración con Airtable, Cloudinary y TMDB:

- **AIRTABLE_API_KEY:** Tu clave de API de Airtable.
- **CLOUDINARY_NAME:** El nombre de tu cuenta en Cloudinary.
- **CLOUDINARY_UPLOAD_PRESET** Tu configuracion para Cloudinary
- **TMDB_API_KEY:** Tu clave de API para acceder a TMDB. (Esta es pública y ya viene por default en el repo)

Crea un archivo `.env.local` en la raíz del proyecto y agrega las siguientes líneas:

```env
AIRTABLE_API_KEY=tu_api_key_de_airtable
CLOUDINARY_NAME=tu_nombre_de_cloudinary
CLOUDINARY_UPLOAD_PRESET=nombre_de_tu_preset
TMDB_API_KEY=tu_api_key_de_tmdb
```

> **Nota:** Estas variables son indispensables para la correcta operación de la API y la visualización del contenido multimedia.

## API

La aplicación incluye varios endpoints que facilitan la integración con servicios externos y la gestión de datos:

### GET: Obtener Películas desde Airtable

- **Descripción:** Realiza una petición a Airtable para obtener el listado de películas.
- **Proceso:**  
  - Envía una solicitud GET a la API de Airtable utilizando la variable `AIRTABLE_API_KEY`.
  - Devuelve los datos en formato JSON.
  - Gestiona y retorna errores en caso de fallos en la conexión.

### POST: Agregar Nueva Película

- **Descripción:** Permite subir una imagen a Cloudinary y, posteriormente, insertar un registro en Airtable.
- **Proceso:**  
  1. **Recepción de Datos:** Extrae del formulario el nombre de la película y el archivo del póster.
  2. **Subida a Cloudinary:** Utiliza el endpoint de Cloudinary (empleando `CLOUDINARY_NAME`) para subir el archivo.
  3. **Inserción en Airtable:** Una vez obtenida la URL de la imagen, inserta un nuevo registro en Airtable.
- **Manejo de Errores:** Se proporcionan mensajes descriptivos en el JSON de respuesta en caso de fallos en la subida o inserción.

### Consumo de la API de TMDB

- **Funcionalidad:**  
  - Se consume la API de TMDB para mostrar una imagen destacada y un listado de las películas populares.
  - La integración permite actualizar dinámicamente la interfaz con contenido actual y relevante para el usuario.

### Gestión de Favoritos

- **Descripción:**  
  - Permite a los usuarios crear una lista de películas favoritas.
  - Los registros de favoritos se almacenan en Airtable, mientras que las imágenes asociadas se gestionan mediante Cloudinary.
- **Proceso:**  
  - Se utiliza un endpoint específico para agregar o eliminar películas de la lista de favoritos.
  - La operación implica tanto la actualización en Airtable como la correcta gestión del contenido multimedia en Cloudinary.

### Estructura de Airtable
La integración con Airtable se configura de la siguiente manera:

- **Base de Datos:** 
Nombre de la Base: Liteflix (se obtiene el id desde la API)
Nombre de la Tabla: Movies (se obtiene el id desde la API)
Campos de la Tabla:
movie_name: Almacena el nombre de la película.
poster_url: Contiene la URL del póster de la película, generalmente gestionado a través de Cloudinary.
createdTime: Registra la fecha y hora en que se creó el registro (campo automático de Airtable).
Esta estructura permite gestionar de forma sencilla y eficiente tanto el catálogo de películas como la lista de favoritos de los usuarios.

## Desarrollo y Ejecución

- **Modo Desarrollo:**  
  Inicia el entorno de desarrollo con recarga en caliente:

  ```bash
  npm run dev
  ```

- **Construir para Producción:**  
  Genera la versión optimizada de la aplicación:

  ```bash
  npm run build
  ```

- **Iniciar en Modo Producción:**  
  Ejecuta la aplicación ya construida:

  ```bash
  npm start
  ```

Accede a la aplicación en `http://localhost:3000` (o el puerto configurado) para explorar Liteflix en acción.

## Estructura del Proyecto

Una estructura de carpetas sugerida para este proyecto es:

```
liteflix/
├── pages/               # Páginas de Next.js y endpoints de la API
├── public/              # Recursos estáticos (imágenes, fuentes, etc.)
├── styles/              # Archivos de estilos y configuraciones de Tailwind CSS
├── components/          # Componentes reutilizables de React
├── utils/               # Utilidades y funciones auxiliares
├── package.json         # Configuración y dependencias del proyecto
└── README.md            # Documentación del proyecto
```
