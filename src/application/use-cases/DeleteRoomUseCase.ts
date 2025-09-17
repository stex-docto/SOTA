import { EventId, EventRepository, RoomId } from '@domain'
import { SignInUseCase } from '@/application'

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
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(command: DeleteRoomCommand): Promise<DeleteRoomResult> {
        const user = await this.signInUseCase.requireCurrentUser()

        const event = await this.eventRepository.findById(command.eventId)
        if (!event) {
            throw new Error('Event not found')
        }

        if (!event.createdBy.equals(user.id)) {
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
