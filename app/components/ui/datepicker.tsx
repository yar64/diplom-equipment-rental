// components/ui/datepicker.tsx
'use client'

import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  label?: string
  error?: string
  className?: string
}

const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Выберите дату',
  label,
  error,
  className = ''
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  
  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }
  
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    onChange?.(selectedDate)
    setIsOpen(false)
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    ))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ))
  }
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  
  const currentYear = currentMonth.getFullYear()
  const currentMonthIndex = currentMonth.getMonth()
  const daysCount = daysInMonth(currentYear, currentMonthIndex)
  const firstDay = firstDayOfMonth(currentYear, currentMonthIndex)
  
  const days = []
  for (let i = 1; i <= daysCount; i++) {
    days.push(i)
  }
  
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex h-10 w-full items-center justify-between rounded-lg border
          ${error ? 'border-red-500' : 'border-gray-300'}
          bg-white px-3 py-2 text-sm
          hover:border-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black
        `}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value ? formatDate(value) : placeholder}
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          {/* Месяц и навигация */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="font-semibold">
              {monthNames[currentMonthIndex]} {currentYear}
            </div>
            
            <button
              onClick={handleNextMonth}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Дни недели */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Календарь */}
          <div className="grid grid-cols-7 gap-1">
            {/* Пустые ячейки */}
            {[...Array(firstDay > 0 ? firstDay - 1 : 6)].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {/* Дни месяца */}
            {days.map(day => {
              const currentDate = new Date(currentYear, currentMonthIndex, day)
              const isToday = currentDate.toDateString() === new Date().toDateString()
              const isSelected = value?.toDateString() === currentDate.toDateString()
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    h-8 rounded text-sm
                    ${isSelected
                      ? 'bg-black text-white'
                      : isToday
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                    disabled:opacity-30
                  `}
                  disabled={
                    (minDate && currentDate < minDate) ||
                    (maxDate && currentDate > maxDate)
                  }
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Специализированный DatePicker для выбора диапазона дат аренды
const RentalDateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  
  const calculateDays = () => {
    if (startDate && endDate) {
      const diff = Math.abs(endDate.getTime() - startDate.getTime())
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }
    return 0
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="Дата начала аренды"
          value={startDate}
          onChange={setStartDate}
          minDate={new Date()}
        />
        <DatePicker
          label="Дата окончания аренды"
          value={endDate}
          onChange={setEndDate}
          minDate={startDate}
        />
      </div>
      
      {(startDate || endDate) && (
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">
            {startDate && endDate ? (
              <>
                <div className="font-medium">Период аренды:</div>
                <div className="mt-1">
                  {startDate.toLocaleDateString('ru-RU')} – {endDate.toLocaleDateString('ru-RU')}
                </div>
                <div className="mt-2 font-medium">
                  Количество дней: {calculateDays()}
                </div>
              </>
            ) : (
              <div>Выберите даты начала и окончания аренды</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { DatePicker, RentalDateRangePicker }