import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Web Personal | Yoel Adan Q.",
  description: "Sitio personal de Yoel Adan Q. con proyectos, fotos, videos y publicaciones.",
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