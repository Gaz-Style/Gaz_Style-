import { ExpeditionOption } from '@/types/pos';

export const OFFICIAL_EXPEDITIONS: ExpeditionOption[] = [
  {
    id: 'exp-manquehuito-sunset',
    title: 'Cerro Manquehuito Sunset & Nubes Andinas',
    category: 'Sunset',
    duration_text: '3.5 a 4 horas',
    base_price_clp: 28000,
    price_usd: 35,
    meeting_point: 'Acceso Vía Roja, Lo Barnechea',
    meeting_time: '18:30 hrs',
    difficulty: 'Fácil - Iniciación'
  },
  {
    id: 'exp-pochoco-panoramico',
    title: 'Cerro Pochoco — Panorámica 360° del Valle',
    category: 'Cumbre',
    duration_text: '4.5 horas',
    base_price_clp: 25000,
    price_usd: 30,
    meeting_point: 'Observatorio Achiras, El Arrayán',
    meeting_time: '08:00 hrs',
    difficulty: 'Moderada'
  },
  {
    id: 'exp-carbon-nocturno',
    title: 'Cerro Carbón Nocturno & Luces de Santiago',
    category: 'Nocturno',
    duration_text: '3 horas',
    base_price_clp: 22000,
    price_usd: 28,
    meeting_point: 'Rotonda La Pirámide (Acceso Saint George)',
    meeting_time: '19:00 hrs',
    difficulty: 'Fácil - Familiar'
  },
  {
    id: 'exp-morado-glaciar',
    title: 'Glaciar El Morado — Laguna & Hielo Milenario',
    category: 'Full Day',
    duration_text: '7 horas',
    base_price_clp: 55000,
    price_usd: 70,
    meeting_point: 'Baños Morales, Cajón del Maipo',
    meeting_time: '07:00 hrs',
    difficulty: 'Exigente'
  },
  {
    id: 'exp-pintor-alta-montana',
    title: 'Cerro Pintor (4.180m) — Bautismo de Alta Montaña',
    category: 'Alta Montaña',
    duration_text: '8 horas',
    base_price_clp: 65000,
    price_usd: 85,
    meeting_point: 'Curva 32 Farellones / La Parva',
    meeting_time: '06:30 hrs',
    difficulty: 'Alta Montaña'
  },
  {
    id: 'exp-cordada-vip-privada',
    title: 'Expedición VIP Privada Cordillera (100% Exclusiva)',
    category: 'Privado VIP',
    duration_text: 'Día Completo a Elección',
    base_price_clp: 165000,
    price_usd: 195,
    meeting_point: 'Coordinación directa / Retiro en Hotel',
    meeting_time: '07:00 hrs',
    difficulty: 'Ajustable al cliente'
  }
];

export const GEAR_PRICES = {
  poles: 4000, // bastones de trekking (par)
  headlamp: 3000, // linterna frontal Petzl
  backpack: 5000 // mochila técnica de montaña
};

export const GUIDES_LIST = [
  'Liderazgo por Gaz (Guía Principal)',
  'Liderazgo de Cordada — Guía de Apoyo WFR',
  'Guía Bilingüe Certificado (Español / Inglés)'
];
