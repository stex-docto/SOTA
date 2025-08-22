import {Link} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {useDependencies} from '../hooks/useDependencies';
import {GetUserEventsUseCase} from '@application';
import {EventEntity} from '@domain';
import {useEffect, useState} from 'react';

function UserDashboard() {
    const {currentUser} = useAuth();
    const {eventRepository, userRepository} = useDependencies();
    const [userEvents, setUserEvents] = useState<EventEntity[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        const fetchUserEvents = async () => {
            if (!currentUser) return;

            try {
                const getUserEventsUseCase = new GetUserEventsUseCase(eventRepository, userRepository);
                const result = await getUserEventsUseCase.execute();
                setUserEvents(result.events);
            } catch (error) {
                console.error('Failed to fetch user events:', error);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchUserEvents();
    }, [currentUser, eventRepository, userRepository]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="home-page">
            <div className="user-dashboard">
                <h2>Your Dashboard</h2>

                <div className="dashboard-actions">
                    <div className="action-card">
                        <h3>Your Events ({userEvents.length})</h3>
                        <p>Manage events you've created</p>
                        {loadingEvents ? (
                            <p>Loading your events...</p>
                        ) : userEvents.length > 0 ? (
                            <div className="saved-events-list">
                                {userEvents.slice(0, 3).map((event, index) => (
                                    <div key={index} className="saved-event-item">
                                        <Link to={`/event/${event.id.value}`}>
                                            {event.title.length > 30 ? `${event.title.substring(0, 30)}...` : event.title}
                                        </Link>
                                    </div>
                                ))}
                                {userEvents.length > 3 && (
                                    <p className="more-events">+{userEvents.length - 3} more events</p>
                                )}
                            </div>
                        ) : (
                            <p>No events created yet.</p>
                        )}
                    </div>

                    <div className="action-card">
                        <h3>Saved Events ({currentUser.savedEventIds.size})</h3>
                        <p>Access your saved events</p>
                        {currentUser.savedEventIds.size > 0 && (
                            <div className="saved-events-list">
                                {currentUser.savedEventIds.toArray().slice(0, 3).map((eventId, index) => (
                                    <div key={index} className="saved-event-item">
                                        <Link to={`/event/${eventId.value}`}>
                                            Event: {eventId.value.length > 20 ? `${eventId.value.substring(0, 20)}...` : eventId.value}
                                        </Link>
                                    </div>
                                ))}
                                {currentUser.savedEventIds.size > 3 && (
                                    <p className="more-events">+{currentUser.savedEventIds.size - 3} more
                                        events</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;