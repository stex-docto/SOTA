import { TalkRepository, TalkEntity, TalkId, RoomId } from '@/domain'
import { SignInUseCase } from '@application'

export interface TalkUpdateData {
    talkId: TalkId
    name?: string
    pitch?: string
    startDateTime?: Date
    expectedDurationMinutes?: number
    roomId?: RoomId
}

export class UpdateTalkUseCase {
    constructor(
        private readonly talkRepository: TalkRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(data: TalkUpdateData): Promise<TalkEntity> {
        const currentUser = await this.signInUseCase.requireCurrentUser()

        // Get the existing talk
        const existingTalk = await this.talkRepository.findById(data.talkId)
        if (!existingTalk) {
            throw new Error('Talk not found')
        }

        // Check if the current user is the owner of the talk
        if (!existingTalk.isOwnedBy(currentUser.id)) {
            throw new Error('You can only edit your own talks')
        }

        // Update the talk with new data
        const updatedTalk = existingTalk.update(
            data.name,
            data.pitch,
            data.startDateTime,
            data.expectedDurationMinutes,
            data.roomId
        )

        // Save the updated talk
        await this.talkRepository.save(updatedTalk)
        return updatedTalk
    }
}
