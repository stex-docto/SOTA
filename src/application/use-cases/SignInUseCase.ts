import {
    Credential,
    CredentialRepository,
    SignInProvider,
    UserEntity,
    UserRepository
} from '@/domain'

export class SignInUseCase {
    private signInProvider: SignInProvider | null = null

    constructor(
        private readonly userRepository: UserRepository,
        private readonly credentialRepository: CredentialRepository
    ) {}

    registerSignInProvider(provider: SignInProvider) {
        if (this.signInProvider) {
            throw new Error('Sign InProvider already configured, only one must be registered.')
        }
        this.signInProvider = provider
    }

    unregisterSignInProvider() {
        this.signInProvider = null
    }

    async requireCurrentUser(): Promise<UserEntity> {
        // Check if user is already signed in
        const currentUser = await this.userRepository.getCurrentUser()
        if (currentUser) {
            return currentUser
        }

        // If not signed in, request sign-in
        if (!this.signInProvider) {
            console.error('No sign-in provider registered')
            throw new Error('No sign-in provider available')
        }

        const signInSuccessful = await this.signInProvider.request()
        if (!signInSuccessful) {
            throw new Error('Sign-in was cancelled or failed')
        }

        // Get the user after successful sign-in
        const user = await this.userRepository.getCurrentUser()
        if (!user) {
            throw new Error('Failed to get current user after sign-in')
        }

        return user
    }

    async signIn(): Promise<Credential> {
        const credential = this.credentialRepository.create()
        await this.userRepository.signIn(credential, true)
        return credential
    }

    async signinWithCredential(codes: string[]): Promise<Credential> {
        const credential = this.credentialRepository.set(codes)
        await this.userRepository.signIn(credential)
        return credential
    }

    async delete(): Promise<void> {
        const credential = this.credentialRepository.get()
        if (credential) {
            await this.userRepository.deleteCurrentUser(credential)
        }
        this.credentialRepository.delete()
    }

    async signOut(): Promise<void> {
        await this.userRepository.signOut()
        this.credentialRepository.delete()
    }

    getCurrentCredential(): Credential | null {
        return this.credentialRepository.get()
    }

    async getCurrentUser(): Promise<UserEntity | null> {
        return await this.userRepository.getCurrentUser()
    }

    subscribeToCurrentUser(callback: (user: UserEntity | null) => Promise<void>): () => void {
        return this.userRepository.subscribeToCurrentUser(callback)
    }
}
