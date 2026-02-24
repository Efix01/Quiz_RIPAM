import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UserProfile } from '../types'

interface AuthContextType {
    user: UserProfile | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, displayName: string) => Promise<void>
    logout: () => Promise<void>
    error: string | null
    clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve essere usato dentro AuthProvider')
    }
    return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Controlla se c'è un utente salvato in localStorage
        const savedUser = localStorage.getItem('ripam_user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.removeItem('ripam_user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        setError(null)
        setLoading(true)
        try {
            // Per ora login locale — Supabase verrà integrato dopo
            // Simula login con localStorage
            const storedUsers = JSON.parse(localStorage.getItem('ripam_users') || '{}')
            const userData = storedUsers[email]

            if (!userData || userData.password !== password) {
                throw new Error('Email o password non corretti')
            }

            const userProfile: UserProfile = {
                id: userData.id,
                email,
                displayName: userData.displayName,
                selectedProfile: userData.selectedProfile || null,
                createdAt: userData.createdAt,
            }

            setUser(userProfile)
            localStorage.setItem('ripam_user', JSON.stringify(userProfile))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il login')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const register = async (email: string, password: string, displayName: string) => {
        setError(null)
        setLoading(true)
        try {
            const storedUsers = JSON.parse(localStorage.getItem('ripam_users') || '{}')

            if (storedUsers[email]) {
                throw new Error('Un account con questa email esiste già')
            }

            const newUser = {
                id: crypto.randomUUID(),
                email,
                password, // In produzione sarà hashata via Supabase
                displayName,
                selectedProfile: null,
                createdAt: new Date().toISOString(),
            }

            storedUsers[email] = newUser
            localStorage.setItem('ripam_users', JSON.stringify(storedUsers))

            const userProfile: UserProfile = {
                id: newUser.id,
                email,
                displayName,
                selectedProfile: null,
                createdAt: newUser.createdAt,
            }

            setUser(userProfile)
            localStorage.setItem('ripam_user', JSON.stringify(userProfile))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante la registrazione')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setUser(null)
        localStorage.removeItem('ripam_user')
    }

    const clearError = () => setError(null)

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, error, clearError }}>
            {children}
        </AuthContext.Provider>
    )
}
