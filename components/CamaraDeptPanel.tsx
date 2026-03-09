'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, RefreshCw, Users, ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';
import { CAMARA_DEPARTMENTS, DeptInfo } from '@/lib/camaraDepts';
import { getCamaraPartyName, getPartyColor } from '@/lib/api';
import { aplicarMetodoDHondt, SeatAllocation } from '@/lib/dhondt';
import { ElectionData, CandidateData } from '@/lib/types';

interface PartyWithCandidates extends SeatAllocation {
  candidates: CandidateData[];
}

const VISIBLE_LIMIT = 5;

function CandidateRow({
  candidate,
  position,
  elected,
  partyColor,
}: {
  candidate: CandidateData;
  position: number;
  elected: boolean;
  partyColor: string;
}) {
  const fullName = [candidate.nomcan, candidate.nomcan2, candidate.apecan, candidate.apecan2]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
        elected
          ? 'bg-white border-gray-200 shadow-sm'
          : 'bg-gray-50 border-gray-100 opacity-60'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex-none flex items-center justify-center text-xs font-bold ${
          elected ? 'text-white' : 'text-gray-400 bg-gray-200'
        }`}
        style={elected ? { backgroundColor: partyColor } : {}}
      >
        {position}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${elected ? 'text-gray-900' : 'text-gray-400'}`}>
          {fullName || `Candidato ${candidate.codcan}`}
        </p>
        <p className="text-xs text-gray-500">
          {parseInt(candidate.vot).toLocaleString('es-CO')} votos · {candidate.pvot}
        </p>
      </div>
      {elected && (
        <span
          className="flex-none text-xs font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: partyColor }}
        >
          Electo
        </span>
      )}
    </div>
  );
}

function PartyCard({
  party,
  totalCurules,
}: {
  party: PartyWithCandidates;
  totalCurules: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = getPartyColor(party.codpar);
  const showToggle = party.candidates.length > VISIBLE_LIMIT;
  const visibleCandidates = expanded ? party.candidates : party.candidates.slice(0, VISIBLE_LIMIT);

  return (
    <div
      className="rounded-xl border-2 overflow-hidden"
      style={{ borderColor: color }}
    >
      <div
        className="p-4 flex items-center gap-4"
        style={{ backgroundColor: `${color}10` }}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md flex-none"
          style={{ backgroundColor: color }}
        >
          {party.curules}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 leading-tight">{party.nombre}</h4>
          <p className="text-sm text-gray-500 mt-0.5">
            {party.votos.toLocaleString('es-CO')} votos · {party.porcentaje}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {((party.curules / totalCurules) * 100).toFixed(1)}% de las curules del dpto.
          </p>
        </div>
      </div>

      {party.candidates.length > 0 ? (
        <div className="p-3 bg-white space-y-1.5">
          {visibleCandidates.map((c, i) => (
            <CandidateRow
              key={c.codcan}
              candidate={c}
              position={i + 1}
              elected={i < party.curules}
              partyColor={color}
            />
          ))}
          {showToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="h-3.5 w-3.5" /> Mostrar menos</>
              ) : (
                <><ChevronDown className="h-3.5 w-3.5" /> Ver {party.candidates.length - VISIBLE_LIMIT} candidatos más</>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="p-3 bg-white">
          <p className="text-xs text-gray-400 italic text-center py-2">
            Sin datos de candidatos disponibles aún
          </p>
        </div>
      )}
    </div>
  );
}

export default function CamaraDeptPanel() {
  const [selectedDept, setSelectedDept] = useState<DeptInfo>(CAMARA_DEPARTMENTS[0]);
  const [deptData, setDeptData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PartyWithCandidates[]>([]);
  const [deptMesas, setDeptMesas] = useState<{ mesesc: string; metota: string; pmesesc: string } | null>(null);

  const loadDeptData = useCallback(async (dept: DeptInfo) => {
    setLoading(true);
    setError(null);
    setDeptData(null);
    setResults([]);

    try {
      const res = await fetch(`/api/camara-dept?dept=${dept.code}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status} al cargar datos del departamento`);
      }

      const data: ElectionData = await res.json();
      setDeptData(data);

      const camera = data.camaras[0];
      if (!camera) throw new Error('Estructura de datos inesperada');

      const votosValidos = parseInt(camera.totales.act.votval);

      const partidos = camera.partotabla.map(p => ({
        codpar: p.act.codpar,
        nombre: getCamaraPartyName(p.act.codpar),
        vot: parseInt(p.act.vot),
        pvot: p.act.pvot,
      }));

      const asignaciones = aplicarMetodoDHondt(partidos, dept.curules, votosValidos, false);

      const conCurules: PartyWithCandidates[] = asignaciones
        .filter(a => a.curules > 0)
        .map(a => {
          const partyRaw = camera.partotabla.find(p => p.act.codpar === a.codpar);
          const candidates: CandidateData[] = partyRaw?.act.cantotabla ?? [];
          const sorted = [...candidates].sort((x, y) => parseInt(y.vot) - parseInt(x.vot));
          return { ...a, candidates: sorted };
        });

      setResults(conCurules);

      if (data.totales?.act) {
        setDeptMesas({
          mesesc: data.totales.act.mesesc,
          metota: data.totales.act.metota,
          pmesesc: data.totales.act.pmesesc,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeptData(selectedDept);
  }, [selectedDept, loadDeptData]);

  const totalCurulesCalc = results.reduce((s, r) => s + r.curules, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-green-600" />
            Curules por Departamento
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            D&apos;Hondt por circunscripción — candidatos proyectados por partido
          </p>
        </div>
        <button
          onClick={() => loadDeptData(selectedDept)}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Department selector */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Seleccionar Departamento
        </label>
        <div className="flex flex-wrap gap-2">
          {CAMARA_DEPARTMENTS.map(dept => (
            <button
              key={dept.code}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${
                selectedDept.code === dept.code
                  ? 'bg-green-600 border-green-600 text-white shadow-md'
                  : 'border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-700'
              }`}
            >
              {dept.nombre}
              <span className="ml-1 opacity-70">({dept.curules})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Department header info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-green-900">{selectedDept.nombre}</h3>
          <p className="text-sm text-green-700">
            {selectedDept.curules} curul{selectedDept.curules !== 1 ? 'es' : ''} en disputa · Circunscripción territorial
          </p>
          {deptMesas && (
            <p className="text-xs text-green-600 mt-1">
              Mesas reportadas: {deptMesas.pmesesc} ({parseInt(deptMesas.mesesc).toLocaleString('es-CO')} / {parseInt(deptMesas.metota).toLocaleString('es-CO')})
            </p>
          )}
        </div>
        {results.length > 0 && (
          <div className="flex gap-3 text-center">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Partidos con curules</p>
              <p className="text-xl font-bold text-green-700">{results.length}</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Curules asignadas</p>
              <p className="text-xl font-bold text-green-700">{totalCurulesCalc} / {selectedDept.curules}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <RefreshCw className="h-10 w-10 text-green-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Cargando datos de {selectedDept.nombre}...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-red-500 flex-none" />
          <div>
            <p className="text-sm font-semibold text-red-800">Error al cargar datos</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && results.length === 0 && deptData && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <Info className="h-5 w-5 text-yellow-500 flex-none" />
          <p className="text-sm text-yellow-800">No hay datos de votos suficientes para calcular la proyección en este departamento.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">
              Partidos con representación proyectada en {selectedDept.nombre}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(party => (
              <PartyCard
                key={party.codpar}
                party={party}
                totalCurules={selectedDept.curules}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400 text-center">
            * Proyección basada en votos al momento de la consulta. Los candidatos se ordenan por votos obtenidos; los primeros N (según curules D&apos;Hondt) son los proyectados a ganar curul.
          </p>
        </>
      )}
    </div>
  );
}
