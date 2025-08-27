import { UserId } from '@/domain';

export interface Profile {
    id: UserId;
    displayName: string;
}

export class ProfileEntity implements Profile {
    constructor(
        public readonly id: UserId,
        public readonly displayName: string
    ) {}

    static create(displayName: string, id?: UserId): ProfileEntity {
        return new ProfileEntity(id || UserId.generate(), displayName);
    }

    updateDisplayName(displayName: string): ProfileEntity {
        return new ProfileEntity(this.id, displayName);
    }
}
