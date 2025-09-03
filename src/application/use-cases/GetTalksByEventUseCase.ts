import { EventId, TalkEntity, TalkRepository } from '@/domain'

export interface GetTalksByEventQuery {
    eventId: EventId
}

export interface GetTalksByEventResult {
    talks: TalkEntity[]
}

export class GetTalksByEventUseCase {
    constructor(private readonly talkRepository: TalkRepository) {}

    async execute(query: GetTalksByEventQuery): Promise<GetTalksByEventResult> {
        const talks = await this.talkRepository.findByEventId(query.eventId)

        return {
            talks
        }
    }

    subscribe(
        query: GetTalksByEventQuery,
        callback: (result: GetTalksByEventResult) => void
    ): () => void {
        return this.talkRepository.subscribeByEventId(query.eventId, talks => {
            callback({ talks })
        })
    }
}
