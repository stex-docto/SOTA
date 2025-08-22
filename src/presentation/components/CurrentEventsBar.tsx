import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDependencies } from '../hooks/useDependencies';
import { GetUserAllEventsUseCase, UserEventItem } from '@application';

function CurrentEventsBar() {
    const { currentUser } = useAuth();
    const { eventRepository, userRepository } = useDependencies();
    const [currentEvents, setCurrentEvents] = useState<UserEventItem[]>([]);
    const [nextEvent, setNextEvent] = useState<UserEventItem | null>(null);
    const [timeToNext, setTimeToNext] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!currentUser) {
                setCurrentEvents([]);
                setNextEvent(null);
                setLoading(false);
                return;
            }

            try {
                const getUserAllEventsUseCase = new GetUserAllEventsUseCase(eventRepository, userRepository);
                const result = await getUserAllEventsUseCase.execute();
                
                const now = new Date();
                
                // Get events that are currently happening (started but not ended)
                const current = result.events.filter(eventItem => 
                    eventItem.event.startDate <= now && eventItem.event.endDate > now
                );
                
                // Get next upcoming event
                const upcoming = result.events
                    .filter(eventItem => eventItem.event.startDate > now)
                    .sort((a, b) => a.event.startDate.getTime() - b.event.startDate.getTime());
                
                setCurrentEvents(current);
                setNextEvent(upcoming.length > 0 ? upcoming[0] : null);
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setCurrentEvents([]);
                setNextEvent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentUser, eventRepository, userRepository]);

    useEffect(() => {
        if (!nextEvent) {
            setTimeToNext('');
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const timeLeft = nextEvent.event.startDate.getTime() - now.getTime();
            
            if (timeLeft <= 0) {
                setTimeToNext('Starting now!');
                return;
            }

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeToNext(`${days}d ${hours}h`);
            } else if (hours > 0) {
                setTimeToNext(`${hours}h ${minutes}m`);
            } else {
                setTimeToNext(`${minutes}m`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [nextEvent]);

    if (!currentUser || loading) {
        return null;
    }

    return (
        <div className="header-events-info">
            {/* Live Events */}
            {currentEvents.length > 0 && (
                <>
                    <span className="live-indicator">🔴 Live:</span>
                    <div className="event-items">
                        {currentEvents.slice(0, 2).map((eventItem) => (
                            <Link
                                key={`${eventItem.event.id.value}-${eventItem.type}`}
                                to={`/event/${eventItem.event.id.value}`}
                                className="header-event-item live-event"
                            >
                                <span className="event-title">{eventItem.event.title}</span>
                                <span className="event-type-icon">
                                    {eventItem.type === 'created' ? '👤' : '❤️'}
                                </span>
                            </Link>
                        ))}
                        {currentEvents.length > 2 && (
                            <span className="more-events">+{currentEvents.length - 2}</span>
                        )}
                    </div>
                </>
            )}

            {/* Next Event - show alongside live events or alone */}
            {nextEvent && timeToNext && (
                <>
                    {currentEvents.length > 0 && <span className="separator">•</span>}
                    <span className="next-indicator">⏰ Next:</span>
                    <Link
                        to={`/event/${nextEvent.event.id.value}`}
                        className="header-event-item next-event"
                    >
                        <span className="event-title">{nextEvent.event.title}</span>
                        <span className="countdown">in {timeToNext}</span>
                    </Link>
                </>
            )}
        </div>
    );
}

export default CurrentEventsBar;