import { Credential, UserEntity } from '@/domain'
import { VStack, Text, Box } from '@chakra-ui/react'

interface CredentialDisplayProps {
    credential: Credential
    currentUser: UserEntity
}

export function CredentialDisplay({ credential, currentUser }: CredentialDisplayProps) {
    const formatCredentialDisplay = (codes: string[]) => {
        return codes.join('-')
    }

    return (
        <Box
            colorPalette="blue"
            p={6}
            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
        >
            <VStack gap={4} align="stretch">
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
        </Box>
    )
}
