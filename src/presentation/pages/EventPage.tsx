import { Container, IconButton, VStack } from '@chakra-ui/react'
import { EventEntity, EventId } from '@domain'
import { HiPlus } from 'react-icons/hi2'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmationModal from '../components/ConfirmationModal'
import {
    EventActions,
    EventHeader,
    EventManagement,
    TalkRules,
    TalkSchedule
} from './EventPageParts'
import { LoadingEvent } from '../components/LoadingEvent'
import { NonExistingEvent } from '../components/NonExistingEvent'
import QRCodeModal from '../components/QRCodeModal'
import TalkCreationModal from '../components/TalkCreationModal'
import { toaster } from '@presentation/ui/toaster-config'
import { useAuth } from '../hooks/useAuth'
import { useDependencies } from '../hooks/useDependencies'

function EventPage() {
    const { eventId } = useParams<{ eventId: string }>()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { getEventUseCase, deleteEventUseCase, saveEventUseCase, removeSavedEventUseCase } =
        useDependencies()
    const [event, setEvent] = useState<EventEntity | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [isEventCreator, setIsEventCreator] = useState(false)
    const [showManagement, setShowManagement] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEventSaved, setIsEventSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showTalkCreationModal, setShowTalkCreationModal] = useState(false)

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

    useEffect(() => {
        // Check if current user is the event creator
        if (currentUser && event) {
            setIsEventCreator(currentUser.id.value === event.createdBy.value)
        }
    }, [currentUser, event])

    useEffect(() => {
        // Check if event is saved by current user
        if (currentUser && eventId) {
            setIsEventSaved(currentUser.hasEventSaved(EventId.from(eventId)))
        }
    }, [currentUser, eventId])

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true)
    }

    const handleDeleteConfirm = async () => {
        if (!eventId) return

        setIsDeleting(true)
        try {
            await deleteEventUseCase.execute({ eventId: EventId.from(eventId) })

            // Navigate to home page after successful deletion
            navigate('/')
        } catch (error) {
            console.error('Failed to delete event:', error)
            toaster.create({
                title: 'Delete Failed',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to delete event. Please try again.',
                type: 'error',
                duration: 5000
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteConfirmation(false)
        }
    }

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false)
    }

    const handleSaveToggle = async () => {
        if (!eventId) return

        setIsSaving(true)
        try {
            const eventIdObj = EventId.from(eventId)
            if (isEventSaved) {
                await removeSavedEventUseCase.execute({ eventId: eventIdObj })
                setIsEventSaved(false)
            } else {
                await saveEventUseCase.execute({ eventId: eventIdObj })
                setIsEventSaved(true)
            }
        } catch (error) {
            console.error('Failed to toggle save state:', error)
            toaster.create({
                title: 'Save Failed',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to save/unsave event. Please try again.',
                type: 'error',
                duration: 5000
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return <LoadingEvent />
    }

    if (error || !event) {
        return <NonExistingEvent />
    }

    return (
        <Container maxW="6xl" py={8}>
            <VStack gap={8} align="stretch">
                <EventHeader event={event} eventId={eventId!}>
                    <QRCodeModal url={window.location.href} title={event.title} />
                    <EventActions
                        isEventCreator={isEventCreator}
                        isEventSaved={isEventSaved}
                        isSaving={isSaving}
                        showManagement={showManagement}
                        onSaveToggle={handleSaveToggle}
                        onToggleManagement={() => setShowManagement(!showManagement)}
                        onEditEvent={() => navigate(`/event/${eventId}/edit`)}
                        onDeleteEvent={handleDeleteClick}
                    />
                </EventHeader>

                {isEventCreator && showManagement && (
                    <EventManagement
                        eventId={EventId.from(eventId!)}
                        isEventCreator={isEventCreator}
                    />
                )}

                <TalkRules talkRules={event.talkRules} />

                <TalkSchedule />

                <IconButton
                    position="fixed"
                    bottom={8}
                    right={8}
                    borderRadius="full"
                    size="2xl"
                    colorPalette="blue"
                    onClick={() => setShowTalkCreationModal(true)}
                    title="Submit a talk"
                >
                    <HiPlus />
                </IconButton>
            </VStack>

            <TalkCreationModal
                isOpen={showTalkCreationModal}
                onClose={() => setShowTalkCreationModal(false)}
                eventId={EventId.from(eventId!)}
            />

            <ConfirmationModal
                isOpen={showDeleteConfirmation}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Event"
                message={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
                confirmButtonText="Delete Event"
                isDestructive={true}
                isLoading={isDeleting}
            />
        </Container>
    )
}

export default EventPage
