import { z } from 'zod';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { scanProject } from '../scanner/file-scanner.js';

export const auditProjectSchema = {
  path: z.string().describe('Absolute path to the project root directory to audit'),
  language: z.string().optional().describe('Force language detection (typescript, javascript, python, php, go, java)'),
};

export function auditProject(args: { path: string; language?: string }) {
  const projectPath = path.resolve(args.path);

  if (!fs.existsSync(projectPath)) {
    return { content: [{ type: 'text' as const, text: `Error: Path does not exist: ${projectPath}` }] };
  }

  const stat = fs.statSync(projectPath);
  if (!stat.isDirectory()) {
    return { content: [{ type: 'text' as const, text: `Error: Path is not a directory: ${projectPath}` }] };
  }

  const result = scanProject(projectPath);

  const report = formatAuditReport(result);

  return { content: [{ type: 'text' as const, text: report }] };
}

function formatAuditReport(result: any): string {
  const lines: string[] = [];

  lines.push('# Informe de Auditoría — Ley 21.719');
  lines.push('');
  lines.push(`**Proyecto:** ${result.projectName}`);
  lines.push(`**Ruta:** ${result.projectPath}`);
  lines.push(`**Fecha:** ${result.timestamp}`);
  lines.push(`**Lenguaje detectado:** ${result.detectedFramework.language}`);
  lines.push(`**Framework detectado:** ${result.detectedFramework.framework}`);
  lines.push(`**Package manager:** ${result.detectedFramework.packageManager}`);
  lines.push(`**Total de archivos:** ${result.detectedFramework.totalFiles}`);
  lines.push('');

  // Overall score
  const riskEmoji = result.riskLevel === 'high' ? '🔴' : result.riskLevel === 'medium' ? '🟡' : '🟢';
  lines.push(`## Score General: ${result.overallScore}% ${riskEmoji}`);
  lines.push(`**Nivel de riesgo:** ${result.riskLevel.toUpperCase()}`);
  lines.push('');

  // Summary
  lines.push('## Resumen');
  lines.push(`- ✅ Cumple: ${result.summary.complies}`);
  lines.push(`- ⚠️ Parcial: ${result.summary.partial}`);
  lines.push(`- ❌ No cumple: ${result.summary.fails}`);
  lines.push(`- ⬜ No aplica: ${result.summary.notApplicable}`);
  lines.push('');

  // Dimensions
  lines.push('## Análisis por Dimensión');
  lines.push('');

  for (const dim of result.dimensions) {
    const bar = dim.score >= 85 ? '🟢' : dim.score >= 50 ? '🟡' : '🔴';
    lines.push(`### ${dim.title} — ${dim.score}% ${bar}`);
    lines.push('');

    for (const f of dim.findings) {
      const icon = f.status === 'complies' ? '✅' : f.status === 'partial' ? '⚠️' : f.status === 'fails' ? '❌' : '⬜';
      lines.push(`${icon} **${f.controlCode}:** ${f.message}`);
      if (f.file) lines.push(`   - Archivo: \`${f.file}\`${f.line ? ` (línea ${f.line})` : ''}`);
      if (f.snippet) lines.push(`   - Código: \`${f.snippet.substring(0, 120)}\``);
      if (f.status !== 'complies' && f.status !== 'not_applicable') {
        lines.push(`   - **Recomendación:** ${f.recommendation}`);
        if (f.actions.length > 0) {
          lines.push('   - **Acciones:**');
          for (const a of f.actions) lines.push(`     - ${a}`);
        }
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('*Generado por MCP Server Ley 21.719 — Auditoría Automática de Cumplimiento*');

  return lines.join('\n');
}
