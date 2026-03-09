'use client';

import { useState } from 'react';
import { SeatAllocation } from '@/lib/dhondt';
import { getPartyColor } from '@/lib/api';
import { ExternalLink, Users, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface CamaraPartiesPanelProps {
  asignaciones: SeatAllocation[];
}

const VISIBLE_LIMIT = 5;

export default function CamaraPartiesPanel({ asignaciones }: CamaraPartiesPanelProps) {
  const [selectedParty, setSelectedParty] = useState<string>(asignaciones[0]?.codpar || '');
  const [showAll, setShowAll] = useState(false);

  const conCurules = asignaciones.filter(a => a.curules > 0);
  const selected = conCurules.find(a => a.codpar === selectedParty) || conCurules[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Proyección de Curules por Partido
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Selecciona un partido para ver su proyección de curules
          </p>
        </div>
        <a
          href="https://resultados.registraduria.gov.co/resultados/1/00/0/?s=resultados-votes"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Ver por circunscripción
        </a>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Los candidatos específicos se determinan por circunscripción departamental mediante el método D&apos;Hondt.
          Esta proyección nacional indica cuántas curules obtendría cada partido si los votos fueran nacionales.
        </p>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Lista de partidos */}
        <div className="lg:w-64 flex-none">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Partidos con curules
          </p>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:max-h-[520px] lg:overflow-y-auto">
            {conCurules.map(partido => (
              <button
                key={partido.codpar}
                onClick={() => { setSelectedParty(partido.codpar); setShowAll(false); }}
                className={`flex-none lg:flex-auto flex items-center gap-3 p-2.5 rounded-lg border-2 text-left transition-all ${
                  selectedParty === partido.codpar
                    ? 'shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={
                  selectedParty === partido.codpar
                    ? { borderColor: getPartyColor(partido.codpar), backgroundColor: `${getPartyColor(partido.codpar)}10` }
                    : {}
                }
              >
                <div
                  className="w-9 h-9 rounded-lg flex-none flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: getPartyColor(partido.codpar) }}
                >
                  {partido.curules}
                </div>
                <span className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
                  {partido.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle del partido seleccionado */}
        {selected && (
          <div className="flex-1 min-w-0">
            <div
              className="rounded-xl p-5 border-2 mb-4"
              style={{ borderColor: getPartyColor(selected.codpar), backgroundColor: `${getPartyColor(selected.codpar)}08` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                  style={{ backgroundColor: getPartyColor(selected.codpar) }}
                >
                  {selected.curules}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{selected.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selected.votos.toLocaleString()} votos · {selected.porcentaje} del total
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <p className="text-xs text-gray-500 mb-1">Curules proyectadas</p>
                  <p className="text-2xl font-bold" style={{ color: getPartyColor(selected.codpar) }}>
                    {selected.curules}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <p className="text-xs text-gray-500 mb-1">% de votos</p>
                  <p className="text-2xl font-bold text-gray-800">{selected.porcentaje}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <p className="text-xs text-gray-500 mb-1">% de curules</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {((selected.curules / 188) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Placeholder de candidatos */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-500" />
                <h4 className="font-semibold text-gray-700">
                  Candidatos ({selected.curules} curule{selected.curules !== 1 ? 's' : ''} proyectada{selected.curules !== 1 ? 's' : ''})
                </h4>
              </div>

              <div className="space-y-2">
                {Array.from({ length: showAll ? selected.curules : Math.min(VISIBLE_LIMIT, selected.curules) }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-100"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex-none flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: getPartyColor(selected.codpar) }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 italic">
                        Candidato #{i + 1} — determinado por circunscripción departamental
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selected.curules > VISIBLE_LIMIT && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showAll ? (
                    <><ChevronUp className="h-4 w-4" /> Mostrar menos</>
                  ) : (
                    <><ChevronDown className="h-4 w-4" /> Ver {selected.curules - VISIBLE_LIMIT} más</>
                  )}
                </button>
              )}

              <a
                href="https://resultados.registraduria.gov.co/resultados/1/00/0/?s=resultados-votes"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ borderColor: getPartyColor(selected.codpar), color: getPartyColor(selected.codpar) }}
              >
                <ExternalLink className="h-4 w-4" />
                Ver candidatos reales por departamento
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
