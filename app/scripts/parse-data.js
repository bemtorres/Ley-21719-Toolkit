import fs from 'fs';
import path from 'path';

// Helper to convert markdown to basic HTML
function mdToHtml(md) {
  if (!md) return '';
  let html = md;
  
  // Normalize line endings
  html = html.replace(/\r\n/g, '\n');
  
  // Horizontal rules
  html = html.replace(/^\s*---\s*$/gm, '<hr>');
  
  // Code blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, (match, lang, code) => {
    // Escape HTML inside code
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="code-block language-${lang.trim()}"><code>${escapedCode}</code></pre>`;
  });
  
  // Alert boxes: > [!IMPORTANT] followed by lines
  html = html.replace(/^>\s*\[!(IMPORTANT|WARNING|TIP|NOTE|CAUTION)\]\n([\s\S]*?)(?=(?:\n\n|\n>|\n#|\n-|\n\*|\n\d\.|\n$))/gm, (match, type, text) => {
    const cleanedText = text.replace(/^>\s?/gm, '').trim();
    // Use full inline resolver for alert content too
    const styledText = resolveInlineMarkdown(cleanedText);
    return `<div class="alert-box alert-${type.toLowerCase()}">
      <div class="alert-title">${type}</div>
      <p>${styledText}</p>
    </div>`;
  });

  // Handle single line blockquotes
  html = html.replace(/^>\s*(.*?)$/gm, (match, text) => {
    if (text.startsWith('[!')) return match; // already handled
    return `<blockquote>${text}</blockquote>`;
  });

  // Table parser
  const lines = html.split('\n');
  let inTable = false;
  let tableRows = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      lines[i] = ''; // clear line, we'll insert later
      continue;
    } else if (inTable) {
      inTable = false;
      const tableHtml = processTable(tableRows);
      lines[i] = tableHtml + '\n' + line;
      tableRows = [];
    }
  }
  
  html = lines.join('\n');
  
  // Headers
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
  
  // Lists
  const listLines = html.split('\n');
  let inUl = false;
  let inOl = false;
  for (let i = 0; i < listLines.length; i++) {
    let line = listLines[i];
    
    // check unordered
    const ulMatch = line.match(/^(\s*)([\*\-])\s+(.*)/);
    if (ulMatch) {
      if (inOl) { listLines[i - 1] += '</ol>'; inOl = false; }
      let content = ulMatch[3];
      // Resolve basic inline formatting in list item
      content = resolveInlineMarkdown(content);
      if (!inUl) {
        listLines[i] = '<ul><li>' + content + '</li>';
        inUl = true;
      } else {
        listLines[i] = '<li>' + content + '</li>';
      }
    } else {
      // check ordered
      const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
      if (olMatch) {
        if (inUl) { listLines[i - 1] += '</ul>'; inUl = false; }
        let content = olMatch[3];
        content = resolveInlineMarkdown(content);
        if (!inOl) {
          listLines[i] = '<ol><li>' + content + '</li>';
          inOl = true;
        } else {
          listLines[i] = '<li>' + content + '</li>';
        }
      } else {
        if (inUl) {
          listLines[i] = '</ul>' + line;
          inUl = false;
        }
        if (inOl) {
          listLines[i] = '</ol>' + line;
          inOl = false;
        }
      }
    }
  }
  html = listLines.join('\n');
  
  // Bold, Italics, Inline code, Links
  html = resolveInlineMarkdown(html);
  
  // Paragraphs
  const blocks = html.split(/\n\s*\n/);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;
    if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol') || 
        block.startsWith('<div') || block.startsWith('<table') || block.startsWith('<pre') || 
        block.startsWith('<blockquote') || block.startsWith('<hr') || block.startsWith('</')) {
      continue;
    }
    blocks[i] = `<p>${block}</p>`;
  }
  
  return blocks.join('\n');
}

function resolveInlineMarkdown(text) {
  // Process links FIRST to protect URLs with underscores from italic substitution
  let result = text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="link">$1</a>');

  // Then inline styles, longest/greediest patterns first
  result = result
    .replace(/\*\*\*([^*<]+)\*\*\*/g, '<strong><em>$1</em></strong>')  // ***bold+italic***
    .replace(/\*\*([^*<]+)\*\*/g, '<strong>$1</strong>')               // **bold**
    .replace(/__([^_<]+)__/g, '<strong>$1</strong>')                   // __bold__
    .replace(/\*([^*<\n]+)\*/g, '<em>$1</em>')                         // *italic*
    .replace(/(?<![\/\w])_([^_<\n]+)_(?![\w\/])/g, '<em>$1</em>')     // _italic_ (not inside URLs)
    .replace(/`([^`<]+)`/g, '<code>$1</code>');                        // `code`

  return result;
}


function processTable(rows) {
  let html = '<div class="table-container"><table>';
  let hasHeaders = false;
  let bodyStarted = false;
  
  for (let row of rows) {
    const cells = row.split('|')
      .map(c => c.trim())
      .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
    
    if (cells.length === 0) continue;
    
    // Check if it's separator row
    if (cells.every(c => c.match(/^:?-+:?$/))) {
      hasHeaders = true;
      continue;
    }
    
    if (!hasHeaders) {
      html += '<thead><tr>';
      for (let cell of cells) {
        html += `<th>${resolveInlineMarkdown(cell)}</th>`;
      }
      html += '</tr></thead>';
      hasHeaders = true;
    } else {
      if (!bodyStarted) {
        html += '<tbody>';
        bodyStarted = true;
      }
      html += '<tr>';
      for (let cell of cells) {
        html += `<td>${resolveInlineMarkdown(cell)}</td>`;
      }
      html += '</tr>';
    }
  }
  
  if (bodyStarted) {
    html += '</tbody>';
  }
  html += '</table></div>';
  return html;
}

// Target Paths
const rootPath = path.resolve('..'); // Ley21719 directory
const outDir = path.resolve('src/lib/data');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Parse Main README.md
console.log('Parsing main README.md...');
const readmeMd = fs.readFileSync(path.join(rootPath, 'README.md'), 'utf-8');
const mainReadmeHtml = mdToHtml(readmeMd);

// 2. Parse Cases (casos)
console.log('Parsing cases...');
const casesDir = path.join(rootPath, 'casos');
const casesList = [];

if (fs.existsSync(casesDir)) {
  const caseFolders = fs.readdirSync(casesDir).filter(f => fs.statSync(path.join(casesDir, f)).isDirectory());
  
  for (const folder of caseFolders) {
    const caseReadmePath = path.join(casesDir, folder, 'README.md');
    if (fs.existsSync(caseReadmePath)) {
      const mdContent = fs.readFileSync(caseReadmePath, 'utf-8');
      
      const titleMatch = mdContent.match(/^# (.*)$/m);
      const subtitleMatch = mdContent.match(/^## (.*)$/m);
      
      const title = titleMatch ? titleMatch[1].trim() : folder;
      const subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';
      const bodyHtml = mdToHtml(mdContent);
      
      casesList.push({
        id: folder,
        title,
        subtitle,
        html: bodyHtml
      });
    }
  }
}
console.log(`Found and parsed \${casesList.length} cases.`);

// 3. Parse Vulnerabilities (vulnerabilidades)
console.log('Parsing vulnerabilities...');
const vulnDir = path.join(rootPath, 'vulnerabilidades');
const vulnsChile = [];
const vulnsInt = [];

const parseVulnFolder = (subfolder, targetArray) => {
  const fullSubpath = path.join(vulnDir, subfolder);
  if (fs.existsSync(fullSubpath)) {
    const files = fs.readdirSync(fullSubpath).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const mdContent = fs.readFileSync(path.join(fullSubpath, file), 'utf-8');
      const titleMatch = mdContent.match(/^# (.*)$/m);
      const title = titleMatch ? titleMatch[1].trim() : file;
      
      targetArray.push({
        filename: file,
        title,
        html: mdToHtml(mdContent)
      });
    }
  }
};

parseVulnFolder('chile', vulnsChile);
parseVulnFolder('internacionales', vulnsInt);
console.log(`Parsed \${vulnsChile.length} Chilean and \${vulnsInt.length} International vulnerabilities.`);

// 4. Parse Guides (guia)
console.log('Parsing guides...');
const guidesDir = path.join(rootPath, 'guia');
const guides = {};
if (fs.existsSync(guidesDir)) {
  const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const mdContent = fs.readFileSync(path.join(guidesDir, file), 'utf-8');
    const titleMatch = mdContent.match(/^# (.*)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file;
    const key = file.replace('.md', '').toLowerCase();
    guides[key] = {
      title,
      html: mdToHtml(mdContent)
    };
  }
}

// 5. Parse Templates (templates)
console.log('Parsing templates...');
const templatesDir = path.join(rootPath, 'templates');
const templatesList = [];
if (fs.existsSync(templatesDir)) {
  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const mdContent = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
    const titleMatch = mdContent.match(/^# (.*)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file;
    templatesList.push({
      filename: file,
      title,
      raw: mdContent,
      html: mdToHtml(mdContent)
    });
  }
}

// Write unified lawData.js module
const outputJs = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
export const lawOverview = ${JSON.stringify({ raw: readmeMd, html: mainReadmeHtml }, null, 2)};

export const casesData = ${JSON.stringify(casesList, null, 2)};

export const vulnerabilitiesData = {
  chile: ${JSON.stringify(vulnsChile, null, 2)},
  internacionales: ${JSON.stringify(vulnsInt, null, 2)}
};

export const guidesData = ${JSON.stringify(guides, null, 2)};

export const templatesData = ${JSON.stringify(templatesList, null, 2)};
`;

fs.writeFileSync(path.join(outDir, 'lawData.js'), outputJs, 'utf-8');
console.log('lawData.js successfully generated in src/lib/data/lawData.js');
