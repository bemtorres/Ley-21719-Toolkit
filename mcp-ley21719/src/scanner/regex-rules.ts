import type { ScanRule, ScanContext, ControlFinding } from '../types/index.js';

interface RuleGroup {
  controlId: string;
  rules: ScanRule[];
}

function matchFile(ctx: ScanContext, rule: ScanRule): boolean {
  if (rule.filePatterns && rule.filePatterns.length > 0) {
    return rule.filePatterns.some(p => ctx.filePath.includes(p));
  }
  return true;
}

export function evaluateRules(ctx: ScanContext, rules: ScanRule[]): ControlFinding | null {
  for (const rule of rules) {
    if (!matchFile(ctx, rule)) continue;
    const match = ctx.content.match(rule.pattern);
    if (match) {
      const lines = ctx.content.substring(0, match.index ?? 0).split('\n');
      const line = lines.length;
      const snippet = extractSnippet(ctx.content, match.index ?? 0, match[0].length);
      return {
        controlId: rule.id,
        controlCode: rule.id,
        status: rule.status,
        message: rule.message,
        file: ctx.filePath,
        line,
        snippet,
        recommendation: '',
        actions: [],
      };
    }
  }
  return null;
}

function extractSnippet(content: string, index: number, length: number): string {
  const start = Math.max(0, index - 80);
  const end = Math.min(content.length, index + length + 80);
  let snippet = content.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';
  return snippet.trim();
}

export const SCAN_RULES: RuleGroup[] = [
  // LBC-1: Consent checkboxes must be unchecked by default
  {
    controlId: 'LBC-1',
    rules: [
      { id: 'LBC-1', pattern: /<input[^>]*type=["']checkbox["'][^>]*checked/gi, status: 'fails', message: 'Checkbox pre-marcado detectado (checked attribute)', filePatterns: ['.html', '.vue', '.jsx', '.tsx', '.svelte'] },
      { id: 'LBC-1', pattern: /<input[^>]*checked[^>]*type=["']checkbox["']/gi, status: 'fails', message: 'Checkbox pre-marcado detectado', filePatterns: ['.html', '.vue', '.jsx', '.tsx', '.svelte'] },
      { id: 'LBC-1', pattern: /defaultChecked\s*[=:]\s*\{?\s*true/g, status: 'fails', message: 'defaultChecked={true} detectado en React', filePatterns: ['.jsx', '.tsx'] },
      { id: 'LBC-1', pattern: /v-model[^>]*checked/gi, status: 'partial', message: 'Checkbox con v-model requiere verificación manual', filePatterns: ['.vue'] },
      { id: 'LBC-1', pattern: /<input[^>]*type=["']checkbox["'](?![^>]*checked)/gi, status: 'complies', message: 'Checkbox sin pre-marcado detectado', filePatterns: ['.html', '.vue', '.jsx', '.tsx', '.svelte'] },
    ],
  },

  // LBC-2: Legal basis registry
  {
    controlId: 'LBC-2',
    rules: [
      { id: 'LBC-2', pattern: /legal[_\-]?basis|base[_\-]?legal|licitud|lawful|consent[_\-]?record/gi, status: 'complies', message: 'Registro de bases legales detectado' },
      { id: 'LBC-2', pattern: /lgpd|gdpr|21[\.\s]?719|proteccion[_\-]?datos/gi, status: 'complies', message: 'Referencia a regulación de datos detectada' },
    ],
  },

  // LBC-3: Consent revocation mechanism
  {
    controlId: 'LBC-3',
    rules: [
      { id: 'LBC-3', pattern: /revoc|unsubscribe|opt[_\-]?out|darse[_\-]?de[_\-]?baja|cancel[_\-]?subscription|desuscri/gi, status: 'complies', message: 'Mecanismo de revocación de consentimiento detectado' },
      { id: 'LBC-3', pattern: /revoke[_\-]?consent|withdraw[_\-]?consent|revocar[_\-]?consentimiento/gi, status: 'complies', message: 'Función de revocación de consentimiento detectada' },
    ],
  },

  // LBC-4: Explicit consent for sensitive data
  {
    controlId: 'LBC-4',
    rules: [
      { id: 'LBC-4', pattern: /explicit[_\-]?consent|consentimiento[_\-]?expli[cí]to|sensitive[_\-]?data[_\-]?consent/gi, status: 'complies', message: 'Consentimiento explícito para datos sensibles detectado' },
      { id: 'LBC-4', pattern: /health[_\-]?data|datos[_\-]?sensibles|sensitive[_\-]?data|biometric/gi, status: 'partial', message: 'Manejo de datos sensibles detectado - requiere verificación de consentimiento explícito' },
    ],
  },

  // ARC-1: Access endpoint
  {
    controlId: 'ARC-1',
    rules: [
      { id: 'ARC-1', pattern: /\/(api\/)?(data[_\-]?access|acceso[_\-]?datos|subject[_\-]?access|dsar)/gi, status: 'complies', message: 'Endpoint de solicitud de acceso a datos detectado' },
      { id: 'ARC-1', pattern: /get[_\-]?user[_\-]?data|fetch[_\-]?personal[_\-]?data|export[_\-]?data|descargar[_\-]?datos/gi, status: 'complies', message: 'Función de exportación de datos detectada' },
      { id: 'ARC-1', pattern: /right[_\-]?to[_\-]?access|derecho[_\-]?acceso/gi, status: 'complies', message: 'Referencia al derecho de acceso detectada' },
    ],
  },

  // ARC-2: Rectification endpoint
  {
    controlId: 'ARC-2',
    rules: [
      { id: 'ARC-2', pattern: /\/(api\/)?(update[_\-]?user|edit[_\-]?profile|rectif|update[_\-]?personal|actualizar[_\-]?datos)/gi, status: 'complies', message: 'Endpoint de rectificación detectado' },
      { id: 'ARC-2', pattern: /PATCH.*user|PUT.*profile|update.*email|update.*name/gi, status: 'partial', message: 'Operación de actualización detectada - verificar que cubre rectificación' },
    ],
  },

  // ARC-3: Deletion endpoint
  {
    controlId: 'ARC-3',
    rules: [
      { id: 'ARC-3', pattern: /\/(api\/)?(delete[_\-]?user|erase[_\-]?data|suprim|remove[_\-]?account|eliminar[_\-]?cuenta|borrar[_\-]?datos)/gi, status: 'complies', message: 'Endpoint de eliminación de datos detectado' },
      { id: 'ARC-3', pattern: /DELETE.*user|\.destroy\(|\.delete\(|hard[_\-]?delete|soft[_\-]?delete|gdpr[_\-]?delete/gi, status: 'partial', message: 'Operación de eliminación detectada' },
      { id: 'ARC-3', pattern: /account[_\-]?deletion|delete[_\-]?my[_\-]?data|right[_\-]?to[_\-]?be[_\-]?forgotten|derecho[_\-]?olvido/gi, status: 'complies', message: 'Mecanismo de derecho al olvido detectado' },
    ],
  },

  // ARC-4: Portability endpoint
  {
    controlId: 'ARC-4',
    rules: [
      { id: 'ARC-4', pattern: /\/(api\/)?(export[_\-]?data|download[_\-]?data|portab|data[_\-]?portab|exportar[_\-]?datos)/gi, status: 'complies', message: 'Endpoint de portabilidad detectado' },
      { id: 'ARC-4', pattern: /json[_\-]?export|csv[_\-]?export|json[_\-]?format.*download|export.*json/gi, status: 'complies', message: 'Exportación en formato estructurado detectada' },
    ],
  },

  // SEC-1: Encryption at rest
  {
    controlId: 'SEC-1',
    rules: [
      { id: 'SEC-1', pattern: /AES[-\s]?256|aes[-\s]?256|encrypt.*at.*rest|cipher.*aes/gi, status: 'complies', message: 'Cifrado AES-256 detectado' },
      { id: 'SEC-1', pattern: /ENCRYPT\s*\(|\.encrypt\(|encryption[_\-]?key|chave[_\-]?criptografia/gi, status: 'complies', message: 'Función de cifrado detectada' },
      { id: 'SEC-1', pattern: /md5(?![\s]*hash)|sha1(?!.*hmac)|MD5\(|SHA1\(/gi, status: 'fails', message: 'Hash débil detectado (MD5/SHA1) - usar bcrypt o argon2' },
    ],
  },

  // SEC-2: Encryption in transit
  {
    controlId: 'SEC-2',
    rules: [
      { id: 'SEC-2', pattern: /https|TLS[\s\-]?1\.[23]|ssl|HSTS|Strict[-\s]Transport/gi, status: 'complies', message: 'Cifrado en tránsito (TLS/HTTPS) detectado' },
      { id: 'SEC-2', pattern: /http:[\/]{2}(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/gi, status: 'partial', message: 'URL HTTP sin TLS detectada (verificar si es solo desarrollo)' },
    ],
  },

  // SEC-3: MFA / 2FA
  {
    controlId: 'SEC-3',
    rules: [
      { id: 'SEC-3', pattern: /mfa|multi[_\-]?factor|2fa|two[_\-]?factor|otp|totp|authenticator|sms[_\-]?code|verificacion[_\-]?sms/gi, status: 'complies', message: 'Autenticación multifactor (MFA/2FA) detectada' },
      { id: 'SEC-3', pattern: /sms[_\-]?verif|phone[_\-]?verif|email[_\-]?verif|código[_\-]?verif/gi, status: 'partial', message: 'Verificación por SMS/email detectada - considerar TOTP/WebAuthn' },
    ],
  },

  // SEC-4: Audit logs
  {
    controlId: 'SEC-4',
    rules: [
      { id: 'SEC-4', pattern: /audit[_\-]?log|activity[_\-]?log|access[_\-]?log|login[_\-]?log|bitacora|log[_\-]?inmutable|append[_\-]?only/gi, status: 'complies', message: 'Logs de auditoría detectados' },
      { id: 'SEC-4', pattern: /winston|bunyan|pino|log4j|slf4j|logging\.getLogger|structlog|loguru/gi, status: 'complies', message: 'Librería de logging detectada' },
      { id: 'SEC-4', pattern: /console\.log|print\(|fmt\.Print|System\.out\.println/gi, status: 'partial', message: 'console.log/print detectado - usar framework de logging estructurado' },
    ],
  },

  // DAT-1: Data processing registry (RoPA/RAT)
  {
    controlId: 'DAT-1',
    rules: [
      { id: 'DAT-1', pattern: /ropa|rat|registro[_\-]?actividades[_\-]?tratamiento|data[_\-]?processing[_\-]?registry|records[_\-]?of[_\-]?processing/gi, status: 'complies', message: 'Registro de Actividades de Tratamiento (RAT/RoPA) detectado' },
      { id: 'DAT-1', pattern: /privacy[_\-]?impact|eipd|dpia|evaluacion[_\-]?impacto/gi, status: 'complies', message: 'Evaluación de Impacto detectada' },
    ],
  },

  // DAT-2: Data retention policy
  {
    controlId: 'DAT-2',
    rules: [
      { id: 'DAT-2', pattern: /retention[_\-]?period|periodo[_\-]?retencion|data[_\-]?retention|politica[_\-]?retencion|ttl|time[_\-]?to[_\-]?live|expire|expir/gi, status: 'complies', message: 'Política de retención de datos detectada' },
      { id: 'DAT-2', pattern: /auto[_\-]?delete|purge|cleanup|borrado[_\-]?automatico|eliminacion[_\-]?periodica/gi, status: 'complies', message: 'Mecanismo de eliminación automática detectado' },
    ],
  },

  // DAT-3: Anonymization/pseudonymization
  {
    controlId: 'DAT-3',
    rules: [
      { id: 'DAT-3', pattern: /anonymiz|pseudonymiz|anonimiz|pseudonimiz|masking|mascarar|redact|k[-\s]?anonymity/gi, status: 'complies', message: 'Anonimización/pseudonimización detectada' },
      { id: 'DAT-3', pattern: /hash.*email|hash.*rut|hash.*user[_\-]?id| tokenize/gi, status: 'complies', message: 'Tokenización/hash de identificadores detectado' },
    ],
  },

  // DAT-4: DPIA
  {
    controlId: 'DAT-4',
    rules: [
      { id: 'DAT-4', pattern: /eipd|dpia|impact[_\-]?assessment|evaluacion[_\-]?impacto[_\-]?proteccion|privacy[_\-]?impact/gi, status: 'complies', message: 'Evaluación de Impacto en Protección de Datos (EIPD/DPIA) detectada' },
    ],
  },

  // APP-1: SQL injection protection
  {
    controlId: 'APP-1',
    rules: [
      { id: 'APP-1', pattern: /prepare|parameterized|prepared[_\-]?statement|\.execute\(|\.query\(|cursor\.execute|sanitize|escape|sql[_\-]?injection/gi, status: 'complies', message: 'Protección contra inyección SQL detectada' },
      { id: 'APP-1', pattern: /SELECT.*FROM.*\+|INSERT.*VALUES.*\+|".*SELECT.*\{|`.*SELECT.*\$/gi, status: 'fails', message: 'Concatenación en queries SQL detectada (riesgo de inyección)' },
      { id: 'APP-1', pattern: /query\s*\(\s*[`"'].*\$\{|query\s*\(\s*["'].*\+\s*\w/gi, status: 'fails', message: 'Interpolación directa en query SQL detectada' },
    ],
  },

  // APP-2: Input validation
  {
    controlId: 'APP-2',
    rules: [
      { id: 'APP-2', pattern: /validat|sanitiz|zod\.|joi\.|yup\.|ajv|class-validator|validator\.|escape[_\-]?html|DOMPurify|bleach/gi, status: 'complies', message: 'Validación/sanitización de inputs detectada' },
      { id: 'APP-2', pattern: /req\.body\[|request\.form\[|params\[|query\[/gi, status: 'partial', message: 'Acceso directo a inputs detectado - verificar validación' },
    ],
  },

  // APP-3: Session management
  {
    controlId: 'APP-3',
    rules: [
      { id: 'APP-3', pattern: /httpOnly|secure[_\-]?cookie|same[_\-]?site|session[_\-]?timeout|session[_\-]?expire|jwt.*exp|token.*expir/gi, status: 'complies', message: 'Gestión segura de sesiones detectada' },
      { id: 'APP-3', pattern: /localStorage\.setItem|sessionStorage\.setItem/gi, status: 'fails', message: 'Almacenamiento en localStorage/sessionStorage detectado (inseguro para tokens)' },
      { id: 'APP-3', pattern: /cookie[^;]*[;\s]*Secure|Set-Cookie.*Secure/gi, status: 'complies', message: 'Cookie con flag Secure detectada' },
    ],
  },

  // APP-4: Password hashing
  {
    controlId: 'APP-4',
    rules: [
      { id: 'APP-4', pattern: /bcrypt|argon2|scrypt|pbkdf2|crypto\.scrypt/gi, status: 'complies', message: 'Hash de contraseñas seguro detectado (bcrypt/argon2)' },
      { id: 'APP-4', pattern: /md5\(|SHA1\(|sha1\(|MD5\(/gi, status: 'fails', message: 'Hash inseguro para contraseñas detectado (MD5/SHA1)' },
      { id: 'APP-4', pattern: /password.*=.*["'][^"']+["']|clave.*=.*["'][^"']+["']|secret.*=.*["'][^"']+["']/gi, status: 'fails', message: 'Contraseña hardcodeada detectada' },
    ],
  },

  // GOV-1: DPO appointment
  {
    controlId: 'GOV-1',
    rules: [
      { id: 'GOV-1', pattern: /dpo|dpd|delegado[_\-]?proteccion|data[_\-]?protection[_\-]?officer|proteccion[_\-]?datos/gi, status: 'complies', message: 'Referencia al DPD/DPO detectada' },
    ],
  },

  // GOV-2: Privacy policy
  {
    controlId: 'GOV-2',
    rules: [
      { id: 'GOV-2', pattern: /privacy[_\-]?policy|politica[_\-]?privacidad|aviso[_\-]?privacidad|politica[_\-]?proteccion/gi, status: 'complies', message: 'Política de privacidad detectada' },
      { id: 'GOV-2', pattern: /privacy|privacidad|proteccion[_\-]?datos/gi, status: 'partial', message: 'Posible referencia a privacidad - verificar existencia de política completa' },
    ],
  },

  // GOV-3: DPA with processors
  {
    controlId: 'GOV-3',
    rules: [
      { id: 'GOV-3', pattern: /dpa|data[_\-]?processing[_\-]?agreement|contrato[_\-]?encargado|processor[_\-]?agreement|clausulas[_\-]?contractuales/gi, status: 'complies', message: 'Contrato de Encargado de Tratamiento (DPA) detectado' },
    ],
  },

  // GOV-4: Incident response plan
  {
    controlId: 'GOV-4',
    rules: [
      { id: 'GOV-4', pattern: /incident[_\-]?response|breach[_\-]?notification|respuesta[_\-]?incidente|notificacion[_\-]?brecha|72[_\-]?horas|72[_\-]?hours/gi, status: 'complies', message: 'Plan de respuesta a incidentes detectado' },
      { id: 'GOV-4', pattern: /security[_\-]?incident|data[_\-]?breach|violacion[_\-]?datos|filtracion[_\-]?datos/gi, status: 'partial', message: 'Referencia a incidentes de seguridad detectada - verificar protocolo completo' },
    ],
  },
];
