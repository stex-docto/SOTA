import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {useDependencies} from '../hooks/useDependencies';
import {GetEventUseCase, UpdateEventUseCase} from '@application';
import {EventEntity} from '@domain';
import EventForm, {EventFormData} from '../components/EventForm';

function EditEventPage() {
    const {eventId} = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {eventRepository, userRepository} = useDependencies();
    const [event, setEvent] = useState<EventEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [initialFormData, setInitialFormData] = useState<Partial<EventFormData>>({});

    // Load event data
    useEffect(() => {
        if (!eventId) {
            setError('Event ID is required');
            setLoading(false);
            return;
        }

        const getEventUseCase = new GetEventUseCase(eventRepository);

        const unsubscribe = getEventUseCase.subscribe(
            {eventId},
            (result) => {
                setEvent(result.event);
                setLoading(false);

                if (!result.event) {
                    setError('Event not found');
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
    }, [eventId, eventRepository]);

    // Check permissions after both event and user are loaded
    useEffect(() => {
        // Only check permissions if we have the event loaded and not still loading
        if (!loading && event) {
            if (!currentUser) {
                setError('You must be signed in to edit events');
                return;
            }

            if (currentUser.id.value !== event.createdBy.value) {
                setError('Only the event creator can edit this event');
            } else {
                // Clear any previous permission errors if user has access
                setError('');
            }
        }
    }, [currentUser, event, loading]);

    const handleSubmit = async (formData: EventFormData) => {
        if (!currentUser || !event || !eventId) {
            setError('Cannot update event');
            return;
        }

        setIsSubmitting(true);
        setError('');

        // Validate dates
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            setError('End date must be after start date');
            setIsSubmitting(false);
            return;
        }

        try {
            const updateEventUseCase = new UpdateEventUseCase(eventRepository, userRepository);
            await updateEventUseCase.execute({
                eventId,
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
            setError(error instanceof Error ? error.message : 'Failed to update event. Please try again.');
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
        return (
            <div className="edit-event-page">
                <div className="error-section">
                    <h2>Cannot Edit Event</h2>
                    <p>{error || 'The event you are trying to edit does not exist.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="back-button"
                    >
                        Back to Home
                    </button>
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