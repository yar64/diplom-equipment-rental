// app/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/login') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password');

  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <title>EventRent - Аренда оборудования для мероприятий</title>
        <meta
          name="description"
          content="Профессиональная аренда аудио, видео и осветительного оборудования для мероприятий"
        />
      </head>
      <body className="antialiased">
        {!isAdminPage && <Header />}

        <main>
          {children}
        </main>

        {/* Показываем Footer ТОЛЬКО на обычных страницах */}
        {!isAdminPage && !isAuthPage && <Footer />}
      </body>
    </html>
  );
}