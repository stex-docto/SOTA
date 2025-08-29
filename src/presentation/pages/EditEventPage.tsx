import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDependencies } from '../hooks/useDependencies'
import {
    EventEntity,
    EventId,
    AuthenticationError,
    PermissionError,
    EventNotFoundError
} from '@domain'
import EventForm, { EventFormData } from '../components/EventForm'
import { HiLockClosed, HiKey, HiExclamationTriangle } from 'react-icons/hi2'
import { HiArchiveBox } from 'react-icons/hi2'
import {
    Container,
    VStack,
    HStack,
    Center,
    Spinner,
    Text,
    Heading,
    Box,
    Button
} from '@chakra-ui/react'

function EditEventPage() {
    const { eventId } = useParams<{ eventId: string }>()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { getEventUseCase, updateEventUseCase } = useDependencies()
    const [event, setEvent] = useState<EventEntity | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [initialFormData, setInitialFormData] = useState<Partial<EventFormData>>({})

    // Load event data
    useEffect(() => {
        if (!eventId) {
            setError(new EventNotFoundError('Event ID is required'))
            setLoading(false)
            return
        }

        const unsubscribe = getEventUseCase.subscribe(
            { eventId: EventId.from(eventId) },
            result => {
                setEvent(result.event)
                setLoading(false)

                if (!result.event) {
                    setError(new EventNotFoundError())
                } else {
                    // Prepare initial form data
                    setInitialFormData({
                        title: result.event.title,
                        description: result.event.description,
                        talkRules: result.event.talkRules,
                        startDate: result.event.startDate.toISOString().slice(0, 16),
                        endDate: result.event.endDate.toISOString().slice(0, 16),
                        location: result.event.location
                    })
                }
            }
        )

        return () => {
            unsubscribe()
        }
    }, [eventId, getEventUseCase])

    // Check permissions after both event and user are loaded
    useEffect(() => {
        // Only check permissions if we have the event loaded and not still loading
        if (!loading && event) {
            if (!currentUser) {
                setError(AuthenticationError.signInRequired())
                return
            }

            if (currentUser.id.value !== event.createdBy.value) {
                setError(PermissionError.onlyCreatorCanEdit())
            } else {
                // Clear any previous permission errors if user has access
                setError(null)
            }
        }
    }, [currentUser, event, loading])

    const handleSubmit = async (formData: EventFormData) => {
        if (!currentUser || !event || !eventId) {
            setError(new Error('Cannot update event'))
            return
        }

        setIsSubmitting(true)
        setError(null)

        // Validate dates
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            setError(new Error('End date must be after start date'))
            setIsSubmitting(false)
            return
        }

        try {
            await updateEventUseCase.execute({
                eventId: EventId.from(eventId),
                title: formData.title,
                description: formData.description,
                talkRules: formData.talkRules,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                location: formData.location
            })

            // Navigate back to the event page
            navigate(`/event/${eventId}`)
        } catch (error) {
            console.error('Failed to update event:', error)
            setError(
                error instanceof Error
                    ? error
                    : new Error('Failed to update event. Please try again.')
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate(`/event/${eventId}`)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    if (loading) {
        return (
            <Container maxW="4xl" py={8}>
                <Center py={16}>
                    <VStack gap={4}>
                        <Spinner size="xl" colorPalette="blue" />
                        <Heading size="lg" colorPalette="gray">
                            Loading event...
                        </Heading>
                    </VStack>
                </Center>
            </Container>
        )
    }

    if (error || !event) {
        const getErrorIcon = () => {
            if (error instanceof AuthenticationError) return <HiKey size={24} />
            if (error instanceof PermissionError) return <HiLockClosed size={24} />
            if (error instanceof EventNotFoundError) return <HiArchiveBox size={24} />
            return <HiExclamationTriangle size={24} />
        }

        const getErrorSuggestion = () => {
            if (error instanceof PermissionError) {
                return 'This event was created by someone else. Only the event creator has permission to make changes.'
            }
            if (error instanceof AuthenticationError) {
                return 'Please sign in with the account that created this event to make changes.'
            }
            if (error instanceof EventNotFoundError) {
                return 'Check your link — it might have been deleted or never existed in the first place.'
            }
            return null
        }

        return (
            <Container maxW="4xl" py={8}>
                <Center py={16}>
                    <VStack gap={6} textAlign="center" maxW="lg">
                        <Box fontSize="48px">{getErrorIcon()}</Box>
                        <VStack gap={4}>
                            <Heading size="2xl" colorPalette="gray">
                                Cannot Edit Event
                            </Heading>
                            <Text fontSize="lg" colorPalette="gray">
                                {error?.message || 'The event you are trying to edit does not exist.'}
                            </Text>
                            {getErrorSuggestion() && (
                                <Text fontSize="md" colorPalette="gray" fontStyle="italic">
                                    {getErrorSuggestion()}
                                </Text>
                            )}
                        </VStack>
                        <HStack gap={4}>
                            {eventId && (
                                <Button
                                    onClick={() => navigate(`/event/${eventId}`)}
                                    colorPalette="blue"
                                    size="lg"
                                >
                                    🔙 View Event
                                </Button>
                            )}
                            <Button 
                                onClick={() => navigate('/')} 
                                variant="outline"
                                size="lg"
                            >
                                🏠 Back to Home
                            </Button>
                        </HStack>
                    </VStack>
                </Center>
            </Container>
        )
    }

    return (
        <>
            <Container maxW="4xl" py={8}>
                <VStack gap={8} align="stretch">
                    {/* Event Metadata */}
                    <VStack gap={4} textAlign="center">
                        <Heading size="2xl" colorPalette="gray">
                            Edit Event
                        </Heading>
                        <Text fontSize="lg" colorPalette="gray">
                            Update your event details
                        </Text>
                        <VStack gap={2} fontSize="sm" colorPalette="gray">
                            <Text>
                                <Text as="span" fontWeight="semibold">Created:</Text>{' '}
                                {formatDate(event.createdDate)}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="semibold">Event ID:</Text>{' '}
                                {eventId}
                            </Text>
                        </VStack>
                    </VStack>
                </VStack>
            </Container>
            
            <EventForm
                initialData={initialFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                error={error}
                submitButtonText="Update Event"
                title=""
                subtitle=""
            />
        </>
    )
}

export default EditEventPage
