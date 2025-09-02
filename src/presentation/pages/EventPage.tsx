import {
    Badge,
    Box,
    Button,
    Container,
    Grid,
    Heading,
    IconButton,
    Text,
    VStack
} from '@chakra-ui/react'
import { EventEntity, EventId } from '@domain'
import { HiHeart, HiOutlineHeart, HiPlus } from 'react-icons/hi2'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ConfirmationModal from '../components/ConfirmationModal'
import { LoadingEvent } from '../components/LoadingEvent'
import { NonExistingEvent } from '../components/NonExistingEvent'
import QRCodeModal from '../components/QRCodeModal'
import ReactMarkdown from 'react-markdown'
import RoomManagement from '../components/RoomManagement'
import TalkCreationModal from '../components/TalkCreationModal'
import remarkBreaks from 'remark-breaks'
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
                {/* Event Header */}
                <Box
                    colorPalette="blue"
                    p={8}
                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="colorPalette.200"
                >
                    <Grid
                        templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
                        gap={8}
                        alignItems="start"
                    >
                        <VStack gap={4} align="start">
                            <Heading size="3xl" colorPalette="gray">
                                {event.title}
                            </Heading>
                            <Badge colorPalette="gray" size="sm" fontFamily="mono">
                                Event ID: {eventId}
                            </Badge>
                            <VStack gap={2} align="start" fontSize="sm" colorPalette="gray">
                                <Text>
                                    <Text as="span" fontWeight="semibold">
                                        Start:
                                    </Text>{' '}
                                    {formatDate(event.startDate)}
                                </Text>
                                <Text>
                                    <Text as="span" fontWeight="semibold">
                                        End:
                                    </Text>{' '}
                                    {formatDate(event.endDate)}
                                </Text>
                                {event.location && (
                                    <Text>
                                        <Text as="span" fontWeight="semibold">
                                            Location:
                                        </Text>{' '}
                                        {event.location}
                                    </Text>
                                )}
                            </VStack>
                        </VStack>

                        <VStack gap={3} align="stretch">
                            <QRCodeModal url={window.location.href} title={event.title} />
                            {!isEventCreator && (
                                <Button
                                    onClick={handleSaveToggle}
                                    disabled={isSaving}
                                    loading={isSaving}
                                    variant={isEventSaved ? 'solid' : 'outline'}
                                    colorPalette={isEventSaved ? 'red' : 'gray'}
                                    size="lg"
                                >
                                    {isEventSaved ? <HiHeart /> : <HiOutlineHeart />}
                                    {isEventSaved ? 'Saved' : 'Save Event'}
                                </Button>
                            )}
                            {isEventCreator && (
                                <Button
                                    onClick={() => setShowManagement(!showManagement)}
                                    colorPalette="blue"
                                    size="lg"
                                >
                                    {showManagement ? 'Hide Management' : 'Manage Event'}
                                </Button>
                            )}
                        </VStack>
                    </Grid>
                </Box>

                {/* Event Management Section */}
                {isEventCreator && showManagement && (
                    <Box
                        colorPalette="blue"
                        p={6}
                        bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                        borderWidth="1px"
                        borderColor="colorPalette.200"
                        borderRadius="lg"
                    >
                        <VStack gap={6} align="stretch">
                            <Heading size="xl" colorPalette="gray">
                                Event Management
                            </Heading>

                            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
                                <VStack gap={4} align="stretch">
                                    <Heading size="lg" colorPalette="gray">
                                        Event Actions
                                    </Heading>
                                    <VStack gap={3} align="stretch">
                                        <Button
                                            colorPalette="blue"
                                            variant="outline"
                                            size="lg"
                                            onClick={() => navigate(`/event/${eventId}/edit`)}
                                        >
                                            Edit Event Details
                                        </Button>
                                        <Button colorPalette="green" size="lg">
                                            Generate Schedule
                                        </Button>
                                        <Button
                                            colorPalette="red"
                                            variant="outline"
                                            size="lg"
                                            onClick={handleDeleteClick}
                                        >
                                            Delete Event
                                        </Button>
                                    </VStack>
                                </VStack>

                                <VStack gap={4} align="stretch">
                                    <Heading size="lg" colorPalette="gray">
                                        Event Statistics
                                    </Heading>
                                    <Grid templateColumns="1fr 1fr" gap={4}>
                                        <Box
                                            colorPalette="gray"
                                            p={4}
                                            textAlign="center"
                                            bg={{
                                                base: 'colorPalette.50',
                                                _dark: 'colorPalette.900'
                                            }}
                                            borderWidth="1px"
                                            borderColor="colorPalette.200"
                                            borderRadius="md"
                                        >
                                            <Text
                                                fontSize="2xl"
                                                fontWeight="bold"
                                                colorPalette="gray"
                                            >
                                                0
                                            </Text>
                                            <Text fontSize="sm" colorPalette="gray">
                                                Total Talks
                                            </Text>
                                        </Box>
                                        <Box
                                            colorPalette="gray"
                                            p={4}
                                            textAlign="center"
                                            bg={{
                                                base: 'colorPalette.50',
                                                _dark: 'colorPalette.900'
                                            }}
                                            borderWidth="1px"
                                            borderColor="colorPalette.200"
                                            borderRadius="md"
                                        >
                                            <Text
                                                fontSize="2xl"
                                                fontWeight="bold"
                                                colorPalette="gray"
                                            >
                                                0
                                            </Text>
                                            <Text fontSize="sm" colorPalette="gray">
                                                Participants
                                            </Text>
                                        </Box>
                                    </Grid>
                                </VStack>
                            </Grid>

                            <VStack gap={4} align="stretch">
                                <RoomManagement
                                    eventId={EventId.from(eventId!)}
                                    isEventCreator={isEventCreator}
                                />
                            </VStack>
                        </VStack>
                    </Box>
                )}

                {/* Description Section */}
                <Box
                    colorPalette="gray"
                    p={6}
                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                    borderWidth="1px"
                    borderColor="colorPalette.200"
                    borderRadius="lg"
                >
                    <VStack gap={4} align="stretch">
                        <Heading size="xl" colorPalette="gray">
                            Description
                        </Heading>
                        <Box
                            colorPalette="gray"
                            p={4}
                            bg={{ base: 'colorPalette.100', _dark: 'colorPalette.800' }}
                            borderWidth="1px"
                            borderColor="colorPalette.200"
                            borderRadius="md"
                        >
                            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                                {event.description}
                            </ReactMarkdown>
                        </Box>
                    </VStack>
                </Box>

                {/* Talk Rules Section */}
                <Box
                    colorPalette="green"
                    p={6}
                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                    borderWidth="1px"
                    borderColor="colorPalette.200"
                    borderRadius="lg"
                >
                    <VStack gap={4} align="stretch">
                        <Heading size="xl" colorPalette="gray">
                            Talk Rules
                        </Heading>
                        <Box
                            colorPalette="green"
                            p={4}
                            bg={{ base: 'colorPalette.100', _dark: 'colorPalette.800' }}
                            borderWidth="1px"
                            borderColor="colorPalette.200"
                            borderRadius="md"
                        >
                            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                                {event.talkRules}
                            </ReactMarkdown>
                        </Box>
                    </VStack>
                </Box>

                {/* Talk Schedule Section */}
                <Box
                    colorPalette="purple"
                    p={6}
                    bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                    borderWidth="1px"
                    borderColor="colorPalette.200"
                    borderRadius="lg"
                >
                    <VStack gap={4} align="stretch">
                        <Heading size="xl" colorPalette="gray">
                            Talk Schedule
                        </Heading>
                        <Box
                            colorPalette="purple"
                            p={6}
                            textAlign="center"
                            bg={{ base: 'colorPalette.100', _dark: 'colorPalette.800' }}
                            borderWidth="1px"
                            borderColor="colorPalette.200"
                            borderRadius="md"
                        >
                            <Text colorPalette="gray" fontStyle="italic">
                                Schedule will be displayed here once talks are submitted and
                                approved.
                            </Text>
                        </Box>
                    </VStack>
                </Box>

                {/* Floating Action Button */}
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
