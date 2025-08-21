export abstract class EntityId {
    constructor(public readonly value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('EntityId cannot be empty');
        }
    }

    protected static generateId(): string {
        return crypto.randomUUID();
    }

    protected static generateToken(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    equals(other: EntityId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}