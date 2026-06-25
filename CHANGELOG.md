# Changelog - Ecosistema Ley N° 21.719

Todos los cambios notables realizados en este proyecto serán documentados en este archivo. El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Versión Semántica](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-06-25

### Añadido
*   **Enrutamiento por Hash:** Implementado enrutamiento reactivo en la aplicación web (`App.svelte`) utilizando `window.location.hash`. Ahora las secciones individuales (como `#auditor` o `#cases`) tienen URLs amigables, se pueden compartir directamente y soportan los botones de navegación del historial del navegador.
*   **Dominio Personalizado:** Añadido soporte para el dominio personalizado `datoschile.help` mediante la creación del archivo `CNAME` en la carpeta `public` de la aplicación.
*   **Despliegue Continuo (CI/CD):** Creado el workflow `.github/workflows/deploy.yml` para compilar y desplegar automáticamente la aplicación web en GitHub Pages al empujar cambios a la rama `main`.
*   **Documentación General:** Creado el archivo `README.md` principal en la raíz del repositorio, detallando el propósito del proyecto, sus herramientas, licencias e instrucciones de contribución.

### Cambiado
*   **Actualización de Entorno en Actions:** Migrados los runners del workflow a Node.js 22 (LTS) y actualizados los paquetes de las acciones (`actions/checkout@v7` y `actions/setup-node@v6`) para resolver y eliminar las advertencias de depreciación de Node 20.
*   **Configuración de Vite:** Cambiada la ruta base de Vite (`base`) en `vite.config.js` de `./` a `/` para dar soporte al despliegue bajo la raíz del dominio personalizado.

### Eliminado
*   **Limpieza de Datos de Usuario:** Removidas todas las referencias hardcodeadas a la ruta local `C:\Users\benja\...` reemplazándolas con rutas relativas estandarizadas.

---

## [1.0.0] - 2026-06-24

### Añadido
*   **Lanzamiento Inicial del Ecosistema:**
    *   **`/app`:** Aplicación interactiva Svelte + Vite y TailwindCSS para auditar y explorar la Ley 21.719.
    *   **`/mcp-ley21719`:** Servidor MCP en TypeScript para auditorías automáticas de código con 24 controles técnicos de privacidad y seguridad, listo para conectar a Claude Desktop.
    *   **`/templates`:** Plantillas en Markdown de documentos legales (Acta DPD, DPA Encargados, DPIA/EIPD, Registro RAT/RoPA, consentimiento, respuesta a incidentes).
    *   **`/vulnerabilidades`:** Registro y análisis de brechas de datos históricas en Chile y el mundo para concientización técnica.
    *   **`/tools`:** Auditor local offline escrito en HTML/JS.
    *   **`INVESTIGACION.md`:** Guía exhaustiva teórica sobre el marco regulatorio chileno de protección de datos.
