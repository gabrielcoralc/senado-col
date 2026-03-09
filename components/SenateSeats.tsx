'use client';

import { SeatAllocation } from '@/lib/dhondt';
import { getPartyColor } from '@/lib/api';
import { CandidateData } from '@/lib/types';
import { User } from 'lucide-react';
import { useState } from 'react';

interface SenateSeatsProps {
  asignaciones: SeatAllocation[];
  candidatosPorPartido: Map<string, CandidateData[]>;
}

interface Seat {
  partido: string;
  partidoNombre: string;
  color: string;
  candidato?: CandidateData;
  numero: number;
  x: number;
  y: number;
}

export default function SenateSeats({ asignaciones, candidatosPorPartido }: SenateSeatsProps) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Crear array de asientos
  const seats: Seat[] = [];
  let seatNumber = 1;

  asignaciones.forEach(partido => {
    const candidatos = candidatosPorPartido.get(partido.codpar) || [];
    
    for (let i = 0; i < partido.curules; i++) {
      seats.push({
        partido: partido.codpar,
        partidoNombre: partido.nombre,
        color: getPartyColor(partido.codpar),
        candidato: candidatos[i],
        numero: seatNumber++,
        x: 0,
        y: 0,
      });
    }
  });

  // Calcular posiciones en semicírculo (7 filas concéntricas)
  const totalSeats = seats.length;
  const rows = 7;
  const seatsPerRow = [10, 13, 15, 17, 18, 16, 11]; // Distribución por fila
  const radiusStart = 80;
  const radiusIncrement = 35;

  let seatIndex = 0;
  seatsPerRow.forEach((count, rowIndex) => {
    const radius = radiusStart + rowIndex * radiusIncrement;
    const angleStart = Math.PI; // 180 grados (izquierda)
    const angleEnd = 0; // 0 grados (derecha)
    const angleStep = (angleStart - angleEnd) / (count - 1);

    for (let i = 0; i < count && seatIndex < totalSeats; i++) {
      const angle = angleStart - i * angleStep;
      seats[seatIndex].x = 350 + radius * Math.cos(angle);
      seats[seatIndex].y = 320 - radius * Math.sin(angle);
      seatIndex++;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Así está compuesto el Senado de Colombia (2026-2030)
        </h2>
        <p className="text-lg text-gray-600">
          {totalSeats} Curules
        </p>
      </div>

      {/* Hemiciclo SVG */}
      <div className="flex justify-center mb-6">
        <svg width="700" height="400" viewBox="0 0 700 400" className="max-w-full h-auto">
          {/* Dibujamos cada asiento */}
          {seats.map((seat) => (
            <g key={seat.numero}>
              <circle
                cx={seat.x}
                cy={seat.y}
                r="12"
                fill={seat.color}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:r-[14] hover:stroke-[3]"
                onClick={() => setSelectedSeat(seat)}
                style={{ filter: selectedSeat?.numero === seat.numero ? 'brightness(1.3)' : 'none' }}
              />
              <title>{`${seat.partidoNombre} - Curul ${seat.numero}`}</title>
            </g>
          ))}
          
          {/* Número total en el centro */}
          <text
            x="350"
            y="300"
            textAnchor="middle"
            fontSize="48"
            fontWeight="bold"
            fill="#1f2937"
          >
            {totalSeats}
          </text>
          <text
            x="350"
            y="330"
            textAnchor="middle"
            fontSize="16"
            fill="#6b7280"
          >
            Curules
          </text>
        </svg>
      </div>

      {selectedSeat && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
              style={{ backgroundColor: selectedSeat.color }}
            >
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Curul #{selectedSeat.numero}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: selectedSeat.color }}
                >
                  {selectedSeat.partidoNombre}
                </span>
              </div>
              
              {selectedSeat.candidato ? (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    {selectedSeat.candidato.nomcan} {selectedSeat.candidato.apecan}
                    {selectedSeat.candidato.nomcan2 && ` ${selectedSeat.candidato.nomcan2}`}
                    {selectedSeat.candidato.apecan2 && ` ${selectedSeat.candidato.apecan2}`}
                  </h4>
                  {selectedSeat.candidato.cedula && (
                    <p className="text-sm text-gray-600 mb-2">
                      Cédula: {selectedSeat.candidato.cedula}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-xs text-gray-500">Votos Obtenidos</p>
                      <p className="text-lg font-bold text-gray-900">
                        {parseInt(selectedSeat.candidato.vot).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-xs text-gray-500">Porcentaje</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedSeat.candidato.pvot}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    VOTO POR LISTA
                  </h4>
                  <p className="text-sm text-gray-600">
                    Esta curul fue asignada por voto de lista cerrada. El candidato específico será 
                    determinado por el orden de la lista del partido.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leyenda de partidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {asignaciones.map(partido => (
          <div
            key={partido.codpar}
            className="flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:shadow-md"
            style={{ borderColor: getPartyColor(partido.codpar) }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md"
                style={{ backgroundColor: getPartyColor(partido.codpar) }}
              >
                {partido.curules}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 leading-tight">
                  {partido.nombre}
                </p>
                <p className="text-xs text-gray-500">
                  {partido.votos.toLocaleString()} votos
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: getPartyColor(partido.codpar) }}>
                {partido.porcentaje}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
