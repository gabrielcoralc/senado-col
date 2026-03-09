'use client';

import { SeatAllocation } from '@/lib/dhondt';
import { getPartyColor } from '@/lib/api';
import { CandidateData } from '@/lib/types';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

interface CamaraSeatsProps {
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

export default function CamaraSeats({ asignaciones, candidatosPorPartido }: CamaraSeatsProps) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction === 'right' ? 320 : -320, behavior: 'smooth' });
    }
  };

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

  // 8 rows for 188 seats: [16, 20, 24, 27, 28, 28, 25, 20] = 188
  const totalSeats = seats.length;
  const seatsPerRow = [16, 20, 24, 27, 28, 28, 25, 20];
  const radiusStart = 80;
  const radiusIncrement = 30;

  let seatIndex = 0;
  seatsPerRow.forEach((count, rowIndex) => {
    const radius = radiusStart + rowIndex * radiusIncrement;
    const angleStart = Math.PI;
    const angleEnd = 0;
    const angleStep = (angleStart - angleEnd) / (count - 1);

    for (let i = 0; i < count && seatIndex < totalSeats; i++) {
      const angle = angleStart - i * angleStep;
      seats[seatIndex].x = 400 + radius * Math.cos(angle);
      seats[seatIndex].y = 390 - radius * Math.sin(angle);
      seatIndex++;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Así está compuesta la Cámara de Representantes (2026-2030)
        </h2>
        <p className="text-lg text-gray-600">
          {totalSeats} Curules proyectadas — Circunscripciones Territoriales
        </p>
      </div>

      {/* Hemiciclo SVG */}
      <div className="flex justify-center mb-6">
        <svg width="800" height="430" viewBox="0 0 800 430" className="max-w-full h-auto">
          {seats.map((seat) => (
            <g key={seat.numero}>
              <circle
                cx={seat.x}
                cy={seat.y}
                r="9"
                fill={seat.color}
                stroke="white"
                strokeWidth="1.5"
                className="cursor-pointer transition-all"
                onClick={() => setSelectedSeat(seat)}
                style={{ filter: selectedSeat?.numero === seat.numero ? 'brightness(1.3)' : 'none' }}
              />
              <title>{`${seat.partidoNombre} - Curul ${seat.numero}`}</title>
            </g>
          ))}

          {/* Número total en el centro */}
          <text
            x="400"
            y="365"
            textAnchor="middle"
            fontSize="44"
            fontWeight="bold"
            fill="#1f2937"
          >
            {totalSeats}
          </text>
          <text
            x="400"
            y="390"
            textAnchor="middle"
            fontSize="14"
            fill="#6b7280"
          >
            Curules
          </text>
        </svg>
      </div>

      {selectedSeat && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200 mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg"
              style={{ backgroundColor: selectedSeat.color }}
            >
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
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
                    PROYECCIÓN POR VOTOS DE LISTA
                  </h4>
                  <p className="text-sm text-gray-600">
                    La asignación real de esta curul depende del cálculo por circunscripción departamental.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leyenda de partidos — Slider horizontal */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Distribución por partido ({asignaciones.length} partidos con curules)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => scrollSlider('left')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto pb-3 scroll-smooth"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
        >
          {asignaciones.map(partido => (
            <div
              key={partido.codpar}
              className="flex-none w-52 flex flex-col p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer"
              style={{ borderColor: getPartyColor(partido.codpar) }}
              onClick={() => {
                const first = seats.find(s => s.partido === partido.codpar);
                if (first) setSelectedSeat(first);
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex-none flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: getPartyColor(partido.codpar) }}
                >
                  {partido.curules}
                </div>
                <p className="font-semibold text-xs text-gray-900 leading-tight line-clamp-2">
                  {partido.nombre}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {partido.votos.toLocaleString()} votos
                </p>
                <p className="text-sm font-bold" style={{ color: getPartyColor(partido.codpar) }}>
                  {partido.porcentaje}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges hint */}
        <div className="pointer-events-none absolute right-0 top-8 bottom-3 w-12 bg-gradient-to-l from-white to-transparent rounded-r-lg" />
      </div>
    </div>
  );
}
