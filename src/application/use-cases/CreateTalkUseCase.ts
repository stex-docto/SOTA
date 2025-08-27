import { TalkRepository, TalkEntity, EventId, RoomId } from '@/domain'
import { SignInUseCase } from '@application'

export interface TalkCreationData {
    eventId: EventId
    name: string
    pitch: string
    startDateTime: Date
    expectedDurationMinutes: number
    roomId: RoomId
}

export class CreateTalkUseCase {
    constructor(
        private readonly talkRepository: TalkRepository,
        private readonly signInUseCase: SignInUseCase
    ) {}

    async execute(data: TalkCreationData): Promise<TalkEntity> {
        const currentUser = await this.signInUseCase.requireCurrentUser()

        const talk = TalkEntity.create(
            data.eventId,
            currentUser.id,
            data.name,
            data.pitch,
            data.startDateTime,
            data.expectedDurationMinutes,
            data.roomId
        )

        await this.talkRepository.save(talk)
        return talk
    }
}
