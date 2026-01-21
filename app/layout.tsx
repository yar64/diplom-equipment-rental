  // app/layout.tsx
  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import "./globals.css";

  const inter = Inter({ subsets: ["latin"] });

  export const metadata: Metadata = {
    title: "EventRent - Аренда оборудования для мероприятий",
    description: "Профессиональная аренда аудио, видео и осветительного оборудования для мероприятий",
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="ru" className="scroll-smooth">
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
      </html>
    );
  }