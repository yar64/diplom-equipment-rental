'use client';

import { useState } from 'react';
import { Truck, Wrench, Shield, Headphones, Check } from 'lucide-react';
import Card, { CardContent } from './Card';
import Toggle from './Toggle';

interface ServiceOption {
  label: string;
  price: number;
  description: string;
}

interface Service {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  price: number;
  required?: boolean;
  options?: ServiceOption[];
}

interface ServiceToggleProps {
  services: Service[];
  onChange: (selectedServices: Record<string, { enabled: boolean; option?: string }>) => void;
  compact?: boolean;
}

export default function ServiceToggle({ 
  services, 
  onChange,
  compact = false 
}: ServiceToggleProps) {
  const [selectedServices, setSelectedServices] = useState<
    Record<string, { enabled: boolean; option?: string }>
  >({});

  const handleToggle = (serviceId: string, enabled: boolean) => {
    const updated = {
      ...selectedServices,
      [serviceId]: { ...selectedServices[serviceId], enabled }
    };
    setSelectedServices(updated);
    onChange(updated);
  };

  const handleOptionChange = (serviceId: string, optionIndex: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service?.options) return;

    const updated = {
      ...selectedServices,
      [serviceId]: { 
        enabled: true, 
        option: service.options![optionIndex].label 
      }
    };
    setSelectedServices(updated);
    onChange(updated);
  };

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wrench className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Дополнительные услуги</h3>
            <p className="text-sm text-muted-foreground">
              Улучшите свой опыт аренды
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`
                p-4 rounded-lg border transition-all duration-300
                ${selectedServices[service.id]?.enabled 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-muted-foreground/50'
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${
                    selectedServices[service.id]?.enabled 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {service.title}
                      </h4>
                      {service.required && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Обязательно
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    
                    {/* Опции услуги */}
                    {service.options && selectedServices[service.id]?.enabled && (
                      <div className="mt-3 space-y-2">
                        {service.options.map((option, idx) => (
                          <label
                            key={option.label}
                            className={`
                              flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                              ${selectedServices[service.id]?.option === option.label
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-muted-foreground/30'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name={`${service.id}-option`}
                              checked={selectedServices[service.id]?.option === option.label}
                              onChange={() => handleOptionChange(service.id, idx)}
                              className="sr-only"
                            />
                            <div className={`
                              w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                              ${selectedServices[service.id]?.option === option.label
                                ? 'border-primary bg-primary'
                                : 'border-muted'
                              }
                            `}>
                              {selectedServices[service.id]?.option === option.label && (
                                <Check className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                            <div className="font-semibold">
                              {option.price.toLocaleString()} ₽
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {service.price.toLocaleString()} ₽
                    </div>
                    {service.required && (
                      <span className="text-xs text-muted-foreground">включено</span>
                    )}
                  </div>
                  {!service.required && (
                    <Toggle
                      checked={selectedServices[service.id]?.enabled || false}
                      onCheckedChange={(checked) => handleToggle(service.id, checked)}
                      disabled={service.required}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Итог по услугам */}
        {Object.keys(selectedServices).length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Выбрано услуг: </span>
                <span className="font-semibold">
                  {Object.values(selectedServices).filter(s => s.enabled).length}
                </span>
              </div>
              <div className="text-lg font-semibold">
                {Object.entries(selectedServices)
                  .filter(([_, s]) => s.enabled)
                  .reduce((sum, [id, s]) => {
                    const service = services.find(serv => serv.id === id);
                    const servicePrice = service?.price || 0;
                    
                    // Если есть выбранная опция, используем её цену
                    if (s.option && service?.options) {
                      const option = service.options.find(opt => opt.label === s.option);
                      return sum + (option?.price || servicePrice);
                    }
                    
                    return sum + servicePrice;
                  }, 0)
                  .toLocaleString()} ₽
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}