import {EventEntity, EventRepository, UserEntity, UserId, UserRepository} from '@domain';

export interface CreateEventCommand {
    name: string;
    createdBy: UserId;
}

export interface CreateEventResult {
    event: EventEntity;
}

export class CreateEventUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {
    }

    async execute(command: CreateEventCommand): Promise<CreateEventResult> {
        // Verify user exists
        const user = await this.userRepository.getUser(command.createdBy);
        if (!user) {
            throw new Error('User not found');
        }

        // Create new event
        const event = EventEntity.create(command.name, command.createdBy);

        // Save event
        await this.eventRepository.save(event);

        // Save event URL to user's saved events
        const updatedUser = new UserEntity(user.id, [...user.savedEventUrls, event.publicUrl], user.displayName);
        await this.userRepository.saveUser(updatedUser);

        return {event};
    }
}