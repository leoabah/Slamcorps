# Slamcorps 🛍️

**Aplicación web de comercio electrónico Full Stack**

Slamcorps es un proyecto de comercio electrónico desarrollado para ofrecer una experiencia de compra online y facilitar la gestión de productos de un negocio. Integra una interfaz de usuario con un backend que permite gestionar la información y las operaciones de la aplicación, además de incorporar **Mercado Pago como medio de pago online**.

🌐 **Demo:** [slamcorps.vercel.app](https://slamcorps.vercel.app/)

💻 **Repositorio:** [github.com/leoabah/Slamcorps](https://github.com/leoabah/Slamcorps)

## 📌 Sobre el proyecto

Slamcorps forma parte de mi experiencia práctica como desarrollador web y representa una oportunidad para aplicar conocimientos de desarrollo frontend y backend en un proyecto orientado a un negocio real.

El desarrollo incluye una interfaz de comercio electrónico, comunicación con una API, funcionalidades para la gestión de productos y la integración de **Mercado Pago para gestionar el proceso de pago de las compras online**.

## ✨ Funcionalidades

- 🛒 Catálogo de productos.
- 📦 Visualización de información y precios de productos.
- 🔐 Registro y autenticación de usuarios.
- 🧑‍💻 Gestión de productos desde una interfaz administrativa.
- ➕ Alta de productos con información como título, precio, categoría, descripción y stock.
- 🖼️ Gestión de imágenes de productos.
- 🔗 Comunicación entre frontend y backend mediante una API.
- 💳 **Integración de Mercado Pago como medio de pago online.**
- 📱 Interfaz web adaptable a diferentes dispositivos.

## 🛠️ Tecnologías

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS / Sass

### Backend

- Node.js
- Express.js
- API REST

### Pagos online

- Mercado Pago

### Herramientas y despliegue

- Git y GitHub
- Vercel para el frontend
- Render para el backend

## 📂 Estructura del proyecto

```text
Slamcorps/
├── Frontend/
│   └── Aplicación de comercio electrónico
├── Backend/
│   └── API y lógica del servidor
├── .gitignore
└── README.md
```

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js y npm instalados.
- Git instalado.

### 1. Clonar el repositorio

```bash
git clone https://github.com/leoabah/Slamcorps.git
cd Slamcorps
```

### 2. Configurar el frontend

```bash
cd Frontend
npm install
```

Configura la variable de entorno `VITE_API_URL` para que apunte a la URL de tu backend.

Para desarrollo local, puedes utilizar un archivo `.env` dentro de `Frontend`:

```env
VITE_API_URL=http://localhost:PUERTO
```

Reemplaza `PUERTO` por el puerto real configurado en el backend.

Inicia el servidor de desarrollo utilizando el script correspondiente de `package.json`:

```bash
npm run dev
```

### 3. Configurar el backend

Abre otra terminal y accede a la carpeta del backend:

```bash
cd Backend
npm install
```

Configura las variables de entorno que requiera el proyecto, como el puerto del servidor, la conexión a la base de datos y los secretos de autenticación. Si la integración de Mercado Pago utiliza credenciales mediante variables de entorno, configúralas también siguiendo la implementación del proyecto.

Inicia el backend con el comando definido en los scripts de su `package.json`.

> **Nota:** Los comandos de inicio y las variables de entorno deben verificarse con la configuración actual del proyecto antes de ejecutar la aplicación. No publiques credenciales ni tokens privados en el repositorio.

## 🌍 Demo online

Puedes explorar la aplicación desplegada aquí:

👉 [Visitar Slamcorps](https://slamcorps.vercel.app/)

## 🎯 Objetivos de aprendizaje

Este proyecto me permitió trabajar en aspectos importantes del desarrollo web:

- Construcción de interfaces con React.
- Organización de una aplicación frontend.
- Integración de frontend y backend mediante una API.
- Implementación de funcionalidades de autenticación.
- Gestión de productos desde una interfaz administrativa.
- Integración de Mercado Pago como medio de pago para un comercio electrónico.
- Configuración de variables de entorno y despliegue.
- Resolución de problemas durante el desarrollo y la puesta en producción.

## 👨‍💻 Autor

**Lionel Abah**

Desarrollador web con especial interés en Frontend y en la construcción de aplicaciones web con React y JavaScript.

- **Portfolio:** [portafolio-dev-theta.vercel.app](https://portafolio-dev-theta.vercel.app/)
- **LinkedIn:** [linkedin.com/in/flabah](https://www.linkedin.com/in/flabah)
- **GitHub:** [github.com/leoabah](https://github.com/leoabah)

---

⭐ Si te interesa el proyecto, puedes explorar el código fuente y la demo online.
