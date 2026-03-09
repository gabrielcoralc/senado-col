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

export function getPartyName(codpar: string): string {
  const partyNames: Record<string, string> = {
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

  return partyNames[codpar] || `Partido ${codpar}`;
}

export function getPartyColor(codpar: string): string {
  const partyColors: Record<string, string> = {
    '92': '#E91E63',      // Pacto Histórico - Rosa/Fucsia
    '10': '#2196F3',      // Centro Democrático - Azul
    '2': '#F44336',       // Liberal - Rojo
    '57': '#8BC34A',      // Alianza por Colombia - Verde claro
    '3': '#4CAF50',       // Conservador - Verde
    '9': '#FF9800',       // Partido de la U - Naranja
    '44': '#00BCD4',      // Coalición Cambio Radical - Alma - Cyan
    '43': '#FFEB3B',      // Ahora Colombia - Amarillo
    '17': '#673AB7',      // Salvación Nacional - Púrpura
    '55': '#3F51B5',      // Frente Amplio - Indigo
    '39': '#009688',      // Creemos - Teal
    '170': '#795548',     // Fuerza Ciudadana - Marrón
    '40': '#9E9E9E',      // La Lista de Oviedo - Gris
    '18': '#607D8B',      // Oxígeno - Gris azulado
    '34': '#455A64',      // Colombia Segura - Gris oscuro
    '33': '#37474F',      // Patriotas - Gris muy oscuro
  };

  return partyColors[codpar] || '#95A5A6';
}
