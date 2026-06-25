export const frameworkResource = {
  uri: 'ley21719://framework',
  name: 'Framework de Auditoría — 24 Controles',
  description: 'Framework completo de auditoría con 24 controles técnicos organizados en 6 dimensiones para evaluar el cumplimiento de la Ley 21.719.',
  mimeType: 'application/json',
  content: JSON.stringify({
    version: '1.0.0',
    dimensions: [
      {
        id: 'lbc',
        title: 'Licitud y Consentimiento',
        controls: [
          { code: 'LBC-1', text: 'Las casillas de consentimiento deben estar desmarcadas por defecto', criticality: 'high' },
          { code: 'LBC-2', text: 'Registro de bases legales para cada tratamiento', criticality: 'medium' },
          { code: 'LBC-3', text: 'Mecanismo de revocación de consentimiento', criticality: 'high' },
          { code: 'LBC-4', text: 'Consentimiento explícito para datos sensibles', criticality: 'high' },
        ],
      },
      {
        id: 'arc',
        title: 'Derechos ARCO-P',
        controls: [
          { code: 'ARC-1', text: 'Endpoint de solicitud de acceso a datos', criticality: 'high' },
          { code: 'ARC-2', text: 'Endpoint de rectificación de datos', criticality: 'high' },
          { code: 'ARC-3', text: 'Endpoint de eliminación/derecho al olvido', criticality: 'high' },
          { code: 'ARC-4', text: 'Endpoint de portabilidad de datos', criticality: 'medium' },
        ],
      },
      {
        id: 'sec',
        title: 'Seguridad Técnica',
        controls: [
          { code: 'SEC-1', text: 'Cifrado en reposo (AES-256)', criticality: 'high' },
          { code: 'SEC-2', text: 'Cifrado en tránsito (TLS 1.3)', criticality: 'high' },
          { code: 'SEC-3', text: 'Autenticación multifactor (MFA)', criticality: 'high' },
          { code: 'SEC-4', text: 'Logs de auditoría inmutables', criticality: 'medium' },
        ],
      },
      {
        id: 'dat',
        title: 'Gestión de Datos',
        controls: [
          { code: 'DAT-1', text: 'Registro de Actividades de Tratamiento (RAT/RoPA)', criticality: 'medium' },
          { code: 'DAT-2', text: 'Política de retención de datos', criticality: 'medium' },
          { code: 'DAT-3', text: 'Anonimización/pseudonimización', criticality: 'medium' },
          { code: 'DAT-4', text: 'Evaluación de Impacto (EIPD/DPIA)', criticality: 'medium' },
        ],
      },
      {
        id: 'app',
        title: 'Seguridad de Aplicación',
        controls: [
          { code: 'APP-1', text: 'Protección contra inyección SQL', criticality: 'high' },
          { code: 'APP-2', text: 'Validación y sanitización de inputs', criticality: 'high' },
          { code: 'APP-3', text: 'Gestión segura de sesiones', criticality: 'high' },
          { code: 'APP-4', text: 'Hash de contraseñas (bcrypt/argon2)', criticality: 'high' },
        ],
      },
      {
        id: 'gov',
        title: 'Gobernanza y Cumplimiento',
        controls: [
          { code: 'GOV-1', text: 'Designación formal del DPD', criticality: 'medium' },
          { code: 'GOV-2', text: 'Política de privacidad publicada', criticality: 'medium' },
          { code: 'GOV-3', text: 'Contratos DPA con encargados', criticality: 'medium' },
          { code: 'GOV-4', text: 'Plan de respuesta a incidentes', criticality: 'high' },
        ],
      },
    ],
  }),
};

export const principlesResource = {
  uri: 'ley21719://principles',
  name: 'Los 7 Principios Fundamentales — Art. 3°',
  description: 'Los 7 principios del tratamiento de datos personales consagrados en el Artículo 3° de la Ley 21.719.',
  mimeType: 'text/plain',
  content: `# Los 7 Principios Fundamentales del Tratamiento de Datos (Artículo 3°)

1. **Licitud y Lealtad:** Los datos deben tratarse con apego a la ley y de manera justa, sin engaños, manipulación ni fines abusivos. Todo tratamiento requiere una base legal válida.

2. **Finalidad:** Los datos deben ser recolectados para fines específicos, explícitos y legítimos. Queda prohibido su uso posterior para fines incompatibles.

3. **Proporcionalidad:** Solo se deben recopilar y tratar los datos que sean estrictamente necesarios, pertinentes y adecuados para la finalidad declarada.

4. **Calidad y Exactitud:** Los datos deben ser exactos, completos y estar actualizados. Deben eliminarse o anonimizarse tan pronto dejen de ser necesarios.

5. **Responsabilidad Proactiva:** El responsable del tratamiento no solo debe cumplir la ley, sino también estar en condiciones de demostrar y acreditar dicho cumplimiento.

6. **Seguridad:** Obligatorio adoptar medidas técnicas y organizativas apropiadas para resguardar la confidencialidad, integridad y disponibilidad.

7. **Transparencia:** Se debe garantizar al titular información clara, accesible y oportuna sobre quién trata sus datos y cómo ejercer sus derechos.`,
};

export const rightsResource = {
  uri: 'ley21719://rights',
  name: 'Derechos ARCO-P',
  description: 'Los 5 derechos fundamentales de los titulares de datos bajo la Ley 21.719.',
  mimeType: 'text/plain',
  content: `# Derechos ARCO-P de los Titulares

- **A - Acceso:** Derecho a saber si se están tratando sus datos, con qué finalidad, los destinatarios de los mismos y el período de conservación.

- **R - Rectificación:** Solicitar la corrección de datos personales que sean inexactos, desactualizados, incompletos o erróneos.

- **C - Cancelación / Supresión:** Exigir la eliminación de datos cuando hayan dejado de ser necesarios, el tratamiento sea ilícito, o se haya revocado el consentimiento.

- **O - Oposición:** Oponerse al tratamiento por motivos fundados y legítimos, o cuando el tratamiento tenga por objeto mercadotecnia directa.

- **P - Portabilidad:** Derecho a recibir sus datos en un formato estructurado y legible, y a transmitirlos a otro responsable sin impedimentos.

## Implementación Técnica Requerida

Cada derecho requiere un endpoint en la API:

| Derecho | Método | Endpoint sugerido |
|---------|--------|-------------------|
| Acceso | GET | /api/data-access |
| Rectificación | PATCH | /api/update-profile |
| Cancelación | DELETE | /api/delete-account |
| Oposición | POST | /api/opt-out |
| Portabilidad | GET | /api/export-data |`,
};

export const sanctionsResource = {
  uri: 'ley21719://sanctions',
  name: 'Régimen de Infracciones y Multas',
  description: 'Tabla de infracciones y multas de la Ley 21.719.',
  mimeType: 'text/plain',
  content: `# Régimen de Infracciones y Multas — Ley 21.719

| Gravedad | Sanción / Multa Máxima | Cálculo Alternativo |
|----------|----------------------|---------------------|
| **Leve** | Amonestación escrita o hasta 5.000 UTM | No aplica |
| **Grave** | Multa de hasta 10.000 UTM | Hasta 2% de ingresos anuales |
| **Gravísima** | Multa de hasta 20.000 UTM | Hasta 4% de ingresos anuales |

## Reincidencia
En caso de reincidencia en infracciones gravísimas, la multa puede incrementarse hasta tres veces (60.000 UTM) o suspenderse las actividades de tratamiento.

## Infracciones Gravísimas (ejemplos)
- Tratar datos sensibles sin consentimiento explícito
- Obstruir las funciones fiscalizadoras de la APDP
- No notificar brechas de datos dentro de 72 horas
- Transferir datos a países sin garantías adecuadas

## Infracciones Graves (ejemplos)
- Tratar datos sin base legal válida
- No atender solicitudes ARCO-P en plazo
- No designar un DPD cuando es obligatorio

## Notificación de Brechas
- Plazo: 72 horas desde la detección
- Notificar a la APDP y a los titulares afectados
- Incluir: naturaleza, datos comprometidos, medidas adoptadas`,
};
