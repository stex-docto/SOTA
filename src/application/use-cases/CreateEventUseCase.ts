import { EventEntity, EventRepository } from '@domain'
import { SignInUseCase } from '@/application'

export interface CreateEventCommand {
    title: string
    description: string
    startDate: Date
    endDate: Date
    location: string
}

export interface CreateEventResult {
    event: EventEntity
}

export class CreateEventUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(command: CreateEventCommand): Promise<CreateEventResult> {
        const user = await this.signInUseCase.requireCurrentUser()

        // Create new event
        const event = EventEntity.create(
            command.title,
            command.description,
            command.startDate,
            command.endDate,
            command.location,
            user.id
        )

        // Save event
        await this.eventRepository.save(event)

        return { event }
    }
}
