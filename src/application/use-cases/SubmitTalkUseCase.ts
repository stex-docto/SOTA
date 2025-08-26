import {
    EventId,
    EventRepository,
    LocationId,
    TalkEntity,
    TalkRepository,
    UserId,
    UserRepository
} from '@domain';

export interface SubmitTalkCommand {
    eventId: EventId;
    createdBy: UserId;
    name: string;
    pitch: string;
    startDateTime: Date;
    expectedDurationMinutes: number;
    locationId: LocationId;
}

export interface SubmitTalkResult {
    talk: TalkEntity;
}

export class SubmitTalkUseCase {
    constructor(
        private readonly talkRepository: TalkRepository,
        private readonly eventRepository: EventRepository,
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
        const user = await this.userRepository.getUser(command.createdBy);
        if (!user) {
            throw new Error('User not found');
        }

        // Create talk
        const talk = TalkEntity.create(
            command.eventId,
            command.createdBy,
            command.name,
            command.pitch,
            command.startDateTime,
            command.expectedDurationMinutes,
            command.locationId
        );

        // Save talk
        await this.talkRepository.save(talk);

        return {talk};
    }
}