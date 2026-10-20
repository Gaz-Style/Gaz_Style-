export type MetricType = 'flujo' | 'acumulado';
export type OKRStatus = 'Cumplido' | 'En curso' | 'Atrasado' | 'Sin datos';

export interface KeyResult {
  id: string;
  objectiveId: string;
  objectiveTitle: string;
  krTitle: string;
  metricName: string;
  metricType: MetricType;
  unit: string; // '$', '#', '%', 'USD $'
  baseline: number;
  monthNames: string[]; // ['Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  targets: number[];
  actuals: (number | null)[];
  notes?: string;
  orderIndex: number;
}

export interface CalculatedKR extends KeyResult {
  currentActual: number | null;
  currentTarget: number | null;
  currentMonthIndex: number; // Index of latest filled actual
  currentMonthName: string;
  completionRate: number; // 0 to 1+
  status: OKRStatus;
}

export interface ObjectiveSummary {
  id: string;
  title: string;
  krCount: number;
  averageCompletion: number;
  status: OKRStatus;
  krs: CalculatedKR[];
}

export interface OKRDataset {
  periodName: string;
  monthNames: string[];
  krs: KeyResult[];
}
