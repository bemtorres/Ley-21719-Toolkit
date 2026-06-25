# Ecosistema de Adecuación a la Ley N° 21.719 (Chile)

> [!WARNING]
> **ESTADO DEL PROYECTO: EN CONSTRUCCIÓN / DISEÑO EN PROGRESO**
> Este repositorio es una guía y caja de herramientas técnica de apoyo. Ha sido compilado utilizando diversas fuentes normativas asistidas por Inteligencia Artificial (IA). Al tratarse de una ley que entrará en vigor en **diciembre de 2026**, el contenido, los controles y el diseño técnico se encuentran en constante construcción y refinamiento a medida que la Agencia de Protección de Datos Personales (APDP) publique nuevos reglamentos y directrices. **No constituye asesoría legal formal.**

Este proyecto reúne un conjunto de herramientas interactivas, servidores de integración y plantillas de cumplimiento para ayudar a desarrolladores, administradores de sistemas y oficiales de privacidad a auditar y adecuar sus plataformas a la **Ley N° 21.719 sobre Protección de Datos Personales en Chile**.

---

## 🛠️ Herramientas y Componentes del Proyecto

En este repositorio encontrarás los siguientes módulos y recursos organizados para facilitar la adecuación técnica:

### 1. [Audit Web App (`/app`)](./app)
Una aplicación web interactiva desarrollada en **Svelte / Vite** que permite a las organizaciones realizar escaneos visuales, evaluar controles y analizar las brechas de cumplimiento mediante una interfaz de usuario fluida y moderna.

### 2. [Servidor MCP (`/mcp-ley21719`)](./mcp-ley21719)
Servidor basado en el **Model Context Protocol (MCP)** que expone a los Modelos de Lenguaje (como Claude) herramientas (`tools`), recursos (`resources`) y flujos (`prompts`) para que una IA pueda escanear código en tiempo real, mapear controles y generar planes de remediación contextualizados en la Ley 21.719 de Chile.

### 3. [Plantillas de Cumplimiento (`/templates`)](./templates)
Documentos de referencia y plantillas listas en Markdown para agilizar la documentación formal:
*   [Acta de Nombramiento del DPD](./templates/ACTA_NOMBRAMIENTO_DPD.md)
*   [Consentimiento Granular e Informado](./templates/CONSENTIMIENTO_GRANULAR.md)
*   [Contrato de Encargado de Tratamiento (DPA)](./templates/CONTRATO_DPA_ENCARGADO.md)
*   [Evaluación de Impacto en Protección de Datos (EIPD / DPIA)](./templates/EIPD_DPIA_TEMPLATE.md)
*   [Matriz de Riesgos del Modelo de Prevención (MPI)](./templates/MATRIZ_RIESGOS_MPI.md)
*   [Notificación de Brecha de Seguridad (Plazo 72h)](./templates/NOTIFICACION_BRECHA.md)
*   [Política de Privacidad y Transparencia](./templates/POLITICA_PRIVACIDAD.md)
*   [Registro de Actividades de Tratamiento (RAT / RoPA)](./templates/RAT_Registro_Actividades_Template.md)

### 4. [Auditor Estático Local (`/tools`)](./tools)
Una herramienta local y autónoma escrita en HTML/JS y CSS para escanear y testear de forma rápida el cumplimiento de los controles de seguridad y lógica de desarrollo directamente en tu máquina.

### 5. [Base de Datos de Vulnerabilidades (`/vulnerabilidades`)](./vulnerabilidades)
Repositorio con guías y mapeos de riesgos informáticos a nivel nacional (Chile) e internacional que atentan contra la confidencialidad de los datos personales.

### 6. [Documento de Investigación Central (`/INVESTIGACION.md`)](./INVESTIGACION.md)
Una guía exhaustiva que detalla los principios, bases legales de licitud, derechos ARCO-P, el rol del DPD, el Modelo de Prevención de Infracciones (MPI) y el régimen de multas de la Ley N° 21.719.

---

## 🤝 Contribuciones (Pull Requests)

El diseño y las reglas de este ecosistema están en desarrollo constante. Si deseas colaborar con nuevas reglas de escaneo, mejoras en el diseño de la aplicación web, o corregir plantillas:

1.  Haz un **Fork** de este repositorio.
2.  Crea una rama para tu mejora: `git checkout -b feature/nueva-mejora`.
3.  Realiza tus cambios y asegúrate de mantener el formato limpio.
4.  Envía tu **Pull Request (PR)** explicando en detalle los cambios y mejoras propuestos.

¡Toda contribución que ayude a pulir las herramientas es bienvenida!

---

## ⚖️ Licencia

Este proyecto está liberado bajo la **Licencia MIT**. Siéntete libre de utilizarlo, modificarlo y adaptarlo a las necesidades de tu organización.
