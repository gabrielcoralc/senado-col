import { NextResponse } from 'next/server';

export async function GET() {
  const tests: Array<{ name: string; status: 'pass' | 'fail'; message: string }> = [];

  // Test 1: Verificar conexión a la API de la Registraduría
  try {
    const response = await fetch(
      'https://resultados.registraduria.gov.co/json/ACT/SE/00.json',
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      tests.push({
        name: 'API Registraduría - Conexión',
        status: 'pass',
        message: `Conectado correctamente. Avance ${data.numact || 'N/A'}`,
      });

      // Test 2: Validar estructura de datos
      if (data.camaras && data.camaras.length > 0) {
        tests.push({
          name: 'API Registraduría - Estructura de datos',
          status: 'pass',
          message: `Datos válidos: ${data.camaras[0].partotabla?.length || 0} partidos encontrados`,
        });

        // Test 3: Validar datos de candidatos
        const partidosConCandidatos = data.camaras[0].partotabla.filter(
          (p: any) => p.act.cantotabla && p.act.cantotabla.length > 1
        );
        tests.push({
          name: 'API Registraduría - Datos de candidatos',
          status: 'pass',
          message: `${partidosConCandidatos.length} partidos con datos de candidatos`,
        });
      } else {
        tests.push({
          name: 'API Registraduría - Estructura de datos',
          status: 'fail',
          message: 'Estructura de datos inválida o vacía',
        });
      }
    } else {
      tests.push({
        name: 'API Registraduría - Conexión',
        status: 'fail',
        message: `Error HTTP ${response.status}`,
      });
    }
  } catch (error) {
    tests.push({
      name: 'API Registraduría - Conexión',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Error desconocido',
    });
  }

  // Test 4: Verificar proxy local
  try {
    const proxyResponse = await fetch('http://localhost:3000/api/election-data', {
      cache: 'no-store',
    });

    if (proxyResponse.ok) {
      tests.push({
        name: 'Proxy API Local',
        status: 'pass',
        message: 'Proxy funcionando correctamente',
      });
    } else {
      tests.push({
        name: 'Proxy API Local',
        status: 'fail',
        message: `Error HTTP ${proxyResponse.status}`,
      });
    }
  } catch (error) {
    tests.push({
      name: 'Proxy API Local',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Error desconocido',
    });
  }

  const totalTests = tests.length;
  const passedTests = tests.filter(t => t.status === 'pass').length;
  const failedTests = tests.filter(t => t.status === 'fail').length;

  return NextResponse.json({
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`,
    },
    tests,
    timestamp: new Date().toISOString(),
  });
}
