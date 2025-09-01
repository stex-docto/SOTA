import { EventId, EventRepository } from '@/domain'
import { SignInUseCase } from '@application'

export interface DeleteEventCommand {
    eventId: EventId
}

export interface DeleteEventResult {
    success: boolean
}

export class DeleteEventUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(command: DeleteEventCommand): Promise<DeleteEventResult> {
        // Get the existing event
        const existingEvent = await this.eventRepository.findById(command.eventId)
        if (!existingEvent) {
            throw new Error('Event not found')
        }

        // Get current user to verify permissions
        const currentUser = await this.signInUseCase.requireCurrentUser()

        // Verify the user is the creator of the event
        if (existingEvent.createdBy.value !== currentUser.id.value) {
            throw new Error('Only the event creator can delete this event')
        }

        // Delete the event
        await this.eventRepository.delete(command.eventId)

        return {
            success: true
        }
    }
}
