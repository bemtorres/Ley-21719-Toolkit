import { z } from 'zod';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { detectProject } from '../scanner/project-detect.js';

export const checkArcoPSchema = {
  path: z.string().describe('Absolute path to the project root directory'),
};

export function checkArcoP(args: { path: string }) {
  const projectPath = path.resolve(args.path);
  if (!fs.existsSync(projectPath)) {
    return { content: [{ type: 'text' as const, text: `Error: Path does not exist: ${projectPath}` }] };
  }

  const project = detectProject(projectPath);
  const findings: string[] = [];
  const rights = {
    access: false,
    rectification: false,
    deletion: false,
    portability: false,
  };

  for (const filePath of project.files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.tsx', '.js', '.jsx', '.py', '.php', '.go', '.java'].includes(ext)) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = filePath.replace(projectPath, '').replace(/^[\/\\]/, '');

      // Access right
      if (/data[_\-]?access|acceso[_\-]?datos|get[_\-]?user[_\-]?data|export[_\-]?data|right[_\-]?to[_\-]?access/gi.test(content)) {
        rights.access = true;
        findings.push(`✅ **${relPath}**: Endpoint de acceso a datos detectado.`);
      }

      // Rectification right
      if (/update[_\-]?user|edit[_\-]?profile|rectif|actualizar[_\-]?datos|PATCH.*user/gi.test(content)) {
        rights.rectification = true;
        findings.push(`✅ **${relPath}**: Endpoint de rectificación detectado.`);
      }

      // Deletion right
      if (/delete[_\-]?user|erase[_\-]?data|suprim|eliminar[_\-]?cuenta|right[_\-]?to[_\-]?be[_\-]?forgotten|derecho[_\-]?olvido/gi.test(content)) {
        rights.deletion = true;
        findings.push(`✅ **${relPath}**: Endpoint de eliminación/derecho al olvido detectado.`);
      }

      // Portability right
      if (/export[_\-]?data|download[_\-]?data|portab|json[_\-]?export|csv[_\-]?export/gi.test(content)) {
        rights.portability = true;
        findings.push(`✅ **${relPath}**: Endpoint de portabilidad detectado.`);
      }

    } catch { /* skip */ }
  }

  // Missing rights
  if (!rights.access) findings.push('❌ **Acceso (A):** No se detectó endpoint para solicitud de acceso a datos. Crear GET /api/data-access.');
  if (!rights.rectification) findings.push('❌ **Rectificación (R):** No se detectó endpoint para corrección de datos. Crear PATCH /api/update-profile.');
  if (!rights.deletion) findings.push('❌ **Cancelación (C):** No se detectó endpoint para eliminación de datos. Crear DELETE /api/delete-account.');
  if (!rights.portability) findings.push('❌ **Portabilidad (P):** No se detectó endpoint para exportación de datos. Crear GET /api/export-data.');

  const implemented = Object.values(rights).filter(Boolean).length;
  const score = Math.round((implemented / 4) * 100);

  const report = [
    '# Verificación de Derechos ARCO-P — Ley 21.719',
    '',
    `## Score: ${score}% (${implemented}/4 derechos implementados)`,
    '',
    ...findings,
    '',
    '## Derechos Requeridos por la Ley 21.719',
    '',
    '| Derecho | Descripción | Estado |',
    '|---------|-------------|--------|',
    `| **A**cceso | Saber qué datos se tratan | ${rights.access ? '✅ Implementado' : '❌ Pendiente'} |`,
    `| **R**ectificación | Corregir datos inexactos | ${rights.rectification ? '✅ Implementado' : '❌ Pendiente'} |`,
    `| **C**ancelación | Eliminar datos innecesarios | ${rights.deletion ? '✅ Implementado' : '❌ Pendiente'} |`,
    `| **O**posición | Oponerse al tratamiento | ⚠️ Requiere revisión manual |`,
    `| **P**ortabilidad | Transferir datos a otro responsable | ${rights.portability ? '✅ Implementado' : '❌ Pendiente'} |`,
    '',
    '---',
    '*Generado por MCP Server Ley 21.719*',
  ].join('\n');

  return { content: [{ type: 'text' as const, text: report }] };
}
