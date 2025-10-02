import { Credential, UserEntity } from '@/domain'
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useDependencies } from '@presentation/hooks/useDependencies.ts'
import { toaster } from '@presentation/ui/toaster-config'

interface CredentialDisplayProps {
    credential: Credential
    currentUser: UserEntity
    onSignOut: () => void
}

export function CredentialDisplay({ credential, currentUser, onSignOut }: CredentialDisplayProps) {
    const { signInUseCase } = useDependencies()

    const formatCredentialDisplay = (codes: string[]) => {
        return codes.join('-')
    }

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
            onSignOut()
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
        <VStack gap={4} align="stretch">
            <VStack
                p={4}
                gap={2}
                align="stretch"
                colorPalette="blue"
                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
            >
                <Text
                    fontSize="sm"
                    lineHeight="1.5"
                    color={{ base: 'colorPalette.600', _dark: 'colorPalette.300' }}
                >
                    Save this code, it allows to reconnect on any device with this code
                </Text>
                <Box
                    fontFamily="mono"
                    fontSize="xl"
                    fontWeight="semibold"
                    textAlign="center"
                    py={4}
                    px={6}
                    bg={{ base: 'white', _dark: 'colorPalette.800' }}
                    borderRadius="md"
                    border="2px solid"
                    borderColor={{ base: 'colorPalette.300', _dark: 'colorPalette.700' }}
                    color={{ base: 'colorPalette.700', _dark: 'colorPalette.100' }}
                    letterSpacing="2px"
                    userSelect="all"
                    cursor="text"
                >
                    {formatCredentialDisplay(credential.codes)}
                </Box>
                <Text fontSize="sm" color={{ base: 'colorPalette.600', _dark: 'colorPalette.300' }}>
                    Signed in as: {String(currentUser.id)}
                </Text>
            </VStack>

            <VStack
                p={4}
                gap={2}
                align="stretch"
                colorPalette="blue"
                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
            >
                <Heading>Forget me everywhere</Heading>

                <HStack justify="end" align="end">
                    <Text fontSize="sm" flex={1}>
                        Cleaner option, remove the anonymous account.
                    </Text>
                    <Button colorPalette="red" size="sm" onClick={handleDeleteAccount}>
                        Delete account
                    </Button>
                </HStack>
            </VStack>

            <VStack
                p={4}
                gap={2}
                align="stretch"
                colorPalette="bg.subtle"
                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
            >
                <Heading>Remove from this device only</Heading>
                <HStack justify="end" align="end">
                    <Text fontSize="sm" flex={1}>
                        Use it <b>only</b> if you have saved the credential string somewhere or if
                        you have another device logged in.
                    </Text>

                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Log out
                    </Button>
                </HStack>
            </VStack>
        </VStack>
    )
}
