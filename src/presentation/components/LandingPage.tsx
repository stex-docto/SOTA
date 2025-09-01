import { Link } from 'react-router-dom'
import {
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
import { HiUserGroup, HiSparkles, HiBolt, HiPaperAirplane, HiRocketLaunch } from 'react-icons/hi2'

function LandingPage() {
    return (
        <Container maxW="1200px" py={16}>
            <VStack gap={12} textAlign="center">
                {/* Hero Section */}
                <VStack gap={6}>
                    <Heading size="4xl" colorPalette="gray">
                        Welcome to SOTA
                    </Heading>
                    <Text fontSize="xl" colorPalette="gray" lineHeight={1.8} maxW="2xl">
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
                                    <HiUserGroup size={24} style={{ marginRight: '12px' }} />
                                    Join an Event
                                </Heading>

                                <Text
                                    fontSize="lg"
                                    colorPalette="gray"
                                    textAlign="center"
                                    lineHeight={1.6}
                                >
                                    Got an event URL? Just click it or paste it in your browser. No
                                    sign-up needed!
                                </Text>

                                <Badge
                                    colorPalette="green"
                                    size="lg"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontWeight="semibold"
                                >
                                    <HStack gap={1}>
                                        <HiSparkles size={16} />
                                        <Text>Zero barriers to participation</Text>
                                    </HStack>
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
                                    <HiSparkles size={24} style={{ marginRight: '12px' }} />
                                    Host Your Own
                                </Heading>

                                <Text
                                    fontSize="lg"
                                    colorPalette="gray"
                                    textAlign="center"
                                    lineHeight={1.6}
                                >
                                    Be the catalyst! Launch your talk session and bring speakers
                                    together in minutes.
                                </Text>

                                {/* Creation Flow */}
                                <HStack gap={4} py={4}>
                                    <VStack gap={2}>
                                        <HiBolt size={32} />
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            colorPalette="gray"
                                        >
                                            Create event
                                        </Text>
                                    </VStack>
                                    <Text
                                        colorPalette="blue"
                                        fontSize="lg"
                                        fontWeight="bold"
                                        opacity={0.6}
                                    >
                                        •
                                    </Text>
                                    <VStack gap={2}>
                                        <HiPaperAirplane size={32} />
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            colorPalette="gray"
                                        >
                                            Share URL
                                        </Text>
                                    </VStack>
                                </HStack>

                                <Button
                                    asChild
                                    colorPalette="blue"
                                    size="lg"
                                    borderRadius="full"
                                    px={8}
                                >
                                    <Link to="/create-event">
                                        <HStack gap={2}>
                                            <HiRocketLaunch size={16} />
                                            <Text>Launch Event</Text>
                                        </HStack>
                                    </Link>
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
