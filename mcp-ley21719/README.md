# MCP Server — Ley 21.719 Auditor de Cumplimiento

> [!WARNING]
> **ESTADO: EN CONSTRUCCIÓN / PROTOTIPO DE EJEMPLO**
> Este servidor MCP se encuentra en fase de desarrollo y construcción. Las herramientas y análisis provistos sirven de plantilla de ejemplo y demostración técnica para la Ley N° 21.719 de Protección de Datos Personales de Chile, y no deben ser considerados asesoría legal o auditoría certificada.

Servidor MCP para auditoría automática de código contra la **Ley 21.719 de Protección de Datos Personales** de Chile.

## Propósito y Funcionamiento

### ¿Qué hace?
Este MCP permite a un Asistente de IA (como Claude Desktop) analizar un proyecto de software y determinar su nivel de conformidad con las regulaciones de la Ley 21.719. Evalúa de forma automática **24 controles técnicos** organizados en **6 dimensiones clave**:
* **Licitud y Consentimiento:** Verifica casillas pre-marcadas, registros de bases de licitud, revocación del consentimiento y datos sensibles.
* **Derechos ARCO-P:** Comprueba la presencia de endpoints y flujos para Acceso, Rectificación, Cancelación, Oposición y Portabilidad.
* **Seguridad Técnica:** Revisa el uso de cifrado en reposo (AES-256), tránsito seguro (TLS/HTTPS), autenticación multifactor (MFA/2FA) y registros de auditoría (logs).
* **Gestión de Datos:** Evalúa la existencia de registros de tratamiento (RAT/RoPA), políticas de retención de datos, anonimización y Evaluaciones de Impacto (EIPD/DPIA).
* **Seguridad de Aplicación:** Detecta vulnerabilidades comunes como inyección SQL, validación de inputs, cookies seguras y algoritmos débiles de contraseñas (MD5/SHA1 vs bcrypt/argon2).
* **Gobernanza:** Verifica la presencia de políticas de privacidad, acuerdos con encargados (DPA) y planes de respuesta a incidentes (plazo de 72 horas).

### ¿Cómo lo hace?
El servidor implementa el protocolo MCP exponiendo tres elementos principales a la IA:
* **Herramientas (Tools):** `audit-project` (auditoría completa), `check-consent`, `check-arco-p`, `check-security`, `check-storage` (análisis específicos) y `generate-report` (generación de informes estructurados en Markdown o JSON).
* **Recursos (Resources):** Exponen el marco teórico y regulatorio mediante URIs personalizadas (`ley21719://framework`, `ley21719://principles`, `ley21719://rights`, `ley21719://sanctions`).
* **Prompts:** Recetas o flujos conversacionales predefinidos para la IA, tales como `full-audit` (auditoría del código), `quick-check` (verificación de los 3 controles más críticos) y `breach-response` (plan ante incidentes).
* **Motor de Escaneo Interno:** Utiliza reglas de expresiones regulares (`regex-rules.ts`) y análisis estático adaptado al lenguaje/framework detectado (`project-detect.ts`).

### ¿Para qué va a funcionar?
El objetivo principal es ser un **asistente preventivo para desarrolladores y oficiales de cumplimiento** para:
1. **Auditar sistemas:** Correr un escaneo en frío de un repositorio antes de pasar a producción y generar reportes con nivel de riesgo.
2. **Guiar la remediación:** Cuando el escaneo detecte incumplimientos, provee planes y acciones de remediación con ejemplos de código correctores.
3. **Consultoría legal contextualizada:** Permitir que la IA justifique sus recomendaciones basándose en las fuentes legislativas reales chilenas de la Ley 21.719 en lugar de generalidades de otras leyes.

## Instalación

```bash
cd mcp-ley21719
npm install
npm run build
```

## Configuración en Claude Desktop

Agrega al archivo de configuración de Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ley21719": {
      "command": "node",
      "args": ["C:\\ruta\\a\\tu\\mcp-ley21719\\dist\\index.js"]
    }
  }
}
```

## Herramientas Disponibles

| Tool | Descripción |
|------|-------------|
| `audit-project` | Auditoría completa de 24 controles en 6 dimensiones |
| `check-consent` | Verifica mecanismos de consentimiento (LBC-1 a LBC-4) |
| `check-arco-p` | Verifica endpoints ARCO-P (ARC-1 a ARC-4) |
| `check-security` | Verifica seguridad técnica (SEC-1 a SEC-4) |
| `check-storage` | Verifica gestión de datos (DAT-1 a DAT-4) |
| `generate-report` | Genera reporte en markdown, JSON o ejecutivo |

## Recursos MCP

| Resource URI | Contenido |
|-------------|-----------|
| `ley21719://framework` | 24 controles técnicos organizados en 6 dimensiones |
| `ley21719://principles` | Los 7 principios fundamentales del Art. 3° |
| `ley21719://rights` | Derechos ARCO-P de los titulares |
| `ley21719://sanctions` | Tabla de infracciones y multas |

## Prompts

| Prompt | Descripción |
|--------|-------------|
| `full-audit` | Flujo completo de auditoría con plan de remediación |
| `quick-check` | Verificación rápida de 3 controles críticos |
| `breach-response` | Protocolo de respuesta a incidentes (72 horas) |

## Soporte Multi-Lenguaje

- JavaScript / TypeScript
- Python
- PHP
- Go
- Java
- Ruby / Rust / C#
- HTML / Vue / Svelte

## Ejemplo de Uso

> "Audita el proyecto en C:\ruta\a\tu\proyecto contra la Ley 21.719"

El servidor escanea todos los archivos, evalúa los 24 controles y genera un reporte con scores por dimensión.
