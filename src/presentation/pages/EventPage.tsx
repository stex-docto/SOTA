import { EventEntity, EventId } from '@domain'
import { HiHeart, HiOutlineHeart, HiSparkles } from 'react-icons/hi2'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ConfirmationModal from '../components/ConfirmationModal'
import QRCodeModal from '../components/QRCodeModal'
import ReactMarkdown from 'react-markdown'
import RoomManagement from '../components/RoomManagement'
import TalkCreationModal from '../components/TalkCreationModal'
import remarkBreaks from 'remark-breaks'
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
            alert(
                error instanceof Error ? error.message : 'Failed to delete event. Please try again.'
            )
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
            alert(
                error instanceof Error
                    ? error.message
                    : 'Failed to save/unsave event. Please try again.'
            )
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="event-page">
                <div className="loading-message">
                    <h2>Loading event...</h2>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="event-page">
                <div className="error-section">
                    <div className="error-icon">🎪</div>
                    <h1>Dang, this event doesn't exist!</h1>
                    <p className="error-message">
                        Check your link — it might have been deleted or never existed in the first
                        place.
                    </p>
                    <p className="error-suggestion">
                        But hey, no worries! You can create your own amazing event instead.
                    </p>
                    <div className="error-actions">
                        <button onClick={() => navigate('/')} className="back-button primary">
                            🏠 Back to Home
                        </button>
                        <button
                            onClick={() => navigate('/create-event')}
                            className="create-button secondary"
                        >
                            <HiSparkles style={{ display: 'inline', marginRight: '8px' }} />
                            Create New Event
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="event-page">
            <div className="event-header">
                <div className="event-title-section">
                    <h1>{event.title}</h1>
                    <p className="event-id">Event ID: {eventId}</p>
                    <div className="event-dates">
                        <p>
                            <strong>Start:</strong> {formatDate(event.startDate)}
                        </p>
                        <p>
                            <strong>End:</strong> {formatDate(event.endDate)}
                        </p>
                    </div>
                    {event.location && (
                        <p className="event-location">
                            <strong>Location:</strong> {event.location}
                        </p>
                    )}
                </div>

                <div className="event-controls">
                    <QRCodeModal
                        url={window.location.href}
                        title={event.title}
                        buttonClassName="share-button secondary"
                    />
                    {!isEventCreator && (
                        <button
                            className={`save-button ${isEventSaved ? 'saved' : 'unsaved'}`}
                            onClick={handleSaveToggle}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                '...'
                            ) : isEventSaved ? (
                                <>
                                    <HiHeart style={{ display: 'inline', marginRight: '4px' }} />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <HiOutlineHeart
                                        style={{ display: 'inline', marginRight: '4px' }}
                                    />
                                    Save Event
                                </>
                            )}
                        </button>
                    )}
                    {isEventCreator && (
                        <button
                            className="admin-button primary"
                            onClick={() => setShowManagement(!showManagement)}
                        >
                            {showManagement ? 'Hide Management' : 'Manage Event'}
                        </button>
                    )}
                </div>
            </div>

            <div className="event-content">
                {isEventCreator && showManagement && (
                    <div className="management-section">
                        <h2>Event Management</h2>
                        <div className="management-actions">
                            <div className="action-group">
                                <h3>Event Actions</h3>
                                <button
                                    className="admin-button secondary"
                                    onClick={() => navigate(`/event/${eventId}/edit`)}
                                >
                                    Edit Event Details
                                </button>
                                <button className="admin-button primary">Generate Schedule</button>
                                <button className="admin-button danger" onClick={handleDeleteClick}>
                                    Delete Event
                                </button>
                            </div>

                            <RoomManagement
                                eventId={EventId.from(eventId!)}
                                isEventCreator={isEventCreator}
                            />

                            <div className="event-stats">
                                <h3>Event Statistics</h3>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h4>0</h4>
                                        <p>Total Talks</p>
                                    </div>
                                    <div className="stat-card">
                                        <h4>0</h4>
                                        <p>Participants</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="event-info">
                    <h2>Description</h2>
                    <div className="markdown-preview">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {event.description}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="talk-rules">
                    <h2>Talk Rules</h2>
                    <div className="markdown-preview large">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {event.talkRules}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="talk-schedule">
                    <h2>Talk Schedule</h2>
                    <div className="schedule-placeholder">
                        <p>
                            Schedule will be displayed here once talks are submitted and approved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                className="floating-action-button"
                onClick={() => setShowTalkCreationModal(true)}
                aria-label="Submit a talk"
                title="Submit a talk"
            >
                +
            </button>

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
        </div>
    )
}

export default EventPage
