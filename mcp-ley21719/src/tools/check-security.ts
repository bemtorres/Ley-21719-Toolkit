import { z } from 'zod';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { detectProject } from '../scanner/project-detect.js';

export const checkSecuritySchema = {
  path: z.string().describe('Absolute path to the project root directory'),
};

export function checkSecurity(args: { path: string }) {
  const projectPath = path.resolve(args.path);
  if (!fs.existsSync(projectPath)) {
    return { content: [{ type: 'text' as const, text: `Error: Path does not exist: ${projectPath}` }] };
  }

  const project = detectProject(projectPath);
  const findings: string[] = [];
  const controls = {
    encryptionAtRest: false,
    encryptionInTransit: false,
    mfa: false,
    auditLogs: false,
    weakHash: false,
    hardcodedSecrets: false,
  };

  for (const filePath of project.files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.tsx', '.js', '.jsx', '.py', '.php', '.go', '.java'].includes(ext)) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = filePath.replace(projectPath, '').replace(/^[\/\\]/, '');

      // Encryption at rest
      if (/AES[-\s]?256|aes[-\s]?256|encrypt.*at.*rest|cipher.*aes|ENCRYPT\s*\(|\.encrypt\(/gi.test(content)) {
        controls.encryptionAtRest = true;
        findings.push(`✅ **${relPath}**: Cifrado en reposo detectado.`);
      }

      // Weak hashing
      if (/md5\(|MD5\(|sha1\(|SHA1\((?!.*hmac)/gi.test(content)) {
        controls.weakHash = true;
        findings.push(`❌ **${relPath}**: Hash débil detectado (MD5/SHA1). Usar bcrypt o argon2.`);
      }

      // Encryption in transit
      if (/https|TLS[\s\-]?1\.[23]|HSTS|Strict[-\s]Transport/gi.test(content)) {
        controls.encryptionInTransit = true;
      }

      // MFA
      if (/mfa|multi[_\-]?factor|2fa|two[_\-]?factor|otp|totp|authenticator/gi.test(content)) {
        controls.mfa = true;
        findings.push(`✅ **${relPath}**: MFA/2FA detectado.`);
      }

      // Audit logs
      if (/audit[_\-]?log|activity[_\-]?log|access[_\-]?log|winston|bunyan|pino|log4j|structlog|loguru/gi.test(content)) {
        controls.auditLogs = true;
        findings.push(`✅ **${relPath}**: Sistema de logs de auditoría detectado.`);
      }

      // Hardcoded secrets
      if (/password\s*[:=]\s*["'][^"']+["']|secret\s*[:=]\s*["'][^"']+["']|api[_\-]?key\s*[:=]\s*["'][^"']+["']/gi.test(content)) {
        controls.hardcodedSecrets = true;
        findings.push(`❌ **${relPath}**: Posible secreto hardcodeado detectado. Usar variables de entorno.`);
      }

      // LocalStorage tokens
      if (/localStorage\.setItem|sessionStorage\.setItem/gi.test(content)) {
        findings.push(`❌ **${relPath}**: Tokens en localStorage/sessionStorage detectado. Usar cookies HttpOnly.`);
      }

    } catch { /* skip */ }
  }

  const implemented = [controls.encryptionAtRest, controls.encryptionInTransit, controls.mfa, controls.auditLogs].filter(Boolean).length;
  const score = Math.round((implemented / 4) * 100);

  const report = [
    '# Verificación de Seguridad Técnica — Ley 21.719',
    '',
    `## Score: ${score}% (${implemented}/4 controles de seguridad implementados)`,
    '',
    ...findings,
    '',
    '## Estado de Controles',
    '',
    '| Control | Estado |',
    '|---------|--------|',
    `| SEC-1: Cifrado en reposo (AES-256) | ${controls.encryptionAtRest ? '✅' : '❌'} |`,
    `| SEC-2: Cifrado en tránsito (TLS 1.3) | ${controls.encryptionInTransit ? '✅' : '⚠️ Verificar'} |`,
    `| SEC-3: Autenticación multifactor (MFA) | ${controls.mfa ? '✅' : '❌'} |`,
    `| SEC-4: Logs de auditoría inmutables | ${controls.auditLogs ? '✅' : '❌'} |`,
    '',
    '## Alertas',
    '',
    controls.weakHash ? '- ⚠️ Se detectaron hashes débiles (MD5/SHA1). Migrar a bcrypt/argon2.' : '',
    controls.hardcodedSecrets ? '- ⚠️ Se detectaron posibles secretos hardcodeados. Migrar a variables de entorno.' : '',
    '',
    '---',
    '*Generado por MCP Server Ley 21.719*',
  ].join('\n');

  return { content: [{ type: 'text' as const, text: report }] };
}
