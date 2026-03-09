'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SeatAllocation } from '@/lib/dhondt';
import { getPartyColor } from '@/lib/api';

interface PartyChartProps {
  asignaciones: SeatAllocation[];
}

export default function PartyChart({ asignaciones }: PartyChartProps) {
  const data = asignaciones.map(partido => ({
    name: partido.nombre,
    value: partido.curules,
    votos: partido.votos,
    porcentaje: partido.porcentaje,
    codpar: partido.codpar,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            Curules: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Votos: <span className="font-semibold">{data.votos.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600">
            Porcentaje: <span className="font-semibold">{data.porcentaje}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Distribución de Curules por Partido
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell 
                key={`cell-${entry.codpar}`} 
                fill={getPartyColor(entry.codpar)} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => `${value} (${entry.payload.value})`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
