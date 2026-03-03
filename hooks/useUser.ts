// hooks/useUser.ts
import { useEffect, useState } from 'react'

interface UserData {
    id: string
    email: string
    name?: string
    role: string
    avatar?: string
}

export function useUser() {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Получаем пользователя из localStorage
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                const userData = JSON.parse(userStr)
                setUser(userData)
            } catch (e) {
                console.error('Error parsing user data:', e)
            }
        }
        setLoading(false)
    }, [])

    const updateUser = (newUserData: UserData) => {
        setUser(newUserData)
        localStorage.setItem('user', JSON.stringify(newUserData))
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('rememberMe')
    }

    return { user, loading, updateUser, clearUser }
}