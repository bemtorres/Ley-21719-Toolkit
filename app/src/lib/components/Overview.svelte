<script>
  let { currentLanguage = 'es', currentSection = $bindable() } = $props();

  const principles = [
    {
      num: 1,
      titleEs: 'Licitud y Lealtad',
      titleEn: 'Lawfulness & Fairness',
      descEs: 'Los datos deben tratarse con apego a la ley y de manera justa, sin engaños, manipulación ni fines abusivos. Todo tratamiento requiere una base legal válida.',
      descEn: 'Data must be processed in compliance with the law and fairly, without deception, manipulation, or abusive purposes. All processing requires a valid legal basis.'
    },
    {
      num: 2,
      titleEs: 'Finalidad',
      titleEn: 'Purpose Limitation',
      descEs: 'Los datos deben ser recolectados para fines específicos, explícitos y legítimos. Queda prohibido su uso posterior para fines incompatibles.',
      descEn: 'Data must be collected for specific, explicit, and legitimate purposes. Subsequent use for incompatible purposes is prohibited.'
    },
    {
      num: 3,
      titleEs: 'Proporcionalidad',
      titleEn: 'Data Minimization',
      descEs: 'Solo se deben recopilar y tratar los datos que sean estrictamente necesarios, pertinentes y adecuados para la finalidad declarada.',
      descEn: 'Only data strictly necessary, relevant, and adequate for the declared purpose should be collected and processed.'
    },
    {
      num: 4,
      titleEs: 'Calidad y Exactitud',
      titleEn: 'Accuracy & Quality',
      descEs: 'Los datos deben ser exactos, completos y estar actualizados. Deben eliminarse o anonimizarse tan pronto dejen de ser necesarios.',
      descEn: 'Data must be accurate, complete, and up to date. They must be deleted or anonymized as soon as they are no longer necessary.'
    },
    {
      num: 5,
      titleEs: 'Responsabilidad Proactiva',
      titleEn: 'Accountability',
      descEs: 'El responsable del tratamiento no solo debe cumplir la ley, sino también estar en condiciones de demostrar y acreditar dicho cumplimiento.',
      descEn: 'The controller must not only comply with the law, but also be in a position to demonstrate and prove such compliance.'
    },
    {
      num: 6,
      titleEs: 'Seguridad',
      titleEn: 'Security & Integrity',
      descEs: 'Obligatorio adoptar medidas técnicas y organizativas apropiadas para resguardar la confidencialidad, integridad y disponibilidad.',
      descEn: 'Obligatory to adopt appropriate technical and organizational measures to safeguard confidentiality, integrity, and availability.'
    },
    {
      num: 7,
      titleEs: 'Transparencia',
      titleEn: 'Transparency',
      descEs: 'Se debe garantizar al titular información clara, accesible y oportuna sobre quién trata sus datos y cómo ejercer sus derechos.',
      descEn: 'Clear, accessible, and timely information must be guaranteed to the data subject about who processes their data and how to exercise rights.'
    }
  ];

  const arcoRights = [
    {
      letter: 'A',
      nameEs: 'Acceso',
      nameEn: 'Access',
      descEs: 'Derecho a saber si se están tratando sus datos, con qué finalidad, los destinatarios de los mismos y el período de conservación.',
      descEn: 'Right to know if their data is being processed, for what purpose, the recipients, and the retention period.'
    },
    {
      letter: 'R',
      nameEs: 'Rectificación',
      nameEn: 'Rectification',
      descEs: 'Solicitar la corrección de datos personales que sean inexactos, desactualizados, incompletos o erróneos.',
      descEn: 'Request the correction of personal data that is inaccurate, outdated, incomplete, or incorrect.'
    },
    {
      letter: 'C',
      nameEs: 'Cancelación / Supresión',
      nameEn: 'Erasure / Cancelation',
      descEs: 'Exigir la eliminación de datos cuando hayan dejado de ser necesarios, el tratamiento sea ilícito, o se haya revocado el consentimiento.',
      descEn: 'Demand data deletion when it is no longer necessary, processing is unlawful, or consent has been revoked.'
    },
    {
      letter: 'O',
      nameEs: 'Oposición',
      nameEn: 'Objection',
      descEs: 'Oponerse al tratamiento por motivos fundados y legítimos, o cuando el tratamiento tenga por objeto mercadotecnia directa.',
      descEn: 'Object to the processing for justified and legitimate reasons, or when processing is for direct marketing.'
    },
    {
      letter: 'P',
      nameEs: 'Portabilidad',
      nameEn: 'Portability',
      descEs: 'Derecho a recibir sus datos en un formato estructurado y legible, y a transmitirlos a otro responsable sin impedimentos.',
      descEn: 'Right to receive data in a structured, readable format and transmit it to another controller without hindrance.'
    }
  ];

  const timelineSteps = [
    {
      date: 'Dic 2024',
      titleEs: 'Publicación de la Ley',
      titleEn: 'Law Publication',
      descEs: 'Publicada en el Diario Oficial el 13 de diciembre de 2024, iniciando el período de vacancia legal.',
      descEn: 'Published in the Official Gazette on December 13, 2024, starting the legal vacancy period.'
    },
    {
      date: '2025 (H1)',
      titleEs: 'Fase de Diagnóstico',
      titleEn: 'Diagnosis Phase',
      descEs: 'Mapeo de inventario de datos personales, flujos, y análisis de brechas técnicas en las organizaciones.',
      descEn: 'Mapping personal data inventory, flows, and technical gap analysis in organizations.'
    },
    {
      date: '2025 (H2) - 2026',
      titleEs: 'Diseño e Implementación',
      titleEn: 'Design & Implementation',
      descEs: 'Creación de políticas de privacidad, ajuste de contratos CCT, y evaluaciones de impacto EIPD en sistemas críticos.',
      descEn: 'Creation of privacy policies, adjustment of SCC contracts, and DPIA impact assessments in critical systems.'
    },
    {
      date: 'Mediados 2026',
      titleEs: 'Modelo de Prevención y DPD',
      titleEn: 'Prevention Model & DPO',
      descEs: 'Nombramiento del Delegado de Protección de Datos (DPD) e implementación del Modelo de Prevención de Infracciones (MPI).',
      descEn: 'Appointment of the Data Protection Officer (DPO) and implementation of the Infraction Prevention Model (MPI).'
    },
    {
      date: '1 Dic 2026',
      titleEs: 'Entrada en Vigencia Plena',
      titleEn: 'Full Enforcement',
      descEs: 'Entrada en vigencia total de la ley. La Agencia (APDP) iniciará fiscalizaciones y podrá aplicar multas millonarias.',
      descEn: 'Full enforcement of the law. The Agency (APDP) will begin inspections and can apply million-dollar fines.'
    }
  ];

  let activeArco = $state(0);
</script>

<div class="space-y-16 py-6 animate-slide-up">
  
  <!-- Hero Section -->
  <section class="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 p-8 md:p-12 shadow-2xl">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-red-900/10"></div>
    <div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-red-500/5 blur-3xl"></div>
    
    <div class="relative max-w-3xl space-y-6">
      <div class="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
        <span class="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
        {currentLanguage === 'es' ? 'VIGENCIA EN DICIEMBRE 2026' : 'ENFORCEMENT IN DECEMBER 2026'}
      </div>
      
      <h2 class="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
        {currentLanguage === 'es' 
          ? 'Ley N° 21.719: Nueva Regulación de Datos Personales en Chile' 
          : 'Law N° 21.719: New Personal Data Regulation in Chile'}
      </h2>
      
      <p class="text-base md:text-lg text-slate-300 leading-relaxed">
        {currentLanguage === 'es'
          ? 'Publicada el 13 de diciembre de 2024, esta histórica normativa moderniza la antigua legislación de 1999, alineando los estándares de Chile con el Reglamento General de Protección de Datos (RGPD) europeo y creando la nueva Agencia de Protección de Datos (APDP).'
          : 'Published on December 13, 2024, this historic regulation modernizes the old 1999 legislation, aligning Chile\'s standards with the European GDPR and creating the new Data Protection Agency (APDP).'}
      </p>

      <div class="flex flex-wrap gap-4 pt-2">
        <button 
          onclick={() => currentSection = 'auditor'}
          class="inline-flex items-center gap-2 rounded-xl bg-cl-red hover:bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition-all hover:scale-[1.02] focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {currentLanguage === 'es' ? 'Auditar mi Aplicación' : 'Audit My Application'}
        </button>
        <button 
          onclick={() => currentSection = 'cases'}
          class="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition-all hover:scale-[1.02] focus:outline-none"
        >
          {currentLanguage === 'es' ? 'Ver Casos por Sector' : 'Explore Cases by Sector'}
        </button>
      </div>
    </div>
  </section>

  <!-- Interactive Ecosystem Map -->
  <section class="space-y-6">
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <h3 class="font-display text-2xl md:text-3xl font-extrabold text-white">
        {currentLanguage === 'es' ? 'Ecosistema de Relaciones de la Ley' : 'Ecosystem of Law Relationships'}
      </h3>
      <p class="text-sm text-slate-400">
        {currentLanguage === 'es' 
          ? 'Cómo interactúan las personas, las empresas y la autoridad bajo la nueva normativa.' 
          : 'How citizens, companies, and the regulator interact under the new framework.'}
      </p>
    </div>

    <!-- HTML / CSS Grid-based Ecosystem visualization -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
      
      <!-- Node: Titular -->
      <div class="relative rounded-2xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col items-center text-center group hover:border-slate-700 transition-all">
        <div class="h-12 w-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h4 class="font-display font-bold text-white text-base">
          {currentLanguage === 'es' ? 'Titular de los Datos' : 'Data Subject'}
        </h4>
        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {currentLanguage === 'es' ? 'Ciudadano / Usuario' : 'Citizen / User'}
        </span>
        <p class="text-xs text-slate-400">
          {currentLanguage === 'es'
            ? 'Dueño de la información personal. Ejerce derechos ARCO-P y entrega consentimiento legal.'
            : 'Owner of the personal information. Exercises ARCO-P rights and provides legal consent.'}
        </p>
      </div>

      <!-- Node: Responsable -->
      <div class="relative rounded-2xl bg-slate-900/50 border border-cl-blue/30 p-6 flex flex-col items-center text-center group hover:border-cl-blue/60 transition-all">
        <div class="h-12 w-12 rounded-xl bg-cl-blue/20 text-cl-blue-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h4 class="font-display font-bold text-white text-base">
          {currentLanguage === 'es' ? 'Responsable del Tratamiento' : 'Data Controller'}
        </h4>
        <span class="text-[10px] font-semibold text-cl-blue-light uppercase tracking-wider mb-2">
          {currentLanguage === 'es' ? 'Empresa / Institución' : 'Company / Institution'}
        </span>
        <p class="text-xs text-slate-400">
          {currentLanguage === 'es'
            ? 'Entidad que decide los fines y medios del tratamiento de los datos. Debe demostrar cumplimiento y nombrar un DPD.'
            : 'Entity deciding purposes and means of processing. Must demonstrate compliance and appoint a DPO.'}
        </p>
      </div>

      <!-- Node: DPD -->
      <div class="relative rounded-2xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col items-center text-center group hover:border-slate-700 transition-all">
        <div class="h-12 w-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h4 class="font-display font-bold text-white text-base">
          {currentLanguage === 'es' ? 'Delegado de Datos (DPD)' : 'Data Protection Officer'}
        </h4>
        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {currentLanguage === 'es' ? 'DPO / Enlace de Control' : 'DPO / Control Link'}
        </span>
        <p class="text-xs text-slate-400">
          {currentLanguage === 'es'
            ? 'Supervisa el cumplimiento técnico interno con autonomía y actúa como enlace con la APDP y los titulares.'
            : 'Supervises internal technical compliance independently and links between the controller, subjects, and APDP.'}
        </p>
      </div>

      <!-- Node: APDP -->
      <div class="relative rounded-2xl bg-slate-900/50 border border-cl-red/30 p-6 flex flex-col items-center text-center group hover:border-cl-red/60 transition-all">
        <div class="h-12 w-12 rounded-xl bg-cl-red/20 text-cl-red-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <h4 class="font-display font-bold text-white text-base">
          {currentLanguage === 'es' ? 'Agencia de Datos (APDP)' : 'Data Protection Agency'}
        </h4>
        <span class="text-[10px] font-semibold text-cl-red-light uppercase tracking-wider mb-2">
          {currentLanguage === 'es' ? 'Autoridad de Control' : 'Control Authority'}
        </span>
        <p class="text-xs text-slate-400">
          {currentLanguage === 'es'
            ? 'Organismo público fiscalizador. Dicta directrices, resuelve denuncias y tiene facultad para sancionar y multar.'
            : 'Public enforcing body. Formulates directives, resolves complaints, and has the authority to sanction and fine.'}
        </p>
      </div>

    </div>
  </section>

  <!-- Key Principles (7) -->
  <section class="space-y-6">
    <div class="space-y-2">
      <h3 class="font-display text-2xl md:text-3xl font-extrabold text-white">
        {currentLanguage === 'es' ? 'Los 7 Principios Fundamentales' : 'The 7 Core Principles'}
      </h3>
      <p class="text-sm text-slate-400">
        {currentLanguage === 'es'
          ? 'Toda organización debe ajustar sus sistemas de software para cumplir estrictamente estos pilares (Artículo 3°).'
          : 'Every organization must align their software systems to strictly comply with these pillars (Article 3).'}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each principles as p}
        <div class="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-display text-sm font-extrabold text-rose-500/70">PRINCIPIO 0{p.num}</span>
              <div class="h-6 w-6 rounded-full bg-slate-800/80 flex items-center justify-center text-xs text-slate-400 font-bold border border-slate-700">{p.num}</div>
            </div>
            <h4 class="font-display text-lg font-bold text-white leading-tight">
              {currentLanguage === 'es' ? p.titleEs : p.titleEn}
            </h4>
            <p class="text-xs md:text-sm text-slate-400 leading-relaxed">
              {currentLanguage === 'es' ? p.descEs : p.descEn}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Interactive ARCO-P Section -->
  <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-3xl bg-slate-900 border border-slate-800/80 p-6 md:p-8">
    
    <div class="lg:col-span-1 space-y-4">
      <h3 class="font-display text-2xl md:text-3xl font-extrabold text-white">
        {currentLanguage === 'es' ? 'Derechos ARCO-P' : 'ARCO-P Rights'}
      </h3>
      <p class="text-xs md:text-sm text-slate-400 leading-relaxed">
        {currentLanguage === 'es'
          ? 'La ley empodera a los ciudadanos otorgándoles el control de su información personal. Haz clic en las iniciales para explorar cada derecho que tu software debe soportar de forma nativa.'
          : 'The law empowers citizens by giving them control over their personal information. Click the letters to explore each right your software must support natively.'}
      </p>

      <!-- Letter Selector Grid -->
      <div class="grid grid-cols-5 gap-2 pt-2">
        {#each arcoRights as right, index}
          <button
            onclick={() => activeArco = index}
            class="h-10 md:h-12 w-full rounded-xl font-display font-black text-lg flex items-center justify-center transition-all focus:outline-none border {activeArco === index ? 'bg-cl-red border-rose-500 text-white shadow-lg shadow-rose-900/20 scale-105' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}"
          >
            {right.letter}
          </button>
        {/each}
      </div>
    </div>

    <!-- Active Right Details Card -->
    <div class="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-display font-black text-xl">
            {arcoRights[activeArco].letter}
          </div>
          <div>
            <h4 class="font-display text-lg font-bold text-white">
              {currentLanguage === 'es' ? arcoRights[activeArco].nameEs : arcoRights[activeArco].nameEn}
            </h4>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {currentLanguage === 'es' ? 'Derecho del Titular' : 'Subject Right'}
            </span>
          </div>
        </div>
        <p class="text-sm md:text-base text-slate-300 leading-relaxed pt-2">
          {currentLanguage === 'es' ? arcoRights[activeArco].descEs : arcoRights[activeArco].descEn}
        </p>
      </div>

      <div class="pt-4 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500">
        <span>{currentLanguage === 'es' ? 'Implementación obligatoria en backend' : 'Mandatory backend implementation'}</span>
        <span class="font-semibold text-rose-400">ARCO-P</span>
      </div>
    </div>

  </section>

  <!-- Sanctions & Infractions Table -->
  <section class="space-y-6">
    <div class="space-y-2">
      <h3 class="font-display text-2xl md:text-3xl font-extrabold text-white">
        {currentLanguage === 'es' ? 'Régimen de Infracciones y Multas' : 'Régimen of Infractions & Fines'}
      </h3>
      <p class="text-sm text-slate-400">
        {currentLanguage === 'es'
          ? 'Las sanciones se calculan en Unidades Tributarias Mensuales (UTM) y son severas en caso de reincidencia o si afectan a grandes empresas.'
          : 'Sanctions are calculated in Monthly Tax Units (UTM) and are severe in case of repeat offenses or for large companies.'}
      </p>
    </div>

    <!-- Custom styled responsive table -->
    <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <table class="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr class="bg-slate-950 border-b border-slate-800">
            <th class="p-4 font-bold text-white font-display">
              {currentLanguage === 'es' ? 'Gravedad de Infracción' : 'Infraction Gravity'}
            </th>
            <th class="p-4 font-bold text-white font-display">
              {currentLanguage === 'es' ? 'Sanción / Multa Máxima' : 'Sancion / Max Fine'}
            </th>
            <th class="p-4 font-bold text-white font-display">
              {currentLanguage === 'es' ? 'Cálculo Alternativo (Grandes Empresas)' : 'Alternative Calculation (Large Enterprise)'}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr class="hover:bg-slate-800/40">
            <td class="p-4 flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              <div>
                <div class="font-bold text-slate-200">{currentLanguage === 'es' ? 'Leve' : 'Minor'}</div>
                <div class="text-[10px] text-slate-500">{currentLanguage === 'es' ? 'Retrasos formales, información mínima' : 'Formal delays, minimum info'}</div>
              </div>
            </td>
            <td class="p-4 text-slate-300">
              {currentLanguage === 'es' ? 'Amonestación escrita o hasta 5.000 UTM' : 'Written warning or up to 5,000 UTM'}
            </td>
            <td class="p-4 text-slate-500 italic">
              {currentLanguage === 'es' ? 'No aplica alternativo' : 'Alternative not applicable'}
            </td>
          </tr>
          <tr class="hover:bg-slate-800/40">
            <td class="p-4 flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-500"></span>
              <div>
                <div class="font-bold text-slate-200">{currentLanguage === 'es' ? 'Grave' : 'Serious'}</div>
                <div class="text-[10px] text-slate-500">{currentLanguage === 'es' ? 'Tratamiento sin base legal, no notificar brechas' : 'Processing without legal basis, failure to report breach'}</div>
              </div>
            </td>
            <td class="p-4 text-slate-300">
              {currentLanguage === 'es' ? 'Multa de hasta 10.000 UTM' : 'Fine of up to 10,000 UTM'}
            </td>
            <td class="p-4 text-amber-400 font-medium">
              {currentLanguage === 'es' ? 'Hasta el 2% de los ingresos anuales' : 'Up to 2% of annual revenue'}
            </td>
          </tr>
          <tr class="hover:bg-slate-800/40">
            <td class="p-4 flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-rose-500"></span>
              <div>
                <div class="font-bold text-slate-200">{currentLanguage === 'es' ? 'Gravísima' : 'Critical'}</div>
                <div class="text-[10px] text-slate-500">{currentLanguage === 'es' ? 'Obstrucción a la APDP, tratar sensibles sin consentimiento' : 'APDP obstruction, processing sensitive data without consent'}</div>
              </div>
            </td>
            <td class="p-4 text-slate-300">
              {currentLanguage === 'es' ? 'Multa de hasta 20.000 UTM' : 'Fine of up to 20,000 UTM'}
            </td>
            <td class="p-4 text-rose-400 font-medium">
              {currentLanguage === 'es' ? 'Hasta el 4% de los ingresos anuales' : 'Up to 4% of annual revenue'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Alert note about reincidence -->
    <div class="alert-box alert-warning">
      <div class="alert-title">{currentLanguage === 'es' ? 'ADVERTENCIA POR REINCIDENCIA' : 'REINCIDENCE WARNING'}</div>
      <p>
        {currentLanguage === 'es'
          ? 'En caso de reincidencia en infracciones gravísimas, la multa máxima puede incrementarse hasta tres veces (60.000 UTM) o suspenderse temporalmente las actividades de tratamiento de datos de la organización.'
          : 'In case of repeat critical infractions, the maximum fine may increase up to three times (60,000 UTM) or lead to a temporary suspension of data processing activities.'}
      </p>
    </div>
  </section>

  <!-- Interactive Timeline Roadmap -->
  <section class="space-y-6">
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <h3 class="font-display text-2xl md:text-3xl font-extrabold text-white">
        {currentLanguage === 'es' ? 'Plan Estratégico de Adecuación' : 'Strategic Adaptation Roadmap'}
      </h3>
      <p class="text-sm text-slate-400">
        {currentLanguage === 'es'
          ? 'Línea de tiempo clave recomendada para adaptar los sistemas de información de tu organización.'
          : 'Key timeline recommended to adapt your organization\'s information systems.'}
      </p>
    </div>

    <!-- Timeline Layout -->
    <div class="relative border-l border-slate-800 md:border-l-0 md:flex md:justify-between md:gap-4 md:before:absolute md:before:top-1/2 md:before:inset-x-0 md:before:h-0.5 md:before:bg-slate-800 pt-6">
      {#each timelineSteps as step, i}
        <div class="relative pl-6 pb-8 md:pl-0 md:pb-0 md:w-1/5 md:text-center md:flex md:flex-col md:items-center space-y-3 group">
          
          <!-- Marker dot -->
          <div class="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-slate-700 border border-slate-900 md:relative md:left-0 md:top-0 md:h-4 md:w-4 md:bg-slate-800 md:border-2 md:border-slate-700 group-hover:bg-rose-500 group-hover:border-rose-400 transition-colors z-10"></div>
          
          <div class="space-y-1">
            <span class="block font-display font-black text-rose-500 text-xs tracking-wider md:text-sm">
              {step.date}
            </span>
            <h4 class="font-display font-bold text-white text-sm md:text-base leading-snug">
              {currentLanguage === 'es' ? step.titleEs : step.titleEn}
            </h4>
            <p class="text-xs text-slate-400 max-w-xs leading-relaxed md:mx-auto">
              {currentLanguage === 'es' ? step.descEs : step.descEn}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

</div>
