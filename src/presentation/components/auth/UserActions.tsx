import { useDependencies } from '../../hooks/useDependencies'
import { HStack, Button } from '@chakra-ui/react'
import { toaster } from '@presentation/ui/toaster-config'

interface UserActionsProps {
    onSignOut: () => void
    onDeleteAccount: () => void
}

export function UserActions({ onSignOut, onDeleteAccount }: UserActionsProps) {
    const { signInUseCase } = useDependencies()

    const handleLogout = async () => {
        try {
            await signInUseCase.signOut()
            onSignOut()
            toaster.create({
                title: 'Signed Out',
                description: 'You have been signed out successfully.',
                type: 'info',
                duration: 3000
            })
        } catch (error) {
            console.error('Logout failed:', error)
            toaster.create({
                title: 'Sign Out Failed',
                description: 'Failed to sign out. Please try again.',
                type: 'error',
                duration: 5000
            })
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await signInUseCase.delete()
            onDeleteAccount()
            toaster.create({
                title: 'Account Deleted',
                description: 'Your account has been deleted successfully.',
                type: 'info',
                duration: 3000
            })
        } catch (error) {
            console.error('Account deletion failed:', error)
            toaster.create({
                title: 'Deletion Failed',
                description: 'Failed to delete account. Please try again.',
                type: 'error',
                duration: 5000
            })
        }
    }

    return (
        <HStack gap={3} justify="space-between" w="full">
            <Button variant="outline" size="sm" onClick={handleLogout} flex="1">
                Sign Out
            </Button>
            <Button colorScheme="red" size="sm" onClick={handleDeleteAccount} flex="1">
                Delete Account
            </Button>
        </HStack>
    )
}
