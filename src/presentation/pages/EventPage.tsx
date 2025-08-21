import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {useAuth} from '../hooks/useAuth';
import {useDependencies} from '../hooks/useDependencies';
import {GetEventUseCase} from '@application';
import {EventEntity} from '@domain';

function EventPage() {
    const {eventId} = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {eventRepository} = useDependencies();
    const [event, setEvent] = useState<EventEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isEventCreator, setIsEventCreator] = useState(false);
    const [showManagement, setShowManagement] = useState(false);

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
                    <h2>Event not found</h2>
                    <p>{error || 'The event you are looking for does not exist.'}</p>
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
                                <button className="admin-button secondary">Edit Event Details</button>
                                <button className="admin-button primary">Generate Schedule</button>
                                <button className="admin-button danger">Delete Event</button>
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
                    <div className="event-description">
                        <ReactMarkdown>{event.description}</ReactMarkdown>
                    </div>
                </div>

                <div className="talk-rules">
                    <h2>Talk Rules</h2>
                    <div className="rules-content">
                        <ReactMarkdown>{event.talkRules}</ReactMarkdown>
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
        </div>
    );
}

export default EventPage;