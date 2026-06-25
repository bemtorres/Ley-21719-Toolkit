<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let { currentLanguage = 'es' } = $props();

  let containerEl = $state(null);
  let svgEl = $state(null);
  let hovered = $state(null);

  const data = {
    es: [
      { level: 'Leve',      utm: 5000,  pct: 0,   color: '#22c55e', bg: '#052e16', stroke: '#16a34a', descUtm: 'Amonestación o hasta 5.000 UTM',  descPct: 'Sin alternativa porcentual',   icon: '⚠️' },
      { level: 'Grave',     utm: 10000, pct: 2,   color: '#f59e0b', bg: '#1c1108', stroke: '#d97706', descUtm: 'Multa de hasta 10.000 UTM',       descPct: 'Hasta el 2% ingresos anuales', icon: '🔥' },
      { level: 'Gravísima', utm: 20000, pct: 4,   color: '#f43f5e', bg: '#1f0a0a', stroke: '#dc2626', descUtm: 'Multa de hasta 20.000 UTM',       descPct: 'Hasta el 4% ingresos anuales', icon: '🚨' },
      { level: 'Reincidencia', utm: 60000, pct: 12, color: '#a855f7', bg: '#1a0a2e', stroke: '#7c3aed', descUtm: 'Hasta 3x = 60.000 UTM',         descPct: 'Hasta el 12% ingresos', icon: '☠️' },
    ],
    en: [
      { level: 'Minor',    utm: 5000,  pct: 0,   color: '#22c55e', bg: '#052e16', stroke: '#16a34a', descUtm: 'Warning or up to 5,000 UTM',     descPct: 'No percentage alternative',    icon: '⚠️' },
      { level: 'Serious',  utm: 10000, pct: 2,   color: '#f59e0b', bg: '#1c1108', stroke: '#d97706', descUtm: 'Fine up to 10,000 UTM',          descPct: 'Up to 2% of annual revenue',   icon: '🔥' },
      { level: 'Critical', utm: 20000, pct: 4,   color: '#f43f5e', bg: '#1f0a0a', stroke: '#dc2626', descUtm: 'Fine up to 20,000 UTM',          descPct: 'Up to 4% of annual revenue',   icon: '🚨' },
      { level: 'Repeat',   utm: 60000, pct: 12,  color: '#a855f7', bg: '#1a0a2e', stroke: '#7c3aed', descUtm: 'Up to 3x = 60,000 UTM',         descPct: 'Up to 12% of revenue',         icon: '☠️' },
    ]
  };

  function buildChart() {
    if (!svgEl || !containerEl) return;

    const rows = currentLanguage === 'es' ? data.es : data.en;
    const W = containerEl.getBoundingClientRect().width || 600;
    const H = 320;
    const margin = { top: 24, right: 28, bottom: 52, left: 64 };
    const iW = W - margin.left - margin.right;
    const iH = H - margin.top - margin.bottom;

    const svg = d3.select(svgEl)
      .attr('width', '100%')
      .attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    // Defs
    const defs = svg.append('defs');

    // Gradient per bar
    rows.forEach((d, i) => {
      const grad = defs.append('linearGradient')
        .attr('id', `bar-grad-${i}`)
        .attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1');
      grad.append('stop').attr('offset', '0%').attr('stop-color', d.color).attr('stop-opacity', 0.9);
      grad.append('stop').attr('offset', '100%').attr('stop-color', d.color).attr('stop-opacity', 0.4);
    });

    // Glow
    const filt = defs.append('filter').attr('id', 'bar-glow');
    filt.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const fm = filt.append('feMerge');
    fm.append('feMergeNode').attr('in', 'blur');
    fm.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(rows.map(d => d.level))
      .range([0, iW])
      .padding(0.35);

    const y = d3.scaleLinear()
      .domain([0, 65000])
      .range([iH, 0]);

    // Grid lines
    const gridLines = [0, 10000, 20000, 40000, 60000];
    gridLines.forEach(val => {
      g.append('line')
        .attr('x1', 0).attr('x2', iW)
        .attr('y1', y(val)).attr('y2', y(val))
        .attr('stroke', '#1e293b').attr('stroke-width', 1)
        .attr('stroke-dasharray', val === 0 ? 'none' : '4,4');
    });

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y)
        .tickValues(gridLines)
        .tickFormat(d => d === 0 ? '0' : `${(d/1000).toFixed(0)}K UTM`)
      )
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#334155'))
      .call(ax => ax.selectAll('.tick text')
        .attr('fill', '#64748b')
        .attr('font-size', 11)
        .attr('font-family', 'Inter, sans-serif')
      );

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(x))
      .call(ax => ax.select('.domain').attr('stroke', '#334155'))
      .call(ax => ax.selectAll('.tick line').remove())
      .call(ax => ax.selectAll('.tick text')
        .attr('fill', '#94a3b8')
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('font-family', 'Outfit, Inter, sans-serif')
      );

    // Bars
    const barGroups = g.selectAll('.bar-group')
      .data(rows)
      .join('g')
      .attr('class', 'bar-group')
      .style('cursor', 'pointer');

    // Shadow bars
    barGroups.append('rect')
      .attr('x', d => x(d.level) + x.bandwidth() * 0.05)
      .attr('y', d => y(d.utm))
      .attr('width', x.bandwidth() * 0.9)
      .attr('height', d => iH - y(d.utm))
      .attr('rx', 6)
      .attr('fill', d => d.color)
      .attr('opacity', 0.08)
      .attr('filter', 'url(#bar-glow)');

    // Main bars (animated)
    barGroups.append('rect')
      .attr('x', d => x(d.level))
      .attr('y', iH)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 8)
      .attr('fill', (d, i) => `url(#bar-grad-${i})`)
      .attr('stroke', d => d.stroke)
      .attr('stroke-width', 1.5)
      .transition().delay((d, i) => i * 120).duration(700)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.utm))
      .attr('height', d => iH - y(d.utm));

    // Value labels on top
    barGroups.append('text')
      .attr('x', d => x(d.level) + x.bandwidth() / 2)
      .attr('y', d => y(d.utm) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.color)
      .attr('font-size', 11)
      .attr('font-weight', 700)
      .attr('font-family', 'Inter, sans-serif')
      .attr('opacity', 0)
      .text(d => `${(d.utm/1000).toFixed(0)}K`)
      .transition().delay((d, i) => i * 120 + 500).duration(300)
      .attr('opacity', 1);

    // % badge inside bar (if applicable)
    barGroups.filter(d => d.pct > 0)
      .append('text')
      .attr('x', d => x(d.level) + x.bandwidth() / 2)
      .attr('y', d => y(d.utm / 2) + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', 13)
      .attr('font-weight', 800)
      .attr('font-family', 'Outfit, sans-serif')
      .attr('opacity', 0)
      .text(d => `${d.pct}%`)
      .transition().delay((d, i) => i * 120 + 700).duration(300)
      .attr('opacity', 0.7);

    // Hover interactions
    barGroups
      .on('mouseenter', function(event, d) {
        d3.select(this).select('rect:nth-child(2)')
          .transition().duration(150).attr('opacity', 0.85);
        hovered = d;
      })
      .on('mouseleave', function() {
        d3.select(this).select('rect:nth-child(2)')
          .transition().duration(150).attr('opacity', 1);
        hovered = null;
      });
  }

  onMount(() => {
    const ro = new ResizeObserver(() => buildChart());
    if (containerEl) {
      ro.observe(containerEl);
      buildChart();
    }
    return () => ro.disconnect();
  });

  $effect(() => {
    currentLanguage;
    buildChart();
  });
</script>

<div class="space-y-5">
  <!-- Header -->
  <div class="flex items-center justify-between gap-4 flex-wrap">
    <div>
      <h4 class="font-display font-extrabold text-lg text-white">
        {currentLanguage === 'es' ? 'Escala de Multas — Ley 21.719' : 'Fines Scale — Law 21.719'}
      </h4>
      <p class="text-xs text-slate-400 mt-0.5">
        {currentLanguage === 'es'
          ? 'Máximos en UTM por nivel de infracción (1 UTM ≈ $65.000 CLP)'
          : 'Maximums in UTM per infraction level (1 UTM ≈ $65,000 CLP)'}
      </p>
    </div>
    <div class="text-xs text-slate-500 flex items-center gap-1">
      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      {currentLanguage === 'es' ? 'Pasa el cursor para detalles' : 'Hover for details'}
    </div>
  </div>

  <!-- Chart -->
  <div bind:this={containerEl} class="relative">
    <svg bind:this={svgEl} class="w-full block"></svg>
  </div>

  <!-- Hover Detail Card -->
  <div class="min-h-[64px]">
    {#if hovered}
      <div class="rounded-xl border p-4 flex items-start gap-4 transition-all"
        style="background:{hovered.bg}; border-color:{hovered.stroke}40;"
      >
        <span class="text-2xl">{hovered.icon}</span>
        <div>
          <div class="font-display font-black text-base" style="color:{hovered.color}">{hovered.level}</div>
          <div class="text-sm text-slate-300 mt-0.5">{hovered.descUtm}</div>
          {#if hovered.pct > 0}
            <div class="text-xs mt-1" style="color:{hovered.color}">
              {currentLanguage === 'es' ? 'Alternativa:' : 'Alternative:'} {hovered.descPct}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center text-xs text-slate-600">
        {currentLanguage === 'es' ? 'Selecciona una barra para ver los detalles de la infracción' : 'Select a bar to see infraction details'}
      </div>
    {/if}
  </div>
</div>
