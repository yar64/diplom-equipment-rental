// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from './components/ui/Button';
import { 
  AlertTriangle,
  Home,
  RefreshCw,
  Shield,
  Terminal
} from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Логирование ошибки в реальном приложении
    console.error('Ошибка в приложении:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full space-y-8">
        {/* Иконка ошибки */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-destructive opacity-75"></div>
              <div className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></div>
            </div>
          </div>
        </div>

        {/* Заголовок и текст */}
        <div className="text-center space-y-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Произошла ошибка</h1>
            <p className="text-muted-foreground">
              При обработке вашего запроса возникла непредвиденная ошибка
            </p>
          </div>

          {/* Детали ошибки (только в dev режиме) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-left p-4 rounded-lg bg-muted border">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4" />
                <h3 className="font-medium text-sm">Детали ошибки:</h3>
              </div>
              <pre className="text-xs font-mono overflow-auto p-2 bg-background rounded">
                {error.message || 'Неизвестная ошибка'}
              </pre>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  ID ошибки: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Информация о безопасности */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium mb-1">Безопасность данных</p>
              <p className="text-xs text-muted-foreground">
                Ваши данные в безопасности. Эта ошибка не связана с утечкой информации.
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="primary"
              className="w-full"
              icon={<Home className="w-4 h-4" />}
              hoverEffect
              onClick={() => window.location.href = '/'}
            >
              На главную
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              icon={<RefreshCw className="w-4 h-4" />}
              hoverEffect
              onClick={reset}
            >
              Попробовать снова
            </Button>
          </div>

          {/* Дополнительные опции */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link 
              href="/help" 
              className="text-primary hover:underline transition-colors-smooth"
            >
              Помощь
            </Link>
            <Link 
              href="/status" 
              className="text-primary hover:underline transition-colors-smooth"
            >
              Статус системы
            </Link>
            <Link 
              href="/contact" 
              className="text-primary hover:underline transition-colors-smooth"
            >
              Связаться с нами
            </Link>
          </div>
        </div>

        {/* Информация о системе */}
        <div className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Система аренды оборудования</span>
            <span>Ошибка • {new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}