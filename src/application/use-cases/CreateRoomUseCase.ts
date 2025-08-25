import {RoomEntity, RoomRepository, UserRepository, EventRepository, EventId} from '@domain';

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
        private readonly roomRepository: RoomRepository,
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository
    ) {
    }

    async execute(command: CreateRoomCommand): Promise<CreateRoomResult> {
        // Verify user exists and is authenticated
        const user = await this.userRepository.getCurrentUser();
        if (!user) {
            throw new Error('User not found');
        }

        // Verify event exists and user is the creator
        const event = await this.eventRepository.findById(command.eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        if (!event.createdBy.equals(user.id)) {
            throw new Error('Only event creators can add rooms');
        }

        // Create new room
        const room = RoomEntity.create(
            command.eventId,
            command.name,
            command.description,
            user.id
        );

        // Save room
        await this.roomRepository.save(room);

        return {room};
    }
}