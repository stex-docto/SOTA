import {EventId, RoomId, TalkId, UserId} from '@/domain';

export type TalkStatus = 'pending' | 'approved' | 'rejected';

export interface Talk {
    id: TalkId;
    eventId: EventId;
    userId: UserId;
    name: string;
    pitch: string;
    proposedStartDateTime: Date;
    roomId: RoomId;
    status: TalkStatus;
    submissionDate: Date;
    approvedStartDateTime?: Date;
}

export class TalkEntity implements Talk {
    constructor(
        public readonly id: TalkId,
        public readonly eventId: EventId,
        public readonly userId: UserId,
        public readonly name: string,
        public readonly pitch: string,
        public readonly proposedStartDateTime: Date,
        public readonly roomId: RoomId,
        public readonly status: TalkStatus,
        public readonly submissionDate: Date,
        public readonly approvedStartDateTime?: Date
    ) {
    }

    static create(
        eventId: EventId,
        userId: UserId,
        name: string,
        pitch: string,
        proposedStartDateTime: Date,
        roomId: RoomId,
        id?: TalkId
    ): TalkEntity {
        return new TalkEntity(
            id || TalkId.generate(),
            eventId,
            userId,
            name,
            pitch,
            proposedStartDateTime,
            roomId,
            'pending',
            new Date()
        );
    }

    approve(approvedStartDateTime?: Date): TalkEntity {
        return new TalkEntity(
            this.id,
            this.eventId,
            this.userId,
            this.name,
            this.pitch,
            this.proposedStartDateTime,
            this.roomId,
            'approved',
            this.submissionDate,
            approvedStartDateTime || this.proposedStartDateTime
        );
    }

    reject(): TalkEntity {
        return new TalkEntity(
            this.id,
            this.eventId,
            this.userId,
            this.name,
            this.pitch,
            this.proposedStartDateTime,
            this.roomId,
            'rejected',
            this.submissionDate,
            this.approvedStartDateTime
        );
    }

    update(
        name?: string,
        pitch?: string,
        proposedStartDateTime?: Date,
        roomId?: RoomId
    ): TalkEntity {
        return new TalkEntity(
            this.id,
            this.eventId,
            this.userId,
            name ?? this.name,
            pitch ?? this.pitch,
            proposedStartDateTime ?? this.proposedStartDateTime,
            roomId ?? this.roomId,
            this.status,
            this.submissionDate,
            this.approvedStartDateTime
        );
    }

    isOwnedBy(userId: UserId): boolean {
        return this.userId.equals(userId);
    }
}