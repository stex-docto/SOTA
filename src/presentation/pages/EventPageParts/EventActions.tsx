import { HStack, IconButton } from '@chakra-ui/react'
import { EventEntity } from '@domain'
import { HiHeart, HiOutlineHeart, HiPencil, HiTrash } from 'react-icons/hi2'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toaster } from '@presentation/ui/toaster-config'
import { useAuth } from '@presentation/hooks/useAuth'
import { useDependencies } from '@presentation/hooks/useDependencies'
import QRCodeModal from '@presentation/components/QRCodeModal'
import ConfirmationModal from '@presentation/components/ConfirmationModal'

interface EventActionsProps {
    event: EventEntity
}

export function EventActions({ event }: EventActionsProps) {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { addSavedEventUseCase, removeSavedEventUseCase, deleteEventUseCase } = useDependencies()
    const [isEventSaved, setIsEventSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEventCreator, setIsEventCreator] = useState(false)

    useEffect(() => {
        // Check if current user is the event creator
        if (currentUser && event) {
            setIsEventCreator(currentUser.id.value === event.createdBy.value)
        }
    }, [currentUser, event])

    useEffect(() => {
        if (currentUser && event.id) {
            setIsEventSaved(currentUser.hasEventSaved(event.id))
        }
    }, [currentUser, event])

    const handleSaveToggle = async () => {
        setIsSaving(true)
        try {
            if (isEventSaved) {
                await removeSavedEventUseCase.execute({ eventId: event.id })
                setIsEventSaved(false)
            } else {
                await addSavedEventUseCase.execute({ eventId: event.id })
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

    const handleEditEvent = () => {
        navigate(`/event/${event.id.value}/edit`)
    }

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true)
    }

    const handleDeleteConfirm = async () => {
        setIsDeleting(true)
        try {
            await deleteEventUseCase.execute({ eventId: event.id })
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

    return (
        <>
            <HStack gap={3} align="center">
                <QRCodeModal url={window.location.href} title={event.title} />
                {!isEventCreator && (
                    <IconButton
                        onClick={handleSaveToggle}
                        disabled={isSaving}
                        loading={isSaving}
                        variant={isEventSaved ? 'solid' : 'outline'}
                        colorPalette={isEventSaved ? 'red' : 'gray'}
                        title={isEventSaved ? 'Remove from saved events' : 'Save event'}
                    >
                        {isEventSaved ? <HiHeart /> : <HiOutlineHeart />}
                    </IconButton>
                )}
                {isEventCreator && (
                    <>
                        <IconButton
                            onClick={handleEditEvent}
                            colorPalette="blue"
                            variant="outline"
                            title="Edit event"
                        >
                            <HiPencil />
                        </IconButton>
                        <IconButton
                            onClick={handleDeleteClick}
                            colorPalette="red"
                            variant="outline"
                            title="Delete event"
                        >
                            <HiTrash />
                        </IconButton>
                    </>
                )}
            </HStack>

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
        </>
    )
}
