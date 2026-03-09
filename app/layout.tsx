import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Senado Colombia 2026 - Resultados en Tiempo Real",
  description: "Visualización en tiempo real de las elecciones al Senado de Colombia 2026 con cálculo de asignación de curules según método D'Hondt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
