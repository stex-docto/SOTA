import { EventEntity, EventId, EventRepository, SvgContent } from '@/domain'
import { SignInUseCase } from '@/application'

export type UpdateEventCommand = { eventId: EventId } & Partial<{
    eventId: EventId
    title: string
    description: string
    talkRules: string
    startDate: Date
    endDate: Date
    location: string
    svgContent: string | null
}>

export interface UpdateEventResult {
    event: EventEntity
}

export class UpdateEventUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(command: UpdateEventCommand): Promise<UpdateEventResult> {
        // Get the existing event
        const existingEvent = await this.eventRepository.findById(command.eventId)
        if (!existingEvent) {
            throw new Error('Event not found')
        }

        const currentUser = await this.signInUseCase.requireCurrentUser()

        // Verify the user is the creator of the event
        if (existingEvent.createdBy.value !== currentUser.id.value) {
            throw new Error('Only the event creator can update this event')
        }

        // Validate and sanitize SVG content if provided
        let svgContent: SvgContent | null
        if (command.svgContent === undefined) {
            svgContent = existingEvent.svgContent
        } else {
            try {
                svgContent = command.svgContent ? SvgContent.from(command.svgContent) : null
            } catch (error) {
                throw new Error(
                    `Invalid SVG content: ${error instanceof Error ? error.message : 'Unknown error'}`
                )
            }
        }

        // Create updated event with new data but preserve original metadata
        const updatedEvent = new EventEntity(
            existingEvent.id,
            command.title ?? existingEvent.title,
            command.description ?? existingEvent.description,
            command.talkRules ?? existingEvent.talkRules,
            existingEvent.publicUrl, // Keep original public URL
            existingEvent.createdDate, // Keep original creation date
            command.startDate ?? existingEvent.startDate,
            command.endDate ?? existingEvent.endDate,
            command.location ?? existingEvent.location,
            existingEvent.status, // Keep original status
            existingEvent.createdBy, // Keep original creator
            existingEvent.rooms, // Keep existing rooms
            svgContent // Use validated SVG content
        )

        await this.eventRepository.save(updatedEvent)

        return {
            event: updatedEvent
        }
    }
}
