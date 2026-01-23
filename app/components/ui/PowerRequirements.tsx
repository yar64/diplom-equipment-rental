'use client';

import { useState, ChangeEvent } from 'react';
import { Zap, Battery, AlertTriangle, FileText, Upload } from 'lucide-react';
import Card, { CardContent } from './Card';
import Select from './Select';
import Toggle from './Toggle';
import Button from './Button';

const POWER_OPTIONS = [
  { value: '3kw', label: 'До 3 кВт', description: 'Стандартные розетки 220В' },
  { value: '10kw', label: '3-10 кВт', description: 'Отдельная линия, нужен электрик' },
  { value: '30kw', label: '10-30 кВт', description: 'Трёхфазная сеть 380В' },
  { value: 'generator', label: '30+ кВт / Генератор', description: 'Требуется генератор' },
];

const CONNECTION_TYPES = [
  { value: 'standard', label: 'Стандартные розетки' },
  { value: 'stage-box', label: 'Сценические боксы' },
  { value: 'distro', label: 'Распределительные щиты' },
  { value: 'direct', label: 'Прямое подключение' },
];

export default function PowerRequirements() {
  const [powerLevel, setPowerLevel] = useState('3kw');
  const [needsGenerator, setNeedsGenerator] = useState(false);
  const [needsUps, setNeedsUps] = useState(false);
  const [connectionType, setConnectionType] = useState('standard');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileNames = files.map(file => file.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="hover:border-amber-300/30 transition-colors">
      <CardContent>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Электропитание</h3>
            <p className="text-sm text-muted-foreground">
              Укажите требования для правильного подбора оборудования
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка - Основные требования */}
          <div className="space-y-6">
            {/* Уровень мощности */}
            <div>
              <label className="block font-medium text-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4" />
                  Требуемая мощность
                </div>
              </label>
              <div className="space-y-3">
                {POWER_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                      ${powerLevel === option.value
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-muted hover:border-muted-foreground/50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="power-level"
                      value={option.value}
                      checked={powerLevel === option.value}
                      onChange={(e) => setPowerLevel(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                      ${powerLevel === option.value
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-muted'
                      }
                    `}>
                      {powerLevel === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Дополнительные требования */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-medium">Резервное питание</div>
                    <div className="text-sm text-muted-foreground">
                      ИБП или генератор на случай отключений
                    </div>
                  </div>
                </div>
                <Toggle
                  checked={needsGenerator}
                  onCheckedChange={setNeedsGenerator}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">Бесперебойное питание</div>
                  <div className="text-sm text-muted-foreground">
                    ИБП для критически важного оборудования
                  </div>
                </div>
                <Toggle
                  checked={needsUps}
                  onCheckedChange={setNeedsUps}
                />
              </div>
            </div>
          </div>

          {/* Правая колонка - Конфигурация */}
          <div className="space-y-6">
            {/* Тип подключения */}
            <div>
              <label className="block font-medium text-foreground mb-3">
                Тип подключения оборудования
              </label>
              <Select
                value={connectionType}
                onChange={setConnectionType}
                options={CONNECTION_TYPES}
                placeholder="Выберите тип подключения"
                selectSize="lg"
                className="w-full"
              />
            </div>

            {/* Загрузка документов */}
            <div>
              <label className="block font-medium text-foreground mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Схемы и планы
                </div>
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <div className="mb-2">
                    <div className="font-medium">Загрузите план подключения</div>
                    <div className="text-sm text-muted-foreground">
                      PDF, JPG, PNG до 10MB
                    </div>
                  </div>
                  <input
                    type="file"
                    id="power-plan"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="power-plan">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                    >
                      Выбрать файл
                    </Button>
                  </label>
                </div>

                {/* Список загруженных файлов */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((fileName, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm truncate">{fileName}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Рекомендации */}
            {powerLevel === 'generator' && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Рекомендация
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Для мощности свыше 30 кВт требуется генератор. 
                  Наши специалисты помогут подобрать оптимальное решение и организовать доставку.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}