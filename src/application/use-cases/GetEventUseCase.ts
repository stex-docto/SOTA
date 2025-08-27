import { EventEntity, EventId, EventRepository } from '@/domain'

export interface GetEventQuery {
    eventId: EventId
}

export interface GetEventResult {
    event: EventEntity | null
}

export class GetEventUseCase {
    constructor(private readonly eventRepository: EventRepository) {}

    async execute(query: GetEventQuery): Promise<GetEventResult> {
        const event = await this.eventRepository.findById(query.eventId)

        return {
            event
        }
    }

    subscribe(query: GetEventQuery, callback: (result: GetEventResult) => void): () => void {
        return this.eventRepository.subscribe(query.eventId, event => {
            callback({ event })
        })
    }
}
