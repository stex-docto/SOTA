import { UserRepository, EventId } from '@/domain'
import { SignInUseCase } from '@/application'

export interface SaveEventCommand {
    eventId: EventId
}

export interface SaveEventResult {
    success: boolean
    alreadySaved: boolean
}

export class SaveEventUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(command: SaveEventCommand): Promise<SaveEventResult> {
        // Require current user (will prompt sign-in if needed)
        const currentUser = await this.signInUseCase.requireCurrentUser()

        // Check if already saved
        if (currentUser.hasEventSaved(command.eventId)) {
            return {
                success: true,
                alreadySaved: true
            }
        }

        // Add event to saved events and save user
        const updatedUser = currentUser.addSavedEvent(command.eventId)
        await this.userRepository.saveUser(updatedUser)

        return {
            success: true,
            alreadySaved: false
        }
    }
}
