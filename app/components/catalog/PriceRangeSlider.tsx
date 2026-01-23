// components/PriceRangeSlider.tsx
"use client"

import { useState } from 'react'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (newValue: [number, number]) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  const minPercentage = ((localValue[0] - min) / (max - min)) * 100
  const maxPercentage = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className="relative py-6">
      {/* Фоновая линия */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-secondary rounded-full -translate-y-1/2" />
      
      {/* Активный диапазон */}
      <div 
        className="absolute top-1/2 h-1 bg-gradient-to-r from-primary/50 to-primary rounded-full -translate-y-1/2"
        style={{
          left: `${minPercentage}%`,
          right: `${100 - maxPercentage}%`
        }}
      />
      
      {/* Ползунки */}
      <input
        type="range"
        min={min}
        max={max}
        value={localValue[0]}
        onChange={(e) => handleChange([parseInt(e.target.value), localValue[1]])}
        className="absolute top-1/2 left-0 right-0 w-full h-2 -translate-y-1/2 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-lg"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={localValue[1]}
        onChange={(e) => handleChange([localValue[0], parseInt(e.target.value)])}
        className="absolute top-1/2 left-0 right-0 w-full h-2 -translate-y-1/2 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-lg"
      />
      
      {/* Значения */}
      <div className="flex justify-between mt-8">
        <div className="text-sm">
          <div className="font-medium text-foreground">{localValue[0].toLocaleString()} ₽</div>
          <div className="text-muted-foreground">минимум</div>
        </div>
        <div className="text-sm text-right">
          <div className="font-medium text-foreground">{localValue[1].toLocaleString()} ₽</div>
          <div className="text-muted-foreground">максимум</div>
        </div>
      </div>
    </div>
  )
}