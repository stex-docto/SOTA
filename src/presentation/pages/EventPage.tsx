import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import {useAuth} from '../hooks/useAuth';
import {useDependencies} from '../hooks/useDependencies';
import {GetEventUseCase} from '@application';
import {DeleteEventUseCase} from '@application';
import {EventEntity} from '@domain';
import ConfirmationModal from '../components/ConfirmationModal';

function EventPage() {
    const {eventId} = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {eventRepository, userRepository} = useDependencies();
    const [event, setEvent] = useState<EventEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isEventCreator, setIsEventCreator] = useState(false);
    const [showManagement, setShowManagement] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!eventId) {
            setError('Event ID is required');
            setLoading(false);
            return;
        }

        const getEventUseCase = new GetEventUseCase(eventRepository);

        // Set up real-time subscription
        const unsubscribe = getEventUseCase.subscribe(
            {eventId},
            (result) => {
                setEvent(result.event);
                setLoading(false);

                if (!result.event) {
                    setError('Event not found');
                }
            }
        );

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [eventId, eventRepository]);

    useEffect(() => {
        // Check if current user is the event creator
        if (currentUser && event) {
            setIsEventCreator(currentUser.id.value === event.createdBy.value);
        }
    }, [currentUser, event]);

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

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        if (!eventId) return;

        setIsDeleting(true);
        try {
            const deleteEventUseCase = new DeleteEventUseCase(eventRepository, userRepository);
            await deleteEventUseCase.execute({ eventId });
            
            // Navigate to home page after successful deletion
            navigate('/');
        } catch (error) {
            console.error('Failed to delete event:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete event. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirmation(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };

    if (loading) {
        return (
            <div className="event-page">
                <div className="loading-message">
                    <h2>Loading event...</h2>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="event-page">
                <div className="error-section">
                    <div className="error-icon">🎪</div>
                    <h1>Dang, this event doesn't exist!</h1>
                    <p className="error-message">
                        Check your link — it might have been deleted or never existed in the first place.
                    </p>
                    <p className="error-suggestion">
                        But hey, no worries! You can create your own amazing event instead.
                    </p>
                    <div className="error-actions">
                        <button
                            onClick={() => navigate('/')}
                            className="back-button primary"
                        >
                            🏠 Back to Home
                        </button>
                        <button
                            onClick={() => navigate('/create-event')}
                            className="create-button secondary"
                        >
                            ✨ Create New Event
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="event-page">
            <div className="event-header">
                <div className="event-title-section">
                    <h1>{event.title}</h1>
                    <p className="event-id">Event ID: {eventId}</p>
                    <div className="event-dates">
                        <p><strong>Start:</strong> {formatDate(event.startDate)}</p>
                        <p><strong>End:</strong> {formatDate(event.endDate)}</p>
                    </div>
                    {event.location && (
                        <p className="event-location"><strong>Location:</strong> {event.location}</p>
                    )}
                </div>

                {isEventCreator && (
                    <div className="creator-controls">
                        <button
                            className="admin-button primary"
                            onClick={() => setShowManagement(!showManagement)}
                        >
                            {showManagement ? 'Hide Management' : 'Manage Event'}
                        </button>
                    </div>
                )}
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
                                <button 
                                    className="admin-button danger"
                                    onClick={handleDeleteClick}
                                >
                                    Delete Event
                                </button>
                            </div>

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
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{event.description}</ReactMarkdown>
                    </div>
                </div>

                <div className="talk-rules">
                    <h2>Talk Rules</h2>
                    <div className="markdown-preview large">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{event.talkRules}</ReactMarkdown>
                    </div>
                </div>

                <div className="talk-schedule">
                    <h2>Talk Schedule</h2>
                    <div className="schedule-placeholder">
                        <p>Schedule will be displayed here once talks are submitted and approved.</p>
                    </div>
                </div>

                <div className="submit-talk-section">
                    <h2>Submit a Talk</h2>
                    <p className="participation-note">
                        ✨ No registration needed! Just fill out the form below to propose your talk.
                    </p>
                    <form className="talk-form">
                        <div className="form-group">
                            <label htmlFor="talkTitle">Talk Title</label>
                            <input
                                id="talkTitle"
                                type="text"
                                placeholder="Enter your talk title"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="talkDescription">Description</label>
                            <textarea
                                id="talkDescription"
                                placeholder="Describe your talk..."
                                rows={4}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="speakerName">Your Name</label>
                            <input
                                id="speakerName"
                                type="text"
                                placeholder="Enter your name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">Duration (minutes)</label>
                            <select id="duration" className="form-select">
                                <option value="5">5 minutes</option>
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="20">20 minutes</option>
                                <option value="30">30 minutes</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-button">
                            Submit Talk
                        </button>
                    </form>
                </div>
            </div>

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
    );
}

export default EventPage;