// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Key, 
  Mail, 
  User, 
  Building,
  Phone,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FormWrapper from '../components/login/FormWrapper';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthButton {
  id: AuthMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [previousMode, setPreviousMode] = useState<AuthMode | null>(null);
  const [nextMode, setNextMode] = useState<AuthMode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<AuthMode | null>(null);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Данные форм
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [resetData, setResetData] = useState({
    email: '',
  });

  // Кнопки авторизации
  const authButtons: AuthButton[] = [
    {
      id: 'login',
      label: 'Вход',
      icon: <LogIn className="w-5 h-5" />,
      description: 'Войдите в существующий аккаунт',
    },
    {
      id: 'register',
      label: 'Регистрация',
      icon: <UserPlus className="w-5 h-5" />,
      description: 'Создайте новый аккаунт',
    },
    {
      id: 'forgot',
      label: 'Восстановление',
      icon: <Key className="w-5 h-5" />,
      description: 'Восстановите доступ к аккаунту',
    }
  ];

  // Используем useEffect для отложенной инициализации на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Обработчик смены режима с плавным переходом
  const handleModeChange = (newMode: AuthMode) => {
    setIsGoingBack(false);
    setPreviousMode(mode);
    setNextMode(newMode);
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setNextMode(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Обработчик возврата к выбору
  const handleBack = () => {
    setIsGoingBack(true);
    setPreviousMode(mode);
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(null);
      setPreviousMode(null);
      setTimeout(() => {
        setIsTransitioning(false);
        setIsGoingBack(false);
      }, 50);
    }, 300);
  };

  // Обработчики форм
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/profile');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      alert('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    if (!registerData.agreeToTerms) {
      alert('Необходимо согласиться с условиями');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      handleBack();
      setLoginData({
        ...loginData,
        email: registerData.email,
      });
      alert('Регистрация успешна! Теперь войдите в аккаунт.');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Инструкции отправлены на email!');
      handleBack();
    } catch (error) {
      console.error('Reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Получение анимации для формы в зависимости от режима
  const getFormAnimation = () => {
    if (!mode) return '';
    
    if (previousMode === null && !isGoingBack) {
      switch (mode) {
        case 'login':
          return 'animate-slide-in-from-left';
        case 'register':
          return 'animate-slide-in-from-top';
        case 'forgot':
          return 'animate-slide-in-from-right';
        default:
          return 'animate-fade-in';
      }
    } else if (isGoingBack && previousMode) {
      switch (previousMode) {
        case 'login':
          return 'animate-slide-out-to-left';
        case 'register':
          return 'animate-slide-out-to-top';
        case 'forgot':
          return 'animate-slide-out-to-right';
        default:
          return 'animate-fade-out';
      }
    } else if (nextMode && previousMode) {
      return 'animate-fade-in';
    } else {
      return 'animate-fade-in';
    }
  };

  // Рендер формы с использованием ваших компонентов
  const renderForm = () => {
    if (!mode) return null;

    const forms = {
      login: (
        <FormWrapper
          title="Вход в аккаунт"
          subtitle="Войдите в существующий аккаунт"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              placeholder="your@email.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Пароль"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              placeholder="Введите пароль"
              icon={<Key className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={loginData.remember}
                    onChange={(e) => setLoginData({...loginData, remember: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${loginData.remember ? 'bg-gray-800 border-gray-800' : 'border-gray-300'}`}>
                    {loginData.remember && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-gray-600">Запомнить меня</span>
              </label>
              <button
                type="button"
                onClick={() => handleModeChange('forgot')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Забыли пароль?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              icon={<LogIn className="w-4 h-4" />}
              className="mt-2"
            >
              Войти
            </Button>
          </form>
        </FormWrapper>
      ),

      register: (
        <FormWrapper
          title="Создать аккаунт"
          subtitle="Заполните форму для регистрации"
        >
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="ФИО *"
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                placeholder="Иван Иванов"
                icon={<User className="w-4 h-4" />}
                required
                inputSize="sm"
              />

              <Input
                label="Email *"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                placeholder="your@email.com"
                icon={<Mail className="w-4 h-4" />}
                required
                inputSize="sm"
              />

              <Input
                label="Телефон"
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                placeholder="+7 (999) 123-45-67"
                icon={<Phone className="w-4 h-4" />}
                inputSize="sm"
              />

              <Input
                label="Компания"
                type="text"
                value={registerData.company}
                onChange={(e) => setRegisterData({...registerData, company: e.target.value})}
                placeholder="Название компании"
                icon={<Building className="w-4 h-4" />}
                inputSize="sm"
              />

              <Input
                label="Пароль *"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                placeholder="Минимум 6 символов"
                icon={<Key className="w-4 h-4" />}
                required
                minLength={6}
                inputSize="sm"
              />

              <Input
                label="Подтверждение *"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                placeholder="Повторите пароль"
                icon={<Key className="w-4 h-4" />}
                required
                inputSize="sm"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={registerData.agreeToTerms}
                  onChange={(e) => setRegisterData({...registerData, agreeToTerms: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${registerData.agreeToTerms ? 'bg-gray-800 border-gray-800' : 'border-gray-300'}`}>
                  {registerData.agreeToTerms && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-xs text-gray-600">
                Я соглашаюсь с условиями использования и политикой конфиденциальности
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              icon={<UserPlus className="w-4 h-4" />}
              className="mt-4"
            >
              Зарегистрироваться
            </Button>
          </form>
        </FormWrapper>
      ),

      forgot: (
        <FormWrapper
          title="Восстановление доступа"
          subtitle="Введите email, указанный при регистрации"
        >
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              label="Email *"
              type="email"
              value={resetData.email}
              onChange={(e) => setResetData({...resetData, email: e.target.value})}
              placeholder="your@email.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                icon={<Mail className="w-4 h-4" />}
              >
                Отправить инструкции
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => handleModeChange('login')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Назад ко входу
              </Button>
            </div>
          </form>
        </FormWrapper>
      )
    };

    return (
      <div className={`w-full max-w-md ${getFormAnimation()}`}>
        {forms[mode]}
      </div>
    );
  };

  // Анимация для трех кнопок при возврате
  const getMainButtonsAnimation = () => {
    if (mode === null && previousMode && isGoingBack) {
      switch (previousMode) {
        case 'login':
          return 'animate-main-buttons-from-left';
        case 'register':
          return 'animate-main-buttons-from-top';
        case 'forgot':
          return 'animate-main-buttons-from-right';
        default:
          return '';
      }
    }
    return '';
  };

  // Используем isClient чтобы избежать гидратационных ошибок
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white border border-gray-300 rounded overflow-hidden h-[500px]">
            <div className="h-full p-6 flex items-center justify-center">
              <div className="flex w-full h-full">
                {/* Заглушка для SSR */}
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="absolute left-1/3 top-0 bottom-0 border-l border-gray-300"></div>
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="absolute left-2/3 top-0 bottom-0 border-l border-gray-300"></div>
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {/* Основной контейнер */}
      <div className="w-full max-w-4xl">
        {/* Основная форма */}
        <div className="bg-white border border-gray-300 rounded overflow-hidden h-[500px]">
          {/* Контейнер для всего контента */}
          <div className={`relative h-full ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            
            {/* Кнопка возврата (если выбран режим) */}
            {mode && (
              <button
                onClick={handleBack}
                className="absolute top-4 left-4 z-10 flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm transition-colors hover-lift"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </button>
            )}

            {/* Основное содержимое */}
            <div className="h-full p-6">
              {/* Если не выбран режим - показываем 3 равные части */}
              {!mode ? (
                <div className={`flex relative h-full ${getMainButtonsAnimation()}`}>
                  {/* Вертикальные линии-разделители */}
                  <div className="absolute left-1/3 top-0 bottom-0 border-l border-gray-300"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 border-l border-gray-300"></div>
                  
                  {authButtons.map((button) => (
                    <div
                      key={button.id}
                      className="flex-1 px-4 flex flex-col items-center h-full relative group"
                      onMouseEnter={() => setHoveredButton(button.id)}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => handleModeChange(button.id)}
                    >
                      {/* Вся секция кликабельна */}
                      <div className="absolute inset-0 cursor-pointer" />
                      
                      {/* Контент */}
                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        
                        {/* Кнопка с использованием вашего компонента Button */}
                        <div className={`w-full transition-all duration-300 ease-out ${
                          hoveredButton === button.id 
                            ? 'transform translate-y-20'
                            : ''
                        }`}>
                          <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            icon={button.icon}
                          >
                            {button.label}
                          </Button>
                        </div>

                        {/* Контент при наведении */}
                        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${
                          hoveredButton === button.id 
                            ? 'opacity-100' 
                            : 'opacity-0 pointer-events-none'
                        }`}>
                          <div className="text-gray-700 mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center transition-transform-smooth">
                              {button.icon}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm text-center max-w-xs">
                            {button.description}
                          </p>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Если выбран режим - показываем форму
                <div className="h-full flex items-center justify-center">
                  {renderForm()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Глобальные стили */}
      <style jsx global>{`
        .transition-smooth {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .transition-transform-smooth {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        
        .active-scale:active {
          transform: scale(0.98);
        }
        
        .btn-hover-effect {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-hover-effect:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .icon-hover:hover {
          transform: translateX(2px);
        }

        /* Анимации для форм при открытии */
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Анимации для форм при закрытии (возврате) */
        @keyframes slideOutToLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes slideOutToTop {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        /* Анимации для трех кнопок при возврате */
        @keyframes mainButtonsFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes mainButtonsFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes mainButtonsFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .animate-slide-in-from-left {
          animation: slideInFromLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-in-from-top {
          animation: slideInFromTop 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-in-from-right {
          animation: slideInFromRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-out-to-left {
          animation: slideOutToLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-out-to-top {
          animation: slideOutToTop 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-out-to-right {
          animation: slideOutToRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-main-buttons-from-left {
          animation: mainButtonsFromLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-main-buttons-from-top {
          animation: mainButtonsFromTop 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-main-buttons-from-right {
          animation: mainButtonsFromRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fade-out {
          animation: fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}