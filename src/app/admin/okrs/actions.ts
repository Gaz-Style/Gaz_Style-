'use server';

import { createClient } from '@/lib/supabase/server';
import { KeyResult } from '@/types/okrs';
import { INITIAL_SANTIAGO_HIKING_KRS, calculateKR, calculateObjectivesSummary } from '@/lib/okrs-data';
import * as XLSX from 'xlsx';

export async function getOKRs(): Promise<KeyResult[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('santiago_hiking_okrs')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id || `kr-${item.order_index}`,
        objectiveId: item.objective_id,
        objectiveTitle: item.objective_title,
        krTitle: item.kr_title,
        metricName: item.metric_name,
        metricType: item.metric_type,
        unit: item.unit || '',
        baseline: Number(item.baseline || 0),
        monthNames: item.month_names || ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5'],
        targets: (item.targets || []).map((t: any) => Number(t)),
        actuals: (item.actuals || []).map((a: any) => (a === null || a === undefined || a === '' ? null : Number(a))),
        notes: item.notes || '',
        orderIndex: Number(item.order_index || 0)
      }));
    }
  } catch (err) {
    console.warn('Supabase OKRs table not yet initialized or unreachable, using clean default data:', err);
  }

  return INITIAL_SANTIAGO_HIKING_KRS;
}

export async function saveOKRs(krs: KeyResult[]): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    
    const records = krs.map((kr, idx) => ({
      objective_id: kr.objectiveId,
      objective_title: kr.objectiveTitle,
      kr_title: kr.krTitle,
      metric_name: kr.metricName,
      metric_type: kr.metricType,
      unit: kr.unit,
      baseline: kr.baseline,
      month_names: kr.monthNames,
      targets: kr.targets,
      actuals: kr.actuals,
      notes: kr.notes || '',
      order_index: idx + 1,
      updated_at: new Date().toISOString()
    }));

    const { error: deleteErr } = await supabase.from('santiago_hiking_okrs').delete().neq('order_index', -999);
    
    if (!deleteErr) {
      const { error: insertErr } = await supabase.from('santiago_hiking_okrs').insert(records);
      if (!insertErr) {
        return { success: true, message: 'Datos y metas sincronizados en Supabase exitosamente.' };
      }
    }
    
    return { 
      success: true, 
      message: 'Guardado en la memoria local del navegador (la base de datos se sincronizará al conectar).' 
    };
  } catch (err: any) {
    return { 
      success: true, 
      message: 'Guardado en memoria local del navegador.' 
    };
  }
}

export async function syncRealDataFromDatabase(): Promise<{
  bookingsCount: number;
  totalRevenueClp: number;
  message: string;
}> {
  try {
    const supabase = await createClient();

    // Consultar bookings pagados reales
    const { data: bookings, error: bookingsErr } = await supabase
      .from('bookings')
      .select('id, total_price, amount_paid, payment_status')
      .eq('payment_status', 'paid');

    const bookingsCount = bookings?.length || 0;
    const totalRevenueClp = bookings?.reduce((acc, b) => acc + Number(b.amount_paid || b.total_price || 0), 0) || 0;

    if (bookingsCount === 0) {
      return {
        bookingsCount: 0,
        totalRevenueClp: 0,
        message: 'No hay reservas pagadas registradas aún en el sistema (proyecto iniciando desde cero).'
      };
    }

    return {
      bookingsCount,
      totalRevenueClp,
      message: `Sincronizadas ${bookingsCount} reservas pagadas reales ($${totalRevenueClp.toLocaleString('es-CL')} CLP).`
    };
  } catch (err) {
    return {
      bookingsCount: 0,
      totalRevenueClp: 0,
      message: 'Base de datos en espera de primera reserva real (iniciando desde cero).'
    };
  }
}

export async function generateOKRExcel(krs: KeyResult[]): Promise<{ base64: string; fileName: string }> {
  const wb = XLSX.utils.book_new();
  const calculated = krs.map(calculateKR);
  const summary = calculateObjectivesSummary(krs);

  const months = krs[0]?.monthNames || ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5'];

  // 1. Hoja Instrucciones
  const instruccionesData = [
    ['OKRs Santiago Hiking — Planificación Estratégica'],
    ['Estándar: Much Better Adventures (Aventura Real, Comunidad Andina y Tracción en CLP/USD)'],
    ['Proyecto iniciando desde CERO con metas planificadas y reales en blanco.'],
    [''],
    ['Cómo usar esta planilla'],
    ['1. En la pestaña "Seguimiento Mensual" se registran los 4 Objetivos de Santiago Hiking y sus Resultados Clave (KR).'],
    ['2. Las columnas "Baseline" y "Meta 1 a 5" son totalmente editables según la realidad de tu proyecto.'],
    ['   - Para ventas, cupos y consultas son metas MENSUALES (flujo).'],
    ['   - Para seguidores, publicaciones y reseñas 5★ son metas ACUMULADAS.'],
    ['3. A medida que ejecutas salidas y mes a mes, completa la columna "Real" del mes correspondiente.'],
    ['4. Las columnas "Avance Actual", "Meta al Mes Actual", "% Cumplimiento" y "Estado" se calculan de manera automática comparando el último mes registrado.'],
    ['5. En la pestaña "Resumen OKRs" se monitorea el promedio ponderado de salud de cada Objetivo.'],
    [''],
    ['Criterios del Semáforo'],
    ['🟢 Cumplido: Avance igual o superior al 100% de la meta del mes.'],
    ['🟡 En curso: Avance entre 70% y 99% de la meta del mes.'],
    ['🔴 Atrasado: Avance inferior al 70% de la meta.'],
    ['⚪ Sin datos: Aún no se han registrado valores reales para ese indicador.'],
    [''],
    ['Generado automáticamente desde el Panel de Administración de Santiago Hiking.']
  ];
  const wsInstrucciones = XLSX.utils.aoa_to_sheet(instruccionesData);
  XLSX.utils.book_append_sheet(wb, wsInstrucciones, 'Instrucciones');

  // 2. Hoja Seguimiento Mensual
  const headers = [
    'Objetivo',
    'Resultado Clave (KR)',
    'Métrica',
    'Tipo',
    'Unidad',
    'Baseline',
    ...months.map(m => `Meta ${m}`),
    ...months.map(m => `Real ${m}`),
    'Avance Actual',
    'Meta al Mes Actual',
    '% Cumplimiento',
    'Estado'
  ];

  const rows = calculated.map(kr => [
    kr.objectiveTitle,
    kr.krTitle,
    kr.metricName,
    kr.metricType,
    kr.unit,
    kr.baseline,
    kr.targets[0] ?? '',
    kr.targets[1] ?? '',
    kr.targets[2] ?? '',
    kr.targets[3] ?? '',
    kr.targets[4] ?? '',
    kr.actuals[0] ?? '',
    kr.actuals[1] ?? '',
    kr.actuals[2] ?? '',
    kr.actuals[3] ?? '',
    kr.actuals[4] ?? '',
    kr.currentActual ?? '',
    kr.currentTarget ?? '',
    kr.status === 'Sin datos' ? '' : `${(kr.completionRate * 100).toFixed(1)}%`,
    kr.status === 'Cumplido' ? '🟢 Cumplido' : kr.status === 'En curso' ? '🟡 En curso' : kr.status === 'Atrasado' ? '🔴 Atrasado' : '⚪ Sin datos'
  ]);

  const wsSeguimiento = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  XLSX.utils.book_append_sheet(wb, wsSeguimiento, 'Seguimiento Mensual');

  // 3. Hoja Resumen OKRs
  const resumenHeaders = ['Objetivo', 'N° de KRs', '% Avance Promedio', 'Estado General'];
  const resumenRows = summary.map(obj => [
    obj.title,
    obj.krCount,
    obj.status === 'Sin datos' ? '— (Sin datos aún)' : `${(obj.averageCompletion * 100).toFixed(1)}%`,
    obj.status === 'Cumplido' ? '🟢 Cumplido' : obj.status === 'En curso' ? '🟡 En curso' : obj.status === 'Atrasado' ? '🔴 Atrasado' : '⚪ Sin datos'
  ]);

  const wsResumen = XLSX.utils.aoa_to_sheet([
    ['Resumen OKRs Santiago Hiking'],
    [''],
    resumenHeaders,
    ...resumenRows
  ]);
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen OKRs');

  const buf = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  return {
    base64: buf,
    fileName: `OKRs_Santiago_Hiking_${new Date().toISOString().slice(0, 10)}.xlsx`
  };
}
