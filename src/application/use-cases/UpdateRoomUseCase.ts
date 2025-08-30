import { EventRepository, RoomId, UserRepository, EventId } from '@domain'

export interface UpdateRoomCommand {
    eventId: EventId
    roomId: RoomId
    name: string
    description: string
}

export interface UpdateRoomResult {
    success: boolean
}

export class UpdateRoomUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: UpdateRoomCommand): Promise<UpdateRoomResult> {
        const currentUser = await this.userRepository.getCurrentUser()
        if (!currentUser) {
            throw new Error('User must be authenticated')
        }

        const event = await this.eventRepository.findById(command.eventId)
        if (!event) {
            throw new Error('Event not found')
        }

        if (!event.createdBy.equals(currentUser.id)) {
            throw new Error('Only event creator can update rooms')
        }

        if (!event.rooms.has(command.roomId)) {
            throw new Error('Room not found')
        }

        const currentRoom = event.rooms.find(command.roomId)!
        const updatedRoom = currentRoom.update(command.name, command.description)

        const updatedEvent = event.updateRoom(updatedRoom)
        await this.eventRepository.save(updatedEvent)

        return { success: true }
    }
}
