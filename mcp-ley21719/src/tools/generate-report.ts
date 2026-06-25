import { z } from 'zod';
import type { AuditResult } from '../types/index.js';

export const generateReportSchema = {
  auditData: z.string().describe('JSON string of the AuditResult from audit-project'),
  format: z.enum(['markdown', 'json', 'executive']).optional().describe('Output format: markdown (default), json, or executive summary'),
};

export function generateReport(args: { auditData: string; format?: string }) {
  let result: AuditResult;
  try {
    result = JSON.parse(args.auditData);
  } catch {
    return { content: [{ type: 'text' as const, text: 'Error: Invalid JSON in auditData parameter.' }] };
  }

  const format = args.format || 'markdown';

  if (format === 'json') {
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  }

  if (format === 'executive') {
    return { content: [{ type: 'text' as const, text: formatExecutiveSummary(result) }] };
  }

  return { content: [{ type: 'text' as const, text: formatMarkdownReport(result) }] };
}

function formatExecutiveSummary(result: AuditResult): string {
  const lines: string[] = [];
  const riskLabel = result.riskLevel === 'high' ? 'ALTO' : result.riskLevel === 'medium' ? 'MEDIO' : 'BAJO';

  lines.push('# Resumen Ejecutivo — Cumplimiento Ley 21.719');
  lines.push('');
  lines.push(`**Proyecto:** ${result.projectName}`);
  lines.push(`**Fecha:** ${result.timestamp}`);
  lines.push('');
  lines.push(`## Nivel de Riesgo: ${riskLabel}`);
  lines.push(`**Score de cumplimiento:** ${result.overallScore}%`);
  lines.push('');
  lines.push('### Hallazgos Críticos');
  lines.push('');

  const criticalFindings = result.dimensions
    .flatMap(d => d.findings)
    .filter(f => f.status === 'fails');

  if (criticalFindings.length === 0) {
    lines.push('No se encontraron brechas críticas de cumplimiento.');
  } else {
    for (const f of criticalFindings.slice(0, 10)) {
      lines.push(`- **${f.controlCode}:** ${f.message}${f.file ? ` (${f.file})` : ''}`);
    }
  }

  lines.push('');
  lines.push('### Acciones Inmediatas Recomendadas');
  lines.push('');

  const priorities = result.dimensions
    .flatMap(d => d.findings)
    .filter(f => f.status === 'fails')
    .flatMap(f => f.actions)
    .slice(0, 5);

  for (const action of priorities) {
    lines.push(`1. ${action}`);
  }

  lines.push('');
  lines.push('---');
  lines.push('*Generado por MCP Server Ley 21.719*');

  return lines.join('\n');
}

function formatMarkdownReport(result: AuditResult): string {
  const lines: string[] = [];

  lines.push('# Informe Completo de Cumplimiento — Ley 21.719');
  lines.push('');
  lines.push(`**Proyecto:** ${result.projectName}`);
  lines.push(`**Ruta:** ${result.projectPath}`);
  lines.push(`**Fecha:** ${result.timestamp}`);
  lines.push(`**Score General:** ${result.overallScore}%`);
  lines.push('');

  lines.push('## Resumen por Dimensión');
  lines.push('');
  lines.push('| Dimensión | Score | Cumple | Parcial | Falla |');
  lines.push('|-----------|-------|--------|---------|-------|');

  for (const dim of result.dimensions) {
    const c = dim.findings.filter(f => f.status === 'complies').length;
    const p = dim.findings.filter(f => f.status === 'partial').length;
    const f = dim.findings.filter(f => f.status === 'fails').length;
    lines.push(`| ${dim.title} | ${dim.score}% | ${c} | ${p} | ${f} |`);
  }

  lines.push('');
  lines.push('## Detalle por Dimensión');
  lines.push('');

  for (const dim of result.dimensions) {
    lines.push(`### ${dim.title} (${dim.score}%)`);
    lines.push('');
    for (const finding of dim.findings) {
      const icon = finding.status === 'complies' ? '✅' : finding.status === 'partial' ? '⚠️' : finding.status === 'fails' ? '❌' : '⬜';
      lines.push(`${icon} **${finding.controlCode}:** ${finding.message}`);
      if (finding.file) lines.push(`  - Archivo: \`${finding.file}\``);
      if (finding.status !== 'complies' && finding.status !== 'not_applicable') {
        lines.push(`  - Recomendación: ${finding.recommendation}`);
      }
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*Generado por MCP Server Ley 21.719 — Auditoría Automática de Cumplimiento*');

  return lines.join('\n');
}
