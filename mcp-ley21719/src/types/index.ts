export type ControlSeverity = 'high' | 'medium';
export type FindingStatus = 'complies' | 'partial' | 'fails' | 'not_applicable';

export interface ControlFinding {
  controlId: string;
  controlCode: string;
  status: FindingStatus;
  message: string;
  file?: string;
  line?: number;
  snippet?: string;
  recommendation: string;
  actions: string[];
}

export interface DimensionResult {
  id: string;
  title: string;
  score: number;
  findings: ControlFinding[];
}

export interface AuditResult {
  projectPath: string;
  projectName: string;
  detectedFramework: ProjectInfo;
  timestamp: string;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  dimensions: DimensionResult[];
  summary: {
    total: number;
    complies: number;
    partial: number;
    fails: number;
    notApplicable: number;
  };
}

export interface ProjectInfo {
  language: string;
  framework: string;
  packageManager: string;
  hasTypeScript: boolean;
  hasTests: boolean;
  hasCI: boolean;
  files: string[];
  totalFiles: number;
}

export interface ScanRule {
  id: string;
  pattern: RegExp;
  status: FindingStatus;
  message: string;
  filePatterns?: string[];
}

export interface ScanContext {
  filePath: string;
  content: string;
  language: string;
  framework: string;
}
