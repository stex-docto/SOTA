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
        <VStack gap={4} align="stretch">
            <Text colorPalette="gray" fontSize="sm" lineHeight="1.5">
                Save this code, it allows to reconnect on any device with this code
            </Text>
            <Box
                colorPalette="blue"
                fontFamily="mono"
                fontSize="xl"
                fontWeight="semibold"
                textAlign="center"
                py={4}
                px={6}
                bg={{ base: "colorPalette.50", _dark: "colorPalette.900" }}
                borderRadius="md"
                border="2px solid"
                borderColor={{ base: "colorPalette.500", _dark: "colorPalette.400" }}
                letterSpacing="2px"
                userSelect="all"
                cursor="text"
            >
                {formatCredentialDisplay(credential.codes)}
            </Box>
            <Text fontSize="sm" colorPalette="gray">
                Signed in as: {String(currentUser.id)}
            </Text>
        </VStack>
    )
}
