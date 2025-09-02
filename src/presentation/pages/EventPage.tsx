import { Container, VStack } from '@chakra-ui/react'
import { EventEntity, EventId } from '@domain'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EventHeader, TalkRules, TalkSchedule } from './EventPageParts'
import { LoadingEvent } from '../components/LoadingEvent'
import { NonExistingEvent } from '../components/NonExistingEvent'
import TalkCreationModal from '../components/TalkCreationModal'
import { useDependencies } from '../hooks/useDependencies'

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

    return (
        <Container maxW="6xl" py={8}>
            <VStack gap={8} align="stretch">
                <EventHeader event={event} eventId={eventId!} />

                <TalkRules talkRules={event.talkRules} />

                <TalkSchedule />
            </VStack>

            <TalkCreationModal event={event} />
        </Container>
    )
}
