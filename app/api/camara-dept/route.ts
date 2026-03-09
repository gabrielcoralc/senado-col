import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dept = searchParams.get('dept');

  if (!dept) {
    return NextResponse.json({ error: 'Missing dept parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://resultados.registraduria.gov.co/json/ACT/CA/${dept}.json`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error(`Error fetching camara dept data for ${dept}:`, error);
    return NextResponse.json(
      {
        error: 'Failed to fetch camara department data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
