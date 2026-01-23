// app/components/auth/AuthCard.tsx
'use client';

import { ReactNode, useState } from 'react';

interface AuthTab {
  id: string;
  label: string;
  icon: ReactNode;
}

interface AuthCardProps {
  tabs: AuthTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthCard({
  tabs,
  activeTab,
  onTabChange,
  children,
  title,
  subtitle
}: AuthCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId || isAnimating) return;
    
    setIsAnimating(true);
    onTabChange(tabId);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Декоративный градиент */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        {/* Верхняя часть с табами */}
        <div className="relative px-8 pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
          
          {/* Табы */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'bg-secondary hover:bg-accent hover:scale-[1.02]'
                  }
                `}
              >
                <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Контент формы */}
        <div className={`relative px-8 pb-8 transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {children}
        </div>

        {/* Декоративные элементы */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-secondary/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}