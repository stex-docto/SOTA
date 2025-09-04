import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDependencies } from '../hooks/useDependencies'
import { UserEventItem } from '@application'
import { useEffect, useState } from 'react'
import EventList from './EventList'
import {
    Box,
    Button,
    Center,
    Collapsible,
    Heading,
    HStack,
    Spinner,
    Text,
    VStack
} from '@chakra-ui/react'
import { HiCalendarDays, HiOutlinePlus } from 'react-icons/hi2'
import { TbTarget } from 'react-icons/tb'

function UserDashboard() {
    const { currentUser } = useAuth()
    const { getUserAllEventsUseCase } = useDependencies()
    const [allEvents, setAllEvents] = useState<UserEventItem[]>([])
    const [loadingEvents, setLoadingEvents] = useState(true)

    useEffect(() => {
        const fetchAllEvents = async () => {
            if (!currentUser) return

            try {
                const result = await getUserAllEventsUseCase.execute()
                console.log(result.events)
                setAllEvents(result.events)
            } catch (error) {
                console.error('Failed to fetch user events:', error)
            } finally {
                setLoadingEvents(false)
            }
        }

        fetchAllEvents()
    }, [currentUser, getUserAllEventsUseCase])

    if (!currentUser) {
        return null
    }

    const now = new Date()
    const upcomingEvents = allEvents.filter(eventItem => eventItem.event.endDate > now)
    const pastEvents = allEvents.filter(eventItem => eventItem.event.endDate <= now)
    const hasAnyEvents = allEvents.length > 0

    return (
        <>
            {/* Header */}
            <HStack justify="space-between" align="center" mb={8}>
                <Heading size="2xl">Your Events</Heading>
                <Button asChild colorPalette="blue" size="lg" borderRadius="full" px={6}>
                    <Link to="/create-event">
                        <HiOutlinePlus /> Create Event
                    </Link>
                </Button>
            </HStack>

            {/* Content */}
            {loadingEvents ? (
                <Center py={16}>
                    <VStack gap={4}>
                        <Spinner size="xl" colorPalette="blue" />
                        <Text colorPalette="gray">Loading your events...</Text>
                    </VStack>
                </Center>
            ) : hasAnyEvents ? (
                <VStack gap={8} align="stretch">
                    {/* Upcoming Events */}
                    <Box>
                        <Heading size="lg" mb={4}>
                            Upcoming Events ({upcomingEvents.length})
                        </Heading>
                        <EventList
                            events={upcomingEvents}
                            isPastEvent={false}
                            emptyMessage="No upcoming events"
                        />
                    </Box>

                    {/* Past Events - Collapsible */}
                    {pastEvents.length > 0 && (
                        <Collapsible.Root>
                            <Collapsible.Trigger asChild>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    justifyContent="flex-start"
                                    fontWeight="semibold"
                                    fontSize="lg"
                                    p={0}
                                    h="auto"
                                >
                                    Past Events ({pastEvents.length})
                                </Button>
                            </Collapsible.Trigger>
                            <Collapsible.Content mt={4}>
                                <EventList
                                    events={pastEvents}
                                    isPastEvent={true}
                                    emptyMessage="No past events"
                                />
                            </Collapsible.Content>
                        </Collapsible.Root>
                    )}

                    {/* No Upcoming Events State */}
                    {upcomingEvents.length === 0 && pastEvents.length > 0 && (
                        <Center py={12}>
                            <VStack gap={6} textAlign="center" maxW="lg">
                                <Heading size="xl" colorPalette="gray">
                                    <HStack gap={2}>
                                        <Text>All caught up!</Text>
                                        <HiCalendarDays size={20} />
                                    </HStack>
                                </Heading>
                                <Text colorPalette="gray" fontSize="lg">
                                    You don't have any upcoming events. Ready to create your next
                                    one?
                                </Text>
                                <Button
                                    asChild
                                    colorPalette="blue"
                                    size="lg"
                                    borderRadius="full"
                                    px={8}
                                >
                                    <Link to="/create-event">Create New Event</Link>
                                </Button>
                            </VStack>
                        </Center>
                    )}
                </VStack>
            ) : (
                // Empty State - No Events at All
                <Center py={20}>
                    <VStack gap={8} textAlign="center" maxW="lg">
                        <TbTarget size={96} color="currentColor" />
                        <VStack gap={4}>
                            <Heading size="2xl">No events yet</Heading>
                            <Text colorPalette="gray" fontSize="lg" lineHeight={1.6}>
                                Create your first event or save events from others to see them here.
                            </Text>
                        </VStack>
                        <Button
                            asChild
                            colorPalette="blue"
                            size="xl"
                            borderRadius="full"
                            px={10}
                            py={6}
                            fontSize="lg"
                        >
                            <Link to="/create-event">Create Your First Event</Link>
                        </Button>
                    </VStack>
                </Center>
            )}
        </>
    )
}

export default UserDashboard
