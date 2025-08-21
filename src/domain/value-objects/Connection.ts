export type ConnectionSuccess = {
    connected: true
    removeUser: () => Promise<void>
}
export type ConnectionFailure = {
    connected: false
    error: Error
    createUser: () => Promise<void>
}
export type ConnectionResult = ConnectionSuccess | ConnectionFailure
