const XLSX = require('xlsx');

const wb = XLSX.utils.book_new();

const instrucciones = [
  ['OKRs Santiago Hiking — Planificación Estratégica'],
  ['Estándar: Much Better Adventures (MBA) — Aventura Real, Cordada Andina y Tracción Comercial'],
  ['Estado inicial: Proyecto iniciando desde CERO (Datos reales limpios en espera de ejecución).'],
  [''],
  ['Cómo usar esta planilla'],
  ['1. En la pestaña "Seguimiento Mensual" se ubican los 4 Objetivos de Santiago Hiking y sus Resultados Clave (KR).'],
  ['2. Las columnas "Baseline" y "Meta 1 a 5" son totalmente editables y ajustadas a la realidad operativa del proyecto.'],
  ['   - Salidas grupales con ticket promedio de ~$28.000 CLP y 8 a 10 personas por cordada.'],
  ['   - Turistas extranjeros en USD (Airbnb Experiences / Viator) con ticket de USD $45 a $85.'],
  ['3. A fin de cada mes, ingresa el dato en la columna "Real" correspondiente.'],
  ['4. Las columnas "Avance Actual", "Meta al Mes Actual", "% Cumplimiento" y "Estado" se calculan automáticamente al ingresar un valor real.'],
  ['5. En la pestaña "Resumen OKRs" se monitorea el promedio ponderado de salud de cada Objetivo.'],
  [''],
  ['Criterios del Semáforo'],
  ['🟢 Cumplido: Avance igual o superior al 100% de la meta del mes.'],
  ['🟡 En curso: Avance entre 70% y 99% de la meta del mes.'],
  ['🔴 Atrasado: Avance inferior al 70% de la meta del mes.'],
  ['⚪ Sin datos: Mes aún no ejecutado o registrado.']
];
const wsInst = XLSX.utils.aoa_to_sheet(instrucciones);
XLSX.utils.book_append_sheet(wb, wsInst, 'Instrucciones');

const headers = [
  'Objetivo', 'Resultado Clave (KR)', 'Métrica', 'Baseline',
  'Meta Mes 1', 'Meta Mes 2', 'Meta Mes 3', 'Meta Mes 4', 'Meta Mes 5',
  'Real Mes 1', 'Real Mes 2', 'Real Mes 3', 'Real Mes 4', 'Real Mes 5',
  'Avance Actual', 'Meta Mes Actual', '% Cumplimiento', 'Estado'
];

const rows = [
  ['O1: Escalar ventas y cupos de cordada', 'Alcanzar rampa de ventas mensuales por expediciones', 'Ventas mensuales ($ CLP)', 0, 450000, 650000, 950000, 1350000, 1800000, '', '', '', '', '', '', 450000, '', '⚪ Sin datos'],
  ['', 'Llenar cupos de aventureros por mes (8-10 pax por salida)', 'Cupos reservados (#)', 0, 16, 24, 34, 46, 60, '', '', '', '', '', '', 16, '', '⚪ Sin datos'],
  ['', 'Mantener margen de contribución neta superior al 50%', 'Margen sobre ventas (%)', '50.0%', '50.0%', '52.0%', '54.0%', '55.0%', '58.0%', '', '', '', '', '', '', '50.0%', '', '⚪ Sin datos'],
  ['O2: Aumentar alcance y comunidad ("Do Wild Things")', 'Crecer la comunidad de montaña en Instagram', 'Seguidores Instagram (acumulado)', 394, 500, 750, 1100, 1600, 2300, '', '', '', '', '', '', 500, '', '⚪ Sin datos'],
  ['', 'Escalar tracción y alcance orgánico en TikTok', 'Seguidores TikTok (acumulado)', 46, 150, 350, 700, 1300, 2200, '', '', '', '', '', '', 150, '', '⚪ Sin datos'],
  ['', 'Publicar contenido audiovisual épico de forma constante', 'Reels/TikToks acumulados (#)', 0, 16, 32, 50, 70, 95, '', '', '', '', '', '', 16, '', '⚪ Sin datos'],
  ['', 'Generar consultas entrantes hacia el Bot Gaz en WhatsApp', 'Consultas WhatsApp (# / mes)', 0, 30, 55, 85, 130, 190, '', '', '', '', '', '', 30, '', '⚪ Sin datos'],
  ['O3: Consolidar reputación 5★ y retención', 'Acumular reseñas 5 estrellas verificadas', 'Reseñas 5★ acumuladas (#)', 0, 8, 18, 32, 50, 75, '', '', '', '', '', '', 8, '', '⚪ Sin datos'],
  ['', 'Fomentar la repetición de cordada (Repeat Hikers)', 'Aventureros que repiten cumbre (%)', '0.0%', '15.0%', '18.0%', '22.0%', '25.0%', '28.0%', '', '', '', '', '', '', '15.0%', '', '⚪ Sin datos'],
  ['O4: Internacionalización & Turistas en USD', 'Homologar canales internacionales (Airbnb/Viator)', 'Canales activos (#)', 0, 1, 2, 3, 3, 3, '', '', '', '', '', '', 1, '', '⚪ Sin datos'],
  ['', 'Facturación directa de viajeros en Santiago', 'Ventas turistas (USD $)', 0, 200, 500, 1000, 1800, 2800, '', '', '', '', '', '', 200, '', '⚪ Sin datos']
];

const wsSeg = XLSX.utils.aoa_to_sheet([headers, ...rows]);
XLSX.utils.book_append_sheet(wb, wsSeg, 'Seguimiento Mensual');

const resumen = [
  ['Resumen OKRs Santiago Hiking — Estado Inicial del Proyecto'],
  ['Proyecto iniciando desde CERO'],
  [''],
  ['Objetivo', 'N° de KRs', '% Avance Promedio', 'Estado General'],
  ['O1: Escalar ventas y cupos de cordada en Santiago Hiking', 3, '—', '⚪ Sin datos (Inicio)'],
  ['O2: Aumentar alcance, comunidad y tráfico ("Do Wild Things")', 4, '—', '⚪ Sin datos (Inicio)'],
  ['O3: Consolidar reputación 5★ y retención', 2, '—', '⚪ Sin datos (Inicio)'],
  ['O4: Internacionalización & Turistas en USD', 2, '—', '⚪ Sin datos (Inicio)']
];
const wsRes = XLSX.utils.aoa_to_sheet(resumen);
XLSX.utils.book_append_sheet(wb, wsRes, 'Resumen OKRs');

XLSX.writeFile(wb, './public/OKRs_Santiago_Hiking_Ago-Dic_2026.xlsx');
console.log('Clean slate OKRs_Santiago_Hiking_Ago-Dic_2026.xlsx generated');
