'use client';

import { SeatAllocation } from '@/lib/dhondt';
import { getPartyColor } from '@/lib/api';
import { Trophy } from 'lucide-react';

interface SeatsTableProps {
  asignaciones: SeatAllocation[];
  cifraRepartidora: number;
}

export default function SeatsTable({ asignaciones, cifraRepartidora }: SeatsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Proyección de Curules del Senado
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          Cálculo según Método D&apos;Hondt - 100 curules disponibles (Circunscripción Nacional)
        </p>
      </div>

      <div className="p-6">
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Cifra Repartidora:</span> {Math.floor(cifraRepartidora).toLocaleString()} votos
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Esta es la cantidad aproximada de votos necesarios para obtener una curul
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partido
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Votos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  %
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curules
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distribución
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {asignaciones.map((partido, index) => {
                const color = getPartyColor(partido.codpar);
                return (
                  <tr 
                    key={partido.codpar}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="h-4 w-4 rounded-full mr-3"
                          style={{ backgroundColor: color }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {partido.nombre}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {partido.votos.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {partido.porcentaje}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {partido.curules}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {Array.from({ length: partido.curules }).map((_, i) => (
                          <div
                            key={i}
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: color }}
                            title={`Curul ${i + 1}`}
                          ></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Total Curules Asignadas:
                </td>
                <td className="px-6 py-3 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-600 text-white">
                    {asignaciones.reduce((sum, p) => sum + p.curules, 0)} / 100
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
