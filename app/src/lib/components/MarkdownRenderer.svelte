<script>
  import { onMount } from 'svelte';

  let { html = '' } = $props();
  let container = $state();

  // Trigger mermaid rendering and syntax highlighting whenever html changes
  $effect(() => {
    if (html && container) {
      renderMermaid();
      highlightCodeBlocks();
    }
  });

  async function renderMermaid() {
    try {
      // Find all code blocks marked as mermaid
      const codeBlocks = container.querySelectorAll('pre.language-mermaid code, pre.code-block.language-mermaid code');
      if (codeBlocks.length === 0) return;

      // Dynamically load mermaid
      const mermaidModule = await import('mermaid');
      const mermaid = mermaidModule.default;

      // Initialize mermaid with custom variables to match our sleek slate and dark background
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'Outfit, Inter, sans-serif',
        themeVariables: {
          background: '#0b0f19', // slate-950/slate-900 border matching
          primaryColor: '#1e293b', // slate-800
          primaryTextColor: '#f8fafc', // slate-50
          primaryBorderColor: '#334155', // slate-700
          lineColor: '#64748b', // slate-500
          secondaryColor: '#1e1b4b', // indigo-950
          tertiaryColor: '#0f172a',
          noteBkgColor: '#1e293b',
          noteTextColor: '#f8fafc',
          actorBkg: '#1e293b',
          actorBorder: '#334155',
          actorTextColor: '#f8fafc',
          signalColor: '#f8fafc',
          signalLineColor: '#64748b',
          cardBkg: '#1e293b',
          labelTextColor: '#cbd5e1', // slate-300
          loopBkg: '#0f172a',
          titleColor: '#ffffff'
        }
      });

      // Render each block
      for (let i = 0; i < codeBlocks.length; i++) {
        const block = codeBlocks[i];
        const preElement = block.closest('pre');
        if (!preElement || preElement.dataset.rendered === 'true') continue;

        // Extract raw code and clean it
        let code = block.textContent || '';
        
        // Unescape HTML entities
        code = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');

        const uniqueId = `mermaid-diag-${Math.random().toString(36).substr(2, 9)}`;

        try {
          const { svg } = await mermaid.render(uniqueId, code);
          
          // Replace preElement content with rendered SVG container
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-diagram-wrapper my-8 p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center shadow-2xl transition-all hover:border-slate-700/80 overflow-x-auto';
          wrapper.innerHTML = `
            <div class="w-full flex items-center justify-between mb-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">
              <span class="flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                Diagrama Interactivo (Ley 21.719)
              </span>
              <span>Desplazar para ver completo</span>
            </div>
            <div class="mermaid-svg-container w-full flex justify-center text-slate-200 select-none">${svg}</div>
          `;
          preElement.parentNode.replaceChild(wrapper, preElement);
        } catch (err) {
          console.error('Error rendering diagram:', err);
          preElement.dataset.rendered = 'true';
        }
      }
    } catch (err) {
      console.error('Failed to initialize or render mermaid:', err);
    }
  }

  function highlightCodeBlocks() {
    try {
      const preElements = container.querySelectorAll('pre');
      preElements.forEach(pre => {
        // Skip blocks already rendered as mermaid or already highlighted
        if (
          pre.classList.contains('language-mermaid') || 
          pre.querySelector('code.language-mermaid') || 
          pre.querySelector('.mermaid-svg-container') ||
          pre.dataset.highlighted === 'true'
        ) {
          return;
        }

        const codeElement = pre.querySelector('code');
        if (!codeElement) return;

        let code = codeElement.textContent || '';
        
        // Escape HTML characters first
        let escaped = code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
          
        const comments = [];
        const strings = [];
        
        // 1. Extract comments (single-line #, // and multi-line /* */)
        escaped = escaped.replace(/(\/\*[\s\S]*?\*\/|#.*|\/\/.*)/g, (match) => {
          comments.push(match);
          return `__COMMENT_PLACEHOLDER_${comments.length - 1}__`;
        });
        
        // 2. Extract strings (single quotes, double quotes, backticks)
        escaped = escaped.replace(/(["'`])([\s\S]*?)\1/g, (match) => {
          strings.push(match);
          return `__STRING_PLACEHOLDER_${strings.length - 1}__`;
        });
        
        // 3. Highlight keywords
        const keywords = [
          "def", "class", "import", "from", "return", "if", "not", "else", "elif", "try", "except", "finally", "raise", "for", "in", "while", "with", "as", "pass", "lambda",
          "const", "let", "function", "async", "await", "export", "var", "interface", "new", "this", "typeof",
          "prepare", "execute", "select", "insert", "delete", "update", "where", "values",
          "package", "type", "struct", "func", "nil", "defer", "go",
          "null", "undefined", "true", "false"
        ];
        
        const keywordsRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
        escaped = escaped.replace(keywordsRegex, '<span class="syntax-keyword">$1</span>');
        
        // 4. Highlight functions (word followed by parenthesis)
        escaped = escaped.replace(/(\b\w+)(?=\()/g, '<span class="syntax-function">$1</span>');
        
        // 5. Highlight numbers
        escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="syntax-number">$1</span>');
        
        // 6. Restore strings
        strings.forEach((str, idx) => {
          escaped = escaped.replace(`__STRING_PLACEHOLDER_${idx}__`, `<span class="syntax-string">${str}</span>`);
        });
        
        // 7. Restore comments
        comments.forEach((com, idx) => {
          escaped = escaped.replace(`__COMMENT_PLACEHOLDER_${idx}__`, `<span class="syntax-comment">${com}</span>`);
        });
        
        // Apply highlighted HTML
        codeElement.innerHTML = escaped;
        pre.dataset.highlighted = 'true';
        
        // Restyle the pre box to feel premium (matching the auditor code modal)
        pre.className = 'my-6 p-5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs md:text-sm overflow-x-auto leading-relaxed select-text text-slate-300 relative max-w-full shadow-inner';
      });
    } catch (err) {
      console.error('Error running syntax highlighting:', err);
    }
  }
</script>

<div bind:this={container} class="prose-custom max-w-none">
  {@html html}
</div>

<style>
  :global(.mermaid-svg-container svg) {
    max-width: 100% !important;
    height: auto !important;
  }
  :global(.mermaid-svg-container svg g.node rect, .mermaid-svg-container svg g.node circle, .mermaid-svg-container svg g.node polygon) {
    fill: #1e293b !important;
    stroke: #475569 !important;
    stroke-width: 2px !important;
  }
  :global(.mermaid-svg-container svg g.node .label) {
    color: #f8fafc !important;
    font-family: 'Outfit', sans-serif !important;
  }
  
  /* Custom syntax highlighting colors matching our slate dark theme */
  :global(.syntax-comment) {
    color: #64748b !important; /* slate-500 */
    font-style: italic !important;
  }
  :global(.syntax-string) {
    color: #34d399 !important; /* emerald-400 */
  }
  :global(.syntax-keyword) {
    color: #fb7185 !important; /* rose-400 */
    font-weight: bold !important;
  }
  :global(.syntax-number) {
    color: #fbbf24 !important; /* amber-400 */
  }
  :global(.syntax-function) {
    color: #38bdf8 !important; /* sky-400 */
  }
</style>
