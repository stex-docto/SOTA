import { Link } from 'react-router-dom';
import { UserEventItem } from '@application';

interface EventListProps {
    events: UserEventItem[];
    isPastEvent?: boolean;
    emptyMessage: string;
}

function EventList({ events, isPastEvent = false, emptyMessage }: EventListProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (events.length === 0) {
        return <p className="no-events-message">{emptyMessage}</p>;
    }

    return (
        <div className="events-list-items">
            {events.map(eventItem => {
                const className = `event-list-item${isPastEvent ? ' past-event' : ''}`;

                return (
                    <Link
                        key={`${eventItem.event.id.value}-${eventItem.type}`}
                        to={`/event/${eventItem.event.id.value}`}
                        className={className}
                    >
                        <div className="event-content">
                            <h3 className="event-title">{eventItem.event.title}</h3>
                            <div className="event-dates">
                                <span>Start: {formatDate(eventItem.event.startDate)}</span>
                                <span>End: {formatDate(eventItem.event.endDate)}</span>
                            </div>
                            {eventItem.event.location && (
                                <p className="event-location">📍 {eventItem.event.location}</p>
                            )}
                        </div>
                        <div className="event-type">
                            {eventItem.type === 'created' ? '👤 Created' : '❤️ Saved'}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default EventList;
