'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Info } from 'lucide-react';
import { fetchElectionData } from '@/lib/api';
import { aplicarMetodoDHondt } from '@/lib/dhondt';
import { ElectionData } from '@/lib/types';
import { getPartyName } from '@/lib/api';
import ElectionStats from '@/components/ElectionStats';
import SeatsTable from '@/components/SeatsTable';
import SenateSeats from '@/components/SenateSeats';
import CandidatesPanel from '@/components/CandidatesPanel';

export default function Home() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = async () => {
    try {
      setError(null);
      const electionData = await fetchElectionData();
      setData(electionData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Error al cargar datos
          </h2>
          <p className="text-gray-600 text-center mb-4">
            {error || 'No se pudieron obtener los datos de las elecciones'}
          </p>
          <button
            onClick={loadData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const camera = data.camaras[0];
  const totales = camera.totales.act;
  
  const partidos = camera.partotabla.map(p => ({
    codpar: p.act.codpar,
    nombre: getPartyName(p.act.codpar),
    vot: parseInt(p.act.vot),
    pvot: p.act.pvot,
  }));

  const votosValidos = parseInt(totales.votval);
  const asignaciones = aplicarMetodoDHondt(partidos, 100, votosValidos);

  const candidatosPorPartido = new Map();
  camera.partotabla.forEach(p => {
    if (p.act.cantotabla && p.act.cantotabla.length > 0) {
      const candidatos = p.act.cantotabla
        .filter(c => c.codcan !== '0')
        .sort((a, b) => parseInt(b.vot) - parseInt(a.vot));
      candidatosPorPartido.set(p.act.codpar, candidatos);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🇨🇴 Elecciones Senado Colombia 2026
              </h1>
              <p className="text-gray-600">
                Resultados en tiempo real con proyección de curules
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
              <div className="text-sm text-gray-600">
                Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    autoRefresh
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {autoRefresh ? 'Auto-actualización: ON' : 'Auto-actualización: OFF'}
                </button>
                <button
                  onClick={loadData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Información importante:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Los datos se actualizan cada 60 segundos automáticamente</li>
              <li>El cálculo de curules usa el <strong>Método D&apos;Hondt</strong> con umbral del 3%</li>
              <li>Solo partidos que superen el umbral participan en la asignación</li>
              <li>Actualmente {data.totales.act.pmesesc} de mesas reportadas</li>
            </ul>
          </div>
        </div>

        <ElectionStats
          mesasInformadas={parseInt(data.totales.act.mesesc)}
          mesasTotales={parseInt(data.totales.act.metota)}
          porcentajeMesas={data.totales.act.pmesesc}
          votantes={parseInt(totales.votant)}
          porcentajeVotantes={totales.pvotant}
          votosValidos={parseInt(totales.votval)}
          votosNulos={parseInt(totales.votnul)}
          votosBlancos={parseInt(totales.votbla)}
        />

        <div className="mb-6">
          <SenateSeats 
            asignaciones={asignaciones}
            candidatosPorPartido={candidatosPorPartido}
          />
        </div>

        <div className="mb-6">
          <SeatsTable
            asignaciones={asignaciones}
            cifraRepartidora={asignaciones[0]?.cifraRepartidora || 0}
          />
        </div>

        <div className="mb-6">
          <CandidatesPanel
            asignaciones={asignaciones}
            candidatosPorPartido={candidatosPorPartido}
          />
        </div>

        <footer className="text-center text-sm text-gray-600 mt-8 pb-4">
          <p>
            Datos proporcionados por la Registraduría Nacional del Estado Civil de Colombia
          </p>
          <p className="mt-1">
            El cálculo de curules es una proyección basada en el conteo actual
          </p>
        </footer>
      </div>
    </div>
  );
}
