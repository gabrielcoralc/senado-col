export interface PartyVotes {
  codpar: string;
  nombre: string;
  vot: number;
  pvot: string;
}

export interface SeatAllocation {
  codpar: string;
  nombre: string;
  votos: number;
  porcentaje: string;
  curules: number;
  cifraRepartidora?: number;
}

export function calcularUmbral(votosValidos: number): number {
  return Math.ceil(votosValidos * 0.03);
}

export function aplicarMetodoDHondt(
  partidos: PartyVotes[],
  curulesDisponibles: number,
  votosValidos: number,
  useThreshold: boolean = true
): SeatAllocation[] {
  const umbral = useThreshold ? calcularUmbral(votosValidos) : 0;
  
  const partidosElegibles = partidos.filter(p => p.vot >= umbral);
  
  if (partidosElegibles.length === 0) {
    return [];
  }
  
  const asignaciones: Map<string, number> = new Map();
  partidosElegibles.forEach(p => asignaciones.set(p.codpar, 0));
  
  const cocientes: Array<{ codpar: string; cociente: number; divisor: number }> = [];
  
  for (let i = 0; i < curulesDisponibles; i++) {
    let maxCociente = 0;
    let partidoGanador = '';
    let divisorGanador = 0;
    
    for (const partido of partidosElegibles) {
      const curulesActuales = asignaciones.get(partido.codpar) || 0;
      const divisor = curulesActuales + 1;
      const cociente = partido.vot / divisor;
      
      if (cociente > maxCociente) {
        maxCociente = cociente;
        partidoGanador = partido.codpar;
        divisorGanador = divisor;
      }
    }
    
    if (partidoGanador) {
      asignaciones.set(partidoGanador, (asignaciones.get(partidoGanador) || 0) + 1);
      cocientes.push({ codpar: partidoGanador, cociente: maxCociente, divisor: divisorGanador });
    }
  }
  
  const cifraRepartidora = cocientes.length > 0 ? Math.min(...cocientes.map(c => c.cociente)) : 0;
  
  const resultados: SeatAllocation[] = partidosElegibles.map(partido => ({
    codpar: partido.codpar,
    nombre: partido.nombre,
    votos: partido.vot,
    porcentaje: partido.pvot,
    curules: asignaciones.get(partido.codpar) || 0,
    cifraRepartidora: cifraRepartidora
  }));
  
  resultados.sort((a, b) => b.curules - a.curules || b.votos - a.votos);
  
  return resultados;
}
