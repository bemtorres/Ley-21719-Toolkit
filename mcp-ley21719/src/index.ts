#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { auditProject, auditProjectSchema } from './tools/audit-project.js';
import { checkConsent, checkConsentSchema } from './tools/check-consent.js';
import { checkArcoP, checkArcoPSchema } from './tools/check-arco-p.js';
import { checkSecurity, checkSecuritySchema } from './tools/check-security.js';
import { checkStorage, checkStorageSchema } from './tools/check-storage.js';
import { generateReport, generateReportSchema } from './tools/generate-report.js';

import {
  frameworkResource,
  principlesResource,
  rightsResource,
  sanctionsResource,
} from './resources/index.js';

import {
  fullAuditPrompt,
  quickCheckPrompt,
  breachResponsePrompt,
} from './prompts/index.js';

const server = new McpServer({
  name: 'mcp-ley21719',
  version: '1.0.0',
  description: '[EN CONSTRUCCIÓN / PROTOTIPO DE EJEMPLO] MCP Server for automated Ley 21.719 (Chile Data Protection) compliance auditing. Scans codebases against 24 technical controls.',
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  },
});

// ─── TOOLS ──────────────────────────────────────────────

server.tool(
  'audit-project',
  'Run a full compliance audit of a project against all 24 controls of the Ley 21.719. Returns a detailed report with scores by dimension.',
  auditProjectSchema,
  async (args) => auditProject(args)
);

server.tool(
  'check-consent',
  'Verify that consent mechanisms comply with Ley 21.719 (unchecked checkboxes, granular consent, revocation).',
  checkConsentSchema,
  async (args) => checkConsent(args)
);

server.tool(
  'check-arco-p',
  'Check if the project implements all ARCO-P rights endpoints (Access, Rectification, Cancellation, Opposition, Portability).',
  checkArcoPSchema,
  async (args) => checkArcoP(args)
);

server.tool(
  'check-security',
  'Verify technical security measures: encryption at rest/transit, MFA, audit logs, password hashing.',
  checkSecuritySchema,
  async (args) => checkSecurity(args)
);

server.tool(
  'check-storage',
  'Check data storage and retention practices: RAT/RoPA, retention policies, anonymization, DPIA.',
  checkStorageSchema,
  async (args) => checkStorage(args)
);

server.tool(
  'generate-report',
  'Generate a formatted compliance report from audit results. Formats: markdown, json, executive.',
  generateReportSchema,
  async (args) => generateReport(args)
);

// ─── RESOURCES ──────────────────────────────────────────

server.resource(
  'framework',
  'ley21719://framework',
  { mimeType: 'application/json', description: 'Audit framework with 24 technical controls organized in 6 dimensions' },
  async () => ({
    contents: [{
      uri: frameworkResource.uri,
      mimeType: frameworkResource.mimeType,
      text: frameworkResource.content,
    }],
  })
);

server.resource(
  'principles',
  'ley21719://principles',
  { mimeType: 'text/plain', description: 'The 7 fundamental principles of data processing (Article 3)' },
  async () => ({
    contents: [{
      uri: principlesResource.uri,
      mimeType: principlesResource.mimeType,
      text: principlesResource.content,
    }],
  })
);

server.resource(
  'rights',
  'ley21719://rights',
  { mimeType: 'text/plain', description: 'ARCO-P rights of data subjects under Ley 21.719' },
  async () => ({
    contents: [{
      uri: rightsResource.uri,
      mimeType: rightsResource.mimeType,
      text: rightsResource.content,
    }],
  })
);

server.resource(
  'sanctions',
  'ley21719://sanctions',
  { mimeType: 'text/plain', description: 'Infractions and fines regime under Ley 21.719' },
  async () => ({
    contents: [{
      uri: sanctionsResource.uri,
      mimeType: sanctionsResource.mimeType,
      text: sanctionsResource.content,
    }],
  })
);

// ─── PROMPTS ────────────────────────────────────────────

server.prompt(
  'full-audit',
  'Complete compliance audit workflow: scan project → evaluate 24 controls → generate detailed report',
  { projectPath: z.string().describe('Absolute path to the project root') },
  async (args) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: fullAuditPrompt.content.text.replace('{projectPath}', args.projectPath),
      },
    }],
  })
);

server.prompt(
  'quick-check',
  'Quick compliance check of the 3 most critical controls: consent, passwords, and encryption',
  { projectPath: z.string().describe('Absolute path to the project root') },
  async (args) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: quickCheckPrompt.content.text.replace('{projectPath}', args.projectPath),
      },
    }],
  })
);

server.prompt(
  'breach-response',
  'Incident response protocol under Ley 21.719 (72-hour deadline)',
  { incidentType: z.string().optional().describe('Incident type: ransomware, phishing, data-leak, unauthorized-access') },
  async (args) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: breachResponsePrompt.content.text.replace('{incidentType || \'no especificado\'}', args.incidentType || 'no especificado'),
      },
    }],
  })
);

// ─── START ──────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server Ley 21.719 started successfully');
}

main().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
