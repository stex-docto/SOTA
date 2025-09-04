import { UserEntity, UserRepository } from '@/domain'

export interface UpdateUserProfileCommand {
    displayName: string
}

export interface UpdateUserProfileResult {
    success: boolean
}

export class UpdateUserProfileUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(command: UpdateUserProfileCommand): Promise<UpdateUserProfileResult> {
        const currentUser = await this.userRepository.getCurrentUser()
        if (!currentUser) {
            throw new Error('User must be authenticated to update profile')
        }

        if (!command.displayName.trim()) {
            throw new Error('Display name cannot be empty')
        }

        const updatedUser = new UserEntity(
            currentUser.id,
            currentUser.savedEventIds,
            command.displayName.trim()
        )

        await this.userRepository.saveUser(updatedUser)

        return {
            success: true
        }
    }
}
