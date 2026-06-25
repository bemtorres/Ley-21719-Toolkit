<script>
  import { guidesData, templatesData } from '../data/lawData.js';
  import MarkdownRenderer from './MarkdownRenderer.svelte';

  let { currentLanguage = 'es' } = $props();

  let activeSection = $state('mpi'); // 'mpi' | 'incident' | 'templates'
  let selectedTemplate = $state(null);
  let copyFeedback = $state(false);

  // Directory of emergency contacts in Chile
  const contacts = [
    {
      name: 'CSIRT Nacional / ANCI',
      tag: 'Ciberseguridad General',
      phone: '1510',
      phoneAlt: '+56 44 771 1131',
      email: 'ayuda@anci.gob.cl',
      web: 'csirt.gob.cl',
      descEs: 'Reporte de incidentes de ciberseguridad, ataques DDoS, ransomware e intrusiones técnicas (24/7).',
      descEn: 'Reporting of cybersecurity incidents, DDoS attacks, ransomware, and technical intrusions (24/7).'
    },
    {
      name: 'PDI — Cibercrimen Metropolitana',
      tag: 'Denuncia Penal Cibercrimen',
      phone: '+56 2 2708 0658',
      phoneAlt: '+56 2 2708 0659',
      email: 'guardia@cibercrimen.cl',
      web: 'investigaciones.cl',
      descEs: 'Denuncias penales por delitos informáticos (extorsión, acceso no autorizado, sabotaje) según Ley 21.459.',
      descEn: 'Criminal complaints for cybercrimes (extortion, unauthorized access, sabotage) under Law 21,459.'
    },
    {
      name: 'Agencia de Protección de Datos (APDP)',
      tag: 'Regulador Ley 21.719',
      phone: 'N/A',
      phoneAlt: 'N/A',
      email: 'contacto@apdp.gob.cl',
      web: 'apdp.gob.cl',
      descEs: 'Notificación obligatoria de brechas de datos personales y sensibles dentro de un plazo máximo de 72 horas.',
      descEn: 'Mandatory notification of personal and sensitive data breaches within a maximum period of 72 hours.'
    },
    {
      name: 'SERNAC',
      tag: 'Protección al Consumidor',
      phone: '800 700 100',
      phoneAlt: 'N/A',
      email: 'N/A',
      web: 'sernac.cl',
      descEs: 'Autodenuncia e información proactiva en caso de incidentes que comprometan datos de consumidores chilenos.',
      descEn: 'Self-reporting and proactive notification for incidents compromising Chilean consumer data.'
    },
    {
      name: 'Comisión para el Mercado Financiero (CMF)',
      tag: 'Sector Financiero / Fintech',
      phone: 'N/A',
      phoneAlt: 'N/A',
      email: 'incidentes@cmfchile.cl',
      web: 'cmfchile.cl',
      descEs: 'Reporte de incidentes operacionales y ciberataques en bancos, aseguradoras y fintechs reguladas mediante SEIL.',
      descEn: 'Reporting of operational incidents and cyberattacks in regulated banks, insurers, and fintechs via SEIL.'
    }
  ];

  // Helper to copy raw template markdown text to clipboard
  function copyTemplateToClipboard(rawText) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(rawText)
        .then(() => {
          copyFeedback = true;
          setTimeout(() => copyFeedback = false, 2000);
        })
        .catch(() => fallbackCopy(rawText));
    } else {
      fallbackCopy(rawText);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      copyFeedback = true;
      setTimeout(() => copyFeedback = false, 2000);
    } catch (err) {
      alert("Failed to copy template.");
    }
    document.body.removeChild(textArea);
  }

  function openTemplate(t) {
    selectedTemplate = t;
    document.body.style.overflow = 'hidden';
  }

  function closeTemplate() {
    selectedTemplate = null;
    document.body.style.overflow = '';
  }
</script>

<div class="space-y-8 py-6 animate-slide-up">
  
  <!-- Header Title -->
  <div class="space-y-2">
    <h2 class="font-display text-2xl md:text-4xl font-extrabold text-white">
      {currentLanguage === 'es' ? 'Guías Prácticas y Plantillas de Cumplimiento' : 'Guides & Compliance Templates'}
    </h2>
    <p class="text-slate-400 text-sm md:text-base">
      {currentLanguage === 'es'
        ? 'Manuales operativos de ciberseguridad, procesos de certificación MPI y descarga de documentación legal.'
        : 'Cybersecurity manuals, MPI certification processes, and download of legal compliance templates.'}
    </p>
  </div>

  <!-- Tab Toggle Selector -->
  <div class="flex border-b border-slate-800 gap-4">
    <button
      onclick={() => activeSection = 'mpi'}
      class="pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative focus:outline-none {activeSection === 'mpi' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'}"
    >
      🛡️ {currentLanguage === 'es' ? 'Certificación MPI APDP' : 'MPI Certification'}
    </button>
    <button
      onclick={() => activeSection = 'incident'}
      class="pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative focus:outline-none {activeSection === 'incident' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'}"
    >
      🚨 {currentLanguage === 'es' ? 'Respuesta a Incidentes' : 'Incident Response'}
    </button>
    <button
      onclick={() => activeSection = 'templates'}
      class="pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative focus:outline-none {activeSection === 'templates' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'}"
    >
      📄 {currentLanguage === 'es' ? 'Plantillas de Cumplimiento' : 'Legal Templates'}
    </button>
  </div>

  <!-- Tab 1: MPI Certificación -->
  {#if activeSection === 'mpi'}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Visual elements summary of MPI elements -->
      <div class="lg:col-span-1 space-y-6">
        <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 class="font-display font-bold text-white text-lg border-b border-slate-800 pb-2">
            {currentLanguage === 'es' ? 'Los 7 Elementos del MPI' : 'The 7 Elements of MPI'}
          </h3>
          <p class="text-xs text-slate-400">
            {currentLanguage === 'es'
              ? 'El Modelo de Prevención de Infracciones debe contar estructuralmente con estos controles organizativos (Art. 49).'
              : 'The Infraction Prevention Model must structurally possess these organizational controls (Art. 49).'}
          </p>
          
          <ul class="space-y-2.5 text-xs text-slate-300">
            <li class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span class="h-5 w-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">1</span>
              <span>{currentLanguage === 'es' ? 'Designación formal del DPD' : 'Formal appointment of the DPO'}</span>
            </li>
            <li class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span class="h-5 w-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">2</span>
              <span>{currentLanguage === 'es' ? 'Inventario de Datos Tratados (RAT)' : 'Data Activity Registry (RoPA)'}</span>
            </li>
            <li class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span class="h-5 w-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">3</span>
              <span>{currentLanguage === 'es' ? 'Matriz de Riesgo de Privacidad' : 'Privacy Risk Assessment Matrix'}</span>
            </li>
            <li class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span class="h-5 w-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">4</span>
              <span>{currentLanguage === 'es' ? 'Protocolos y Ejercicio ARCO-P' : 'ARCO-P Exercise Protocols'}</span>
            </li>
            <li class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span class="h-5 w-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">5</span>
              <span>{currentLanguage === 'es' ? 'Canal de Denuncia Interna' : 'Internal Whistleblowing Channel'}</span>
            </li>
            <li class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span class="h-5 w-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">6</span>
              <span>{currentLanguage === 'es' ? 'Capacitación Continua al Staff' : 'Continuous Staff Training'}</span>
            </li>
            <li class="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span class="h-5 w-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">7</span>
              <span>{currentLanguage === 'es' ? 'Supervisión y Auditoría Anual' : 'Annual Supervision & Audit'}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Rendered Guide Content -->
      <div class="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
        <article class="prose-custom max-w-none">
          <MarkdownRenderer html={guidesData['guia_certificacion_apdp']?.html || ''} />
        </article>
      </div>

    </div>
  {/if}

  <!-- Tab 2: Incident Response & Emergency Directory -->
  {#if activeSection === 'incident'}
    <div class="space-y-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Visual Timeline Protocol -->
        <div class="lg:col-span-1 space-y-6">
          <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h3 class="font-display font-bold text-white text-lg border-b border-slate-800 pb-2">
              {currentLanguage === 'es' ? 'Línea de Respuesta Crítica' : 'Critical Response Timeline'}
            </h3>
            
            <div class="relative border-l border-slate-800 pl-4 space-y-6">
              <div class="relative">
                <span class="absolute left-[-21px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <div class="text-[10px] font-black text-rose-400">0 - 4 HORAS</div>
                <div class="text-xs font-bold text-white mt-0.5">{currentLanguage === 'es' ? 'Contención e Identificación' : 'Containment & Identification'}</div>
                <div class="text-[10px] text-slate-400 leading-tight mt-0.5">{currentLanguage === 'es' ? 'Aislar sistemas, activar comité de crisis, iniciar bitácora.' : 'Isolate systems, activate crisis committee, start log.'}</div>
              </div>
              <div class="relative">
                <span class="absolute left-[-21px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <div class="text-[10px] font-black text-amber-400">4 - 24 HORAS</div>
                <div class="text-xs font-bold text-white mt-0.5">{currentLanguage === 'es' ? 'Evaluación del Impacto' : 'Impact Assessment'}</div>
                <div class="text-[10px] text-slate-400 leading-tight mt-0.5">{currentLanguage === 'es' ? 'Identificar datos filtrados (generales, sensibles) y volumen.' : 'Identify leaked data (general, sensitive) and volume.'}</div>
              </div>
              <div class="relative">
                <span class="absolute left-[-21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                <div class="text-[10px] font-black text-blue-400">24 - 72 HORAS</div>
                <div class="text-xs font-bold text-white mt-0.5">{currentLanguage === 'es' ? 'Reporte Oficial APDP' : 'Official APDP Reporting'}</div>
                <div class="text-[10px] text-slate-400 leading-tight mt-0.5">{currentLanguage === 'es' ? 'Notificación obligatoria a la APDP y afectados.' : 'Mandatory notification to APDP and subjects.'}</div>
              </div>
              <div class="relative">
                <span class="absolute left-[-21px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <div class="text-[10px] font-black text-emerald-400">DÍA 2 - 7</div>
                <div class="text-xs font-bold text-white mt-0.5">{currentLanguage === 'es' ? 'Erradicación y Recuperación' : 'Eradication & Recovery'}</div>
                <div class="text-[10px] text-slate-400 leading-tight mt-0.5">{currentLanguage === 'es' ? 'Limpieza de malware, restaurar backups inmutables.' : 'Clean malware, restore immutable backups.'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rendered Guide Content -->
        <div class="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
          <article class="prose-custom max-w-none">
            <MarkdownRenderer html={guidesData['guia_respuesta_incidentes']?.html || ''} />
          </article>
        </div>
      </div>

      <!-- Emergency Directory (WOW factor contact cards) -->
      <div class="space-y-4">
        <h3 class="font-display text-xl font-extrabold text-white text-center">
          {currentLanguage === 'es' ? 'Directorio Nacional de Contactos de Emergencia' : 'National Emergency Contact Directory'}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each contacts as con}
            <div class="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400 uppercase">
                    {con.tag}
                  </span>
                  {#if con.phone !== 'N/A'}
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {/if}
                </div>
                <h4 class="font-display font-bold text-white text-base leading-snug">{con.name}</h4>
                <p class="text-xs text-slate-400 leading-relaxed">{currentLanguage === 'es' ? con.descEs : con.descEn}</p>
              </div>

              <div class="pt-4 mt-4 border-t border-slate-800/80 space-y-2 text-xs">
                {#if con.phone !== 'N/A'}
                  <div class="flex items-center justify-between text-slate-300">
                    <span class="text-slate-500">Teléfono:</span>
                    <a href="tel:{con.phone.replace(/\s+/g, '')}" class="font-black text-rose-400 hover:text-rose-300">{con.phone}</a>
                  </div>
                {/if}
                {#if con.email !== 'N/A'}
                  <div class="flex items-center justify-between text-slate-300">
                    <span class="text-slate-500">Email:</span>
                    <a href="mailto:{con.email}" class="font-semibold text-cl-blue-light hover:underline">{con.email}</a>
                  </div>
                {/if}
                <div class="flex items-center justify-between text-slate-300">
                  <span class="text-slate-500">Web:</span>
                  <a href="https://{con.web}" target="_blank" rel="noopener noreferrer" class="text-slate-300 hover:text-white font-medium hover:underline">{con.web}</a>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

    </div>
  {/if}

  <!-- Tab 3: Templates and Copy Tool -->
  {#if activeSection === 'templates'}
    <div class="space-y-6">
      
      <div class="text-center max-w-xl mx-auto space-y-2">
        <p class="text-xs md:text-sm text-slate-400">
          {currentLanguage === 'es'
            ? 'Haz clic en cualquier documento para abrir el visualizador de texto y copiar la plantilla estructurada directamente a tu clipboard.'
            : 'Click on any document to open the text viewer and copy the structured template directly to your clipboard.'}
        </p>
      </div>

      <!-- Templates List Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each templatesData as temp}
          <button
            onclick={() => openTemplate(temp)}
            class="text-left rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 hover:shadow-lg transition-all focus:outline-none group flex flex-col justify-between h-[130px]"
          >
            <div class="space-y-1">
              <svg class="h-6 w-6 text-slate-500 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
              <h4 class="font-display font-bold text-white text-xs md:text-sm leading-snug group-hover:text-rose-400 transition-colors pt-2">
                {temp.title.replace(/^TEMPLATE:\s*|^DOCUMENTO:\s*/, '')}
              </h4>
            </div>
            <div class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              {temp.filename.toLowerCase()}
            </div>
          </button>
        {/each}
      </div>

    </div>
  {/if}

  <!-- Template Details Modal Viewer -->
  {#if selectedTemplate}
    <div class="fixed inset-0 z-50 overflow-hidden no-print" role="dialog" aria-modal="true">
      <div
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onclick={closeTemplate}
        onkeydown={(e) => e.key === 'Escape' && closeTemplate()}
        role="button"
        tabindex="-1"
        aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
      ></div>
      
      <div class="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          <!-- Modal Header -->
          <div class="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950">
            <div class="flex items-center gap-3">
              <svg class="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
              <div>
                <h3 class="font-display font-bold text-white text-sm md:text-base leading-none">
                  {selectedTemplate.title.replace(/^TEMPLATE:\s*|^DOCUMENTO:\s*/, '')}
                </h3>
                <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  {selectedTemplate.filename}
                </span>
              </div>
            </div>

            <!-- Header actions: Copy button + Close -->
            <div class="flex items-center gap-2">
              <button
                onclick={() => copyTemplateToClipboard(selectedTemplate.raw)}
                class="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition-colors focus:outline-none"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copyFeedback ? (currentLanguage === 'es' ? '¡Copiado!' : 'Copied!') : (currentLanguage === 'es' ? 'Copiar Plantilla' : 'Copy Template')}
              </button>

              <button
                onclick={closeTemplate}
                class="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center focus:outline-none"
                aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body (Preview of markdown rendered as html) -->
          <div class="flex-1 overflow-y-auto px-6 py-6 bg-slate-950/20">
            <article class="prose-custom max-w-none">
              <MarkdownRenderer html={selectedTemplate.html} />
            </article>
          </div>

          <!-- Modal Footer -->
          <div class="h-12 border-t border-slate-800 px-6 flex items-center justify-between bg-slate-950 text-xs text-slate-500">
            <span>Plantillas de adecuación legal Ley 21.719</span>
            <button
              onclick={closeTemplate}
              class="text-rose-400 font-bold hover:text-rose-300 focus:outline-none"
            >
              {currentLanguage === 'es' ? 'Cerrar Previsualización' : 'Close Preview'}
            </button>
          </div>

        </div>
      </div>
    </div>
  {/if}

</div>
