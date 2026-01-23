// app/not-found.tsx - минималистичная версия
'use client';

import Link from 'next/link';
import Button from './components/ui/Button';
import { 
  Home,
  LayoutGrid,
  AlertTriangle
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-sm w-full space-y-8 text-center">
        {/* Иконка ошибки */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted">
              <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-destructive opacity-75"></div>
              <div className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></div>
            </div>
          </div>
        </div>

        {/* Заголовок и текст */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Страница не найдена</h2>
          <p className="text-muted-foreground">
            Запрашиваемая страница отсутствует в нашем каталоге оборудования
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3">
          <Button 
            variant="primary"
            className="w-full"
            icon={<Home className="w-4 h-4" />}
            hoverEffect
          >
            <Link href="/" className="flex items-center justify-center gap-2">
              На главную
            </Link>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            icon={<LayoutGrid className="w-4 h-4" />}
            hoverEffect
          >
            <Link href="/catalog" className="flex items-center justify-center gap-2">
              В каталог
            </Link>
          </Button>
        </div>

        {/* Дополнительная информация */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Если вы считаете, что это ошибка,{' '}
            <Link 
              href="/help" 
              className="text-primary hover:underline transition-colors-smooth"
            >
              свяжитесь с нами
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}