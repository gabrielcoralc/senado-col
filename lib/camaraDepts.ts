export interface DeptInfo {
  code: string;
  nombre: string;
  curules: number;
  tipo: 'territorial' | 'especial';
}

export const CAMARA_DEPARTMENTS: DeptInfo[] = [
  { code: '0100', nombre: 'Antioquia', curules: 17, tipo: 'territorial' },
  { code: '0300', nombre: 'Atlántico', curules: 7, tipo: 'territorial' },
  { code: '1600', nombre: 'Bogotá D.C.', curules: 18, tipo: 'territorial' },
  { code: '0500', nombre: 'Bolívar', curules: 6, tipo: 'territorial' },
  { code: '0700', nombre: 'Boyacá', curules: 6, tipo: 'territorial' },
  { code: '0900', nombre: 'Caldas', curules: 5, tipo: 'territorial' },
  { code: '4400', nombre: 'Caquetá', curules: 2, tipo: 'territorial' },
  { code: '1100', nombre: 'Cauca', curules: 4, tipo: 'territorial' },
  { code: '1200', nombre: 'Cesar', curules: 4, tipo: 'territorial' },
  { code: '1300', nombre: 'Córdoba', curules: 5, tipo: 'territorial' },
  { code: '1500', nombre: 'Cundinamarca', curules: 7, tipo: 'territorial' },
  { code: '1700', nombre: 'Chocó', curules: 2, tipo: 'territorial' },
  { code: '1900', nombre: 'Huila', curules: 4, tipo: 'territorial' },
  { code: '4800', nombre: 'La Guajira', curules: 2, tipo: 'territorial' },
  { code: '2100', nombre: 'Magdalena', curules: 5, tipo: 'territorial' },
  { code: '5200', nombre: 'Meta', curules: 3, tipo: 'territorial' },
  { code: '2300', nombre: 'Nariño', curules: 6, tipo: 'territorial' },
  { code: '2500', nombre: 'Norte de Santander', curules: 5, tipo: 'territorial' },
  { code: '2600', nombre: 'Quindío', curules: 3, tipo: 'territorial' },
  { code: '2400', nombre: 'Risaralda', curules: 4, tipo: 'territorial' },
  { code: '2700', nombre: 'Santander', curules: 9, tipo: 'territorial' },
  { code: '2800', nombre: 'Sucre', curules: 3, tipo: 'territorial' },
  { code: '2900', nombre: 'Tolima', curules: 6, tipo: 'territorial' },
  { code: '3100', nombre: 'Valle del Cauca', curules: 13, tipo: 'territorial' },
  { code: '4000', nombre: 'Arauca', curules: 2, tipo: 'territorial' },
  { code: '4600', nombre: 'Casanare', curules: 2, tipo: 'territorial' },
  { code: '6400', nombre: 'Putumayo', curules: 2, tipo: 'territorial' },
  { code: '5600', nombre: 'San Andrés y Providencia', curules: 1, tipo: 'territorial' },
  { code: '6000', nombre: 'Amazonas', curules: 2, tipo: 'territorial' },
  { code: '5000', nombre: 'Guainía', curules: 2, tipo: 'territorial' },
  { code: '5400', nombre: 'Guaviare', curules: 2, tipo: 'territorial' },
  { code: '6800', nombre: 'Vaupés', curules: 2, tipo: 'territorial' },
  { code: '7200', nombre: 'Vichada', curules: 2, tipo: 'territorial' },
];

export const TOTAL_CURULES_TERRITORIAL = CAMARA_DEPARTMENTS.reduce(
  (sum, d) => sum + d.curules,
  0
);

export function getDeptByCode(code: string): DeptInfo | undefined {
  return CAMARA_DEPARTMENTS.find(d => d.code === code);
}
