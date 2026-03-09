'use client';

import { SeatAllocation } from '@/lib/dhondt';
import { getPartyColor } from '@/lib/api';
import { CandidateData } from '@/lib/types';
import { Users, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CandidatesPanelProps {
  asignaciones: SeatAllocation[];
  candidatosPorPartido: Map<string, CandidateData[]>;
}

export default function CandidatesPanel({ asignaciones, candidatosPorPartido }: CandidatesPanelProps) {
  const partidosConCurules = asignaciones.filter(p => p.curules > 0);
  const [selectedCodpar, setSelectedCodpar] = useState<string>(
    partidosConCurules[0]?.codpar || ''
  );

  const selectedPartido = partidosConCurules.find(p => p.codpar === selectedCodpar);
  const color = selectedPartido ? getPartyColor(selectedPartido.codpar) : '#95A5A6';

  const curules = selectedPartido?.curules || 0;
  const todosLosCandidatos = selectedCodpar
    ? (candidatosPorPartido.get(selectedCodpar) || [])
    : [];
  const candidatosConCurul = todosLosCandidatos.slice(0, curules);
  const candidatosSinCurul = todosLosCandidatos.slice(curules);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-6 w-6" />
          Candidatos por Partido
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          Los candidatos en color ocupan curul · Los grises no alcanzaron
        </p>
      </div>

      <div className="p-6">
        {/* Selector de partido */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seleccionar partido
          </label>
          <div className="relative">
            <select
              value={selectedCodpar}
              onChange={(e) => setSelectedCodpar(e.target.value)}
              className="w-full appearance-none border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-900 font-medium bg-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              style={{ borderColor: selectedCodpar ? color : undefined }}
            >
              {partidosConCurules.map(partido => (
                <option key={partido.codpar} value={partido.codpar}>
                  {partido.nombre} — {partido.curules} curul{partido.curules !== 1 ? 'es' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Resumen del partido seleccionado */}
        {selectedPartido && (
          <div
            className="rounded-lg p-4 mb-6 flex items-center justify-between"
            style={{ backgroundColor: color + '15', borderLeft: `4px solid ${color}` }}
          >
            <div>
              <p className="font-bold text-gray-900">{selectedPartido.nombre}</p>
              <p className="text-sm text-gray-600">
                {selectedPartido.votos.toLocaleString()} votos · {selectedPartido.porcentaje}
              </p>
            </div>
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-md"
              style={{ backgroundColor: color }}
            >
              {selectedPartido.curules}
            </div>
          </div>
        )}

        {/* Listado de candidatos */}
        {todosLosCandidatos.length > 0 ? (
          <div className="space-y-2">
            {/* Candidatos CON curul */}
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color }}>
              Entran a curul ({candidatosConCurul.length})
            </p>
            {candidatosConCurul.map((candidato: CandidateData, index: number) => {
              const nombreCompleto = [candidato.nomcan, candidato.apecan, candidato.nomcan2, candidato.apecan2]
                .filter(Boolean).join(' ');
              const votos = parseInt(candidato.vot);
              const posicion = parseInt(candidato.codcan);
              return (
                <div
                  key={candidato.codcan}
                  className="flex items-center gap-4 p-3 rounded-lg border transition-all hover:shadow-sm"
                  style={{ borderColor: color + '40', backgroundColor: color + '0D' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{nombreCompleto}</p>
                    <p className="text-xs text-gray-500">
                      Cédula: {candidato.cedula}
                      {posicion > 0 && ` · Puesto en lista: #${posicion}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {votos > 0 ? (
                      <>
                        <p className="text-sm font-bold text-gray-900">{votos.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">votos</p>
                      </>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: color + '20', color }}>
                        Lista cerrada
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Candidatos SIN curul */}
            {candidatosSinCurul.length > 0 && (
              <>
                <div className="flex items-center gap-3 pt-4 pb-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    No alcanzan curul ({candidatosSinCurul.length})
                  </p>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                {candidatosSinCurul.map((candidato: CandidateData, index: number) => {
                  const nombreCompleto = [candidato.nomcan, candidato.apecan, candidato.nomcan2, candidato.apecan2]
                    .filter(Boolean).join(' ');
                  const votos = parseInt(candidato.vot);
                  const posicion = parseInt(candidato.codcan);
                  return (
                    <div
                      key={candidato.codcan}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50 opacity-60"
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold flex-shrink-0 bg-gray-200">
                        {curules + index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-500 truncate">{nombreCompleto}</p>
                        <p className="text-xs text-gray-400">
                          Cédula: {candidato.cedula}
                          {posicion > 0 && ` · Puesto en lista: #${posicion}`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {votos > 0 ? (
                          <>
                            <p className="text-sm font-semibold text-gray-400">{votos.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">votos</p>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                            Lista cerrada
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No hay datos de candidatos disponibles para este partido</p>
          </div>
        )}

        {/* Botones de selección rápida */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Partidos con curules
          </p>
          <div className="flex flex-wrap gap-2">
            {partidosConCurules.map(partido => (
              <button
                key={partido.codpar}
                onClick={() => setSelectedCodpar(partido.codpar)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2"
                style={{
                  backgroundColor:
                    selectedCodpar === partido.codpar
                      ? getPartyColor(partido.codpar)
                      : 'transparent',
                  borderColor: getPartyColor(partido.codpar),
                  color:
                    selectedCodpar === partido.codpar
                      ? 'white'
                      : getPartyColor(partido.codpar),
                }}
              >
                <span>{partido.curules}</span>
                <span className="max-w-[120px] truncate">{partido.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
