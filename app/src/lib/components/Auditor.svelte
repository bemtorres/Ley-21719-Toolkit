<script>
  import { AUDIT_FRAMEWORK } from '../data/auditFramework.js';

  let { currentLanguage = 'es' } = $props();

  // Wizard state
  let currentDimensionIndex = $state(0);
  let answers = $state({}); // Maps question.id to 'complies' | 'partial' | 'fails'
  let showReportView = $state(false);
  let activeTab = $state('summary'); // 'summary' | 'actions' | 'governance'
  
  // Modal state for code examples
  let activeModalQuestion = $state(null);
  let activeModalLanguage = $state('python');
  let copyFeedback = $state(false);

  // Modal state for "Answer all questions" in dimension
  let showDimensionModal = $state(false);

  // Modal state for reset confirmation
  let showResetModal = $state(false);

  // Restore answers from localStorage on init
  $effect(() => {
    const saved = localStorage.getItem('ley21719_audit_answers_svelte');
    if (saved) {
      try {
        answers = JSON.parse(saved);
      } catch (e) {
        answers = {};
      }
    }
  });

  // Save answers to localStorage when they change
  function saveAnswers(newAnswers) {
    answers = newAnswers;
    localStorage.setItem('ley21719_audit_answers_svelte', JSON.stringify(newAnswers));
  }

  // Translation helpers
  const translations = {
    es: {
      'dimensions': 'Dimensiones',
      'completion': 'Progreso',
      'reset-audit': 'Reiniciar',
      'nav-prev': 'Anterior',
      'nav-next': 'Siguiente',
      'nav-finish': 'Ver Informe',
      'report-title': 'Informe Meticuloso de Cumplimiento',
      'report-subtitle': 'Resultados del diagnóstico del sistema de software frente a la ley.',
      'compliance-pct': 'Cumplimiento',
      'stat-lbl-complies': 'Cumple',
      'stat-lbl-partial': 'Parcial',
      'stat-lbl-fails': 'No Cumple',
      'tab-summary': 'Resumen por Dimensión',
      'tab-actions': 'Acciones Técnicas (Código)',
      'tab-governance': 'Gobernanza y Ley',
      'breakdown-title': 'Análisis de Cumplimiento por Dimensión',
      'tech-actions-title': 'Recomendaciones de Desarrollo e Infraestructura',
      'tech-actions-desc': 'Acciones concretas a implementar por el equipo de software en base de datos, backend y arquitectura.',
      'gov-title': 'Acciones Organizativas y Gobernanza de Datos',
      'gov-desc': 'Modelos de prevención de infracciones, DPO y políticas contractuales exigidas.',
      'btn-print': 'Imprimir / Guardar PDF',
      'btn-back-edit': 'Volver a Editar',
      'complies-btn': 'Cumple',
      'partial-btn': 'Parcial',
      'fails-btn': 'No Cumple',
      'criticality-label': 'Criticidad:',
      'actions-list-label': 'Acciones Técnicas de Refactorización:',
      'risk-high': 'Riesgo Alto',
      'risk-medium': 'Riesgo Medio',
      'risk-low': 'Riesgo Bajo',
      'risk-high-desc': 'El sistema expone graves brechas de cumplimiento con la Ley 21.719. Se arriesgan sanciones de hasta 20.000 UTM. Se requiere mitigación inmediata.',
      'risk-medium-desc': 'El sistema cuenta con algunas salvaguardas, pero adolece de brechas técnicas de seguridad o derechos ARCO-P. Requiere refactorización planificada.',
      'risk-low-desc': 'El sistema cumple de manera sólida con los estándares regulatorios. Se recomienda mantener auditorías periódicas y mantener el MPI certificado.',
      'dimension-txt': 'Dimensión',
      'unanswered-alert': 'Por favor responde todas las preguntas de esta dimensión antes de continuar.',
      'print-date-prefix': 'Fecha de Auditoría: ',
      'modal-exp-title': 'Guía de Refactorización',
      'copy-btn-txt': 'Copiar Código',
      'dim-modal-btn': 'Responder Dimensión',
      'dim-modal-title': 'Responder Dimensión Completa',
      'dim-modal-subtitle': 'Contesta todas las preguntas de esta dimensión en un solo paso.',
      'dim-modal-close': 'Guardar y Cerrar',
      'dim-modal-progress': 'respondidas',
      'reset-modal-title': '¿Reiniciar el cuestionario?',
      'reset-modal-desc': 'Se borrarán todas tus respuestas guardadas y volverás al inicio. Esta acción no se puede deshacer.',
      'reset-modal-confirm': 'Sí, reiniciar',
      'reset-modal-cancel': 'Cancelar'
    },
    en: {
      'dimensions': 'Dimensions',
      'completion': 'Progress',
      'reset-audit': 'Reset',
      'nav-prev': 'Previous',
      'nav-next': 'Next',
      'nav-finish': 'View Report',
      'report-title': 'Meticulous Compliance Report',
      'report-subtitle': 'Diagnostic results of the software system against the law.',
      'compliance-pct': 'Compliance',
      'stat-lbl-complies': 'Complies',
      'stat-lbl-partial': 'Partial',
      'stat-lbl-fails': 'Does Not Comply',
      'tab-summary': 'Summary by Dimension',
      'tab-actions': 'Technical Actions (Code)',
      'tab-governance': 'Governance & Law',
      'breakdown-title': 'Compliance Analysis by Dimension',
      'tech-actions-title': 'Development & Infrastructure Recommendations',
      'tech-actions-desc': 'Concrete actions to implement by the software team in database, backend, and architecture.',
      'gov-title': 'Organizational Actions & Data Governance',
      'gov-desc': 'Infraction prevention models, DPO, and required contractual policies.',
      'btn-print': 'Print / Save PDF',
      'btn-back-edit': 'Back to Editor',
      'complies-btn': 'Complies',
      'partial-btn': 'Partial',
      'fails-btn': 'Fails',
      'criticality-label': 'Criticality:',
      'actions-list-label': 'Technical Refactoring Actions:',
      'risk-high': 'High Risk',
      'risk-medium': 'Medium Risk',
      'risk-low': 'Low Risk',
      'risk-high-desc': 'The system exposes severe compliance gaps under Ley 21.719. High risk of penalties up to 20,000 UTM. Immediate mitigation is required.',
      'risk-medium-desc': 'The system has basic safeguards but lacks key technical controls for security or ARCO-P rights. Needs structured refactoring.',
      'risk-low-desc': 'The system complies robustly with regulatory standards. Regular periodic audits and maintaining the certified MPI are recommended.',
      'dimension-txt': 'Dimension',
      'unanswered-alert': 'Please answer all questions in this dimension before proceeding.',
      'print-date-prefix': 'Audit Date: ',
      'modal-exp-title': 'Refactoring Guide',
      'copy-btn-txt': 'Copy Code',
      'dim-modal-btn': 'Answer Dimension',
      'dim-modal-title': 'Answer Full Dimension',
      'dim-modal-subtitle': 'Answer all questions in this dimension in one step.',
      'dim-modal-close': 'Save & Close',
      'dim-modal-progress': 'answered',
      'reset-modal-title': 'Reset the questionnaire?',
      'reset-modal-desc': 'All your saved answers will be deleted and you will return to the start. This action cannot be undone.',
      'reset-modal-confirm': 'Yes, reset',
      'reset-modal-cancel': 'Cancel'
    }
  };

  function translate(key) {
    return translations[currentLanguage][key] || key;
  }

  // Categories computed lists
  const categories = AUDIT_FRAMEWORK.categories;
  const currentCategory = $derived(categories[currentDimensionIndex]);

  // Derived progress stats
  const totalQuestions = $derived(
    categories.reduce((acc, cat) => acc + cat.questions.length, 0)
  );

  const answeredQuestionsCount = $derived(
    Object.keys(answers).length
  );

  const progressPercentage = $derived(
    totalQuestions > 0 ? Math.round((answeredQuestionsCount / totalQuestions) * 100) : 0
  );

  // Derived calculations for final report
  const reportStats = $derived.by(() => {
    let totalWeight = 0;
    let userPoints = 0;
    let complies = 0;
    let partials = 0;
    let fails = 0;

    const dimensionsBreakdown = [];
    const technicalActions = [];
    const governanceActions = [];

    categories.forEach(cat => {
      let catWeight = 0;
      let catPoints = 0;
      let catAnsweredCount = 0;

      cat.questions.forEach(q => {
        catWeight += q.weight;
        totalWeight += q.weight;

        const val = answers[q.id];
        if (val !== undefined) {
          catAnsweredCount++;
          let multiplier = 0;
          if (val === 'complies') {
            multiplier = 1.0;
            complies++;
          } else if (val === 'partial') {
            multiplier = 0.5;
            partials++;
          } else {
            multiplier = 0.0;
            fails++;
          }
          catPoints += (q.weight * multiplier);
          userPoints += (q.weight * multiplier);
        }
      });

      const catScore = catWeight > 0 ? Math.round((catPoints / catWeight) * 100) : 0;
      dimensionsBreakdown.push({
        id: cat.id,
        title: cat.title[currentLanguage],
        score: catScore,
        answeredCount: catAnsweredCount
      });

      // Filter failures/partials to recommend actions
      cat.questions.forEach(q => {
        const val = answers[q.id];
        if (val === 'partial' || val === 'fails') {
          const actionItem = {
            id: q.id,
            code: q.code,
            category: cat.title[currentLanguage],
            text: q.text[currentLanguage],
            recommendation: q.recommendation[currentLanguage],
            actions: q.actions.map(act => act[currentLanguage]),
            criticality: q.criticality,
            type: val,
            questionRef: q
          };
          if (q.code.startsWith('GOV')) {
            governanceActions.push(actionItem);
          } else {
            technicalActions.push(actionItem);
          }
        }
      });
    });

    const finalScore = totalWeight > 0 ? Math.round((userPoints / totalWeight) * 100) : 0;

    let riskLevel = 'risk-low';
    let riskColor = 'text-emerald-400 border-emerald-500';
    if (finalScore < 50) {
      riskLevel = 'risk-high';
      riskColor = 'text-rose-400 border-rose-500';
    } else if (finalScore < 85) {
      riskLevel = 'risk-medium';
      riskColor = 'text-amber-400 border-amber-500';
    }

    return {
      finalScore,
      complies,
      partials,
      fails,
      dimensionsBreakdown,
      technicalActions,
      governanceActions,
      riskLevel,
      riskColor
    };
  });

  // Action methods
  function selectOption(qId, val) {
    const nextAnswers = { ...answers, [qId]: val };
    saveAnswers(nextAnswers);
  }

  function prevDimension() {
    if (currentDimensionIndex > 0) {
      currentDimensionIndex--;
      window.scrollTo(0, 0);
    }
  }

  function nextDimension() {
    // Validate if current category is fully answered
    const completed = currentCategory.questions.every(q => answers[q.id] !== undefined);
    if (!completed) {
      // Open the dimension modal instead of showing alert
      showDimensionModal = true;
      return;
    }

    if (currentDimensionIndex < categories.length - 1) {
      currentDimensionIndex++;
      window.scrollTo(0, 0);
    } else {
      showReportView = true;
      window.scrollTo(0, 0);
    }
  }

  function openDimensionModal() {
    showDimensionModal = true;
  }

  function closeDimensionModal() {
    showDimensionModal = false;
  }

  // Count answered questions in current dimension
  const currentDimAnswered = $derived(
    currentCategory.questions.filter(q => answers[q.id] !== undefined).length
  );
  const currentDimTotal = $derived(currentCategory.questions.length);
  const currentDimComplete = $derived(currentDimAnswered === currentDimTotal);

  function resetAudit() {
    showResetModal = true;
  }

  function confirmReset() {
    saveAnswers({});
    currentDimensionIndex = 0;
    showReportView = false;
    showResetModal = false;
    window.scrollTo(0, 0);
  }

  function cancelReset() {
    showResetModal = false;
  }

  function editAudit() {
    showReportView = false;
  }

  function triggerPrint() {
    window.print();
  }

  // Modal actions
  function openCodeModal(question) {
    activeModalQuestion = question;
    activeModalLanguage = 'python';
    copyFeedback = false;
  }

  function closeCodeModal() {
    activeModalQuestion = null;
  }

  function copyCode(codeText) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeText)
        .then(() => {
          copyFeedback = true;
          setTimeout(() => copyFeedback = false, 1500);
        });
    }
  }

  // Syntax highlighting logic
  function highlightSyntax(code) {
    if (!code) return '';
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    const comments = [];
    const strings = [];
    
    // Extract comments
    escaped = escaped.replace(/(#.*|\/\/.*)/g, (match) => {
      comments.push(match);
      return `__COMMENT_PLACEHOLDER_${comments.length - 1}__`;
    });
    
    // Extract strings
    escaped = escaped.replace(/(["'`])(.*?)\1/g, (match) => {
      strings.push(match);
      return `__STRING_PLACEHOLDER_${strings.length - 1}__`;
    });
    
    // Keywords
    const keywords = [
      "def", "class", "import", "from", "return", "if", "not", "else", "elif", "try", "except", "finally", "raise",
      "const", "let", "function", "async", "await", "export", "var", "interface",
      "prepare", "execute", "select", "insert", "delete", "update", "where", "values",
      "package", "type", "struct", "func", "nil", "defer", "go"
    ];
    
    const keywordsRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordsRegex, '<span class="text-rose-400 font-bold">$1</span>');
    escaped = escaped.replace(/(\$pdo|\$stmt)/g, '<span class="text-sky-400">$1</span>');
    
    // Restore strings
    strings.forEach((str, idx) => {
      escaped = escaped.replace(`__STRING_PLACEHOLDER_${idx}__`, `<span class="text-emerald-400 font-medium">${str}</span>`);
    });
    
    // Restore comments
    comments.forEach((com, idx) => {
      escaped = escaped.replace(`__COMMENT_PLACEHOLDER_${idx}__`, `<span class="text-slate-500 italic">${com}</span>`);
    });
    
    return escaped;
  }

  const printDate = $derived(
    new Date().toLocaleDateString(currentLanguage === 'es' ? 'es-CL' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  );
</script>

<div class="space-y-6">
  
  <!-- Header Title (Hidden when printing report) -->
  <div class="space-y-2 no-print">
    <h2 class="font-display text-2xl md:text-4xl font-extrabold text-white">
      {currentLanguage === 'es' ? 'Auditor de Cumplimiento TI' : 'IT Compliance Auditor'}
    </h2>
    <p class="text-slate-400 text-sm md:text-base">
      {currentLanguage === 'es'
        ? 'Autodiagnóstico del sistema de software frente a los 24 controles técnicos de la Ley N° 21.719.'
        : 'Self-diagnostic of the software system against the 24 technical controls of Law 21,719.'}
    </p>
  </div>

  <!-- Wizard Cuestionario View (Hidden when showing report) -->
  {#if !showReportView}
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start no-print">
      
      <!-- Desktop Sidebar Progress Menu (Left) -->
      <aside class="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-24 space-y-6">
        <h3 class="font-display font-bold text-white text-base border-b border-slate-800 pb-2">
          {translate('dimensions')}
        </h3>
        
        <ul class="space-y-2 text-xs">
          {#each categories as cat, index}
            {@const isCatCompleted = cat.questions.every(q => answers[q.id] !== undefined)}
            <button
              onclick={() => currentDimensionIndex = index}
              class="w-full text-left flex items-center gap-2.5 p-2 rounded-lg transition-all focus:outline-none {currentDimensionIndex === index ? 'bg-slate-800 text-white font-bold border border-slate-700' : 'text-slate-400 hover:text-white'}"
            >
              <div class="h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] {isCatCompleted ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border border-slate-800'}">
                {#if isCatCompleted}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                {:else}
                  {index + 1}
                {/if}
              </div>
              <span class="truncate">{cat.title[currentLanguage]}</span>
            </button>
          {/each}
        </ul>

        <!-- Overall progress box -->
        <div class="space-y-2 pt-2 border-t border-slate-800">
          <div class="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{translate('completion')}</span>
            <span>{progressPercentage}%</span>
          </div>
          <div class="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-850">
            <div class="h-full bg-rose-500 transition-all duration-300" style="width: {progressPercentage}%"></div>
          </div>
          <p class="text-[10px] text-slate-500 text-right">
            {answeredQuestionsCount} {currentLanguage === 'es' ? 'de' : 'of'} {totalQuestions} {currentLanguage === 'es' ? 'controles' : 'controls'}
          </p>
        </div>

        <button 
          onclick={resetAudit}
          class="w-full rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900/60 hover:text-white py-2 text-xs font-bold text-slate-400 transition-colors focus:outline-none"
        >
          {translate('reset-audit')}
        </button>
      </aside>

      <!-- Main Questionnaire Area (Right) -->
      <section class="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        <!-- Category header -->
        <div class="p-6 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1.5">
              <div class="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {translate('dimension-txt')} {currentDimensionIndex + 1} / {categories.length}
              </div>
              <h3 class="font-display font-extrabold text-white text-lg md:text-xl">
                {currentCategory.title[currentLanguage]}
              </h3>
              <p class="text-xs md:text-sm text-slate-400 leading-relaxed">
                {currentCategory.description[currentLanguage]}
              </p>
            </div>

            <!-- Quick-answer modal button -->
            <button
              onclick={openDimensionModal}
              class="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-3 py-2 text-xs font-bold transition-all focus:outline-none group"
              title={translate('dim-modal-title')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-rose-400 group-hover:text-rose-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              <span class="hidden sm:inline">{translate('dim-modal-btn')}</span>
              <!-- answered counter badge -->
              <span class="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black {currentDimComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-500'}">
                {currentDimAnswered}/{currentDimTotal}
              </span>
            </button>
          </div>

          <!-- Dimension progress mini bar -->
          <div class="h-1 w-full rounded-full bg-slate-900 overflow-hidden">
            <div
              class="h-full transition-all duration-500 rounded-full {currentDimComplete ? 'bg-emerald-500' : 'bg-rose-500'}"
              style="width: {currentDimTotal > 0 ? Math.round((currentDimAnswered / currentDimTotal) * 100) : 0}%"
            ></div>
          </div>
        </div>

        <!-- Questions container -->
        <div class="p-6 divide-y divide-slate-800/80">
          {#each currentCategory.questions as q}
            <div class="py-6 first:pt-0 last:pb-0 space-y-4">
              
              <!-- Question Text and badging -->
              <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div class="space-y-2 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded bg-slate-950 border border-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-400 uppercase">
                      {q.code}
                    </span>
                    <span class="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider {q.criticality === 'high' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}">
                      {q.criticality === 'high' ? (currentLanguage === 'es' ? 'Alta' : 'High') : (currentLanguage === 'es' ? 'Media' : 'Medium')}
                    </span>
                  </div>
                  <h4 class="font-display text-white text-sm md:text-base font-bold leading-snug">
                    {q.text[currentLanguage]}
                  </h4>
                </div>

                <!-- Code Example trigger button -->
                <button
                  onclick={() => openCodeModal(q)}
                  class="self-start inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold focus:outline-none transition-colors border border-rose-500/10 bg-rose-500/5 px-2.5 py-1 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                  <span>{currentLanguage === 'es' ? 'Guía Código' : 'Code Guide'}</span>
                </button>
              </div>

              <!-- Answer Options Button Grid -->
              <div class="grid grid-cols-3 gap-3 md:max-w-md">
                <button
                  onclick={() => selectOption(q.id, 'complies')}
                  class="rounded-xl border py-2.5 px-3 flex flex-col items-center justify-center gap-0.5 focus:outline-none transition-all hover:scale-[1.02] {answers[q.id] === 'complies' ? 'bg-emerald-500 border-emerald-500 text-white font-bold shadow-md shadow-emerald-950/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}"
                >
                  <span class="text-xs">{translate('complies-btn')}</span>
                  <span class="text-[9px] opacity-80">100%</span>
                </button>
                <button
                  onclick={() => selectOption(q.id, 'partial')}
                  class="rounded-xl border py-2.5 px-3 flex flex-col items-center justify-center gap-0.5 focus:outline-none transition-all hover:scale-[1.02] {answers[q.id] === 'partial' ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-md shadow-amber-950/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}"
                >
                  <span class="text-xs">{translate('partial-btn')}</span>
                  <span class="text-[9px] opacity-80">50%</span>
                </button>
                <button
                  onclick={() => selectOption(q.id, 'fails')}
                  class="rounded-xl border py-2.5 px-3 flex flex-col items-center justify-center gap-0.5 focus:outline-none transition-all hover:scale-[1.02] {answers[q.id] === 'fails' ? 'bg-rose-600 border-rose-600 text-white font-bold shadow-md shadow-rose-950/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}"
                >
                  <span class="text-xs">{translate('fails-btn')}</span>
                  <span class="text-[9px] opacity-80">0%</span>
                </button>
              </div>

            </div>
          {/each}
        </div>

        <!-- Wizard Navigation panel -->
        <div class="p-6 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onclick={prevDimension}
            disabled={currentDimensionIndex === 0}
            class="px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900 text-slate-400 hover:text-white font-bold text-xs md:text-sm focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
          >
            {translate('nav-prev')}
          </button>
          
          <button
            onclick={nextDimension}
            class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs md:text-sm focus:outline-none shadow-md shadow-rose-950/20"
          >
            {currentDimensionIndex === categories.length - 1 ? translate('nav-finish') : translate('nav-next')}
          </button>
        </div>

      </section>

    </div>
  {/if}

  <!-- Report View (Dashboard of results) -->
  {#if showReportView}
    <div class="space-y-6">
      
      <!-- Report Header info (Visible when printing) -->
      <div class="only-print text-center space-y-2 border-b-2 border-slate-800 pb-4 mb-6">
        <h2 class="font-display font-black text-xl text-black">INFORME METICULOSO DE AUDITORÍA DE CUMPLIMIENTO TI</h2>
        <h3 class="font-display font-bold text-base text-slate-700">Ley N° 21.719 de Protección de Datos Personales (Chile)</h3>
        <p class="text-xs text-slate-500">{translate('print-date-prefix')} {printDate}</p>
      </div>

      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        <!-- Score Radial Box -->
        <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col md:flex-row items-center gap-6 lg:col-span-2">
          
          <!-- Gauge radial style -->
          <div class="relative h-28 w-28 rounded-full border-[10px] flex items-center justify-center font-display font-black text-2xl flex-shrink-0 bg-slate-950/60 {reportStats.riskColor}">
            {reportStats.finalScore}%
          </div>

          <div class="space-y-2 text-center md:text-left">
            <div class="inline-flex rounded bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase border border-slate-850">
              {translate('compliance-pct')}
            </div>
            <h3 class="font-display text-xl font-extrabold text-white">
              {translate(reportStats.riskLevel)}
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed max-w-md">
              {translate(`${reportStats.riskLevel}-desc`)}
            </p>
          </div>

        </div>

        <!-- Fails / Complies Statistics Box -->
        <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between">
          <h4 class="font-display font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">
            {currentLanguage === 'es' ? 'Resumen de Puntos' : 'Checkpoint Summary'}
          </h4>
          
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <div class="text-xl font-extrabold text-emerald-400">{reportStats.complies}</div>
              <div class="text-[9px] text-slate-500 uppercase font-semibold">{translate('stat-lbl-complies')}</div>
            </div>
            <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <div class="text-xl font-extrabold text-amber-400">{reportStats.partials}</div>
              <div class="text-[9px] text-slate-500 uppercase font-semibold">{translate('stat-lbl-partial')}</div>
            </div>
            <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <div class="text-xl font-extrabold text-rose-500">{reportStats.fails}</div>
              <div class="text-[9px] text-slate-500 uppercase font-semibold">{translate('stat-lbl-fails')}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Tab Switcher (No-print) -->
      <div class="flex border-b border-slate-850 bg-slate-900 rounded-xl p-1 gap-1 border border-slate-800 no-print">
        <button
          onclick={() => activeTab = 'summary'}
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none {activeTab === 'summary' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
        >
          {translate('tab-summary')}
        </button>
        <button
          onclick={() => activeTab = 'actions'}
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none {activeTab === 'actions' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
        >
          {translate('tab-actions')}
          {#if reportStats.technicalActions.length > 0}
            <span class="ml-1 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] text-rose-400 font-extrabold">{reportStats.technicalActions.length}</span>
          {/if}
        </button>
        <button
          onclick={() => activeTab = 'governance'}
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none {activeTab === 'governance' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
        >
          {translate('tab-governance')}
          {#if reportStats.governanceActions.length > 0}
            <span class="ml-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-extrabold">{reportStats.governanceActions.length}</span>
          {/if}
        </button>
      </div>

      <!-- Tab Content 1: Summary by Dimension -->
      {#if activeTab === 'summary'}
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 class="font-display text-lg font-bold text-white leading-tight">
            {translate('breakdown-title')}
          </h3>
          
          <div class="space-y-4">
            {#each reportStats.dimensionsBreakdown as dim}
              <div class="flex flex-col md:flex-row md:items-center gap-4 border-b border-slate-850 pb-4 last:border-b-0 last:pb-0">
                <div class="flex-1 space-y-1">
                  <div class="font-display font-bold text-slate-200 text-sm">{dim.title}</div>
                  <div class="text-[10px] text-slate-500">{dim.answeredCount} / 4 {currentLanguage === 'es' ? 'controles respondidos' : 'controls checked'}</div>
                </div>

                <!-- Progress fill bar -->
                <div class="flex items-center gap-3 md:w-80">
                  <div class="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                    <div class="h-full rounded-full transition-all {dim.score >= 85 ? 'bg-emerald-500' : (dim.score >= 50 ? 'bg-amber-500' : 'bg-rose-500')}" style="width: {dim.score}%"></div>
                  </div>
                  <span class="w-10 text-right font-mono text-xs font-bold text-slate-300">{dim.score}%</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Tab Content 2: Technical Actions -->
      {#if activeTab === 'actions'}
        <div class="space-y-4">
          
          <div class="bg-slate-900 border border-slate-850 rounded-2xl p-6 no-print">
            <h3 class="font-display text-lg font-bold text-rose-400 leading-tight">
              {translate('tech-actions-title')}
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              {translate('tech-actions-desc')}
            </p>
          </div>

          <!-- Cards of actions -->
          {#if reportStats.technicalActions.length === 0}
            <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-emerald-400 font-bold text-sm">
              ✓ {currentLanguage === 'es' ? '¡Excelente! No se encontraron brechas abiertas en esta sección.' : '✓ Excellent! No open compliance gaps detected in this section.'}
            </div>
          {:else}
            <div class="space-y-4">
              {#each reportStats.technicalActions as action}
                <div class="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4 relative overflow-hidden">
                  <!-- Criticality color ribbon -->
                  <div class="absolute left-0 inset-y-0 w-1 {action.criticality === 'high' ? 'bg-rose-500' : 'bg-amber-500'}"></div>
                  
                  <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between pl-2">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="rounded bg-slate-950 border border-slate-800 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400 uppercase">{action.code}</span>
                        <span class="text-[9px] font-bold uppercase tracking-wider text-slate-500">{action.category}</span>
                      </div>
                      <h4 class="font-display font-bold text-white text-base leading-snug">{action.text}</h4>
                    </div>
                    <span class="self-start rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase border {action.type === 'partial' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}">
                      {action.type === 'partial' ? (currentLanguage === 'es' ? 'Parcial' : 'Partial') : (currentLanguage === 'es' ? 'No Cumple' : 'Fails')}
                    </span>
                  </div>

                  <p class="text-xs md:text-sm text-slate-300 leading-relaxed pl-2">
                    <strong class="text-slate-400">{currentLanguage === 'es' ? 'Recomendación: ' : 'Recommendation: '}</strong>
                    {action.recommendation}
                  </p>

                  <div class="pl-2 space-y-2">
                    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{translate('actions-list-label')}</div>
                    <ul class="list-disc pl-4 text-xs text-slate-400 space-y-1">
                      {#each action.actions as act}
                        <li>{act}</li>
                      {/each}
                    </ul>
                  </div>

                  <!-- Code guide trigger in report -->
                  <div class="pl-2 pt-2 border-t border-slate-850 flex justify-end">
                    <button
                      onclick={() => openCodeModal(action.questionRef)}
                      class="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                      </svg>
                      <span>{currentLanguage === 'es' ? 'Ver Ejemplo de Código' : 'View Code Example'}</span>
                    </button>
                  </div>

                </div>
              {/each}
            </div>
          {/if}

        </div>
      {/if}

      <!-- Tab Content 3: Governance Actions -->
      {#if activeTab === 'governance'}
        <div class="space-y-4">
          
          <div class="bg-slate-900 border border-slate-850 rounded-2xl p-6 no-print">
            <h3 class="font-display text-lg font-bold text-blue-400 leading-tight">
              {translate('gov-title')}
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              {translate('gov-desc')}
            </p>
          </div>

          {#if reportStats.governanceActions.length === 0}
            <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-emerald-400 font-bold text-sm">
              ✓ {currentLanguage === 'es' ? '¡Excelente! No se encontraron brechas de gobernanza en esta sección.' : '✓ Excellent! No governance gaps detected in this section.'}
            </div>
          {:else}
            <div class="space-y-4">
              {#each reportStats.governanceActions as action}
                <div class="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4 relative overflow-hidden">
                  <!-- Criticality color ribbon -->
                  <div class="absolute left-0 inset-y-0 w-1 {action.criticality === 'high' ? 'bg-rose-500' : 'bg-amber-500'}"></div>
                  
                  <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between pl-2">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="rounded bg-slate-950 border border-slate-800 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400 uppercase">{action.code}</span>
                        <span class="text-[9px] font-bold uppercase tracking-wider text-slate-500">{action.category}</span>
                      </div>
                      <h4 class="font-display font-bold text-white text-base leading-snug">{action.text}</h4>
                    </div>
                    <span class="self-start rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase border {action.type === 'partial' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}">
                      {action.type === 'partial' ? (currentLanguage === 'es' ? 'Parcial' : 'Partial') : (currentLanguage === 'es' ? 'No Cumple' : 'Fails')}
                    </span>
                  </div>

                  <p class="text-xs md:text-sm text-slate-300 leading-relaxed pl-2">
                    <strong class="text-slate-400">{currentLanguage === 'es' ? 'Recomendación: ' : 'Recommendation: '}</strong>
                    {action.recommendation}
                  </p>

                  <div class="pl-2 space-y-2">
                    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{translate('actions-list-label')}</div>
                    <ul class="list-disc pl-4 text-xs text-slate-400 space-y-1">
                      {#each action.actions as act}
                        <li>{act}</li>
                      {/each}
                    </ul>
                  </div>

                </div>
              {/each}
            </div>
          {/if}

        </div>
      {/if}

      <!-- Bottom actions for printing / resetting / editing -->
      <div class="flex flex-wrap gap-4 pt-4 border-t border-slate-800 no-print justify-between items-center">
        <div class="flex gap-3">
          <button
            onclick={triggerPrint}
            class="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 px-5 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-rose-950/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            <span>{translate('btn-print')}</span>
          </button>
          
          <button
            onclick={editAudit}
            class="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 px-5 py-3 text-sm font-bold text-slate-300 transition-colors focus:outline-none"
          >
            {translate('btn-back-edit')}
          </button>
        </div>

        <button
          onclick={resetAudit}
          class="rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-400 transition-colors focus:outline-none"
        >
          {translate('reset-audit')}
        </button>
      </div>

    </div>
  {/if}

  <!-- Interactive Code Refactoring Example Modal -->
  {#if activeModalQuestion}
    <div class="fixed inset-0 z-50 overflow-hidden no-print" role="dialog" aria-modal="true">
      <div
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onclick={closeCodeModal}
        onkeydown={(e) => e.key === 'Escape' && closeCodeModal()}
        role="button"
        tabindex="-1"
        aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
      ></div>
      
      <div class="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          <!-- Modal Header -->
          <div class="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950">
            <div class="flex items-center gap-3">
              <span class="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-slate-400">
                {activeModalQuestion.code}
              </span>
              <h3 class="font-display font-bold text-white text-sm md:text-base leading-none">
                {activeModalQuestion.text[currentLanguage]}
              </h3>
            </div>
            
            <button
              onclick={closeCodeModal}
              class="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center focus:outline-none"
              aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
             <!-- Recommendation Refactoring details -->
            <div class="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-1">
              <h5 class="font-display text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                {translate('modal-exp-title')}
              </h5>
              <p class="text-xs text-slate-300 leading-relaxed">
                {activeModalQuestion.recommendation[currentLanguage]}
              </p>
            </div>

            <!-- Language selector tabs -->
            <div class="flex border-b border-slate-800 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
              {#each ['python', 'js', 'php', 'go'] as lang}
                <button
                  onclick={() => activeModalLanguage = lang}
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors focus:outline-none uppercase {activeModalLanguage === lang ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-500 hover:text-slate-300'}"
                >
                  {lang === 'js' ? 'JavaScript' : lang}
                </button>
              {/each}
            </div>

            <!-- Code viewer with copy action -->
            <div class="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden relative group">
              
              <!-- Code header controls -->
              <div class="h-10 border-b border-slate-900 bg-slate-950/60 px-4 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{activeModalLanguage === 'js' ? 'index.js' : (activeModalLanguage === 'python' ? 'main.py' : (activeModalLanguage === 'php' ? 'index.php' : 'main.go'))}</span>
                
                <button
                  onclick={() => copyCode(activeModalQuestion.snippets[activeModalLanguage])}
                  class="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors focus:outline-none"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>{copyFeedback ? (currentLanguage === 'es' ? 'Copiado' : 'Copied') : translate('copy-btn-txt')}</span>
                </button>
              </div>

              <!-- Highlighting Area -->
              <pre class="p-5 font-mono text-xs md:text-sm overflow-x-auto leading-relaxed select-text text-slate-300 bg-slate-950"><code>{@html highlightSyntax(activeModalQuestion.snippets[activeModalLanguage])}</code></pre>
            </div>
           
          </div>

          <!-- Modal Footer -->
          <div class="h-12 border-t border-slate-800 px-6 flex items-center justify-between bg-slate-950 text-xs text-slate-500">
            <span>Guías técnicas Ley 21.719</span>
            <button
              onclick={closeCodeModal}
              class="text-rose-400 font-bold hover:text-rose-300 focus:outline-none"
            >
              {currentLanguage === 'es' ? 'Cerrar Guía' : 'Close Guide'}
            </button>
          </div>

        </div>
      </div>
    </div>
  {/if}

</div>

<!-- ═══════════════════════════════════════════════════════ 
     DIMENSION QUICK-ANSWER MODAL 
     ══════════════════════════════════════════════════════ -->
{#if showDimensionModal}
  <div class="fixed inset-0 z-50 overflow-hidden no-print" role="dialog" aria-modal="true" aria-labelledby="dim-modal-title">
    
    <div
      class="absolute inset-0 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      onclick={closeDimensionModal}
      onkeydown={(e) => e.key === 'Escape' && closeDimensionModal()}
      role="button"
      tabindex="-1"
      aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
    ></div>

    <!-- Modal panel -->
    <div class="absolute inset-0 flex items-center justify-center p-4 md:p-8">
      <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/80 animate-slide-up overflow-hidden">

        <!-- Modal Header -->
        <div class="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <div class="h-6 w-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <h2 id="dim-modal-title" class="font-display font-extrabold text-white text-base">
                {translate('dim-modal-title')}
              </h2>
            </div>
            <p class="text-xs text-slate-400">{translate('dim-modal-subtitle')}</p>
          </div>

          <!-- Progress badge + close -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="text-xs font-black rounded-full px-3 py-1 {currentDimComplete ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              {currentDimAnswered} / {currentDimTotal} {translate('dim-modal-progress')}
            </div>
            <button
              onclick={closeDimensionModal}
              aria-label="Cerrar"
              class="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center focus:outline-none transition-colors"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dimension mini progress bar -->
        <div class="h-1 bg-slate-800 shrink-0">
          <div
            class="h-full transition-all duration-500 {currentDimComplete ? 'bg-emerald-500' : 'bg-rose-500'}"
            style="width: {currentDimTotal > 0 ? Math.round((currentDimAnswered / currentDimTotal) * 100) : 0}%"
          ></div>
        </div>

        <!-- Modal Body — scrollable question list -->
        <div class="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {#each currentCategory.questions as q, idx}
            {@const answered = answers[q.id]}
            <div class="px-6 py-5 space-y-3 {answered !== undefined ? 'bg-slate-900' : 'bg-slate-950/40'}">

              <!-- Question number + code badge -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-black flex items-center justify-center">{idx + 1}</span>
                <span class="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-400 uppercase">{q.code}</span>
                <span class="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider {q.criticality === 'high' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}">
                  {q.criticality === 'high' ? (currentLanguage === 'es' ? 'Alta' : 'High') : (currentLanguage === 'es' ? 'Media' : 'Medium')}
                </span>
                {#if answered !== undefined}
                  <span class="ml-auto text-[10px] font-bold {answered === 'complies' ? 'text-emerald-400' : answered === 'partial' ? 'text-amber-400' : 'text-rose-400'}">
                    {answered === 'complies' ? '✓ ' + translate('complies-btn') : answered === 'partial' ? '◑ ' + translate('partial-btn') : '✗ ' + translate('fails-btn')}
                  </span>
                {/if}
              </div>

              <!-- Question text -->
              <p class="text-sm text-slate-200 font-medium leading-snug">{q.text[currentLanguage]}</p>

              <!-- Answer buttons row -->
              <div class="flex gap-2">
                <button
                  onclick={() => selectOption(q.id, 'complies')}
                  class="flex-1 rounded-xl border py-2 px-2 text-xs font-bold text-center focus:outline-none transition-all {answered === 'complies' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-950/30' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40'}"
                >
                  {translate('complies-btn')}
                </button>
                <button
                  onclick={() => selectOption(q.id, 'partial')}
                  class="flex-1 rounded-xl border py-2 px-2 text-xs font-bold text-center focus:outline-none transition-all {answered === 'partial' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-950/30' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40'}"
                >
                  {translate('partial-btn')}
                </button>
                <button
                  onclick={() => selectOption(q.id, 'fails')}
                  class="flex-1 rounded-xl border py-2 px-2 text-xs font-bold text-center focus:outline-none transition-all {answered === 'fails' ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-950/30' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'}"
                >
                  {translate('fails-btn')}
                </button>
              </div>

            </div>
          {/each}
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4 shrink-0">
          <p class="text-xs text-slate-500">
            {currentLanguage === 'es'
              ? 'Las respuestas se guardan automáticamente.'
              : 'Answers are saved automatically.'}
          </p>
          <button
            onclick={closeDimensionModal}
            class="inline-flex items-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm px-5 py-2.5 focus:outline-none transition-colors shadow-lg shadow-rose-950/30"
          >
            {#if currentDimComplete}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            {/if}
            {translate('dim-modal-close')}
          </button>
        </div>

      </div>
    </div>
  </div>
{/if}

<!-- ═══════════════════════════════════════════════════════ 
     RESET CONFIRMATION MODAL 
     ══════════════════════════════════════════════════════ -->
{#if showResetModal}
  <div class="fixed inset-0 z-50 overflow-hidden no-print" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
    
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      onclick={cancelReset}
      onkeydown={(e) => e.key === 'Escape' && cancelReset()}
      role="button"
      tabindex="-1"
      aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
    ></div>

    <!-- Modal panel -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/80 animate-slide-up p-6 space-y-6">
        
        <!-- Header info -->
        <div class="flex items-start gap-4">
          <div class="h-10 w-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="space-y-1">
            <h3 id="reset-modal-title" class="font-display font-extrabold text-white text-base">
              {translate('reset-modal-title')}
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              {translate('reset-modal-desc')}
            </p>
          </div>
        </div>

        <!-- Buttons row -->
        <div class="flex gap-3 justify-end">
          <button
            onclick={cancelReset}
            class="rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors focus:outline-none"
          >
            {translate('reset-modal-cancel')}
          </button>
          <button
            onclick={confirmReset}
            class="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-lg shadow-rose-950/20 focus:outline-none"
          >
            {translate('reset-modal-confirm')}
          </button>
        </div>

      </div>
    </div>
  </div>
{/if}

