import {EventId, UserId} from '@/domain';

export interface Event {
    id: EventId;
    name: string;
    publicUrl: string;
    createdDate: Date;
    eventDates: Date[];
    status: 'active' | 'inactive';
    createdBy: UserId;
}

export class EventEntity implements Event {
    constructor(
        public readonly id: EventId,
        public readonly name: string,
        public readonly publicUrl: string,
        public readonly createdDate: Date,
        public readonly eventDates: Date[],
        public readonly status: 'active' | 'inactive',
        public readonly createdBy: UserId
    ) {
    }

    static create(
        name: string,
        createdBy: UserId,
        id?: EventId
    ): EventEntity {
        const eventId = id || EventId.generate();
        const publicUrl = `/event/${eventId.value}`;

        return new EventEntity(
            eventId,
            name,
            publicUrl,
            new Date(),
            [],
            'active',
            createdBy
        );
    }
}