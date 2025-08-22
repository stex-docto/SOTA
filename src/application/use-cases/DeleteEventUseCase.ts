import {EventEntity, EventId, EventRepository, UserRepository} from '@/domain';

export interface DeleteEventCommand {
    eventId: string;
}

export interface DeleteEventResult {
    success: boolean;
}

export class DeleteEventUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: DeleteEventCommand): Promise<DeleteEventResult> {
        const eventId = new EventId(command.eventId);
        
        // Get the existing event
        const existingEvent = await this.eventRepository.findById(eventId);
        if (!existingEvent) {
            throw new Error('Event not found');
        }

        // Get current user to verify permissions
        const currentUser = await this.userRepository.getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be authenticated to delete an event');
        }

        // Verify the user is the creator of the event
        if (existingEvent.createdBy.value !== currentUser.id.value) {
            throw new Error('Only the event creator can delete this event');
        }

        // Delete the event
        await this.eventRepository.delete(eventId);

        return {
            success: true
        };
    }
}