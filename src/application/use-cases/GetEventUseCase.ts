import {EventEntity, EventId, EventRepository} from '@/domain';

export interface GetEventQuery {
    eventId: string;
}

export interface GetEventResult {
    event: EventEntity | null;
}

export class GetEventUseCase {
    constructor(private readonly eventRepository: EventRepository) {}

    async execute(query: GetEventQuery): Promise<GetEventResult> {
        const eventId = new EventId(query.eventId);
        const event = await this.eventRepository.findById(eventId);
        
        return {
            event
        };
    }

    subscribe(query: GetEventQuery, callback: (result: GetEventResult) => void): () => void {
        const eventId = new EventId(query.eventId);
        
        return this.eventRepository.subscribe(eventId, (event) => {
            callback({ event });
        });
    }
}