import {EventId, EventRepository, RoomEntity, UserRepository} from '@domain';

export interface CreateRoomCommand {
    eventId: EventId;
    name: string;
    description: string;
}

export interface CreateRoomResult {
    room: RoomEntity;
}

export class CreateRoomUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: CreateRoomCommand): Promise<CreateRoomResult> {
        const currentUser = await this.userRepository.getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be authenticated');
        }

        const event = await this.eventRepository.findById(command.eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        if (!event.createdBy.equals(currentUser.id)) {
            throw new Error('Only event creator can create rooms');
        }

        const room = RoomEntity.create(
            command.name,
            command.description
        );

        const updatedEvent = event.addRoom(room);
        await this.eventRepository.save(updatedEvent);

        return { room };
    }
}