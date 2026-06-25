export const fullAuditPrompt = {
  name: 'full-audit',
  description: 'Flujo completo de auditoría de cumplimiento de la Ley 21.719. Escanea el proyecto, evalúa los 24 controles y genera un informe detallado.',
  arguments: [
    {
      name: 'projectPath',
      description: 'Ruta absoluta al directorio raíz del proyecto a auditar',
      required: true,
    },
  ],
  content: {
    type: 'text' as const,
    text: `Eres un experto en cumplimiento de la Ley 21.719 de Protección de Datos Personales de Chile.

Sigue estos pasos para auditar el proyecto:

1. Usa el tool \`audit-project\` con la ruta del proyecto para escanear todos los archivos contra los 24 controles técnicos.

2. Analiza el reporte generado e identifica:
   - Controles que fallan (riesgo alto)
   - Controles parciales (riesgo medio)
   - Controles que cumplen

3. Para cada control que falle, explica:
   - Por qué es un problema bajo la Ley 21.719
   - El artículo específico que se viola
   - Cómo solucionarlo con código concreto

4. Genera un plan de remediación priorizado:
   - Semana 1: Controles críticos (fails)
   - Semana 2-3: Controles parciales
   - Semana 4: Mejoras adicionales

5. Usa \`generate-report\` con formato "executive" para el resumen ejecutivo y "markdown" para el informe completo.

Proyecto a auditar: {projectPath}`,
  },
};

export const quickCheckPrompt = {
  name: 'quick-check',
  description: 'Verificación rápida de los 3 controles más críticos: consentimiento, contraseñas y cifrado.',
  arguments: [
    {
      name: 'projectPath',
      description: 'Ruta absoluta al directorio raíz del proyecto',
      required: true,
    },
  ],
  content: {
    type: 'text' as const,
    text: `Realiza una verificación rápida de cumplimiento de la Ley 21.719 enfocándote en los 3 controles más críticos:

1. Usa \`check-consent\` para verificar que las casillas de consentimiento estén desmarcadas por defecto.

2. Usa \`check-security\` para verificar:
   - Hash de contraseñas seguro (bcrypt/argon2, no MD5/SHA1)
   - Cifrado en reposo (AES-256)
   - No hay secretos hardcodeados

3. Usa \`check-arco-p\` para verificar que existan endpoints para los derechos ARCO-P.

Resume los hallazgos en 3 bullets: ✅ lo que está bien, ⚠️ lo que necesita atención, ❌ lo que es crítico.

Proyecto: {projectPath}`,
  },
};

export const breachResponsePrompt = {
  name: 'breach-response',
  description: 'Protocolo de respuesta a incidentes de seguridad bajo la Ley 21.719 (72 horas).',
  arguments: [
    {
      name: 'incidentType',
      description: 'Tipo de incidente: ransomware, phishing, data-leak, unauthorized-access, malware',
      required: false,
    },
  ],
  content: {
    type: 'text' as const,
    text: `Eres el asistente de respuesta a incidentes para la Ley 21.719 de Chile.

Protocolo de respuesta (72 horas):

## Fase 1: Contención (0-4 horas)
1. Identificar y aislar sistemas afectados
2. Activar Comité de Crisis (TI, DPD, Legal, Gerencia)
3. Iniciar Bitácora Técnica (cada acción con timestamp)
4. NO apagar equipos (preservar evidencia volátil)

## Fase 2: Evaluación (4-24 horas)
1. Determinar tipo de datos comprometidos:
   - ¿Datos personales generales?
   - ¿Datos sensibles (salud, biométricos)?
   - ¿Datos financieros?
2. Calcular número de titulares afectados
3. Identificar período de exposición
4. Evaluar riesgo para los titulares

## Fase 3: Notificación (24-72 horas)
1. Notificar a la APDP (contacto@apdp.gob.cl) con:
   - Naturaleza de la brecha
   - Categorías y número de titulares
   - Datos comprometidos
   - Medidas adoptadas
   - Datos de contacto del DPD
2. Si el riesgo es alto, notificar directamente a los titulares afectados
3. Documentar todo el proceso

## Fase 4: Recuperación (Día 2-7)
1. Erradicar la causa del incidente
2. Restaurar desde backups inmutables
3. Restablecer servicios verificados
4. Implementar medidas correctivas

## Fase 5: Cierre (Día 7+)
1. Análisis de causa raíz
2. Actualizar el MPI si es necesario
3. Realizar capacitación post-incidente
4. Cierre documental completo

Contactos de emergencia:
- CSIRT Nacional: 1510
- PDI Cibercrimen: +56 2 2708 0658
- APDP: contacto@apdp.gob.cl
- SERNAC: 800 700 100

Tipo de incidente reportado: {incidentType || 'no especificado'}`,
  },
};
