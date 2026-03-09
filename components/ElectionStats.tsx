'use client';

import { Users, FileText, CheckCircle2, XCircle } from 'lucide-react';

interface ElectionStatsProps {
  mesasInformadas: number;
  mesasTotales: number;
  porcentajeMesas: string;
  votantes: number;
  porcentajeVotantes: string;
  votosValidos: number;
  votosNulos: number;
  votosBlancos: number;
}

export default function ElectionStats({
  mesasInformadas,
  mesasTotales,
  porcentajeMesas,
  votantes,
  porcentajeVotantes,
  votosValidos,
  votosNulos,
  votosBlancos,
}: ElectionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Mesas Informadas</p>
            <p className="text-3xl font-bold text-gray-900">
              {porcentajeMesas}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {mesasInformadas.toLocaleString()} / {mesasTotales.toLocaleString()}
            </p>
          </div>
          <FileText className="h-12 w-12 text-blue-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Participación</p>
            <p className="text-3xl font-bold text-gray-900">
              {porcentajeVotantes}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {votantes.toLocaleString()} votantes
            </p>
          </div>
          <Users className="h-12 w-12 text-green-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Votos Válidos</p>
            <p className="text-3xl font-bold text-gray-900">
              {votosValidos.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Partidos y candidatos
            </p>
          </div>
          <CheckCircle2 className="h-12 w-12 text-emerald-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Votos Nulos/Blancos</p>
            <p className="text-3xl font-bold text-gray-900">
              {(votosNulos + votosBlancos).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {votosNulos.toLocaleString()} nulos / {votosBlancos.toLocaleString()} blancos
            </p>
          </div>
          <XCircle className="h-12 w-12 text-red-500 opacity-80" />
        </div>
      </div>
    </div>
  );
}
