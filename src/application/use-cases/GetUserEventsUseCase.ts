import {EventEntity, EventRepository, UserRepository} from '@/domain';

export interface GetUserEventsResult {
    events: EventEntity[];
}

export class GetUserEventsUseCase {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(): Promise<GetUserEventsResult> {
        // Check if user is authenticated
        const currentUser = await this.userRepository.getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be authenticated to view their events');
        }

        // Get events created by current user (Firebase rules will filter automatically)
        const events = await this.eventRepository.findByCurrentUser();

        return {
            events
        };
    }
}