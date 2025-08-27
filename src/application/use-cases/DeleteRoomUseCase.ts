import { EventRepository, RoomId, UserRepository, EventId } from '@domain'

export interface DeleteRoomCommand {
    eventId: EventId
    roomId: RoomId
}

export interface DeleteRoomResult {
    success: boolean
}

export class DeleteRoomUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: DeleteRoomCommand): Promise<DeleteRoomResult> {
        const currentUser = await this.userRepository.getCurrentUser()
        if (!currentUser) {
            throw new Error('User must be authenticated')
        }

        const event = await this.eventRepository.findById(command.eventId)
        if (!event) {
            throw new Error('Event not found')
        }

        if (!event.createdBy.equals(currentUser.id)) {
            throw new Error('Only event creator can delete rooms')
        }

        if (!event.rooms.has(command.roomId)) {
            throw new Error('Room not found')
        }

        const updatedEvent = event.removeRoom(command.roomId)
        await this.eventRepository.save(updatedEvent)

        return { success: true }
    }
}
