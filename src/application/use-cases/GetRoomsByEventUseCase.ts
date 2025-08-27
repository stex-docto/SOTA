import { EventId, EventRepository, RoomEntity } from '@domain'

export interface GetRoomsByEventCommand {
    eventId: EventId
}

export interface GetRoomsByEventResult {
    rooms: RoomEntity[]
}

export class GetRoomsByEventUseCase {
    constructor(private readonly eventRepository: EventRepository) {}

    async execute(command: GetRoomsByEventCommand): Promise<GetRoomsByEventResult> {
        const event = await this.eventRepository.findById(command.eventId)
        if (!event) {
            throw new Error('Event not found')
        }

        const rooms = event.getRooms()
        return { rooms }
    }
}
