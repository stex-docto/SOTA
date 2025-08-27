export type SignInPromise = Promise<boolean>

export type SignInProvider = {
    request(): SignInPromise
}
