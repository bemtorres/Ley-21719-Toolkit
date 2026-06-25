import { z } from 'zod';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { detectProject } from '../scanner/project-detect.js';

export const checkConsentSchema = {
  path: z.string().describe('Absolute path to the project root directory'),
};

export function checkConsent(args: { path: string }) {
  const projectPath = path.resolve(args.path);
  if (!fs.existsSync(projectPath)) {
    return { content: [{ type: 'text' as const, text: `Error: Path does not exist: ${projectPath}` }] };
  }

  const project = detectProject(projectPath);
  const findings: string[] = [];

  for (const filePath of project.files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.html', '.vue', '.jsx', '.tsx', '.svelte', '.js', '.ts'].includes(ext)) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = filePath.replace(projectPath, '').replace(/^[\/\\]/, '');

      // Check for pre-checked checkboxes
      const preChecked = content.match(/<input[^>]*type=["']checkbox["'][^>]*checked/gi);
      if (preChecked) {
        findings.push(`❌ **${relPath}**: Checkbox pre-marcado detectado. Las casillas de consentimiento deben estar desmarcadas por defecto.`);
      }

      // Check for defaultChecked={true} in React
      const defaultChecked = content.match(/defaultChecked\s*[=:]\s*\{?\s*true/g);
      if (defaultChecked) {
        findings.push(`❌ **${relPath}**: defaultChecked={true} detectado en React. Usar defaultChecked={false} o no establecer el atributo.`);
      }

      // Check for unchecked checkboxes (good)
      const unchecked = content.match(/<input[^>]*type=["']checkbox["'](?![^>]*checked)/gi);
      if (unchecked && !preChecked) {
        findings.push(`✅ **${relPath}**: Checkboxes sin pre-marcado detectados (correcto).`);
      }

      // Check for consent mechanisms
      const consentPatterns = content.match(/consent|consentimiento|acepto|aceptar.*términos|accept.*terms/gi);
      if (consentPatterns) {
        findings.push(`ℹ️ **${relPath}**: Mecanismos de consentimiento detectados: ${[...new Set(consentPatterns)].join(', ')}`);
      }

      // Check for granular consent
      const granular = content.match(/granular|separad|independiente|individual|por.*finalidad/gi);
      if (granular) {
        findings.push(`✅ **${relPath}**: Consentimiento granular detectado.`);
      }

    } catch { /* skip */ }
  }

  if (findings.length === 0) {
    findings.push('No se encontraron archivos relevantes de consentimiento en el proyecto.');
  }

  const report = [
    '# Verificación de Consentimiento — Ley 21.719',
    '',
    '## Control LBC-1: Las casillas de consentimiento deben estar desmarcadas por defecto',
    '',
    ...findings,
    '',
    '---',
    '*Generado por MCP Server Ley 21.719*',
  ].join('\n');

  return { content: [{ type: 'text' as const, text: report }] };
}
