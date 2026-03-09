import { ElectionData } from './types';

export async function fetchElectionData(): Promise<ElectionData> {
  const response = await fetch('/api/election-data', {
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching election data: ${response.status}`);
  }

  return response.json();
}

export async function fetchCamaraData(): Promise<ElectionData> {
  const response = await fetch('/api/camara-data', {
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error fetching camara data: ${response.status}`);
  }

  return response.json();
}

const SENADO_PARTY_NAMES: Record<string, string> = {
  '92': 'PACTO HISTÓRICO SENADO',
  '10': 'PARTIDO CENTRO DEMOCRÁTICO',
  '2': 'PARTIDO LIBERAL COLOMBIANO',
  '57': 'ALIANZA POR COLOMBIA',
  '3': 'PARTIDO CONSERVADOR COLOMBIANO',
  '9': 'PARTIDO DE LA UNIÓN POR LA GENTE - PARTIDO DE LA U',
  '44': 'COALICIÓN CAMBIO RADICAL - ALMA',
  '43': 'AHORA COLOMBIA',
  '17': 'MOVIMIENTO SALVACIÓN NACIONAL',
  '55': 'FRENTE AMPLIO UNITARIO',
  '39': 'CREEMOS',
  '170': 'COALICIÓN FUERZA CIUDADANA',
  '40': 'LA LISTA DE OVIEDO - CON TODA POR COLOMBIA',
  '18': 'PARTIDO POLÍTICO OXÍGENO',
  '34': 'COLOMBIA SEGURA Y PRÓSPERA',
  '33': 'PATRIOTAS',
};

const CAMARA_PARTY_NAMES: Record<string, string> = {
  '10': 'PARTIDO CENTRO DEMOCRÁTICO',
  '2': 'PARTIDO LIBERAL COLOMBIANO',
  '3': 'PARTIDO CONSERVADOR COLOMBIANO',
  '9': 'PARTIDO DE LA U',
  '93': 'PACTO HISTÓRICO CÁMARA',
  '4': 'ALIANZA VERDE',
  '5': 'POLO DEMOCRÁTICO ALTERNATIVO',
  '86': 'COMUNES',
  '84': 'COLOMBIA HUMANA - DECENTES',
  '17': 'MOVIMIENTO SALVACIÓN NACIONAL',
  '59': 'COLOMBIA JUSTA LIBRES',
  '91': 'FUERZA DE LA PAZ',
  '38': 'DIGNIDAD Y COMPROMISO',
  '90': 'COALICIÓN ALTERNATIVA CARIBE',
  '58': 'UNIÓN PATRIÓTICA',
  '85': 'COALICIÓN CENTRO ESPERANZA',
  '89': 'COLOMBIA RENACIENTE',
  '81': 'SOMOS REGIÓN',
  '26': 'MOVIMIENTO REGIONAL CIUDADANOS POR COLOMBIA',
  '124': 'LIGA DE GOBERNANTES ANTICORRUPCIÓN',
  '80': 'PARTIDO MIRA',
  '22': 'MOVIMIENTO DE INCLUSIÓN Y OPORTUNIDADES - MIO',
  '16': 'COLOMBIA SOMOS TODOS',
  '78': 'PARTIDO FUERZA CIUDADANA',
  '100': 'ALIANZA DEMOCRÁTICA AMPLIA - ADA',
  '20': 'AFROVIDES',
  '41': 'MOVIMIENTO CIUDADANO - MOCICU',
  '113': 'UNIDAD DEMOCRÁTICA',
  '52': 'PARTIDO REPUBLICANO',
  '87': 'MOVIMIENTO ALTERNATIVO SOCIAL',
  '94': 'MOVIMIENTO SOCIAL INCLUSIVO',
  '27': 'COALICIÓN CIUDADANA REGIONAL',
  '28': 'MOVIMIENTO DE AUTORIDADES INDÍGENAS DE COLOMBIA - AICO',
  '51': 'ALIANZA SOCIAL INDEPENDIENTE - ASI',
  '61': 'OPCIÓN CIUDADANA',
  '71': 'MOVIMIENTO POLÍTICO SOMOS',
  '79': 'MOVIMIENTO SIGNIFICATIVO DE CIUDADANOS',
  '96': 'COALICIÓN REGIONAL PROGRESISTA',
  '103': 'MOVIMIENTO POLÍTICO TODOS SOMOS COLOMBIA',
  '104': 'ALIANZA REGIONAL PROSPERIDAD',
  '112': 'NUEVA FUERZA DEMOCRÁTICA',
  '115': 'MOVIMIENTO COLOMBIA GRANDE',
  '119': 'COALICIÓN SOCIAL COMUNITARIA',
  '123': 'MOVIMIENTO POR EL DESARROLLO REGIONAL',
  '139': 'COALICIÓN POPULAR REGIONAL',
  '142': 'MOVIMIENTO CIUDADANO DEMOCRÁTICO',
  '153': 'UNIÓN SOCIAL REGIONAL',
  '156': 'MOVIMIENTO SOCIAL POR LA PAZ',
  '166': 'COALICIÓN DEMOCRÁTICA PROGRESISTA',
};

const PARTY_COLORS: Record<string, string> = {
  '92': '#E91E63',
  '93': '#E91E63',
  '10': '#2196F3',
  '2': '#F44336',
  '57': '#8BC34A',
  '3': '#4CAF50',
  '9': '#FF9800',
  '44': '#00BCD4',
  '43': '#FFEB3B',
  '17': '#673AB7',
  '55': '#3F51B5',
  '39': '#009688',
  '170': '#795548',
  '40': '#9E9E9E',
  '18': '#607D8B',
  '34': '#455A64',
  '33': '#37474F',
  '4': '#66BB6A',
  '5': '#B71C1C',
  '86': '#FF5722',
  '84': '#E91E63',
  '59': '#1976D2',
  '91': '#388E3C',
  '38': '#F57C00',
  '90': '#7B1FA2',
  '58': '#C62828',
  '85': '#0288D1',
  '89': '#00897B',
  '81': '#558B2F',
  '26': '#6D4C41',
  '124': '#546E7A',
  '80': '#FDD835',
  '22': '#26A69A',
  '16': '#42A5F5',
  '78': '#AB47BC',
  '100': '#26C6DA',
  '20': '#8D6E63',
  '41': '#EF5350',
  '113': '#5C6BC0',
  '52': '#78909C',
  '87': '#D4E157',
};

export function getPartyName(codpar: string): string {
  return SENADO_PARTY_NAMES[codpar] || `Partido ${codpar}`;
}

export function getCamaraPartyName(codpar: string): string {
  return CAMARA_PARTY_NAMES[codpar] || SENADO_PARTY_NAMES[codpar] || `Partido ${codpar}`;
}

export function getPartyColor(codpar: string): string {
  return PARTY_COLORS[codpar] || '#95A5A6';
}
