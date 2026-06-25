import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ScanContext, ControlFinding, AuditResult, DimensionResult, ProjectInfo } from '../types/index.js';
import { detectProject } from './project-detect.js';
import { SCAN_RULES, evaluateRules } from './regex-rules.js';

const EXTENSION_MAP: Record<string, string> = {
  '.ts': 'typescript', '.tsx': 'typescript',
  '.js': 'javascript', '.jsx': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
  '.py': 'python',
  '.php': 'php',
  '.go': 'go',
  '.java': 'java',
  '.rb': 'ruby',
  '.rs': 'rust',
  '.cs': 'csharp',
  '.html': 'html', '.htm': 'html',
  '.vue': 'vue',
  '.svelte': 'svelte',
};

const SCAN_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.php', '.go', '.java', '.rb', '.rs', '.cs',
  '.html', '.htm', '.vue', '.svelte',
]);

const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git[\/\\]/,
  /dist[\/\\]/,
  /build[\/\\]/,
  /\.next[\/\\]/,
  /vendor[\/\\]/,
  /__pycache__/,
  /\.venv[\/\\]/,
  /coverage[\/\\]/,
  /min\.js$/,
  /\.min\.css$/,
  /\.map$/,
  /\.d\.ts$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
];

const DIMENSION_MAP: Record<string, { title: string; controlIds: string[] }> = {
  lbc: { title: 'Licitud y Consentimiento', controlIds: ['LBC-1', 'LBC-2', 'LBC-3', 'LBC-4'] },
  arc: { title: 'Derechos ARCO-P', controlIds: ['ARC-1', 'ARC-2', 'ARC-3', 'ARC-4'] },
  sec: { title: 'Seguridad Técnica', controlIds: ['SEC-1', 'SEC-2', 'SEC-3', 'SEC-4'] },
  dat: { title: 'Gestión de Datos', controlIds: ['DAT-1', 'DAT-2', 'DAT-3', 'DAT-4'] },
  app: { title: 'Seguridad de Aplicación', controlIds: ['APP-1', 'APP-2', 'APP-3', 'APP-4'] },
  gov: { title: 'Gobernanza y Cumplimiento', controlIds: ['GOV-1', 'GOV-2', 'GOV-3', 'GOV-4'] },
};

export function scanProject(projectPath: string): AuditResult {
  const projectInfo = detectProject(projectPath);
  const findings: ControlFinding[] = [];

  for (const filePath of projectInfo.files) {
    if (IGNORE_PATTERNS.some(p => p.test(filePath))) continue;

    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_EXTENSIONS.has(ext)) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.length > 500000) continue;

      const language = EXTENSION_MAP[ext] || 'unknown';
      const ctx: ScanContext = {
        filePath: filePath.replace(projectPath, '').replace(/^[\/\\]/, ''),
        content,
        language,
        framework: projectInfo.framework,
      };

      for (const ruleGroup of SCAN_RULES) {
        const finding = evaluateRules(ctx, ruleGroup.rules);
        if (finding) {
          finding.recommendation = getRecommendation(finding.controlCode, finding.status);
          finding.actions = getActions(finding.controlCode, finding.status);
          findings.push(finding);
        }
      }
    } catch { /* skip unreadable files */ }
  }

  // Build dimensions
  const dimensions: DimensionResult[] = [];
  let totalScore = 0;
  const summary = { total: 24, complies: 0, partial: 0, fails: 0, notApplicable: 0 };

  for (const [dimId, dimInfo] of Object.entries(DIMENSION_MAP)) {
    const dimFindings = dimInfo.controlIds.map(controlId => {
      const controlFindings = findings.filter(f => f.controlCode === controlId);
      if (controlFindings.length === 0) {
        return {
          controlId,
          controlCode: controlId,
          status: 'not_applicable' as const,
          message: 'No se encontraron archivos relevantes para este control',
          recommendation: 'Revisar manualmente la implementación de este control',
          actions: [],
        };
      }
      // Priority: fails > partial > complies
      if (controlFindings.some(f => f.status === 'fails')) return controlFindings.find(f => f.status === 'fails')!;
      if (controlFindings.some(f => f.status === 'partial')) return controlFindings.find(f => f.status === 'partial')!;
      return controlFindings.find(f => f.status === 'complies')!;
    });

    let score = 0;
    let scored = 0;
    for (const f of dimFindings) {
      if (f.status === 'complies') { score += 100; scored++; }
      else if (f.status === 'partial') { score += 50; scored++; }
      else if (f.status === 'fails') { score += 0; scored++; }
      else { /* not_applicable - don't count */ }

      if (f.status === 'complies') summary.complies++;
      else if (f.status === 'partial') summary.partial++;
      else if (f.status === 'fails') summary.fails++;
      else summary.notApplicable++;
    }

    const dimScore = scored > 0 ? Math.round(score / scored) : 100;
    dimensions.push({ id: dimId, title: dimInfo.title, score: dimScore, findings: dimFindings });
    totalScore += dimScore;
  }

  const overallScore = Math.round(totalScore / dimensions.length);
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (overallScore < 50) riskLevel = 'high';
  else if (overallScore < 85) riskLevel = 'medium';

  return {
    projectPath,
    projectName: path.basename(projectPath),
    detectedFramework: projectInfo,
    timestamp: new Date().toISOString(),
    overallScore,
    riskLevel,
    dimensions,
    summary,
  };
}

function getRecommendation(controlId: string, status: string): string {
  if (status === 'complies') return 'El control parece estar implementado correctamente.';
  const recommendations: Record<string, string> = {
    'LBC-1': 'Asegurar que todas las casillas de consentimiento estén desmarcadas por defecto. Nunca usar pre-checked.',
    'LBC-2': 'Crear un registro de bases legales para cada tratamiento de datos.',
    'LBC-3': 'Implementar un mecanismo fácil y accesible para que los usuarios revocuen su consentimiento.',
    'LBC-4': 'Implementar consentimiento explícito e inequívoco para datos sensibles (salud, biométricos).',
    'ARC-1': 'Crear un endpoint /api/data-access para que los titulares soliciten sus datos.',
    'ARC-2': 'Crear un endpoint /api/update-profile para que los titulares corrijan sus datos.',
    'ARC-3': 'Crear un endpoint /api/delete-account con flujo de verificación de identidad.',
    'ARC-4': 'Implementar exportación de datos en formato JSON/CSV estructurado.',
    'SEC-1': 'Implementar cifrado AES-256 para datos sensibles en reposo.',
    'SEC-2': 'Asegurar que toda la comunicación use TLS 1.2+ y HTTPS.',
    'SEC-3': 'Implementar autenticación multifactor (TOTP/WebAuthn) para cuentas sensibles.',
    'SEC-4': 'Implementar logs de auditoría inmutables para accesos a datos personales.',
    'DAT-1': 'Crear un Registro de Actividades de Tratamiento (RAT/RoPA) documentado.',
    'DAT-2': 'Definir y documentar períodos de retención para cada categoría de datos.',
    'DAT-3': 'Implementar anonimización o pseudonimización para datos en desarrollo/testing.',
    'DAT-4': 'Realizar Evaluación de Impacto en Protección de Datos (EIPD) para tratamientos de alto riesgo.',
    'APP-1': 'Usar consultas parametrizadas/prepared statements. Nunca concatenar inputs en queries.',
    'APP-2': 'Implementar validación y sanitización de todos los inputs con Zod, Joi o similar.',
    'APP-3': 'Configurar cookies con flags: HttpOnly, Secure, SameSite=Strict. No usar localStorage para tokens.',
    'APP-4': 'Usar bcrypt, argon2 o scrypt para hashear contraseñas. Nunca MD5/SHA1.',
    'GOV-1': 'Designar formalmente un Delegado de Protección de Datos (DPD) con autonomía.',
    'GOV-2': 'Publicar una política de privacidad completa y accesible.',
    'GOV-3': 'Firmar Contratos de Encargado de Tratamiento (DPA) con todos los proveedores.',
    'GOV-4': 'Crear un protocolo documentado de respuesta a incidentes con plazos de 72 horas.',
  };
  return recommendations[controlId] || 'Revisar la implementación de este control.';
}

function getActions(controlId: string, status: string): string[] {
  if (status === 'complies') return [];
  const actions: Record<string, string[]> = {
    'LBC-1': ['Remover atributo "checked" de checkboxes de consentimiento', 'Separar consentimiento de marketing del aceptado de términos'],
    'LBC-2': ['Documentar base legal para cada tratamiento en un Registro de Actividades'],
    'LBC-3': ['Agregar botón/enlace de "Revocar Consentimiento" en el perfil del usuario'],
    'LBC-4': ['Implementar flujo de consentimiento explícito para datos de salud y biométricos'],
    'ARC-1': ['Crear endpoint GET /api/data-access que retorne todos los datos del usuario'],
    'ARC-2': ['Crear endpoint PATCH /api/update-profile para corrección de datos'],
    'ARC-3': ['Crear endpoint DELETE /api/delete-account con verificación de identidad'],
    'ARC-4': ['Implementar exportación en JSON/CSV con estructura clara'],
    'SEC-1': ['Implementar cifrado AES-256 para datos en reposo'],
    'SEC-2': ['Configurar TLS 1.2+ y redirect HTTP a HTTPS'],
    'SEC-3': ['Integrar TOTP (Google Authenticator) o WebAuthn'],
    'SEC-4': ['Implementar logging estructurado con timestamp, user_id, acción realizada'],
    'DAT-1': ['Crear documento RAT/RoPA con: finalidad, base legal, categorías, destinatarios, plazos'],
    'DAT-2': ['Definir TTL para cada categoría de datos y programar eliminación automática'],
    'DAT-3': ['Implementar pseudonimización para datos en entornos de desarrollo'],
    'DAT-4': ['Realizar EIPD para tratamientos con datos sensibles o alto riesgo'],
    'APP-1': ['Reemplazar concatenación por queries parametrizadas'],
    'APP-2': ['Integrar Zod/Joi para validación de inputs en todos los endpoints'],
    'APP-3': ['Configurar cookies: HttpOnly, Secure, SameSite=Strict; eliminar tokens de localStorage'],
    'APP-4': ['Migrar de MD5/SHA1 a bcrypt (cost=12) o argon2id'],
    'GOV-1': ['Redactar acta de nombramiento del DPD y publicar contacto'],
    'GOV-2': ['Crear política de privacidad completa con: finalidades, derechos, contacto DPD, plazos'],
    'GOV-3': ['Firmar DPA con cláusulas estándar con cada proveedor de datos'],
    'GOV-4': ['Crear runbook de respuesta a incidentes con pasos, contactos y plazos'],
  };
  return actions[controlId] || ['Revisar manualmente'];
}
