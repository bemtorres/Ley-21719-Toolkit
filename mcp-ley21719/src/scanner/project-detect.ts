import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ProjectInfo } from '../types/index.js';

const FRAMEWORK_MARKERS: Record<string, string[]> = {
  'react': ['react', 'next', 'gatsby', 'remix', 'vite'],
  'vue': ['vue', 'nuxt', 'vitepress'],
  'svelte': ['svelte', 'sveltekit'],
  'angular': ['@angular/core'],
  'express': ['express', 'fastify', 'koa', 'hapi'],
  'nestjs': ['@nestjs/core'],
  'django': ['django'],
  'flask': ['flask'],
  'fastapi': ['fastapi'],
  'laravel': ['laravel/framework'],
  'symfony': ['symfony/framework-bundle'],
  'spring': ['spring-boot'],
  'gin': ['github.com/gin-gonic/gin'],
  'echo': ['github.com/labstack/echo'],
  'fiber': ['github.com/gofiber/fiber'],
};

const LANG_EXTENSIONS: Record<string, string[]> = {
  'typescript': ['.ts', '.tsx', '.mts'],
  'javascript': ['.js', '.jsx', '.mjs', '.cjs'],
  'python': ['.py'],
  'php': ['.php'],
  'go': ['.go'],
  'java': ['.java'],
  'ruby': ['.rb'],
  'rust': ['.rs'],
  'csharp': ['.cs'],
};

export function detectProject(projectPath: string): ProjectInfo {
  const files = scanFiles(projectPath);
  const extensions = files.map(f => path.extname(f).toLowerCase());
  const packageJsonPath = path.join(projectPath, 'package.json');
  const requirementsPath = path.join(projectPath, 'requirements.txt');
  const pyprojectPath = path.join(projectPath, 'pyproject.toml');
  const goModPath = path.join(projectPath, 'go.mod');
  const composerPath = path.join(projectPath, 'composer.json');
  const pomPath = path.join(projectPath, 'pom.xml');

  let language = 'unknown';
  let framework = 'unknown';
  let packageManager = 'unknown';
  let hasTypeScript = false;
  let hasTests = false;
  let hasCI = false;

  // Detect language by extensions
  for (const [lang, exts] of Object.entries(LANG_EXTENSIONS)) {
    if (extensions.some(e => exts.includes(e))) {
      language = lang;
      break;
    }
  }

  // Detect from config files
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
      };
      const depNames = Object.keys(allDeps);

      if (depNames.some(d => d === 'typescript' || d === 'ts-node' || d === 'tsx')) {
        hasTypeScript = true;
        if (language === 'unknown') language = 'typescript';
      }

      for (const [fw, markers] of Object.entries(FRAMEWORK_MARKERS)) {
        if (depNames.some(d => markers.some(m => d.includes(m)))) {
          framework = fw;
          break;
        }
      }

      packageManager = 'npm';
      if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) packageManager = 'yarn';
      if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) packageManager = 'pnpm';
      if (fs.existsSync(path.join(projectPath, 'bun.lockb'))) packageManager = 'bun';
    } catch { /* ignore parse errors */ }
  }

  if (fs.existsSync(requirementsPath) || fs.existsSync(pyprojectPath)) {
    if (language === 'unknown') language = 'python';
    try {
      if (fs.existsSync(requirementsPath)) {
        const reqs = fs.readFileSync(requirementsPath, 'utf-8');
        if (reqs.includes('django')) framework = 'django';
        else if (reqs.includes('flask')) framework = 'flask';
        else if (reqs.includes('fastapi')) framework = 'fastapi';
      }
      if (fs.existsSync(pyprojectPath)) {
        const pyproject = fs.readFileSync(pyprojectPath, 'utf-8');
        if (pyproject.includes('django')) framework = 'django';
        else if (pyproject.includes('fastapi')) framework = 'fastapi';
      }
    } catch { /* ignore */ }
    packageManager = 'pip';
  }

  if (fs.existsSync(goModPath)) {
    if (language === 'unknown') language = 'go';
    packageManager = 'go';
    try {
      const gomod = fs.readFileSync(goModPath, 'utf-8');
      if (gomod.includes('gin-gonic')) framework = 'gin';
      else if (gomod.includes('labstack/echo')) framework = 'echo';
      else if (gomod.includes('gofiber')) framework = 'fiber';
    } catch { /* ignore */ }
  }

  if (fs.existsSync(composerPath)) {
    if (language === 'unknown') language = 'php';
    packageManager = 'composer';
    try {
      const composer = JSON.parse(fs.readFileSync(composerPath, 'utf-8'));
      const deps = Object.keys(composer.require || {});
      if (deps.some(d => d.includes('laravel'))) framework = 'laravel';
      else if (deps.some(d => d.includes('symfony'))) framework = 'symfony';
    } catch { /* ignore */ }
  }

  if (fs.existsSync(pomPath)) {
    if (language === 'unknown') language = 'java';
    packageManager = 'maven';
    try {
      const pom = fs.readFileSync(pomPath, 'utf-8');
      if (pom.includes('spring-boot')) framework = 'spring';
    } catch { /* ignore */ }
  }

  // Test detection
  hasTests = files.some(f =>
    f.includes('.test.') || f.includes('.spec.') || f.includes('_test.') ||
    f.includes('__tests__') || f.includes('/test/') || f.includes('/tests/')
  );

  // CI detection
  hasCI = files.some(f =>
    f.includes('.github/workflows') || f.includes('.gitlab-ci') ||
    f.includes('Jenkinsfile') || f.includes('.circleci') ||
    f.includes('.travis.yml')
  );

  return {
    language,
    framework,
    packageManager,
    hasTypeScript,
    hasTests,
    hasCI,
    files,
    totalFiles: files.length,
  };
}

function scanFiles(dir: string, maxDepth = 8): string[] {
  const results: string[] = [];
  const ignoreDirs = new Set([
    'node_modules', '.git', 'dist', 'build', '.next', '.nuxt',
    'vendor', '__pycache__', '.venv', 'venv', 'target', 'bin',
    'obj', '.idea', '.vscode', 'coverage',
  ]);

  function walk(currentDir: string, depth: number) {
    if (depth > maxDepth) return;
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          if (!ignoreDirs.has(entry.name)) {
            walk(fullPath, depth + 1);
          }
        } else {
          results.push(fullPath);
        }
      }
    } catch { /* permission errors */ }
  }

  walk(dir, 0);
  return results;
}
