import { z } from 'zod';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { detectProject } from '../scanner/project-detect.js';

export const checkStorageSchema = {
  path: z.string().describe('Absolute path to the project root directory'),
};

export function checkStorage(args: { path: string }) {
  const projectPath = path.resolve(args.path);
  if (!fs.existsSync(projectPath)) {
    return { content: [{ type: 'text' as const, text: `Error: Path does not exist: ${projectPath}` }] };
  }

  const project = detectProject(projectPath);
  const findings: string[] = [];
  const controls = {
    retentionPolicy: false,
    anonymization: false,
    dpia: false,
    ropa: false,
  };

  for (const filePath of project.files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.tsx', '.js', '.jsx', '.py', '.php', '.go', '.java', '.md', '.txt'].includes(ext)) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = filePath.replace(projectPath, '').replace(/^[\/\\]/, '');

      // Retention policy
      if (/retention[_\-]?period|periodo[_\-]?retencion|data[_\-]?retention|ttl|time[_\-]?to[_\-]?live|expire|auto[_\-]?delete|purge/gi.test(content)) {
        controls.retentionPolicy = true;
        findings.push(`✅ **${relPath}**: Política de retención de datos detectada.`);
      }

      // Anonymization
      if (/anonymiz|pseudonymiz|anonimiz|pseudonimiz|masking|mascarar|redact|k[-\s]?anonymity/gi.test(content)) {
        controls.anonymization = true;
        findings.push(`✅ **${relPath}**: Mecanismo de anonimización/pseudonimización detectado.`);
      }

      // DPIA
      if (/eipd|dpia|impact[_\-]?assessment|evaluacion[_\-]?impacto/gi.test(content)) {
        controls.dpia = true;
        findings.push(`✅ **${relPath}**: Evaluación de Impacto (EIPD/DPIA) detectada.`);
      }

      // RoPA/RAT
      if (/ropa|rat|registro[_\-]?actividades|data[_\-]?processing[_\-]?registry|records[_\-]?of[_\-]?processing/gi.test(content)) {
        controls.ropa = true;
        findings.push(`✅ **${relPath}**: Registro de Actividades de Tratamiento (RAT/RoPA) detectado.`);
      }

    } catch { /* skip */ }
  }

  const implemented = Object.values(controls).filter(Boolean).length;
  const score = Math.round((implemented / 4) * 100);

  const report = [
    '# Verificación de Almacenamiento y Retención — Ley 21.719',
    '',
    `## Score: ${score}% (${implemented}/4 controles de gestión de datos)`,
    '',
    ...findings,
    '',
    '## Estado de Controles',
    '',
    '| Control | Estado |',
    '|---------|--------|',
    `| DAT-1: Registro de Actividades de Tratamiento (RAT/RoPA) | ${controls.ropa ? '✅' : '❌'} |`,
    `| DAT-2: Política de retención de datos | ${controls.retentionPolicy ? '✅' : '❌'} |`,
    `| DAT-3: Anonimización/pseudonimización | ${controls.anonymization ? '✅' : '❌'} |`,
    `| DAT-4: Evaluación de Impacto (EIPD/DPIA) | ${controls.dpia ? '✅' : '❌'} |`,
    '',
    '## Recomendaciones',
    '',
    !controls.ropa ? '- Crear un documento RAT/RoPA que documente: finalidad, base legal, categorías de datos, destinatarios, plazos de conservación.' : '',
    !controls.retentionPolicy ? '- Definir períodos de retención para cada categoría de datos y programar eliminación automática.' : '',
    !controls.anonymization ? '- Implementar pseudonimización para datos en entornos de desarrollo y testing.' : '',
    !controls.dpia ? '- Realizar Evaluación de Impacto en Protección de Datos para tratamientos de alto riesgo.' : '',
    '',
    '---',
    '*Generado por MCP Server Ley 21.719*',
  ].join('\n');

  return { content: [{ type: 'text' as const, text: report }] };
}
