import { Center, Container, Heading, Spinner, VStack } from '@chakra-ui/react'

interface LoadingEventProps {
    message?: string
}

export function LoadingEvent({ message = 'Loading event...' }: LoadingEventProps) {
    return (
        <Container>
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
