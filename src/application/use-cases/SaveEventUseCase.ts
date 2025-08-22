import {UserRepository, EventId} from '@/domain';

export interface SaveEventCommand {
    eventId: EventId;
}

export interface SaveEventResult {
    success: boolean;
    alreadySaved: boolean;
}

export class SaveEventUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(command: SaveEventCommand): Promise<SaveEventResult> {
        // Get current user
        const currentUser = await this.userRepository.getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be authenticated to save events');
        }

        // Check if already saved
        if (currentUser.hasEventSaved(command.eventId)) {
            return {
                success: true,
                alreadySaved: true
            };
        }

        // Add event to saved events and save user
        const updatedUser = currentUser.addSavedEvent(command.eventId);
        await this.userRepository.saveUser(updatedUser);

        return {
            success: true,
            alreadySaved: false
        };
    }
}