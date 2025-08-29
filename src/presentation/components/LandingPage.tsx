import { Link } from 'react-router-dom'
import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    Card,
    Badge,
    Button,
    SimpleGrid
} from '@chakra-ui/react'

function LandingPage() {
    return (
        <Container maxW="1200px" py={16}>
            <VStack gap={12} textAlign="center">
                {/* Hero Section */}
                <VStack gap={6}>
                    <Heading size="4xl" color="fg.emphasized">
                        Welcome to SOTA
                    </Heading>
                    <Text fontSize="xl" color="fg.muted" lineHeight={1.8} maxW="2xl">
                        Simple Open Talk App - Organize and participate in open talk sessions. Share
                        your knowledge, learn from others, and build a vibrant community of speakers
                        and learners.
                    </Text>
                </VStack>

                {/* Action Cards */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} w="full" maxW="4xl">
                    {/* Join Event Card */}
                    <Card.Root
                        p={8}
                        borderWidth="2px"
                        borderColor="green.500"
                        bgGradient="to-br"
                        gradientFrom="green.50"
                        gradientTo="green.25"
                        _hover={{
                            transform: 'translateY(-4px)',
                            shadow: 'xl'
                        }}
                        transition="all 0.3s ease"
                    >
                        <Card.Body>
                            <VStack gap={6}>
                                <Heading size="2xl" textAlign="center">
                                    <Text as="span" fontSize="2xl" mr={3}>
                                        👥
                                    </Text>
                                    Join an Event
                                </Heading>

                                <Text
                                    fontSize="lg"
                                    color="fg.muted"
                                    textAlign="center"
                                    lineHeight={1.6}
                                >
                                    Got an event URL? Just click it or paste it in your browser. No
                                    sign-up needed!
                                </Text>

                                <Badge
                                    colorScheme="green"
                                    size="lg"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontWeight="semibold"
                                >
                                    ✨ Zero barriers to participation
                                </Badge>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Host Event Card */}
                    <Card.Root
                        p={8}
                        borderWidth="2px"
                        borderColor="blue.500"
                        bgGradient="to-br"
                        gradientFrom="blue.50"
                        gradientTo="blue.25"
                        _hover={{
                            transform: 'translateY(-4px)',
                            shadow: 'xl'
                        }}
                        transition="all 0.3s ease"
                    >
                        <Card.Body>
                            <VStack gap={6}>
                                <Heading size="2xl" textAlign="center">
                                    <Text as="span" fontSize="2xl" mr={3}>
                                        ✨
                                    </Text>
                                    Host Your Own
                                </Heading>

                                <Text
                                    fontSize="lg"
                                    color="fg.muted"
                                    textAlign="center"
                                    lineHeight={1.6}
                                >
                                    Be the catalyst! Launch your talk session and bring speakers
                                    together in minutes.
                                </Text>

                                {/* Creation Flow */}
                                <HStack gap={4} py={4}>
                                    <VStack gap={2}>
                                        <Box fontSize="2xl">⚡</Box>
                                        <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
                                            Create event
                                        </Text>
                                    </VStack>
                                    <Text
                                        color="blue.500"
                                        fontSize="lg"
                                        fontWeight="bold"
                                        opacity={0.6}
                                    >
                                        •
                                    </Text>
                                    <VStack gap={2}>
                                        <Box fontSize="2xl">📤</Box>
                                        <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
                                            Share URL
                                        </Text>
                                    </VStack>
                                </HStack>

                                <Button
                                    asChild
                                    colorScheme="blue"
                                    size="lg"
                                    borderRadius="full"
                                    px={8}
                                >
                                    <Link to="/create-event">🚀 Launch Event</Link>
                                </Button>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>
            </VStack>
        </Container>
    )
}

export default LandingPage
