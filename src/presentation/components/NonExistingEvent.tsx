import { useNavigate } from 'react-router-dom'
import { Box, Button, Center, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { HiSparkles } from 'react-icons/hi2'

interface NonExistingEventProps {
    title?: string
    message?: string
    suggestion?: string
    showCreateButton?: boolean
}

export function NonExistingEvent({
    title = "Dang, this event doesn't exist!",
    message = 'Check your link — it might have been deleted or never existed in the first place.',
    suggestion = 'But hey, no worries! You can create your own amazing event instead.',
    showCreateButton = true
}: NonExistingEventProps) {
    const navigate = useNavigate()

    return (
        <Container>
            <Center py={16}>
                <VStack gap={6} textAlign="center" maxW="lg">
                    <Box fontSize="64px">🎪</Box>
                    <VStack gap={4}>
                        <Heading size="2xl" colorPalette="gray">
                            {title}
                        </Heading>
                        <Text fontSize="lg" colorPalette="gray">
                            {message}
                        </Text>
                        {suggestion && (
                            <Text fontSize="md" colorPalette="gray" fontStyle="italic">
                                {suggestion}
                            </Text>
                        )}
                    </VStack>
                    <HStack gap={4}>
                        <Button onClick={() => navigate('/')} colorPalette="blue" size="lg">
                            🏠 Back to Home
                        </Button>
                        {showCreateButton && (
                            <Button
                                onClick={() => navigate('/create-event')}
                                variant="outline"
                                size="lg"
                            >
                                <HiSparkles />
                                Create New Event
                            </Button>
                        )}
                    </HStack>
                </VStack>
            </Center>
        </Container>
    )
}
