<script>
  import { vulnerabilitiesData } from '../data/lawData.js';
  import MarkdownRenderer from './MarkdownRenderer.svelte';

  let { currentLanguage = 'es' } = $props();

  let activeTab = $state('chile'); // 'chile' | 'internacionales'
  let selectedVuln = $state(null);

  // Helper to extract key metrics (Volume, Year, Fine) based on filenames or titles
  function getVulnMetadata(v, tab) {
    if (tab === 'chile') {
      if (v.filename.includes('caja_los_andes')) return { year: '2024', impact: '~10M chilenos', fine: '$0 (Pre-ley)', gravity: 'Gravísima' };
      if (v.filename.includes('gtd')) return { year: '2023', impact: 'Corporativo / Cloud', fine: '$0 (Pre-ley)', gravity: 'Gravísima' };
      if (v.filename.includes('ifx')) return { year: '2023', impact: 'Servicios Públicos', fine: '$0 (Pre-ley)', gravity: 'Gravísima' };
      if (v.filename.includes('poder_judicial')) return { year: '2022', impact: 'Infraestructura Crítica', fine: '$0 (Pre-ley)', gravity: 'Grave' };
      if (v.filename.includes('banco_estado')) return { year: '2020', impact: 'Financiero / Sucursales', fine: '$0 (Pre-ley)', gravity: 'Gravísima' };
      if (v.filename.includes('clinica_davila')) return { year: '2025', impact: 'Fichas de Salud', fine: '$0 (Pre-ley)', gravity: 'Gravísima' };
    } else {
      if (v.filename.includes('meta_1_2b')) return { year: '2023', impact: 'Transferencias Transfronterizas', fine: '€1.200M', gravity: 'Gravísima' };
      if (v.filename.includes('tiktok')) return { year: '2025', impact: 'Datos de Menores', fine: '€530M', gravity: 'Gravísima' };
      if (v.filename.includes('clearview')) return { year: '2021-25', impact: 'Biometría Masiva', fine: '€100M+', gravity: 'Gravísima' };
      if (v.filename.includes('uber')) return { year: '2024', impact: 'Conductores / Nube', fine: '€290M', gravity: 'Gravísima' };
      if (v.filename.includes('linkedin')) return { year: '2024', impact: 'Publicidad Conductual', fine: '€310M', gravity: 'Grave' };
      if (v.filename.includes('amazon')) return { year: '2021', impact: 'Cookies sin Opt-in', fine: '€746M', gravity: 'Grave' };
      if (v.filename.includes('meta_251m_passwords')) return { year: '2024', impact: 'Contraseñas en Texto Plano', fine: '€251M', gravity: 'Gravísima' };
      if (v.filename.includes('brasil_lgpd')) return { year: '2023-25', impact: 'Pyme / Sector Público', fine: 'R$ 14K+', gravity: 'Leve / Grave' };
      if (v.filename.includes('shein')) return { year: '2025', impact: 'Dark Patterns / Cookies', fine: '€150M', gravity: 'Grave' };
    }
    return { year: 'N/A', impact: 'Variable', fine: 'N/A', gravity: 'Variable' };
  }

  function openVuln(v) {
    selectedVuln = v;
    document.body.style.overflow = 'hidden';
  }

  function closeVuln() {
    selectedVuln = null;
    document.body.style.overflow = '';
  }

  function parseYearForSorting(yearStr) {
    if (!yearStr || yearStr === 'N/A') return 0;
    if (yearStr.includes('-')) {
      const parts = yearStr.split('-');
      const last = parts[parts.length - 1].trim();
      if (last.length === 2) {
        return parseInt('20' + last);
      }
      return parseInt(last);
    }
    return parseInt(yearStr);
  }

  const sortedVulnerabilities = $derived(
    [...(vulnerabilitiesData[activeTab] || [])].sort((a, b) => {
      const metaA = getVulnMetadata(a, activeTab);
      const metaB = getVulnMetadata(b, activeTab);
      return parseYearForSorting(metaB.year) - parseYearForSorting(metaA.year);
    })
  );
</script>

<div class="space-y-8 py-6 animate-slide-up">
  
  <!-- Header Title -->
  <div class="space-y-2">
    <h2 class="font-display text-2xl md:text-4xl font-extrabold text-white">
      {currentLanguage === 'es' ? 'Brechas de Seguridad y Lecciones Reales' : 'Real Breaches & Lessons'}
    </h2>
    <p class="text-slate-400 text-sm md:text-base">
      {currentLanguage === 'es'
        ? 'Analizamos ciberataques, secuestro de datos e infracciones a nivel nacional e internacional a la luz de la Ley N° 21.719.'
        : 'Analyzing cyberattacks, ransomware, and infractions nationally and internationally under the scope of Law 21.719.'}
    </p>
  </div>

  <!-- Tab Toggle Selector -->
  <div class="flex border-b border-slate-800 gap-4">
    <button
      onclick={() => activeTab = 'chile'}
      class="pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative focus:outline-none {activeTab === 'chile' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'}"
    >
      🇨🇱 {currentLanguage === 'es' ? 'Casos de Chile' : 'Chilean Incidents'}
    </button>
    <button
      onclick={() => activeTab = 'internacionales'}
      class="pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative focus:outline-none {activeTab === 'internacionales' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'}"
    >
      🌎 {currentLanguage === 'es' ? 'Casos Internacionales' : 'International Incidents'}
    </button>
  </div>

  <!-- Vulnerability Card List -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each sortedVulnerabilities as v}
      {@const meta = getVulnMetadata(v, activeTab)}
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-lg transition-all group">
        
        <div class="space-y-4">
          <!-- Incident Header tags -->
          <div class="flex items-center justify-between">
            <span class="rounded bg-slate-950 px-2.5 py-1 text-xs font-black text-rose-400 border border-slate-800 tracking-wider shadow-inner">
              {meta.year}
            </span>
            <span class="rounded bg-rose-500/10 px-2 py-0.5 text-[9px] font-extrabold tracking-wider border border-rose-500/20 {meta.gravity === 'Gravísima' ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-amber-400 border-amber-500/20 bg-amber-500/10'} uppercase">
              {meta.gravity}
            </span>
          </div>

          <h3 class="font-display font-extrabold text-white text-base md:text-lg group-hover:text-rose-400 transition-colors leading-snug">
            {v.title.replace(/^Caso Real \d+:\s*|^Caso \d+:\s*/, '')}
          </h3>

          <!-- Details grid summary -->
          <div class="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] leading-tight">
            <div>
              <div class="text-slate-500 font-semibold uppercase">{currentLanguage === 'es' ? 'Impacto:' : 'Impact:'}</div>
              <div class="text-slate-300 mt-0.5 truncate">{meta.impact}</div>
            </div>
            <div>
              <div class="text-slate-500 font-semibold uppercase">{currentLanguage === 'es' ? 'Multa Aplicada:' : 'Fine Applied:'}</div>
              <div class="text-rose-400 mt-0.5 truncate font-bold">{meta.fine}</div>
            </div>
          </div>
        </div>

        <div class="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between">
          <span class="text-[10px] font-bold text-slate-500 uppercase">Lecciones TI</span>
          
          <button
            onclick={() => openVuln(v)}
            class="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 focus:outline-none"
          >
            {currentLanguage === 'es' ? 'Analizar Impacto' : 'Analyze Impact'}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    {/each}
  </div>

  <!-- Detail Slide-Over Overlay -->
  {#if selectedVuln}
    <div class="fixed inset-0 z-50 overflow-hidden no-print" role="dialog" aria-modal="true">
      <div
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onclick={closeVuln}
        onkeydown={(e) => e.key === 'Escape' && closeVuln()}
        role="button"
        tabindex="-1"
        aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
      ></div>
      
      <div class="absolute inset-y-0 right-0 max-w-full flex pl-10 md:pl-16">
        <div class="w-screen max-w-3xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-over">
          
          <!-- Drawer Header -->
          <div class="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950">
            <div class="flex items-center gap-2">
              <span class="rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-2 py-1 uppercase">
                {activeTab === 'chile' ? 'Nacional' : 'Internacional'}
              </span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {currentLanguage === 'es' ? 'Diagnóstico de Brecha de Seguridad' : 'Security Breach Analysis'}
              </span>
            </div>
            
            <button
              onclick={closeVuln}
              class="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center focus:outline-none"
              aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto px-6 py-8">
            <article class="prose-custom max-w-none">
              <MarkdownRenderer html={selectedVuln.html} />
            </article>
          </div>

          <!-- Drawer Footer -->
          <div class="h-14 border-t border-slate-800 px-6 flex items-center justify-between bg-slate-950 text-xs text-slate-500">
            <span>Análisis de Ciberseguridad Ley 21.719</span>
            <button
              onclick={closeVuln}
              class="text-rose-400 font-bold hover:text-rose-300 focus:outline-none"
            >
              {currentLanguage === 'es' ? 'Cerrar Vista' : 'Close View'}
            </button>
          </div>

        </div>
      </div>
    </div>
  {/if}

</div>
