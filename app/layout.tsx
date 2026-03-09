import type { Metadata } from "next";
import "./globals.css";
import NavHeader from "@/components/NavHeader";

export const metadata: Metadata = {
  title: "Congreso Colombia 2026 - Resultados en Tiempo Real",
  description: "Visualización en tiempo real de las elecciones al Congreso de Colombia 2026 (Senado y Cámara) con cálculo de asignación de curules según método D'Hondt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <NavHeader />
        {children}
        <footer className="mt-8 py-4 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            Creado por{" "}
            <span className="text-gray-200 font-medium">Gabriel Coral Caicedo</span>
            {" · "}
            <a
              href="https://github.com/gabrielcoralc/senado-col"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              GitHub
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
