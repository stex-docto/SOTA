import { Container, Tabs, Box, Badge, HStack } from '@chakra-ui/react'
import { EventEntity, EventId } from '@domain'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EventHeader, EventDetails, UpcomingTalks, PastTalks } from './EventPageParts'
import { LoadingEvent } from '../components/LoadingEvent'
import { NonExistingEvent } from '../components/NonExistingEvent'
import TalkCreationModal from '../components/TalkCreationModal'
import { useDependencies } from '../hooks/useDependencies'
import { useTalksForEvent } from '../hooks/useTalksForEvent'

export default function EventPage() {
    const { eventId } = useParams<{ eventId: string }>()
    const { getEventUseCase } = useDependencies()
    const [event, setEvent] = useState<EventEntity | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        if (!eventId) {
            setError('Event ID is required')
            setLoading(false)
            return
        }

        // Set up real-time subscription
        const unsubscribe = getEventUseCase.subscribe(
            { eventId: EventId.from(eventId) },
            result => {
                setEvent(result.event)
                setLoading(false)

                if (!result.event) {
                    setError('Event not found')
                }
            }
        )

        // Cleanup subscription on unmount
        return () => {
            unsubscribe()
        }
    }, [eventId, getEventUseCase])

    if (loading) {
        return <LoadingEvent />
    }

    if (error || !event) {
        return <NonExistingEvent />
    }

    return <EventPageContent event={event} />
}

function EventPageContent({ event }: { event: EventEntity }) {
    const { upcomingTalks, currentTalks, pastTalks } = useTalksForEvent(event)

    return (
        <>
            <Box
                position="sticky"
                top={0}
                bg={{ base: 'white', _dark: 'gray.900' }}
                borderBottomWidth="1px"
                borderBottomColor={{ base: 'gray.200', _dark: 'gray.700' }}
                zIndex="sticky"
                py={4}
            >
                <Container maxW="6xl">
                    <EventHeader event={event} />
                </Container>
            </Box>

            <Container maxW="6xl" py={8}>
                <Tabs.Root defaultValue="details">
                    <Tabs.List>
                        <Tabs.Trigger value="details">Event Details</Tabs.Trigger>
                        <Tabs.Trigger value="upcoming">
                            <HStack gap={2}>
                                <span>Upcoming Talks</span>
                                {upcomingTalks.length + currentTalks.length > 0 && (
                                    <Badge colorPalette="blue" size="sm">
                                        {upcomingTalks.length + currentTalks.length}
                                    </Badge>
                                )}
                            </HStack>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="past">
                            <HStack gap={2}>
                                <span>Past Talks</span>
                                {pastTalks.length > 0 && (
                                    <Badge colorPalette="gray" size="sm">
                                        {pastTalks.length}
                                    </Badge>
                                )}
                            </HStack>
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="details" pt={6}>
                        <EventDetails event={event} />
                    </Tabs.Content>

                    <Tabs.Content value="upcoming" pt={6}>
                        <UpcomingTalks event={event} />
                    </Tabs.Content>

                    <Tabs.Content value="past" pt={6}>
                        <PastTalks event={event} />
                    </Tabs.Content>
                </Tabs.Root>

                <TalkCreationModal event={event} />
            </Container>
        </>
    )
}
