import {Credential, PrivateUser, PublicUser, UserEntity, UserId, UserRepository} from '@domain';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User} from 'firebase/auth';
import {collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {FirebaseError} from 'firebase/app';

type FirebaseCredential = { email: string; password: string }

function mapCredential(credential: Credential): FirebaseCredential {
    return {
        email: `${credential.codes[0]}-${credential.codes[1]}@sota.example`,
        password: `${credential.codes[2]}${credential.codes[3]}`,
    }
}

type UserListener = (user: UserEntity | null) => Promise<void>;

export class FirebaseUserDatastore implements UserRepository {
    protected listeners = new Set<UserListener>()
    private currentUserUnsubscribe: (() => void) | null = null

    constructor(
        private readonly auth: Auth,
        private readonly firestore: Firestore
    ) {
        this.initListener();
    }

    protected get collection() {
        return collection(this.firestore, 'users')
    }

    async getCurrentUser(): Promise<UserEntity | null> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) return null;
        let user = await this.getUser(UserId.from(currentUser.uid))
        if (!user) {
            user = await this.saveUser(new UserEntity(UserId.from(currentUser.uid)))
        }
        return user;
    }

    async getUser(uid: UserId): Promise<UserEntity | null> {
        try {
            const userPublicData = (await getDoc(this.getPublicUserRef(uid))).data() as PublicUser;
            let userPrivateData: Partial<PrivateUser> = {}
            if (this.auth.currentUser?.uid === uid.value) {
                userPrivateData = (await getDoc(this.getPrivateUserRef(uid))).data() as PrivateUser;
            }
            return {
                id: uid,
                displayName: userPublicData.displayName,
                savedEventUrls: userPrivateData?.savedEventUrls || [],
            }
        } catch (_err) {
            return null;
        }
    }

    async saveUser(user: UserEntity): Promise<UserEntity> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('No authenticated user');
        if (currentUser.uid !== user.id.value) throw new Error('Can only save current user data');

        await setDoc(this.getPrivateUserRef(user.id), {id: currentUser.uid, savedEventUrls: user.savedEventUrls});
        await setDoc(this.getPublicUserRef(user.id), {id: currentUser.uid, displayName: user.displayName});

        return {
            id: user.id,
            displayName: user.displayName,
            savedEventUrls: user?.savedEventUrls || [],
        }
    }

    triggerListeners(user: UserEntity | null) {
        this.listeners.forEach((listener) => listener(user));
    }

    initListener() {
        this.auth.onAuthStateChanged((async (firebaseUser) => {
            this.triggerListeners(firebaseUser ? await this.getCurrentUser() : null);
            this.subscribeToUserDoc(firebaseUser)
        }))
    }

    subscribeToCurrentUser(callback: UserListener): () => void {
        this.listeners.add(callback)
        return () => this.listeners.delete(callback)
    }

    async deleteCurrentUser(credential: Credential): Promise<void> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('No authenticated user');

        // Recent sign-in is required for account deletion
        await this.signIn(credential)
        await deleteDoc(this.getPrivateUserRef(UserId.from(currentUser.uid)));
        await deleteDoc(this.getPublicUserRef(UserId.from(currentUser.uid)));
        this.auth.currentUser?.delete()
    }

    async signOut(): Promise<void> {
        await this.auth.signOut()
    }

    async signIn(credential: Credential, signUpIfNotExist: boolean = false): Promise<void> {
        const {email, password} = mapCredential(credential)
        try {
            await signInWithEmailAndPassword(this.auth, email, password)
        } catch (error) {
            if ((error as FirebaseError).code === 'auth/invalid-credential' && signUpIfNotExist) {
                await createUserWithEmailAndPassword(this.auth, email, password)
            } else {
                throw error
            }
        }
        console.log(`User ${this.auth.currentUser?.uid} connected`)
    }

    protected subscribeToUserDoc(user: User | null) {
        this.currentUserUnsubscribe?.()
        this.currentUserUnsubscribe = null
        if (user) {
            const publicUnsubScribe = onSnapshot(this.getPublicUserRef(UserId.from(user.uid)), async () => this.triggerListeners(await this.getCurrentUser()))
            const privateUnsubScribe = onSnapshot(this.getPrivateUserRef(UserId.from(user.uid)), async () => this.triggerListeners(await this.getCurrentUser()))
            this.currentUserUnsubscribe = () => {
                publicUnsubScribe()
                privateUnsubScribe()
            }
        }
    }

    private getPublicUserRef(uid: UserId) {
        return doc(this.collection, uid.value)
    }

    private getPrivateUserRef(uid: UserId) {
        return doc(this.collection, uid.value, "private", "user")
    }

}

