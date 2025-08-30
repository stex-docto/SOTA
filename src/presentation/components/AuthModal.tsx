import { useEffect, useState } from 'react'
import { useDependencies } from '../hooks/useDependencies'
import { useAuth } from '../hooks/useAuth'
import { useSignInProvider } from '../hooks/useSignInProvider'
import { Credential } from '@/domain'
import { CredentialDisplay, SignInForm, UserActions, UserProfile } from './auth'
import { Dialog, VStack, CloseButton, IconButton } from '@chakra-ui/react'
import { HiUser } from 'react-icons/hi2'
import { OpenChangeDetails } from '@zag-js/dialog'
import { toaster } from '@presentation/ui/toaster-config'

export function AuthModal() {
    const { signInUseCase } = useDependencies()
    const { currentUser } = useAuth()
    const { answerAllRequests, hasPendingRequests } = useSignInProvider(signInUseCase)
    const [credential, setCredential] = useState<Credential | null>()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setCredential(signInUseCase.getCurrentCredential())
    }, [signInUseCase])

    // Watch for successful sign-in to resolve all pending requests
    useEffect(() => {
        if (currentUser && hasPendingRequests) {
            answerAllRequests(true)
        }
    }, [currentUser, hasPendingRequests, answerAllRequests])

    const handleOpenChange = (e: OpenChangeDetails) => {
        setOpen(e.open)
        if (!open) {
            // Reject all pending sign-in requests when closing
            if (hasPendingRequests) {
                answerAllRequests(false)
            }
        }
    }

    // Force open when there are pending requests
    const shouldBeOpen = open || hasPendingRequests

    return (
        <Dialog.Root onOpenChange={handleOpenChange} open={shouldBeOpen}>
            <Dialog.Trigger asChild>
                <IconButton
                    variant="ghost"
                    aria-label={currentUser ? 'User Profile' : 'Sign In'}
                    title={currentUser ? 'User' : 'Sign In'}
                >
                    <HiUser size={20} />
                </IconButton>
            </Dialog.Trigger>

            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="500px" w="90%">
                    <Dialog.Header>
                        <Dialog.Title>Device Connection</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>

                    <Dialog.Body>
                        {!currentUser ? (
                            <VStack align="stretch" gap={6}>
                                <SignInForm
                                    onCredentialSet={setCredential}
                                    onError={error => {
                                        toaster.create({
                                            title: 'Sign In Error',
                                            description:
                                                error || 'An error occurred during sign in',
                                            type: 'error',
                                            duration: 5000
                                        })
                                    }}
                                />
                            </VStack>
                        ) : (
                            <VStack align="stretch" gap={6}>
                                {credential && (
                                    <CredentialDisplay
                                        credential={credential}
                                        currentUser={currentUser}
                                    />
                                )}

                                <UserProfile currentUser={currentUser} />

                                <UserActions
                                    onSignOut={() => setCredential(null)}
                                    onDeleteAccount={() => setCredential(null)}
                                />
                            </VStack>
                        )}
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
