'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Users } from 'lucide-react';

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">🇨🇴</span>
            <span className="text-sm font-semibold text-gray-600 hidden sm:block">
              Elecciones Congreso Colombia 2026
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                pathname === '/'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Senado</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                pathname === '/' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
              }`}>
                100
              </span>
            </Link>

            <Link
              href="/camara"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                pathname === '/camara'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Cámara</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                pathname === '/camara' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              }`}>
                188
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
