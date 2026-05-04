const initialState = {
  summary: "Durante febrero y marzo de 2026, INFIHUILA consolidó una presencia digital en crecimiento en Facebook e Instagram. Facebook alcanzó 39,9 mil visualizaciones en febrero (+718,8%) e Instagram llegó a 19.924 visualizaciones y 958 interacciones en marzo. El desempeño es 100% orgánico, pero exige intervención en clics, respuesta a mensajes, historias y consistencia editorial.",
  platforms: [
    { platform: "Facebook", period: "Febrero 2026", views: 39900, reach: 14946, interactions: 488, visits: 870, newFollowers: 61, clicks: 5, responseRate: 0, followers: 3613, posts: 16, growthViews: 718.8, growthInteractions: 650.8, organic: 100 },
    { platform: "Instagram", period: "Marzo 2026", views: 19924, reach: 4700, interactions: 958, visits: 375, newFollowers: 49, clicks: 0, responseRate: 0, followers: 726, posts: 16, growthViews: 143.1, growthInteractions: 510.2, organic: 100 }
  ],
  formats: [
    { platform: "Facebook", format: "Carrusel", views: 30711, interactions: 370 },
    { platform: "Facebook", format: "Foto individual", views: 8715, interactions: 100 },
    { platform: "Facebook", format: "Reels", views: 376, interactions: 1 },
    { platform: "Facebook", format: "Historias", views: 0, interactions: 4 },
    { platform: "Instagram", format: "Reels", views: 2500, interactions: 400 },
    { platform: "Instagram", format: "Fotos", views: 2128, interactions: 100 },
    { platform: "Instagram", format: "Historias", views: 38, interactions: 38 }
  ],
  benchmarks: [
    { platform: "Facebook", account: "Gobernación Huila", followers: 97700, posts: 133 },
    { platform: "Facebook", account: "Lotería Huila", followers: 42000, posts: 52 },
    { platform: "Facebook", account: "INDERHUILA", followers: 29900, posts: 31 },
    { platform: "Facebook", account: "Infibagué", followers: 18100, posts: 51 },
    { platform: "Facebook", account: "Aguas del Huila", followers: 6700, posts: 4 },
    { platform: "Facebook", account: "Infihuila", followers: 3613, posts: 16 },
    { platform: "Instagram", account: "IDEA Antioquia", followers: 21900, posts: 71 },
    { platform: "Instagram", account: "Infibagué", followers: 11200, posts: 61 },
    { platform: "Instagram", account: "Lotería Huila", followers: 6800, posts: 76 },
    { platform: "Instagram", account: "Infimanizales", followers: 3300, posts: 17 },
    { platform: "Instagram", account: "Inficaldas", followers: 3000, posts: 24 },
    { platform: "Instagram", account: "Infivalle", followers: 2500, posts: 21 },
    { platform: "Instagram", account: "Infihuila", followers: 726, posts: 16 }
  ],
  recommendations: [
    "Convertir cada publicación de alto alcance en tráfico: enlace en bio, botones de acción y URL corta por campaña.",
    "Adoptar un protocolo de atención digital: responsable, tablero diario y respuesta a mensajes en menos de 24 horas.",
    "Construir calendario editorial mensual con mínimo 3 publicaciones semanales por plataforma y medición por formato.",
    "Usar carruseles en Facebook para contenidos de valor público y Reels en Instagram para alcance orgánico territorial.",
    "Rediseñar Historias con encuestas, preguntas, agenda institucional, llamados a la acción y piezas diarias de bajo costo.",
    "Crear tablero de aprendizaje: pieza ganadora, hipótesis, resultado, réplica y mejora para la siguiente semana.",
    "Activar pauta mínima solo sobre publicaciones orgánicas ganadoras, focalizada en municipios del Huila.",
    "Definir metas trimestrales frente a Infibagué e Inficaldas, separando crecimiento de comunidad, engagement y conversión."
  ]
};

let state = JSON.parse(localStorage.getItem('infihuilaMediaDashboardFinal')) || structuredClone(initialState);
let charts = {};

const css = getComputedStyle(document.documentElement);
const COLORS = {
  blue: css.getPropertyValue('--blue').trim() || '#006C72',
  blueDark: css.getPropertyValue('--blue-dark').trim() || '#004d52',
  green: css.getPropertyValue('--green').trim() || '#CCD400',
  ink: css.getPropertyValue('--ink').trim() || '#1F2937',
  muted: css.getPropertyValue('--muted').trim() || '#64748b'
};

if (window.Chart) {
  Chart.defaults.font.family = 'Tw Cen MT, Trebuchet MS, Segoe UI, Arial, sans-serif';
  Chart.defaults.color = COLORS.ink;
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.resizeDelay = 160;
}

const $ = (id) => document.getElementById(id);
const formatNumber = (n) => Number(n || 0).toLocaleString('es-CO');
const percent = (n) => `${Number(n || 0).toLocaleString('es-CO', { maximumFractionDigits: 2 })}%`;
const sum = (items, key) => items.reduce((a, b) => a + Number(b[key] || 0), 0);
const conversionRate = (item) => item.views ? (item.clicks / item.views) * 100 : 0;
const engagementRate = (item) => item.views ? (item.interactions / item.views) * 100 : 0;
const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

function saveState(){ localStorage.setItem('infihuilaMediaDashboardFinal', JSON.stringify(state)); }

function currentFilters(){
  return {
    platform: $('platformFilter')?.value || 'Todas',
    period: $('periodFilter')?.value || 'Todos'
  };
}
function byFilter(items){
  const f = currentFilters();
  return items.filter(x => (f.platform === 'Todas' || x.platform === f.platform) && (f.period === 'Todos' || x.period === f.period));
}

function calcScore(items){
  if(!items.length) return 0;
  const totalViews = sum(items,'views');
  const clicks = sum(items,'clicks');
  const conv = totalViews ? clicks / totalViews * 100 : 0;
  const engagement = totalViews ? sum(items,'interactions') / totalViews * 100 : 0;
  const response = items.reduce((a,b)=>a+Number(b.responseRate||0),0)/items.length;
  const posts = sum(items,'posts') / items.length;
  const growth = items.reduce((a,b)=>a+Number(b.growthViews||0),0)/items.length;
  const score =
    (clamp(growth,0,300)/300)*22 +
    (clamp(engagement,0,6)/6)*24 +
    (clamp(conv,0,0.8)/0.8)*24 +
    (clamp(response,0,90)/90)*16 +
    (clamp(posts,0,16)/16)*14;
  return Math.round(clamp(score,0,100));
}

function renderFilters(){
  const platformFilter = $('platformFilter');
  const periodFilter = $('periodFilter');
  const prevP = platformFilter.value || 'Todas';
  const prevT = periodFilter.value || 'Todos';
  const platforms = ['Todas', ...new Set(state.platforms.map(x => x.platform))];
  const periods = ['Todos', ...new Set(state.platforms.map(x => x.period))];
  platformFilter.innerHTML = platforms.map(x => `<option ${x===prevP?'selected':''}>${x}</option>`).join('');
  periodFilter.innerHTML = periods.map(x => `<option ${x===prevT?'selected':''}>${x}</option>`).join('');
}

function renderSummary(){
  const items = byFilter(state.platforms);
  $('executiveSummary').textContent = state.summary;
  $('platformCount').textContent = new Set(items.map(x => x.platform)).size || 0;
  $('totalClicks').textContent = formatNumber(sum(items, 'clicks'));
  $('totalAlerts').textContent = buildAlerts(items).filter(x => x.type !== 'ok').length;
  $('periodoLabel').textContent = [...new Set(items.map(x=>x.period))].join(' · ') || 'Sin datos cargados';
  const score = calcScore(items);
  $('scoreNumber').textContent = score;
  $('sideScore').textContent = score;
  const side = document.querySelector('.orbit-ring');
  if(side) side.style.background = `conic-gradient(${COLORS.green} 0 ${score*3.6}deg, rgba(255,255,255,.18) ${score*3.6}deg)`;
  $('scoreLabel').textContent = score < 40 ? 'Crítico: intervención inmediata' : score < 70 ? 'En mejora: alto potencial' : 'Sólido: escalar estrategia';
}

function kpiStatus(value, target){
  const pct = target ? clamp((value / target) * 100, 0, 100) : 0;
  return { pct, status: pct >= 80 ? 'ok' : pct >= 45 ? 'warning' : 'critical' };
}

function renderKpis(){
  const items = byFilter(state.platforms);
  const totalViews = sum(items,'views');
  const totalReach = sum(items,'reach');
  const totalInteractions = sum(items,'interactions');
  const totalVisits = sum(items,'visits');
  const totalNewFollowers = sum(items,'newFollowers');
  const totalClicks = sum(items,'clicks');
  const response = items.length ? items.reduce((a,b)=>a+Number(b.responseRate||0),0)/items.length : 0;
  const engagement = totalViews ? totalInteractions/totalViews*100 : 0;
  const conversion = totalViews ? totalClicks/totalViews*100 : 0;
  const postsAvg = items.length ? sum(items,'posts')/items.length : 0;
  const data = [
    { icon:'◉', label:'Visualizaciones', value:formatNumber(totalViews), note:'Volumen bruto de exposición institucional.', target:kpiStatus(totalViews, 60000), badge:'Top funnel' },
    { icon:'◎', label:'Alcance', value:formatNumber(totalReach), note:'Personas o cuentas impactadas por el contenido.', target:kpiStatus(totalReach, 20000), badge:'Cobertura' },
    { icon:'✦', label:'Interacciones', value:formatNumber(totalInteractions), note:`Engagement: ${percent(engagement)}.`, target:kpiStatus(engagement, 4), badge:'Comunidad' },
    { icon:'⌁', label:'Visitas', value:formatNumber(totalVisits), note:'Interés real hacia página o perfil institucional.', target:kpiStatus(totalVisits, 1200), badge:'Interés' },
    { icon:'+', label:'Nuevos seguidores', value:formatNumber(totalNewFollowers), note:'Crecimiento neto de comunidad digital.', target:kpiStatus(totalNewFollowers, 160), badge:'Crecimiento' },
    { icon:'↗', label:'Clics en enlace', value:formatNumber(totalClicks), note:`Conversión: ${percent(conversion)}. Meta mínima 0,20%.`, target:kpiStatus(conversion, .20), badge:'Conversión' },
    { icon:'✉', label:'Respuesta mensajes', value:percent(response), note:'Indicador de servicio ciudadano digital.', target:kpiStatus(response, 90), badge:'Servicio' },
    { icon:'▦', label:'Frecuencia editorial', value:postsAvg.toFixed(1), note:'Promedio de publicaciones por plataforma.', target:kpiStatus(postsAvg, 12), badge:'Ritmo' }
  ];
  const grid = $('kpiGrid');
  const tpl = $('kpiTemplate');
  grid.innerHTML = '';
  data.forEach(k => {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector('.kpi-card');
    card.classList.add(k.target.status);
    node.querySelector('.kpi-icon').textContent = k.icon;
    node.querySelector('.kpi-badge').textContent = k.badge;
    node.querySelector('.metric-label').textContent = k.label;
    node.querySelector('strong').textContent = k.value;
    node.querySelector('small').textContent = k.note;
    node.querySelector('.kpi-meter span').style.width = `${k.target.pct}%`;
    grid.appendChild(node);
  });
}

function destroyCharts(){ Object.values(charts).forEach(c => c?.destroy()); charts = {}; }
function gradient(ctx, a, b){
  const g = ctx.createLinearGradient(0, 0, 0, 420);
  g.addColorStop(0, a); g.addColorStop(1, b);
  return g;
}
function renderCharts(){
  if(!window.Chart) return;
  destroyCharts();
  const items = byFilter(state.platforms);
  const ctxScore = $('scoreGauge').getContext('2d');
  const score = calcScore(items);
  charts.score = new Chart(ctxScore, {
    type:'doughnut',
    data:{ labels:['Índice','Brecha'], datasets:[{ data:[score, 100-score], borderWidth:0, cutout:'76%', backgroundColor:[gradient(ctxScore, COLORS.green, COLORS.blue), 'rgba(0,108,114,.10)'] }]},
    options:{ plugins:{ legend:{ display:false }, tooltip:{ enabled:false }}, animation:{ duration:900 }}
  });

  const normalized = (key, target) => items.map(x => clamp(Number(x[key]||0) / target * 100, 0, 100));
  const radarData = items.map(x => ({
    label: x.platform,
    data: [clamp(x.views/40000*100,0,100), clamp(x.interactions/1000*100,0,100), clamp(conversionRate(x)/.20*100,0,100), clamp(x.posts/16*100,0,100), clamp(x.responseRate/90*100,0,100)],
    fill:true,
    tension:.25,
    borderWidth:2,
    pointRadius:4
  }));
  charts.radar = new Chart($('radarChart'), {
    type:'radar',
    data:{ labels:['Visualizaciones','Interacciones','Conversión','Frecuencia','Respuesta'], datasets:radarData },
    options:{
      plugins:{ legend:{ position:'bottom', labels:{ color:COLORS.ink, boxWidth:10, usePointStyle:true, font:{ weight:'bold' }}}, tooltip:{ callbacks:{ label:ctx => `${ctx.dataset.label}: ${ctx.raw.toFixed(0)}/100` }}},
      scales:{ r:{ min:0, max:100, ticks:{ display:false, backdropColor:'transparent' }, pointLabels:{ color:COLORS.blueDark, font:{ size:11, weight:'bold' }}, grid:{ color:'rgba(0,108,114,.12)' }, angleLines:{ color:'rgba(0,108,114,.12)' }}},
      elements:{ line:{ backgroundColor:'rgba(204,212,0,.18)', borderColor:COLORS.green }, point:{ backgroundColor:COLORS.green, borderColor:'#ffffff' }}
    }
  });
  charts.radar.data.datasets.forEach((d,i)=>{ d.borderColor = i%2 ? '#ffffff' : COLORS.green; d.backgroundColor = i%2 ? 'rgba(255,255,255,.12)' : 'rgba(204,212,0,.22)'; });
  charts.radar.update();

  const trendCtx = $('trendChart').getContext('2d');
  charts.trend = new Chart(trendCtx, {
    type:'bar',
    data:{ labels: items.map(x=>`${x.platform} · ${x.period}`), datasets:[
      { label:'Visualizaciones', data:items.map(x=>x.views), backgroundColor:gradient(trendCtx,'rgba(0,108,114,.95)','rgba(0,108,114,.35)'), borderRadius:14, maxBarThickness:72, categoryPercentage:.55, barPercentage:.72, yAxisID:'y' },
      { label:'Interacciones', data:items.map(x=>x.interactions), type:'line', tension:.35, borderWidth:3, borderColor:COLORS.green, backgroundColor:COLORS.green, yAxisID:'y1' },
      { label:'Clics', data:items.map(x=>x.clicks), type:'line', tension:.35, borderWidth:3, borderColor:'#f59e0b', backgroundColor:'#f59e0b', yAxisID:'y1' }
    ]},
    options: axisOptions({ dual:true })
  });

  charts.conversion = new Chart($('conversionChart'), {
    type:'doughnut',
    data:{ labels:items.map(x=>x.platform), datasets:[{ data:items.map(x=>Math.max(conversionRate(x), .001)), borderWidth:0, cutout:'70%', backgroundColor:[COLORS.blue, COLORS.green, '#94a3b8'] }]},
    options:{ plugins:{ legend:{ position:'bottom', labels:{ font:{ weight:'bold' }}}, tooltip:{ callbacks:{ label:(ctx)=>`${ctx.label}: ${percent(conversionRate(items[ctx.dataIndex] || {}))}` }}}}
  });

  const f = currentFilters();
  const formats = state.formats.filter(x => f.platform === 'Todas' || x.platform === f.platform).sort((a,b)=>b.interactions-a.interactions);
  charts.format = new Chart($('formatChart'), {
    type:'bar',
    data:{ labels:formats.map(x=>`${x.platform} · ${x.format}`), datasets:[
      { label:'Visualizaciones', data:formats.map(x=>x.views), backgroundColor:'rgba(0,108,114,.82)', borderRadius:10, maxBarThickness:38, categoryPercentage:.62, barPercentage:.72 },
      { label:'Interacciones', data:formats.map(x=>x.interactions), backgroundColor:'rgba(204,212,0,.82)', borderRadius:10, maxBarThickness:38, categoryPercentage:.62, barPercentage:.72 }
    ]},
    options: axisOptions({ horizontal:true })
  });

  const benches = state.benchmarks.filter(x => f.platform === 'Todas' || x.platform === f.platform);
  charts.benchmark = new Chart($('benchmarkChart'), {
    type:'bar',
    data:{ labels:benches.map(x=>`${x.platform} · ${x.account}`), datasets:[
      { label:'Seguidores', data:benches.map(x=>x.followers), backgroundColor:benches.map(x=>x.account.toLowerCase().includes('infihuila') ? COLORS.green : 'rgba(0,108,114,.74)'), borderRadius:10, maxBarThickness:40, categoryPercentage:.64, barPercentage:.72 },
      { label:'Publicaciones', data:benches.map(x=>x.posts), type:'line', borderColor:'#f59e0b', backgroundColor:'#f59e0b', yAxisID:'y1', tension:.35 }
    ]},
    options: axisOptions({ horizontal:true, dual:true })
  });
}

function axisOptions({ horizontal=false, dual=false } = {}){
  return {
    layout:{ padding:{ top:6, right:8, bottom:2, left:4 }},
    indexAxis: horizontal ? 'y' : 'x',
    resizeDelay: 120,
    plugins:{
      legend:{ position:'bottom', labels:{ usePointStyle:true, padding:18, font:{ weight:'bold' }}},
      tooltip:{ callbacks:{ label:(ctx)=>`${ctx.dataset.label}: ${formatNumber(ctx.raw)}` }}
    },
    scales:{
      x:{ beginAtZero:true, grid:{ display:false }, ticks:{ color:COLORS.muted, autoSkip:true, maxTicksLimit:6, maxRotation:0, callback:(v)=> typeof v === 'number' ? formatNumber(v) : v }},
      y:{ beginAtZero:true, grid:{ color:'rgba(0,108,114,.10)' }, ticks:{ color:COLORS.muted, maxTicksLimit:6, callback:(v)=> typeof v === 'number' ? formatNumber(v) : v }},
      ...(dual ? { y1:{ beginAtZero:true, position:'right', grid:{ drawOnChartArea:false }, ticks:{ color:COLORS.muted, maxTicksLimit:5, callback:(v)=>formatNumber(v) }} } : {})
    }
  };
}

function buildAlerts(items){
  const totalViews = sum(items,'views');
  const clicks = sum(items,'clicks');
  const conv = totalViews ? clicks/totalViews*100 : 0;
  const response = items.length ? items.reduce((a,b)=>a+Number(b.responseRate||0),0)/items.length : 0;
  const posts = items.length ? sum(items,'posts')/items.length : 0;
  const stories = state.formats.filter(x => /historia/i.test(x.format));
  const storyViews = sum(stories,'views');
  const alerts = [];
  alerts.push(conv < .05 ? {type:'critical', title:'Conversión institucional crítica', body:`La tasa de clics es ${percent(conv)}. El alcance no se está convirtiendo en tráfico hacia servicios.`} : {type:'ok', title:'Conversión controlada', body:`La tasa de clics es ${percent(conv)}.`});
  alerts.push(response < 50 ? {type:'critical', title:'Respuesta a mensajes en riesgo', body:`La respuesta promedio está en ${percent(response)}. Se requiere protocolo operativo.`} : {type:'ok', title:'Respuesta ciudadana activa', body:`Respuesta promedio: ${percent(response)}.`});
  alerts.push(storyViews < 100 ? {type:'warning', title:'Historias con baja eficiencia', body:`Las historias suman ${formatNumber(storyViews)} visualizaciones. Requieren rediseño narrativo.`} : {type:'ok', title:'Historias con tracción', body:`Historias: ${formatNumber(storyViews)} visualizaciones.`});
  alerts.push(posts < 12 ? {type:'warning', title:'Frecuencia editorial insuficiente', body:`Promedio de ${posts.toFixed(1)} publicaciones. La meta sugerida es mínimo 12 al mes por plataforma.`} : {type:'ok', title:'Frecuencia editorial adecuada', body:`Promedio de ${posts.toFixed(1)} publicaciones.`});
  return alerts;
}

function renderAlerts(){
  const list = $('alertsList');
  list.innerHTML = buildAlerts(byFilter(state.platforms)).map(a => `
    <div class="alert-item ${a.type}">
      <span class="alert-dot"></span>
      <div><strong>${a.title}</strong><p>${a.body}</p></div>
    </div>`).join('');
}
function renderRecommendations(){
  $('recommendationsList').innerHTML = state.recommendations.map(x => `<li>${x}</li>`).join('');
}

function renderTable(){
  const tbody = $('dataTable').querySelector('tbody');
  tbody.innerHTML = state.platforms.map((row, i) => `
    <tr>
      <td><input data-i="${i}" data-k="platform" value="${row.platform}"></td>
      <td><input data-i="${i}" data-k="period" value="${row.period}"></td>
      <td><input type="number" data-i="${i}" data-k="views" value="${row.views}"></td>
      <td><input type="number" data-i="${i}" data-k="reach" value="${row.reach}"></td>
      <td><input type="number" data-i="${i}" data-k="interactions" value="${row.interactions}"></td>
      <td><input type="number" data-i="${i}" data-k="visits" value="${row.visits}"></td>
      <td><input type="number" data-i="${i}" data-k="newFollowers" value="${row.newFollowers}"></td>
      <td><input type="number" data-i="${i}" data-k="clicks" value="${row.clicks}"></td>
      <td><input type="number" data-i="${i}" data-k="responseRate" value="${row.responseRate}"></td>
      <td><input type="number" data-i="${i}" data-k="posts" value="${row.posts}"></td>
      <td><button class="mini-btn" data-delete="${i}">Eliminar</button></td>
    </tr>`).join('');

  tbody.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      const i = Number(input.dataset.i);
      const k = input.dataset.k;
      state.platforms[i][k] = input.type === 'number' ? Number(input.value || 0) : input.value;
      saveState(); renderAll();
    });
  });
  tbody.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => {
    state.platforms.splice(Number(btn.dataset.delete), 1); saveState(); renderAll();
  }));
}

function addRow(){
  state.platforms.push({ platform:'Nueva plataforma', period:'Nuevo período', views:0, reach:0, interactions:0, visits:0, newFollowers:0, clicks:0, responseRate:0, followers:0, posts:0, growthViews:0, growthInteractions:0, organic:100 });
  saveState(); renderAll();
}
function exportCsv(){
  const headers = ['platform','period','views','reach','interactions','visits','newFollowers','clicks','responseRate','followers','posts','growthViews','growthInteractions','organic'];
  const rows = [headers.join(','), ...state.platforms.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g,'""')}"`).join(','))];
  const blob = new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'infihuila-plan-medios.csv'; a.click(); URL.revokeObjectURL(url);
}

function parseLocaleNumber(value){
  if(value === undefined || value === null) return 0;
  if(typeof value === 'number') return value;
  const s = String(value).toLowerCase().replace(/mil/g,'000').replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3})/g,'').replace(',', '.');
  return Number(s) || 0;
}
function normalizeRow(raw){
  const keys = Object.keys(raw).reduce((acc,k)=>{ acc[k.toLowerCase().trim()] = raw[k]; return acc; },{});
  return {
    platform: keys.plataforma || keys.platform || keys.red || 'Sin plataforma',
    period: keys.periodo || keys.period || keys.mes || 'Sin período',
    views: parseLocaleNumber(keys.visualizaciones || keys.views || keys.vistas),
    reach: parseLocaleNumber(keys.alcance || keys.espectadores || keys.reach),
    interactions: parseLocaleNumber(keys.interacciones || keys.interactions),
    visits: parseLocaleNumber(keys.visitas || keys.visits || keys['visitas al perfil'] || keys['visitas a la página']),
    newFollowers: parseLocaleNumber(keys['seguidores nuevos'] || keys.nuevos || keys.newfollowers),
    clicks: parseLocaleNumber(keys.clics || keys.clicks || keys['clics en enlace']),
    responseRate: parseLocaleNumber(keys.respuesta || keys['respuesta %'] || keys.responserate),
    followers: parseLocaleNumber(keys.seguidores || keys.followers),
    posts: parseLocaleNumber(keys.publicaciones || keys.posts || keys.contenidos),
    growthViews: parseLocaleNumber(keys.crecimiento || keys.growthviews),
    growthInteractions: parseLocaleNumber(keys['crecimiento interacciones'] || keys.growthinteractions),
    organic: parseLocaleNumber(keys.organico || keys.orgánico || keys.organic || 100)
  };
}
async function handleFile(file){
  $('uploadStatus').textContent = `Procesando ${file.name}...`;
  try{
    const ext = file.name.split('.').pop().toLowerCase();
    if(['xlsx','xls','csv'].includes(ext)) await readSpreadsheet(file);
    else if(ext === 'pdf') await readPdf(file);
    else throw new Error('Formato no soportado');
    saveState(); renderAll();
    $('uploadStatus').textContent = `Archivo cargado: ${file.name}`;
  }catch(err){
    console.error(err);
    $('uploadStatus').textContent = 'No fue posible leer el archivo. Verifica que tenga columnas de indicadores o estructura similar al informe base.';
  }
}
async function readSpreadsheet(file){
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, {type:'array'});
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet, {defval:''});
  const rows = json.map(normalizeRow).filter(r => r.platform !== 'Sin plataforma' || r.views || r.interactions);
  if(!rows.length) throw new Error('Sin registros');
  state.platforms = rows;
  state.summary = `Base actualizada desde ${file.name}. El tablero recalculó indicadores, alertas y gráficos con ${rows.length} registro(s).`;
}
async function readPdf(file){
  if(!window.pdfjsLib) throw new Error('PDF.js no disponible');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdf = await pdfjsLib.getDocument({data: await file.arrayBuffer()}).promise;
  let text = '';
  for(let i=1;i<=pdf.numPages;i++){
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += '\n' + content.items.map(item => item.str).join(' ');
  }
  const fbViews = /Facebook[\s\S]{0,220}?Visualizaciones\s*([0-9,.]+\s*mil|[0-9,.]+)/i.exec(text)?.[1];
  const igViews = /Instagram[\s\S]{0,220}?Visualizaciones\s*([0-9,.]+\s*mil|[0-9,.]+)/i.exec(text)?.[1];
  const fbClicks = /Facebook[\s\S]{0,800}?Clics en(?: el)? enlace\s*([0-9,.]+)/i.exec(text)?.[1];
  const igClicks = /Instagram[\s\S]{0,800}?Clics en(?: el)? enlace\s*([0-9,.]+)/i.exec(text)?.[1];
  const rows = structuredClone(initialState.platforms);
  if(fbViews) rows[0].views = parseLocaleNumber(fbViews);
  if(igViews) rows[1].views = parseLocaleNumber(igViews);
  if(fbClicks) rows[0].clicks = parseLocaleNumber(fbClicks);
  if(igClicks) rows[1].clicks = parseLocaleNumber(igClicks);
  state.platforms = rows;
  state.summary = `Informe PDF cargado: ${file.name}. Se actualizó la lectura base de Facebook e Instagram y se recalcularon los indicadores gerenciales.`;
}

function initEvents(){
  $('platformFilter').addEventListener('change', renderAll);
  $('periodFilter').addEventListener('change', renderAll);
  $('btnReset').addEventListener('click', () => { state = structuredClone(initialState); saveState(); renderAll(); $('uploadStatus').textContent = 'Datos iniciales restaurados.'; });
  $('btnExport').addEventListener('click', exportCsv);
  $('btnAddRow').addEventListener('click', addRow);
  $('btnUpload').addEventListener('click', () => $('fileInput').click());
  $('fileInput').addEventListener('change', e => { if(e.target.files[0]) handleFile(e.target.files[0]); });
  const dz = $('dropzone');
  ['dragenter','dragover'].forEach(evt => dz.addEventListener(evt, e => { e.preventDefault(); dz.classList.add('drag'); }));
  ['dragleave','drop'].forEach(evt => dz.addEventListener(evt, e => { e.preventDefault(); dz.classList.remove('drag'); }));
  dz.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if(f) handleFile(f); });
  document.querySelectorAll('.nav-pill').forEach(a => a.addEventListener('click', () => {
    document.querySelectorAll('.nav-pill').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  }));
}

function renderAll(){
  const prev = currentFilters();
  renderFilters();
  if([...$('platformFilter').options].some(o => o.value === prev.platform)) $('platformFilter').value = prev.platform;
  if([...$('periodFilter').options].some(o => o.value === prev.period)) $('periodFilter').value = prev.period;
  renderSummary();
  renderKpis();
  renderCharts();
  renderAlerts();
  renderRecommendations();
  renderTable();
}

document.addEventListener('DOMContentLoaded', () => { initEvents(); renderAll(); });
