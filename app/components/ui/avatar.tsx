// components/ui/avatar.tsx

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  className?: string
}

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback = 'U',
  status,
  className = ''
}: AvatarProps) => {
  
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  }
  
  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  }
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-300',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  }
  
  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`
            rounded-full object-cover
            ${sizes[size]}
          `}
        />
      ) : (
        <div className={`
          flex items-center justify-center rounded-full
          bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700
          ${sizes[size]}
          font-medium
        `}>
          {fallback.charAt(0).toUpperCase()}
        </div>
      )}
      
      {status && (
        <span className={`
          absolute bottom-0 right-0 rounded-full border-2 border-white
          ${statusColors[status]}
          ${statusSizes[size]}
        `} />
      )}
    </div>
  )
}

// Специализированный аватар для клиента аренды
const ClientAvatar = ({
  name,
  company,
  src,
  status = 'online'
}: {
  name: string
  company?: string
  src?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
}) => {
  
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={src}
        fallback={initials}
        size="md"
        status={status}
      />
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        {company && (
          <div className="text-sm text-gray-500">{company}</div>
        )}
      </div>
    </div>
  )
}

export { Avatar, ClientAvatar }