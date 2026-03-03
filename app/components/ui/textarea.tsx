// components/ui/textarea.tsx
import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCounter?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className = '',
  label,
  error,
  helperText,
  showCounter = false,
  maxLength,
  value,
  ...props
}, ref) => {
  
  const characterCount = typeof value === 'string' ? value.length : 0
  
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-900">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          className={`
            flex min-h-[100px] w-full rounded-lg border
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-black'}
            bg-white px-3 py-2 text-sm placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0
            disabled:cursor-not-allowed disabled:opacity-50
            resize-y
            ${className}
          `}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        
        {showCounter && maxLength && (
          <div className="absolute bottom-2 right-2">
            <span className={`text-xs ${characterCount > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Специализированное поле для особых требований к аренде
const RentalRequirementsTextarea = () => (
  <Textarea
    label="Особые требования к аренде"
    placeholder="Укажите дополнительные требования к оборудованию, особенности монтажа, технические спецификации..."
    helperText="Опишите все важные детали для корректной подготовки оборудования"
    showCounter
    maxLength={500}
    rows={4}
  />
)

export { Textarea, RentalRequirementsTextarea }