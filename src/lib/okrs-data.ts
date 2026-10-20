import { KeyResult, CalculatedKR, ObjectiveSummary, OKRStatus, MetricType } from '@/types/okrs';

// Meses por defecto: ciclo de inicio del proyecto (Noviembre 2026 a Marzo 2027 o configurables)
export const DEFAULT_MONTHS = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5'];

// Metas y baselines conectados a la realidad operativa de Santiago Hiking:
// - Precio promedio por cupo en cordada grupal: ~$28.000 CLP
// - Tamaño de cordada: 8 a 10 aventureros por salida
// - Salida regular: ~$224.000 CLP brutos
// - Salida de alta montaña (Pintor / Plomo): $65.000 a $165.000 CLP por persona
// - Canales internacionales (Airbnb Experiences / Viator): USD $45 a $85 por persona
// - Proyecto inicia desde CERO: Todos los valores "Real" parten en null / limpios.
export const INITIAL_SANTIAGO_HIKING_KRS: KeyResult[] = [
  // =========================================================================
  // OBJETIVO 1: Tracción Comercial & Cordadas
  // =========================================================================
  {
    id: 'kr-1-1',
    objectiveId: 'O1',
    objectiveTitle: 'Escalar ventas y cupos de cordada en Santiago Hiking',
    krTitle: 'Alcanzar rampa de ventas mensuales por expediciones guiadas',
    metricName: 'Ventas mensuales ($ CLP)',
    metricType: 'flujo',
    unit: '$',
    baseline: 0, // Inicia desde cero
    monthNames: DEFAULT_MONTHS,
    targets: [450000, 650000, 950000, 1350000, 1800000],
    actuals: [null, null, null, null, null], // Totalmente limpio para empezar desde cero
    notes: 'Base real: 2 salidas en Mes 1 (~$450k) hasta 6 salidas + alta montaña en Mes 5.',
    orderIndex: 1
  },
  {
    id: 'kr-1-2',
    objectiveId: 'O1',
    objectiveTitle: 'Escalar ventas y cupos de cordada en Santiago Hiking',
    krTitle: 'Llenar cupos de aventureros por mes (8 a 10 pax por cordada)',
    metricName: 'Cupos reservados (# aventureros)',
    metricType: 'flujo',
    unit: '#',
    baseline: 0,
    monthNames: DEFAULT_MONTHS,
    targets: [16, 24, 34, 46, 60],
    actuals: [null, null, null, null, null],
    notes: 'Mes 1: 2 cordadas (16 cupos). Mes 2: 3 cordadas (24 cupos). Grupos reducidos seguros.',
    orderIndex: 2
  },
  {
    id: 'kr-1-3',
    objectiveId: 'O1',
    objectiveTitle: 'Escalar ventas y cupos de cordada en Santiago Hiking',
    krTitle: 'Mantener margen de contribución neta superior al 50%',
    metricName: 'Margen sobre ventas (%)',
    metricType: 'flujo',
    unit: '%',
    baseline: 0.50,
    monthNames: DEFAULT_MONTHS,
    targets: [0.50, 0.52, 0.54, 0.55, 0.58],
    actuals: [null, null, null, null, null],
    notes: 'Piso mínimo 50% una vez descontados guías de apoyo, traslados, raciones y seguros.',
    orderIndex: 3
  },

  // =========================================================================
  // OBJETIVO 2: Comunidad Salvaje & Alcance Orgánico
  // =========================================================================
  {
    id: 'kr-2-1',
    objectiveId: 'O2',
    objectiveTitle: 'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    krTitle: 'Crecer la comunidad de montaña en Instagram (@gaz_style / Santiago Hiking)',
    metricName: 'Seguidores Instagram (acumulado)',
    metricType: 'acumulado',
    unit: '#',
    baseline: 394, // Punto de partida real de la cuenta
    monthNames: DEFAULT_MONTHS,
    targets: [500, 750, 1100, 1600, 2300],
    actuals: [null, null, null, null, null],
    notes: 'Publicación de reels al atardecer, vistas panorámicas y llamado al link en bio.',
    orderIndex: 4
  },
  {
    id: 'kr-2-2',
    objectiveId: 'O2',
    objectiveTitle: 'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    krTitle: 'Escalar tracción y alcance orgánico en TikTok',
    metricName: 'Seguidores TikTok (acumulado)',
    metricType: 'acumulado',
    unit: '#',
    baseline: 46, // Punto de partida real de la cuenta
    monthNames: DEFAULT_MONTHS,
    targets: [150, 350, 700, 1300, 2200],
    actuals: [null, null, null, null, null],
    notes: 'Videos cortos con audio en tendencia, consejos de ascenso y tomas en la cumbre.',
    orderIndex: 5
  },
  {
    id: 'kr-2-3',
    objectiveId: 'O2',
    objectiveTitle: 'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    krTitle: 'Publicar contenido audiovisual épico de forma constante',
    metricName: 'Reels/TikToks publicados (acumulado)',
    metricType: 'acumulado',
    unit: '#',
    baseline: 0,
    monthNames: DEFAULT_MONTHS,
    targets: [16, 32, 50, 70, 95],
    actuals: [null, null, null, null, null],
    notes: 'Cadencia de 4 videos semanales mostrando cumbres, equipo y seguridad.',
    orderIndex: 6
  },
  {
    id: 'kr-2-4',
    objectiveId: 'O2',
    objectiveTitle: 'Aumentar alcance, comunidad y tráfico orgánico ("Do Wild Things")',
    krTitle: 'Generar consultas entrantes hacia el Bot Gaz en WhatsApp',
    metricName: 'Consultas WhatsApp (# / mes)',
    metricType: 'flujo',
    unit: '#',
    baseline: 0,
    monthNames: DEFAULT_MONTHS,
    targets: [30, 55, 85, 130, 190],
    actuals: [null, null, null, null, null],
    notes: 'Derivación desde web y perfiles sociales con botón de WhatsApp directo.',
    orderIndex: 7
  },

  // =========================================================================
  // OBJETIVO 3: Excelencia & Reputación de Cordada
  // =========================================================================
  {
    id: 'kr-3-1',
    objectiveId: 'O3',
    objectiveTitle: 'Consolidar reputación 5 estrellas y retención de aventureros',
    krTitle: 'Acumular reseñas 5 estrellas verificadas en Google Maps y plataformas',
    metricName: 'Reseñas 5★ acumuladas (#)',
    metricType: 'acumulado',
    unit: '#',
    baseline: 0,
    monthNames: DEFAULT_MONTHS,
    targets: [8, 18, 32, 50, 75],
    actuals: [null, null, null, null, null],
    notes: 'Solicitud post-salida a cada participante con incentivo para su próxima cumbre.',
    orderIndex: 8
  },
  {
    id: 'kr-3-2',
    objectiveId: 'O3',
    objectiveTitle: 'Consolidar reputación 5 estrellas y retención de aventureros',
    krTitle: 'Fomentar la repetición de cordada (Repeat Hikers)',
    metricName: 'Aventureros que repiten cumbre (%)',
    metricType: 'flujo',
    unit: '%',
    baseline: 0,
    monthNames: DEFAULT_MONTHS,
    targets: [0.15, 0.18, 0.22, 0.25, 0.28],
    actuals: [null, null, null, null, null],
    notes: 'Comunidad solo-friendly: aventureros que tras su 1ra salida vuelven a agendar.',
    orderIndex: 9
  },

  // =========================================================================
  // OBJETIVO 4: Expansión Internacional & Turistas en USD
  // =========================================================================
  {
    id: 'kr-4-1',
    objectiveId: 'O4',
    objectiveTitle: 'Internacionalización & Captación de Turistas Extranjeros en USD',
    krTitle: 'Homologar y activar canales internacionales (Airbnb / Viator / Bookatrekking)',
    metricName: 'Canales internacionales activos (#)',
    metricType: 'acumulado',
    unit: '#',
    baseline: 0,
    monthNames: DEFAULT_MONTHS,
    targets: [1, 2, 3, 3, 3],
    actuals: [null, null, null, null, null],
    notes: 'Mes 1: Airbnb Experiences. Mes 2: Viator/TripAdvisor. Mes 3: Bookatrekking.',
    orderIndex: 10
  },
  {
    id: 'kr-4-2',
    objectiveId: 'O4',
    objectiveTitle: 'Internacionalización & Captación de Turistas Extranjeros en USD',
    krTitle: 'Facturación directa de viajeros extranjeros en Santiago',
    metricName: 'Ventas turistas internacionales (USD $)',
    metricType: 'flujo',
    unit: 'USD $',
    baseline: 0,
    monthNames: DEFAULT_MONTHS,
    targets: [200, 500, 1000, 1800, 2800],
    actuals: [null, null, null, null, null],
    notes: 'Tarifa extranjera: USD $45 a $85 por persona con servicio bilingüe y fotos pro.',
    orderIndex: 11
  }
];

export function calculateKR(kr: KeyResult): CalculatedKR {
  const { monthNames, targets, actuals } = kr;
  
  // Encontrar el último mes con dato real registrado (de atrás hacia adelante)
  let latestIdx = -1;
  for (let i = actuals.length - 1; i >= 0; i--) {
    const val = actuals[i];
    if (val !== null && val !== undefined && !isNaN(Number(val))) {
      latestIdx = i;
      break;
    }
  }

  if (latestIdx === -1) {
    return {
      ...kr,
      currentActual: null,
      currentTarget: targets[0] ?? null,
      currentMonthIndex: -1,
      currentMonthName: 'Sin datos',
      completionRate: 0,
      status: 'Sin datos'
    };
  }

  const currentActual = actuals[latestIdx]!;
  const currentTarget = targets[latestIdx] ?? targets[0] ?? 1;
  const currentMonthName = monthNames[latestIdx] ?? `Mes ${latestIdx + 1}`;
  
  const completionRate = currentTarget === 0 ? (currentActual > 0 ? 1 : 0) : currentActual / currentTarget;

  let status: OKRStatus = 'Sin datos';
  if (completionRate >= 1.0) {
    status = 'Cumplido';
  } else if (completionRate >= 0.7) {
    status = 'En curso';
  } else {
    status = 'Atrasado';
  }

  return {
    ...kr,
    currentActual,
    currentTarget,
    currentMonthIndex: latestIdx,
    currentMonthName,
    completionRate,
    status
  };
}

export function calculateObjectivesSummary(krs: KeyResult[]): ObjectiveSummary[] {
  const calculatedKRs = krs.map(calculateKR);
  const grouped: Record<string, CalculatedKR[]> = {};

  calculatedKRs.forEach(kr => {
    if (!grouped[kr.objectiveId]) {
      grouped[kr.objectiveId] = [];
    }
    grouped[kr.objectiveId].push(kr);
  });

  return Object.entries(grouped).map(([objId, items]) => {
    const title = items[0]?.objectiveTitle || objId;
    const itemsWithData = items.filter(k => k.status !== 'Sin datos');
    
    let averageCompletion = 0;
    let status: OKRStatus = 'Sin datos';

    if (itemsWithData.length > 0) {
      const sum = itemsWithData.reduce((acc, k) => acc + k.completionRate, 0);
      averageCompletion = sum / itemsWithData.length;

      if (averageCompletion >= 1.0) {
        status = 'Cumplido';
      } else if (averageCompletion >= 0.7) {
        status = 'En curso';
      } else {
        status = 'Atrasado';
      }
    }

    return {
      id: objId,
      title,
      krCount: items.length,
      averageCompletion,
      status,
      krs: items
    };
  });
}

export function formatMetricValue(value: number | null | undefined, unit: string): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  
  if (unit === '%') {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (unit === '$') {
    return `$${Math.round(value).toLocaleString('es-CL')}`;
  }
  if (unit === 'USD $') {
    return `USD $${Math.round(value).toLocaleString('en-US')}`;
  }
  return Math.round(value).toLocaleString('es-CL');
}
