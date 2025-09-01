import { Container, Center, VStack, Spinner, Heading } from '@chakra-ui/react'

interface LoadingEventProps {
    message?: string
}

export function LoadingEvent({ message = 'Loading event...' }: LoadingEventProps) {
    return (
        <Container maxW="6xl" py={8}>
            <Center py={16}>
                <VStack gap={4}>
                    <Spinner size="xl" colorPalette="blue" />
                    <Heading size="lg" colorPalette="gray">
                        {message}
                    </Heading>
                </VStack>
            </Center>
        </Container>
    )
}
