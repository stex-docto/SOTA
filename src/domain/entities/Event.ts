import { EventId, UserId } from '@/domain';

export interface Event {
    id: EventId;
    title: string;
    description: string;
    talkRules: string;
    publicUrl: string;
    createdDate: Date;
    startDate: Date;
    endDate: Date;
    location: string;
    status: 'active' | 'inactive';
    createdBy: UserId;
}

export class EventEntity implements Event {
    constructor(
        public readonly id: EventId,
        public readonly title: string,
        public readonly description: string,
        public readonly talkRules: string,
        public readonly publicUrl: string,
        public readonly createdDate: Date,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly location: string,
        public readonly status: 'active' | 'inactive',
        public readonly createdBy: UserId
    ) {}

    static create(
        title: string,
        description: string,
        talkRules: string,
        startDate: Date,
        endDate: Date,
        location: string,
        createdBy: UserId,
        id?: EventId
    ): EventEntity {
        const eventId = id || EventId.generate();
        const publicUrl = `#/event/${eventId.value}`;

        return new EventEntity(
            eventId,
            title,
            description,
            talkRules,
            publicUrl,
            new Date(),
            startDate,
            endDate,
            location,
            'active',
            createdBy
        );
    }
}
