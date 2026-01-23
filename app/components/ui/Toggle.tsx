'use client';

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  className = '',
}: ToggleProps) {
  const toggleClasses = `
    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    ${checked ? 'bg-primary' : 'bg-input'}
    ${className}
  `;

  const handleClasses = `
    pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0
    transition-transform duration-200 ease-in-out
    ${checked ? 'translate-x-5' : 'translate-x-0'}
  `;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={toggleClasses}
    >
      <span className={handleClasses} />
    </button>
  );
}