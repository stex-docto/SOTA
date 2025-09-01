import { EventEntity, EventRepository } from '@/domain'
import { SignInUseCase } from '@application'

export type UserEventType = 'created' | 'saved'

export interface UserEventItem {
    event: EventEntity
    type: UserEventType
}

export interface GetUserAllEventsResult {
    events: UserEventItem[]
}

export class GetUserAllEventsUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(): Promise<GetUserAllEventsResult> {
        // Check if user is authenticated
        const currentUser = await this.signInUseCase.requireCurrentUser()

        // Get created events
        const createdEvents = await this.eventRepository.findByCurrentUser()
        const createdEventItems: UserEventItem[] = createdEvents.map(event => ({
            event,
            type: 'created' as UserEventType
        }))

        // Get saved events
        const savedEventItems: UserEventItem[] = []
        for (const eventId of currentUser.savedEventIds.toArray()) {
            try {
                const event = await this.eventRepository.findById(eventId)
                if (event) {
                    // Don't duplicate events - if user created and saved the same event, only show as created
                    const alreadyIncluded = createdEventItems.some(item =>
                        item.event.id.equals(event.id)
                    )
                    if (!alreadyIncluded) {
                        savedEventItems.push({
                            event,
                            type: 'saved' as UserEventType
                        })
                    }
                }
            } catch (error) {
                console.warn(`Could not fetch saved event ${eventId.value}:`, error)
            }
        }

        // Combine and sort by event start date (upcoming events first)
        const allEvents = [...createdEventItems, ...savedEventItems]
        allEvents.sort((a, b) => a.event.startDate.getTime() - b.event.startDate.getTime())

        return {
            events: allEvents
        }
    }
}
