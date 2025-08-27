import { ReactNode } from 'react'
import { useDependencies } from '../hooks/useDependencies'
import { useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
    children: ReactNode
    requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = false }: ProtectedRouteProps) {
    const { signInUseCase } = useDependencies()
    const navigate = useNavigate()

    // If auth is required and user is not signed in, trigger sign-in
    if (requireAuth) {
        // This will trigger the AuthModal to show via the useSignInProvider hook
        signInUseCase.requireCurrentUser().catch(() => {
            console.log('User cancelled sign-in or sign-in failed')
            navigate('/')
        })
    }

    return <>{children}</>
}
