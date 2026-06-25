<script>
  let { currentSection = $bindable(), currentLanguage = $bindable() } = $props();
  
  let menuOpen = $state(false);

  const sections = [
    { id: 'overview', es: 'Información Ley', en: 'Law Overview' },
    { id: 'cases', es: 'Casos Prácticos', en: 'Cases Studies' },
    { id: 'vulnerabilities', es: 'Vulnerabilidades', en: 'Vulnerabilities' },
    { id: 'guides', es: 'Guías y Recursos', en: 'Guides & Templates' },
    { id: 'auditor', es: 'Auditor TI', en: 'IT Auditor Tool' }
  ];

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function selectSection(id) {
    currentSection = id;
    menuOpen = false;
  }
</script>

<header class="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md no-print">
  <div class="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
    
    <!-- Logo Area -->
    <button 
      onclick={() => selectSection('overview')}
      class="flex items-center gap-3 text-left focus:outline-none group"
    >
      <div class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-cl-blue-light transition-all group-hover:border-rose-500/50 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]">
        <svg class="h-5 w-5 text-cl-blue-light group-hover:text-rose-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <!-- Tiny flag colors indicating Chile -->
        <div class="absolute bottom-0 inset-x-0 h-1 flex rounded-b-xl overflow-hidden">
          <div class="w-1/3 bg-blue-600"></div>
          <div class="w-1/3 bg-white"></div>
          <div class="w-1/3 bg-red-600"></div>
        </div>
      </div>
      <div>
        <h1 class="font-display text-base font-extrabold tracking-tight text-white md:text-lg flex items-center gap-1.5">
          LEY 21.719
          <span class="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-400 border border-rose-500/20">CHILE</span>
        </h1>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-sans">Ecosistema de Cumplimiento</p>
      </div>
    </button>

    <!-- Desktop Navigation Links -->
    <nav class="hidden md:flex items-center gap-1">
      {#each sections as sec}
        <button
          onclick={() => selectSection(sec.id)}
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none {currentSection === sec.id ? 'bg-slate-900 text-white shadow-sm border border-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'}"
        >
          {currentLanguage === 'es' ? sec.es : sec.en}
        </button>
      {/each}
    </nav>

    <!-- Right Actions: Language Selector + Mobile Menu Trigger -->
    <div class="flex items-center gap-3">
      
      <!-- Language Selector Toggle -->
      <div class="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
        <button
          onclick={() => currentLanguage = 'es'}
          class="px-2.5 py-1 text-xs font-bold rounded-md transition-all focus:outline-none {currentLanguage === 'es' ? 'bg-cl-blue text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
        >
          ES
        </button>
        <button
          onclick={() => currentLanguage = 'en'}
          class="px-2.5 py-1 text-xs font-bold rounded-md transition-all focus:outline-none {currentLanguage === 'en' ? 'bg-cl-blue text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
        >
          EN
        </button>
      </div>

      <!-- Hamburger Menu for Mobile -->
      <button 
        onclick={toggleMenu}
        type="button" 
        class="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white focus:outline-none"
        aria-label="Toggle menu"
      >
        {#if menuOpen}
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Drawer Menu -->
  {#if menuOpen}
    <div class="md:hidden bg-slate-950 border-b border-slate-800 animate-fade-in">
      <div class="space-y-1 px-2 pb-4 pt-2">
        {#each sections as sec}
          <button
            onclick={() => selectSection(sec.id)}
            class="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors {currentSection === sec.id ? 'bg-slate-900 text-white border-l-2 border-rose-500 pl-4' : 'text-slate-400 hover:bg-slate-900/40 hover:text-white pl-3'}"
          >
            {currentLanguage === 'es' ? sec.es : sec.en}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</header>
