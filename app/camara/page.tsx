'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Info, BarChart2, MapPin } from 'lucide-react';
import { fetchCamaraData, getCamaraPartyName } from '@/lib/api';
import { aplicarMetodoDHondt } from '@/lib/dhondt';
import { ElectionData } from '@/lib/types';
import ElectionStats from '@/components/ElectionStats';
import SeatsTable from '@/components/SeatsTable';
import CamaraSeats from '@/components/CamaraSeats';
import CamaraPartiesPanel from '@/components/CamaraPartiesPanel';
import CamaraDeptPanel from '@/components/CamaraDeptPanel';

type ActiveTab = 'nacional' | 'departamento';

const TOTAL_CURULES_CAMARA = 188;

export default function CamaraPage() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('nacional');

  const loadData = async () => {
    try {
      setError(null);
      const electionData = await fetchCamaraData();
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-16 w-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Cargando resultados de la Cámara...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
    nombre: getCamaraPartyName(p.act.codpar),
    vot: parseInt(p.act.vot),
    pvot: p.act.pvot,
  }));

  const votosValidos = parseInt(totales.votval);
  const todasAsignaciones = aplicarMetodoDHondt(partidos, TOTAL_CURULES_CAMARA, votosValidos, false);
  const asignaciones = todasAsignaciones.filter(a => a.curules > 0);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🇨🇴 Cámara de Representantes Colombia 2026
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
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
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
              <li>La Cámara tiene <strong>188 curules</strong>: 165 territoriales + 23 especiales (afro, indígenas, exterior, paz)</li>
              <li>El cálculo de curules usa el <strong>Método D&apos;Hondt</strong> por <strong>circunscripción departamental</strong> sin umbral</li>
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

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-sm p-1.5 border border-gray-200">
          <button
            onClick={() => setActiveTab('nacional')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'nacional'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            Proyección Nacional
          </button>
          <button
            onClick={() => setActiveTab('departamento')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'departamento'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Por Departamento
          </button>
        </div>

        {activeTab === 'nacional' && (
          <>
            <div className="mb-6">
              <CamaraSeats
                asignaciones={asignaciones}
                candidatosPorPartido={new Map()}
              />
            </div>

            <div className="mb-6">
              <SeatsTable
                asignaciones={asignaciones}
                cifraRepartidora={asignaciones[0]?.cifraRepartidora || 0}
                totalCurules={TOTAL_CURULES_CAMARA}
                titulo="Proyección de Curules de la Cámara de Representantes"
                descripcion={`Cálculo según Método D'Hondt — ${TOTAL_CURULES_CAMARA} curules (proyección nacional)`}
              />
            </div>

            <div className="mb-6">
              <CamaraPartiesPanel asignaciones={asignaciones} />
            </div>
          </>
        )}

        {activeTab === 'departamento' && (
          <div className="mb-6">
            <CamaraDeptPanel />
          </div>
        )}

        <footer className="text-center text-sm text-gray-600 mt-8 pb-4">
          <p>
            Datos proporcionados por la Registraduría Nacional del Estado Civil de Colombia
          </p>
          <p className="mt-1">
            La asignación oficial de curules se realiza por circunscripción departamental mediante el Método D&apos;Hondt.
          </p>
        </footer>
      </div>
    </div>
  );
}
