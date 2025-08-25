import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDependencies } from '../hooks/useDependencies';
import { UserEventItem } from '@application';
import moment from 'moment';

function CurrentEventsBar() {
    const { currentUser } = useAuth();
    const { getUserAllEventsUseCase } = useDependencies();
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
    }, [currentUser, getUserAllEventsUseCase]);

    useEffect(() => {
        if (!nextEvent) {
            setTimeToNext('');
            return;
        }

        const updateCountdown = () => {
            const eventMoment = moment(nextEvent.event.startDate);
            const now = moment();
            
            if (eventMoment.isSameOrBefore(now)) {
                setTimeToNext('Starting now!');
                return;
            }

            // Use moment's fromNow method but remove the "in " prefix since we add our own
            const timeUntil = eventMoment.fromNow().replace('in ', '');
            setTimeToNext(timeUntil);
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
                <div className="event-items">
                    {currentEvents.slice(0, 2).map((eventItem) => (
                        <Link
                            key={`${eventItem.event.id.value}-${eventItem.type}`}
                            to={`/event/${eventItem.event.id.value}`}
                            className="header-event-item live-event"
                        >                       <span className="live-indicator">🔴 Live</span>
                            <span className="event-title">{eventItem.event.title}</span>

                        </Link>
                    ))}
                    {currentEvents.length > 2 && (
                        <span className="more-events">+{currentEvents.length - 2}</span>
                    )}
                </div>
            )}

            {/* Next Event - show alongside live events or alone */}
            {nextEvent && timeToNext && (
                <>
                    {currentEvents.length > 0 && <span className="separator">•</span>}
                    <Link
                        to={`/event/${nextEvent.event.id.value}`}
                        className="header-event-item next-event"
                    >
                        <span className="countdown">⏰ in {timeToNext}</span>
                        <span className="event-title">{nextEvent.event.title}</span>
                    </Link>
                </>
            )}
        </div>
    );
}

export default CurrentEventsBar;