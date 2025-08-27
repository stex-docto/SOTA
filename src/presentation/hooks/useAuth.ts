import { useEffect, useState } from 'react'
import { UserEntity } from '@domain'
import { useDependencies } from './useDependencies'

export interface Auth {
    currentUser: UserEntity | null | undefined
    isLoading: boolean
}

export function useAuth(): Auth {
    const { signInUseCase } = useDependencies()
    const [currentUser, setCurrentUser] = useState<UserEntity | null | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        signInUseCase
            .getCurrentUser()
            .then(user => {
                setCurrentUser(user)
                setIsLoading(false)
            })
            .catch(() => {
                setCurrentUser(null)
                setIsLoading(false)
            })

        // Subscribe to current user changes
        return signInUseCase.subscribeToCurrentUser(async user => {
            setCurrentUser(user)
            setIsLoading(false)
        })
    }, [signInUseCase])

    return {
        currentUser,
        isLoading
    }
}
