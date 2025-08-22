import {UserRepository, EventId} from '@/domain';

export interface RemoveSavedEventCommand {
    eventId: EventId;
}

export interface RemoveSavedEventResult {
    success: boolean;
}

export class RemoveSavedEventUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(command: RemoveSavedEventCommand): Promise<RemoveSavedEventResult> {
        // Get current user
        const currentUser = await this.userRepository.getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be authenticated to remove saved events');
        }

        // Remove event from saved events and save user
        const updatedUser = currentUser.removeSavedEvent(command.eventId);
        await this.userRepository.saveUser(updatedUser);

        return {
            success: true
        };
    }
}