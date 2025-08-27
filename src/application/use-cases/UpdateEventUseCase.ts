import { EventEntity, EventId, EventRepository, UserRepository } from '@/domain';

export interface UpdateEventCommand {
    eventId: EventId;
    title: string;
    description: string;
    talkRules: string;
    startDate: Date;
    endDate: Date;
    location: string;
}

export interface UpdateEventResult {
    event: EventEntity;
}

export class UpdateEventUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: UpdateEventCommand): Promise<UpdateEventResult> {
        // Get the existing event
        const existingEvent = await this.eventRepository.findById(command.eventId);
        if (!existingEvent) {
            throw new Error('Event not found');
        }

        // Get current user to verify permissions
        const currentUser = await this.userRepository.getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be authenticated to update an event');
        }

        // Verify the user is the creator of the event
        if (existingEvent.createdBy.value !== currentUser.id.value) {
            throw new Error('Only the event creator can update this event');
        }

        // Create updated event with new data but preserve original metadata
        const updatedEvent = new EventEntity(
            existingEvent.id,
            command.title,
            command.description,
            command.talkRules,
            existingEvent.publicUrl, // Keep original public URL
            existingEvent.createdDate, // Keep original creation date
            command.startDate,
            command.endDate,
            command.location,
            existingEvent.status, // Keep original status
            existingEvent.createdBy // Keep original creator
        );

        await this.eventRepository.save(updatedEvent);

        return {
            event: updatedEvent
        };
    }
}
