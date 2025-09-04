import { Badge, HStack, Tabs, VStack } from '@chakra-ui/react'
import { EventEntity, EventId, TalkEntity } from '@domain'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EventDetails, EventHeader, PastTalks, UpcomingTalks } from './EventPageParts'
import { LoadingEvent } from '../components/LoadingEvent'
import { NonExistingEvent } from '../components/NonExistingEvent'
import TalkCreationModal from '../components/TalkCreationModal'
import { TalkEditModal } from '../components/TalkEditModal'
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
    const [editTalk, setEditTalk] = useState<TalkEntity | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const handleEditTalk = (talk: TalkEntity) => {
        setEditTalk(talk)
        setEditModalOpen(true)
    }

    return (
        <VStack gap={4}>
            <EventHeader event={event} />

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
                    <UpcomingTalks event={event} onEdit={handleEditTalk} />
                </Tabs.Content>

                <Tabs.Content value="past" pt={6}>
                    <PastTalks event={event} onEdit={handleEditTalk} />
                </Tabs.Content>
            </Tabs.Root>

            <TalkCreationModal event={event} />

            <TalkEditModal
                event={event}
                editTalk={editTalk}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
            />
        </VStack>
    )
}
