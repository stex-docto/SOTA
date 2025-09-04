import { EventId, UserRepository } from '@/domain'
import { SignInUseCase } from '@application'

export interface RemoveSavedEventCommand {
    eventId: EventId
}

export interface RemoveSavedEventResult {
    success: boolean
}

export class RemoveSavedEventUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(command: RemoveSavedEventCommand): Promise<RemoveSavedEventResult> {
        // Get current user
        const currentUser = await this.signInUseCase.requireCurrentUser()

        // Remove event from saved events and save user
        const updatedUser = currentUser.removeSavedEvent(command.eventId)
        await this.userRepository.saveUser(updatedUser)

        return {
            success: true
        }
    }
}
