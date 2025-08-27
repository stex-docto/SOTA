import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDependencies } from '../hooks/useDependencies';
import { UserEventItem } from '@application';
import { useEffect, useState } from 'react';
import EventList from './EventList';

function UserDashboard() {
    const { currentUser } = useAuth();
    const { getUserAllEventsUseCase } = useDependencies();
    const [allEvents, setAllEvents] = useState<UserEventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        const fetchAllEvents = async () => {
            if (!currentUser) return;

            try {
                const result = await getUserAllEventsUseCase.execute();
                console.log(result.events);
                setAllEvents(result.events);
            } catch (error) {
                console.error('Failed to fetch user events:', error);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchAllEvents();
    }, [currentUser, getUserAllEventsUseCase]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="home-page">
            <div className="user-dashboard">
                <div className="dashboard-header">
                    <h2>Your Events</h2>
                    <Link to="/create-event" className="create-event-btn">
                        <span>+ Create Event</span>
                    </Link>
                </div>

                <div className="events-list">
                    {loadingEvents ? (
                        <div className="loading-message">
                            <p>Loading your events...</p>
                        </div>
                    ) : allEvents.length > 0 ? (
                        (() => {
                            const now = new Date();
                            const upcomingEvents = allEvents.filter(
                                eventItem => eventItem.event.endDate > now
                            );
                            const pastEvents = allEvents.filter(
                                eventItem => eventItem.event.endDate <= now
                            );

                            return (
                                <>
                                    {/* Upcoming Events */}
                                    <div className="events-section">
                                        <h3>Upcoming Events ({upcomingEvents.length})</h3>
                                        <EventList
                                            events={upcomingEvents}
                                            isPastEvent={false}
                                            emptyMessage="No upcoming events"
                                        />
                                    </div>

                                    {/* Past Events - Collapsible */}
                                    <div className="events-section">
                                        <details className="past-events-details">
                                            <summary>Past Events ({pastEvents.length})</summary>
                                            <EventList
                                                events={pastEvents}
                                                isPastEvent={true}
                                                emptyMessage="No past events"
                                            />
                                        </details>
                                    </div>

                                    {/* Empty State */}
                                    {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                                        <div className="empty-state">
                                            <h3>No events yet</h3>
                                            <p>
                                                Create your first event or save events from others
                                                to see them here.
                                            </p>
                                            <Link
                                                to="/create-event"
                                                className="create-event-btn primary"
                                            >
                                                Create Your First Event
                                            </Link>
                                        </div>
                                    )}
                                </>
                            );
                        })()
                    ) : (
                        <div className="empty-state">
                            <h3>No events yet</h3>
                            <p>
                                Create your first event or save events from others to see them here.
                            </p>
                            <Link to="/create-event" className="create-event-btn primary">
                                Create Your First Event
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
