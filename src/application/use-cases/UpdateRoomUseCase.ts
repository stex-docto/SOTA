import {RoomEntity, RoomRepository, UserRepository, EventRepository, RoomId} from '@domain';

export interface UpdateRoomCommand {
    roomId: RoomId;
    name?: string;
    description?: string;
}

export interface UpdateRoomResult {
    room: RoomEntity;
}

export class UpdateRoomUseCase {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository
    ) {
    }

    async execute(command: UpdateRoomCommand): Promise<UpdateRoomResult> {
        // Verify user exists and is authenticated
        const user = await this.userRepository.getCurrentUser();
        if (!user) {
            throw new Error('User not found');
        }

        // Verify room exists
        const room = await this.roomRepository.findById(command.roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        // Verify event exists and user is the creator
        const event = await this.eventRepository.findById(room.eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        if (!event.createdBy.equals(user.id)) {
            throw new Error('Only event creators can update rooms');
        }

        // Update room
        const updatedRoom = room.update(command.name, command.description);

        // Save updated room
        await this.roomRepository.save(updatedRoom);

        return {room: updatedRoom};
    }
}