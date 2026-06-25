<script>
  import Navbar from './lib/components/Navbar.svelte';
  import Overview from './lib/components/Overview.svelte';
  import Cases from './lib/components/Cases.svelte';
  import Vulnerabilities from './lib/components/Vulnerabilities.svelte';
  import Guides from './lib/components/Guides.svelte';
  import Auditor from './lib/components/Auditor.svelte';
  import { getSectionSchema, getBreadcrumbSchema } from './lib/seo/structuredData.js';

  // Global reactive state shared across all sections
  let currentSection = $state('overview');
  let currentLanguage = $state('es');

  // Map section IDs to their component + metadata
  const sectionMeta = {
    overview: {
      titleEs: 'Información General — Ley 21.719',
      titleEn: 'Law Overview — Ley 21.719'
    },
    cases: {
      titleEs: 'Casos Prácticos por Sector',
      titleEn: 'Sector Case Studies'
    },
    vulnerabilities: {
      titleEs: 'Brechas de Seguridad Reales',
      titleEn: 'Real Security Breaches'
    },
    guides: {
      titleEs: 'Guías y Plantillas de Cumplimiento',
      titleEn: 'Guides & Compliance Templates'
    },
    auditor: {
      titleEs: 'Auditor de Cumplimiento TI',
      titleEn: 'IT Compliance Auditor Tool'
    }
  };

  // Dynamic JSON-LD schemas per section
  const sectionSchemas = $derived(getSectionSchema(currentSection));
  const breadcrumbSchema = $derived(getBreadcrumbSchema(currentSection));
</script>

<!-- ====================== META / TITLE ====================== -->
<svelte:head>
  <title>
    {currentLanguage === 'es'
      ? sectionMeta[currentSection].titleEs + ' — Ley 21.719 Chile'
      : sectionMeta[currentSection].titleEn + ' — Ley 21.719 Chile'}
  </title>
  <meta
    name="description"
    content={currentLanguage === 'es'
      ? 'Portal de cumplimiento de la Ley N° 21.719 de Protección de Datos Personales de Chile. ' + sectionMeta[currentSection].titleEs + '. Casos, vulnerabilidades, guías MPI y auditor de cumplimiento TI.'
      : 'Compliance portal for Chilean Law 21,719 on Personal Data Protection. ' + sectionMeta[currentSection].titleEn + '. Cases, breaches, certification guides, and IT compliance auditor.'}
  />
  <link rel="canonical" href="https://ley21719.cl/{currentSection === 'overview' ? '' : '#' + currentSection}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

  <!-- Dynamic JSON-LD per section -->
  {@html '<script type="application/ld+json">' + JSON.stringify(sectionSchemas) + '</script>'}
  {@html '<script type="application/ld+json">' + JSON.stringify(breadcrumbSchema) + '</script>'}
</svelte:head>

<!-- ====================== MAIN APP LAYOUT ====================== -->
<div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">

  <!-- TOP NAVIGATION BAR -->
  <Navbar bind:currentSection bind:currentLanguage />

  <!-- MAIN CONTENT AREA -->
  <main class="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16">

    <!-- Section: Law Overview / Home -->
    {#if currentSection === 'overview'}
      <Overview {currentLanguage} bind:currentSection />
    {/if}

    <!-- Section: Sector Case Studies -->
    {#if currentSection === 'cases'}
      <Cases {currentLanguage} />
    {/if}

    <!-- Section: Security Vulnerabilities -->
    {#if currentSection === 'vulnerabilities'}
      <Vulnerabilities {currentLanguage} />
    {/if}

    <!-- Section: Guides & Templates -->
    {#if currentSection === 'guides'}
      <Guides {currentLanguage} />
    {/if}

    <!-- Section: IT Compliance Auditor Tool -->
    {#if currentSection === 'auditor'}
      <Auditor {currentLanguage} />
    {/if}

  </main>

  <!-- ====================== FOOTER ====================== -->
  <footer class="border-t border-slate-800 bg-slate-950 no-print py-10 mt-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
        
        <!-- Logo + Description -->
        <div class="space-y-3 md:col-span-1">
          <div class="flex items-center gap-2">
            <div class="relative h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <svg class="h-4 w-4 text-rose-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <!-- Chile flag ribbon -->
              <div class="absolute bottom-0 inset-x-0 h-0.5 flex rounded-b-lg overflow-hidden">
                <div class="flex-1 bg-blue-600"></div>
                <div class="flex-1 bg-white"></div>
                <div class="flex-1 bg-red-600"></div>
              </div>
            </div>
            <span class="font-display font-black text-white text-base tracking-tight">LEY 21.719</span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed max-w-xs">
            {currentLanguage === 'es'
              ? 'Portal de referencia para la adecuación técnica y legal a la nueva ley de protección de datos personales de Chile.'
              : 'Reference portal for technical and legal compliance with Chile\'s new personal data protection law.'}
          </p>
          <!-- Chile flag decoration -->
          <div class="flex h-1 w-16 overflow-hidden rounded-full">
            <div class="flex-1 bg-blue-600"></div>
            <div class="flex-1 bg-white"></div>
            <div class="flex-1 bg-red-600"></div>
          </div>
        </div>

        <!-- Quick Navigation Links -->
        <div class="space-y-3">
          <h4 class="font-display font-bold text-slate-300 text-xs uppercase tracking-widest">
            {currentLanguage === 'es' ? 'Secciones' : 'Sections'}
          </h4>
          <ul class="space-y-2 text-xs text-slate-500">
            <li>
              <button onclick={() => currentSection = 'overview'} class="hover:text-rose-400 transition-colors text-left focus:outline-none">
                {currentLanguage === 'es' ? '📋 Información de la Ley' : '📋 Law Overview'}
              </button>
            </li>
            <li>
              <button onclick={() => currentSection = 'cases'} class="hover:text-rose-400 transition-colors text-left focus:outline-none">
                {currentLanguage === 'es' ? '🏢 Casos Prácticos (15 Sectores)' : '🏢 Sector Cases (15 Industries)'}
              </button>
            </li>
            <li>
              <button onclick={() => currentSection = 'vulnerabilities'} class="hover:text-rose-400 transition-colors text-left focus:outline-none">
                {currentLanguage === 'es' ? '⚠️ Brechas y Vulnerabilidades' : '⚠️ Breaches & Vulnerabilities'}
              </button>
            </li>
            <li>
              <button onclick={() => currentSection = 'guides'} class="hover:text-rose-400 transition-colors text-left focus:outline-none">
                {currentLanguage === 'es' ? '📖 Guías y Plantillas MPI' : '📖 Guides & MPI Templates'}
              </button>
            </li>
            <li>
              <button onclick={() => currentSection = 'auditor'} class="hover:text-rose-400 transition-colors text-left focus:outline-none">
                {currentLanguage === 'es' ? '🛡️ Auditor TI de Cumplimiento' : '🛡️ IT Compliance Auditor'}
              </button>
            </li>
          </ul>
        </div>

        <!-- Key Dates & Contacts -->
        <div class="space-y-3">
          <h4 class="font-display font-bold text-slate-300 text-xs uppercase tracking-widest">
            {currentLanguage === 'es' ? 'Fechas Clave' : 'Key Dates'}
          </h4>
          <ul class="space-y-2 text-xs text-slate-500">
            <li class="flex gap-2">
              <span class="text-slate-700">◆</span>
              <span>
                <strong class="text-slate-400">{currentLanguage === 'es' ? 'Publicación:' : 'Publication:'}</strong>
                {' '}13 dic 2024
              </span>
            </li>
            <li class="flex gap-2">
              <span class="text-rose-600">◆</span>
              <span>
                <strong class="text-rose-400">{currentLanguage === 'es' ? 'Vigencia plena:' : 'Full enforcement:'}</strong>
                {' '}1 dic 2026
              </span>
            </li>
            <li class="flex gap-2">
              <span class="text-slate-700">◆</span>
              <span>
                <strong class="text-slate-400">{currentLanguage === 'es' ? 'Multa máx. (gravísima):' : 'Max fine (critical):'}</strong>
                {' '}20.000 UTM / 4% ventas
              </span>
            </li>
            <li class="flex gap-2">
              <span class="text-slate-700">◆</span>
              <span>
                <strong class="text-slate-400">{currentLanguage === 'es' ? 'Urgencia Brecha:' : 'Breach Urgency:'}</strong>
                {' '}72 hrs → APDP
              </span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Footer Bar -->
      <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-600">
        <p>
          {currentLanguage === 'es'
            ? '© 2024–2026 Ecosistema de Cumplimiento Ley 21.719 Chile. Contenido de referencia técnica y jurídica.'
            : '© 2024–2026 Ley 21.719 Chile Compliance Ecosystem. Technical and legal reference content.'}
        </p>
        <div class="flex items-center gap-3">
          <span class="h-1 w-6 bg-blue-600 rounded-full"></span>
          <span class="h-1 w-6 bg-white rounded-full"></span>
          <span class="h-1 w-6 bg-red-600 rounded-full"></span>
        </div>
      </div>

    </div>
  </footer>

</div>
