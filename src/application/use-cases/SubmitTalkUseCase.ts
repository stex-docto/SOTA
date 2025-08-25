import {
    EventId,
    EventRepository,
    RoomId,
    RoomRepository,
    TalkEntity,
    TalkRepository,
    UserId,
    UserRepository
} from '@domain';

export interface SubmitTalkCommand {
    eventId: EventId;
    userId: UserId;
    name: string;
    pitch: string;
    proposedStartDateTime: Date;
    roomId: RoomId;
}

export interface SubmitTalkResult {
    talk: TalkEntity;
}

export class SubmitTalkUseCase {
    constructor(
        private readonly talkRepository: TalkRepository,
        private readonly eventRepository: EventRepository,
        private readonly roomRepository: RoomRepository,
        private readonly userRepository: UserRepository
    ) {
    }

    async execute(command: SubmitTalkCommand): Promise<SubmitTalkResult> {
        // Verify event exists
        const event = await this.eventRepository.findById(command.eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        // Verify user exists
        const user = await this.userRepository.getUser(command.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify room exists and belongs to event
        const room = await this.roomRepository.findById(command.roomId);
        if (!room || !room.eventId.equals(command.eventId)) {
            throw new Error('Room not found or does not belong to this event');
        }

        // Create talk proposal
        const talk = TalkEntity.create(
            command.eventId,
            command.userId,
            command.name,
            command.pitch,
            command.proposedStartDateTime,
            command.roomId
        );

        // Save talk
        await this.talkRepository.save(talk);

        return {talk};
    }
}