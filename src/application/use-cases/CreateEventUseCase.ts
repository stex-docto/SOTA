import { EventEntity, EventRepository, UserRepository } from '@domain';

export interface CreateEventCommand {
    title: string;
    description: string;
    talkRules: string;
    startDate: Date;
    endDate: Date;
    location: string;
}

export interface CreateEventResult {
    event: EventEntity;
}

export class CreateEventUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: CreateEventCommand): Promise<CreateEventResult> {
        // Verify user exists
        const user = await this.userRepository.getCurrentUser();
        if (!user) {
            throw new Error('User not found');
        }

        // Create new event
        const event = EventEntity.create(
            command.title,
            command.description,
            command.talkRules,
            command.startDate,
            command.endDate,
            command.location,
            user.id
        );

        // Save event
        await this.eventRepository.save(event);

        return { event };
    }
}
