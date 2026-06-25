<script>
  import { casesData } from '../data/lawData.js';
  import MarkdownRenderer from './MarkdownRenderer.svelte';

  let { currentLanguage = 'es' } = $props();

  let searchQuery = $state('');
  let selectedCategory = $state('all');
  let selectedCase = $state(null);

  // Map case ID to readable category tags
  const categoryMap = {
    'sistema_escolar': { es: 'Educación', en: 'Education' },
    'sistema_hospitalario': { es: 'Salud', en: 'Healthcare' },
    'red_social': { es: 'Redes Sociales', en: 'Social Media' },
    'sistema_ecommerce': { es: 'E-commerce', en: 'Retail / E-commerce' },
    'sistema_financiero': { es: 'Finanzas', en: 'Finance / Fintech' },
    'sistema_gaming': { es: 'Videojuegos', en: 'Gaming' },
    'sistema_gobierno': { es: 'Sector Público', en: 'Public Sector' },
    'sistema_inmobiliario': { es: 'Inmobiliario', en: 'Real Estate' },
    'sistema_iot': { es: 'Internet de las Cosas', en: 'IoT / Hardware' },
    'sistema_ong': { es: 'ONGs / Fundaciones', en: 'NGOs' },
    'sistema_rrhh': { es: 'Recursos Humanos', en: 'Human Resources' },
    'sistema_seguros': { es: 'Seguros', en: 'Insurance' },
    'sistema_telecom': { es: 'Telecomunicaciones', en: 'Telecom' },
    'sistema_adtech': { es: 'AdTech / Publicidad', en: 'AdTech / Marketing' },
    'sistema_transporte_delivery': { es: 'Transporte / Logística', en: 'Logistics / Delivery' }
  };

  // Get unique categories list
  const uniqueCategories = Object.keys(categoryMap).map(key => ({
    id: key,
    label: categoryMap[key]
  }));

  // Filtered cases computed from search query and category selector
  const filteredCases = $derived(
    casesData.filter(c => {
      const tag = categoryMap[c.id];
      const matchesCategory = selectedCategory === 'all' || c.id === selectedCategory;
      const textToSearch = `${c.title} ${c.subtitle} ${c.html}`.toLowerCase();
      const matchesSearch = textToSearch.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
  );

  function openCaseDetails(c) {
    selectedCase = c;
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  }

  function closeCaseDetails() {
    selectedCase = null;
    document.body.style.overflow = '';
  }
</script>

<div class="space-y-10 py-6 animate-slide-up">
  
  <!-- Header Title -->
  <div class="space-y-2">
    <h2 class="font-display text-2xl md:text-4xl font-extrabold text-white">
      {currentLanguage === 'es' ? 'Casos de Cumplimiento por Sector' : 'Compliance Sector Cases'}
    </h2>
    <p class="text-slate-400 text-sm md:text-base">
      {currentLanguage === 'es'
        ? 'Explora el desglose de datos, riesgos críticos y medidas técnicas aplicadas en 15 industrias reales.'
        : 'Explore data structures, critical risks, and technical actions applied in 15 real industries.'}
    </p>
  </div>

  <div class="border-t border-slate-800"></div>

  <!-- Search & Filters Toolbar -->
  <div class="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
    
    <!-- Search Input -->
    <div class="relative flex-1 max-w-md">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={currentLanguage === 'es' ? 'Buscar en el caso (ej: cookies, RUT)...' : 'Search in case (e.g. cookies, RUT)...'}
        bind:value={searchQuery}
        class="block w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
      />
    </div>

    <!-- Category Filter -->
    <div class="flex items-center gap-2">
      <label for="category-select" class="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {currentLanguage === 'es' ? 'Sector:' : 'Sector:'}
      </label>
      <select
        id="category-select"
        bind:value={selectedCategory}
        class="rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
      >
        <option value="all">
          {currentLanguage === 'es' ? '⚡ Todos los Sectores' : '⚡ All Sectores'}
        </option>
        {#each uniqueCategories as cat}
          <option value={cat.id}>
            {currentLanguage === 'es' ? cat.label.es : cat.label.en}
          </option>
        {/each}
      </select>
    </div>

  </div>

  <!-- Cases Grid -->
  {#if filteredCases.length === 0}
    <div class="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-12 text-center text-slate-400">
      <svg class="h-8 w-8 mx-auto text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{currentLanguage === 'es' ? 'No se encontraron casos de estudio que coincidan con tu búsqueda.' : 'No case studies matched your search.'}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredCases as c}
        <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/50 transition-all group">
          
          <div class="space-y-3">
            <!-- Sector badge -->
            <div class="inline-flex rounded-lg bg-cl-blue/10 border border-cl-blue/20 text-cl-blue-light text-[10px] font-bold uppercase tracking-wider px-2 py-1">
              {currentLanguage === 'es' ? categoryMap[c.id].es : categoryMap[c.id].en}
            </div>
            
            <h3 class="font-display font-bold text-white text-lg group-hover:text-rose-400 transition-colors leading-tight">
              {c.title}
            </h3>
            
            <p class="text-xs text-slate-400 leading-snug line-clamp-2">
              {c.subtitle}
            </p>
          </div>

          <div class="pt-6 mt-4 border-t border-slate-800/50 flex items-center justify-between">
            <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Ley 21.719</span>
            
            <button
              onclick={() => openCaseDetails(c)}
              class="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 focus:outline-none"
            >
              {currentLanguage === 'es' ? 'Ver Análisis' : 'View Analysis'}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      {/each}
    </div>
  {/if}

  <!-- Detail Slide-Over Overlay -->
  {#if selectedCase}
    <div class="fixed inset-0 z-50 overflow-hidden no-print" role="dialog" aria-modal="true">
      <div
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onclick={closeCaseDetails}
        onkeydown={(e) => e.key === 'Escape' && closeCaseDetails()}
        role="button"
        tabindex="-1"
        aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
      ></div>
      
      <div class="absolute inset-y-0 right-0 max-w-full flex pl-10 md:pl-16">
        <div class="w-screen max-w-3xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-over">
          
          <!-- Drawer Header -->
          <div class="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950">
            <div class="flex items-center gap-3">
              <span class="rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-2 py-1">
                {currentLanguage === 'es' ? categoryMap[selectedCase.id].es : categoryMap[selectedCase.id].en}
              </span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {currentLanguage === 'es' ? 'Análisis Sectorial' : 'Sector Analysis'}
              </span>
            </div>
            
            <button
              onclick={closeCaseDetails}
              class="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center focus:outline-none"
              aria-label={currentLanguage === 'es' ? 'Cerrar' : 'Close'}
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Body (Markdown/HTML Content) -->
          <div class="flex-1 overflow-y-auto px-6 py-8">
            <article class="prose-custom max-w-none">
              <MarkdownRenderer html={selectedCase.html} />
            </article>
          </div>

          <!-- Drawer Footer -->
          <div class="h-14 border-t border-slate-800 px-6 flex items-center justify-between bg-slate-950 text-xs text-slate-500">
            <span>Ley de Protección de Datos Personales (Chile)</span>
            <button
              onclick={closeCaseDetails}
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
