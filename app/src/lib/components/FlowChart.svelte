<script>
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  let { currentLanguage = 'es' } = $props();

  let containerEl = $state(null);
  let svgEl = $state(null);
  let tooltip = $state({ visible: false, x: 0, y: 0, title: '', desc: '' });
  let activeStep = $state(null);
  let animating = $state(false);
  let width = $state(800);
  let height = $state(480);

  // ─── DATA ───────────────────────────────────────────────────────────────────
  const labels = {
    es: {
      title: 'Flujo de Decisión Algorítmica',
      subtitle: 'Art. 8 bis — Derecho a no ser objeto de decisiones automatizadas que produzcan efectos jurídicos',
      nodes: {
        solicitud:  { title: 'Solicitud de Crédito', desc: 'El usuario envía su solicitud de crédito con sus datos personales.' },
        scoring:    { title: 'Algoritmo de Scoring', desc: 'Un modelo de ML evalúa automáticamente el riesgo crediticio usando historial, ingresos y patrones de comportamiento.' },
        aprobado:   { title: '✅ Aprobado', desc: 'El algoritmo evalúa positivo: el crédito se concede automáticamente.' },
        denegado:   { title: '❌ Denegado (Automático)', desc: 'El algoritmo emite un rechazo automatizado sin intervención humana. La Ley 21.719 otorga derechos especiales al titular.' },
        impugnacion:{ title: 'Impugnación', desc: 'Derecho a solicitar revisión humana de la decisión automatizada. El responsable debe garantizar esta vía (Art. 8 bis Ley 21.719).' },
        explicacion:{ title: 'Explicabilidad', desc: 'Derecho a recibir información sobre las variables que afectaron la decisión y su peso relativo. Principio de transparencia algorítmica.' },
        humano:     { title: 'Revisión Humana', desc: 'Un agente humano revisa el caso con contexto completo. La resolución es vinculante para la empresa.' },
        resolucion: { title: 'Resolución Final', desc: 'La empresa comunica la resolución al titular en un plazo máximo definido. Multa de hasta 5.000 UTM si no se garantiza el proceso.' },
      },
      edges: {
        approved: 'Aprobado',
        denied: 'Denegado',
        right: 'Derecho',
        transparency: 'Transparencia',
        review: 'Revisión',
        result: 'Resultado'
      }
    },
    en: {
      title: 'Algorithmic Decision Flow',
      subtitle: 'Art. 8 bis — Right not to be subject to automated decisions producing legal effects',
      nodes: {
        solicitud:  { title: 'Credit Request', desc: 'The user submits a credit application with their personal data.' },
        scoring:    { title: 'Scoring Algorithm', desc: 'An ML model automatically evaluates credit risk using history, income, and behavioral patterns.' },
        aprobado:   { title: '✅ Approved', desc: 'The algorithm evaluates positive: credit is granted automatically.' },
        denegado:   { title: '❌ Denied (Automatic)', desc: 'The algorithm issues an automated rejection without human intervention. Law 21.719 grants special rights to the data subject.' },
        impugnacion:{ title: 'Challenge', desc: 'Right to request human review of the automated decision. The controller must guarantee this path (Art. 8 bis Law 21.719).' },
        explicacion:{ title: 'Explainability', desc: 'Right to receive information about the variables that affected the decision and their relative weight. Algorithmic transparency principle.' },
        humano:     { title: 'Human Review', desc: 'A human agent reviews the case with full context. The resolution is binding for the company.' },
        resolucion: { title: 'Final Resolution', desc: 'The company communicates the resolution to the data subject within a defined maximum period. Fine up to 5,000 UTM if the process is not guaranteed.' },
      },
      edges: {
        approved: 'Approved',
        denied: 'Denied',
        right: 'Right',
        transparency: 'Transparency',
        review: 'Review',
        result: 'Result'
      }
    }
  };

  // Nodes definition (id, type, color group)
  const nodes = [
    { id: 'solicitud',   group: 'neutral' },
    { id: 'scoring',     group: 'algo'    },
    { id: 'aprobado',    group: 'success' },
    { id: 'denegado',    group: 'danger'  },
    { id: 'impugnacion', group: 'right'   },
    { id: 'explicacion', group: 'right'   },
    { id: 'humano',      group: 'human'   },
    { id: 'resolucion',  group: 'neutral' },
  ];

  // Edges definition
  const edges = [
    { source: 'solicitud',   target: 'scoring',     label: 'edges.approved',    color: '#64748b' },
    { source: 'scoring',     target: 'aprobado',    label: 'edges.approved',    color: '#22c55e' },
    { source: 'scoring',     target: 'denegado',    label: 'edges.denied',      color: '#f43f5e' },
    { source: 'denegado',    target: 'impugnacion', label: 'edges.right',       color: '#818cf8' },
    { source: 'denegado',    target: 'explicacion', label: 'edges.transparency',color: '#818cf8' },
    { source: 'impugnacion', target: 'humano',      label: 'edges.review',      color: '#a78bfa' },
    { source: 'humano',      target: 'resolucion',  label: 'edges.result',      color: '#64748b' },
  ];

  // Color map per group
  const groupColors = {
    neutral: { fill: '#1e293b', stroke: '#334155', text: '#94a3b8', icon: '#64748b' },
    algo:    { fill: '#1e1b4b', stroke: '#4338ca', text: '#a5b4fc', icon: '#6366f1' },
    success: { fill: '#052e16', stroke: '#16a34a', text: '#86efac', icon: '#22c55e' },
    danger:  { fill: '#1f0a0a', stroke: '#dc2626', text: '#fca5a5', icon: '#f43f5e' },
    right:   { fill: '#1e1a3e', stroke: '#7c3aed', text: '#c4b5fd', icon: '#8b5cf6' },
    human:   { fill: '#0f172a', stroke: '#0ea5e9', text: '#7dd3fc', icon: '#38bdf8' },
  };

  // ─── LAYOUT (fixed positions) ─────────────────────────────────────────────
  function getNodePositions(w, h) {
    const cx = w / 2;
    const pad = 80;
    return {
      solicitud:   { x: cx,           y: pad          },
      scoring:     { x: cx,           y: pad + 110     },
      aprobado:    { x: cx - 240,     y: pad + 230     },
      denegado:    { x: cx + 210,     y: pad + 230     },
      impugnacion: { x: cx + 60,      y: pad + 350     },
      explicacion: { x: cx + 340,     y: pad + 350     },
      humano:      { x: cx + 60,      y: pad + 460     },
      resolucion:  { x: cx + 60,      y: pad + 570     },
    };
  }

  const NODE_W = 180;
  const NODE_H = 56;

  // ─── D3 RENDERING ────────────────────────────────────────────────────────
  function buildChart() {
    if (!svgEl) return;
    const lang = currentLanguage === 'es' ? labels.es : labels.en;
    const positions = getNodePositions(width, height);
    const totalH = 720;

    const svg = d3.select(svgEl)
      .attr('width', '100%')
      .attr('height', totalH)
      .attr('viewBox', `0 0 ${width} ${totalH}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    // ── Defs: arrowheads + gradients ──
    const defs = svg.append('defs');

    // Arrowhead per edge color
    const arrowColors = ['#64748b', '#22c55e', '#f43f5e', '#818cf8', '#a78bfa'];
    arrowColors.forEach((color, i) => {
      defs.append('marker')
        .attr('id', `arrow-${i}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10).attr('refY', 0)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color);
    });

    const arrowMap = { '#64748b': 0, '#22c55e': 1, '#f43f5e': 2, '#818cf8': 3, '#a78bfa': 4 };

    // Glow filter
    const filt = defs.append('filter').attr('id', 'glow');
    filt.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const merge = filt.append('feMerge');
    merge.append('feMergeNode').attr('in', 'coloredBlur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Background subtle grid
    const bgGroup = svg.append('g').attr('class', 'bg');
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      bgGroup.append('line')
        .attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', totalH)
        .attr('stroke', '#1e293b').attr('stroke-width', 0.5);
    }
    for (let y = 0; y < totalH; y += gridSize) {
      bgGroup.append('line')
        .attr('x1', 0).attr('y1', y).attr('x2', width).attr('y2', y)
        .attr('stroke', '#1e293b').attr('stroke-width', 0.5);
    }

    // ── Edges ──
    const edgeGroup = svg.append('g').attr('class', 'edges');

    edges.forEach((edge, idx) => {
      const sp = positions[edge.source];
      const tp = positions[edge.target];

      // Calculate connection points (center-bottom to center-top of nodes)
      let x1 = sp.x, y1 = sp.y + NODE_H / 2;
      let x2 = tp.x, y2 = tp.y - NODE_H / 2;

      // Curved paths for branches
      let pathD;
      if (edge.source === 'scoring' && edge.target === 'aprobado') {
        pathD = `M ${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`;
      } else if (edge.source === 'scoring' && edge.target === 'denegado') {
        pathD = `M ${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`;
      } else if (edge.source === 'denegado' && edge.target === 'impugnacion') {
        pathD = `M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`;
      } else if (edge.source === 'denegado' && edge.target === 'explicacion') {
        pathD = `M ${x1 + NODE_W/2 - 10} ${y1} C ${x1 + NODE_W/2 + 20} ${y1 + 60}, ${x2} ${y2 - 40}, ${x2} ${y2}`;
      } else {
        pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
      }

      const arrowIdx = arrowMap[edge.color] ?? 0;

      // Shadow path
      edgeGroup.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', edge.color)
        .attr('stroke-width', 4)
        .attr('stroke-opacity', 0.12)
        .attr('stroke-linecap', 'round');

      // Main path with animation
      const path = edgeGroup.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', edge.color)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round')
        .attr('marker-end', `url(#arrow-${arrowIdx})`)
        .attr('opacity', 0);

      const totalLen = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLen)
        .attr('stroke-dashoffset', totalLen)
        .transition().delay(300 + idx * 150).duration(500)
        .attr('stroke-dashoffset', 0)
        .attr('opacity', 1);

      // Edge label
      const midT = 0.5;
      const midPt = path.node().getPointAtLength(totalLen * midT);
      edgeGroup.append('text')
        .attr('x', midPt.x + 4)
        .attr('y', midPt.y - 6)
        .attr('fill', edge.color)
        .attr('font-size', 10)
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-weight', 600)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .text(lang[edge.label] || '')
        .transition().delay(800 + idx * 150).duration(300)
        .attr('opacity', 0.85);
    });

    // ── Nodes ──
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    nodes.forEach((node, idx) => {
      const pos = positions[node.id];
      const colors = groupColors[node.group];
      const nodeData = lang.nodes[node.id];

      const g = nodeGroup.append('g')
        .attr('class', `node node-${node.id}`)
        .attr('transform', `translate(${pos.x}, ${pos.y})`)
        .attr('opacity', 0)
        .style('cursor', 'pointer');

      // Animate in
      g.transition().delay(idx * 100).duration(400)
        .attr('opacity', 1);

      // Glow background
      g.append('rect')
        .attr('x', -NODE_W / 2 - 4).attr('y', -NODE_H / 2 - 4)
        .attr('width', NODE_W + 8).attr('height', NODE_H + 8)
        .attr('rx', 14)
        .attr('fill', colors.stroke)
        .attr('opacity', 0.08)
        .attr('filter', 'url(#glow)');

      // Main rect
      const rect = g.append('rect')
        .attr('x', -NODE_W / 2).attr('y', -NODE_H / 2)
        .attr('width', NODE_W).attr('height', NODE_H)
        .attr('rx', 10)
        .attr('fill', colors.fill)
        .attr('stroke', colors.stroke)
        .attr('stroke-width', 1.5);

      // Left accent bar
      g.append('rect')
        .attr('x', -NODE_W / 2).attr('y', -NODE_H / 2 + 8)
        .attr('width', 3).attr('height', NODE_H - 16)
        .attr('rx', 2)
        .attr('fill', colors.stroke);

      // Label
      g.append('text')
        .attr('x', 0).attr('y', 5)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors.text)
        .attr('font-size', 12.5)
        .attr('font-family', 'Outfit, Inter, sans-serif')
        .attr('font-weight', 700)
        .text(nodeData.title);

      // Hover interactions
      g.on('mouseenter', function(event) {
        d3.select(this).select('rect:nth-child(2)')
          .transition().duration(150)
          .attr('stroke-width', 2.5)
          .attr('stroke', colors.icon);

        d3.select(this).transition().duration(150)
          .attr('transform', `translate(${pos.x}, ${pos.y}) scale(1.04)`);

        const [mx, my] = d3.pointer(event, containerEl);
        tooltip = { visible: true, x: mx, y: my, title: nodeData.title, desc: nodeData.desc, color: colors.stroke };
        activeStep = node.id;
      });

      g.on('mousemove', function(event) {
        const [mx, my] = d3.pointer(event, containerEl);
        tooltip = { ...tooltip, x: mx, y: my };
      });

      g.on('mouseleave', function() {
        d3.select(this).select('rect:nth-child(2)')
          .transition().duration(150)
          .attr('stroke-width', 1.5)
          .attr('stroke', colors.stroke);

        d3.select(this).transition().duration(150)
          .attr('transform', `translate(${pos.x}, ${pos.y}) scale(1)`);

        tooltip = { ...tooltip, visible: false };
        activeStep = null;
      });
    });

    // ── Animated flow dots on edges ──
    function animateDot(pathEl, color) {
      const len = pathEl.getTotalLength();
      const dot = svg.append('circle')
        .attr('r', 4)
        .attr('fill', color)
        .attr('opacity', 0.9)
        .attr('filter', 'url(#glow)');

      function run() {
        dot
          .attr('transform', `translate(${pathEl.getPointAtLength(0).x},${pathEl.getPointAtLength(0).y})`)
          .transition()
          .duration(2000 + Math.random() * 1000)
          .ease(d3.easeLinear)
          .attrTween('transform', () => t => {
            const p = pathEl.getPointAtLength(t * len);
            return `translate(${p.x},${p.y})`;
          })
          .on('end', () => {
            setTimeout(run, Math.random() * 2000 + 500);
          });
      }

      setTimeout(run, Math.random() * 3000 + 800);
    }

    // Start flow dots after a delay
    setTimeout(() => {
      svg.selectAll('.edges path').each(function() {
        const edge = edges[Array.from(svg.selectAll('.edges path').nodes()).indexOf(this) % edges.length];
        if (edge) animateDot(this, edge.color);
      });
    }, 1500);
  }

  onMount(() => {
    if (containerEl) {
      const ro = new ResizeObserver(entries => {
        const w = entries[0].contentRect.width;
        if (w > 0) {
          width = Math.min(w, 900);
          buildChart();
        }
      });
      ro.observe(containerEl);
      return () => ro.disconnect();
    }
  });

  $effect(() => {
    currentLanguage; // track
    buildChart();
  });
</script>

<!-- ═══════════════════════════════════════════════════════ TEMPLATE ═══════ -->
<div class="space-y-6 animate-slide-up">

  <!-- Header -->
  <div class="hidden flex flex-col md:flex-row md:items-start gap-4 justify-between">
    <div class="space-y-1">
      <div class="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-bold text-violet-400 uppercase tracking-wide">
        <span class="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"></span>
        {currentLanguage === 'es' ? 'Decisión Automatizada · Art. 8 bis' : 'Automated Decision · Art. 8 bis'}
      </div>
      <h3 class="font-display text-xl md:text-2xl font-extrabold text-white">
        {currentLanguage === 'es' ? 'Flujo de Scoring Crediticio Algorítmico' : 'Algorithmic Credit Scoring Flow'}
      </h3>
      <p class="text-sm text-slate-400 max-w-2xl">
        {currentLanguage === 'es'
          ? 'Visualización interactiva del proceso de toma de decisiones automatizadas en sistemas de crédito. Pasa el mouse sobre cada nodo para ver detalles y los derechos del titular que se activan.'
          : 'Interactive visualization of automated decision-making in credit systems. Hover over each node to see details and the data subject rights that are activated.'}
      </p>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-2 shrink-0">
      {#each [
        { color: '#6366f1', label: currentLanguage === 'es' ? 'Algoritmo' : 'Algorithm' },
        { color: '#22c55e', label: currentLanguage === 'es' ? 'Aprobado' : 'Approved' },
        { color: '#f43f5e', label: currentLanguage === 'es' ? 'Denegado' : 'Denied' },
        { color: '#8b5cf6', label: currentLanguage === 'es' ? 'Derechos ARCO-P' : 'Rights' },
        { color: '#38bdf8', label: currentLanguage === 'es' ? 'Revisión Humana' : 'Human Review' },
      ] as item}
        <div class="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-400">
          <span class="h-2 w-2 rounded-full" style="background:{item.color}"></span>
          {item.label}
        </div>
      {/each}
    </div>
  </div>

  <!-- Chart Container -->
  <div
    bind:this={containerEl}
    class="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden"
    style="min-height: 720px;"
  >
    <!-- Tooltip -->
    {#if tooltip.visible}
      <div
        class="pointer-events-none absolute z-20 max-w-xs rounded-xl border bg-slate-900 p-3 shadow-2xl text-sm transition-all"
        style="left:{tooltip.x + 16}px; top:{tooltip.y - 10}px; border-color:{tooltip.color ?? '#334155'}40;"
      >
        <div class="font-bold text-white mb-1" style="color:{tooltip.color ?? '#94a3b8'}">{tooltip.title}</div>
        <p class="text-slate-400 text-xs leading-relaxed">{tooltip.desc}</p>
      </div>
    {/if}

    <!-- D3 SVG -->
    <svg bind:this={svgEl} class="w-full block"></svg>

    <!-- Bottom hint -->
    <div class="absolute bottom-4 right-4 text-[11px] text-slate-600 flex items-center gap-1.5">
      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      {currentLanguage === 'es' ? 'Interactivo — pasa el cursor sobre los nodos' : 'Interactive — hover over the nodes'}
    </div>
  </div>

  <!-- Rights Callout Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="rounded-xl bg-violet-950/40 border border-violet-800/40 p-4 space-y-2">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
        </div>
        <h4 class="font-bold text-violet-300 text-sm">
          {currentLanguage === 'es' ? 'Derecho a Impugnar' : 'Right to Challenge'}
        </h4>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        {currentLanguage === 'es'
          ? 'El titular puede solicitar que una persona humana revise cualquier decisión automatizada que le afecte jurídicamente. La empresa no puede negar esta revisión.'
          : 'The data subject may request that a human reviews any automated decision that legally affects them. The company cannot deny this review.'}
      </p>
      <div class="text-[11px] text-violet-400 font-mono bg-violet-950/60 rounded-lg px-2 py-1">Art. 8 bis — Ley 21.719</div>
    </div>

    <div class="rounded-xl bg-sky-950/40 border border-sky-800/40 p-4 space-y-2">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h4 class="font-bold text-sky-300 text-sm">
          {currentLanguage === 'es' ? 'Derecho a Explicación' : 'Right to Explanation'}
        </h4>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        {currentLanguage === 'es'
          ? 'El responsable debe explicar qué variables influyeron en la decisión del algoritmo y con qué peso. Esto incluye la lógica del modelo y sus implicancias para el titular.'
          : 'The controller must explain which variables influenced the algorithm\'s decision and with what weight. This includes the model\'s logic and its implications for the data subject.'}
      </p>
      <div class="text-[11px] text-sky-400 font-mono bg-sky-950/60 rounded-lg px-2 py-1">Principio de Transparencia — Art. 3 lit. g</div>
    </div>
  </div>
</div>
