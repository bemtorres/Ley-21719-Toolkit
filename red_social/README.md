# 📱 Caso 3: Red Social Web y Móvil
## Cumplimiento de la Ley N° 21.719 en Plataformas Digitales de Consumo

Este documento analiza la adecuación a la nueva ley de datos de una **Red Social** donde los usuarios crean perfiles públicos y privados, publican imágenes, escriben posts, comparten geolocalización e interactúan mediante mensajes.

---

## 📊 1. Mapa de Datos del Sistema

| Módulo del Sistema | Tipos de Datos Tratados | Clasificación Legal | Finalidad del Tratamiento |
| :--- | :--- | :--- | :--- |
| **Registro de Cuenta** | Nombre de usuario, correo electrónico, fecha de nacimiento, contraseña. | Datos Personales | Gestión de identidad y validación de edad mínima de uso. |
| **Contenido Publicado** | Publicaciones escritas, imágenes, videos, comentarios, metadatos EXIF de las imágenes. | Datos Personales / Inferencia | Publicación del perfil y distribución en el feed de seguidores. |
| **Interacción y Mensajería** | Likes, comentarios, búsquedas, mensajes directos (DM). | Datos de Comportamiento | Optimización del algoritmo de contenido y comunicación privada. |
| **Publicidad y Perfiles** | Intereses inferidos, historial de clics, ubicación (GPS/IP), cookies de rastreo. | Datos Personales de Comportamiento | Segmentación de anuncios publicitarios (Monetización). |

---

## ⚖️ 2. Bases Legales de Licitud aplicables a Redes Sociales

1. **Ejecución de un Contrato (Términos y Condiciones de Servicio):**
   * Es la base fundamental para el funcionamiento básico de la red social. Para crear la cuenta, mostrar el feed de amigos y permitir el envío de mensajes, se procesan datos bajo la aceptación de los Términos de Servicio.
2. **Consentimiento del Titular (Independiente y Explícito):**
   * Se requiere obligatoriamente para:
     * El uso de **geolocalización precisa** en tiempo real.
     * La recolección de datos de comportamiento en sitios de terceros (mediante cookies o píxeles) para **publicidad dirigida**.
     * El tratamiento de **datos biométricos** si se implementan sistemas de reconocimiento facial automáticos en fotos.
3. **Interés Legítimo:**
   * Utilizado para mejorar la seguridad del sitio (detección de bots, prevención de fraude en inicios de sesión o moderación automática de contenido abusivo).

---

## 🛑 3. Riesgos Críticos bajo la Ley N° 21.719

> [!IMPORTANT]
> Las redes sociales manejan un volumen masivo de datos de comportamiento y contenido que puede revelar indirectamente datos sensibles (afiliación política, orientación sexual, etc.). Las multas por infracción a los derechos de los usuarios pueden llegar hasta **20.000 UTM** (o el **4% de los ingresos globales** de la matriz de la red social).

* **Privacidad por Defecto Inadecuada:** Configurar por defecto todos los perfiles nuevos como "públicos" en lugar de "privados" (especialmente para menores de edad).
* **Rastreo "Shadow" e Invasivo:** Rastrear a usuarios a través de la web sin su consentimiento explícito a través de cookies comerciales.
* **Imposibilidad de Eliminar Datos (Derecho de Supresión/Olvido):** Cuando un usuario decide borrar su cuenta, que sus fotos o comentarios sigan apareciendo en la plataforma o queden almacenados de manera indefinida en los servidores de respaldo.
* **Falta de Control sobre Contenido de Terceros:** Permitir que usuarios suban fotos o etiqueten a otras personas identificables sin que exista un mecanismo ágil para solicitar la remoción de dicha etiqueta o imagen.

---

## 🛠️ 4. Medidas de Adecuación Técnica y Organizativa

### A. Privacidad desde el Diseño (Privacy by Design)
* **Configuración por Defecto Privada:** Las cuentas de nuevos usuarios (especialmente los identificados como adolescentes de entre 14 y 17 años) deben ser **privadas por defecto**. Las opciones de compartición de datos deben requerir una acción voluntaria del usuario.
* **Eliminación de Metadatos:** El servidor de carga de imágenes debe limpiar automáticamente los datos de localización geográfica (metadatos EXIF) de las fotos antes de publicarlas, para evitar el doxxing o acoso de usuarios.

```
[Usuario sube imagen] 
       │
       ▼
[Servidor de Red Social] ──► Extrae y elimina metadatos EXIF (GPS, Cámara)
       │
       ▼
[Imagen Limpia Almacenada] ──► Publicación en el Feed del usuario
```

### B. Módulos de Privacidad y Derechos ARCO-P
El sistema de la red social debe proporcionar herramientas de autoservicio para los derechos de los usuarios:
* **Derecho de Portabilidad:** Implementar una opción de "Descargar mi información" que genere un archivo comprimido (ej. ZIP con formatos estructurados como JSON) conteniendo todas las imágenes subidas, comentarios escritos e historial de posts.
* **Derecho de Supresión (Derecho al Olvido):**
  * La opción de "Eliminar cuenta" debe ejecutar un borrado en cascada (soft-delete inmediato para visualización pública, y hard-delete definitivo en bases de datos y backups en un plazo máximo de 30 días).

### C. Consentimiento Granular para Cookies y Anuncios
* Desplegar un centro de preferencias de cookies y publicidad que sea claro e interactivo.
* No se permiten cajones de consentimiento premarcados. El usuario debe activar activamente cada opción:
  * `[ ]` Acepto cookies necesarias para la sesión. (Obligatoria)
  * `[ ]` Acepto la personalización de publicidad basada en mis intereses. (Opcional)
  * `[ ]` Acepto compartir mi geolocalización exacta para sugerencias locales. (Opcional)
