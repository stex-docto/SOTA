import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {useDependencies} from '../hooks/useDependencies';
import {EventEntity, EventId, AuthenticationError, PermissionError, EventNotFoundError} from '@domain';
import EventForm, {EventFormData} from '../components/EventForm';

function EditEventPage() {
    const {eventId} = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {getEventUseCase, updateEventUseCase} = useDependencies();
    const [event, setEvent] = useState<EventEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [initialFormData, setInitialFormData] = useState<Partial<EventFormData>>({});

    // Load event data
    useEffect(() => {
        if (!eventId) {
            setError(new EventNotFoundError('Event ID is required'));
            setLoading(false);
            return;
        }

        const unsubscribe = getEventUseCase.subscribe(
            {eventId: EventId.from(eventId)},
            (result) => {
                setEvent(result.event);
                setLoading(false);

                if (!result.event) {
                    setError(new EventNotFoundError());
                } else {
                    // Prepare initial form data
                    setInitialFormData({
                        title: result.event.title,
                        description: result.event.description,
                        talkRules: result.event.talkRules,
                        startDate: result.event.startDate.toISOString().slice(0, 16),
                        endDate: result.event.endDate.toISOString().slice(0, 16),
                        location: result.event.location
                    });
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [eventId, getEventUseCase]);

    // Check permissions after both event and user are loaded
    useEffect(() => {
        // Only check permissions if we have the event loaded and not still loading
        if (!loading && event) {
            if (!currentUser) {
                setError(AuthenticationError.signInRequired());
                return;
            }

            if (currentUser.id.value !== event.createdBy.value) {
                setError(PermissionError.onlyCreatorCanEdit());
            } else {
                // Clear any previous permission errors if user has access
                setError(null);
            }
        }
    }, [currentUser, event, loading]);

    const handleSubmit = async (formData: EventFormData) => {
        if (!currentUser || !event || !eventId) {
            setError(new Error('Cannot update event'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        // Validate dates
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            setError(new Error('End date must be after start date'));
            setIsSubmitting(false);
            return;
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
            });

            // Navigate back to the event page
            navigate(`/event/${eventId}`);

        } catch (error) {
            console.error('Failed to update event:', error);
            setError(error instanceof Error ? error : new Error('Failed to update event. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/event/${eventId}`);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="edit-event-page">
                <div className="loading-message">
                    <h2>Loading event...</h2>
                </div>
            </div>
        );
    }

    if (error || !event) {
        const getErrorIcon = () => {
            if (error instanceof AuthenticationError) return '🔐';
            if (error instanceof PermissionError) return '🔒';
            if (error instanceof EventNotFoundError) return '🎪';
            return '⚠️';
        };

        const getErrorSuggestion = () => {
            if (error instanceof PermissionError) {
                return 'This event was created by someone else. Only the event creator has permission to make changes.';
            }
            if (error instanceof AuthenticationError) {
                return 'Please sign in with the account that created this event to make changes.';
            }
            if (error instanceof EventNotFoundError) {
                return 'Check your link — it might have been deleted or never existed in the first place.';
            }
            return null;
        };

        return (
            <div className="edit-event-page">
                <div className="error-section">
                    <div className="error-icon">{getErrorIcon()}</div>
                    <h1>Cannot Edit Event</h1>
                    <p className="error-message">
                        {error?.message || 'The event you are trying to edit does not exist.'}
                    </p>
                    {getErrorSuggestion() && (
                        <p className="error-suggestion">
                            {getErrorSuggestion()}
                        </p>
                    )}
                    <div className="error-actions">
                        {eventId && (
                            <button
                                onClick={() => navigate(`/event/${eventId}`)}
                                className="back-button primary"
                            >
                                🔙 View Event
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="home-button secondary"
                        >
                            🏠 Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Custom title with event metadata
    const customTitle = (
        <div>
            <h1>Edit Event</h1>
            <p>Update your event details</p>
            <div className="event-meta" style={{marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280'}}>
                <p><strong>Created:</strong> {formatDate(event.createdDate)}</p>
                <p><strong>Event ID:</strong> {eventId}</p>
            </div>
        </div>
    );

    return (
        <div className="edit-event-page">
            <div className="page-header">
                {customTitle}
            </div>
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
        </div>
    );
}

export default EditEventPage;