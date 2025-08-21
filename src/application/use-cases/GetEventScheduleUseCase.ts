import {
    EventEntity,
    EventId,
    EventRepository,
    LocationEntity,
    LocationRepository,
    TalkEntity,
    TalkRepository
} from '@domain';

export interface GetEventScheduleQuery {
    eventId: EventId;
    includeAll?: boolean; // If false, only approved talks
}

export interface ScheduleItem {
    talk: TalkEntity;
    location: LocationEntity;
}

export interface GetEventScheduleResult {
    event: EventEntity;
    schedule: ScheduleItem[];
}

export class GetEventScheduleUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly talkRepository: TalkRepository,
        private readonly locationRepository: LocationRepository
    ) {
    }

    async execute(query: GetEventScheduleQuery): Promise<GetEventScheduleResult> {
        // Get event
        const event = await this.eventRepository.findById(query.eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        // Get talks (all or only approved)
        const talks = query.includeAll
            ? await this.talkRepository.findByEventId(query.eventId)
            : await this.talkRepository.findByEventIdAndStatus(query.eventId, 'approved');

        // Get locations for the event
        const locations = await this.locationRepository.findByEventId(query.eventId);
        const locationMap = new Map(locations.map(loc => [loc.id.value, loc]));

        // Build schedule with location info
        const schedule: ScheduleItem[] = talks
            .map(talk => {
                const location = locationMap.get(talk.locationId.value);
                if (!location) {
                    return null;
                }
                return {talk, location};
            })
            .filter((item): item is ScheduleItem => item !== null)
            .sort((a, b) => {
                const dateA = a.talk.approvedStartDateTime || a.talk.proposedStartDateTime;
                const dateB = b.talk.approvedStartDateTime || b.talk.proposedStartDateTime;
                return dateA.getTime() - dateB.getTime();
            });

        return {event, schedule};
    }
}