export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AuthenticationError'
    }

    static signInRequired(): AuthenticationError {
        return new AuthenticationError('You must be signed in to edit events')
    }
}

export class PermissionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PermissionError'
    }

    static onlyCreatorCanEdit(): PermissionError {
        return new PermissionError('Only the event creator can edit this event')
    }
}

export class EventNotFoundError extends Error {
    constructor(message: string = 'The event you are trying to edit does not exist') {
        super(message)
        this.name = 'EventNotFoundError'
    }
}
